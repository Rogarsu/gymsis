// ─────────────────────────────────────────────────────────────
// onboarding.js — Wizard de 7 pasos para crear el plan
// ─────────────────────────────────────────────────────────────
import { generatePlan } from './planner.js'
import { getCycleWarning } from './planner.js'
import { setPlanMeta, setPlanCache } from './storage.js'

const TOTAL_STEPS = 7
let _step = 1
let _answers = {}
let _onComplete = null

// ── Opciones de cada paso ─────────────────────────────────────
const OBJECTIVES = [
  { id: 'strength',    label: 'Ganar fuerza',       icon: '💪', desc: 'Cargas altas, pocas repeticiones (3–8 reps)' },
  { id: 'muscle',      label: 'Ganar músculo',       icon: '🏋️', desc: 'Volumen e hipertrofia (6–15 reps)' },
  { id: 'weight_loss', label: 'Perder peso',         icon: '🔥', desc: 'Circuitos metabólicos (12–20 reps)' },
  { id: 'endurance',   label: 'Mejorar resistencia', icon: '🏃', desc: 'Alta resistencia (15–25 reps)' },
  { id: 'general',     label: 'Condición general',   icon: '⚖️', desc: 'Equilibrio completo (8–15 reps)' }
]

const LEVELS = [
  { id: 'beginner',     label: 'Principiante', icon: '🌱', desc: 'Menos de 1 año entrenando' },
  { id: 'intermediate', label: 'Intermedio',   icon: '⚡', desc: '1–3 años de experiencia' },
  { id: 'advanced',     label: 'Avanzado',     icon: '🏆', desc: 'Más de 3 años, técnica sólida' }
]

const DAYS = [1, 2, 3, 4, 5, 6]

const DURATIONS = [
  { id: '45', label: '45 min', desc: '4 ejercicios por sesión' },
  { id: '60', label: '60 min', desc: '5 ejercicios por sesión' },
  { id: '75', label: '75 min', desc: '6 ejercicios por sesión' },
  { id: '90', label: '90 min', desc: '7 ejercicios por sesión' }
]

const ENVIRONMENTS = [
  { id: 'none', label: 'Sin equipamiento', icon: '🧘', desc: 'Solo peso corporal' },
  { id: 'home', label: 'Casa con equipo',  icon: '🏠', desc: 'Mancuernas, bandas, banco' },
  { id: 'gym',  label: 'Gimnasio',         icon: '🏋️', desc: 'Acceso completo a máquinas y barras' }
]

const SPLITS = [
  { id: 'fullbody',     label: 'Full Body',            icon: '🔄', desc: 'Todo el cuerpo en cada sesión', types: 3 },
  { id: 'upper',        label: 'Solo Tren Superior',   icon: '👆', desc: 'Pecho, espalda, hombros, brazos', types: 2 },
  { id: 'lower',        label: 'Solo Tren Inferior',   icon: '👇', desc: 'Piernas, glúteo, core', types: 2 },
  { id: 'upper_lower',  label: 'Superior + Inferior',  icon: '↕️', desc: 'Alternancia tren superior/inferior', types: 4 },
  { id: 'ppl',          label: 'Push / Pull / Legs',   icon: '⚙️', desc: 'Empuje, jalón y piernas', types: 6 }
]

const WEEKS = [
  { id: 4,  label: '4 semanas', desc: '2 fases de entrenamiento' },
  { id: 8,  label: '8 semanas', desc: '3 fases + semana de deload' },
  { id: 12, label: '12 semanas', desc: '4 fases con deload final' }
]

// ── Inicialización ────────────────────────────────────────────
export function initOnboarding(onComplete) {
  _onComplete = onComplete
  _step = 1
  _answers = {}
}

export function showOnboarding() {
  document.getElementById('auth-section').classList.add('hidden')
  document.getElementById('app-section').classList.add('hidden')
  document.getElementById('onboarding-section').classList.remove('hidden')
  renderStep()
}

