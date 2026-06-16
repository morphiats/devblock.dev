import { supabase } from './supabase.js'

async function initAuth() {
  const { data: { session } } = await supabase.auth.getSession()

  const signinBtn = document.querySelector('a.btn[href*="auth"]') || document.querySelector('.btn:not(.btn-primary)')
  const connectBtn = document.querySelector('.btn-primary')

  if (session?.user) {
    // Get user profile
    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single()

    const username = profile?.username || session.user.email.split('@')[0]

    // Replace sign in button with user info
    if (signinBtn) {
      signinBtn.outerHTML = `
        <div style="display:flex; align-items:center; gap:8px;">
          <div class="avatar" style="background:#1D9E75; width:28px; height:28px; font-size:11px; cursor:pointer;" onclick="window.location.href='/pages/profile.html'">
            ${username.slice(0,2).toUpperCase()}
          </div>
          <span style="font-size:13px; color:var(--text2);">${username}</span>
          <button class="btn" onclick="signOut()" style="font-size:12px; padding:4px 10px;">Sign out</button>
        </div>
      `
    }

    // Store session globally
    window.currentUser = session.user
    window.currentProfile = profile
  }
}

window.signOut = async function() {
  await supabase.auth.signOut()
  window.location.reload()
}

initAuth()
