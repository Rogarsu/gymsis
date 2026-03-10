// ─────────────────────────────────────────────────────────────
// planner.js — Generador de plan de entrenamiento personalizado
// ─────────────────────────────────────────────────────────────
import { getByMuscle } from './exercises.js'

// ── Configuraciones base ──────────────────────────────────────

const EXERCISES_PER_DURATION = {
  '45': 4,
  '60': 5,
  '75': 6,
  '90': 7
}

const REP_RANGES = {
  strength:    { p1:'6-8',  p2:'4-6',  p3:'3-5',  deload:'8-10' },
  muscle:      { p1:'12-15',p2:'8-12', p3:'6-10', deload:'12-15' },
  weight_loss: { p1:'15-20',p2:'12-15',p3:'12-15',deload:'15-20' },
  endurance:   { p1:'20-25',p2:'15-20',p3:'15-20',deload:'20-25' },
  general:     { p1:'12-15',p2:'10-12',p3:'8-10', deload:'12-15' }
}

const REST_TIMES = {
  strength:    { compound:'180-300 seg', isolation:'90-120 seg' },
  muscle:      { compound:'90-120 seg',  isolation:'60-90 seg' },
  weight_loss: { compound:'60-75 seg',   isolation:'45-60 seg' },
  endurance:   { compound:'45-60 seg',   isolation:'30-45 seg' },
  general:     { compound:'90 seg',      isolation:'60 seg' }
}

// Sets base por fase (MEV → MRV)
const SETS_BY_PHASE = {
  p1: { compound: 3, isolation: 3 },
  p2: { compound: 4, isolation: 3 },
  p3: { compound: 5, isolation: 4 },
  deload: { compound: 2, isolation: 2 }
}

// Guías de peso por entorno (estimados de trabajo)
const WEIGHT_GUIDE = {
  gym: {
    Pecho:    { beginner:'30-50 kg', intermediate:'50-80 kg', advanced:'80-130 kg' },
    Espalda:  { beginner:'40-60 kg', intermediate:'60-100 kg', advanced:'100-160 kg' },
    Hombros:  { beginner:'20-35 kg', intermediate:'35-60 kg', advanced:'60-90 kg' },
    Bíceps:   { beginner:'15-25 kg', intermediate:'25-40 kg', advanced:'40-60 kg' },
    Tríceps:  { beginner:'15-25 kg', intermediate:'25-45 kg', advanced:'45-70 kg' },
    Cuádriceps:{ beginner:'40-70 kg',intermediate:'70-120 kg',advanced:'120-200 kg' },
    Isquiotibiales:{ beginner:'30-50 kg',intermediate:'50-90 kg',advanced:'90-140 kg' },
    Glúteo:   { beginner:'40-70 kg', intermediate:'70-130 kg', advanced:'130-200 kg' },
    Pantorrillas:{ beginner:'40-70 kg',intermediate:'70-120 kg',advanced:'120-200 kg' },
    Core:     { beginner:'BW/20-35 kg',intermediate:'35-60 kg',advanced:'60-90 kg' }
  },
  home: {
    Pecho:    { beginner:'10-18 kg', intermediate:'18-32 kg', advanced:'32-50 kg' },
    Espalda:  { beginner:'10-18 kg', intermediate:'18-32 kg', advanced:'32-50 kg' },
    Hombros:  { beginner:'6-12 kg',  intermediate:'12-22 kg', advanced:'22-36 kg' },
    Bíceps:   { beginner:'6-12 kg',  intermediate:'12-22 kg', advanced:'22-32 kg' },
    Tríceps:  { beginner:'6-12 kg',  intermediate:'12-22 kg', advanced:'22-36 kg' },
    Cuádriceps:{ beginner:'10-18 kg',intermediate:'18-32 kg', advanced:'32-50 kg' },
    Isquiotibiales:{ beginner:'10-18 kg',intermediate:'18-32 kg',advanced:'32-50 kg' },
    Glúteo:   { beginner:'10-20 kg', intermediate:'20-36 kg', advanced:'36-55 kg' },
    Pantorrillas:{ beginner:'BW',    intermediate:'BW/12-22 kg',advanced:'22-36 kg' },
    Core:     { beginner:'BW',       intermediate:'BW/6-12 kg', advanced:'12-20 kg' }
  },
  none: {
    Pecho:    { beginner:'BW', intermediate:'BW', advanced:'BW' },
    Espalda:  { beginner:'BW', intermediate:'BW', advanced:'BW' },
    Hombros:  { beginner:'BW', intermediate:'BW', advanced:'BW' },
    Bíceps:   { beginner:'BW', intermediate:'BW', advanced:'BW' },
    Tríceps:  { beginner:'BW', intermediate:'BW', advanced:'BW' },
    Cuádriceps:{ beginner:'BW',intermediate:'BW', advanced:'BW' },
    Isquiotibiales:{ beginner:'BW',intermediate:'BW',advanced:'BW' },
    Glúteo:   { beginner:'BW', intermediate:'BW', advanced:'BW' },
    Pantorrillas:{ beginner:'BW',intermediate:'BW',advanced:'BW' },
    Core:     { beginner:'BW', intermediate:'BW', advanced:'BW' }
  }
}