// ── Renderizado ───────────────────────────────────────────────
function renderStep() {
  updateProgress()
  const card = document.getElementById('ob-card')
  if (!card) return

  switch (_step) {
    case 1: card.innerHTML = renderStep1(); break
    case 2: card.innerHTML = renderStep2(); break
    case 3: card.innerHTML = renderStep3(); break
    case 4: card.innerHTML = renderStep4(); break
    case 5: card.innerHTML = renderStep5(); break
    case 6: card.innerHTML = renderStep6(); break
    case 7: card.innerHTML = renderStep7(); break
  }

  // Restaurar selecciones previas
  restoreSelections()
  updateNavButtons()

  // Actualizar aviso de ciclos en paso 6
  if (_step === 6) updateCycleWarning()
  // Actualizar preview en paso 7
  if (_step === 7) updateSessionPreview()
}

function updateProgress() {
  const bar = document.getElementById('ob-progress-bar')
  const label = document.getElementById('ob-step-label')
  if (bar) bar.style.width = `${((_step - 1) / (TOTAL_STEPS - 1)) * 100}%`
  if (label) label.textContent = `Paso ${_step} de ${TOTAL_STEPS}`
}

function updateNavButtons() {
  const btnBack = document.getElementById('ob-btn-back')
  const btnNext = document.getElementById('ob-btn-next')
  if (btnBack) btnBack.classList.toggle('hidden', _step === 1)
  if (btnNext) {
    btnNext.textContent = _step === TOTAL_STEPS ? '✓ Generar mi plan' : 'Siguiente →'
    btnNext.className = _step === TOTAL_STEPS ? 'btn btn-success' : 'btn btn-primary'
  }
}

// ── Pasos individuales ────────────────────────────────────────
function renderStep1() {
  return `
    <h2 class="ob-title">¿Cuál es tu objetivo?</h2>
    <p class="ob-subtitle">Puedes elegir uno o varios. El plan combinará estrategias.</p>
    <div class="ob-grid ob-grid-2">
      ${OBJECTIVES.map(o => `
        <button class="ob-option ob-multi" data-group="objectives" data-value="${o.id}" onclick="obToggleMulti(this)">
          <span class="ob-option-icon">${o.icon}</span>
          <span class="ob-option-label">${o.label}</span>
          <span class="ob-option-desc">${o.desc}</span>
        </button>
      `).join('')}
    </div>
  `
}

function renderStep2() {
  return `
    <h2 class="ob-title">¿Cuál es tu nivel de experiencia?</h2>
    <p class="ob-subtitle">Sé honesto — el plan se adapta a tu nivel actual.</p>
    <div class="ob-grid ob-grid-3">
      ${LEVELS.map(l => `
        <button class="ob-option ob-single" data-group="level" data-value="${l.id}" onclick="obSelectSingle(this)">
          <span class="ob-option-icon">${l.icon}</span>
          <span class="ob-option-label">${l.label}</span>
          <span class="ob-option-desc">${l.desc}</span>
        </button>
      `).join('')}
    </div>
  `
}

function renderStep3() {
  return `
    <h2 class="ob-title">¿Cuántos días por semana puedes entrenar?</h2>
    <p class="ob-subtitle">El número de días determina el total de sesiones del plan.</p>
    <div class="ob-grid ob-grid-6">
      ${DAYS.map(d => `
        <button class="ob-option ob-single ob-day" data-group="daysPerWeek" data-value="${d}" onclick="obSelectSingle(this)">
          <span class="ob-option-label">${d}</span>
          <span class="ob-option-desc">${d === 1 ? 'día' : 'días'}</span>
        </button>
      `).join('')}
    </div>
  `
}

function renderStep4() {
  return `
    <h2 class="ob-title">¿Cuánto tiempo tienes por sesión?</h2>
    <p class="ob-subtitle">El tiempo disponible define la cantidad de ejercicios.</p>
    <div class="ob-grid ob-grid-2">
      ${DURATIONS.map(d => `
        <button class="ob-option ob-single" data-group="duration" data-value="${d.id}" onclick="obSelectSingle(this)">
          <span class="ob-option-label">${d.label}</span>
          <span class="ob-option-desc">${d.desc}</span>
        </button>
      `).join('')}
    </div>
  `
}

