// methods.js — Training method engine
// 6 methods, assignment logic, profile summary generator

import { ic } from './icons.js'

export const TRAINING_METHODS = {
  linear_progression: {
    id: 'linear_progression',
    name: 'Progresión Lineal',
    icon: 'trending-up',
    tagline: 'Construye tu base de fuerza y técnica',
    description: 'El método más efectivo para principiantes. Progresas en peso o reps cada sesión, construyendo fuerza y técnica de forma acelerada. Tu sistema neuromuscular responde rápido a nuevos estímulos — aprovéchalo.',
    repRanges: { p1: '4-6', p2: '6-8', p3: '8-10', deload: '10-12' },
    sets: { compound: 3, isolation: 3 },
    restSeconds: { compound: 150, isolation: 90 },
    restLabel: { compound: '2–3 min', isolation: '90 seg' },
    weightPct: '75–85%',
    deloadEvery: 4,
    progressionRule: 'linear',
    nutrition: {
      proteinPerKg: '1.6–2.0',
      calories: 'Mantenimiento o ligero superávit (+150–200 kcal)',
      carbStrategy: 'Prioriza carbohidratos pre y post-entreno',
      fatStrategy: 'Grasas saludables en comidas lejanas al entreno'
    },
    hydration: {
      before: '400–500 ml, 30 min antes',
      during: '200 ml cada 20 min',
      after: '500 ml en la hora post-entreno'
    },
    recovery: {
      sleep: '7–8 horas',
      betweenSessions: '48h mínimo entre sesiones del mismo grupo',
      tip: 'La recuperación es donde creces. Sin sueño, sin progreso.'
    }
  },
  pure_strength: {
    id: 'pure_strength',
    name: 'Fuerza Pura',
    icon: 'zap',
    tagline: 'Máxima fuerza neuromuscular',
    description: 'Trabajo con cargas del 85–100% de tu máximo. Pocas repeticiones, mucho peso, descansos largos. Desarrolla fuerza neuromuscular, densidad ósea y reclutamiento máximo de unidades motoras. Requiere técnica perfecta.',
    repRanges: { p1: '4-5', p2: '3-4', p3: '1-3', deload: '5-6' },
    sets: { compound: 5, isolation: 3 },
    restSeconds: { compound: 240, isolation: 150 },
    restLabel: { compound: '3–5 min', isolation: '2–3 min' },
    weightPct: '85–100%',
    deloadEvery: 3,
    progressionRule: 'strength',
    nutrition: {
      proteinPerKg: '1.8–2.2',
      calories: 'Superávit moderado (+250–400 kcal) para soportar alta intensidad',
      carbStrategy: 'Carbohidratos altos en días de entreno (60–80g pre-entreno)',
      fatStrategy: 'Grasas omega-3 para reducir inflamación articular'
    },
    hydration: {
      before: '500 ml, 45 min antes',
      during: '200–300 ml cada 20 min',
      after: '600–700 ml en la hora post-entreno'
    },
    recovery: {
      sleep: '8–9 horas (reparación muscular intensiva)',
      betweenSessions: '72h entre sesiones del mismo movimiento primario',
      tip: 'Con cargas máximas, el sistema nervioso necesita más recuperación que el músculo.'
    }
  },
  hypertrophy: {
    id: 'hypertrophy',
    name: 'Hipertrofia Clásica',
    icon: 'biceps-flexed',
    tagline: 'Máximo crecimiento muscular',
    description: 'El rango 6–12 reps es el más estudiado para estimular la síntesis de proteínas musculares. Combina tensión mecánica, estrés metabólico y daño muscular en la proporción óptima para crecer.',
    repRanges: { p1: '10-12', p2: '8-10', p3: '6-8', deload: '12-15' },
    sets: { compound: 4, isolation: 3 },
    restSeconds: { compound: 90, isolation: 75 },
    restLabel: { compound: '75–90 seg', isolation: '60–75 seg' },
    weightPct: '65–80%',
    deloadEvery: 4,
    progressionRule: 'double_progression',
    nutrition: {
      proteinPerKg: '1.8–2.0',
      calories: 'Superávit limpio (+200–300 kcal). Más calorías = más músculo + algo de grasa',
      carbStrategy: 'Carbohidratos moderados-altos. 40–60g pre-entreno, 40–60g post-entreno',
      fatStrategy: '25–30% de calorías en grasas saludables'
    },
    hydration: {
      before: '500 ml, 30 min antes',
      during: '200 ml cada 20 min',
      after: '500 ml en la hora post-entreno'
    },
    recovery: {
      sleep: '7–9 horas',
      betweenSessions: '48h entre sesiones del mismo grupo muscular',
      tip: 'La síntesis proteica post-entreno dura 24–48h. Come proteína distribuida en 4–5 comidas.'
    }
  },
  dup: {
    id: 'dup',
    name: 'Periodización Ondulante (DUP)',
    icon: 'activity',
    tagline: 'El método más completo para avanzados',
    description: 'Varía intensidad y volumen en cada sesión de la semana: un día de fuerza (4–6 reps), uno de hipertrofia (8–12 reps) y uno de resistencia muscular (14–18 reps). Previene la adaptación y maximiza todos los estímulos musculares.',
    repRanges: { p1: '8-12', p2: '4-6', p3: '14-18', deload: '15-20' },
    sets: { compound: 4, isolation: 3 },
    restSeconds: { compound: 105, isolation: 75 },
    restLabel: { compound: '90–120 seg', isolation: '60–90 seg' },
    weightPct: 'varía por día',
    deloadEvery: 3,
    progressionRule: 'dup',
    nutrition: {
      proteinPerKg: '1.8–2.2',
      calories: 'Superávit en días de fuerza (+300 kcal), mantenimiento en días de resistencia',
      carbStrategy: 'Cicla carbohidratos: altos en días de fuerza, moderados en días de resistencia',
      fatStrategy: 'Grasas estables. No restringas en días de alta intensidad'
    },
    hydration: {
      before: '500 ml, 30–45 min antes',
      during: '200–300 ml cada 20 min',
      after: '500–700 ml en la hora post-entreno'
    },
    recovery: {
      sleep: '8–9 horas (crítico con DUP)',
      betweenSessions: 'Al menos 1 día de descanso entre sesiones intensas',
      tip: 'DUP requiere monitoreo constante. Si notas fatiga acumulada, prioriza el día de resistencia.'
    }
  },
  fat_loss: {
    id: 'fat_loss',
    name: 'Pérdida de Grasa / Metabólico',
    icon: 'flame',
    tagline: 'Quema calorías y preserva músculo',
    description: 'Alto volumen de reps con descansos cortos maximiza el gasto calórico durante y después del entreno (efecto EPOC). El objetivo es quemar grasa preservando la masa muscular existente.',
    repRanges: { p1: '15-20', p2: '12-15', p3: '12-15', deload: '15-20' },
    sets: { compound: 3, isolation: 3 },
    restSeconds: { compound: 52, isolation: 37 },
    restLabel: { compound: '45–60 seg', isolation: '30–45 seg' },
    weightPct: '50–65%',
    deloadEvery: 4,
    progressionRule: 'metabolic',
    nutrition: {
      proteinPerKg: '2.0–2.4 (alto para preservar músculo en déficit)',
      calories: 'Déficit de 300–500 kcal/día. No reduzcas más para preservar músculo',
      carbStrategy: 'Carbohidratos solo pre y post-entreno. Resto del día proteínas y grasas',
      fatStrategy: 'Grasas saludables moderadas. Evita grasas saturadas en exceso'
    },
    hydration: {
      before: '500 ml, 30 min antes',
      during: '300 ml cada 15–20 min (descansos cortos = más sudoración)',
      after: '600 ml en la hora post-entreno'
    },
    recovery: {
      sleep: '7–8 horas (el déficit calórico dificulta la recuperación)',
      betweenSessions: '24–48h — puedes entrenar con más frecuencia con este método',
      tip: 'En déficit calórico, la recuperación es más lenta. No hagas más de 5 sesiones por semana.'
    }
  },
  recomp: {
    id: 'recomp',
    name: 'Recomposición Corporal',
    icon: 'scale',
    tagline: 'Pierde grasa y gana músculo a la vez',
    description: 'Combina suficiente volumen para estimular crecimiento muscular con la densidad necesaria para quemar grasa. Requiere nutrición precisa: calorías de mantenimiento, proteína alta y carbohidratos ciclados.',
    repRanges: { p1: '12-15', p2: '10-12', p3: '8-10', deload: '8-10' },
    sets: { compound: 3, isolation: 3 },
    restSeconds: { compound: 82, isolation: 60 },
    restLabel: { compound: '75–90 seg', isolation: '60 seg' },
    weightPct: '60–70%',
    deloadEvery: 4,
    progressionRule: 'double_progression',
    nutrition: {
      proteinPerKg: '2.0–2.4 (fundamental para recomp)',
      calories: 'Mantenimiento calórico o +100 kcal en días de entreno',
      carbStrategy: 'Carbohidratos antes y después del entreno. Resto del día: proteínas y grasas',
      fatStrategy: 'Grasas moderadas. Omega-3 para reducir inflamación'
    },
    hydration: {
      before: '500 ml, 30 min antes',
      during: '200 ml cada 20 min',
      after: '500 ml en la hora post-entreno'
    },
    recovery: {
      sleep: '7–9 horas',
      betweenSessions: '48h entre sesiones del mismo grupo muscular',
      tip: 'La recomp es el proceso más lento. Requiere consistencia durante meses, no semanas.'
    }
  }
}

