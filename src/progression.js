// ─────────────────────────────────────────────────────────────
// progression.js — Sistema de progresión inteligente de pesos
// Usa doble progresión: primero maximiza reps dentro del rango,
// luego sube peso cuando alcanza el tope del rango en todos los sets.
// ─────────────────────────────────────────────────────────────

// ── Pasos de incremento por tipo de ejercicio ─────────────────
// Lower body compounds (squat, deadlift, leg press): +5 kg
// Upper body compounds + aislamientos: +2.5 kg
const LOWER_BODY_MUSCLES = ['Cuádriceps', 'Isquiotibiales', 'Glúteo', 'Pantorrillas']

function getWeightStep(exerciseInfo = {}) {
  const { type, muscle } = exerciseInfo
  if (type === 'compound' && LOWER_BODY_MUSCLES.includes(muscle)) return 5
  return 2.5
}

// ── Parsear rango de reps: "8-12" → { min: 8, max: 12 } ──────
function parseRepRange(repsStr) {
  if (!repsStr) return { min: 8, max: 12 }
  const parts = String(repsStr).split('-')
  if (parts.length === 2) {
    return { min: parseInt(parts[0]) || 8, max: parseInt(parts[1]) || 12 }
  }
  const single = parseInt(parts[0]) || 10
  return { min: single, max: single }
}

// Mantener compatibilidad hacia atrás
function parseTargetReps(repsStr) {
  return parseRepRange(repsStr).max
}

// Promedio de reps
function avgReps(sets) {
  if (!sets || sets.length === 0) return 0
  const total = sets.reduce((sum, s) => sum + (parseInt(s.reps) || 0), 0)
  return total / sets.length
}

// Peso más reciente (primer set del log)
function lastWeight(sets) {
  if (!sets || sets.length === 0) return 0
  return parseFloat(sets[0].weight) || 0
}

// ─────────────────────────────────────────────────────────────
/**
 * calcNextRecommendation — Doble progresión con pasos variables
 *
 * Lógica:
 *   1. avg >= maxReps → subir peso (lograste el tope del rango en todos los sets)
 *   2. avg >= minReps → mantener peso (estás dentro del rango, sigue acumulando reps)
 *   3. avg >= minReps * 0.85 → mantener peso (muy cerca, no bajar aún)
 *   4. avg < minReps * 0.85 → bajar peso (peso excesivo para el rango)
 *
 * @param {string}  targetRepsStr  — rango objetivo, ej. "8-12"
 * @param {Array}   sets           — [{reps, weight}, ...] del log más reciente
 * @param {number}  position       — posición del ejercicio en la sesión (1-based)
 * @param {object}  exerciseInfo   — { type, muscle } para calcular el paso correcto
 */
export function calcNextRecommendation(targetRepsStr, sets, position = 1, exerciseInfo = {}) {
  if (!sets || sets.length === 0) {
    return {
      type: 'first_time', direction: 'eq', nextWeight: null,
      label: 'Primera vez',
      note: 'Usa la guía de peso del plan como referencia. Empieza conservador.'
    }
  }

  const { min: minReps, max: maxReps } = parseRepRange(targetRepsStr)
  const avg = avgReps(sets)
  const last = lastWeight(sets)
  const step = getWeightStep(exerciseInfo)

  let direction = 'eq'
  let nextWeight = last
  let note = ''

  if (avg >= maxReps) {
    // Tope del rango alcanzado en promedio → subir peso
    direction = 'up'
    nextWeight = last + step
    note = `Completaste el rango máximo (${Math.round(avg * 10) / 10} reps). ¡Hora de subir peso!`
  } else if (avg >= minReps) {
    // Dentro del rango → mantener, seguir acumulando reps
    direction = 'eq'
    nextWeight = last
    note = `Progresando dentro del rango (${Math.round(avg * 10) / 10}/${maxReps} reps). Cuando llegues a ${maxReps} en todos los sets, subirás peso.`
  } else if (avg >= minReps * 0.85) {
    // Justo por debajo del rango → mantener, falta poco
    direction = 'eq'
    nextWeight = last
    note = `Cerca del rango mínimo (${Math.round(avg * 10) / 10}/${minReps} reps). Mantén este peso y trabaja la técnica.`
  } else {
    // Por debajo del rango → bajar peso
    direction = 'down'
    nextWeight = Math.max(0, last - step)
    note = `El peso fue alto para el rango objetivo (${Math.round(avg * 10) / 10}/${minReps} reps). Reduce un poco para trabajar bien el rango.`
  }

  // ── Ajuste por fatiga acumulada (posición ≥ 3) ────────────
  if (position >= 3 && direction === 'down') {
    const isGenuineFailure = avg < minReps * 0.65
    if (!isGenuineFailure) {
      const fatigueFactor = Math.min(0.15, (position - 2) * 0.05)
      nextWeight = Math.round((last * (1 + fatigueFactor)) / step) * step
      direction = 'eq'
      note = `Ajuste por fatiga (posición ${position}): el rendimiento menor puede ser por cansancio acumulado, no por peso excesivo.`
    } else {
      note = 'Rendimiento muy bajo incluso considerando la fatiga. Considera reducir el peso base.'
    }
  }

  nextWeight = Math.max(0, Math.round(nextWeight / step) * step)

  const labels = {
    up:   `↑ Sube a ${nextWeight} kg (+${step} kg)`,
    eq:   `→ Mantén ${nextWeight} kg`,
    down: `↓ Baja a ${nextWeight} kg (-${step} kg)`
  }

  return {
    type: 'from_history',
    direction,
    nextWeight,
    label: labels[direction],
    note,
    avgReps: Math.round(avg * 10) / 10,
    minReps,
    maxReps,
    lastWeight: last,
    step
  }
}

