const NEWS_SOURCES = [
  'https://api.rss2json.com/v1/api.json?rss_url=https://coindesk.com/arc/outboundfeeds/rss/',
  'https://api.rss2json.com/v1/api.json?rss_url=https://decrypt.co/feed',
  'https://api.rss2json.com/v1/api.json?rss_url=https://cointelegraph.com/rss'
]

async function fetchNews() {
  const el = document.getElementById('newsFeed')
  if (!el) return

  el.innerHTML = '<div style="font-size:13px; color:var(--text3); padding:10px;">Loading news...</div>'

  try {
    const results = await Promise.allSettled(
      NEWS_SOURCES.map(url => fetch(url).then(r => r.json()))
    )

    let articles = []
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.items) {
        articles = articles.concat(result.value.items.slice(0, 5))
      }
    })

    // Sort by date
    articles.sort((a, b) => new Date(b.pubDate) - new Date(a.pubDate))
    articles = articles.slice(0, 12)

    if (articles.length === 0) {
      el.innerHTML = '<div style="font-size:13px; color:var(--text3); padding:10px;">No news available right now.</div>'
      return
    }

    el.innerHTML = articles.map(article => {
      const img = article.thumbnail || article.enclosure?.link || ''
      const source = new URL(article.link).hostname.replace('www.', '')
      const timeAgo = getTimeAgo(article.pubDate)
      return `
        <div class="news-card" onclick="window.open('${article.link}', '_blank')" style="cursor:pointer;">
          ${img ? `<div class="news-img" style="background-image:url('${img}')"></div>` : ''}
          <div class="news-body">
            <div class="news-source">${source} · ${timeAgo}</div>
            <div class="news-title">${article.title}</div>
            <div class="news-excerpt">${(article.description || '').replace(/<[^>]*>/g, '').slice(0, 100)}...</div>
          </div>
        </div>`
    }).join('')
  } catch(e) {
    el.innerHTML = '<div style="font-size:13px; color:var(--text3); padding:10px;">Could not load news.</div>'
    console.log('News error:', e)
  }
}

function getTimeAgo(date) {
  const diff = Date.now() - new Date(date)
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return mins + 'm ago'
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return hrs + 'h ago'
  return Math.floor(hrs / 24) + 'd ago'
}

fetchNews()
setInterval(fetchNews, 300000)
