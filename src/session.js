// ─────────────────────────────────────────────────────────────
// session.js — Vista principal de entrenamiento + modal de ejercicio
// ─────────────────────────────────────────────────────────────
import { getSession, getAllSessions, getNextSession } from './planner.js'
import { getExLog, setExLog, clearExLog, getLog, addLog, getAllExLogs,
         setSessionStart, getSessionStart, setSessionEnd, getSessionEnd,
         getExSwap, setExSwap, clearExSwap } from './storage.js'
import { getRecommendationForExercise, formatRecommendation } from './progression.js'
import { getById, getAlternatives } from './exercises.js'

// ── Estado de la sesión ───────────────────────────────────────
let _plan = null
let _currentSessionId = null
let _sessionTimerInterval = null
let _sessionStartTs = null
let _modalExId = null
let _modalSessionId = null
let _modalCurrentSerie = 0
let _modalTotalSeries = 0
let _inlineTimerInterval = null
let _inlineTimerSecs = 0
let _floatTimerInterval = null
let _floatTimerSecs = 0
let _guidedExIndex = 0
let _guidedExercises = []
let _userLevel = 'intermediate'
let _userEnv = 'gym'

// ── Inicialización ────────────────────────────────────────────
export function initSession(plan, level = 'intermediate', env = 'gym') {
  _plan = plan
  _userLevel = level
  _userEnv = env
  renderSidebar()
  updateStats()
}

// ── Sidebar ───────────────────────────────────────────────────
export function renderSidebar() {
  if (!_plan) return
  const container = document.getElementById('sidebar-phases')
  const progressText = document.getElementById('sidebar-progress-text')
  if (!container) return

  const logs = getCompletedIds()
  const total = _plan.meta.totalSessions
  const done  = logs.length

  if (progressText) progressText.textContent = `${done} / ${total} sesiones completadas`

  container.innerHTML = _plan.phases.map(phase => {
    const phaseDone  = phase.sessions.filter(s => logs.includes(s.id)).length
    const phaseTotal = phase.sessions.length
    return `
      <div class="sidebar-phase" id="phase-${phase.number}">
        <button class="sidebar-phase-header" onclick="togglePhase(${phase.number})">
          <span class="phase-name">${phase.name}</span>
          <span class="phase-progress">${phaseDone}/${phaseTotal}</span>
          <svg class="phase-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <div class="sidebar-phase-sessions" id="phase-sessions-${phase.number}">
          ${phase.sessions.map(s => {
            const isCompleted = logs.includes(s.id)
            const isCurrent   = s.id === _currentSessionId
            return `
              <button class="sidebar-session ${isCompleted ? 'completed' : ''} ${isCurrent ? 'active' : ''}"
                onclick="loadSession('${s.id}')">
                <span class="session-num">${s.number}</span>
                <span class="session-name">${s.name}</span>
                ${isCompleted ? '<span class="session-check">✓</span>' : ''}
              </button>
            `
          }).join('')}
        </div>
      </div>
    `
  }).join('')
}

export function togglePhase(phaseNumber) {
  const el = document.getElementById(`phase-sessions-${phaseNumber}`)
  const header = document.querySelector(`#phase-${phaseNumber} .phase-chevron`)
  if (!el) return
  el.classList.toggle('collapsed')
  header?.classList.toggle('rotated')
}

// ── Cargar sesión ─────────────────────────────────────────────
export function loadSession(sessionId) {
  if (!_plan) return
  _currentSessionId = sessionId
  closeSidebar()

  const session = getSession(_plan, sessionId)
  if (!session) return

  renderSessionView(session)
  renderSidebar()
  updateStats()
}

export function loadNextSession() {
  if (!_plan) return
  const completed = getCompletedIds()
  const next = getNextSession(_plan, completed)
  if (next) loadSession(next.id)
}

function getCompletedIds() {
  const { getLogs } = window._storage || {}
  if (getLogs) return getLogs().map(l => l.sessionId)
  // Importación directa
  try {
    const raw = localStorage.getItem('sv_logs')
    return raw ? JSON.parse(raw).map(l => l.sessionId) : []
  } catch { return [] }
}