function renderStep5() {
  return `
    <h2 class="ob-title">¿Dónde entrenas?</h2>
    <p class="ob-subtitle">Selecciona tu entorno para adaptar el equipamiento disponible.</p>
    <div class="ob-grid ob-grid-3">
      ${ENVIRONMENTS.map(e => `
        <button class="ob-option ob-single" data-group="environment" data-value="${e.id}" onclick="obSelectSingle(this)">
          <span class="ob-option-icon">${e.icon}</span>
          <span class="ob-option-label">${e.label}</span>
          <span class="ob-option-desc">${e.desc}</span>
        </button>
      `).join('')}
    </div>
  `
}

function renderStep6() {
  return `
    <h2 class="ob-title">¿Qué división de entrenamiento prefieres?</h2>
    <p class="ob-subtitle">Determina cómo se organizan los grupos musculares por sesión.</p>
    <div class="ob-grid ob-grid-1">
      ${SPLITS.map(s => `
        <button class="ob-option ob-single ob-split" data-group="split" data-value="${s.id}" onclick="obSelectSingle(this)">
          <span class="ob-option-icon">${s.icon}</span>
          <div class="ob-option-text">
            <span class="ob-option-label">${s.label}</span>
            <span class="ob-option-desc">${s.desc} · ${s.types} tipos de sesión</span>
          </div>
        </button>
      `).join('')}
    </div>
    <div id="cycle-warning" class="ob-warning hidden"></div>
  `
}

function renderStep7() {
  return `
    <h2 class="ob-title">¿Cuánto tiempo durará tu plan?</h2>
    <p class="ob-subtitle">Más semanas = más progresión y adaptación.</p>
    <div class="ob-grid ob-grid-3">
      ${WEEKS.map(w => `
        <button class="ob-option ob-single" data-group="planWeeks" data-value="${w.id}" onclick="obSelectSingle(this)">
          <span class="ob-option-label">${w.label}</span>
          <span class="ob-option-desc">${w.desc}</span>
        </button>
      `).join('')}
    </div>
    <div id="session-preview" class="ob-preview hidden"></div>
  `
}

// ── Interacción con opciones ──────────────────────────────────
export function obToggleMulti(btn) {
  const group = btn.dataset.group
  const value = btn.dataset.value
  btn.classList.toggle('selected')

  const selected = [...document.querySelectorAll(`.ob-multi[data-group="${group}"].selected`)]
    .map(b => b.dataset.value)
  _answers[group] = selected
}

export function obSelectSingle(btn) {
  const group = btn.dataset.group
  document.querySelectorAll(`.ob-single[data-group="${group}"]`).forEach(b => b.classList.remove('selected'))
  btn.classList.add('selected')
  _answers[group] = isNaN(btn.dataset.value) ? btn.dataset.value : Number(btn.dataset.value)

  if (group === 'split' || group === 'daysPerWeek') updateCycleWarning()
  if (group === 'daysPerWeek' || group === 'planWeeks') updateSessionPreview()
}

function restoreSelections() {
  // Restaurar multi-selección (objetivos)
  const objectives = _answers.objectives || []
  document.querySelectorAll('.ob-multi[data-group="objectives"]').forEach(btn => {
    btn.classList.toggle('selected', objectives.includes(btn.dataset.value))
  })

  // Restaurar selecciones únicas
  const singleGroups = ['level','daysPerWeek','duration','environment','split','planWeeks']
  singleGroups.forEach(group => {
    if (_answers[group] !== undefined) {
      const val = String(_answers[group])
      const btn = document.querySelector(`.ob-single[data-group="${group}"][data-value="${val}"]`)
      btn?.classList.add('selected')
    }
  })
}

