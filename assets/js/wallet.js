window.connectWallet = async function() {
  if (typeof window.ethereum === 'undefined') {
    alert('MetaMask not found. Please install MetaMask to connect your wallet.\n\nhttps://metamask.io')
    return
  }
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const address = accounts[0]
    const short = address.slice(0,6) + '...' + address.slice(-4)

    // Update all connect wallet buttons
    document.querySelectorAll('.btn-primary').forEach(btn => {
      if (btn.textContent.includes('Connect Wallet') || btn.textContent.includes('Connect')) {
        btn.innerHTML = '<i class="ti ti-wallet"></i> ' + short
        btn.style.background = '#0F6E56'
      }
    })

    // Save to localStorage
    localStorage.setItem('devblock-wallet', address)

    // Update user profile with wallet if logged in
    if (window.currentUser && window.supabaseClient) {
      await window.supabaseClient.from('users').update({ wallet_address: address }).eq('id', window.currentUser.id)
    }

    console.log('Wallet connected:', address)
  } catch(e) {
    if (e.code === 4001) {
      alert('Wallet connection cancelled.')
    } else {
      alert('Error connecting wallet: ' + e.message)
    }
  }
}

// Auto-reconnect if previously connected
window.addEventListener('DOMContentLoaded', async function() {
  const saved = localStorage.getItem('devblock-wallet')
  if (saved && typeof window.ethereum !== 'undefined') {
    const short = saved.slice(0,6) + '...' + saved.slice(-4)
    setTimeout(() => {
      document.querySelectorAll('.btn-primary').forEach(btn => {
        if (btn.textContent.includes('Connect Wallet') || btn.textContent.includes('Connect')) {
          btn.innerHTML = '<i class="ti ti-wallet"></i> ' + short
          btn.style.background = '#0F6E56'
        }
      })
    }, 1000)
  }
})
