// ─────────────────────────────────────────────────────────────
// onboarding.js — Wizard de 12 pasos + resumen de perfil
// ─────────────────────────────────────────────────────────────
import { generatePlan } from './planner.js'
import { getCycleWarning } from './planner.js'
import { setPlanMeta, setPlanCache } from './storage.js'
import { ic, refreshIcons } from './icons.js'
import { assignMethod, applyModifiers, generateProfileSummary, TRAINING_METHODS } from './methods.js'

const TOTAL_STEPS = 12
let _step = 1
let _answers = {}
let _onComplete = null
let _showingSummary = false

// ── Opciones de cada paso ─────────────────────────────────────

const SEX_OPTIONS = [
  { id: 'male',   label: 'Hombre',              icon: 'user' },
  { id: 'female', label: 'Mujer',               icon: 'user' },
  { id: 'other',  label: 'Prefiero no responder', icon: 'user-x' }
]

const OBJECTIVES = [
  { id: 'strength',  label: 'Ganar fuerza',           icon: 'dumbbell',      desc: 'Cargas altas, pocas repeticiones (3–6 reps)' },
  { id: 'muscle',    label: 'Ganar músculo',           icon: 'biceps-flexed', desc: 'Volumen e hipertrofia (6–12 reps)' },
  { id: 'fat_loss',  label: 'Perder grasa',            icon: 'flame',         desc: 'Metabólico, descansos cortos (12–20 reps)' },
  { id: 'recomp',    label: 'Recomposición corporal',  icon: 'scale',         desc: 'Perder grasa y ganar músculo a la vez' },
  { id: 'endurance', label: 'Mejorar resistencia',     icon: 'person-running',desc: 'Alta resistencia (15–25 reps)' },
  { id: 'general',   label: 'Condición general',       icon: 'heart-pulse',   desc: 'Salud y bienestar equilibrado' }
]

const LEVELS = [
  { id: 'beginner',     label: 'Principiante', icon: 'sprout',  desc: 'Menos de 1 año entrenando con regularidad' },
  { id: 'intermediate', label: 'Intermedio',   icon: 'zap',     desc: '1–3 años, conozco los ejercicios básicos' },
  { id: 'advanced',     label: 'Avanzado',     icon: 'trophy',  desc: 'Más de 3 años, técnica sólida y consistente' }
]

const BODY_COMPOSITION = [
  { id: 'lean',        label: 'Delgado/a',          icon: 'person-standing', desc: 'Poca grasa corporal, podría ganar músculo' },
  { id: 'normal',      label: 'Normal',              icon: 'user',            desc: 'Composición corporal promedio' },
  { id: 'overweight',  label: 'Sobrepeso',           icon: 'trending-up',     desc: 'Me gustaría reducir grasa corporal' },
  { id: 'muscular',    label: 'Musculoso/a',         icon: 'dumbbell',        desc: 'Masa muscular desarrollada' }
]

const SLEEP_OPTIONS = [
  { id: 'good',     label: 'Bueno',    desc: '7–9 horas consistentes' },
  { id: 'moderate', label: 'Regular',  desc: '5–7 horas, algunas noches mal' },
  { id: 'poor',     label: 'Malo',     desc: 'Menos de 5h o muy irregular' }
]

const STRESS_OPTIONS = [
  { id: 'low',      label: 'Bajo',      desc: 'Me siento tranquilo/a la mayoría del tiempo' },
  { id: 'moderate', label: 'Moderado',  desc: 'Algunas semanas son demandantes' },
  { id: 'high',     label: 'Alto',      desc: 'Estrés constante en trabajo o vida personal' }
]

const JOB_OPTIONS = [
  { id: 'sedentary', label: 'Sedentario',  desc: 'Trabajo de escritorio, poco movimiento' },
  { id: 'moderate',  label: 'Mixto',       desc: 'Mezcla de estar sentado y de pie' },
  { id: 'active',    label: 'Activo',      desc: 'Trabajo físico, mucho movimiento o de pie todo el día' }
]