// ── Method Assignment Engine ──────────────────────────────────

export function assignMethod(answers) {
  const { objective, experience, bodyComposition, sleep, stress, job, age } = answers

  let methodId

  // ── Principiantes ─────────────────────────────────────────
  // Respetan su meta para fat_loss/recomp; para todo lo demás
  // la progresión lineal construye la base neuromuscular primero.
  if (experience === 'beginner') {
    if (objective === 'fat_loss' || bodyComposition === 'overweight') {
      methodId = 'fat_loss'       // 15-20 reps, descansos cortos — respeta la meta
    } else if (objective === 'recomp') {
      methodId = 'recomp'         // rango mixto — respeta la meta
    } else {
      methodId = 'linear_progression' // strength/muscle/endurance/general → base primero
    }
  }
  // ── Fuerza (intermedio + avanzado) ────────────────────────
  // pure_strength desde intermedio: el rango 1-5 reps con alta carga
  // es exactamente lo que necesita alguien con objetivo de fuerza.
  else if (objective === 'strength') {
    methodId = 'pure_strength'
  }
  // ── Músculo/hipertrofia ────────────────────────────────────
  else if (objective === 'muscle') {
    if (bodyComposition === 'overweight') {
      // Sobrepeso + músculo → recomp: perder grasa y ganar músculo a la vez
      methodId = 'recomp'
    } else {
      const goodRecovery = sleep === 'good' && stress !== 'high'
      methodId = (experience === 'advanced' && goodRecovery) ? 'dup' : 'hypertrophy'
    }
  }
  // ── Pérdida de grasa ──────────────────────────────────────
  else if (objective === 'fat_loss' || bodyComposition === 'overweight') {
    methodId = 'fat_loss'
  }
  // ── Recomposición corporal ────────────────────────────────
  else if (objective === 'recomp') {
    methodId = 'recomp'
  }
  // ── Resistencia muscular ──────────────────────────────────
  // fat_loss = alto volumen + descansos cortos = endurance metabólica
  else if (objective === 'endurance') {
    methodId = 'fat_loss'
  }
  // ── Salud general ─────────────────────────────────────────
  else {
    methodId = 'hypertrophy'
  }

  // ── Modifiers ──────────────────────────────────────────────
  const modifiers = []
  const ageNum = parseInt(age) || 25

  if (ageNum >= 46) {
    modifiers.push({ type: 'age_46plus', extraRestSec: 60, setsReduction: 1, label: 'Edad 46+: más descanso y volumen moderado' })
  } else if (ageNum >= 36) {
    modifiers.push({ type: 'age_36plus', extraRestSec: 30, setsReduction: 0, label: 'Edad 36+: descanso adicional entre series' })
  }

  const poorRecovery = sleep === 'poor' || (stress === 'high' && sleep !== 'good')
  if (poorRecovery) {
    modifiers.push({ type: 'low_recovery', volumeReduction: 0.2, deloadEvery: 3, label: 'Recuperación baja: volumen reducido, deload más frecuente' })
  }

  if (job === 'active') {
    modifiers.push({ type: 'active_job', daysReduction: 1, label: 'Trabajo físico: una sesión menos por semana recomendada' })
  }

  return { methodId, modifiers }
}

