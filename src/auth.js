// ─────────────────────────────────────────────────────────────
// auth.js — Autenticación (email/password + Google OAuth + modo invitado)
// ─────────────────────────────────────────────────────────────
import {
  sbSignUp, sbSignIn, sbSignInGoogle, sbSignOut,
  sbOnAuthChange, isSupabaseConfigured
} from './supabase.js'
import { setUserId, clearUserId, getUserId } from './storage.js'

const GUEST_ID = 'guest_local'

let _onLoginSuccess = null
let _onLogout       = null

// ── Inicialización ────────────────────────────────────────────
export function initAuth({ onLoginSuccess, onLogout }) {
  _onLoginSuccess = onLoginSuccess
  _onLogout       = onLogout

  // Mostrar aviso si Supabase no está configurado
  if (!isSupabaseConfigured()) {
    showSupabaseWarning()
  }

  // Escuchar cambios de auth (OAuth redirect, session restore)
  sbOnAuthChange((event, session) => {
    if (session?.user) {
      setUserId(session.user.id)
      _onLoginSuccess?.(session.user)
    } else if (event === 'SIGNED_OUT') {
      // Solo hacer logout si no es modo invitado
      if (getUserId() !== GUEST_ID) {
        clearUserId()
        _onLogout?.()
      }
    }
  })
}

function showSupabaseWarning() {
  const card = document.querySelector('.auth-card')
  if (!card) return
  const warn = document.createElement('div')
  warn.className = 'auth-supabase-warn'
  warn.innerHTML = `
    <span>⚠️</span>
    <span>Supabase no configurado — solo funcionará el modo local/invitado</span>
  `
  card.prepend(warn)
}

// ── Modo invitado ─────────────────────────────────────────────
export function authContinueAsGuest() {
  setUserId(GUEST_ID)
  _onLoginSuccess?.({ id: GUEST_ID, email: null, isGuest: true })
}

export function isGuestMode() {
  return getUserId() === GUEST_ID
}

// ── UI helpers ────────────────────────────────────────────────
export function showAuthSection() {
  document.getElementById('auth-section').classList.remove('hidden')
  document.getElementById('onboarding-section').classList.add('hidden')
  document.getElementById('app-section').classList.add('hidden')
}

export function authShowTab(tab) {
  const loginForm = document.getElementById('form-login')
  const regForm   = document.getElementById('form-register')
  const tabLogin  = document.getElementById('tab-login')
  const tabReg    = document.getElementById('tab-register')

  clearErrors()

  if (tab === 'login') {
    loginForm.classList.remove('hidden')
    regForm.classList.add('hidden')
    tabLogin.classList.add('active')
    tabReg.classList.remove('active')
  } else {
    loginForm.classList.add('hidden')
    regForm.classList.remove('hidden')
    tabLogin.classList.remove('active')
    tabReg.classList.add('active')
  }
}

function setLoading(btnId, loading, originalText) {
  const btn = document.getElementById(btnId)
  if (!btn) return
  btn.disabled = loading
  if (loading) {
    btn.dataset.originalText = btn.textContent
    btn.textContent = 'Cargando...'
  } else {
    btn.textContent = originalText || btn.dataset.originalText || btn.textContent
  }
}

function showError(elId, msg) {
  const el = document.getElementById(elId)
  if (el) { el.textContent = msg; el.classList.remove('hidden') }
}

function showSuccess(elId, msg) {
  const el = document.getElementById(elId)
  if (el) { el.textContent = msg; el.classList.remove('hidden') }
}

function clearErrors() {
  ;['login-error', 'reg-error', 'reg-success'].forEach(id => {
    const el = document.getElementById(id)
    if (el) { el.textContent = ''; el.classList.add('hidden') }
  })
}

// ── Login ─────────────────────────────────────────────────────
export async function authSignIn() {
  if (!isSupabaseConfigured()) {
    showError('login-error', 'Supabase no está configurado. Usa el modo invitado o agrega tus credenciales en el archivo .env')
    return
  }
  const email    = document.getElementById('login-email')?.value?.trim()
  const password = document.getElementById('login-password')?.value

  if (!email || !password) { showError('login-error', 'Completa todos los campos'); return }

  setLoading('btn-login', true)
  clearErrors()
  try {
    const { error } = await sbSignIn(email, password)
    if (error) throw error
    // onAuthChange dispara handleLoginSuccess automáticamente
  } catch (e) {
    showError('login-error', translateAuthError(e.message))
  } finally {
    setLoading('btn-login', false)
  }
}

// ── Registro ──────────────────────────────────────────────────
export async function authRegister() {
  if (!isSupabaseConfigured()) {
    showError('reg-error', 'Supabase no está configurado. Usa el modo invitado o agrega tus credenciales en el archivo .env')
    return
  }
  const email     = document.getElementById('reg-email')?.value?.trim()
  const password  = document.getElementById('reg-password')?.value
  const password2 = document.getElementById('reg-password2')?.value

  if (!email || !password || !password2) { showError('reg-error', 'Completa todos los campos'); return }
  if (password !== password2) { showError('reg-error', 'Las contraseñas no coinciden'); return }
  if (password.length < 6)    { showError('reg-error', 'La contraseña debe tener mínimo 6 caracteres'); return }

  setLoading('btn-register', true)
  clearErrors()
  try {
    const { error } = await sbSignUp(email, password)
    if (error) throw error
    showSuccess('reg-success', '¡Cuenta creada! Revisa tu email y confirma tu cuenta antes de entrar.')
  } catch (e) {
    showError('reg-error', translateAuthError(e.message))
  } finally {
    setLoading('btn-register', false)
  }
}

// ── Google OAuth ──────────────────────────────────────────────
export async function authSignInGoogle() {
  if (!isSupabaseConfigured()) {
    showError('login-error', 'Supabase no está configurado. Configura el .env primero.')
    authShowTab('login')
    return
  }
  try {
    const { error } = await sbSignInGoogle()
    if (error) throw error
    // Redirige a Google → al volver onAuthChange se dispara
  } catch (e) {
    showError('login-error', translateAuthError(e.message))
    authShowTab('login')
  }
}

// ── Cerrar sesión ─────────────────────────────────────────────
export async function authSignOut() {
  if (isGuestMode()) {
    clearUserId()
    _onLogout?.()
    return
  }
  try {
    await sbSignOut()
  } catch (e) {
    console.error('Error al cerrar sesión:', e)
  }
  clearUserId()
  _onLogout?.()
}

// ── Traducciones de errores ───────────────────────────────────
function translateAuthError(msg) {
  if (!msg) return 'Error desconocido'
  const m = msg.toLowerCase()
  if (m.includes('invalid login') || m.includes('invalid credentials')) return 'Email o contraseña incorrectos'
  if (m.includes('email not confirmed'))    return 'Confirma tu email antes de entrar (revisa tu bandeja)'
  if (m.includes('user already registered')) return 'Este email ya está registrado — intenta iniciar sesión'
  if (m.includes('weak password'))          return 'La contraseña debe tener al menos 6 caracteres'
  if (m.includes('invalid email'))          return 'El formato del email no es válido'
  if (m.includes('network') || m.includes('fetch')) return 'Sin conexión. Verifica tu internet'
  if (m.includes('rate limit'))             return 'Demasiados intentos. Espera un momento.'
  return msg
}