// ─────────────────────────────────────────────────────────────
/**
 * calcCrossExRecommendation
 * Cuando no hay historial exacto del ejercicio, usa ejercicios
 * relacionados del mismo grupo muscular para estimar el peso inicial.
 */
export function calcCrossExRecommendation(weightGuide, relatedLogs, targetRepsStr, exerciseInfo = {}) {
  const step = getWeightStep(exerciseInfo)

  if (!relatedLogs || relatedLogs.length === 0) {
    return { type: 'guide_only', nextWeight: null, label: 'Usa la guía de peso del plan', note: '' }
  }

  const guideMatch = String(weightGuide).match(/(\d+)[\s\-–]+(\d+)/)
  if (!guideMatch) {
    return { type: 'guide_only', nextWeight: null, label: 'Usa la guía de peso del plan', note: '' }
  }

  const guideMin = parseFloat(guideMatch[1])
  const guideMax = parseFloat(guideMatch[2])
  const guideRange = guideMax - guideMin
  const { max: targetMax } = parseRepRange(targetRepsStr)

  const ratios = relatedLogs.map(log => {
    const avg = avgReps(log.sets)
    return avg / (log.targetReps || targetMax)
  })
  const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length

  let position = 0.5
  if (avgRatio >= 1.0)       position = 0.75
  else if (avgRatio >= 0.9)  position = 0.5
  else if (avgRatio >= 0.85) position = 0.35
  else                       position = 0.2

  const nextWeight = Math.round((guideMin + guideRange * position) / step) * step

  return {
    type: 'cross_exercise',
    nextWeight,
    label: `Estimado: ${nextWeight} kg (basado en músculo similar)`,
    note: 'Calculado a partir de tu rendimiento en ejercicios del mismo grupo muscular.'
  }
}

// ─────────────────────────────────────────────────────────────
/**
 * getRecommendationForExercise — función principal
 */
export function getRecommendationForExercise(exercise, allExLogs = []) {
  const { id, reps, weightGuide, muscle, type, position = 1 } = exercise
  const exerciseInfo = { type, muscle }

  // 1. Historial exacto del ejercicio
  const exactLogs = allExLogs
    .filter(log => log.exId === id)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))

  if (exactLogs.length > 0) {
    return {
      ...calcNextRecommendation(reps, exactLogs[0].sets, position, exerciseInfo),
      source: 'same_exercise'
    }
  }

  // 2. Ejercicios relacionados del mismo músculo
  const relatedLogs = allExLogs
    .filter(log => log.muscle === muscle && log.exId !== id)
    .map(log => ({ ...log, targetReps: parseRepRange(reps).max }))

  if (relatedLogs.length > 0) {
    return {
      ...calcCrossExRecommendation(weightGuide, relatedLogs, reps, exerciseInfo),
      source: 'same_muscle'
    }
  }

  // 3. Primera vez
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
