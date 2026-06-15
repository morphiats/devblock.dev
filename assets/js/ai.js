async function askAI() {
  const q = document.getElementById('aiQ')?.value.trim();
  if (!q) return;
  const loading = document.getElementById('aiLoading');
  const answer = document.getElementById('aiAnswer');
  loading.style.display = 'block';
  answer.style.display = 'none';
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: 'You are the DevBlock AI — a senior web3 developer assistant for the DevBlock community. Answer questions about smart contracts, Solidity, ZK proofs, DeFi, L2s, SUI, NEAR, Cardano, account abstraction, and blockchain development. Be concise, technical, and practical. Max 3-4 sentences.',
        messages: [{ role: 'user', content: q }]
      })
    });
    const data = await res.json();
    const text = data.content?.find(b => b.type === 'text')?.text || 'No answer returned.';
    answer.textContent = text;
    answer.style.display = 'block';
  } catch(e) {
    answer.textContent = 'Something went wrong. Please try again.';
    answer.style.display = 'block';
  }
  loading.style.display = 'none';
}

// Allow Enter key to submit
document.getElementById('aiQ')?.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); askAI(); }
});
