// ─────────────────────────────────────────────────────────────
// exercises.js — Base de datos de ejercicios
//
// Campos por ejercicio:
//   id            string  — identificador único
//   name          string  — nombre en español
//   muscle        string  — grupo muscular principal
//   muscles       string[] — grupos secundarios
//   equipment     string[] — equipo necesario
//   environments  string[] — ['none','home','gym']
//   level         string[] — ['beginner','intermediate','advanced']
//   type          'compound' | 'isolation'
//   isLengthenedLoad boolean — preferido para fuerza/hipertrofia (Pedrosa 2022, Maeo 2023)
//   weightGuide   { beginner, intermediate, advanced }
//   notes         string  — tip técnico clave
//   block         string  — nombre del bloque en la sesión
// ─────────────────────────────────────────────────────────────

export const EXERCISES = [

  // ══════════════════════════════════════════════════
  // PECHO
  // ══════════════════════════════════════════════════
  {
    id: 'chest_bench_barbell',
    name: 'Press de Banca con Barra',
    muscle: 'Pecho',
    muscles: ['Pecho', 'Hombros', 'Tríceps'],
    equipment: ['barbell', 'bench'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { beginner: '40-60 kg', intermediate: '60-100 kg', advanced: '100-140 kg' },
    notes: 'Retrae las escápulas, pies firmes en el suelo. Baja la barra al pecho inferior.',
    block: 'Pecho'
  },
  {
    id: 'chest_incline_barbell',
    name: 'Press Inclinado con Barra',
    muscle: 'Pecho',
    muscles: ['Pecho Superior', 'Hombros', 'Tríceps'],
    equipment: ['barbell', 'bench'],
    environments: ['gym'],
    level: ['intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { intermediate: '50-80 kg', advanced: '80-120 kg' },
    notes: 'Banco a 30-45°. Enfoca el pecho superior manteniendo codos a 45° del torso.',
    block: 'Pecho'
  },
  {
    id: 'chest_bench_dumbbell',
    name: 'Press de Banca con Mancuernas',
    muscle: 'Pecho',
    muscles: ['Pecho', 'Hombros', 'Tríceps'],
    equipment: ['dumbbell', 'bench'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { beginner: '12-20 kg', intermediate: '20-36 kg', advanced: '36-60 kg' },
    notes: 'Mayor rango de movimiento que la barra. Bajar hasta sentir estiramiento en pecho.',
    block: 'Pecho'
  },
  {
    id: 'chest_incline_dumbbell',
    name: 'Press Inclinado con Mancuernas',
    muscle: 'Pecho',
    muscles: ['Pecho Superior', 'Hombros'],
    equipment: ['dumbbell', 'bench'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { beginner: '10-16 kg', intermediate: '16-28 kg', advanced: '28-50 kg' },
    notes: 'Banco a 30-45°. Codos ligeramente por debajo del nivel del hombro.',
    block: 'Pecho'
  },
  {
    id: 'chest_fly_dumbbell',
    name: 'Aperturas con Mancuernas',
    muscle: 'Pecho',
    muscles: ['Pecho'],
    equipment: ['dumbbell', 'bench'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: true,
    weightGuide: { beginner: '8-14 kg', intermediate: '14-22 kg', advanced: '22-36 kg' },
    notes: 'Codos levemente flexionados. Abre hasta sentir estiramiento. No bloquees en la cima.',
    block: 'Pecho'
  },
  {
    id: 'chest_cable_fly',
    name: 'Aperturas en Polea',
    muscle: 'Pecho',
    muscles: ['Pecho'],
    equipment: ['cable'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: true,
    weightGuide: { beginner: '10-20 kg', intermediate: '20-35 kg', advanced: '35-55 kg' },
    notes: 'Tensión constante. Cruza las manos al frente para máxima contracción.',
    block: 'Pecho'
  },
  {
    id: 'chest_pushup',
    name: 'Flexiones',
    muscle: 'Pecho',
    muscles: ['Pecho', 'Hombros', 'Tríceps'],
    equipment: [],
    environments: ['none', 'home', 'gym'],
    level: ['beginner', 'intermediate'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { beginner: 'Peso corporal', intermediate: 'Peso corporal' },
    notes: 'Cuerpo recto de cabeza a talones. Baja hasta que el pecho toque el suelo.',
    block: 'Pecho'
  },
  {
    id: 'chest_pushup_weighted',
    name: 'Flexiones con Peso (Chaleco)',
    muscle: 'Pecho',
    muscles: ['Pecho', 'Hombros', 'Tríceps'],
    equipment: [],
    environments: ['none', 'home', 'gym'],
    level: ['advanced'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { advanced: '10-40 kg adicionales' },
    notes: 'Usa chaleco o mochila lastrada. Misma técnica que flexión estándar.',
    block: 'Pecho'
  },
  {
    id: 'chest_pecdeck',
    name: 'Pec Deck (Mariposa)',
    muscle: 'Pecho',
    muscles: ['Pecho'],
    equipment: ['machine'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: true,
    weightGuide: { beginner: '30-50 kg', intermediate: '50-80 kg', advanced: '80-110 kg' },
    notes: 'Mantén los codos a la altura de los hombros. Contrae en el centro 1 segundo.',
    block: 'Pecho'
  },
  {
    id: 'chest_dip',
    name: 'Fondos en Paralelas (Pecho)',
    muscle: 'Pecho',
    muscles: ['Pecho', 'Tríceps', 'Hombros'],
    equipment: [],
    environments: ['gym'],
    level: ['intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { intermediate: 'Peso corporal', advanced: 'Peso corporal +10-30 kg' },
    notes: 'Inclínate 30° hacia adelante para enfatizar pecho. Baja hasta 90° en codos.',
    block: 'Pecho'
  },

  // ══════════════════════════════════════════════════
  // ESPALDA
  // ══════════════════════════════════════════════════
  {
    id: 'back_deadlift',
    name: 'Peso Muerto',
    muscle: 'Espalda',
    muscles: ['Espalda Baja', 'Glúteo', 'Isquiotibiales', 'Trapecios'],
    equipment: ['barbell'],
    environments: ['gym'],
    level: ['intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { intermediate: '80-140 kg', advanced: '140-220 kg' },
    notes: 'Barra sobre el mediopié. Espalda neutral, pecho arriba. Empuja el suelo, no jales.',
    block: 'Espalda'
  },
  {
    id: 'back_pullup',
    name: 'Dominadas',
    muscle: 'Espalda',
    muscles: ['Dorsal', 'Bíceps', 'Romboides'],
    equipment: [],
    environments: ['home', 'gym'],
    level: ['intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { intermediate: 'Peso corporal', advanced: 'Peso corporal +10-25 kg' },
    notes: 'Agarre prono, ancho de hombros. Lleva el pecho a la barra. Baja completamente.',
    block: 'Espalda'
  },
  {
    id: 'back_chinup',
    name: 'Jalones en Barra (Supino)',
    muscle: 'Espalda',
    muscles: ['Dorsal', 'Bíceps'],
    equipment: [],
    environments: ['home', 'gym'],
    level: ['intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { intermediate: 'Peso corporal', advanced: 'Peso corporal +10-20 kg' },
    notes: 'Agarre supino, manos a ancho de hombros. Mayor activación de bíceps.',
    block: 'Espalda'
  },
  {
    id: 'back_lat_pulldown',
    name: 'Jalón al Pecho en Polea',
    muscle: 'Espalda',
    muscles: ['Dorsal', 'Bíceps', 'Romboides'],
    equipment: ['cable'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { beginner: '30-50 kg', intermediate: '50-80 kg', advanced: '80-110 kg' },
    notes: 'Lleva el codo hacia la cadera. Inclínate ligeramente. No balancees el torso.',
    block: 'Espalda'
  },
  {
    id: 'back_seated_row',
    name: 'Remo Sentado en Polea',
    muscle: 'Espalda',
    muscles: ['Dorsal', 'Romboides', 'Trapecio Medio', 'Bíceps'],
    equipment: ['cable'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { beginner: '30-50 kg', intermediate: '50-80 kg', advanced: '80-120 kg' },
    notes: 'Lleva los codos detrás del torso. Aprieta escápulas al final del movimiento.',
    block: 'Espalda'
  },
  {
    id: 'back_bent_row_barbell',
    name: 'Remo con Barra (Inclinado)',
    muscle: 'Espalda',
    muscles: ['Dorsal', 'Romboides', 'Trapecio', 'Bíceps'],
    equipment: ['barbell'],
    environments: ['gym'],
    level: ['intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { intermediate: '60-100 kg', advanced: '100-160 kg' },
    notes: 'Inclinación 45°. Lleva barra al ombligo. Mantén espalda baja neutra.',
    block: 'Espalda'
  },
  {
    id: 'back_dumbbell_row',
    name: 'Remo con Mancuerna a 1 Brazo',
    muscle: 'Espalda',
    muscles: ['Dorsal', 'Romboides', 'Bíceps'],
    equipment: ['dumbbell', 'bench'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { beginner: '12-20 kg', intermediate: '20-36 kg', advanced: '36-60 kg' },
    notes: 'Rodilla y mano apoyadas. Lleva el codo detrás del torso. Retrae la escápula.',
    block: 'Espalda'
  },
  {
    id: 'back_face_pull',
    name: 'Face Pull en Polea',
    muscle: 'Espalda',
    muscles: ['Deltoides Posterior', 'Romboides', 'Manguito Rotador'],
    equipment: ['cable'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: '15-25 kg', intermediate: '25-40 kg', advanced: '40-60 kg' },
    notes: 'Polea alta. Jala hacia la cara separando las manos. Codos hacia afuera y arriba.',
    block: 'Espalda'
  },
  {
    id: 'back_straight_pulldown',
    name: 'Pullover en Polea (Brazos Rectos)',
    muscle: 'Espalda',
    muscles: ['Dorsal'],
    equipment: ['cable'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: true,
    weightGuide: { beginner: '20-35 kg', intermediate: '35-55 kg', advanced: '55-80 kg' },
    notes: 'Brazos casi rectos. Jala hacia los muslos sintiendo el dorsal trabajar.',
    block: 'Espalda'
  },
  {
    id: 'back_band_row',
    name: 'Remo con Banda Elástica',
    muscle: 'Espalda',
    muscles: ['Dorsal', 'Romboides', 'Bíceps'],
    equipment: ['band'],
    environments: ['none', 'home'],
    level: ['beginner', 'intermediate'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { beginner: 'Banda ligera', intermediate: 'Banda media' },
    notes: 'Ancla la banda a algo firme. Siéntate y rema tirando de los codos hacia atrás.',
    block: 'Espalda'
  },

  // ══════════════════════════════════════════════════
  // HOMBROS
  // ══════════════════════════════════════════════════
  {
    id: 'shoulder_ohp_barbell',
    name: 'Press Militar con Barra',
    muscle: 'Hombros',
    muscles: ['Deltoides', 'Tríceps', 'Trapecio'],
    equipment: ['barbell'],
    environments: ['gym'],
    level: ['intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { intermediate: '40-70 kg', advanced: '70-110 kg' },
    notes: 'De pie o sentado. Barra pasa frente a la cara. Core activado todo el movimiento.',
    block: 'Hombros'
  },
  {
    id: 'shoulder_ohp_dumbbell',
    name: 'Press de Hombros con Mancuernas',
    muscle: 'Hombros',
    muscles: ['Deltoides', 'Tríceps'],
    equipment: ['dumbbell'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { beginner: '8-14 kg', intermediate: '14-24 kg', advanced: '24-40 kg' },
    notes: 'Mancuernas a nivel de hombros. Empuja verticalmente. No arquees la espalda baja.',
    block: 'Hombros'
  },
  {
    id: 'shoulder_lateral_raise',
    name: 'Elevaciones Laterales',
    muscle: 'Hombros',
    muscles: ['Deltoides Lateral'],
    equipment: ['dumbbell'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: '4-8 kg', intermediate: '8-14 kg', advanced: '14-22 kg' },
    notes: 'Codos levemente flexionados. Eleva hasta paralelo. Controla la bajada lenta (3 seg).',
    block: 'Hombros'
  },
  {
    id: 'shoulder_cable_lateral',
    name: 'Elevaciones Laterales en Polea',
    muscle: 'Hombros',
    muscles: ['Deltoides Lateral'],
    equipment: ['cable'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: true,
    weightGuide: { beginner: '5-12 kg', intermediate: '12-22 kg', advanced: '22-35 kg' },
    notes: 'Tensión constante. Polea baja, jala cruzando el cuerpo o desde el mismo lado.',
    block: 'Hombros'
  },
  {
    id: 'shoulder_front_raise',
    name: 'Elevaciones Frontales',
    muscle: 'Hombros',
    muscles: ['Deltoides Anterior'],
    equipment: ['dumbbell'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: '4-8 kg', intermediate: '8-14 kg' },
    notes: 'Sube hasta altura de hombros. No uses impulso del torso.',
    block: 'Hombros'
  },
  {
    id: 'shoulder_rear_delt_fly',
    name: 'Aperturas para Deltoides Posterior',
    muscle: 'Hombros',
    muscles: ['Deltoides Posterior', 'Romboides'],
    equipment: ['dumbbell'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: true,
    weightGuide: { beginner: '4-8 kg', intermediate: '8-14 kg', advanced: '14-22 kg' },
    notes: 'Inclinado hacia adelante 45°. Codos ligeramente flexionados. Enfoca la parte trasera del hombro.',
    block: 'Hombros'
  },
  {
    id: 'shoulder_arnold_press',
    name: 'Arnold Press',
    muscle: 'Hombros',
    muscles: ['Deltoides Completo', 'Tríceps'],
    equipment: ['dumbbell'],
    environments: ['home', 'gym'],
    level: ['intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { intermediate: '10-18 kg', advanced: '18-30 kg' },
    notes: 'Inicia con palmas hacia ti. Rota y empuja simultáneamente. Activa los 3 haces del hombro.',
    block: 'Hombros'
  },
  {
    id: 'shoulder_band_lateral',
    name: 'Elevaciones Laterales con Banda',
    muscle: 'Hombros',
    muscles: ['Deltoides Lateral'],
    equipment: ['band'],
    environments: ['none', 'home'],
    level: ['beginner', 'intermediate'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: 'Banda ligera', intermediate: 'Banda media' },
    notes: 'Pisa la banda. Sube lentamente hasta paralelo. Baja controlado.',
    block: 'Hombros'
  },

  // ══════════════════════════════════════════════════
  // BÍCEPS
  // ══════════════════════════════════════════════════
  {
    id: 'bicep_barbell_curl',
    name: 'Curl con Barra',
    muscle: 'Bíceps',
    muscles: ['Bíceps', 'Braquial'],
    equipment: ['barbell'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: '20-35 kg', intermediate: '35-55 kg', advanced: '55-80 kg' },
    notes: 'Codos fijos en los costados. No balancees el torso. Contrae en la cima.',
    block: 'Bíceps'
  },
  {
    id: 'bicep_dumbbell_curl',
    name: 'Curl con Mancuernas',
    muscle: 'Bíceps',
    muscles: ['Bíceps', 'Braquial'],
    equipment: ['dumbbell'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: '6-12 kg', intermediate: '12-20 kg', advanced: '20-32 kg' },
    notes: 'Alterna o simultáneo. Rota la palma hacia arriba al subir (supinación).',
    block: 'Bíceps'
  },
  {
    id: 'bicep_hammer_curl',
    name: 'Curl Martillo',
    muscle: 'Bíceps',
    muscles: ['Braquial', 'Braquiorradial', 'Bíceps'],
    equipment: ['dumbbell'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: '8-14 kg', intermediate: '14-24 kg', advanced: '24-36 kg' },
    notes: 'Agarre neutro (pulgar arriba). Enfatiza el braquial. Ideal para grosor del brazo.',
    block: 'Bíceps'
  },
  {
    id: 'bicep_incline_curl',
    name: 'Curl Inclinado con Mancuernas',
    muscle: 'Bíceps',
    muscles: ['Bíceps (porción larga)'],
    equipment: ['dumbbell', 'bench'],
    environments: ['home', 'gym'],
    level: ['intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: true,
    weightGuide: { intermediate: '8-14 kg', advanced: '14-22 kg' },
    notes: 'Banco a 60°. Brazo colgando hacia atrás maximiza el estiramiento del bíceps.',
    block: 'Bíceps'
  },
  {
    id: 'bicep_cable_curl',
    name: 'Curl en Polea Baja',
    muscle: 'Bíceps',
    muscles: ['Bíceps'],
    equipment: ['cable'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: '15-25 kg', intermediate: '25-40 kg', advanced: '40-60 kg' },
    notes: 'Tensión constante durante todo el rango. Ideal como ejercicio final.',
    block: 'Bíceps'
  },
  {
    id: 'bicep_preacher_curl',
    name: 'Curl en Scott (Predicador)',
    muscle: 'Bíceps',
    muscles: ['Bíceps (porción corta)'],
    equipment: ['machine'],
    environments: ['gym'],
    level: ['intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { intermediate: '20-35 kg', advanced: '35-55 kg' },
    notes: 'Apoya el brazo en el pad. No bloquees el codo al bajar. Estira completamente.',
    block: 'Bíceps'
  },
  {
    id: 'bicep_band_curl',
    name: 'Curl con Banda Elástica',
    muscle: 'Bíceps',
    muscles: ['Bíceps'],
    equipment: ['band'],
    environments: ['none', 'home'],
    level: ['beginner', 'intermediate'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: 'Banda ligera', intermediate: 'Banda media' },
    notes: 'Pisa la banda en el centro. Curl normal con control en la bajada.',
    block: 'Bíceps'
  },

  // ══════════════════════════════════════════════════
  // TRÍCEPS
  // ══════════════════════════════════════════════════
  {
    id: 'tricep_closegrip_bench',
    name: 'Press Agarre Cerrado',
    muscle: 'Tríceps',
    muscles: ['Tríceps', 'Pecho', 'Hombros'],
    equipment: ['barbell', 'bench'],
    environments: ['gym'],
    level: ['intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { intermediate: '40-70 kg', advanced: '70-110 kg' },
    notes: 'Agarre a ancho de hombros. Codos pegados al torso. Enfoca el tríceps.',
    block: 'Tríceps'
  },
  {
    id: 'tricep_dip_bench',
    name: 'Fondos en Banco',
    muscle: 'Tríceps',
    muscles: ['Tríceps', 'Hombros'],
    equipment: ['bench'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { beginner: 'Peso corporal', intermediate: 'Peso corporal +5-15 kg' },
    notes: 'Manos en el banco detrás de ti. Baja hasta 90° en codos. Espalda cerca del banco.',
    block: 'Tríceps'
  },
  {
    id: 'tricep_skullcrusher',
    name: 'Press Francés (Skull Crusher)',
    muscle: 'Tríceps',
    muscles: ['Tríceps (porción larga)'],
    equipment: ['barbell', 'bench'],
    environments: ['gym'],
    level: ['intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: true,
    weightGuide: { intermediate: '25-45 kg', advanced: '45-70 kg' },
    notes: 'Baja la barra hacia la frente. Codos apuntan al techo. Excelente para hipertrofia.',
    block: 'Tríceps'
  },
  {
    id: 'tricep_pushdown',
    name: 'Jalón de Tríceps en Polea',
    muscle: 'Tríceps',
    muscles: ['Tríceps'],
    equipment: ['cable'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: '20-35 kg', intermediate: '35-55 kg', advanced: '55-80 kg' },
    notes: 'Codos fijos en costados. Extiende completamente. Usa cuerda para más activación.',
    block: 'Tríceps'
  },
  {
    id: 'tricep_overhead_ext',
    name: 'Extensión de Tríceps sobre la Cabeza',
    muscle: 'Tríceps',
    muscles: ['Tríceps (porción larga)'],
    equipment: ['dumbbell'],
    environments: ['home', 'gym'],
    level: ['intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: true,
    weightGuide: { intermediate: '14-24 kg', advanced: '24-40 kg' },
    notes: 'Brazos detrás de la cabeza maximizan el estiramiento de la porción larga.',
    block: 'Tríceps'
  },
  {
    id: 'tricep_cable_overhead',
    name: 'Extensión de Tríceps en Polea Alta',
    muscle: 'Tríceps',
    muscles: ['Tríceps (porción larga)'],
    equipment: ['cable'],
    environments: ['gym'],
    level: ['intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: true,
    weightGuide: { intermediate: '20-35 kg', advanced: '35-55 kg' },
    notes: 'De espaldas a la polea. Codos cerca de la cabeza. Máximo estiramiento en posición inicial.',
    block: 'Tríceps'
  },
  {
    id: 'tricep_diamond_pushup',
    name: 'Flexiones en Diamante',
    muscle: 'Tríceps',
    muscles: ['Tríceps', 'Pecho'],
    equipment: [],
    environments: ['none', 'home', 'gym'],
    level: ['beginner', 'intermediate'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { beginner: 'Peso corporal', intermediate: 'Peso corporal' },
    notes: 'Manos en forma de diamante bajo el pecho. Codos pegados al cuerpo al bajar.',
    block: 'Tríceps'
  },

  // ══════════════════════════════════════════════════
  // CUÁDRICEPS
  // ══════════════════════════════════════════════════
  {
    id: 'quad_squat_barbell',
    name: 'Sentadilla con Barra',
    muscle: 'Cuádriceps',
    muscles: ['Cuádriceps', 'Glúteo', 'Isquiotibiales', 'Core'],
    equipment: ['barbell'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { beginner: '40-70 kg', intermediate: '70-120 kg', advanced: '120-200 kg' },
    notes: 'Pies a ancho de hombros. Rodillas siguen dirección de pies. Baja hasta paralelo.',
    block: 'Piernas'
  },
  {
    id: 'quad_front_squat',
    name: 'Sentadilla Frontal',
    muscle: 'Cuádriceps',
    muscles: ['Cuádriceps', 'Core', 'Glúteo'],
    equipment: ['barbell'],
    environments: ['gym'],
    level: ['advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { advanced: '60-120 kg' },
    notes: 'Barra sobre deltoides. Torso más vertical que sentadilla trasera. Mayor trabajo de quad.',
    block: 'Piernas'
  },
  {
    id: 'quad_leg_press',
    name: 'Prensa de Piernas',
    muscle: 'Cuádriceps',
    muscles: ['Cuádriceps', 'Glúteo', 'Isquiotibiales'],
    equipment: ['machine'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { beginner: '80-140 kg', intermediate: '140-240 kg', advanced: '240-400 kg' },
    notes: 'Pies a ancho de hombros. No bloquees las rodillas arriba. Rango completo.',
    block: 'Piernas'
  },
  {
    id: 'quad_leg_extension',
    name: 'Extensión de Piernas',
    muscle: 'Cuádriceps',
    muscles: ['Cuádriceps'],
    equipment: ['machine'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: '30-50 kg', intermediate: '50-80 kg', advanced: '80-120 kg' },
    notes: 'Contrae el quad al tope. Baja lentamente. Ideal para definición de quad.',
    block: 'Piernas'
  },
  {
    id: 'quad_bulgarian_squat',
    name: 'Sentadilla Búlgara (Split)',
    muscle: 'Cuádriceps',
    muscles: ['Cuádriceps', 'Glúteo', 'Isquiotibiales'],
    equipment: ['dumbbell', 'bench'],
    environments: ['home', 'gym'],
    level: ['intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { intermediate: '12-22 kg', advanced: '22-40 kg' },
    notes: 'Pie trasero en banco. Baja hasta 90° en rodilla delantera. Un lado a la vez.',
    block: 'Piernas'
  },
  {
    id: 'quad_lunge',
    name: 'Zancadas con Mancuernas',
    muscle: 'Cuádriceps',
    muscles: ['Cuádriceps', 'Glúteo', 'Isquiotibiales'],
    equipment: ['dumbbell'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { beginner: '6-12 kg', intermediate: '12-22 kg', advanced: '22-36 kg' },
    notes: 'Paso largo. Rodilla delantera sobre el tobillo. Rodilla trasera casi toca el suelo.',
    block: 'Piernas'
  },
  {
    id: 'quad_goblet_squat',
    name: 'Sentadilla Goblet',
    muscle: 'Cuádriceps',
    muscles: ['Cuádriceps', 'Glúteo', 'Core'],
    equipment: ['dumbbell'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { beginner: '10-18 kg', intermediate: '18-32 kg' },
    notes: 'Mancuerna frente al pecho. Codos entre las rodillas al bajar. Perfecto para principiantes.',
    block: 'Piernas'
  },
  {
    id: 'quad_bodyweight_squat',
    name: 'Sentadilla sin Peso',
    muscle: 'Cuádriceps',
    muscles: ['Cuádriceps', 'Glúteo'],
    equipment: [],
    environments: ['none', 'home', 'gym'],
    level: ['beginner'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { beginner: 'Peso corporal' },
    notes: 'Brazos al frente para balance. Baja hasta que muslos estén paralelos al suelo.',
    block: 'Piernas'
  },
  {
    id: 'quad_hack_squat',
    name: 'Hack Squat en Máquina',
    muscle: 'Cuádriceps',
    muscles: ['Cuádriceps', 'Glúteo'],
    equipment: ['machine'],
    environments: ['gym'],
    level: ['intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { intermediate: '80-160 kg', advanced: '160-280 kg' },
    notes: 'Espalda apoyada en el pad. Mayor énfasis en quad que la prensa tradicional.',
    block: 'Piernas'
  },

  // ══════════════════════════════════════════════════
  // ISQUIOTIBIALES
  // ══════════════════════════════════════════════════
  {
    id: 'ham_rdl',
    name: 'Peso Muerto Rumano',
    muscle: 'Isquiotibiales',
    muscles: ['Isquiotibiales', 'Glúteo', 'Espalda Baja'],
    equipment: ['barbell'],
    environments: ['gym'],
    level: ['intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { intermediate: '60-100 kg', advanced: '100-160 kg' },
    notes: 'Rodillas ligeramente flexionadas. Baja hasta sentir estiramiento en isquios. Espalda neutra.',
    block: 'Piernas'
  },
  {
    id: 'ham_rdl_dumbbell',
    name: 'Peso Muerto Rumano con Mancuernas',
    muscle: 'Isquiotibiales',
    muscles: ['Isquiotibiales', 'Glúteo'],
    equipment: ['dumbbell'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { beginner: '14-22 kg', intermediate: '22-36 kg', advanced: '36-60 kg' },
    notes: 'Misma técnica que con barra. Más accesible para principiantes.',
    block: 'Piernas'
  },
  {
    id: 'ham_leg_curl_lying',
    name: 'Curl de Piernas Tumbado',
    muscle: 'Isquiotibiales',
    muscles: ['Isquiotibiales'],
    equipment: ['machine'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: true,
    weightGuide: { beginner: '30-50 kg', intermediate: '50-80 kg', advanced: '80-110 kg' },
    notes: 'Mayor activación en posición elongada. Contrae apretando el glúteo.',
    block: 'Piernas'
  },
  {
    id: 'ham_leg_curl_seated',
    name: 'Curl de Piernas Sentado',
    muscle: 'Isquiotibiales',
    muscles: ['Isquiotibiales'],
    equipment: ['machine'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: true,
    weightGuide: { beginner: '30-50 kg', intermediate: '50-80 kg', advanced: '80-110 kg' },
    notes: 'La posición sentada maximiza el estiramiento inicial del isquio.',
    block: 'Piernas'
  },
  {
    id: 'ham_nordic_curl',
    name: 'Nordic Curl (Curl Nórdico)',
    muscle: 'Isquiotibiales',
    muscles: ['Isquiotibiales'],
    equipment: [],
    environments: ['home', 'gym'],
    level: ['advanced'],
    type: 'isolation',
    isLengthenedLoad: true,
    weightGuide: { advanced: 'Peso corporal' },
    notes: 'Ancla los pies. Baja lentamente controlando la excéntrica. Muy demandante.',
    block: 'Piernas'
  },

  // ══════════════════════════════════════════════════
  // GLÚTEOS
  // ══════════════════════════════════════════════════
  {
    id: 'glute_hip_thrust',
    name: 'Hip Thrust con Barra',
    muscle: 'Glúteo',
    muscles: ['Glúteo Mayor', 'Isquiotibiales'],
    equipment: ['barbell', 'bench'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { beginner: '40-80 kg', intermediate: '80-140 kg', advanced: '140-220 kg' },
    notes: 'Hombros en el banco. Aprieta el glúteo en la cima. Barbilla hacia pecho.',
    block: 'Glúteos'
  },
  {
    id: 'glute_hip_thrust_dumbbell',
    name: 'Hip Thrust con Mancuerna',
    muscle: 'Glúteo',
    muscles: ['Glúteo Mayor', 'Isquiotibiales'],
    equipment: ['dumbbell', 'bench'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { beginner: '14-24 kg', intermediate: '24-40 kg' },
    notes: 'Alternativa accesible al hip thrust con barra. Misma técnica.',
    block: 'Glúteos'
  },
  {
    id: 'glute_bridge',
    name: 'Puente de Glúteos',
    muscle: 'Glúteo',
    muscles: ['Glúteo Mayor', 'Isquiotibiales'],
    equipment: [],
    environments: ['none', 'home', 'gym'],
    level: ['beginner'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { beginner: 'Peso corporal' },
    notes: 'Tumbado boca arriba. Eleva las caderas apretando glúteo. Sostén 1 segundo arriba.',
    block: 'Glúteos'
  },
  {
    id: 'glute_cable_kickback',
    name: 'Patada Trasera en Polea',
    muscle: 'Glúteo',
    muscles: ['Glúteo Mayor'],
    equipment: ['cable'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: true,
    weightGuide: { beginner: '15-25 kg', intermediate: '25-40 kg', advanced: '40-60 kg' },
    notes: 'Polea baja. Empuja hacia atrás y arriba. Contrae el glúteo en la posición final.',
    block: 'Glúteos'
  },
  {
    id: 'glute_sumo_squat',
    name: 'Sentadilla Sumo con Mancuerna',
    muscle: 'Glúteo',
    muscles: ['Glúteo', 'Aductores', 'Cuádriceps'],
    equipment: ['dumbbell'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { beginner: '14-24 kg', intermediate: '24-40 kg' },
    notes: 'Pies muy abiertos, puntillas hacia afuera. Mantén el torso erguido al bajar.',
    block: 'Glúteos'
  },

  // ══════════════════════════════════════════════════
  // PANTORRILLAS
  // ══════════════════════════════════════════════════
  {
    id: 'calf_standing_machine',
    name: 'Elevación de Talones de Pie (Máquina)',
    muscle: 'Pantorrillas',
    muscles: ['Gastrocnemio', 'Sóleo'],
    equipment: ['machine'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: '60-100 kg', intermediate: '100-160 kg', advanced: '160-240 kg' },
    notes: 'Sube al máximo. Baja hasta sentir estiramiento completo. Pausa de 1 seg abajo.',
    block: 'Pantorrillas'
  },
  {
    id: 'calf_seated_machine',
    name: 'Elevación de Talones Sentado',
    muscle: 'Pantorrillas',
    muscles: ['Sóleo'],
    equipment: ['machine'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: '30-60 kg', intermediate: '60-100 kg', advanced: '100-160 kg' },
    notes: 'Enfoca el sóleo (rodilla flexionada). Mayor volumen de entrenamiento necesario.',
    block: 'Pantorrillas'
  },
  {
    id: 'calf_bodyweight',
    name: 'Elevación de Talones sin Peso',
    muscle: 'Pantorrillas',
    muscles: ['Gastrocnemio', 'Sóleo'],
    equipment: [],
    environments: ['none', 'home', 'gym'],
    level: ['beginner'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: 'Peso corporal (reps altas: 20-30)' },
    notes: 'Usa un escalón para mayor rango. Haz pausas en la posición baja.',
    block: 'Pantorrillas'
  },
  {
    id: 'calf_dumbbell',
    name: 'Elevación de Talones con Mancuerna',
    muscle: 'Pantorrillas',
    muscles: ['Gastrocnemio', 'Sóleo'],
    equipment: ['dumbbell'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: '14-22 kg', intermediate: '22-36 kg' },
    notes: 'Apoya una mano en la pared. Un pie a la vez para mayor intensidad.',
    block: 'Pantorrillas'
  },

  // ══════════════════════════════════════════════════
  // CORE / ABDOMEN
  // ══════════════════════════════════════════════════
  {
    id: 'core_plank',
    name: 'Plancha',
    muscle: 'Core',
    muscles: ['Abdomen', 'Core Profundo', 'Hombros'],
    equipment: [],
    environments: ['none', 'home', 'gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { beginner: '20-40 seg', intermediate: '40-90 seg', advanced: '90-180 seg' },
    notes: 'Cuerpo recto como una tabla. No dejes caer las caderas. Respira normalmente.',
    block: 'Core'
  },
  {
    id: 'core_hanging_leg_raise',
    name: 'Elevación de Piernas Colgado',
    muscle: 'Core',
    muscles: ['Abdomen', 'Flexores de Cadera'],
    equipment: [],
    environments: ['gym'],
    level: ['intermediate', 'advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { intermediate: 'Peso corporal', advanced: 'Peso corporal +2-5 kg' },
    notes: 'Sube las piernas hasta 90° o más. Controla la bajada. No uses impulso.',
    block: 'Core'
  },
  {
    id: 'core_cable_crunch',
    name: 'Crunch en Polea',
    muscle: 'Core',
    muscles: ['Recto Abdominal'],
    equipment: ['cable'],
    environments: ['gym'],
    level: ['beginner', 'intermediate', 'advanced'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: '20-35 kg', intermediate: '35-60 kg', advanced: '60-90 kg' },
    notes: 'Arrodillado. Flexiona la columna tirando con los abdominales, no con los brazos.',
    block: 'Core'
  },
  {
    id: 'core_ab_rollout',
    name: 'Rueda Abdominal (Ab Wheel)',
    muscle: 'Core',
    muscles: ['Core Completo', 'Hombros', 'Dorsal'],
    equipment: [],
    environments: ['home', 'gym'],
    level: ['advanced'],
    type: 'compound',
    isLengthenedLoad: true,
    weightGuide: { advanced: 'Peso corporal' },
    notes: 'Extiende lentamente hasta casi tocar el suelo. Muy efectivo pero exigente.',
    block: 'Core'
  },
  {
    id: 'core_russian_twist',
    name: 'Giro Ruso',
    muscle: 'Core',
    muscles: ['Oblicuos', 'Abdomen'],
    equipment: ['dumbbell'],
    environments: ['home', 'gym'],
    level: ['beginner', 'intermediate'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: '4-8 kg', intermediate: '8-16 kg' },
    notes: 'Pies elevados para más dificultad. Rota el torso, no solo los brazos.',
    block: 'Core'
  },
  {
    id: 'core_dead_bug',
    name: 'Dead Bug',
    muscle: 'Core',
    muscles: ['Core Profundo', 'Transverso Abdominal'],
    equipment: [],
    environments: ['none', 'home', 'gym'],
    level: ['beginner', 'intermediate'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { beginner: 'Peso corporal', intermediate: 'Peso corporal' },
    notes: 'Espalda baja pegada al suelo todo el tiempo. Movimiento controlado y lento.',
    block: 'Core'
  },
  {
    id: 'core_crunch',
    name: 'Crunch Abdominal',
    muscle: 'Core',
    muscles: ['Recto Abdominal'],
    equipment: [],
    environments: ['none', 'home', 'gym'],
    level: ['beginner'],
    type: 'isolation',
    isLengthenedLoad: false,
    weightGuide: { beginner: 'Peso corporal' },
    notes: 'No jales el cuello. Flexiona la columna. Concéntrate en el abdomen.',
    block: 'Core'
  },
  {
    id: 'core_mountain_climber',
    name: 'Mountain Climbers',
    muscle: 'Core',
    muscles: ['Core', 'Hombros', 'Cardio'],
    equipment: [],
    environments: ['none', 'home', 'gym'],
    level: ['beginner', 'intermediate'],
    type: 'compound',
    isLengthenedLoad: false,
    weightGuide: { beginner: 'Peso corporal (20-30 reps)', intermediate: 'Peso corporal (30-50 reps)' },
    notes: 'Mantén las caderas bajas. Alterna las rodillas rápido manteniendo el core activo.',
    block: 'Core'
  }
]

// ─────────────────────────────────────────────────────────────
// Helpers de consulta
// ─────────────────────────────────────────────────────────────

/** Filtrar ejercicios por entorno y nivel */
export function filterExercises({ environment = 'gym', level = 'intermediate', muscle = null } = {}) {
  return EXERCISES.filter(ex => {
    const envOk = ex.environments.includes(environment) ||
      (environment === 'gym')  // gym tiene acceso a todo
    const levelOk = ex.level.includes(level) ||
      (level === 'advanced' && ex.level.includes('intermediate')) ||
      (level === 'intermediate' && ex.level.includes('beginner'))
    const muscleOk = muscle ? ex.muscle === muscle || ex.muscles.includes(muscle) : true
    return envOk && levelOk && muscleOk
  })
}

/** Obtener ejercicios por grupo muscular para un entorno */
export function getByMuscle(muscle, environment = 'gym', level = 'intermediate') {
  return filterExercises({ environment, level, muscle })
}

/** Obtener ejercicio por ID */
export function getById(id) {
  return EXERCISES.find(ex => ex.id === id) || null
}

/** Obtener alternativas del mismo grupo muscular (para swap) */
export function getAlternatives(exId, environment = 'gym', level = 'intermediate') {
  const ex = getById(exId)
  if (!ex) return []
  return filterExercises({ environment, level, muscle: ex.muscle })
    .filter(e => e.id !== exId)
}

/** Grupos musculares únicos disponibles */
export const MUSCLE_GROUPS = [...new Set(EXERCISES.map(e => e.muscle))]
