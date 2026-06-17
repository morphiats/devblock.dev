window.loadComments = async function(postId) {
  const el = document.getElementById('comments-' + postId)
  if (!el) return

  const { data: comments } = await window.supabaseClient
    .from('comments')
    .select('*, users(username)')
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  if (!comments || comments.length === 0) {
    el.innerHTML = '<div style="font-size:12px;color:var(--text3);padding:8px 0;">No comments yet. Be first!</div>'
    return
  }

  el.innerHTML = comments.map(c => `
    <div style="display:flex;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);">
      <div class="avatar sm" style="background:#534AB7;">${(c.users?.username||'an').slice(0,2).toUpperCase()}</div>
      <div>
        <div style="font-size:12px;font-weight:600;margin-bottom:2px;">${c.users?.username||'anon'} <span style="font-weight:400;color:var(--text3);">· ${timeAgo(c.created_at)}</span></div>
        <div style="font-size:13px;color:var(--text2);">${c.content}</div>
      </div>
    </div>`).join('')
}

window.addComment = async function(postId) {
  if (!window.currentUser) { window.location.href = '/pages/auth.html'; return }
  const input = document.getElementById('comment-input-' + postId)
  const content = input?.value.trim()
  if (!content) return
  input.value = ''

  const { error } = await window.supabaseClient.from('comments').insert({
    post_id: postId,
    user_id: window.currentUser.id,
    content
  })

  if (!error) {
    await window.supabaseClient.from('posts').update({ comments_count: (await window.supabaseClient.from('comments').select('*', {count:'exact',head:true}).eq('post_id', postId)).count }).eq('id', postId)
    loadComments(postId)
  }
}

function timeAgo(date) {
  const diff = Date.now() - new Date(date)
  const mins = Math.floor(diff/60000)
  if (mins < 60) return mins+'m ago'
  const hrs = Math.floor(mins/60)
  if (hrs < 24) return hrs+'h ago'
  return Math.floor(hrs/24)+'d ago'
}