const AGE_RANGES = [
  { id: '18-25', label: '18–25', desc: 'Máxima capacidad de recuperación' },
  { id: '26-35', label: '26–35', desc: 'Óptimo para fuerza e hipertrofia' },
  { id: '36-45', label: '36–45', desc: 'Ajuste en recuperación y volumen' },
  { id: '46+',   label: '46+',   desc: 'Prioridad en descanso y técnica' }
]

const DAYS = [2, 3, 4, 5, 6]

const DURATIONS = [
  { id: '45', label: '45 min', desc: '4 ejercicios por sesión' },
  { id: '60', label: '60 min', desc: '5 ejercicios por sesión' },
  { id: '75', label: '75 min', desc: '6 ejercicios por sesión' },
  { id: '90', label: '90 min', desc: '7 ejercicios por sesión' }
]

const ENVIRONMENTS = [
  { id: 'gym',  label: 'Gimnasio',         icon: 'dumbbell',        desc: 'Acceso completo a máquinas y barras' },
  { id: 'home', label: 'Casa con equipo',  icon: 'home',            desc: 'Mancuernas, bandas, banco' },
  { id: 'none', label: 'Sin equipamiento', icon: 'person-standing', desc: 'Solo peso corporal' }
]

const LIMITATIONS = [
  { id: 'knees',    label: 'Rodillas',  icon: 'triangle-alert' },
  { id: 'back',     label: 'Espalda',   icon: 'triangle-alert' },
  { id: 'shoulders',label: 'Hombros',   icon: 'triangle-alert' },
  { id: 'hips',     label: 'Cadera',    icon: 'triangle-alert' },
  { id: 'none',     label: 'Ninguna',   icon: 'check-circle' }
]

const SPLITS = [
  { id: 'fullbody',    label: 'Full Body',           icon: 'refresh-cw',    desc: 'Todo el cuerpo en cada sesión', types: 3 },
  { id: 'upper_lower', label: 'Superior + Inferior', icon: 'arrows-up-down',desc: 'Alternancia tren superior/inferior', types: 4 },
  { id: 'ppl',         label: 'Push / Pull / Legs',  icon: 'settings-2',    desc: 'Empuje, jalón y piernas', types: 6 },
  { id: 'upper',       label: 'Solo Tren Superior',  icon: 'arrow-up',      desc: 'Pecho, espalda, hombros, brazos', types: 2 },
  { id: 'lower',       label: 'Solo Tren Inferior',  icon: 'arrow-down',    desc: 'Piernas, glúteo, core', types: 2 }
]

const WEEKS = [
  { id: 4,  label: '4 semanas',  desc: '2 fases de entrenamiento' },
  { id: 8,  label: '8 semanas',  desc: '3 fases + semana de deload' },
  { id: 12, label: '12 semanas', desc: '4 fases con deload final' }
]

// ── Inicialización ────────────────────────────────────────────
export function initOnboarding(onComplete) {
  _onComplete = onComplete
  _step = 1
  _answers = {}
  _showingSummary = false
}

export function showOnboarding() {
  document.getElementById('auth-section').classList.add('hidden')
  document.getElementById('app-section').classList.add('hidden')
  document.getElementById('onboarding-section').classList.remove('hidden')
  renderStep()
}

// ── Renderizado ───────────────────────────────────────────────
function renderStep() {
  _showingSummary = false
  updateProgress()
  const card = document.getElementById('ob-card')
  if (!card) return

  switch (_step) {
    case 1:  card.innerHTML = renderStep1();  break
    case 2:  card.innerHTML = renderStep2();  break
    case 3:  card.innerHTML = renderStep3();  break
    case 4:  card.innerHTML = renderStep4();  break
    case 5:  card.innerHTML = renderStep5();  break
    case 6:  card.innerHTML = renderStep6();  break
    case 7:  card.innerHTML = renderStep7();  break
    case 8:  card.innerHTML = renderStep8();  break
    case 9:  card.innerHTML = renderStep9();  break
    case 10: card.innerHTML = renderStep10(); break
    case 11: card.innerHTML = renderStep11(); break
    case 12: card.innerHTML = renderStep12(); break
  }

  restoreSelections()
  updateNavButtons()
  refreshIcons()

  if (_step === 11) updateCycleWarning()
  if (_step === 12) updateSessionPreview()
}