// Apply modifiers to a method config copy
export function applyModifiers(methodId, modifiers) {
  const base = TRAINING_METHODS[methodId]
  if (!base) return TRAINING_METHODS.hypertrophy

  const m = JSON.parse(JSON.stringify(base)) // deep clone

  for (const mod of modifiers) {
    if (mod.extraRestSec) {
      m.restSeconds.compound += mod.extraRestSec
      m.restSeconds.isolation += Math.round(mod.extraRestSec * 0.5)
      // Update labels
      const compMin = Math.round(m.restSeconds.compound / 60 * 10) / 10
      m.restLabel.compound = `~${compMin} min`
      m.restLabel.isolation = `~${Math.round(m.restSeconds.isolation / 60 * 10) / 10} min`
    }
    if (mod.setsReduction) {
      m.sets.compound = Math.max(2, m.sets.compound - mod.setsReduction)
      m.sets.isolation = Math.max(2, m.sets.isolation - mod.setsReduction)
    }
    if (mod.volumeReduction) {
      m.sets.compound = Math.max(2, Math.round(m.sets.compound * (1 - mod.volumeReduction)))
      m.sets.isolation = Math.max(2, Math.round(m.sets.isolation * (1 - mod.volumeReduction)))
      if (mod.deloadEvery) m.deloadEvery = mod.deloadEvery
    }
  }

  return m
}

