// ─────────────────────────────────────────────────────────────
// main.js — Punto de entrada de la aplicación SistemaVida
// ─────────────────────────────────────────────────────────────
import { initAuth, showAuthSection, authShowTab, authSignIn, authRegister, authSignInGoogle, authSignOut, authContinueAsGuest, isGuestMode } from './auth.js'
import { initOnboarding, showOnboarding, obNext, obBack, obToggleMulti, obSelectSingle } from './onboarding.js'
import { initSession, renderSidebar, loadSession, loadNextSession, toggleSidebar, closeSidebar,
         toggleUserMenu, toggleModuleMenu, switchTab, startSessionTimer,
         openExModal, closeExModal, completeCurrentSerie, inlineTimerAdjust, skipInlineTimer,
         floatTimerAdjust, floatTimerSkip, saveLog, openLogForm, closeLogModal,
         openSwapModal, closeSwapModal, applySwap, revertSwap, updateEditSet, saveEditedSets,
         startGuidedMode, closeGuidedMode, completeGuidedSerie, guidedTimerAdjust, skipGuidedTimer,
         skipGuidedRest, guidedResume, guidedRestart,
         togglePhase, updateStats, showConfirm, confirmOk, confirmCancel } from './session.js'
import { initOnboarding as initOb } from './onboarding.js'
import { renderHistory, filterHistory, sortHistory } from './history.js'
import { renderNutrition, saveNutritionProfile, toggleMealMark, updateTrainingHour, editNutritionProfile } from './nutrition.js'
import { initProgress, renderProgress, saveBodyWeight, saveMeasures,
         renderExerciseChart, renderMeasureChart,
         enableNotifications, sendTestNotification } from './progress.js'
import { openWellnessCheck, closeWellnessModal, wellnessToggleMuscle,
         wellnessNextStep, wellnessPrevStep, wellnessSetSeverity } from './wellness.js'
import { initReports, renderReports, downloadPlanPDF, downloadHistorialPDF } from './reports.js'
import { getPlanCache, setPlanCache, setPlanMeta, getPlanMeta, clearAllUserData,
         clearProgressData, getLogs, getAllExLogs, addBodyMetric, todayStr,
         setUserId, getUserId } from './storage.js'
import { sbGetPlan, sbUpsertPlan, sbGetSessionLogs, sbUpsertSessionLog,
         sbGetExLogs, sbUpsertExLog, sbGetUserPrefs, sbUpsertUserPrefs,
         sbDeletePlan, sbDeleteSessionLogs, sbDeleteExLogs, sbGetUser,
         sbOnAuthChange, isSupabaseConfigured } from './supabase.js'
import { generatePlan } from './planner.js'

// ── Estado global ─────────────────────────────────────────────
let _user = null
let _plan = null
let _currentModule = 'fisico'