function renderSummaryScreen() {
  _showingSummary = true
  const card = document.getElementById('ob-card')
  if (!card) return

  // Compute method
  const { methodId, modifiers } = assignMethod(_answers)
  const effectiveMethod = applyModifiers(methodId, modifiers)
  const summaryHTML = generateProfileSummary(_answers, methodId, modifiers, effectiveMethod)

  card.innerHTML = `
    <h2 class="ob-title">Tu perfil de entrenamiento</h2>
    <p class="ob-subtitle">Basado en tus respuestas, este es tu método óptimo.</p>
    ${summaryHTML}
    <div class="ob-summary-cta">
      <button class="btn btn-success btn-full" onclick="obGeneratePlan()">
        ${ic('check')} Generar mi plan personalizado
      </button>
      <button class="btn btn-ghost ob-adjust-link" onclick="obBackFromSummary()">
        ${ic('arrow-left')} Ajustar respuestas
      </button>
    </div>
  `

  // Hide normal nav, summary has its own CTA
  const nav = document.getElementById('ob-nav')
  if (nav) nav.classList.add('hidden')

  updateProgress()
  refreshIcons()
}

function updateProgress() {
  const bar = document.getElementById('ob-progress-bar')
  const label = document.getElementById('ob-step-label')
  if (_showingSummary) {
    if (bar) bar.style.width = '100%'
    if (label) label.textContent = 'Resumen de perfil'
  } else {
    if (bar) bar.style.width = `${((_step - 1) / (TOTAL_STEPS - 1)) * 100}%`
    if (label) label.textContent = `Paso ${_step} de ${TOTAL_STEPS}`
  }
}

function updateNavButtons() {
  const nav = document.getElementById('ob-nav')
  if (nav) nav.classList.remove('hidden')

  const btnBack = document.getElementById('ob-btn-back')
  const btnNext = document.getElementById('ob-btn-next')
  if (btnBack) btnBack.classList.toggle('hidden', _step === 1)
  if (btnNext) {
    btnNext.innerHTML = _step === TOTAL_STEPS
      ? `${ic('user')} Ver mi perfil ${ic('arrow-right')}`
      : `Siguiente ${ic('arrow-right')}`
    btnNext.className = _step === TOTAL_STEPS ? 'btn btn-primary' : 'btn btn-primary'
  }
}

// ── Pasos individuales ────────────────────────────────────────
function renderStep1() {
  return `
    <h2 class="ob-title">¿Con qué sexo te identificas?</h2>
    <p class="ob-subtitle">Esto ayuda a personalizar tus recomendaciones de peso y ejercicios.</p>
    <div class="ob-grid ob-grid-3">
      ${SEX_OPTIONS.map(o => `
        <button class="ob-option ob-single" data-group="sex" data-value="${o.id}" onclick="obSelectSingle(this)">
          <span class="ob-option-icon">${ic(o.icon)}</span>
          <span class="ob-option-label">${o.label}</span>
        </button>
      `).join('')}
    </div>
  `
}

function renderStep2() {
  return `
    <h2 class="ob-title">¿Cuál es tu objetivo principal?</h2>
    <p class="ob-subtitle">Elige el que mejor describe lo que quieres lograr.</p>
    <div class="ob-grid ob-grid-2">
      ${OBJECTIVES.map(o => `
        <button class="ob-option ob-single" data-group="objective" data-value="${o.id}" onclick="obSelectSingle(this)">
          <span class="ob-option-icon">${ic(o.icon)}</span>
          <span class="ob-option-label">${o.label}</span>
          <span class="ob-option-desc">${o.desc}</span>
        </button>
      `).join('')}
    </div>
  `
}