// ── Vista de sesión ───────────────────────────────────────────
function renderSessionView(session) {
  const view = document.getElementById('session-view')
  if (!view) return

  const logs = getCompletedIds()
  const isCompleted = logs.includes(session.id)
  const startTs = getSessionStart(session.id)

  view.innerHTML = `
    <div class="session-header">
      <div class="session-header-info">
        <span class="session-phase-badge">Fase ${session.phase}</span>
        <h2 class="session-title">${session.name}</h2>
        <span class="session-num-badge">Sesión ${session.number}</span>
      </div>
      <div class="session-header-actions">
        ${isCompleted
          ? `<span class="badge-completed">✓ Completada</span>`
          : `<button class="btn btn-primary" id="btn-start-session" onclick="startSessionTimer('${session.id}')">
              ${startTs ? '▶ Continuar sesión' : '▶ Iniciar sesión'}
             </button>`
        }
      </div>
    </div>

    <!-- Timer de sesión -->
    <div class="session-timer ${startTs ? '' : 'hidden'}" id="session-timer">
      <span class="timer-icon">⏱</span>
      <span class="timer-display" id="timer-display">00:00</span>
      <button class="btn btn-sm btn-danger" onclick="openLogForm()">🚩 Sesión finalizada</button>
    </div>

    <!-- Tabs -->
    <div class="session-tabs">
      <button class="session-tab active" id="tab-pre"     onclick="switchTab('pre')">Pre-Entreno</button>
      <button class="session-tab"        id="tab-workout" onclick="switchTab('workout')">Entreno</button>
      <button class="session-tab"        id="tab-post"    onclick="switchTab('post')">Post-Entreno</button>
    </div>

    <!-- Tab: Pre-Entreno -->
    <div class="tab-panel" id="panel-pre">
      <div class="pre-workout-card">
        <h3>💧 Hidratación recomendada</h3>
        <p>Bebe 500 ml de agua 30 minutos antes del entrenamiento. Durante la sesión: 200–300 ml cada 20 min.</p>
      </div>
      <div class="pre-workout-card">
        <h3>🔥 Calentamiento dinámico (5 min)</h3>
        <ul class="warmup-list">
          <li>🦵 Rotaciones de cadera — 10 por lado</li>
          <li>💪 Círculos de hombros — 10 hacia adelante y atrás</li>
          <li>🧘 Movilidad torácica — 10 rotaciones</li>
          <li>🏃 Sentadillas con peso corporal — 15 reps lentas</li>
          <li>🤸 Saltos suaves en el lugar — 30 seg</li>
        </ul>
      </div>
      <div class="pre-workout-card">
        <h3>🧠 Enfoque mental</h3>
        <p>Antes de empezar, toma 3 respiraciones profundas. Define tu intención para esta sesión: ¿qué quieres mejorar hoy?</p>
      </div>
    </div>

    <!-- Tab: Entreno -->
    <div class="tab-panel hidden" id="panel-workout">
      <div class="workout-toolbar">
        <button class="btn btn-secondary" onclick="startGuidedMode('${session.id}')">▶ Modo guiado</button>
      </div>
      ${renderExerciseTable(session)}
    </div>

    <!-- Tab: Post-Entreno -->
    <div class="tab-panel hidden" id="panel-post">
      <div class="post-workout-card">
        <h3>❄️ Enfriamiento (5–8 min)</h3>
        <p>Camina lento durante 3–5 minutos para bajar la frecuencia cardíaca gradualmente.</p>
      </div>
      <div class="post-workout-card">
        <h3>🧘 Estiramientos de recuperación</h3>
        <ul class="warmup-list">
          <li>Cuádriceps de pie — 30 seg por lado</li>
          <li>Isquiotibiales sentado — 30 seg por lado</li>
          <li>Pecho abierto en pared — 30 seg</li>
          <li>Trapecio/cuello — 20 seg por lado</li>
          <li>Glúteos en el suelo (figura 4) — 30 seg por lado</li>
        </ul>
      </div>
      <div class="post-workout-card">
        <h3>🍗 Nutrición post-entreno</h3>
        <p>Dentro de los 30–60 min post-entreno: proteína de rápida absorción (batido + fruta) o comida completa con proteína + carbohidratos.</p>
      </div>
      ${!isCompleted ? `
        <button class="btn btn-primary btn-full" onclick="openLogForm()">🚩 Finalizar y registrar sesión</button>
      ` : ''}
    </div>
  `

  // Iniciar timer si ya había empezado
  if (startTs && !isCompleted) {
    startSessionTimer(session.id, false)
  }
}

function renderExerciseTable(session) {
  // Agrupar ejercicios por bloque
  const blocks = {}
  session.exercises.forEach(ex => {
    const block = ex.block || ex.muscle
    if (!blocks[block]) blocks[block] = []
    blocks[block].push(ex)
  })

  return Object.entries(blocks).map(([block, exercises]) => `
    <div class="exercise-block">
      <h3 class="block-title">${block}</h3>
      <div class="exercise-table">
        ${exercises.map(ex => {
          const swapId  = getExSwap(ex.id, session.id)
          const actualEx = swapId ? (getById(swapId) || ex) : ex
          const log = getExLog(actualEx.id, session.id)
          const hasLog = log?.sets?.length > 0
          return `
            <div class="exercise-row ${hasLog ? 'logged' : ''}" onclick="openExModal('${ex.id}','${session.id}')">
              <div class="exercise-row-main">
                <div class="exercise-row-name">
                  ${hasLog ? '<span class="ex-check">✓</span>' : ''}
                  <span>${actualEx.name}</span>
                  ${swapId ? '<span class="ex-swap-badge">cambiado</span>' : ''}
                </div>
                <div class="exercise-row-info">
                  <span class="ex-tag">${actualEx.muscle}</span>
                  <span class="ex-tag">${ex.sets} × ${ex.reps}</span>
                  <span class="ex-tag">⏱ ${ex.rest}</span>
                </div>
              </div>
              <div class="exercise-row-meta">
                <span class="ex-weight-guide">🎯 ${ex.weightGuide}</span>
                ${hasLog ? `<span class="ex-logged-info">${log.sets.map(s => `${s.weight}kg×${s.reps}`).join(' · ')}</span>` : ''}
              </div>
              ${ex.notes ? `<div class="exercise-row-notes">💡 ${ex.notes}</div>` : ''}
            </div>
          `
        }).join('')}
      </div>
    </div>
  `).join('')
}

// ── Tabs ──────────────────────────────────────────────────────
export function switchTab(tab) {
  const tabs = ['pre', 'workout', 'post']
  tabs.forEach(t => {
    document.getElementById(`tab-${t}`)?.classList.toggle('active', t === tab)
    document.getElementById(`panel-${t}`)?.classList.toggle('hidden', t !== tab)
  })
}

// ── Timer de sesión ───────────────────────────────────────────
export function startSessionTimer(sessionId, saveStart = true) {
  if (saveStart) {
    const ts = Date.now()
    setSessionStart(sessionId, ts)
    _sessionStartTs = ts
  } else {
    _sessionStartTs = getSessionStart(sessionId)
  }

  const btn = document.getElementById('btn-start-session')
  if (btn) btn.classList.add('hidden')
  document.getElementById('session-timer')?.classList.remove('hidden')

  if (_sessionTimerInterval) clearInterval(_sessionTimerInterval)
  _sessionTimerInterval = setInterval(() => updateTimerDisplay(), 1000)
  updateTimerDisplay()
}

function updateTimerDisplay() {
  if (!_sessionStartTs) return
  const elapsed = Math.floor((Date.now() - _sessionStartTs) / 1000)
  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')
  const el = document.getElementById('timer-display')
  if (el) el.textContent = `${mm}:${ss}`
}