function updateCycleWarning() {
  const warningEl = document.getElementById('cycle-warning')
  if (!warningEl) return

  const days = _answers.daysPerWeek
  const split = _answers.split
  if (!days || !split) { warningEl.classList.add('hidden'); return }

  const warning = getCycleWarning(split, days)
  if (!warning) { warningEl.classList.add('hidden'); return }

  warningEl.classList.remove('hidden')
  warningEl.innerHTML = `
    <div class="ob-warning-icon">⚠️</div>
    <div>
      <strong>${days} días con ${warning.splitTypes} tipos de sesión</strong><br>
      ${warning.cycleDays} día(s)/semana ciclarán al inicio de los tipos de sesión.
      Los ejercicios son distintos en cada vuelta.
      Para 6 días sin ciclos, usa Push/Pull/Legs (6 tipos).
    </div>
  `
}

function updateSessionPreview() {
  const previewEl = document.getElementById('session-preview')
  if (!previewEl) return

  const days  = _answers.daysPerWeek
  const weeks = _answers.planWeeks
  if (!days || !weeks) { previewEl.classList.add('hidden'); return }

  const total = days * weeks
  previewEl.classList.remove('hidden')
  previewEl.innerHTML = `
    <div class="ob-preview-content">
      <span class="ob-preview-formula">${days} días/sem × ${weeks} semanas</span>
      <span class="ob-preview-result">= <strong>${total} sesiones</strong> en total</span>
    </div>
  `
}

// ── Navegación ────────────────────────────────────────────────
export function obNext() {
  if (!validateStep()) return
  if (_step === TOTAL_STEPS) {
    finishOnboarding()
    return
  }
  _step++
  renderStep()
}

export function obBack() {
  if (_step <= 1) return
  _step--
  renderStep()
}

function validateStep() {
  const errors = {
    1: () => !_answers.objectives?.length && '¡Elige al menos un objetivo!',
    2: () => !_answers.level && 'Selecciona tu nivel de experiencia',
    3: () => !_answers.daysPerWeek && 'Elige cuántos días entrenas',
    4: () => !_answers.duration && 'Elige la duración de tus sesiones',
    5: () => !_answers.environment && 'Selecciona tu entorno de entrenamiento',
    6: () => !_answers.split && 'Elige una división de entrenamiento',
    7: () => !_answers.planWeeks && 'Elige la duración del plan'
  }
  const errFn = errors[_step]
  if (errFn) {
    const msg = errFn()
    if (msg) { showObError(msg); return false }
  }
  return true
}

function showObError(msg) {
  const existing = document.querySelector('.ob-error')
  if (existing) existing.remove()
  const el = document.createElement('p')
  el.className = 'ob-error'
  el.textContent = msg
  document.getElementById('ob-card')?.appendChild(el)
  setTimeout(() => el.remove(), 3000)
}

// ── Finalizar onboarding ──────────────────────────────────────
async function finishOnboarding() {
  const btnNext = document.getElementById('ob-btn-next')
  if (btnNext) { btnNext.disabled = true; btnNext.textContent = '⚙️ Generando plan...' }

  try {
    // Normalizar respuestas
    const answers = {
      objectives:  _answers.objectives  || ['general'],
      level:       _answers.level       || 'intermediate',
      daysPerWeek: _answers.daysPerWeek || 3,
      duration:    _answers.duration    || '60',
      environment: _answers.environment || 'gym',
      split:       _answers.split       || 'fullbody',
      planWeeks:   _answers.planWeeks   || 8
    }

    // Generar plan
    const plan = generatePlan(answers)

    // Guardar en localStorage
    setPlanMeta(answers)
    setPlanCache(plan)

    // Llamar callback
    _onComplete?.(plan, answers)

  } catch (e) {
    console.error('Error generando plan:', e)
    if (btnNext) { btnNext.disabled = false; btnNext.textContent = '✓ Generar mi plan' }
    showObError('Error al generar el plan. Intenta de nuevo.')
  }
}
