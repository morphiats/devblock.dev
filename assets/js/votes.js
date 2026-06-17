async function initVotes() {
  if (!window.currentUser || !window.supabaseClient) return
  const { data: userVotes } = await window.supabaseClient
    .from('votes').select('post_id, vote_type').eq('user_id', window.currentUser.id)
  if (userVotes) {
    userVotes.forEach(v => {
      const upBtn = document.querySelector('[data-post-id="' + v.post_id + '"] .vote-up')
      const downBtn = document.querySelector('[data-post-id="' + v.post_id + '"] .vote-down')
      if (v.vote_type === 1 && upBtn) upBtn.style.color = 'var(--accent)'
      if (v.vote_type === -1 && downBtn) downBtn.style.color = '#A32D2D'
    })
  }
}

window.vote = async function(postId, voteType, el) {
  if (!window.currentUser) { window.location.href = '/pages/auth.html'; return }
  const countEl = document.getElementById('votes-' + postId)
  const current = parseInt(countEl?.textContent || 0)
  const { data: existing } = await window.supabaseClient
    .from('votes').select('*').eq('post_id', postId).eq('user_id', window.currentUser.id).single()
  if (existing) {
    if (existing.vote_type === voteType) {
      await window.supabaseClient.from('votes').delete().eq('id', existing.id)
      await window.supabaseClient.from('posts').update({ votes: current - voteType }).eq('id', postId)
      if (countEl) countEl.textContent = current - voteType
      el.style.color = ''
    } else {
      await window.supabaseClient.from('votes').update({ vote_type: voteType }).eq('id', existing.id)
      await window.supabaseClient.from('posts').update({ votes: current + (voteType * 2) }).eq('id', postId)
      if (countEl) countEl.textContent = current + (voteType * 2)
      el.closest('.vote-col').querySelectorAll('button').forEach(b => b.style.color = '')
      el.style.color = voteType === 1 ? 'var(--accent)' : '#A32D2D'
    }
  } else {
    await window.supabaseClient.from('votes').insert({ post_id: postId, user_id: window.currentUser.id, vote_type: voteType })
    await window.supabaseClient.from('posts').update({ votes: current + voteType }).eq('id', postId)
    if (countEl) countEl.textContent = current + voteType
    el.style.color = voteType === 1 ? 'var(--accent)' : '#A32D2D'
  }
}

window.addEventListener('DOMContentLoaded', () => setTimeout(initVotes, 1200))