function getElapsedMinutes() {
  if (!_sessionStartTs) return 0
  return Math.round((Date.now() - _sessionStartTs) / 60000)
}

// ── Modal de ejercicio ────────────────────────────────────────
export function openExModal(exId, sessionId) {
  const session = getSession(_plan, sessionId)
  if (!session) return

  // Obtener ejercicio del plan (puede estar swapeado)
  const planEx = session.exercises.find(e => e.id === exId)
  if (!planEx) return

  const swapId = getExSwap(exId, sessionId)
  const activeId = swapId || exId
  const activeEx = getById(activeId) || { id: activeId, name: planEx.name, muscle: planEx.muscle, notes: planEx.notes }

  _modalExId = exId
  _modalSessionId = sessionId

  const existingLog = getExLog(activeId, sessionId)
  const allLogs = getAllExLogs()

  const rec = getRecommendationForExercise(
    { id: activeId, reps: planEx.reps, weightGuide: planEx.weightGuide, muscle: planEx.muscle, position: planEx.position },
    allLogs
  )

  const overlay = document.getElementById('modal-exercise-overlay')
  const content = document.getElementById('modal-exercise-content')
  if (!overlay || !content) return

  if (existingLog?.sets?.length > 0) {
    // Modo edición
    content.innerHTML = renderModalEdit(planEx, activeEx, existingLog, rec)
  } else {
    // Modo serie a serie
    _modalCurrentSerie = 0
    _modalTotalSeries = planEx.sets
    content.innerHTML = renderModalSerieMode(planEx, activeEx, rec, 0, [])
  }

  overlay.classList.remove('hidden')
}

export function closeExModal(e) {
  if (e && e.target !== e.currentTarget) return
  document.getElementById('modal-exercise-overlay')?.classList.add('hidden')
  stopInlineTimer()
  _modalExId = null
  _modalSessionId = null
}