// ── Profile Summary Generator ─────────────────────────────────

const METHOD_REASONS = {
  linear_progression: (a) => {
    return `Eres principiante — y eso es una ventaja enorme. En esta etapa tu cuerpo responde a casi cualquier estímulo. La Progresión Lineal te permite progresar en CADA sesión, algo imposible para alguien con años de experiencia. Primero construimos la base técnica y neuromuscular.`
  },
  pure_strength: (a) => {
    if (a.experience === 'intermediate') return `Tu objetivo es la fuerza y ya tienes base técnica. El rango 1–5 reps con cargas del 85–100% de tu máximo activa el reclutamiento máximo de unidades motoras y genera adaptaciones neurales que rangos de más repeticiones no logran.`
    return `Tienes experiencia avanzada y tu objetivo es la fuerza máxima. Las cargas del 85–100% de tu 1RM producen adaptaciones neurales profundas — densidad ósea, sincronización de unidades motoras y fuerza real que se transfiere a cualquier actividad.`
  },
  hypertrophy: (a) => {
    const expLabel = a.experience === 'intermediate' ? 'intermedia' : 'avanzada'
    return `El rango 6–12 reps es el más respaldado científicamente para la hipertrofia (Schoenfeld, 2010). Con tu experiencia ${expLabel} y meta de ganar músculo, este método ofrece la mejor relación entre tensión mecánica, estrés metabólico y daño muscular.`
  },
  dup: (a) => `Tienes experiencia avanzada, buena recuperación y quieres ganar músculo. La Periodización Ondulante previene la adaptación variando el estímulo cada sesión: un día de fuerza, uno de hipertrofia, uno de resistencia. Es el método con mayor evidencia en atletas avanzados.`,
  fat_loss: (a) => {
    if (a.experience === 'beginner' && (a.objective === 'fat_loss' || a.bodyComposition === 'overweight')) {
      return `Tu meta es perder grasa y como principiante tienes una ventaja: tu cuerpo responde muy fuerte al estímulo nuevo. El método metabólico con descansos cortos maximiza el gasto calórico en cada sesión y genera el efecto EPOC (quema de calorías hasta 24h post-entreno).`
    }
    if (a.bodyComposition === 'overweight') return `Tu composición corporal y tu objetivo apuntan a la misma dirección: reducir grasa preservando músculo. Los descansos cortos y el alto volumen de repeticiones maximizan el gasto calórico y el efecto EPOC (quema calórica post-entreno).`
    if (a.objective === 'endurance') return `Para resistencia muscular, el método metabólico es el más adecuado: alto volumen de reps (15–20) con descansos cortos mejora la capacidad aeróbica-muscular, la densidad mitocondrial y la resistencia a la fatiga.`
    return `Tu objetivo es perder grasa. El método metabólico con descansos cortos maximiza el gasto calórico durante y después del entreno, preservando la masa muscular existente.`
  },
  recomp: (a) => {
    if (a.experience === 'beginner') return `Quieres perder grasa y ganar músculo. Como principiante, la recomposición es más viable para ti que para alguien avanzado — tu cuerpo aún no está adaptado y responde a ambos estímulos simultáneamente con la nutrición correcta.`
    if (a.bodyComposition === 'overweight') return `Tienes masa muscular para desarrollar y grasa para reducir. La recomposición corporal es el camino ideal: estimulas crecimiento muscular mientras el déficit calórico moderado reduce grasa. Requiere proteína alta y consistencia.`
    return `Quieres perder grasa Y ganar músculo simultáneamente. La recomposición es más lenta que especializarse en una sola meta, pero es el método más completo a largo plazo. Requiere calorías de mantenimiento y proteína alta (2.0–2.4 g/kg).`
  }
}