function renderStep3() {
  return `
    <h2 class="ob-title">¿Cuál es tu nivel de experiencia?</h2>
    <p class="ob-subtitle">Sé honesto/a — el método de entrenamiento depende de esto.</p>
    <div class="ob-grid ob-grid-3">
      ${LEVELS.map(l => `
        <button class="ob-option ob-single" data-group="experience" data-value="${l.id}" onclick="obSelectSingle(this)">
          <span class="ob-option-icon">${ic(l.icon)}</span>
          <span class="ob-option-label">${l.label}</span>
          <span class="ob-option-desc">${l.desc}</span>
        </button>
      `).join('')}
    </div>
  `
}

function renderStep4() {
  return `
    <h2 class="ob-title">¿Cómo describirías tu composición corporal actual?</h2>
    <p class="ob-subtitle">Esta información ayuda a ajustar el método y la nutrición.</p>
    <div class="ob-grid ob-grid-2">
      ${BODY_COMPOSITION.map(b => `
        <button class="ob-option ob-single" data-group="bodyComposition" data-value="${b.id}" onclick="obSelectSingle(this)">
          <span class="ob-option-icon">${ic(b.icon)}</span>
          <span class="ob-option-label">${b.label}</span>
          <span class="ob-option-desc">${b.desc}</span>
        </button>
      `).join('')}
    </div>
  `
}

