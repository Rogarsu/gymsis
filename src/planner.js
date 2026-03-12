// ─────────────────────────────────────────────────────────────
// planner.js — Generador de plan basado en slots de patrón de movimiento
// ─────────────────────────────────────────────────────────────
import { EXERCISES, getByMuscle } from './exercises.js'
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

// ── Filtrado de limitaciones físicas ─────────────────────────
// Mapea cada limitación a los patrones de movimiento que deben excluirse
const LIMITATION_EXCLUSIONS = {
  knees: [
    'squat', 'squat_variation', 'squat_home', 'hack_squat',
    'lunge', 'lunge_advanced', 'bulgarian_glute',
    'leg_press', 'knee_extension', 'plyometric_lower',
    'glute_squat'
  ],
  back: [
    'deadlift', 'romanian_deadlift', 'romanian_deadlift_back',
    'back_extension', 'clean_press', 'hip_hinge_advanced',
    'horizontal_row', 'row_advanced'
  ],
  shoulders: [
    'overhead_press', 'incline_push', 'push_up', 'push_up_advanced',
    'push_up_advanced', 'upright_row', 'lateral_raise', 'front_raise',
    'shoulder_circle', 'handstand', 'clean_press', 'overhead_carry'
  ],
  hips: [
    'hip_thrust', 'hip_abduction', 'hip_core',
    'bulgarian_glute', 'glute_step', 'glute_compound_advanced',
    'lunge', 'lunge_advanced', 'hip_hinge_advanced'
  ]
}