export function generateProfileSummary(answers, methodId, modifiers, effectiveMethod) {
  const method = effectiveMethod || TRAINING_METHODS[methodId]
  const reason = METHOD_REASONS[methodId]?.(answers) || ''

  const modNotes = modifiers.length > 0
    ? `<div class="profile-modifiers">
        <span class="profile-mod-title">Ajustes personalizados:</span>
        ${modifiers.map(m => `<span class="profile-mod-item">${ic('settings')} ${m.label}</span>`).join('')}
       </div>`
    : ''

  const repsDisplay = method.id === 'dup'
    ? '4–6 / 8–12 / 14–18 (varía por sesión)'
    : `${method.repRanges.p1} → ${method.repRanges.p3} (progresa por fase)`

  return `
    <div class="profile-summary">
      <div class="profile-method-header profile-${method.id}">
        <span class="profile-method-icon">${ic(method.icon)}</span>
        <div>
          <span class="profile-method-label">Tu método asignado</span>
          <h3 class="profile-method-name">${method.name}</h3>
          <span class="profile-method-tagline">${method.tagline}</span>
        </div>
      </div>

      <div class="profile-why">
        <span class="profile-section-title">${ic('help-circle')} ¿Por qué este método para ti?</span>
        <p>${reason}</p>
      </div>

      ${modNotes}

      <div class="profile-numbers">
        <span class="profile-section-title">${ic('clipboard-list')} Tu plan en números</span>
        <div class="profile-numbers-grid">
          <div class="profile-number-item">
            <span class="profile-number-value">${repsDisplay}</span>
            <span class="profile-number-label">Repeticiones por serie</span>
          </div>
          <div class="profile-number-item">
            <span class="profile-number-value">${method.sets.compound} (comp.) / ${method.sets.isolation} (ais.)</span>
            <span class="profile-number-label">Series por ejercicio</span>
          </div>
          <div class="profile-number-item">
            <span class="profile-number-value">${method.restLabel.compound}</span>
            <span class="profile-number-label">Descanso (compuestos)</span>
          </div>
          <div class="profile-number-item">
            <span class="profile-number-value">${method.restLabel.isolation}</span>
            <span class="profile-number-label">Descanso (aislamientos)</span>
          </div>
          <div class="profile-number-item">
            <span class="profile-number-value">Cada ${method.deloadEvery} semanas</span>
            <span class="profile-number-label">Semana de descarga</span>
          </div>
          <div class="profile-number-item">
            <span class="profile-number-value">${method.weightPct}</span>
            <span class="profile-number-label">Intensidad (% de tu máximo)</span>
          </div>
        </div>
      </div>

      <div class="profile-nutrition">
        <span class="profile-section-title">${ic('utensils')} Nutrición recomendada</span>
        <ul class="profile-list">
          <li>${ic('beef')} Proteína: <strong>${method.nutrition.proteinPerKg} g/kg</strong> de peso corporal/día</li>
          <li>${ic('zap')} Calorías: ${method.nutrition.calories}</li>
          <li>${ic('wheat')} Carbohidratos: ${method.nutrition.carbStrategy}</li>
          <li>${ic('droplets')} Grasas: ${method.nutrition.fatStrategy}</li>
        </ul>
      </div>

      <div class="profile-hydration">
        <span class="profile-section-title">${ic('droplets')} Hidratación</span>
        <ul class="profile-list">
          <li>${ic('clock')} Antes: ${method.hydration.before}</li>
          <li>${ic('timer')} Durante: ${method.hydration.during}</li>
          <li>${ic('check-circle')} Después: ${method.hydration.after}</li>
        </ul>
      </div>

      <div class="profile-recovery">
        <span class="profile-section-title">${ic('moon')} Recuperación</span>
        <ul class="profile-list">
          <li>${ic('bed')} Sueño: <strong>${method.recovery.sleep}</strong></li>
          <li>${ic('calendar')} Entre sesiones: ${method.recovery.betweenSessions}</li>
          <li>${ic('lightbulb')} <em>${method.recovery.tip}</em></li>
        </ul>
      </div>
    </div>
  `
}