// ── Templates de sesión por división ─────────────────────────
// Cada template define qué bloques musculares incluye y en qué orden
const SPLIT_TEMPLATES = {
  fullbody: [
    {
      name: 'Full Body A',
      blocks: ['Cuádriceps', 'Pecho', 'Espalda', 'Core']
    },
    {
      name: 'Full Body B',
      blocks: ['Isquiotibiales', 'Glúteo', 'Hombros', 'Espalda', 'Core']
    },
    {
      name: 'Full Body C',
      blocks: ['Cuádriceps', 'Pecho', 'Hombros', 'Bíceps', 'Tríceps']
    }
  ],
  upper: [
    {
      name: 'Tren Superior A',
      blocks: ['Pecho', 'Espalda', 'Hombros', 'Tríceps']
    },
    {
      name: 'Tren Superior B',
      blocks: ['Espalda', 'Pecho', 'Hombros', 'Bíceps']
    }
  ],
  lower: [
    {
      name: 'Tren Inferior A',
      blocks: ['Cuádriceps', 'Isquiotibiales', 'Pantorrillas', 'Core']
    },
    {
      name: 'Tren Inferior B',
      blocks: ['Glúteo', 'Isquiotibiales', 'Cuádriceps', 'Core']
    }
  ],
  upper_lower: [
    {
      name: 'Superior A',
      blocks: ['Pecho', 'Espalda', 'Hombros', 'Tríceps']
    },
    {
      name: 'Inferior A',
      blocks: ['Cuádriceps', 'Isquiotibiales', 'Pantorrillas']
    },
    {
      name: 'Superior B',
      blocks: ['Espalda', 'Pecho', 'Hombros', 'Bíceps']
    },
    {
      name: 'Inferior B',
      blocks: ['Glúteo', 'Isquiotibiales', 'Core']
    }
  ],
  ppl: [
    {
      name: 'Push A (Empuje)',
      blocks: ['Pecho', 'Hombros', 'Tríceps']
    },
    {
      name: 'Pull A (Jalón)',
      blocks: ['Espalda', 'Bíceps']
    },
    {
      name: 'Legs A (Piernas)',
      blocks: ['Cuádriceps', 'Isquiotibiales', 'Pantorrillas']
    },
    {
      name: 'Push B (Empuje)',
      blocks: ['Hombros', 'Pecho', 'Tríceps']
    },
    {
      name: 'Pull B (Jalón)',
      blocks: ['Espalda', 'Bíceps', 'Espalda']
    },
    {
      name: 'Legs B (Piernas)',
      blocks: ['Glúteo', 'Isquiotibiales', 'Core']
    }
  ]
}