// ── Exponer funciones globalmente (para onclick en HTML) ──────
function exposeGlobals() {
  // Auth
  window.authShowTab         = authShowTab
  window.authSignIn          = authSignIn
  window.authRegister        = authRegister
  window.authSignInGoogle    = authSignInGoogle
  window.authSignOut         = () => { authSignOut(); showAuthSection() }
  window.authContinueAsGuest = authContinueAsGuest

  // Onboarding
  window.obNext              = obNext
  window.obBack              = obBack
  window.obToggleMulti       = obToggleMulti
  window.obSelectSingle      = obSelectSingle

  // Session
  window.loadSession         = loadSession
  window.loadNextSession     = loadNextSession
  window.toggleSidebar       = toggleSidebar
  window.closeSidebar        = closeSidebar
  window.toggleUserMenu      = toggleUserMenu
  window.toggleModuleMenu    = toggleModuleMenu
  window.switchTab           = switchTab
  window.startSessionTimer   = startSessionTimer
  window.togglePhase         = togglePhase
  window.openExModal         = openExModal
  window.closeExModal        = closeExModal
  window.completeCurrentSerie= completeCurrentSerie
  window.inlineTimerAdjust   = inlineTimerAdjust
  window.skipInlineTimer     = skipInlineTimer
  window.floatTimerAdjust    = floatTimerAdjust
  window.floatTimerSkip      = floatTimerSkip
  window.openLogForm         = openLogForm
  window.closeLogModal       = closeLogModal
  window.saveLog             = saveLog
  window.openSwapModal       = openSwapModal
  window.closeSwapModal      = closeSwapModal
  window.applySwap           = applySwap
  window.revertSwap          = revertSwap
  window.updateEditSet       = updateEditSet
  window.saveEditedSets      = saveEditedSets
  window.startGuidedMode     = startGuidedMode
  window.closeGuidedMode     = closeGuidedMode
  window.completeGuidedSerie = completeGuidedSerie
  window.guidedTimerAdjust   = guidedTimerAdjust
  window.skipGuidedTimer     = skipGuidedTimer
  window.skipGuidedRest      = skipGuidedRest
  window.guidedResume        = guidedResume
  window.guidedRestart       = guidedRestart
  window.confirmOk           = confirmOk
  window.confirmCancel       = confirmCancel

  // Navigation
  window.navGoFisico         = () => navigateTo('fisico')
  window.navGoNutricion      = () => navigateTo('nutricion')
  window.navGoProgreso       = () => navigateTo('progreso')
  window.navGoHistorial      = () => navigateTo('historial')
  window.navGoReportes       = () => navigateTo('reportes')

  // History
  window.filterHistory       = filterHistory
  window.sortHistory         = sortHistory

  // Nutrition
  window.saveNutritionProfile= saveNutritionProfile
  window.toggleMealMark      = toggleMealMark
  window.updateTrainingHour  = updateTrainingHour
  window.editNutritionProfile= editNutritionProfile

  // Progress
  window.saveBodyWeight      = saveBodyWeight
  window.saveMeasures        = saveMeasures
  window.renderExerciseChart = renderExerciseChart
  window.renderMeasureChart  = renderMeasureChart
  window.enableNotifications = enableNotifications
  window.sendTestNotification= sendTestNotification

  // Wellness
  window.openWellnessCheck   = openWellnessCheck
  window.closeWellnessModal  = closeWellnessModal
  window.wellnessToggleMuscle= wellnessToggleMuscle
  window.wellnessNextStep    = wellnessNextStep
  window.wellnessPrevStep    = wellnessPrevStep
  window.wellnessSetSeverity = wellnessSetSeverity

  // Reports
  window.downloadPlanPDF     = downloadPlanPDF
  window.downloadHistorialPDF= downloadHistorialPDF

  // Plan management
  window.showNewCycle        = showNewCycle
  window.resetProgress       = resetProgress

  // Storage helpers expuestos
  window._storage = {
    getLogs, getAllExLogs, addBodyMetric, todayStr,
    setPlanCache, setPlanMeta
  }
}

// ── Inicialización ────────────────────────────────────────────
async function init() {
  exposeGlobals()

  // Inicializar iconos Lucide
  if (window.lucide) window.lucide.createIcons()

  // Cerrar menús al hacer click fuera
  document.addEventListener('click', (e) => {
    const userMenu   = document.getElementById('user-menu')
    const moduleMenu = document.getElementById('module-menu')
    if (userMenu && !userMenu.contains(e.target) && !e.target.closest('[onclick*="toggleUserMenu"]')) {
      userMenu.classList.add('hidden')
    }
    if (moduleMenu && !moduleMenu.contains(e.target) && !e.target.closest('[onclick*="toggleModuleMenu"]')) {
      moduleMenu.classList.add('hidden')
    }
  })

  // Inicializar auth
  initAuth({
    onLoginSuccess: handleLoginSuccess,
    onLogout: handleLogout
  })

  // Verificar si hay sesión activa al cargar
  if (isSupabaseConfigured()) {
    try {
      const user = await sbGetUser()
      if (user) {
        setUserId(user.id)
        await handleLoginSuccess(user)
        return
      }
    } catch (e) {
      console.warn('Error al verificar sesión:', e)
    }
  }

  // Sin Supabase o sin sesión: cargar desde localStorage
  const localPlan = getPlanCache()
  if (localPlan) {
    _plan = localPlan
    showApp()
  } else {
    showAuthSection()
  }
}