function renderStep5() {
  return `
    <h2 class="ob-title">Cuéntame sobre tu recuperación</h2>
    <p class="ob-subtitle">Estos factores determinan el volumen y frecuencia óptimos para ti.</p>

    <div class="ob-recovery-section">
      <div class="ob-recovery-label">${ic('moon')} ¿Cómo es tu calidad de sueño?</div>
      <div class="ob-grid ob-grid-3">
        ${SLEEP_OPTIONS.map(s => `
          <button class="ob-option ob-single ob-small" data-group="sleep" data-value="${s.id}" onclick="obSelectSingle(this)">
            <span class="ob-option-label">${s.label}</span>
            <span class="ob-option-desc">${s.desc}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="ob-recovery-section">
      <div class="ob-recovery-label">${ic('brain')} ¿Cuál es tu nivel de estrés habitual?</div>
      <div class="ob-grid ob-grid-3">
        ${STRESS_OPTIONS.map(s => `
          <button class="ob-option ob-single ob-small" data-group="stress" data-value="${s.id}" onclick="obSelectSingle(this)">
            <span class="ob-option-label">${s.label}</span>
            <span class="ob-option-desc">${s.desc}</span>
          </button>
        `).join('')}
      </div>
    </div>

    <div class="ob-recovery-section">
      <div class="ob-recovery-label">${ic('briefcase')} ¿Qué tipo de trabajo tienes?</div>
      <div class="ob-grid ob-grid-3">
        ${JOB_OPTIONS.map(j => `
          <button class="ob-option ob-single ob-small" data-group="job" data-value="${j.id}" onclick="obSelectSingle(this)">
            <span class="ob-option-label">${j.label}</span>
            <span class="ob-option-desc">${j.desc}</span>
          </button>
        `).join('')}
      </div>
    </div>
  `
}

function renderStep6() {
  return `
    <h2 class="ob-title">¿Cuántos años tienes?</h2>
    <p class="ob-subtitle">La edad influye en el volumen, descanso y progresión recomendados.</p>
    <div class="ob-grid ob-grid-2">
      ${AGE_RANGES.map(a => `
        <button class="ob-option ob-single" data-group="age" data-value="${a.id}" onclick="obSelectSingle(this)">
          <span class="ob-option-label">${a.label}</span>
          <span class="ob-option-desc">${a.desc}</span>
        </button>
      `).join('')}
    </div>
  `
}

function renderStep7() {
  return `
    <h2 class="ob-title">¿Cuántos días por semana puedes entrenar?</h2>
    <p class="ob-subtitle">El número de días determina el total de sesiones del plan.</p>
    <div class="ob-grid ob-grid-5">
      ${DAYS.map(d => `
        <button class="ob-option ob-single ob-day" data-group="daysPerWeek" data-value="${d}" onclick="obSelectSingle(this)">
          <span class="ob-option-label">${d}</span>
          <span class="ob-option-desc">${d === 1 ? 'día' : 'días'}</span>
        </button>
      `).join('')}
    </div>
  `
}

function renderStep8() {
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

function renderStep9() {
  return `
    <h2 class="ob-title">¿Dónde entrenas?</h2>
    <p class="ob-subtitle">Selecciona tu entorno para adaptar el equipamiento disponible.</p>
    <div class="ob-grid ob-grid-3">
      ${ENVIRONMENTS.map(e => `
        <button class="ob-option ob-single" data-group="environment" data-value="${e.id}" onclick="obSelectSingle(this)">
          <span class="ob-option-icon">${ic(e.icon)}</span>
          <span class="ob-option-label">${e.label}</span>
          <span class="ob-option-desc">${e.desc}</span>
        </button>
      `).join('')}
    </div>
  `
}

function renderStep10() {
  return `
    <h2 class="ob-title">¿Tienes alguna limitación física?</h2>
    <p class="ob-subtitle">Puedes seleccionar varias. Adaptaremos los ejercicios.</p>
    <div class="ob-grid ob-grid-2">
      ${LIMITATIONS.map(l => `
        <button class="ob-option ob-multi" data-group="limitations" data-value="${l.id}" onclick="obToggleMulti(this)">
          <span class="ob-option-icon">${ic(l.icon)}</span>
          <span class="ob-option-label">${l.label}</span>
        </button>
      `).join('')}
    </div>
  `
}

function renderStep11() {
  // Auto-recommend split based on days and method
  const days = _answers.daysPerWeek || 3
  let recommended = 'fullbody'
  if (days >= 5) recommended = 'ppl'
  else if (days === 4) recommended = 'upper_lower'
  else if (days <= 3) recommended = 'fullbody'

  return `
    <h2 class="ob-title">¿Qué división de entrenamiento prefieres?</h2>
    <p class="ob-subtitle">Determina cómo se organizan los grupos musculares por sesión.</p>
    <div class="ob-grid ob-grid-1">
      ${SPLITS.map(s => `
        <button class="ob-option ob-single ob-split" data-group="split" data-value="${s.id}" onclick="obSelectSingle(this)">
          <span class="ob-option-icon">${ic(s.icon)}</span>
          <div class="ob-option-text">
            <span class="ob-option-label">${s.label}${s.id === recommended ? ' <span class="ob-recommended-badge">Recomendado</span>' : ''}</span>
            <span class="ob-option-desc">${s.desc} · ${s.types} tipos de sesión</span>
          </div>
        </button>
      `).join('')}
    </div>
    <div id="cycle-warning" class="ob-warning hidden"></div>
  `
}

function renderStep12() {
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

  // "Ninguna" deselects everything else; everything else deselects "Ninguna"
  if (value === 'none') {
    document.querySelectorAll(`.ob-multi[data-group="${group}"]`).forEach(b => b.classList.remove('selected'))
    btn.classList.add('selected')
    _answers[group] = ['none']
    return
  }

  // Deselect "none" if selecting something else
  const noneBtn = document.querySelector(`.ob-multi[data-group="${group}"][data-value="none"]`)
  if (noneBtn) noneBtn.classList.remove('selected')

  btn.classList.toggle('selected')
  const selected = [...document.querySelectorAll(`.ob-multi[data-group="${group}"].selected`)]
    .map(b => b.dataset.value)
    .filter(v => v !== 'none')
  _answers[group] = selected.length > 0 ? selected : []
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
  // Multi-selección (limitaciones)
  const limitations = _answers.limitations || []
  document.querySelectorAll('.ob-multi[data-group="limitations"]').forEach(btn => {
    btn.classList.toggle('selected', limitations.includes(btn.dataset.value))
  })

  // Selecciones únicas
  const singleGroups = ['sex','objective','experience','bodyComposition','sleep','stress','job','age','daysPerWeek','duration','environment','split','planWeeks']
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
    <div class="ob-warning-icon">${ic('alert-triangle')}</div>
    <div>
      <strong>${days} días con ${warning.splitTypes} tipos de sesión</strong><br>
      ${warning.cycleDays} día(s)/semana ciclarán al inicio de los tipos de sesión.
      Los ejercicios son distintos en cada vuelta.
      Para 6 días sin ciclos, usa Push/Pull/Legs (6 tipos).
    </div>
  `
  refreshIcons()
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
    // Go to profile summary screen
    renderSummaryScreen()
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

export function obBackFromSummary() {
  _showingSummary = false
  renderStep()
}

export function obGeneratePlan() {
  finishOnboarding()
}

function validateStep() {
  const errors = {
    1:  () => !_answers.sex                  && '¡Selecciona una opción!',
    2:  () => !_answers.objective            && '¡Elige tu objetivo principal!',
    3:  () => !_answers.experience           && 'Selecciona tu nivel de experiencia',
    4:  () => !_answers.bodyComposition      && 'Selecciona tu composición corporal',
    5:  () => {
      if (!_answers.sleep)  return 'Selecciona tu calidad de sueño'
      if (!_answers.stress) return 'Selecciona tu nivel de estrés'
      if (!_answers.job)    return 'Selecciona tu tipo de trabajo'
      return false
    },
    6:  () => !_answers.age                  && 'Selecciona tu rango de edad',
    7:  () => !_answers.daysPerWeek          && 'Elige cuántos días entrenas',
    8:  () => !_answers.duration             && 'Elige la duración de tus sesiones',
    9:  () => !_answers.environment          && 'Selecciona tu entorno de entrenamiento',
    10: () => false, // limitations optional
    11: () => !_answers.split               && 'Elige una división de entrenamiento',
    12: () => !_answers.planWeeks           && 'Elige la duración del plan'
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
  const generateBtn = document.querySelector('.ob-summary-cta .btn-success')
  if (generateBtn) { generateBtn.disabled = true; generateBtn.innerHTML = `${ic('settings')} Generando plan...` }

  try {
    // Compute method
    const { methodId, modifiers } = assignMethod(_answers)

    // Normalize answers with all new fields
    const answers = {
      // New smart fields
      sex:             _answers.sex            || 'other',
      objective:       _answers.objective      || 'general',
      experience:      _answers.experience     || 'intermediate',
      bodyComposition: _answers.bodyComposition|| 'normal',
      sleep:           _answers.sleep          || 'moderate',
      stress:          _answers.stress         || 'moderate',
      job:             _answers.job            || 'sedentary',
      age:             _answers.age            || '26-35',
      limitations:     _answers.limitations    || [],
      methodId,
      modifiers,
      // Plan structure fields
      daysPerWeek:     _answers.daysPerWeek    || 3,
      duration:        _answers.duration       || '60',
      environment:     _answers.environment    || 'gym',
      split:           _answers.split          || 'fullbody',
      planWeeks:       _answers.planWeeks      || 8,
      // Legacy compatibility
      objectives:      [_answers.objective     || 'general'],
      level:           _answers.experience     || 'intermediate'
    }

    // Generate plan
    const plan = generatePlan(answers)

    // Save to localStorage
    setPlanMeta(answers)
    setPlanCache(plan)

    // Callback
    _onComplete?.(plan, answers)

  } catch (e) {
    console.error('Error generando plan:', e)
    if (generateBtn) {
      generateBtn.disabled = false
      generateBtn.innerHTML = `${ic('check')} Generar mi plan personalizado`
    }
    showObError('Error al generar el plan. Intenta de nuevo.')
  }
}