// ── Fases por duración del plan ──────────────────────────────
function buildPhaseStructure(totalWeeks) {
  if (totalWeeks === 4) {
    return [
      { number: 1, name: 'Fase 1 — Adaptación',   weeks: 2, phaseKey: 'p1', isDeload: false },
      { number: 2, name: 'Fase 2 — Desarrollo',    weeks: 2, phaseKey: 'p2', isDeload: false }
    ]
  }
  if (totalWeeks === 8) {
    return [
      { number: 1, name: 'Fase 1 — Adaptación',   weeks: 4, phaseKey: 'p1', isDeload: false },
      { number: 2, name: 'Fase 2 — Desarrollo',    weeks: 3, phaseKey: 'p2', isDeload: false },
      { number: 3, name: 'Fase 3 — Deload',        weeks: 1, phaseKey: 'deload', isDeload: true }
    ]
  }
  // 12 semanas
  return [
    { number: 1, name: 'Fase 1 — Adaptación',   weeks: 4, phaseKey: 'p1', isDeload: false },
    { number: 2, name: 'Fase 2 — Desarrollo',    weeks: 4, phaseKey: 'p2', isDeload: false },
    { number: 3, name: 'Fase 3 — Intensificación', weeks: 3, phaseKey: 'p3', isDeload: false },
    { number: 4, name: 'Fase 4 — Deload',        weeks: 1, phaseKey: 'deload', isDeload: true }
  ]
}

// ── Resolver objetivo principal (para multi-objetivo) ─────────
function resolveObjective(objectives) {
  if (!objectives || objectives.length === 0) return 'general'
  if (objectives.length === 1) return objectives[0]
  // Multi-objetivo: prioridad
  const priority = ['strength', 'muscle', 'weight_loss', 'endurance', 'general']
  return priority.find(p => objectives.includes(p)) || objectives[0]
}

// ── Seleccionar ejercicios para un bloque ─────────────────────
function pickExercises(muscle, count, environment, level, usedIds, phaseKey, objectives) {
  const mainObj = resolveObjective(objectives)
  const isHypertrophyOrStrength = ['muscle', 'strength'].includes(mainObj)

  let pool = getByMuscle(muscle, environment, level)

  // Excluir ya usados esta semana
  pool = pool.filter(ex => !usedIds.has(ex.id))

  if (pool.length === 0) {
    // Si no hay disponibles sin usar, reset del filtro de usados para este músculo
    pool = getByMuscle(muscle, environment, level)
  }

  // En deload: preferir ejercicios para principiante
  if (phaseKey === 'deload') {
    const beginnerPool = pool.filter(ex => ex.level.includes('beginner'))
    if (beginnerPool.length > 0) pool = beginnerPool
  }

  // Para hipertrofia/fuerza: preferir lengthened load
  if (isHypertrophyOrStrength && phaseKey !== 'deload') {
    const lengthenedPool = pool.filter(ex => ex.isLengthenedLoad)
    if (lengthenedPool.length >= count) pool = lengthenedPool
    else if (lengthenedPool.length > 0) {
      // Mezcla: primero lengthened, luego resto
      const rest = pool.filter(ex => !ex.isLengthenedLoad)
      pool = [...lengthenedPool, ...rest]
    }
  }

  // Priorizar compuestos primero, luego aislamiento
  const compounds = pool.filter(ex => ex.type === 'compound')
  const isolations = pool.filter(ex => ex.type === 'isolation')
  pool = [...compounds, ...isolations]

  // Seleccionar 'count' ejercicios
  const selected = []
  for (const ex of pool) {
    if (selected.length >= count) break
    if (!selected.find(s => s.id === ex.id)) {
      selected.push(ex)
      usedIds.add(ex.id)
    }
  }

  return selected
}

// ── Construir un ejercicio de sesión ──────────────────────────
function buildSessionExercise(ex, phaseKey, objectives, environment, level, position) {
  const mainObj = resolveObjective(objectives)
  const ranges = REP_RANGES[mainObj] || REP_RANGES.general
  const rests  = REST_TIMES[mainObj]  || REST_TIMES.general
  const sets   = SETS_BY_PHASE[phaseKey] || SETS_BY_PHASE.p1

  const reps = ranges[phaseKey] || ranges.p1
  const rest = ex.type === 'compound' ? rests.compound : rests.isolation
  const numSets = (phaseKey === 'deload') ? sets.compound :
    (ex.type === 'compound' ? sets.compound : sets.isolation)

  const weightGuideObj = WEIGHT_GUIDE[environment] || WEIGHT_GUIDE.gym
  const muscleGuide = weightGuideObj[ex.muscle] || weightGuideObj.Pecho
  const weightGuide = muscleGuide[level] || muscleGuide.intermediate

  return {
    id: ex.id,
    name: ex.name,
    muscle: ex.muscle,
    equipment: ex.equipment.join(', ') || 'Peso corporal',
    type: ex.type,
    block: ex.block || ex.muscle,
    sets: numSets,
    reps,
    rest,
    weightGuide,
    notes: ex.notes || '',
    position  // posición en la sesión (para ajuste de fatiga)
  }
}

