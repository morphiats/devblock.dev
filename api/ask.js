export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const { question } = req.body
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.GROQ_KEY
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        max_tokens: 500,
        messages: [
          { role: 'system', content: 'You are the DevBlock AI — a senior web3 developer assistant. Answer questions about smart contracts, Solidity, ZK proofs, DeFi, L2s, SUI, NEAR, Cardano, and blockchain development. Be concise and practical. Max 4 sentences.' },
          { role: 'user', content: question }
        ]
      })
    })
    const data = await response.json()
    res.json({ answer: data.choices?.[0]?.message?.content || 'No answer.' })
  } catch(e) {
    res.status(500).json({ error: e.message })
  }
}