// ── Slots por división — corazón del motor ────────────────────
// Cada slot define exactamente qué tipo de ejercicio va en esa posición.
// priority: orden de llenado (1 = más importante)
// optional: true = se omite si la sesión es más corta
// pattern:  string o array de strings — patrones aceptados para ese slot
// type:     'compound' | 'isolation' | 'any'
// muscle:   grupo muscular para la guía de peso
const SESSION_SLOTS = {

  // ── PPL ────────────────────────────────────────────────────
  ppl_push_a: {
    name: 'Push A (Empuje)',
    slots: [
      { priority: 1, pattern: 'horizontal_push',                                   type: 'compound',  muscle: 'Pecho',   optional: false },
      { priority: 2, pattern: ['incline_push', 'decline_push', 'dip_chest'],        type: 'compound',  muscle: 'Pecho',   optional: false },
      { priority: 3, pattern: 'overhead_press',                                     type: 'compound',  muscle: 'Hombros', optional: false },
      { priority: 4, pattern: ['fly', 'chest_press_cable'],                         type: 'isolation', muscle: 'Pecho',   optional: false },
      { priority: 5, pattern: ['lateral_raise', 'front_raise'],                     type: 'isolation', muscle: 'Hombros', optional: true  },
      { priority: 6, pattern: ['triceps_pushdown', 'triceps_press'],                type: 'isolation', muscle: 'Tríceps', optional: true  },
      { priority: 7, pattern: ['plank', 'anti_extension', 'core_functional'],       type: 'any',       muscle: 'Core',    optional: true  }
    ]
  },
  ppl_push_b: {
    name: 'Push B (Empuje)',
    slots: [
      { priority: 1, pattern: 'overhead_press',                                     type: 'compound',  muscle: 'Hombros', optional: false },
      { priority: 2, pattern: ['lateral_raise', 'rear_delt_fly'],                   type: 'isolation', muscle: 'Hombros', optional: false },
      { priority: 3, pattern: ['incline_push', 'decline_push', 'dip_chest', 'push_up_advanced'], type: 'compound', muscle: 'Pecho', optional: false },
      { priority: 4, pattern: ['fly', 'horizontal_push'],                           type: 'any',       muscle: 'Pecho',   optional: false },
      { priority: 5, pattern: ['triceps_overhead', 'triceps_iso'],                  type: 'isolation', muscle: 'Tríceps', optional: true  },
      { priority: 6, pattern: ['triceps_pushdown', 'triceps_press'],                type: 'isolation', muscle: 'Tríceps', optional: true  },
      { priority: 7, pattern: ['lateral_core', 'rotation', 'anti_extension'],       type: 'any',       muscle: 'Core',    optional: true  }
    ]
  },
  ppl_pull_a: {
    name: 'Pull A (Jalón)',
    slots: [
      { priority: 1, pattern: 'vertical_pull',                                      type: 'compound',  muscle: 'Espalda', optional: false },
      { priority: 2, pattern: 'horizontal_row',                                     type: 'compound',  muscle: 'Espalda', optional: false },
      { priority: 3, pattern: 'curl_standing',                                      type: 'isolation', muscle: 'Bíceps',  optional: false },
      { priority: 4, pattern: ['lat_pulldown', 'row_advanced'],                     type: 'compound',  muscle: 'Espalda', optional: false },
      { priority: 5, pattern: ['curl_isolated', 'curl_lengthened', 'curl_neutral'], type: 'isolation', muscle: 'Bíceps',  optional: true  },
      { priority: 6, pattern: ['pullover', 'back_extension', 'scapular_movement'],  type: 'any',       muscle: 'Espalda', optional: true  },
      { priority: 7, pattern: ['plank', 'anti_extension', 'leg_raise'],             type: 'any',       muscle: 'Core',    optional: true  }
    ]
  },
  ppl_pull_b: {
    name: 'Pull B (Jalón)',
    slots: [
      { priority: 1, pattern: 'horizontal_row',                                     type: 'compound',  muscle: 'Espalda', optional: false },
      { priority: 2, pattern: ['lat_pulldown', 'vertical_pull'],                    type: 'compound',  muscle: 'Espalda', optional: false },
      { priority: 3, pattern: ['rear_delt_fly', 'scapular_movement'],               type: 'isolation', muscle: 'Hombros', optional: false },
      { priority: 4, pattern: ['curl_neutral', 'curl_lengthened', 'curl_reverse'],  type: 'isolation', muscle: 'Bíceps',  optional: false },
      { priority: 5, pattern: ['pullover', 'cable_row_advanced'],                   type: 'any',       muscle: 'Espalda', optional: true  },
      { priority: 6, pattern: ['curl_standing', 'curl_isolated'],                   type: 'isolation', muscle: 'Bíceps',  optional: true  },
      { priority: 7, pattern: ['rotation', 'lateral_core', 'crunch'],               type: 'any',       muscle: 'Core',    optional: true  }
    ]
  },
  ppl_legs_a: {
    name: 'Legs A (Piernas — Cuádriceps)',
    slots: [
      { priority: 1, pattern: 'squat',                                              type: 'compound',  muscle: 'Cuádriceps',     optional: false },
      { priority: 2, pattern: 'romanian_deadlift',                                  type: 'compound',  muscle: 'Isquiotibiales', optional: false },
      { priority: 3, pattern: 'lunge',                                              type: 'compound',  muscle: 'Cuádriceps',     optional: false },
      { priority: 4, pattern: 'leg_curl',                                           type: 'isolation', muscle: 'Isquiotibiales', optional: false },
      { priority: 5, pattern: ['leg_press', 'hack_squat', 'squat_variation'],       type: 'compound',  muscle: 'Cuádriceps',     optional: true  },
      { priority: 6, pattern: ['calf_raise_standing', 'calf_advanced'],             type: 'isolation', muscle: 'Pantorrillas',   optional: true  },
      { priority: 7, pattern: ['plank', 'crunch', 'anti_extension'],                type: 'any',       muscle: 'Core',           optional: true  }
    ]
  },
  ppl_legs_b: {
    name: 'Legs B (Piernas — Glúteo)',
    slots: [
      { priority: 1, pattern: 'hip_thrust',                                         type: 'compound',  muscle: 'Glúteo',         optional: false },
      { priority: 2, pattern: ['romanian_deadlift', 'deadlift'],                    type: 'compound',  muscle: 'Isquiotibiales', optional: false },
      { priority: 3, pattern: ['glute_step', 'lunge_advanced', 'glute_compound_advanced'], type: 'compound', muscle: 'Glúteo',  optional: false },
      { priority: 4, pattern: ['glute_kickback', 'hip_abduction'],                  type: 'isolation', muscle: 'Glúteo',         optional: false },
      { priority: 5, pattern: ['leg_curl', 'glute_ham'],                            type: 'isolation', muscle: 'Isquiotibiales', optional: true  },
      { priority: 6, pattern: ['calf_raise_seated', 'calf_raise_standing'],         type: 'isolation', muscle: 'Pantorrillas',   optional: true  },
      { priority: 7, pattern: ['rotation', 'lateral_core', 'hip_core'],             type: 'any',       muscle: 'Core',           optional: true  }
    ]
  },

  // ── Full Body ──────────────────────────────────────────────
  fullbody_a: {
    name: 'Full Body A',
    slots: [
      { priority: 1, pattern: 'squat',                                              type: 'compound',  muscle: 'Cuádriceps',     optional: false },
      { priority: 2, pattern: 'horizontal_push',                                    type: 'compound',  muscle: 'Pecho',          optional: false },
      { priority: 3, pattern: ['vertical_pull', 'lat_pulldown'],                    type: 'compound',  muscle: 'Espalda',        optional: false },
      { priority: 4, pattern: 'overhead_press',                                     type: 'compound',  muscle: 'Hombros',        optional: false },
      { priority: 5, pattern: 'romanian_deadlift',                                  type: 'compound',  muscle: 'Isquiotibiales', optional: true  },
      { priority: 6, pattern: ['fly', 'lateral_raise'],                             type: 'isolation', muscle: 'Pecho',          optional: true  },
      { priority: 7, pattern: ['plank', 'anti_extension', 'core_functional'],       type: 'any',       muscle: 'Core',           optional: true  }
    ]
  },
  fullbody_b: {
    name: 'Full Body B',
    slots: [
      { priority: 1, pattern: ['hip_thrust', 'romanian_deadlift'],                  type: 'compound',  muscle: 'Glúteo',         optional: false },
      { priority: 2, pattern: 'horizontal_row',                                     type: 'compound',  muscle: 'Espalda',        optional: false },
      { priority: 3, pattern: ['squat_variation', 'lunge'],                         type: 'compound',  muscle: 'Cuádriceps',     optional: false },
      { priority: 4, pattern: 'overhead_press',                                     type: 'compound',  muscle: 'Hombros',        optional: false },
      { priority: 5, pattern: ['rear_delt_fly', 'lateral_raise'],                   type: 'isolation', muscle: 'Hombros',        optional: true  },
      { priority: 6, pattern: ['curl_standing', 'curl_neutral'],                    type: 'isolation', muscle: 'Bíceps',         optional: true  },
      { priority: 7, pattern: ['crunch', 'leg_raise', 'rotation'],                  type: 'any',       muscle: 'Core',           optional: true  }
    ]
  },
  fullbody_c: {
    name: 'Full Body C',
    slots: [
      { priority: 1, pattern: ['lunge', 'squat_variation'],                         type: 'compound',  muscle: 'Cuádriceps',     optional: false },
      { priority: 2, pattern: 'overhead_press',                                     type: 'compound',  muscle: 'Hombros',        optional: false },
      { priority: 3, pattern: ['lat_pulldown', 'vertical_pull'],                    type: 'compound',  muscle: 'Espalda',        optional: false },
      { priority: 4, pattern: ['incline_push', 'horizontal_push'],                  type: 'compound',  muscle: 'Pecho',          optional: false },
      { priority: 5, pattern: ['rear_delt_fly', 'lateral_raise'],                   type: 'isolation', muscle: 'Hombros',        optional: true  },
      { priority: 6, pattern: ['curl_standing', 'curl_isolated'],                   type: 'isolation', muscle: 'Bíceps',         optional: true  },
      { priority: 7, pattern: ['triceps_pushdown', 'triceps_press'],                type: 'isolation', muscle: 'Tríceps',        optional: true  }
    ]
  },

  // ── Upper (solo tren superior) ─────────────────────────────
  upper_a: {
    name: 'Tren Superior A',
    slots: [
      { priority: 1, pattern: 'horizontal_push',                                    type: 'compound',  muscle: 'Pecho',   optional: false },
      { priority: 2, pattern: ['vertical_pull', 'lat_pulldown'],                    type: 'compound',  muscle: 'Espalda', optional: false },
      { priority: 3, pattern: 'overhead_press',                                     type: 'compound',  muscle: 'Hombros', optional: false },
      { priority: 4, pattern: 'horizontal_row',                                     type: 'compound',  muscle: 'Espalda', optional: false },
      { priority: 5, pattern: ['fly', 'incline_push'],                              type: 'any',       muscle: 'Pecho',   optional: true  },
      { priority: 6, pattern: ['curl_standing', 'curl_neutral'],                    type: 'isolation', muscle: 'Bíceps',  optional: true  },
      { priority: 7, pattern: ['triceps_pushdown', 'plank'],                        type: 'any',       muscle: 'Tríceps', optional: true  }
    ]
  },
  upper_b: {
    name: 'Tren Superior B',
    slots: [
      { priority: 1, pattern: 'horizontal_row',                                     type: 'compound',  muscle: 'Espalda', optional: false },
      { priority: 2, pattern: ['vertical_pull', 'lat_pulldown'],                    type: 'compound',  muscle: 'Espalda', optional: false },
      { priority: 3, pattern: ['incline_push', 'horizontal_push'],                  type: 'compound',  muscle: 'Pecho',   optional: false },
      { priority: 4, pattern: ['rear_delt_fly', 'lateral_raise'],                   type: 'isolation', muscle: 'Hombros', optional: false },
      { priority: 5, pattern: 'overhead_press',                                     type: 'compound',  muscle: 'Hombros', optional: true  },
      { priority: 6, pattern: ['curl_isolated', 'curl_lengthened'],                 type: 'isolation', muscle: 'Bíceps',  optional: true  },
      { priority: 7, pattern: ['triceps_overhead', 'plank'],                        type: 'any',       muscle: 'Tríceps', optional: true  }
    ]
  },

  // ── Lower (solo tren inferior) ─────────────────────────────
  lower_a: {
    name: 'Tren Inferior A',
    slots: [
      { priority: 1, pattern: 'squat',                                              type: 'compound',  muscle: 'Cuádriceps',     optional: false },
      { priority: 2, pattern: 'romanian_deadlift',                                  type: 'compound',  muscle: 'Isquiotibiales', optional: false },
      { priority: 3, pattern: 'lunge',                                              type: 'compound',  muscle: 'Cuádriceps',     optional: false },
      { priority: 4, pattern: 'leg_curl',                                           type: 'isolation', muscle: 'Isquiotibiales', optional: false },
      { priority: 5, pattern: ['leg_press', 'hack_squat', 'squat_variation'],       type: 'compound',  muscle: 'Cuádriceps',     optional: true  },
      { priority: 6, pattern: ['calf_raise_standing', 'calf_advanced'],             type: 'isolation', muscle: 'Pantorrillas',   optional: true  },
      { priority: 7, pattern: ['plank', 'anti_extension', 'crunch'],                type: 'any',       muscle: 'Core',           optional: true  }
    ]
  },
  lower_b: {
    name: 'Tren Inferior B',
    slots: [
      { priority: 1, pattern: 'hip_thrust',                                         type: 'compound',  muscle: 'Glúteo',         optional: false },
      { priority: 2, pattern: ['deadlift', 'romanian_deadlift'],                    type: 'compound',  muscle: 'Isquiotibiales', optional: false },
      { priority: 3, pattern: ['glute_step', 'glute_squat', 'lunge_advanced'],      type: 'compound',  muscle: 'Glúteo',         optional: false },
      { priority: 4, pattern: ['hip_abduction', 'glute_kickback'],                  type: 'isolation', muscle: 'Glúteo',         optional: false },
      { priority: 5, pattern: ['leg_curl', 'glute_ham'],                            type: 'isolation', muscle: 'Isquiotibiales', optional: true  },
      { priority: 6, pattern: ['calf_raise_seated', 'calf_raise_standing'],         type: 'isolation', muscle: 'Pantorrillas',   optional: true  },
      { priority: 7, pattern: ['rotation', 'lateral_core', 'dynamic_core'],         type: 'any',       muscle: 'Core',           optional: true  }
    ]
  },

  // ── Upper + Lower ──────────────────────────────────────────
  upper_lower_sup_a: {
    name: 'Superior A',
    slots: [
      { priority: 1, pattern: 'horizontal_push',                                    type: 'compound',  muscle: 'Pecho',   optional: false },
      { priority: 2, pattern: ['vertical_pull', 'lat_pulldown'],                    type: 'compound',  muscle: 'Espalda', optional: false },
      { priority: 3, pattern: 'overhead_press',                                     type: 'compound',  muscle: 'Hombros', optional: false },
      { priority: 4, pattern: 'horizontal_row',                                     type: 'compound',  muscle: 'Espalda', optional: false },
      { priority: 5, pattern: ['fly', 'lateral_raise', 'incline_push'],             type: 'any',       muscle: 'Pecho',   optional: true  },
      { priority: 6, pattern: ['curl_standing', 'curl_neutral'],                    type: 'isolation', muscle: 'Bíceps',  optional: true  },
      { priority: 7, pattern: ['triceps_pushdown', 'triceps_press'],                type: 'isolation', muscle: 'Tríceps', optional: true  }
    ]
  },
  upper_lower_sup_b: {
    name: 'Superior B',
    slots: [
      { priority: 1, pattern: 'horizontal_row',                                     type: 'compound',  muscle: 'Espalda', optional: false },
      { priority: 2, pattern: ['lat_pulldown', 'vertical_pull'],                    type: 'compound',  muscle: 'Espalda', optional: false },
      { priority: 3, pattern: ['incline_push', 'dip_chest'],                        type: 'compound',  muscle: 'Pecho',   optional: false },
      { priority: 4, pattern: ['rear_delt_fly', 'lateral_raise'],                   type: 'isolation', muscle: 'Hombros', optional: false },
      { priority: 5, pattern: 'overhead_press',                                     type: 'compound',  muscle: 'Hombros', optional: true  },
      { priority: 6, pattern: ['curl_isolated', 'curl_lengthened'],                 type: 'isolation', muscle: 'Bíceps',  optional: true  },
      { priority: 7, pattern: ['triceps_overhead', 'triceps_iso'],                  type: 'isolation', muscle: 'Tríceps', optional: true  }
    ]
  },
  upper_lower_inf_a: {
    name: 'Inferior A',
    slots: [
      { priority: 1, pattern: 'squat',                                              type: 'compound',  muscle: 'Cuádriceps',     optional: false },
      { priority: 2, pattern: 'romanian_deadlift',                                  type: 'compound',  muscle: 'Isquiotibiales', optional: false },
      { priority: 3, pattern: 'lunge',                                              type: 'compound',  muscle: 'Cuádriceps',     optional: false },
      { priority: 4, pattern: 'leg_curl',                                           type: 'isolation', muscle: 'Isquiotibiales', optional: false },
      { priority: 5, pattern: ['knee_extension', 'squat_variation'],                type: 'any',       muscle: 'Cuádriceps',     optional: true  },
      { priority: 6, pattern: 'calf_raise_standing',                                type: 'isolation', muscle: 'Pantorrillas',   optional: true  },
      { priority: 7, pattern: ['plank', 'anti_extension'],                          type: 'any',       muscle: 'Core',           optional: true  }
    ]
  },
  upper_lower_inf_b: {
    name: 'Inferior B',
    slots: [
      { priority: 1, pattern: 'hip_thrust',                                         type: 'compound',  muscle: 'Glúteo',         optional: false },
      { priority: 2, pattern: ['deadlift', 'romanian_deadlift'],                    type: 'compound',  muscle: 'Isquiotibiales', optional: false },
      { priority: 3, pattern: ['lunge_advanced', 'bulgarian_glute', 'glute_step'],  type: 'compound',  muscle: 'Glúteo',         optional: false },
      { priority: 4, pattern: ['hip_abduction', 'glute_kickback'],                  type: 'isolation', muscle: 'Glúteo',         optional: false },
      { priority: 5, pattern: ['glute_isolation_extra', 'glute_ham'],               type: 'any',       muscle: 'Glúteo',         optional: true  },
      { priority: 6, pattern: 'calf_raise_seated',                                  type: 'isolation', muscle: 'Pantorrillas',   optional: true  },
      { priority: 7, pattern: ['rotation', 'lateral_core'],                         type: 'any',       muscle: 'Core',           optional: true  }
    ]
  }
}