// ── Generador principal ───────────────────────────────────────
export function generatePlan(answers) {
  const {
    objectives   = ['general'],
    level        = 'intermediate',
    daysPerWeek  = 3,
    duration     = '60',
    environment  = 'gym',
    split        = 'fullbody',
    planWeeks    = 8
  } = answers

  const exPerSession  = EXERCISES_PER_DURATION[duration] || 5
  const templates     = SPLIT_TEMPLATES[split] || SPLIT_TEMPLATES.fullbody
  const phases        = buildPhaseStructure(planWeeks)
  const totalSessions = daysPerWeek * planWeeks

  const plan = {
    meta: {
      objectives,
      level,
      daysPerWeek,
      duration,
      environment,
      split,
      planWeeks,
      totalSessions,
      createdAt: new Date().toISOString().slice(0, 10)
    },
    phases: []
  }

  let sessionCounter = 1
  let templateIndex  = 0

  for (const phase of phases) {
    const phaseSessions = []
    const totalPhaseSessions = phase.weeks * daysPerWeek

    // Rastreo de ejercicios usados por semana
    let weeklyUsedIds = new Set()
    let dayInWeek = 0

    for (let s = 0; s < totalPhaseSessions; s++) {
      // Resetear usados al iniciar nueva semana
      if (dayInWeek > 0 && dayInWeek % daysPerWeek === 0) {
        weeklyUsedIds = new Set()
      }
      dayInWeek++

      // Ciclar templates
      const template = templates[templateIndex % templates.length]
      templateIndex++

      // Calcular cuántos ejercicios por bloque
      const blocks = template.blocks
      const exercisesForSession = []
      let position = 1

      // Distribuir ejercicios entre bloques
      const basePerBlock = Math.floor(exPerSession / blocks.length)
      let extra = exPerSession - basePerBlock * blocks.length

      for (const muscle of blocks) {
        const count = basePerBlock + (extra > 0 ? (extra--, 1) : 0)
        if (count <= 0) continue

        const exercises = pickExercises(
          muscle, count, environment, level,
          weeklyUsedIds, phase.phaseKey, objectives
        )

        for (const ex of exercises) {
          exercisesForSession.push(
            buildSessionExercise(ex, phase.phaseKey, objectives, environment, level, position)
          )
          position++
        }
      }

      phaseSessions.push({
        id: `s${sessionCounter}`,
        number: sessionCounter,
        name: template.name,
        phase: phase.number,
        exercises: exercisesForSession
      })

      sessionCounter++
    }

    plan.phases.push({
      number:   phase.number,
      name:     phase.name,
      weeks:    phase.weeks,
      isDeload: phase.isDeload,
      sessions: phaseSessions
    })
  }

  return plan
}

// ── Helpers de consulta ───────────────────────────────────────

/** Aplanar todas las sesiones del plan */
export function getAllSessions(plan) {
  return plan.phases.flatMap(ph => ph.sessions)
}

/** Obtener sesión por ID */
export function getSession(plan, sessionId) {
  return getAllSessions(plan).find(s => s.id === sessionId) || null
}

/** Siguiente sesión no completada */
export function getNextSession(plan, completedIds) {
  const completed = new Set(completedIds)
  return getAllSessions(plan).find(s => !completed.has(s.id)) || null
}

/** Info de progreso */
export function getPlanProgress(plan, completedIds) {
  const total = plan.meta.totalSessions
  const done  = completedIds.length
  return { total, done, pct: total > 0 ? Math.round((done / total) * 100) : 0 }
}

/** Aviso de ciclos para el onboarding */
export function getCycleWarning(split, daysPerWeek) {
  const types = (SPLIT_TEMPLATES[split] || []).length
  if (daysPerWeek <= types) return null
  return {
    splitTypes: types,
    cycleDays: daysPerWeek - types,
    totalDays: daysPerWeek
  }
}
