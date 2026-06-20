window.connectWallet = async function() {
  // Mobile + no MetaMask extension → deep link into MetaMask mobile app's browser
  if (typeof window.ethereum === 'undefined') {
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    if (isMobile) {
      const dappUrl = window.location.href.replace(/^https?:\/\//, '')
      window.location.href = 'https://metamask.app.link/dapp/' + dappUrl
      return
    }
    alert('MetaMask not found. Please install MetaMask to connect your wallet.\n\nhttps://metamask.io')
    return
  }
  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const address = accounts[0]
    const short = address.slice(0,6) + '...' + address.slice(-4)

    document.querySelectorAll('.btn-primary').forEach(btn => {
      if (btn.textContent.includes('Connect Wallet') || btn.textContent.includes('Connect')) {
        btn.innerHTML = '<i class="ti ti-wallet"></i> ' + short
        btn.style.background = '#0F6E56'
      }
    })

    localStorage.setItem('devblock-wallet', address)

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
