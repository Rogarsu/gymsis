// ─────────────────────────────────────────────────────────────
// planner.js — Generador de plan de entrenamiento personalizado
// ─────────────────────────────────────────────────────────────
import { getByMuscle } from './exercises.js'
import { TRAINING_METHODS, applyModifiers } from './methods.js'

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
      blocks: ['Pecho', 'Espalda', 'Hombros', 'Tríceps', 'Core']
    },
    {
      name: 'Tren Superior B',
      blocks: ['Espalda', 'Pecho', 'Hombros', 'Bíceps', 'Core']
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
      blocks: ['Pecho', 'Espalda', 'Hombros', 'Tríceps', 'Core']
    },
    {
      name: 'Inferior A',
      blocks: ['Cuádriceps', 'Isquiotibiales', 'Pantorrillas']
    },
    {
      name: 'Superior B',
      blocks: ['Espalda', 'Pecho', 'Hombros', 'Bíceps', 'Core']
    },
    {
      name: 'Inferior B',
      blocks: ['Glúteo', 'Isquiotibiales', 'Core']
    }
  ],
  ppl: [
    {
      name: 'Push A (Empuje)',
      blocks: ['Pecho', 'Hombros', 'Tríceps', 'Core']
    },
    {
      name: 'Pull A (Jalón)',
      blocks: ['Espalda', 'Bíceps', 'Core']
    },
    {
      name: 'Legs A (Piernas)',
      blocks: ['Cuádriceps', 'Isquiotibiales', 'Pantorrillas']
    },
    {
      name: 'Push B (Empuje)',
      blocks: ['Hombros', 'Pecho', 'Tríceps', 'Core']
    },
    {
      name: 'Pull B (Jalón)',
      blocks: ['Espalda', 'Bíceps', 'Core']
    },
    {
      name: 'Legs B (Piernas)',
      blocks: ['Glúteo', 'Isquiotibiales', 'Core']
    }
  ]
}

// ── Fases por duración del plan ──────────────────────────────
const PHASE_DESCRIPTIONS = {
  p1: 'Enfócate en aprender la técnica de cada ejercicio con cargas moderadas. Tu sistema nervioso se está adaptando a los movimientos. La última repetición debe ser desafiante pero siempre controlada.',
  p2: 'Aumentamos el volumen para maximizar el estímulo muscular. Sube el peso cuando las últimas reps se sientan fáciles (RPE < 7). El progreso aquí es la clave del plan.',
  p3: 'Fase de máxima intensidad. Trabaja cerca del fallo en cada serie (RPE 8-9). Las cargas son más altas y los descansos más largos — no los recortes.',
  deload: 'Semana de descarga activa. Reduce el peso un 40-50% y enfócate en la técnica. El crecimiento real ocurre durante la recuperación: no te saltes esta semana.'
}

