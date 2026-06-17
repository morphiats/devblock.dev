window.addEventListener('DOMContentLoaded', async function() {
  if (!window.supabaseClient) return

  try {
    const { data, error } = await window.supabaseClient.auth.getSession()
    console.log('Session check:', data?.session?.user?.email || 'no session')

    if (data?.session?.user) {
      window.currentUser = data.session.user

      const { data: profile } = await window.supabaseClient
        .from('users')
        .select('*')
        .eq('id', data.session.user.id)
        .single()

      window.currentProfile = profile
      const username = profile?.username || data.session.user.email.split('@')[0]
      const initials = username.slice(0,2).toUpperCase()

      const topbarRight = document.getElementById('topbarRight')
      if (topbarRight) {
        topbarRight.innerHTML = `
          <button class="btn theme-toggle" onclick="cycleTheme()"><i class="ti ti-palette"></i></button>
          <div style="display:flex; align-items:center; gap:8px;">
            <a href="/pages/profile.html"><div class="avatar" style="background:#1D9E75; width:28px; height:28px; font-size:11px; cursor:pointer;">${initials}</div></a>
            <span style="font-size:13px; color:var(--text2);">${username}</span>
            <button class="btn" onclick="signOut()" style="font-size:12px; padding:4px 10px;">Sign out</button>
          </div>
          <button class="btn btn-primary" onclick="connectWallet()" id="walletBtn"><i class="ti ti-wallet"></i> Connect Wallet</button>
        `
      }
    }
  } catch(e) {
    console.error('Auth error:', e)
  }
})

window.signOut = async function() {
  await window.supabaseClient.auth.signOut()
  window.location.reload()
}