// Modal — Modo serie a serie
function renderModalSerieMode(planEx, activeEx, rec, currentSerie, completedSets) {
  const swapId = getExSwap(_modalExId, _modalSessionId)
  return `
    <div class="modal-ex-header">
      <h3 class="modal-ex-name">${activeEx.name}</h3>
      <div class="modal-ex-meta">
        <span class="ex-tag">${activeEx.muscle || planEx.muscle}</span>
        <span class="ex-tag">${activeEx.equipment?.join(', ') || planEx.equipment || 'Peso corporal'}</span>
      </div>
    </div>

    ${activeEx.notes || planEx.notes ? `<p class="modal-ex-notes">💡 ${activeEx.notes || planEx.notes}</p>` : ''}

    <!-- Sets completados -->
    ${completedSets.length > 0 ? `
      <div class="modal-sets-done">
        ${completedSets.map((s, i) => `
          <div class="set-done-row">
            <span class="set-done-num">Serie ${i+1}</span>
            <span class="set-done-val">${s.weight} kg × ${s.reps} reps</span>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <!-- Input de la serie actual -->
    <div class="modal-serie-input" id="serie-input-area">
      <h4 class="serie-title">Serie ${currentSerie + 1} de ${planEx.sets} · Objetivo: ${planEx.reps} reps</h4>
      <div class="serie-fields">
        <div class="form-group">
          <label class="form-label">Peso (kg)</label>
          <input type="number" id="serie-weight" class="form-input form-input-lg" step="0.5" min="0"
            placeholder="${rec.nextWeight || ''}" value="${rec.nextWeight || ''}" />
        </div>
        <div class="form-group">
          <label class="form-label">Reps realizadas</label>
          <input type="number" id="serie-reps" class="form-input form-input-lg" min="0" placeholder="${planEx.reps}" />
        </div>
      </div>
      <button class="btn btn-primary btn-full" onclick="completeCurrentSerie()">
        ${currentSerie + 1 < planEx.sets ? '✓ Completar serie →' : '✓ Completar y guardar'}
      </button>
    </div>

    <!-- Timer inline (oculto al inicio) -->
    <div class="inline-timer hidden" id="inline-timer">
      <div class="inline-timer-label">Descanso</div>
      <div class="inline-timer-ring">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" stroke-width="6"/>
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--primary)" stroke-width="6"
            stroke-dasharray="213.6" stroke-dashoffset="0" id="timer-ring" stroke-linecap="round"
            transform="rotate(-90 40 40)"/>
        </svg>
        <span class="inline-timer-time" id="inline-timer-time">1:30</span>
      </div>
      <div class="inline-timer-controls">
        <button class="btn btn-sm btn-ghost" onclick="inlineTimerAdjust(-30)">−30</button>
        <button class="btn btn-sm btn-secondary" onclick="skipInlineTimer()">Saltar →</button>
        <button class="btn btn-sm btn-ghost" onclick="inlineTimerAdjust(+30)">+30</button>
      </div>
    </div>

    <!-- Recomendación -->
    <div class="modal-recommendation">
      <h4>Para la próxima sesión:</h4>
      <p class="rec-label">${formatRecommendation(rec)}</p>
      ${rec.note ? `<p class="rec-note">${rec.note}</p>` : ''}
    </div>

    <!-- Acciones del modal -->
    <div class="modal-actions-row">
      <button class="btn btn-ghost btn-sm" onclick="openSwapModal('${_modalExId}','${_modalSessionId}')">
        🔄 Cambiar ejercicio
      </button>
      ${swapId ? `<button class="btn btn-ghost btn-sm" onclick="revertSwap('${_modalExId}','${_modalSessionId}')">↶ Volver al original</button>` : ''}
    </div>
  `
}

// Modal — Modo edición
function renderModalEdit(planEx, activeEx, existingLog, rec) {
  const swapId = getExSwap(_modalExId, _modalSessionId)
  const sets = existingLog.sets || []
  return `
    <div class="modal-ex-header">
      <h3 class="modal-ex-name">${activeEx.name}</h3>
      <div class="modal-ex-meta">
        <span class="ex-tag">${activeEx.muscle || planEx.muscle}</span>
        <span class="ex-tag">${planEx.sets} × ${planEx.reps}</span>
      </div>
    </div>

    ${activeEx.notes || planEx.notes ? `<p class="modal-ex-notes">💡 ${activeEx.notes || planEx.notes}</p>` : ''}

    <div class="modal-edit-sets" id="edit-sets-container">
      ${sets.map((s, i) => `
        <div class="edit-set-row">
          <span class="set-num-label">Serie ${i+1}</span>
          <div class="form-row">
            <input type="number" class="form-input" step="0.5" min="0" value="${s.weight}" data-set="${i}" data-field="weight" oninput="updateEditSet(this)" placeholder="kg" />
            <input type="number" class="form-input" min="0" value="${s.reps}" data-set="${i}" data-field="reps" oninput="updateEditSet(this)" placeholder="reps" />
          </div>
        </div>
      `).join('')}
    </div>

    <button class="btn btn-primary btn-full" onclick="saveEditedSets('${_modalExId}','${_modalSessionId}')">💾 Guardar cambios</button>

    <div class="modal-recommendation">
      <h4>Para la próxima sesión:</h4>
      <p class="rec-label">${formatRecommendation(rec)}</p>
      ${rec.note ? `<p class="rec-note">${rec.note}</p>` : ''}
    </div>

    <div class="modal-actions-row">
      <button class="btn btn-ghost btn-sm" onclick="openSwapModal('${_modalExId}','${_modalSessionId}')">
        🔄 Cambiar ejercicio
      </button>
      ${swapId ? `<button class="btn btn-ghost btn-sm" onclick="revertSwap('${_modalExId}','${_modalSessionId}')">↶ Volver al original</button>` : ''}
    </div>
  `
}

// ── Serie por serie ───────────────────────────────────────────
let _completedSets = []

export function completeCurrentSerie() {
  const weight = parseFloat(document.getElementById('serie-weight')?.value) || 0
  const reps   = parseInt(document.getElementById('serie-reps')?.value)    || 0

  if (reps === 0) {
    alert('Ingresa las reps realizadas')
    return
  }

  _completedSets.push({ weight, reps })
  _modalCurrentSerie++

  // ¿Última serie?
  if (_modalCurrentSerie >= _modalTotalSeries) {
    // Guardar todo
    const session = getSession(_plan, _modalSessionId)
    const planEx  = session?.exercises.find(e => e.id === _modalExId)
    if (!planEx) { closeExModal(); return }

    const swapId = getExSwap(_modalExId, _modalSessionId)
    const activeId = swapId || _modalExId
    const activeEx = getById(activeId) || {}

    const logData = {
      exId: activeId,
      sessionId: _modalSessionId,
      name: activeEx.name || planEx.name,
      muscle: activeEx.muscle || planEx.muscle,
      sets: _completedSets,
      targetReps: planEx.reps,
      completedAt: new Date().toISOString()
    }
    setExLog(activeId, _modalSessionId, logData)
    _completedSets = []

    // Refresca el modal a modo edición
    openExModal(_modalExId, _modalSessionId)

    // Iniciar timer flotante entre ejercicios
    startFloatTimer(parseRestSecs(planEx.rest))
    return
  }

  // Mostrar timer inline entre series
  const session = getSession(_plan, _modalSessionId)
  const planEx  = session?.exercises.find(e => e.id === _modalExId)
  const restSecs = parseRestSecs(planEx?.rest || '90 seg')

  const inputArea = document.getElementById('serie-input-area')
  if (inputArea) inputArea.classList.add('hidden')

  startInlineTimer(restSecs, () => {
    stopInlineTimer()
    document.getElementById('inline-timer')?.classList.add('hidden')
    const inputArea2 = document.getElementById('serie-input-area')
    if (inputArea2) {
      inputArea2.classList.remove('hidden')
      // Actualizar serie title
      const title = inputArea2.querySelector('.serie-title')
      if (title) title.textContent = `Serie ${_modalCurrentSerie + 1} de ${_modalTotalSeries} · Objetivo: ${planEx?.reps} reps`
      const btn = inputArea2.querySelector('button')
      if (btn) btn.textContent = _modalCurrentSerie + 1 < _modalTotalSeries ? '✓ Completar serie →' : '✓ Completar y guardar'
      // Limpiar reps
      const repsInput = document.getElementById('serie-reps')
      if (repsInput) repsInput.value = ''
    }
    // Añadir set completado visualmente
    const setsDone = document.querySelector('.modal-sets-done')
    const newRow = `<div class="set-done-row"><span class="set-done-num">Serie ${_completedSets.length}</span><span class="set-done-val">${_completedSets[_completedSets.length-1]?.weight} kg × ${_completedSets[_completedSets.length-1]?.reps} reps</span></div>`
    if (setsDone) setsDone.innerHTML += newRow
    else {
      const content = document.getElementById('modal-exercise-content')
      if (content) {
        const div = document.createElement('div')
        div.className = 'modal-sets-done'
        div.innerHTML = newRow
        content.insertBefore(div, document.getElementById('serie-input-area'))
      }
    }
  })

  document.getElementById('inline-timer')?.classList.remove('hidden')
}

// Timer inline entre series
function startInlineTimer(seconds, onEnd) {
  stopInlineTimer()
  _inlineTimerSecs = seconds
  const totalCircum = 213.6

  const update = () => {
    const el = document.getElementById('inline-timer-time')
    const ring = document.getElementById('timer-ring')
    if (!el) { stopInlineTimer(); return }

    const mm = String(Math.floor(_inlineTimerSecs / 60)).padStart(2, '0')
    const ss = String(_inlineTimerSecs % 60).padStart(2, '0')
    el.textContent = `${mm}:${ss}`

    if (ring) {
      const pct = _inlineTimerSecs / seconds
      ring.style.strokeDashoffset = totalCircum * (1 - pct)
    }

    if (_inlineTimerSecs <= 0) {
      stopInlineTimer()
      if (navigator.vibrate) navigator.vibrate([200, 100, 200])
      onEnd?.()
      return
    }
    _inlineTimerSecs--
  }
  update()
  _inlineTimerInterval = setInterval(update, 1000)
}

function stopInlineTimer() {
  if (_inlineTimerInterval) { clearInterval(_inlineTimerInterval); _inlineTimerInterval = null }
}

export function inlineTimerAdjust(delta) {
  _inlineTimerSecs = Math.max(0, _inlineTimerSecs + delta)
}

export function skipInlineTimer() {
  _inlineTimerSecs = 0
}

// ── Timer flotante entre ejercicios ──────────────────────────
function startFloatTimer(seconds) {
  stopFloatTimer()
  _floatTimerSecs = seconds
  const floatEl = document.getElementById('float-timer')
  if (floatEl) floatEl.classList.remove('hidden')

  const update = () => {
    const el = document.getElementById('float-timer-time')
    if (!el) { stopFloatTimer(); return }
    const mm = String(Math.floor(_floatTimerSecs / 60)).padStart(2, '0')
    const ss = String(_floatTimerSecs % 60).padStart(2, '0')
    el.textContent = `${mm}:${ss}`
    if (_floatTimerSecs <= 0) {
      stopFloatTimer()
      if (navigator.vibrate) navigator.vibrate([300, 150, 300])
      document.getElementById('float-timer')?.classList.add('hidden')
      return
    }
    _floatTimerSecs--
  }
  update()
  _floatTimerInterval = setInterval(update, 1000)
}

function stopFloatTimer() {
  if (_floatTimerInterval) { clearInterval(_floatTimerInterval); _floatTimerInterval = null }
}

export function floatTimerAdjust(delta) {
  _floatTimerSecs = Math.max(0, _floatTimerSecs + delta)
}

export function floatTimerSkip() {
  stopFloatTimer()
  document.getElementById('float-timer')?.classList.add('hidden')
}

// ── Edición de sets ───────────────────────────────────────────
const _editSetsData = {}

export function updateEditSet(input) {
  const idx   = parseInt(input.dataset.set)
  const field = input.dataset.field
  if (!_editSetsData[_modalExId]) _editSetsData[_modalExId] = {}
  if (!_editSetsData[_modalExId][idx]) _editSetsData[_modalExId][idx] = {}
  _editSetsData[_modalExId][idx][field] = parseFloat(input.value) || 0
}

export function saveEditedSets(exId, sessionId) {
  const session = getSession(_plan, sessionId)
  const planEx  = session?.exercises.find(e => e.id === exId)
  if (!planEx) return

  const swapId   = getExSwap(exId, sessionId)
  const activeId = swapId || exId
  const activeEx = getById(activeId) || {}
  const existing = getExLog(activeId, sessionId)
  if (!existing) return

  // Mergear cambios del form con datos existentes
  const updatedSets = existing.sets.map((s, i) => ({
    weight: _editSetsData[exId]?.[i]?.weight ?? s.weight,
    reps:   _editSetsData[exId]?.[i]?.reps   ?? s.reps
  }))

  const logData = {
    ...existing,
    sets: updatedSets,
    completedAt: new Date().toISOString()
  }
  setExLog(activeId, sessionId, logData)

  // Refrescar tabla de la sesión
  refreshExerciseRow(exId, sessionId)
  closeExModal()
  startFloatTimer(parseRestSecs(planEx.rest))
}

// ── Swap de ejercicio ─────────────────────────────────────────
export function openSwapModal(exId, sessionId) {
  const session = getSession(_plan, sessionId)
  const planEx  = session?.exercises.find(e => e.id === exId)
  if (!planEx) return

  const alternatives = getAlternatives(exId, _userEnv, _userLevel)
  const modal = document.getElementById('modal-swap-overlay')
  const list  = document.getElementById('swap-list')
  const sub   = document.getElementById('swap-subtitle')
  if (!modal || !list) return

  if (sub) sub.textContent = `Alternativas para: ${planEx.muscle}`

  list.innerHTML = alternatives.length > 0
    ? alternatives.map(alt => `
        <button class="swap-option" onclick="applySwap('${exId}','${sessionId}','${alt.id}')">
          <span class="swap-name">${alt.name}</span>
          <span class="swap-meta">${alt.type === 'compound' ? 'Compuesto' : 'Aislamiento'} · ${alt.equipment?.join(', ') || 'BW'}</span>
        </button>
      `).join('')
    : '<p class="swap-empty">No hay alternativas disponibles para tu entorno.</p>'

  modal.classList.remove('hidden')
}

export function closeSwapModal(e) {
  if (e && e.target !== e.currentTarget) return
  document.getElementById('modal-swap-overlay')?.classList.add('hidden')
}

export function applySwap(originalExId, sessionId, newExId) {
  setExSwap(originalExId, sessionId, newExId)
  closeSwapModal()
  openExModal(originalExId, sessionId)
  refreshExerciseRow(originalExId, sessionId)
}

export function revertSwap(exId, sessionId) {
  clearExSwap(exId, sessionId)
  openExModal(exId, sessionId)
  refreshExerciseRow(exId, sessionId)
}

function refreshExerciseRow(exId, sessionId) {
  const session = getSession(_plan, sessionId)
  if (session) {
    const view = document.getElementById('panel-workout')
    if (view) {
      const workoutTable = view.querySelector('.exercise-block')?.closest('#panel-workout')
      if (workoutTable) {
        view.innerHTML = `
          <div class="workout-toolbar">
            <button class="btn btn-secondary" onclick="startGuidedMode('${sessionId}')">▶ Modo guiado</button>
          </div>
          ${renderExerciseTable(session)}
        `
      }
    }
  }
}

// ── Formulario de log de sesión ───────────────────────────────
export function openLogForm() {
  const elapsed = getElapsedMinutes()
  const durationInput = document.getElementById('log-duration')
  if (durationInput) durationInput.value = elapsed || ''
  document.getElementById('modal-log-overlay')?.classList.remove('hidden')
}

export function closeLogModal(e) {
  if (e && e.target !== e.currentTarget) return
  document.getElementById('modal-log-overlay')?.classList.add('hidden')
}

export function saveLog() {
  const sessionId = _currentSessionId
  if (!sessionId) return

  const duration   = parseInt(document.getElementById('log-duration')?.value) || 0
  const energy     = parseInt(document.getElementById('log-energy')?.value) || null
  const fatigue    = parseInt(document.getElementById('log-fatigue')?.value) || null
  const pain       = document.getElementById('log-pain')?.value || ''
  const notes      = document.getElementById('log-notes')?.value || ''
  const bodyWeight = parseFloat(document.getElementById('log-bodyweight')?.value) || null

  const log = {
    sessionId,
    completedAt: new Date().toISOString(),
    duration,
    energy,
    fatigue,
    pain,
    notes,
    bodyWeight
  }

  addLog(log)
  setSessionEnd(sessionId, Date.now())

  // Si hay peso corporal, añadir a métricas
  if (bodyWeight) {
    const { addBodyMetric, todayStr } = window._storage || {}
    if (addBodyMetric) addBodyMetric({ date: todayStr(), weight: bodyWeight })
  }

  closeLogModal()
  stopSessionTimer()
  renderSidebar()
  updateStats()

  // Recargar la sesión para mostrar el badge "completada"
  loadSession(sessionId)
}

function stopSessionTimer() {
  if (_sessionTimerInterval) { clearInterval(_sessionTimerInterval); _sessionTimerInterval = null }
}

// ── Stats row ─────────────────────────────────────────────────
export function updateStats() {
  const logs = (() => {
    try { return JSON.parse(localStorage.getItem('sv_logs') || '[]') } catch { return [] }
  })()

  const total     = _plan?.meta.totalSessions || 0
  const done      = logs.length
  const pct       = total > 0 ? Math.round((done/total)*100) : 0
  const minutes   = logs.reduce((s,l) => s + (l.duration||0), 0)
  const energies  = logs.filter(l => l.energy).map(l => l.energy)
  const avgEnergy = energies.length > 0
    ? (energies.reduce((a,b)=>a+b,0)/energies.length).toFixed(1)
    : '—'

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val }
  set('stat-sessions', done)
  set('stat-progress', `${pct}%`)
  set('stat-minutes', minutes)
  set('stat-energy', avgEnergy)
}

// ── Modo guiado ───────────────────────────────────────────────
export function startGuidedMode(sessionId) {
  const session = getSession(_plan, sessionId)
  if (!session) return

  _guidedExercises = session.exercises
  _guidedExIndex   = 0

  const overlay = document.getElementById('modal-guided-overlay')
  if (!overlay) return

  // Verificar si ya hay datos para esta sesión
  const hasData = session.exercises.some(ex => {
    const swapId = getExSwap(ex.id, sessionId)
    return getExLog(swapId || ex.id, sessionId)?.sets?.length > 0
  })

  if (hasData) {
    // Mostrar pantalla de elección en el modal
    const content = document.getElementById('modal-guided-content')
    const doneSoFar = session.exercises.filter(ex => {
      const swapId = getExSwap(ex.id, sessionId)
      return getExLog(swapId || ex.id, sessionId)?.sets?.length > 0
    }).length
    if (content) {
      content.innerHTML = `
        <div class="guided-resume-screen">
          <div class="guided-resume-icon">💾</div>
          <h3>Ya tienes progreso guardado</h3>
          <p>${doneSoFar} de ${session.exercises.length} ejercicios completados en esta sesión.</p>
          <div class="guided-resume-actions">
            <button class="btn btn-primary btn-full" onclick="guidedResume('${sessionId}')">
              ▶ Retomar desde donde dejé
            </button>
            <button class="btn btn-ghost btn-full" onclick="guidedRestart('${sessionId}')">
              🔄 Empezar de nuevo
            </button>
          </div>
        </div>
      `
    }
    overlay.classList.remove('hidden')
    return
  }

  renderGuidedExercise(session)
  overlay.classList.remove('hidden')
}

function renderGuidedExercise(session) {
  const content = document.getElementById('modal-guided-content')
  if (!content) return

  if (_guidedExIndex >= _guidedExercises.length) {
    // Resumen final
    content.innerHTML = renderGuidedSummary(session)
    return
  }

  const planEx  = _guidedExercises[_guidedExIndex]
  const swapId  = getExSwap(planEx.id, session.id)
  const activeId = swapId || planEx.id
  const activeEx = getById(activeId) || { name: planEx.name, muscle: planEx.muscle }
  const allLogs  = getAllExLogs()
  const rec = getRecommendationForExercise(
    { id: activeId, reps: planEx.reps, weightGuide: planEx.weightGuide, muscle: planEx.muscle, position: planEx.position },
    allLogs
  )

  content.innerHTML = `
    <div class="guided-progress">
      <span>Ejercicio ${_guidedExIndex + 1} de ${_guidedExercises.length}</span>
      <div class="guided-progress-bar">
        <div style="width:${((_guidedExIndex)/_guidedExercises.length)*100}%"></div>
      </div>
    </div>
    <div class="guided-ex-name">${activeEx.name}</div>
    <div class="guided-ex-meta">
      <span class="ex-tag">${planEx.muscle}</span>
      <span class="ex-tag">${planEx.sets} × ${planEx.reps}</span>
      <span class="ex-tag">⏱ ${planEx.rest}</span>
    </div>
    ${planEx.notes ? `<p class="modal-ex-notes">💡 ${planEx.notes}</p>` : ''}
    <div class="rec-box">
      <strong>Peso recomendado:</strong> ${formatRecommendation(rec)}
    </div>
    <div id="guided-sets-container"></div>
    <div id="guided-serie-input">
      <h4 class="serie-title">Serie 1 de ${planEx.sets}</h4>
      <div class="serie-fields">
        <div class="form-group">
          <label class="form-label">Peso (kg)</label>
          <input type="number" id="guided-weight" class="form-input form-input-lg" step="0.5" min="0"
            value="${rec.nextWeight || ''}" placeholder="${rec.nextWeight || '0'}" />
        </div>
        <div class="form-group">
          <label class="form-label">Reps realizadas</label>
          <input type="number" id="guided-reps" class="form-input form-input-lg" min="0" placeholder="${planEx.reps}" />
        </div>
      </div>
      <button class="btn btn-primary btn-full" onclick="completeGuidedSerie('${session.id}')">
        ✓ Serie completada →
      </button>
    </div>
    <div class="inline-timer hidden" id="guided-inline-timer">
      <div class="inline-timer-label">Descanso</div>
      <div class="inline-timer-ring">
        <svg width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--border)" stroke-width="6"/>
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--primary)" stroke-width="6"
            stroke-dasharray="213.6" stroke-dashoffset="0" id="guided-ring" stroke-linecap="round"
            transform="rotate(-90 40 40)"/>
        </svg>
        <span class="inline-timer-time" id="guided-timer-time">1:30</span>
      </div>
      <div class="inline-timer-controls">
        <button class="btn btn-sm btn-ghost" onclick="guidedTimerAdjust(-30)">−30</button>
        <button class="btn btn-sm btn-secondary" onclick="skipGuidedTimer('${session.id}')">Saltar →</button>
        <button class="btn btn-sm btn-ghost" onclick="guidedTimerAdjust(+30)">+30</button>
      </div>
    </div>
  `
}

let _guidedCompletedSets = []
let _guidedCurrentSerie  = 0
let _guidedTimerInterval = null
let _guidedTimerSecs     = 0

export function completeGuidedSerie(sessionId) {
  const session = getSession(_plan, sessionId)
  const planEx  = _guidedExercises[_guidedExIndex]
  if (!planEx) return

  const weight = parseFloat(document.getElementById('guided-weight')?.value) || 0
  const reps   = parseInt(document.getElementById('guided-reps')?.value) || 0
  if (reps === 0) { alert('Ingresa las reps realizadas'); return }

  _guidedCompletedSets.push({ weight, reps })
  _guidedCurrentSerie++

  // Mostrar set completado
  const container = document.getElementById('guided-sets-container')
  if (container) {
    container.innerHTML += `
      <div class="set-done-row">
        <span class="set-done-num">Serie ${_guidedCurrentSerie}</span>
        <span class="set-done-val">${weight} kg × ${reps} reps</span>
      </div>`
  }

  if (_guidedCurrentSerie >= planEx.sets) {
    // Guardar log
    const swapId  = getExSwap(planEx.id, sessionId)
    const activeId = swapId || planEx.id
    const activeEx = getById(activeId) || {}
    setExLog(activeId, sessionId, {
      exId: activeId,
      sessionId,
      name: activeEx.name || planEx.name,
      muscle: activeEx.muscle || planEx.muscle,
      sets: _guidedCompletedSets,
      targetReps: planEx.reps,
      completedAt: new Date().toISOString()
    })
    _guidedCompletedSets = []
    _guidedCurrentSerie  = 0
    _guidedExIndex++

    // Timer entre ejercicios si no es el último
    if (_guidedExIndex < _guidedExercises.length) {
      startGuidedRestTimer(parseRestSecs(planEx.rest), sessionId)
    } else {
      renderGuidedExercise(session)
    }
    return
  }

  // Timer inline entre series
  document.getElementById('guided-serie-input')?.classList.add('hidden')
  document.getElementById('guided-inline-timer')?.classList.remove('hidden')
  const restSecs = parseRestSecs(planEx.rest)

  _guidedTimerSecs = restSecs
  const totalCircum = 213.6
  const update = () => {
    const el = document.getElementById('guided-timer-time')
    const ring = document.getElementById('guided-ring')
    if (!el) { stopGuidedTimer(); return }
    const mm = String(Math.floor(_guidedTimerSecs/60)).padStart(2,'0')
    const ss = String(_guidedTimerSecs%60).padStart(2,'0')
    el.textContent = `${mm}:${ss}`
    if (ring) ring.style.strokeDashoffset = totalCircum * (1 - _guidedTimerSecs/restSecs)
    if (_guidedTimerSecs <= 0) {
      stopGuidedTimer()
      if (navigator.vibrate) navigator.vibrate([200,100,200])
      showNextGuidedSerie(planEx)
      return
    }
    _guidedTimerSecs--
  }
  update()
  _guidedTimerInterval = setInterval(update, 1000)
}

function stopGuidedTimer() {
  if (_guidedTimerInterval) { clearInterval(_guidedTimerInterval); _guidedTimerInterval = null }
}

export function guidedTimerAdjust(delta) {
  _guidedTimerSecs = Math.max(0, _guidedTimerSecs + delta)
}

export function skipGuidedTimer(sessionId) {
  stopGuidedTimer()
  const session = getSession(_plan, sessionId)
  const planEx  = _guidedExercises[_guidedExIndex]
  if (planEx) showNextGuidedSerie(planEx)
  else renderGuidedExercise(session)
}

function showNextGuidedSerie(planEx) {
  document.getElementById('guided-inline-timer')?.classList.add('hidden')
  const serieInput = document.getElementById('guided-serie-input')
  if (serieInput) {
    serieInput.classList.remove('hidden')
    const title = serieInput.querySelector('.serie-title')
    if (title) title.textContent = `Serie ${_guidedCurrentSerie + 1} de ${planEx.sets}`
    const repsInput = document.getElementById('guided-reps')
    if (repsInput) repsInput.value = ''
    const btn = serieInput.querySelector('button')
    if (btn) btn.textContent = _guidedCurrentSerie + 1 < planEx.sets ? '✓ Serie completada →' : '✓ Último set — ¡A por ello!'
  }
}

function startGuidedRestTimer(seconds, sessionId) {
  const content = document.getElementById('modal-guided-content')
  if (!content) return
  let remaining = seconds
  content.innerHTML = `
    <div class="guided-rest-screen">
      <h3>💪 ¡Set completado!</h3>
      <p>Descansa antes del siguiente ejercicio</p>
      <div class="guided-rest-time" id="guided-rest-time">${formatSecs(remaining)}</div>
      <button class="btn btn-primary" onclick="skipGuidedRest('${sessionId}')">Continuar →</button>
    </div>
  `
  _guidedTimerInterval = setInterval(() => {
    remaining--
    const el = document.getElementById('guided-rest-time')
    if (el) el.textContent = formatSecs(remaining)
    if (remaining <= 0) {
      stopGuidedTimer()
      if (navigator.vibrate) navigator.vibrate([300,150,300])
      const session = getSession(_plan, sessionId)
      renderGuidedExercise(session)
    }
  }, 1000)
}

export function skipGuidedRest(sessionId) {
  stopGuidedTimer()
  const session = getSession(_plan, sessionId)
  renderGuidedExercise(session)
}

function renderGuidedSummary(session) {
  const setsData = session.exercises.map(ex => {
    const swapId  = getExSwap(ex.id, session.id)
    const activeId = swapId || ex.id
    const log = getExLog(activeId, session.id)
    const activeEx = getById(activeId) || ex
    return { name: activeEx.name || ex.name, sets: log?.sets || [] }
  })
  return `
    <div class="guided-summary">
      <h3>🎉 ¡Sesión completada!</h3>
      <p>Aquí está el resumen de tu entrenamiento:</p>
      <div class="summary-list">
        ${setsData.map(ex => `
          <div class="summary-ex">
            <strong>${ex.name}</strong>
            <div class="summary-sets">
              ${ex.sets.map((s,i) => `<span>Serie ${i+1}: ${s.weight}kg × ${s.reps}</span>`).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      <button class="btn btn-primary btn-full" onclick="openLogForm()">🚩 Registrar y cerrar sesión</button>
      <button class="btn btn-ghost btn-full" onclick="closeGuidedMode()">Cerrar</button>
    </div>
  `
}

export function closeGuidedMode() {
  document.getElementById('modal-guided-overlay')?.classList.add('hidden')
  stopGuidedTimer()
  _guidedExIndex = 0
  _guidedCompletedSets = []
  _guidedCurrentSerie  = 0
  // Refrescar tabla de sesión
  if (_currentSessionId) {
    const session = getSession(_plan, _currentSessionId)
    if (session) {
      const view = document.getElementById('panel-workout')
      if (view) view.innerHTML = `
        <div class="workout-toolbar">
          <button class="btn btn-secondary" onclick="startGuidedMode('${_currentSessionId}')">▶ Modo guiado</button>
        </div>
        ${renderExerciseTable(session)}`
    }
  }
}

export function guidedResume(sessionId) {
  const session = getSession(_plan, sessionId)
  if (!session) return
  _guidedExercises = session.exercises
  // Find first exercise without completed sets
  const firstIncomplete = session.exercises.findIndex(ex => {
    const swapId = getExSwap(ex.id, sessionId)
    return !(getExLog(swapId || ex.id, sessionId)?.sets?.length > 0)
  })
  _guidedExIndex = firstIncomplete >= 0 ? firstIncomplete : 0
  _guidedCompletedSets = []
  _guidedCurrentSerie  = 0
  renderGuidedExercise(session)
}

export function guidedRestart(sessionId) {
  const session = getSession(_plan, sessionId)
  if (!session) return
  // Clear all existing logs for this session
  session.exercises.forEach(ex => {
    const swapId = getExSwap(ex.id, sessionId)
    const activeId = swapId || ex.id
    clearExLog(activeId, sessionId)
  })
  _guidedExercises = session.exercises
  _guidedExIndex   = 0
  _guidedCompletedSets = []
  _guidedCurrentSerie  = 0
  renderGuidedExercise(session)
}

// ── Sidebar toggle ────────────────────────────────────────────
export function toggleSidebar() {
  const sidebar  = document.getElementById('sidebar')
  const overlay  = document.getElementById('sidebar-overlay')
  sidebar?.classList.toggle('open')
  overlay?.classList.toggle('visible')
}

export function closeSidebar() {
  document.getElementById('sidebar')?.classList.remove('open')
  document.getElementById('sidebar-overlay')?.classList.remove('visible')
}

// ── User menu ─────────────────────────────────────────────────
export function toggleUserMenu() {
  document.getElementById('user-menu')?.classList.toggle('hidden')
  document.getElementById('module-menu')?.classList.add('hidden')
}

export function toggleModuleMenu() {
  document.getElementById('module-menu')?.classList.toggle('hidden')
  document.getElementById('user-menu')?.classList.add('hidden')
}

// ── Confirm dialog ────────────────────────────────────────────
let _confirmCallback = null

export function showConfirm(title, text, onOk) {
  document.getElementById('confirm-title').textContent = title
  document.getElementById('confirm-text').textContent  = text
  document.getElementById('modal-confirm-overlay')?.classList.remove('hidden')
  _confirmCallback = onOk
}

export function confirmOk() {
  document.getElementById('modal-confirm-overlay')?.classList.add('hidden')
  _confirmCallback?.()
  _confirmCallback = null
}

export function confirmCancel() {
  document.getElementById('modal-confirm-overlay')?.classList.add('hidden')
  _confirmCallback = null
}

// ── Helpers ───────────────────────────────────────────────────
function parseRestSecs(restStr) {
  if (!restStr) return 90
  const nums = String(restStr).match(/\d+/g)?.map(Number) || []
  if (nums.length >= 2) return Math.round((nums[0] + nums[1]) / 2)
  if (nums.length === 1) return nums[0]
  return 90
}

function formatSecs(s) {
  const mm = String(Math.floor(s/60)).padStart(2,'0')
  const ss = String(s%60).padStart(2,'0')
  return `${mm}:${ss}`
}
