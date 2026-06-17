const COINS = [
  { id: 'bitcoin', symbol: 'BTC', color: '#F7931A' },
  { id: 'ethereum', symbol: 'ETH', color: '#627EEA' },
  { id: 'sui', symbol: 'SUI', color: '#4CA3FF' },
  { id: 'near', symbol: 'NEAR', color: '#00C08B' },
  { id: 'cardano', symbol: 'ADA', color: '#4488FF' },
  { id: 'solana', symbol: 'SOL', color: '#9945FF' }
]

async function fetchPrices() {
  try {
    const ids = COINS.map(c => c.id).join(',')
    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`)
    const data = await res.json()

    const el = document.getElementById('priceWidget')
    if (!el) return

    el.innerHTML = COINS.map(coin => {
      const price = data[coin.id]?.usd
      const change = data[coin.id]?.usd_24h_change
      if (!price) return ''
      const changeStr = change ? (change > 0 ? `▲ ${change.toFixed(1)}%` : `▼ ${Math.abs(change).toFixed(1)}%`) : ''
      const changeColor = change > 0 ? '#1D9E75' : '#A32D2D'
      const priceStr = price > 1000 ? `$${price.toLocaleString('en-US', {maximumFractionDigits: 0})}` : `$${price.toFixed(3)}`
      return `
        <div class="price-row">
          <span class="price-symbol" style="color:${coin.color}">${coin.symbol}</span>
          <span class="price-value">${priceStr}</span>
          <span class="price-change" style="color:${changeColor}">${changeStr}</span>
        </div>`
    }).join('')
  } catch(e) {
    console.log('Price fetch error:', e)
  }
}

fetchPrices()
setInterval(fetchPrices, 60000)
