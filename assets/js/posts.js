async function loadPosts(chain, tag) {
  if (!window.supabaseClient) return
  const { data: posts } = await window.supabaseClient
    .from('posts')
    .select('*, users(username, display_name)')
    .order("votes", { ascending: false })
    .limit(20)

  const feed = document.getElementById('postFeed')
  if (!feed) return

  if (!posts || posts.length === 0) {
    feed.innerHTML = `<div class="widget-card" style="text-align:center;padding:40px;">
      <div style="font-size:32px;margin-bottom:12px;">🏗️</div>
      <div style="font-size:15px;font-weight:600;margin-bottom:6px;">No posts yet</div>
      <div style="font-size:13px;color:var(--text2);">Be the first to post on DevBlock!</div>
    </div>`
    return
  }

  feed.innerHTML = posts.map(post => `
    <div class="post-card" data-post-id="${post.id}" style="flex-direction:column;gap:0;">
      <div style="display:flex;gap:14px;">
        <div class="vote-col">
          <button class="vote-btn vote-up" onclick="vote('${post.id}', 1, this)"><i class="ti ti-chevron-up"></i></button>
          <div class="vote-count" id="votes-${post.id}">${post.votes||0}</div>
          <button class="vote-btn vote-down" onclick="vote('${post.id}', -1, this)"><i class="ti ti-chevron-down"></i></button>
        </div>
        <div class="post-body">
          <div class="post-title">${post.title}</div>
          <div class="post-excerpt">${post.excerpt||''}</div>
          <div class="post-meta">
            ${(post.tags||[]).map(t=>`<span class="tag tag-solidity">${t}</span>`).join('')}
            <div class="author-row">
              <div class="avatar sm" style="background:#1D9E75;">${(post.users?.username||'an').slice(0,2).toUpperCase()}</div>
              ${post.users?.username||'anon'} · ${timeAgo(post.created_at)}
            </div>
            <div class="post-info">
              <span onclick="toggleComments('${post.id}')" style="cursor:pointer;"><i class="ti ti-message"></i> ${post.comments_count||0}</span>
              <span><i class="ti ti-eye"></i> ${post.views||0}</span>
            </div>
          </div>
        </div>
      </div>
      <div id="comment-section-${post.id}" style="display:none;padding:12px 0 0 42px;border-top:1px solid var(--border);margin-top:12px;">
        <div id="comments-${post.id}"></div>
        <div style="display:flex;gap:8px;margin-top:10px;">
          <input id="comment-input-${post.id}" placeholder="Write a comment..." style="flex:1;background:var(--bg3);border:1px solid var(--border);border-radius:8px;padding:8px 12px;color:var(--text);font-size:13px;font-family:inherit;outline:none;" onkeydown="if(event.key==='Enter') addComment('${post.id}')"/>
          <button class="btn btn-primary" onclick="addComment('${post.id}')" style="font-size:12px;padding:6px 12px;">Send</button>
        </div>
      </div>
    </div>`).join('')

  setTimeout(initVotes, 300)
}

window.toggleComments = function(postId) {
  const section = document.getElementById('comment-section-' + postId)
  if (!section) return
  const isOpen = section.style.display !== 'none'
  section.style.display = isOpen ? 'none' : 'block'
  if (!isOpen) loadComments(postId)
}

window.openPostModal = function() {
  const modal = document.getElementById('postModal')
  if (modal) modal.style.display = 'flex'
}

window.closePostModal = function() {
  const modal = document.getElementById('postModal')
  if (modal) modal.style.display = 'none'
}

window.createPost = async function() {
  if (!window.currentUser) { window.location.href = '/pages/auth.html'; return }
  const title = document.getElementById('postTitle').value.trim()
  const excerpt = document.getElementById('postExcerpt').value.trim()
  const tags = document.getElementById('postTags').value.split(',').map(t=>t.trim()).filter(Boolean)
  if (!title) return
  const { error } = await window.supabaseClient.from('posts').insert({
    user_id: window.currentUser.id, title, excerpt, tags, votes: 0, views: 0, comments_count: 0
  })
  if (!error) { closePostModal(); loadPosts() }
  else alert('Error: ' + error.message)
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date)
  const mins = Math.floor(diff/60000)
  if (mins < 60) return mins+'m ago'
  const hrs = Math.floor(mins/60)
  if (hrs < 24) return hrs+'h ago'
  return Math.floor(hrs/24)+'d ago'
}

const chainFilter = new URLSearchParams(window.location.search).get("chain"); window.addEventListener("DOMContentLoaded", () => setTimeout(() => loadPosts(chainFilter), 1000))
