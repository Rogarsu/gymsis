// ─────────────────────────────────────────────────────────────
// wellness.js — Chequeo de bienestar y plan de recuperación
// ─────────────────────────────────────────────────────────────
import { ic, refreshIcons } from './icons.js'

const MUSCLES = [
  { id: 'quads',        label: 'Cuádriceps',       icon: 'activity' },
  { id: 'glutes',       label: 'Glúteo',            icon: 'activity' },
  { id: 'hamstrings',   label: 'Isquiotibiales',    icon: 'activity' },
  { id: 'calves',       label: 'Pantorrillas',      icon: 'footprints' },
  { id: 'core',         label: 'Core / Abdomen',    icon: 'circle-dashed' },
  { id: 'chest',        label: 'Pecho',             icon: 'heart' },
  { id: 'back',         label: 'Espalda / Dorsal',  icon: 'arrow-left' },
  { id: 'shoulders',    label: 'Hombros',           icon: 'person-standing' },
  { id: 'biceps',       label: 'Bíceps',            icon: 'dumbbell' },
  { id: 'triceps',      label: 'Tríceps',           icon: 'dumbbell' },
  { id: 'forearms',     label: 'Antebrazos',        icon: 'hand' }
]

const SEVERITY_LEVELS = [
  { id: 1, label: '1 — Leve',    desc: 'Leve molestia, no limita el movimiento' },
  { id: 2, label: '2 — Moderado', desc: 'Limita algo el rango de movimiento' },
  { id: 3, label: '3 — Fuerte',  desc: 'Dificulta actividades del día a día' }
]

const RECOVERY_TIPS = {
  quads:      { immediate: 'Hielo 15 min. Estiramiento suave de quad.', stretch: 'Estiramiento de quad de pie (agarra el tobillo), 30 seg por lado.' },
  glutes:     { immediate: 'Calor suave 15–20 min. Automasaje con foam roller.', stretch: 'Figura 4 tumbado en el suelo, 30 seg por lado.' },
  hamstrings: { immediate: 'Hielo primero 15 min si es agudo. Calor si es DOMS (48h+).', stretch: 'Estiramiento de isquios sentado, rodilla extendida, 30 seg.' },
  calves:     { immediate: 'Elevación del pie. Hielo si hay inflamación.', stretch: 'Pared: talón en el suelo, punta arriba, 30 seg por lado.' },
  core:       { immediate: 'Reposo relativo. Evita movimientos de flexión intensa.', stretch: 'Cobra: boca abajo, extiende los brazos levantando el torso, 20 seg.' },
  chest:      { immediate: 'Calor en la zona. Movimiento suave de hombros.', stretch: 'Apertura de pecho en marco de puerta, 30 seg por lado.' },
  back:       { immediate: 'Reposo con posición neutra. Evita cargas.', stretch: 'Gato-vaca: a cuatro patas, curva y extiende la columna, 10 reps.' },
  shoulders:  { immediate: 'Hielo 15 min. Evita elevaciones por encima de la cabeza.', stretch: 'Cruce de brazo por el pecho, 30 seg por lado.' },
  biceps:     { immediate: 'Movimiento suave sin carga. Automasaje con pelota.', stretch: 'Brazo extendido en pared, palm hacia fuera, 20 seg.' },
  triceps:    { immediate: 'Calor suave. Extensión lenta del brazo.', stretch: 'Mano tocando espalda alta, empuja el codo con la otra mano, 30 seg.' },
  forearms:   { immediate: 'Masaje de antebrazo. Hielo si hay tendinitis.', stretch: 'Brazo extendido, muñeca flexionada hacia abajo y hacia arriba, 20 seg.' }
}

const MEDICATION = {
  2: {
    name: 'Ibuprofeno 400 mg',
    note: 'Post-comida. Máximo 3 veces al día. No más de 3–5 días seguidos.',
    warning: 'Anti-inflamatorio suave.'
  },
  3: {
    name: 'Ibuprofeno 400–600 mg + Diclofenac tópico',
    note: 'Ibuprofeno cada 8 horas post-comida. Diclofenac en gel aplicado localmente 3 veces/día.',
    warning: 'Para molestias fuertes. Si no mejora en 48h, consulta un médico.'
  }
}

let _wellnessStep = 1
let _selectedMuscles = []
let _severities = {}

// ── Modal ─────────────────────────────────────────────────────
export function openWellnessCheck() {
  _wellnessStep    = 1
  _selectedMuscles = []
  _severities      = {}

  const overlay = document.getElementById('modal-wellness-overlay')
  const content = document.getElementById('modal-wellness-content')
  if (!overlay || !content) return

  renderWellnessStep(content)
  overlay.classList.remove('hidden')
}

export function closeWellnessModal(e) {
  if (e && e.target !== e.currentTarget) return
  document.getElementById('modal-wellness-overlay')?.classList.add('hidden')
}

function renderWellnessStep(content) {
  switch (_wellnessStep) {
    case 1: content.innerHTML = renderStep1(); break
    case 2: content.innerHTML = renderStep2(); break
    case 3: content.innerHTML = renderStep3(); break
  }
  refreshIcons()
}