function buildPhaseStructure(totalWeeks) {
  if (totalWeeks === 4) {
    return [
      { number: 1, name: 'Fase 1 — Adaptación', weeks: 2, phaseKey: 'p1', isDeload: false, description: PHASE_DESCRIPTIONS.p1 },
      { number: 2, name: 'Fase 2 — Desarrollo',  weeks: 2, phaseKey: 'p2', isDeload: false, description: PHASE_DESCRIPTIONS.p2 }
    ]
  }
  if (totalWeeks === 8) {
    return [
      { number: 1, name: 'Fase 1 — Adaptación', weeks: 4, phaseKey: 'p1', isDeload: false, description: PHASE_DESCRIPTIONS.p1 },
      { number: 2, name: 'Fase 2 — Desarrollo',  weeks: 3, phaseKey: 'p2', isDeload: false, description: PHASE_DESCRIPTIONS.p2 },
      { number: 3, name: 'Fase 3 — Deload',       weeks: 1, phaseKey: 'deload', isDeload: true, description: PHASE_DESCRIPTIONS.deload }
    ]
  }
  // 12 semanas
  return [
    { number: 1, name: 'Fase 1 — Adaptación',      weeks: 4, phaseKey: 'p1', isDeload: false, description: PHASE_DESCRIPTIONS.p1 },
    { number: 2, name: 'Fase 2 — Desarrollo',       weeks: 4, phaseKey: 'p2', isDeload: false, description: PHASE_DESCRIPTIONS.p2 },
    { number: 3, name: 'Fase 3 — Intensificación',  weeks: 3, phaseKey: 'p3', isDeload: false, description: PHASE_DESCRIPTIONS.p3 },
    { number: 4, name: 'Fase 4 — Deload',           weeks: 1, phaseKey: 'deload', isDeload: true, description: PHASE_DESCRIPTIONS.deload }
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

// ── Peso de dificultad por fase ───────────────────────────────
// Devuelve un score de preferencia: menor = más preferido en esa fase
// No filtra el pool — solo ordena para que salgan los apropiados primero
function difficultyScore(ex, phaseKey, userLevel) {
  const levels    = ['beginner', 'intermediate', 'advanced']
  const userIdx   = levels.indexOf(userLevel)   // 0, 1, 2

  // Índice de dificultad del ejercicio (mínimo nivel requerido)
  const exIdx = ex.level.includes('beginner')     ? 0
              : ex.level.includes('intermediate')  ? 1
              : 2

  if (phaseKey === 'deload') {
    // Deload: preferir los más simples
    return exIdx
  }
  if (phaseKey === 'p1') {
    // Adaptación: preferir 1 nivel por debajo del usuario
    const target = Math.max(0, userIdx - 1)
    return Math.abs(exIdx - target)
  }
  if (phaseKey === 'p2') {
    // Desarrollo: preferir el nivel exacto del usuario
    return Math.abs(exIdx - userIdx)
  }
  if (phaseKey === 'p3') {
    // Intensificación: preferir el nivel del usuario o superior
    return exIdx >= userIdx ? 0 : (userIdx - exIdx)
  }
  return Math.abs(exIdx - userIdx)
}

// ── Seleccionar ejercicios para un bloque ─────────────────────
// planUsedCounts:        Map<exId, usageCount> — rastrea uso en todo el plan para rotar
// weekUsedIds:           Set<exId>             — evita repetir dentro de la misma semana
// sessionMovementPatterns: Set<string>         — penaliza patrones de movimiento repetidos en la sesión
// sessionIndex:          número de sesión global (para desempate pseudo-aleatorio)
function pickExercises(muscle, count, environment, level, planUsedCounts, weekUsedIds, phaseKey, objectives, sessionIndex, sessionMovementPatterns) {
  const mainObj = resolveObjective(objectives)
  const isHypertrophyOrStrength = ['muscle', 'strength'].includes(mainObj)

  // 1. Pool completo del nivel del usuario (sin filtro duro por fase)
  let pool = getByMuscle(muscle, environment, level)
  if (pool.length === 0) pool = getByMuscle(muscle, 'any', level)

  // 2. Para hipertrofia/fuerza: incluir lengthened load en el pool con preferencia
  //    (se refleja en el sort, no se filtra)

  // 3. Ordenar por criterios combinados:
  //    (a) compuestos primero
  //    (b) no usado esta semana
  //    (c) patrón de movimiento no repetido en la sesión
  //    (d) dificultad apropiada para la fase
  //    (e) penalización por uso excesivo en el plan
  //    (f) desempate con sessionIndex para rotar semana a semana
  pool.sort((a, b) => {
    // [1] Tipo: compuesto > aislamiento
    const aComp = a.type === 'compound' ? 0 : 1
    const bComp = b.type === 'compound' ? 0 : 1
    if (aComp !== bComp) return aComp - bComp

    // [2] No usado esta semana > ya usado esta semana
    const aWeek = weekUsedIds.has(a.id) ? 1 : 0
    const bWeek = weekUsedIds.has(b.id) ? 1 : 0
    if (aWeek !== bWeek) return aWeek - bWeek

    // [3] Penalizar patrón de movimiento repetido en la sesión actual
    if (sessionMovementPatterns) {
      const aRepeat = (a.movementPattern && sessionMovementPatterns.has(a.movementPattern)) ? 1 : 0
      const bRepeat = (b.movementPattern && sessionMovementPatterns.has(b.movementPattern)) ? 1 : 0
      if (aRepeat !== bRepeat) return aRepeat - bRepeat
    }

    // [4] Penalización por uso excesivo (>3 veces → penalización exponencial)
    const aRaw = planUsedCounts.get(a.id) || 0
    const bRaw = planUsedCounts.get(b.id) || 0
    const aPenalty = aRaw >= 3 ? aRaw * 5 : aRaw
    const bPenalty = bRaw >= 3 ? bRaw * 5 : bRaw
    if (aPenalty !== bPenalty) return aPenalty - bPenalty

    // [5] Dificultad apropiada para la fase
    const aDiff = difficultyScore(a, phaseKey, level)
    const bDiff = difficultyScore(b, phaseKey, level)
    if (aDiff !== bDiff) return aDiff - bDiff

    // [6] Para hipertrofia/fuerza: preferir lengthened load
    if (isHypertrophyOrStrength && phaseKey !== 'deload') {
      const aLen = a.isLengthenedLoad ? 0 : 1
      const bLen = b.isLengthenedLoad ? 0 : 1
      if (aLen !== bLen) return aLen - bLen
    }

    // [7] Desempate rotativo por sessionIndex
    return (a.id.charCodeAt(0) + sessionIndex) % 5 - 2
  })

  // Seleccionar 'count' ejercicios únicos
  const selected = []
  for (const ex of pool) {
    if (selected.length >= count) break
    if (!selected.find(s => s.id === ex.id)) {
      selected.push(ex)
      weekUsedIds.add(ex.id)
      planUsedCounts.set(ex.id, (planUsedCounts.get(ex.id) || 0) + 1)
      if (sessionMovementPatterns && ex.movementPattern) {
        sessionMovementPatterns.add(ex.movementPattern)
      }
    }
  }

  return selected
}

// ── Construir un ejercicio de sesión ──────────────────────────
function buildSessionExercise(ex, phaseKey, objectives, environment, level, position, methodConfig, templateIndex) {
  const mainObj = resolveObjective(objectives)

  // Use method config if available, otherwise fall back to legacy tables
  let reps, rest, numSets
  if (methodConfig) {
    const repRanges = methodConfig.repRanges

    // DUP: vary rep range per template index (0=hypertrophy, 1=strength, 2=endurance)
    if (methodConfig.id === 'dup' && phaseKey !== 'deload') {
      const dupCycle = (templateIndex || 0) % 3
      if (dupCycle === 0) reps = '8-12'
      else if (dupCycle === 1) reps = '4-6'
      else reps = '14-18'
    } else {
      reps = repRanges[phaseKey] || repRanges.p1
    }

    // Rest times from method (in seconds, stored as label string for display)
    const restSec = ex.type === 'compound'
      ? methodConfig.restSeconds.compound
      : methodConfig.restSeconds.isolation
    rest = ex.type === 'compound'
      ? methodConfig.restLabel.compound
      : methodConfig.restLabel.isolation

    // Sets from method
    const baseSets = ex.type === 'compound' ? methodConfig.sets.compound : methodConfig.sets.isolation
    numSets = phaseKey === 'deload' ? Math.max(2, Math.round(baseSets * 0.6)) : baseSets

    // Isolation exercises get higher rep ranges (+4 each end) except pure_strength
    if (ex.type === 'isolation' && methodConfig.id !== 'pure_strength') {
      const parts = reps.split('-').map(Number)
      if (parts.length === 2) reps = `${parts[0] + 4}-${parts[1] + 4}`
    }
  } else {
    // Legacy fallback
    const ranges = REP_RANGES[mainObj] || REP_RANGES.general
    const rests  = REST_TIMES[mainObj]  || REST_TIMES.general
    const sets   = SETS_BY_PHASE[phaseKey] || SETS_BY_PHASE.p1
    reps = ranges[phaseKey] || ranges.p1
    rest = ex.type === 'compound' ? rests.compound : rests.isolation
    numSets = (phaseKey === 'deload') ? sets.compound :
      (ex.type === 'compound' ? sets.compound : sets.isolation)
  }

  const weightGuideObj = WEIGHT_GUIDE[environment] || WEIGHT_GUIDE.gym
  const muscleGuide = weightGuideObj[ex.muscle] || weightGuideObj.Pecho
  const weightGuide = muscleGuide[level] || muscleGuide.intermediate

  return {
    id: ex.id,
    name: ex.name,
    muscle: ex.muscle,
    equipment: ex.equipment.join(', ') || 'Peso corporal',
    type: ex.type,
    movementPattern: ex.movementPattern || '',
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
    planWeeks    = 8,
    methodId,
    modifiers    = []
  } = answers

  // Resolve method config (new smart onboarding) or fall back to legacy
  let methodConfig = null
  if (methodId && TRAINING_METHODS[methodId]) {
    methodConfig = applyModifiers(methodId, modifiers)
  }

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
      methodId: methodId || null,
      modifiers,
      createdAt: new Date().toISOString().slice(0, 10),
      rpeNote: 'Elige un peso con el que llegues cerca del fallo en la última serie (RPE 8-9). La última rep debe ser difícil pero técnicamente correcta. Si completas todas las reps con facilidad, sube el peso.'
    },
    phases: []
  }

  let sessionCounter = 1
  let templateIndex  = 0

  // Rastreo de uso en todo el plan (para rotar ejercicios entre semanas)
  const planUsedCounts = new Map()

  for (const phase of phases) {
    const phaseSessions = []
    const totalPhaseSessions = phase.weeks * daysPerWeek

    // Rastreo de ejercicios usados esta semana (evita repetir en misma semana)
    let weekUsedIds = new Set()
    let dayInWeek = 0

    for (let s = 0; s < totalPhaseSessions; s++) {
      // Resetear usados al iniciar nueva semana
      if (dayInWeek > 0 && dayInWeek % daysPerWeek === 0) {
        weekUsedIds = new Set()
      }
      dayInWeek++

      // Ciclar templates
      const template = templates[templateIndex % templates.length]
      const currentTemplateIndex = templateIndex
      templateIndex++

      // Calcular cuántos ejercicios por bloque
      const blocks = template.blocks
      const exercisesForSession = []
      let position = 1

      // Distribuir ejercicios entre bloques
      const basePerBlock = Math.floor(exPerSession / blocks.length)
      let extra = exPerSession - basePerBlock * blocks.length

      // Rastrear patrones de movimiento usados en esta sesión (evita 3× horizontal push, etc.)
      const sessionMovementPatterns = new Set()

      for (const muscle of blocks) {
        const count = basePerBlock + (extra > 0 ? (extra--, 1) : 0)
        if (count <= 0) continue

        const exercises = pickExercises(
          muscle, count, environment, level,
          planUsedCounts, weekUsedIds, phase.phaseKey, objectives, sessionCounter,
          sessionMovementPatterns
        )

        for (const ex of exercises) {
          exercisesForSession.push(
            buildSessionExercise(ex, phase.phaseKey, objectives, environment, level, position, methodConfig, currentTemplateIndex)
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
      number:      phase.number,
      name:        phase.name,
      weeks:       phase.weeks,
      isDeload:    phase.isDeload,
      description: phase.description || '',
      sessions:    phaseSessions
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