// ── Manejo de autenticación ───────────────────────────────────
async function handleLoginSuccess(user) {
  _user = user

  // Intentar cargar plan desde Supabase (saltar si es modo invitado)
  let plan = null
  if (!user.isGuest && isSupabaseConfigured()) {
    try {
      plan = await sbGetPlan(user.id)
      if (plan) { setPlanCache(plan) }
    } catch (e) {
      console.warn('No se pudo cargar el plan desde Supabase:', e)
    }
  }

  if (!plan) plan = getPlanCache()

  if (plan) {
    _plan = plan
    await syncFromCloud(user.id)
    showApp()
  } else {
    // Nuevo usuario — mostrar onboarding
    initOb(async (newPlan, answers) => {
      _plan = newPlan
      setPlanCache(newPlan)
      setPlanMeta(answers)
      if (user?.id) {
        try { await sbUpsertPlan(user.id, newPlan) } catch {}
      }
      showApp()
    })
    showOnboarding()
  }
}

function handleLogout() {
  _user = null
  _plan = null
  showAuthSection()
}

// ── Mostrar la app ────────────────────────────────────────────
function showApp() {
  document.getElementById('auth-section').classList.add('hidden')
  document.getElementById('onboarding-section').classList.add('hidden')
  document.getElementById('app-section').classList.remove('hidden')

  // Badge de modo invitado
  const emailEl = document.getElementById('nav-user-email')
  if (emailEl) emailEl.innerHTML = isGuestMode() ? '<i data-lucide="user"></i> Modo invitado' : (_user?.email || '')

  const meta = _plan?.meta || {}
  initSession(_plan, meta.level || 'intermediate', meta.environment || 'gym')
  initProgress(_plan)
  initReports(_plan)

  navigateTo('fisico')
  setupConnectionBanner()
}

// ── Navegación entre módulos ──────────────────────────────────
function navigateTo(module) {
  _currentModule = module

  const modules = ['fisico', 'nutricion', 'progreso', 'historial', 'reportes']
  modules.forEach(m => {
    document.getElementById(`view-${m}`)?.classList.toggle('hidden', m !== module)
    document.getElementById(`nav-${m}`)?.classList.toggle('active', m === module)
  })

  // Labels de módulos (desktop y mobile)
  const labels = {
    fisico:    { icon: 'dumbbell',    text: 'Físico' },
    nutricion: { icon: 'salad',       text: 'Nutrición' },
    progreso:  { icon: 'trending-up', text: 'Progreso' },
    historial: { icon: 'history',     text: 'Historial' },
    reportes:  { icon: 'file-text',   text: 'Reportes' }
  }
  const el = document.getElementById('current-module-label')
  if (el && labels[module]) {
    el.innerHTML = `<i data-lucide="${labels[module].icon}"></i> ${labels[module].text}`
  }

  // Cerrar menús
  document.getElementById('user-menu')?.classList.add('hidden')
  document.getElementById('module-menu')?.classList.add('hidden')

  // Renderizar módulo correspondiente
  switch (module) {
    case 'nutricion': renderNutrition();     break
    case 'progreso':  renderProgress();      break
    case 'historial': renderHistory();       break
    case 'reportes':  renderReports();       break
    case 'fisico':    updateStats();         break
  }

  // Refrescar iconos Lucide tras renderizado
  if (window.lucide) window.lucide.createIcons()
}

// ── Gestión del plan ──────────────────────────────────────────
function showNewCycle() {
  showConfirm(
    'Nuevo Ciclo',
    'Esto borrará TODO tu historial: sesiones, pesos registrados y el plan actual. Esta acción es irreversible.',
    async () => {
      clearAllUserData()
      if (_user?.id) {
        try {
          await sbDeletePlan(_user.id)
          await sbDeleteSessionLogs(_user.id)
          await sbDeleteExLogs(_user.id)
        } catch (e) {
          console.warn('Error al limpiar Supabase:', e)
        }
      }
      _plan = null

      initOb(async (newPlan, answers) => {
        _plan = newPlan
        setPlanCache(newPlan)
        setPlanMeta(answers)
        if (_user?.id) {
          try { await sbUpsertPlan(_user.id, newPlan) } catch {}
        }
        showApp()
      })
      showOnboarding()
    }
  )
}

