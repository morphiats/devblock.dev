window.askAI = async function() {
  const q = document.getElementById('aiQ')?.value.trim()
  if (!q) return
  const loading = document.getElementById('aiLoading')
  const answer = document.getElementById('aiAnswer')
  if (loading) loading.style.display = 'block'
  if (answer) answer.style.display = 'none'
  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: q })
    })
    const data = await res.json()
    if (answer) { answer.textContent = data.answer; answer.style.display = 'block' }
  } catch(e) {
    if (answer) { answer.textContent = 'Something went wrong.'; answer.style.display = 'block' }
  }
  if (loading) loading.style.display = 'none'
}

window.sendChat = async function() {
  const input = document.getElementById('chatInput')
  const wrap = document.getElementById('chatWrap')
  if (!input || !wrap) return
  const msg = input.value.trim()
  if (!msg) return
  input.value = ''
  wrap.innerHTML += `<div class="chat-msg user"><div class="avatar sm" style="background:#534AB7;">me</div><div class="chat-bubble">${msg}</div></div>`
  wrap.innerHTML += `<div class="chat-msg ai" id="typing"><div class="avatar sm" style="background:#1D9E75;">AI</div><div class="chat-bubble" style="color:var(--text3);">Thinking...</div></div>`
  wrap.scrollTop = wrap.scrollHeight
  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: msg })
    })
    const data = await res.json()
    const typing = document.getElementById('typing')
    if (typing) typing.outerHTML = `<div class="chat-msg ai"><div class="avatar sm" style="background:#1D9E75;">AI</div><div class="chat-bubble">${data.answer}</div></div>`
  } catch(e) {
    const typing = document.getElementById('typing')
    if (typing) typing.outerHTML = `<div class="chat-msg ai"><div class="avatar sm" style="background:#1D9E75;">AI</div><div class="chat-bubble">Something went wrong.</div></div>`
  }
  wrap.scrollTop = wrap.scrollHeight
}

document.getElementById('aiQ')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askAI() }
})