// Mapeo de splits a templates ordenados
const SPLIT_TEMPLATES = {
  fullbody:    ['fullbody_a', 'fullbody_b', 'fullbody_c'],
  upper:       ['upper_a', 'upper_b'],
  lower:       ['lower_a', 'lower_b'],
  upper_lower: ['upper_lower_sup_a', 'upper_lower_inf_a', 'upper_lower_sup_b', 'upper_lower_inf_b'],
  ppl:         ['ppl_push_a', 'ppl_pull_a', 'ppl_legs_a', 'ppl_push_b', 'ppl_pull_b', 'ppl_legs_b']
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

// ── Resolver objetivo principal ───────────────────────────────
function resolveObjective(objectives) {
  if (!objectives || objectives.length === 0) return 'general'
  if (objectives.length === 1) return objectives[0]
  const priority = ['strength', 'muscle', 'weight_loss', 'endurance', 'general']
  return priority.find(p => objectives.includes(p)) || objectives[0]
}

// ── Peso de dificultad por fase ───────────────────────────────
function difficultyScore(ex, phaseKey, userLevel) {
  const levels  = ['beginner', 'intermediate', 'advanced']
  const userIdx = levels.indexOf(userLevel)
  const exIdx   = ex.level.includes('beginner') ? 0 : ex.level.includes('intermediate') ? 1 : 2

  if (phaseKey === 'deload') return exIdx
  if (phaseKey === 'p1') return Math.abs(exIdx - Math.max(0, userIdx - 1))
  if (phaseKey === 'p2') return Math.abs(exIdx - userIdx)
  if (phaseKey === 'p3') return exIdx >= userIdx ? 0 : (userIdx - exIdx)
  return Math.abs(exIdx - userIdx)
}

// ── Seleccionar ejercicio para un slot específico ─────────────
// Garantiza que el ejercicio cumple el patrón y tipo requeridos por el slot.
// Fallbacks graduales si el pool es vacío:
//   1. sin filtro de environment
//   2. sin filtro de tipo
//   3. por músculo con getByMuscle (comportamiento previo)
function pickForSlot(slot, environment, level, planUsedCounts, weekUsedIds,
                     sessionUsedIds, sessionUsedPatterns, phaseKey, objectives, sessionIndex, excludedPatterns, sessionSlotPatterns) {
  const mainObj = resolveObjective(objectives)
  const isHypertrophyOrStrength = ['muscle', 'strength'].includes(mainObj)
  const patterns = Array.isArray(slot.pattern) ? slot.pattern : [slot.pattern]

  // allowUsedPatterns: si true, permite elegir un patrón ya usado en la sesión
  // (fallback de último recurso cuando las limitaciones agotan las opciones)
  function buildPool(envFilter, typeFilter, allowUsedPatterns) {
    return EXERCISES.filter(ex => {
      if (!patterns.includes(ex.movementPattern)) return false
      if (typeFilter !== 'any' && ex.type !== typeFilter) return false
      if (envFilter && ex.environment !== envFilter && ex.environment !== 'any') return false
      if (!ex.level.includes(level) && !ex.level.includes('beginner')) return false
      if (sessionUsedIds.has(ex.id)) return false
      if (excludedPatterns && excludedPatterns.includes(ex.movementPattern)) return false
      if (!allowUsedPatterns && sessionUsedPatterns.has(ex.movementPattern)) return false
      return true
    })
  }

  // Intentos con filtros progresivamente más permisivos (sin patrones ya usados)
  let pool = buildPool(environment, slot.type, false)
  if (pool.length === 0) pool = buildPool(null, slot.type, false)
  if (pool.length === 0) pool = buildPool(environment, 'any', false)
  if (pool.length === 0) pool = buildPool(null, 'any', false)

  // Segunda ronda: permitir patrones ya usados si todo lo demás falla
  if (pool.length === 0) pool = buildPool(environment, slot.type, true)
  if (pool.length === 0) pool = buildPool(null, slot.type, true)
  if (pool.length === 0) pool = buildPool(environment, 'any', true)
  if (pool.length === 0) pool = buildPool(null, 'any', true)

  // Último recurso: músculo completo sin filtro de patrón
  if (pool.length === 0) {
    let fallback = getByMuscle(slot.muscle, environment, level)
    if (fallback.length === 0) fallback = getByMuscle(slot.muscle, 'any', level)
    // Primero: sin patrones ya usados ni reservados por otros slots
    pool = fallback.filter(ex =>
      !sessionUsedIds.has(ex.id) &&
      (!excludedPatterns || !excludedPatterns.includes(ex.movementPattern)) &&
      !sessionUsedPatterns.has(ex.movementPattern) &&
      (!sessionSlotPatterns || !sessionSlotPatterns.has(ex.movementPattern))
    )
    // Segunda pasada: sin patrones ya usados (pero permite los de otros slots)
    if (pool.length === 0) {
      pool = fallback.filter(ex =>
        !sessionUsedIds.has(ex.id) &&
        (!excludedPatterns || !excludedPatterns.includes(ex.movementPattern)) &&
        !sessionUsedPatterns.has(ex.movementPattern)
      )
    }
    // Si sigue vacío: permitir patrones ya usados
    if (pool.length === 0) {
      pool = fallback.filter(ex =>
        !sessionUsedIds.has(ex.id) &&
        (!excludedPatterns || !excludedPatterns.includes(ex.movementPattern))
      )
    }
  }

  if (pool.length === 0) return null

  pool.sort((a, b) => {
    // [1] No usado esta semana
    const aWeek = weekUsedIds.has(a.id) ? 1 : 0
    const bWeek = weekUsedIds.has(b.id) ? 1 : 0
    if (aWeek !== bWeek) return aWeek - bWeek

    // [2] Penalización exponencial por uso excesivo en el plan
    const aRaw = planUsedCounts.get(a.id) || 0
    const bRaw = planUsedCounts.get(b.id) || 0
    const aPenalty = aRaw >= 3 ? aRaw * 5 : aRaw
    const bPenalty = bRaw >= 3 ? bRaw * 5 : bRaw
    if (aPenalty !== bPenalty) return aPenalty - bPenalty

    // [3] Dificultad apropiada para la fase
    const aDiff = difficultyScore(a, phaseKey, level)
    const bDiff = difficultyScore(b, phaseKey, level)
    if (aDiff !== bDiff) return aDiff - bDiff

    // [4] Preferir lengthened load en objetivos de hipertrofia/fuerza
    if (isHypertrophyOrStrength && phaseKey !== 'deload') {
      const aLen = a.isLengthenedLoad ? 0 : 1
      const bLen = b.isLengthenedLoad ? 0 : 1
      if (aLen !== bLen) return aLen - bLen
    }

    // [5] Desempate rotativo por sessionIndex
    return (a.id.charCodeAt(0) + sessionIndex) % 5 - 2
  })

  const chosen = pool[0]
  weekUsedIds.add(chosen.id)
  sessionUsedIds.add(chosen.id)
  if (chosen.movementPattern) sessionUsedPatterns.add(chosen.movementPattern)
  planUsedCounts.set(chosen.id, (planUsedCounts.get(chosen.id) || 0) + 1)
  return chosen
}

// ── Construir un ejercicio de sesión ──────────────────────────
function buildSessionExercise(ex, slotMuscle, phaseKey, objectives, environment, level,
                               position, methodConfig, templateIndex) {
  const mainObj = resolveObjective(objectives)

  let reps, rest, numSets
  if (methodConfig) {
    const repRanges = methodConfig.repRanges

    // DUP: varía el rango por sesión (0=hipertrofia, 1=fuerza, 2=resistencia)
    if (methodConfig.id === 'dup' && phaseKey !== 'deload') {
      const dupCycle = (templateIndex || 0) % 3
      if (dupCycle === 0) reps = '8-12'
      else if (dupCycle === 1) reps = '4-6'
      else reps = '14-18'
    } else {
      reps = repRanges[phaseKey] || repRanges.p1
    }

    rest = ex.type === 'compound'
      ? methodConfig.restLabel.compound
      : methodConfig.restLabel.isolation

    const baseSets = ex.type === 'compound' ? methodConfig.sets.compound : methodConfig.sets.isolation
    numSets = phaseKey === 'deload' ? Math.max(2, Math.round(baseSets * 0.6)) : baseSets

    // Aislamientos: +4 reps a cada extremo (excluye pure_strength)
    if (ex.type === 'isolation' && methodConfig.id !== 'pure_strength') {
      const parts = reps.split('-').map(Number)
      if (parts.length === 2) reps = `${parts[0] + 4}-${parts[1] + 4}`
    }
  } else {
    // Fallback legacy sin methodConfig
    const ranges = REP_RANGES[mainObj] || REP_RANGES.general
    const rests  = REST_TIMES[mainObj]  || REST_TIMES.general
    const sets   = SETS_BY_PHASE[phaseKey] || SETS_BY_PHASE.p1
    reps    = ranges[phaseKey] || ranges.p1
    rest    = ex.type === 'compound' ? rests.compound : rests.isolation
    numSets = phaseKey === 'deload' ? sets.compound :
      (ex.type === 'compound' ? sets.compound : sets.isolation)
  }

  // Usar el músculo del slot para la guía de peso (más preciso que ex.muscle en fallbacks)
  const muscleKey = slotMuscle || ex.muscle
  const weightGuideObj = WEIGHT_GUIDE[environment] || WEIGHT_GUIDE.gym
  const muscleGuide = weightGuideObj[muscleKey] || weightGuideObj[ex.muscle] || weightGuideObj.Pecho
  const weightGuide = muscleGuide[level] || muscleGuide.intermediate

  return {
    id:              ex.id,
    name:            ex.name,
    muscle:          ex.muscle,
    equipment:       ex.equipment.join(', ') || 'Peso corporal',
    type:            ex.type,
    movementPattern: ex.movementPattern || '',
    block:           ex.block || ex.muscle,
    sets:            numSets,
    reps,
    rest,
    weightGuide,
    notes:           ex.notes || '',
    position
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
    limitations  = [],
    methodId,
    modifiers    = []
  } = answers

  // Construir set de patrones excluidos por limitaciones físicas
  const excludedPatterns = limitations
    .filter(l => l !== 'none')
    .flatMap(l => LIMITATION_EXCLUSIONS[l] || [])

  // Resolver configuración del método
  let methodConfig = null
  if (methodId && TRAINING_METHODS[methodId]) {
    methodConfig = applyModifiers(methodId, modifiers)
  }

  const exPerSession   = EXERCISES_PER_DURATION[duration] || 5
  const templateKeys   = SPLIT_TEMPLATES[split] || SPLIT_TEMPLATES.fullbody
  const phases         = buildPhaseStructure(planWeeks)
  const totalSessions  = daysPerWeek * planWeeks

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
      methodId:  methodId || null,
      modifiers,
      createdAt: new Date().toISOString().slice(0, 10),
      rpeNote:   'Elige un peso con el que llegues cerca del fallo en la última serie (RPE 8-9). La última rep debe ser difícil pero técnicamente correcta. Si completas todas las reps con facilidad, sube el peso.'
    },
    phases: []
  }

  let sessionCounter = 1
  let templateIndex  = 0

  // Map de uso global (para rotar ejercicios a lo largo del plan)
  const planUsedCounts = new Map()

  for (const phase of phases) {
    const phaseSessions = []
    const totalPhaseSessions = phase.weeks * daysPerWeek

    let weekUsedIds = new Set()
    let dayInWeek   = 0

    for (let s = 0; s < totalPhaseSessions; s++) {
      // Resetear uso semanal al inicio de cada semana nueva
      if (dayInWeek > 0 && dayInWeek % daysPerWeek === 0) {
        weekUsedIds = new Set()
      }
      dayInWeek++

      // Ciclar entre templates
      const templateKey          = templateKeys[templateIndex % templateKeys.length]
      const templateDef          = SESSION_SLOTS[templateKey]
      const currentTemplateIndex = templateIndex
      templateIndex++

      if (!templateDef) continue

      // Elegir los N slots según duración (los primeros por priority)
      const activeSlots = templateDef.slots
        .slice()
        .sort((a, b) => a.priority - b.priority)
        .slice(0, exPerSession)

      const exercisesForSession = []
      const sessionUsedIds      = new Set()   // evita repetir en la misma sesión
      const sessionUsedPatterns = new Set()   // evita patrones repetidos en la sesión
      // Todos los patrones reservados por los slots activos de esta sesión
      const sessionSlotPatterns = new Set(
        activeSlots.flatMap(s => Array.isArray(s.pattern) ? s.pattern : [s.pattern])
      )
      let   position            = 1

      for (const slot of activeSlots) {
        // El slot actual ya puede usar su propio patrón, así que lo quitamos del conjunto reservado
        const ownPatterns = Array.isArray(slot.pattern) ? slot.pattern : [slot.pattern]
        ownPatterns.forEach(p => sessionSlotPatterns.delete(p))

        const ex = pickForSlot(
          slot, environment, level,
          planUsedCounts, weekUsedIds, sessionUsedIds, sessionUsedPatterns,
          phase.phaseKey, objectives, sessionCounter,
          excludedPatterns, sessionSlotPatterns
        )
        if (!ex) continue

        exercisesForSession.push(
          buildSessionExercise(
            ex, slot.muscle, phase.phaseKey, objectives,
            environment, level, position, methodConfig, currentTemplateIndex
          )
        )
        position++
      }

      phaseSessions.push({
        id:        `s${sessionCounter}`,
        number:    sessionCounter,
        name:      templateDef.name,
        phase:     phase.number,
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
    cycleDays:  daysPerWeek - types,
    totalDays:  daysPerWeek
  }
}
