// ─────────────────────────────────────────────────────────────
// progression.js — Sistema de progresión inteligente de pesos
// ─────────────────────────────────────────────────────────────

const WEIGHT_STEP = 2.5  // kg de incremento/decremento estándar

/**
 * Parsear rango de reps como string, devuelve target numérico
 * "8-12" → 12 (tope del rango = objetivo a lograr)
 * "3-5"  → 5
 * "20"   → 20
 */
function parseTargetReps(repsStr) {
  if (!repsStr) return 10
  const parts = String(repsStr).split('-')
  return parseInt(parts[parts.length - 1]) || 10
}

/**
 * Promedio de reps de los sets registrados
 */
function avgReps(sets) {
  if (!sets || sets.length === 0) return 0
  const total = sets.reduce((sum, s) => sum + (parseInt(s.reps) || 0), 0)
  return total / sets.length
}

/**
 * Peso más reciente usado en el ejercicio (último set del primer set)
 */
function lastWeight(sets) {
  if (!sets || sets.length === 0) return 0
  return parseFloat(sets[0].weight) || 0
}

// ─────────────────────────────────────────────────────────────
/**
 * calcNextRecommendation
 * Calcula la recomendación de peso para la próxima sesión.
 *
 * @param {string} targetRepsStr  — rango objetivo, ej. "8-12"
 * @param {Array}  sets           — [{reps, weight}, ...] del log más reciente
 * @param {number} position       — posición del ejercicio en la sesión (1-based)
 * @returns {{ direction, nextWeight, label, note, type }}
 */
export function calcNextRecommendation(targetRepsStr, sets, position = 1) {
  if (!sets || sets.length === 0) {
    return { type: 'first_time', direction: 'eq', nextWeight: null, label: 'Primera vez', note: 'Usa la guía de peso del plan como referencia.' }
  }

  const targetReps = parseTargetReps(targetRepsStr)
  const avg = avgReps(sets)
  const last = lastWeight(sets)

  let direction = 'eq'
  let nextWeight = last
  let note = ''

  if (avg >= targetReps) {
    direction = 'up'
    nextWeight = last + WEIGHT_STEP
  } else if (avg >= targetReps * 0.85) {
    direction = 'eq'
    nextWeight = last
  } else {
    direction = 'down'
    nextWeight = Math.max(0, last - WEIGHT_STEP)
  }

  // ── Ajuste por fatiga acumulada (posición ≥ 3) ────────────
  if (position >= 3 && direction === 'down') {
    const isGenuineFailure = avg < targetReps * 0.65

    if (!isGenuineFailure) {
      // Fatiga probable, no fallo genuino: corregir hacia arriba
      const fatigueFactor = Math.min(0.15, (position - 2) * 0.05)
      nextWeight = Math.round((last * (1 + fatigueFactor)) / WEIGHT_STEP) * WEIGHT_STEP
      direction = 'eq'
      note = `Ajuste por fatiga (posición ${position}): el rendimiento menor puede ser por cansancio acumulado.`
    } else {
      note = 'Rendimiento muy bajo incluso considerando la fatiga. El peso base puede ser demasiado alto.'
    }
  }

  nextWeight = Math.max(0, Math.round(nextWeight / WEIGHT_STEP) * WEIGHT_STEP)

  const labels = {
    up:   `↑ Sube a ${nextWeight} kg`,
    eq:   `→ Mantén ${nextWeight} kg`,
    down: `↓ Baja a ${nextWeight} kg`
  }

  return {
    type: 'from_history',
    direction,
    nextWeight,
    label: labels[direction],
    note,
    avgReps: Math.round(avg * 10) / 10,
    targetReps,
    lastWeight: last
  }
}

// ─────────────────────────────────────────────────────────────
/**
 * calcCrossExRecommendation
 * Cuando no hay historial exacto del ejercicio, usa ejercicios
 * relacionados del mismo grupo muscular para estimar el peso inicial.
 *
 * @param {string} weightGuide    — ej. "40-60 kg"
 * @param {Array}  relatedLogs    — logs de otros ejercicios del mismo músculo
 * @param {string} targetRepsStr  — objetivo de reps
 * @returns {{ nextWeight, label, type }}
 */
export function calcCrossExRecommendation(weightGuide, relatedLogs, targetRepsStr) {
  if (!relatedLogs || relatedLogs.length === 0) {
    return { type: 'guide_only', nextWeight: null, label: 'Usa la guía de peso del plan', note: '' }
  }

  // Extraer min y max del guide
  const guideMatch = String(weightGuide).match(/(\d+)[\s\-–]+(\d+)/)
  if (!guideMatch) {
    return { type: 'guide_only', nextWeight: null, label: 'Usa la guía de peso del plan', note: '' }
  }

  const guideMin = parseFloat(guideMatch[1])
  const guideMax = parseFloat(guideMatch[2])
  const guideRange = guideMax - guideMin

  const targetReps = parseTargetReps(targetRepsStr)

  // Calcular ratio promedio de rendimiento en ejercicios relacionados
  const ratios = relatedLogs.map(log => {
    const avg = avgReps(log.sets)
    return avg / (log.targetReps || targetReps)
  })
  const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length

  let position = 0.5  // default: 50% del rango
  if (avgRatio >= 1.0)  position = 0.75
  else if (avgRatio >= 0.9) position = 0.5
  else if (avgRatio >= 0.85) position = 0.35
  else position = 0.2

  const nextWeight = Math.round((guideMin + guideRange * position) / WEIGHT_STEP) * WEIGHT_STEP

  return {
    type: 'cross_exercise',
    nextWeight,
    label: `📊 Estimado: ${nextWeight} kg (basado en músculo similar)`,
    note: 'Calculado a partir de tu rendimiento en ejercicios del mismo grupo muscular.'
  }
}

// ─────────────────────────────────────────────────────────────
/**
 * getRecommendationForExercise
 * Función principal — determina qué tipo de recomendación dar.
 *
 * @param {object} exercise     — ejercicio del plan (con id, reps, weightGuide, muscle, position)
 * @param {Array}  allExLogs    — todos los exercise logs del usuario
 * @returns {object} recomendación
 */
export function getRecommendationForExercise(exercise, allExLogs = []) {
  const { id, reps, weightGuide, muscle, position = 1 } = exercise

  // 1. Buscar historial exacto del ejercicio (sesiones anteriores)
  const exactLogs = allExLogs
    .filter(log => log.exId === id)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))

  if (exactLogs.length > 0) {
    const mostRecent = exactLogs[0]
    return {
      ...calcNextRecommendation(reps, mostRecent.sets, position),
      source: 'same_exercise'
    }
  }

  // 2. Buscar ejercicios relacionados del mismo músculo
  const relatedLogs = allExLogs
    .filter(log => log.muscle === muscle && log.exId !== id)
    .map(log => ({ ...log, targetReps: parseTargetReps(reps) }))

  if (relatedLogs.length > 0) {
    return {
      ...calcCrossExRecommendation(weightGuide, relatedLogs, reps),
      source: 'same_muscle'
    }
  }

  // 3. Primera vez absoluta
  return {
    type: 'first_time',
    direction: 'eq',
    nextWeight: null,
    label: 'Primera vez',
    note: 'Usa la guía de peso del plan como referencia. Empieza conservador.',
    source: 'first_time'
  }
}

/** Formato de display para una recomendación */
export function formatRecommendation(rec) {
  if (!rec) return ''
  const icons = { up: '📈', eq: '→', down: '📉', first_time: '🆕' }
  const icon = icons[rec.type] || icons[rec.direction] || '→'
  return `${icon} ${rec.label}`
}