// ── Paso 1 — Selección de músculos ────────────────────────────
function renderStep1() {
  return `
    <h3 class="modal-title">${ic('heart')} Chequeo de bienestar</h3>
    <p class="modal-text">¿Qué músculos sientes adoloridos o con molestia?</p>
    <div class="wellness-muscles-grid">
      ${MUSCLES.map(m => `
        <button class="wellness-muscle ${_selectedMuscles.includes(m.id) ? 'selected' : ''}"
          onclick="wellnessToggleMuscle('${m.id}', this)">
          <span class="wellness-muscle-icon">${ic(m.icon)}</span>
          <span class="wellness-muscle-label">${m.label}</span>
        </button>
      `).join('')}
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="closeWellnessModal()">Cancelar</button>
      <button class="btn btn-primary" onclick="wellnessNextStep()" ${_selectedMuscles.length === 0 ? 'disabled' : ''} id="wellness-next-1">
        Siguiente ${ic('arrow-right')}
      </button>
    </div>
  `
}

export function wellnessToggleMuscle(id, btn) {
  const idx = _selectedMuscles.indexOf(id)
  if (idx >= 0) _selectedMuscles.splice(idx, 1)
  else _selectedMuscles.push(id)
  btn.classList.toggle('selected', _selectedMuscles.includes(id))
  const nextBtn = document.getElementById('wellness-next-1')
  if (nextBtn) nextBtn.disabled = _selectedMuscles.length === 0
}

// ── Paso 2 — Intensidad ───────────────────────────────────────
function renderStep2() {
  return `
    <h3 class="modal-title">${ic('hash')} Intensidad del dolor</h3>
    <p class="modal-text">Para cada músculo, indica la intensidad:</p>
    <div class="wellness-severity-list">
      ${_selectedMuscles.map(mid => {
        const m = MUSCLES.find(x => x.id === mid)
        return `
          <div class="wellness-severity-item">
            <div class="wellness-severity-muscle">${ic(m?.icon)} ${m?.label}</div>
            <div class="wellness-severity-options">
              ${SEVERITY_LEVELS.map(s => `
                <button class="severity-btn ${_severities[mid] === s.id ? 'selected' : ''}"
                  onclick="wellnessSetSeverity('${mid}', ${s.id}, this)">
                  <strong>${s.label}</strong>
                  <span>${s.desc}</span>
                </button>
              `).join('')}
            </div>
          </div>
        `
      }).join('')}
    </div>
    <div class="modal-actions">
      <button class="btn btn-ghost" onclick="wellnessPrevStep()">${ic('arrow-left')} Atrás</button>
      <button class="btn btn-primary" onclick="wellnessNextStep()">Ver plan de recuperación ${ic('arrow-right')}</button>
    </div>
  `
}

export function wellnessSetSeverity(muscleId, severity, btn) {
  _severities[muscleId] = severity
  // Deselect others in same group
  btn.closest('.wellness-severity-options')
    ?.querySelectorAll('.severity-btn')
    ?.forEach(b => b.classList.remove('selected'))
  btn.classList.add('selected')
}

// ── Paso 3 — Plan de recuperación ────────────────────────────
function renderStep3() {
  return `
    <h3 class="modal-title">${ic('bandage')} Plan de recuperación</h3>
    <div class="recovery-plans">
      ${_selectedMuscles.map(mid => {
        const m        = MUSCLES.find(x => x.id === mid)
        const severity = _severities[mid] || 1
        const tips     = RECOVERY_TIPS[mid] || {}
        const meds     = MEDICATION[severity]
        return `
          <div class="recovery-item">
            <h4 class="recovery-muscle-title">${ic(m?.icon)} ${m?.label} — ${SEVERITY_LEVELS.find(s => s.id === severity)?.label}</h4>
            <div class="recovery-tip">
              <strong>${ic('snowflake')} Recuperación inmediata:</strong>
              <p>${tips.immediate || 'Reposo relativo y movimiento suave.'}</p>
            </div>
            <div class="recovery-stretch">
              <strong>${ic('person-standing')} Estiramiento:</strong>
              <p>${tips.stretch || 'Estira suavemente el área 2–3 veces al día.'}</p>
            </div>
            ${meds ? `
              <div class="recovery-meds ${severity === 3 ? 'meds-strong' : ''}">
                <strong>${ic('pill')} Medicación (${meds.warning})</strong>
                <p><em>${meds.name}</em> — ${meds.note}</p>
                <p class="meds-warning">${ic('alert-triangle')} Consulta a un médico antes de automedicarte.</p>
              </div>
            ` : ''}
          </div>
        `
      }).join('')}
    </div>
    <button class="btn btn-primary btn-full" onclick="closeWellnessModal()">Entendido ${ic('check')}</button>
  `
}

// ── Navegación ────────────────────────────────────────────────
export function wellnessNextStep() {
  if (_wellnessStep === 2) {
    // Verificar que todos los músculos tienen severidad asignada
    const missing = _selectedMuscles.filter(m => !_severities[m])
    if (missing.length > 0) {
      alert('Asigna una intensidad a todos los músculos seleccionados')
      return
    }
  }
  _wellnessStep++
  const content = document.getElementById('modal-wellness-content')
  if (content) renderWellnessStep(content)
}

export function wellnessPrevStep() {
  if (_wellnessStep <= 1) return
  _wellnessStep--
  const content = document.getElementById('modal-wellness-content')
  if (content) renderWellnessStep(content)
}