function resetProgress() {
  showConfirm(
    'Reiniciar Progreso',
    'Se borrarán todas las sesiones completadas y los pesos registrados. El plan de entrenamiento se mantiene.',
    async () => {
      clearProgressData()
      if (_user?.id) {
        try {
          await sbDeleteSessionLogs(_user.id)
          await sbDeleteExLogs(_user.id)
        } catch (e) {
          console.warn('Error al limpiar Supabase:', e)
        }
      }
      initSession(_plan, _plan?.meta?.level || 'intermediate', _plan?.meta?.environment || 'gym')
      navigateTo('fisico')
    }
  )
}

// ── Sincronización con la nube ────────────────────────────────
async function syncFromCloud(userId) {
  if (!isSupabaseConfigured() || !userId) return
  try {
    // Descargar session logs
    const cloudLogs = await sbGetSessionLogs(userId)
    if (cloudLogs.length > 0) {
      const localLogs = getLogs()
      const merged = mergeLogs(localLogs, cloudLogs)
      localStorage.setItem('sv_logs', JSON.stringify(merged))
    }

    // Descargar exercise logs
    const cloudExLogs = await sbGetExLogs(userId)
    cloudExLogs.forEach(log => {
      if (log.exId && log.sessionId) {
        const key = `sv_ex_${log.exId}_${log.sessionId}`
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, JSON.stringify(log))
        }
      }
    })
  } catch (e) {
    console.warn('Error al sincronizar desde la nube:', e)
  }
}

async function syncToCloud(userId) {
  if (!isSupabaseConfigured() || !userId) return
  showConnectionBanner('syncing')
  try {
    // Subir plan
    if (_plan) await sbUpsertPlan(userId, _plan)

    // Subir session logs
    const logs = getLogs()
    for (const log of logs) {
      await sbUpsertSessionLog(userId, log)
    }

    // Subir exercise logs
    const exLogs = getAllExLogs()
    for (const log of exLogs) {
      await sbUpsertExLog(userId, log)
    }

    showConnectionBanner('synced')
  } catch (e) {
    console.warn('Error al sincronizar:', e)
    showConnectionBanner('offline')
  }
}

function mergeLogs(local, cloud) {
  const map = new Map()
  local.forEach(l => map.set(l.sessionId, l))
  cloud.forEach(l => {
    if (!map.has(l.sessionId) || new Date(l.completedAt) > new Date(map.get(l.sessionId).completedAt)) {
      map.set(l.sessionId, l)
    }
  })
  return [...map.values()]
}

// ── Banner de conexión ────────────────────────────────────────
function setupConnectionBanner() {
  window.addEventListener('online',  () => {
    showConnectionBanner('syncing')
    if (_user) syncToCloud(_user.id)
  })
  window.addEventListener('offline', () => showConnectionBanner('offline'))
}

function showConnectionBanner(state) {
  const banner = document.getElementById('conn-banner')
  if (!banner) return

  banner.classList.remove('hidden')
  banner.className = 'conn-banner'

  const configs = {
    offline:  { cls: 'conn-offline',  text: 'Sin conexión — cambios guardados localmente' },
    syncing:  { cls: 'conn-syncing',  text: 'Sincronizando...' },
    synced:   { cls: 'conn-synced',   text: 'Sincronizado' }
  }

  const cfg = configs[state]
  if (!cfg) { banner.classList.add('hidden'); return }

  banner.classList.add(cfg.cls)
  banner.textContent = cfg.text

  if (state === 'synced') {
    setTimeout(() => banner.classList.add('hidden'), 2500)
  }
}

// ── Arrancar ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init)
