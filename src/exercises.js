// exercises.js — Generative exercise database v2
// ~110 base exercises × variations → 350+ exercises

// ── Generator ─────────────────────────────────────────────────
function generate(bases) {
  const result = []
  for (const base of bases) {
    for (const v of base.variations) {
      result.push({
        id:               v.id,
        name:             v.name,
        muscle:           base.primaryMuscle,
        secondaryMuscles: base.secondaryMuscles || [],
        equipment:        v.equipment,
        environment:      v.environment,
        level:            v.level,
        type:             base.type,
        movementPattern:  base.movementPattern,
        isLengthenedLoad: base.isLengthenedLoad || false,
        notes:            v.notes || base.notes || '',
        block:            base.primaryMuscle
      })
    }
  }
  return result
}

// ── Base exercises ────────────────────────────────────────────
const BASE_EXERCISES = [

  // ══════════════════════════════════════════════════
  // PECHO
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Pecho',
    secondaryMuscles: ['Tríceps', 'Hombros'],
    type: 'compound',
    movementPattern: 'horizontal_push',
    isLengthenedLoad: false,
    notes: 'Retrae las escápulas, pies firmes en el suelo. Baja la barra al pecho inferior.',
    variations: [
      {
        id: 'bench_press_barbell',
        name: 'Press de Banca con Barra',
        equipment: ['barbell', 'bench'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'bench_press_dumbbell',
        name: 'Press de Banca con Mancuernas',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Permite mayor rango de movimiento que la barra. Mantén muñecas neutras.'
      },
      {
        id: 'bench_press_smith',
        name: 'Press de Banca en Smith',
        equipment: ['smith', 'bench'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'El camino fijo reduce la demanda de estabilizadores. Útil para aprender el patrón.'
      },
      {
        id: 'bench_press_machine',
        name: 'Press de Pecho en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'Ideal para principiantes o para acumular volumen al final del entrenamiento.'
      },
      {
        id: 'bench_press_close_grip',
        name: 'Press de Banca Agarre Estrecho',
        equipment: ['barbell', 'bench'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Agarre a la anchura de los hombros. Mayor activación de tríceps y pecho interno.'
      }
    ]
  },

  {
    primaryMuscle: 'Pecho',
    secondaryMuscles: ['Tríceps', 'Hombros'],
    type: 'compound',
    movementPattern: 'incline_push',
    isLengthenedLoad: false,
    notes: 'Banco a 30-45°. Enfoca el pecho superior manteniendo codos a 45° del torso.',
    variations: [
      {
        id: 'incline_press_barbell',
        name: 'Press Inclinado con Barra',
        equipment: ['barbell', 'bench'],
        environment: ['gym'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'incline_press_dumbbell',
        name: 'Press Inclinado con Mancuernas',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'incline_press_smith',
        name: 'Press Inclinado en Smith',
        equipment: ['smith', 'bench'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'incline_press_machine',
        name: 'Press Inclinado en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'incline_press_cable',
        name: 'Press Inclinado en Cable',
        equipment: ['cable', 'bench'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Tensión constante durante todo el recorrido. Excelente para el pecho superior.'
      }
    ]
  },

  {
    primaryMuscle: 'Pecho',
    secondaryMuscles: ['Tríceps', 'Hombros'],
    type: 'compound',
    movementPattern: 'decline_push',
    isLengthenedLoad: false,
    notes: 'Banco en declive 15-30°. Activa principalmente el pecho inferior y esternal.',
    variations: [
      {
        id: 'decline_press_barbell',
        name: 'Press Declinado con Barra',
        equipment: ['barbell', 'bench'],
        environment: ['gym'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'decline_press_dumbbell',
        name: 'Press Declinado con Mancuernas',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'decline_press_smith',
        name: 'Press Declinado en Smith',
        equipment: ['smith', 'bench'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      }
    ]
  },

  {
    primaryMuscle: 'Pecho',
    secondaryMuscles: ['Bíceps', 'Hombros'],
    type: 'isolation',
    movementPattern: 'fly',
    isLengthenedLoad: true,
    notes: 'Mantén un ligero codo doblado. El estiramiento máximo es clave para hipertrofia.',
    variations: [
      {
        id: 'fly_dumbbell_flat',
        name: 'Aperturas con Mancuernas en Banco Plano',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'fly_dumbbell_incline',
        name: 'Aperturas con Mancuernas Inclinadas',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'fly_cable_low',
        name: 'Cruces de Cable (Polea Baja)',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Polea baja cruza hacia arriba. Excelente tensión en posición alargada del pecho superior.'
      },
      {
        id: 'fly_cable_high',
        name: 'Cruces de Cable (Polea Alta)',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Polea alta cruza hacia abajo. Trabaja el pecho inferior con tensión constante.'
      },
      {
        id: 'fly_cable_mid',
        name: 'Cruces de Cable (Polea Media)',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Polea a altura de pecho. Tensión constante durante todo el recorrido.'
      },
      {
        id: 'fly_machine_pec_deck',
        name: 'Pec Deck (Máquina de Aperturas)',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'Mantén los brazos semi-flexionados. Enfoca el apretón en el centro del pecho.'
      },
      {
        id: 'fly_band_chest',
        name: 'Aperturas con Banda Elástica',
        equipment: ['band'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Ancla la banda a la altura del pecho. Simula el cable con resistencia progresiva.'
      },
      {
        id: 'fly_dumbbell_decline',
        name: 'Aperturas con Mancuernas Declinadas',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Banco en declive. Mayor estiramiento del pecho inferior.'
      }
    ]
  },

  {
    primaryMuscle: 'Pecho',
    secondaryMuscles: ['Tríceps', 'Hombros', 'Core'],
    type: 'compound',
    movementPattern: 'push_up',
    isLengthenedLoad: false,
    notes: 'Mantén el cuerpo recto como tabla. Baja el pecho hasta casi tocar el suelo.',
    variations: [
      {
        id: 'push_up_standard',
        name: 'Flexiones de Brazos Estándar',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'push_up_wide',
        name: 'Flexiones con Agarre Amplio',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Agarre más ancho que los hombros. Mayor énfasis en el pecho.'
      },
      {
        id: 'push_up_diamond',
        name: 'Flexiones Diamante',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Manos juntas formando un rombo. Mayor activación de tríceps y pecho interno.'
      },
      {
        id: 'push_up_incline',
        name: 'Flexiones Inclinadas (Manos Elevadas)',
        equipment: ['bodyweight', 'bench'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner'],
        notes: 'Manos sobre una superficie elevada. Versión más fácil para principiantes.'
      },
      {
        id: 'push_up_decline',
        name: 'Flexiones Declinadas (Pies Elevados)',
        equipment: ['bodyweight', 'bench'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Pies elevados para mayor énfasis en el pecho superior y hombros.'
      },
      {
        id: 'push_up_archer',
        name: 'Flexiones Arquero',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['advanced'],
        notes: 'Un brazo extendido lateralmente mientras el otro ejecuta la flexión. Alta demanda unilateral.'
      },
      {
        id: 'push_up_plyometric',
        name: 'Flexiones Pliométricas',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Empuja con potencia explosiva para despegar las manos del suelo. Desarrolla potencia.'
      },
      {
        id: 'push_up_single_arm',
        name: 'Flexiones con Un Brazo',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['advanced'],
        notes: 'Un brazo detrás de la espalda. Máxima dificultad de flexiones con peso corporal.'
      }
    ]
  },

  {
    primaryMuscle: 'Pecho',
    secondaryMuscles: ['Tríceps', 'Hombros', 'Core'],
    type: 'compound',
    movementPattern: 'dip_chest',
    isLengthenedLoad: true,
    notes: 'Inclínate hacia adelante para enfatizar el pecho. Baja hasta que los hombros queden por debajo de los codos.',
    variations: [
      {
        id: 'dip_chest_parallel',
        name: 'Fondos en Paralelas (Énfasis Pecho)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'dip_chest_assisted',
        name: 'Fondos Asistidos (Énfasis Pecho)',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'dip_chest_weighted',
        name: 'Fondos con Peso (Énfasis Pecho)',
        equipment: ['bodyweight'],
        environment: ['gym'],
        level: ['advanced'],
        notes: 'Añade peso con cinturón o chaleco. Requiere dominar los fondos sin peso primero.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // ESPALDA
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Espalda',
    secondaryMuscles: ['Bíceps', 'Core'],
    type: 'compound',
    movementPattern: 'vertical_pull',
    isLengthenedLoad: true,
    notes: 'Inicia el movimiento retrayendo las escápulas. Lleva los codos hacia las caderas.',
    variations: [
      {
        id: 'pull_up_pronated',
        name: 'Dominadas con Agarre Prono',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'pull_up_supinated',
        name: 'Dominadas con Agarre Supino (Chin-Up)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'El agarre supino activa más el bíceps y resulta más fácil para principiantes.'
      },
      {
        id: 'pull_up_neutral',
        name: 'Dominadas con Agarre Neutro',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Palmas enfrentadas. Generalmente la variante más cómoda para las muñecas.'
      },
      {
        id: 'pull_up_wide',
        name: 'Dominadas con Agarre Amplio',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Mayor énfasis en el dorsal. Menor rango de movimiento efectivo.'
      },
      {
        id: 'pull_up_assisted_machine',
        name: 'Dominadas Asistidas con Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'pull_up_band_assisted',
        name: 'Dominadas con Banda Elástica',
        equipment: ['band', 'bodyweight'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'La banda reduce el peso corporal efectivo. Ideal para progresar hacia dominadas completas.'
      },
      {
        id: 'pull_up_weighted',
        name: 'Dominadas con Peso',
        equipment: ['bodyweight'],
        environment: ['gym'],
        level: ['advanced'],
        notes: 'Añade peso con cinturón lastrado o chaleco. Domina 15 dominadas limpias antes de añadir peso.'
      },
      {
        id: 'pull_up_commando',
        name: 'Dominadas Commando',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Agarre neutro, cabeza pasa alternadamente a cada lado de la barra.'
      }
    ]
  },

  {
    primaryMuscle: 'Espalda',
    secondaryMuscles: ['Bíceps'],
    type: 'compound',
    movementPattern: 'lat_pulldown',
    isLengthenedLoad: true,
    notes: 'Lleva la barra al pecho superior. Mantén el torso ligeramente inclinado hacia atrás.',
    variations: [
      {
        id: 'lat_pulldown_wide',
        name: 'Jalón al Pecho Agarre Amplio',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'lat_pulldown_neutral',
        name: 'Jalón al Pecho Agarre Neutro',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'lat_pulldown_reverse',
        name: 'Jalón al Pecho Agarre Supino',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'Agarre supino activa más bíceps. Variante más suave para principiantes.'
      },
      {
        id: 'lat_pulldown_single_arm',
        name: 'Jalón Unilateral en Polea',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Trabaja cada lado independientemente. Corrige desequilibrios musculares.'
      },
      {
        id: 'lat_pulldown_behind_neck',
        name: 'Jalón a la Nuca',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Úsalo con precaución. Requiere buena movilidad de hombros y cuello.'
      },
      {
        id: 'lat_pulldown_straight_arm',
        name: 'Jalón con Brazos Extendidos',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Brazos casi rectos. Aísla el dorsal sin activar el bíceps.'
      }
    ]
  },

  {
    primaryMuscle: 'Espalda',
    secondaryMuscles: ['Bíceps', 'Core'],
    type: 'compound',
    movementPattern: 'horizontal_row',
    isLengthenedLoad: false,
    notes: 'Lleva el codo cerca del cuerpo. Retrae y deprime la escápula al final del movimiento.',
    variations: [
      {
        id: 'row_barbell_bent',
        name: 'Remo con Barra Inclinado',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Torso a 45°. Lleva la barra al abdomen bajo. Mantén la espalda plana.'
      },
      {
        id: 'row_dumbbell_single',
        name: 'Remo con Mancuerna Unilateral',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Apoya una rodilla y mano en el banco. Lleva la mancuerna hacia la cadera.'
      },
      {
        id: 'row_cable_seated',
        name: 'Remo en Polea Sentado',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Mantén la espalda recta. Lleva los codos hacia atrás apretando las escápulas.'
      },
      {
        id: 'row_machine_chest_supported',
        name: 'Remo en Máquina con Soporte de Pecho',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'El soporte de pecho elimina el estrés lumbar. Ideal para aislar la espalda.'
      },
      {
        id: 'row_tbar',
        name: 'Remo en T (T-Bar Row)',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Posición entre remo vertical e horizontal. Excelente para el grosor de la espalda.'
      },
      {
        id: 'row_inverted_bodyweight',
        name: 'Remo Invertido con Peso Corporal',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'También llamado Australian Pull-Up. Más fácil que las dominadas.'
      },
      {
        id: 'row_band_seated',
        name: 'Remo con Banda Elástica Sentado',
        equipment: ['band'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Ancla la banda a los pies o a una puerta. Ideal para entrenamiento en casa.'
      },
      {
        id: 'row_suspension_trx',
        name: 'Remo en Suspensión (TRX)',
        equipment: ['suspension'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Inclina el cuerpo más para aumentar la dificultad. Activa también el core.'
      },
      {
        id: 'row_meadows',
        name: 'Remo Meadows (Landmine Row)',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Barra anclada en una esquina. Remo unilateral explosivo y funcional.'
      },
      {
        id: 'row_cable_single_arm',
        name: 'Remo Unilateral en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Cable a la altura de la cintura. Trabaja cada lado independientemente.'
      }
    ]
  },

  {
    primaryMuscle: 'Espalda',
    secondaryMuscles: ['Glúteo', 'Isquiotibiales', 'Core'],
    type: 'compound',
    movementPattern: 'deadlift',
    isLengthenedLoad: false,
    notes: 'Mantén la espalda neutra durante todo el movimiento. La carga parte del suelo con las caderas.',
    variations: [
      {
        id: 'deadlift_conventional',
        name: 'Peso Muerto Convencional',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'deadlift_sumo',
        name: 'Peso Muerto Sumo',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Pies abiertos, más vertical. Reduce estrés lumbar y activa más el aductor.'
      },
      {
        id: 'deadlift_trap_bar',
        name: 'Peso Muerto con Barra Hexagonal',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'El centro de masa está dentro de la barra. Más fácil de aprender y menos estrés lumbar.'
      },
      {
        id: 'deadlift_dumbbell',
        name: 'Peso Muerto con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Buena opción para aprender el patrón de movimiento o entrenar en casa.'
      },
      {
        id: 'deadlift_deficit',
        name: 'Peso Muerto en Déficit',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['advanced'],
        notes: 'De pie sobre una plataforma elevada. Mayor rango de movimiento y mayor activación.'
      }
    ]
  },

  {
    primaryMuscle: 'Espalda',
    secondaryMuscles: ['Glúteo', 'Isquiotibiales', 'Core'],
    type: 'compound',
    movementPattern: 'romanian_deadlift_back',
    isLengthenedLoad: false,
    notes: 'Bisagra de cadera con rodillas ligeramente dobladas. Barra desliza por las piernas.',
    variations: [
      {
        id: 'rdl_barbell_back',
        name: 'Peso Muerto Rumano con Barra (Espalda)',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Énfasis en la espalda baja y erector. Mantén el pecho hacia adelante.'
      }
    ]
  },

  {
    primaryMuscle: 'Espalda',
    secondaryMuscles: ['Core', 'Glúteo'],
    type: 'isolation',
    movementPattern: 'back_extension',
    isLengthenedLoad: false,
    notes: 'Contrae la espalda baja al subir. No hiperextiendas la columna en el punto máximo.',
    variations: [
      {
        id: 'back_extension_machine',
        name: 'Extensión de Espalda en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'good_morning_barbell',
        name: 'Good Morning con Barra',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Barra sobre trapecios. Bisagra de cadera controlada. Excelente para espalda baja e isquiotibiales.'
      },
      {
        id: 'superman_bodyweight',
        name: 'Superman (Extensión en Suelo)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner'],
        notes: 'Tumbado boca abajo, eleva simultáneamente brazos y piernas.'
      },
      {
        id: 'back_extension_weighted',
        name: 'Extensión de Espalda con Peso',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Añade disco al pecho o placa de peso para mayor resistencia.'
      }
    ]
  },

  {
    primaryMuscle: 'Espalda',
    secondaryMuscles: ['Bíceps', 'Hombros'],
    type: 'isolation',
    movementPattern: 'pullover',
    isLengthenedLoad: true,
    notes: 'Mantén los brazos casi rectos. Enfoca el jalón en el dorsal, no en los brazos.',
    variations: [
      {
        id: 'pullover_dumbbell',
        name: 'Pullover con Mancuerna',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Tumbado en banco. Baja la mancuerna por encima de la cabeza. Estiramiento profundo del dorsal.'
      },
      {
        id: 'pullover_cable',
        name: 'Pullover de Brazos Rectos en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Tensión constante en todo el rango. Superior a la mancuerna para hipertrofia.'
      },
      {
        id: 'pullover_machine',
        name: 'Pullover en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'pullover_band',
        name: 'Pullover con Banda Elástica',
        equipment: ['band'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Ancla la banda arriba. Permite entrenamiento en casa con buena activación del dorsal.'
      }
    ]
  },

  {
    primaryMuscle: 'Espalda',
    secondaryMuscles: ['Trapecios'],
    type: 'isolation',
    movementPattern: 'shrug',
    isLengthenedLoad: false,
    notes: 'Eleva los hombros directamente hacia las orejas. Sin rotación de hombros.',
    variations: [
      {
        id: 'shrug_barbell',
        name: 'Encogimiento con Barra',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'shrug_dumbbell',
        name: 'Encogimiento con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'shrug_cable',
        name: 'Encogimiento en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'Tensión constante durante todo el rango. Excelente para los trapecios.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // HOMBROS
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Hombros',
    secondaryMuscles: ['Tríceps', 'Core'],
    type: 'compound',
    movementPattern: 'overhead_press',
    isLengthenedLoad: false,
    notes: 'Aprieta el core. Empuja la barra hacia arriba y ligeramente hacia atrás al pasar la cabeza.',
    variations: [
      {
        id: 'overhead_press_barbell_standing',
        name: 'Press Militar con Barra (de Pie)',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'overhead_press_barbell_seated',
        name: 'Press Militar con Barra (Sentado)',
        equipment: ['barbell', 'bench'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Sentado elimina la asistencia de piernas. Mayor aislamiento de hombros.'
      },
      {
        id: 'overhead_press_dumbbell_seated',
        name: 'Press de Hombros con Mancuernas (Sentado)',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'overhead_press_dumbbell_standing',
        name: 'Press de Hombros con Mancuernas (De Pie)',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'De pie activa más el core y los estabilizadores.'
      },
      {
        id: 'overhead_press_smith',
        name: 'Press de Hombros en Smith',
        equipment: ['smith', 'bench'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'push_press_barbell',
        name: 'Push Press con Barra',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Usa impulso de piernas para mover más peso. Ejercicio potente y funcional.'
      },
      {
        id: 'arnold_press_dumbbell',
        name: 'Press Arnold con Mancuernas',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Rotación de muñecas durante el press. Activa los tres haces del deltoides.'
      },
      {
        id: 'landmine_press_shoulder',
        name: 'Press con Landmine (Un Brazo)',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Barra anclada. Trayectoria en arco que es amigable con el hombro.'
      }
    ]
  },

  {
    primaryMuscle: 'Hombros',
    secondaryMuscles: ['Trapecios'],
    type: 'isolation',
    movementPattern: 'lateral_raise',
    isLengthenedLoad: true,
    notes: 'Eleva los brazos hasta la altura de los hombros. Ligeramente inclinado hacia adelante para el haz lateral.',
    variations: [
      {
        id: 'lateral_raise_dumbbell',
        name: 'Elevaciones Laterales con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'lateral_raise_cable',
        name: 'Elevaciones Laterales en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'El cable mantiene tensión constante. Superior a la mancuerna para hipertrofia.'
      },
      {
        id: 'lateral_raise_machine',
        name: 'Elevaciones Laterales en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'lateral_raise_band',
        name: 'Elevaciones Laterales con Banda',
        equipment: ['band'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'lateral_raise_single_cable',
        name: 'Elevación Lateral Unilateral en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Trabaja cada hombro por separado. Mayor control y rango de movimiento.'
      },
      {
        id: 'lateral_raise_leaning_cable',
        name: 'Elevación Lateral en Cable Inclinado',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Inclinado hacia la polea. Mayor estiramiento del deltoides lateral en posición alargada.'
      }
    ]
  },

  {
    primaryMuscle: 'Hombros',
    secondaryMuscles: ['Trapecios', 'Core'],
    type: 'isolation',
    movementPattern: 'front_raise',
    isLengthenedLoad: false,
    notes: 'Eleva hasta la altura del hombro o ligeramente por encima. Controla la bajada.',
    variations: [
      {
        id: 'front_raise_dumbbell',
        name: 'Elevaciones Frontales con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'front_raise_barbell',
        name: 'Elevaciones Frontales con Barra',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'front_raise_cable',
        name: 'Elevaciones Frontales en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'front_raise_plate',
        name: 'Elevaciones Frontales con Disco',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'Sujeta un disco con ambas manos. Activa el deltoides anterior con buena tensión.'
      }
    ]
  },

  {
    primaryMuscle: 'Hombros',
    secondaryMuscles: ['Espalda', 'Bíceps'],
    type: 'isolation',
    movementPattern: 'rear_delt_fly',
    isLengthenedLoad: true,
    notes: 'Inclínate hacia adelante. Lleva los codos hacia afuera y atrás. Enfoca el deltoides posterior.',
    variations: [
      {
        id: 'rear_delt_fly_dumbbell',
        name: 'Pájaros con Mancuernas (Deltoides Posterior)',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'rear_delt_fly_cable',
        name: 'Aperturas en Cable (Deltoides Posterior)',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Poleas cruzadas a la altura de la cabeza. Excelente activación del deltoides posterior.'
      },
      {
        id: 'rear_delt_fly_machine',
        name: 'Máquina de Deltoides Posterior',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'face_pull_cable',
        name: 'Face Pull en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Cuerda a la altura de la cara. Tira hacia la frente separando las manos. Excelente para salud del hombro.'
      },
      {
        id: 'rear_delt_fly_band',
        name: 'Pájaros con Banda Elástica',
        equipment: ['band'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'rear_delt_row_cable',
        name: 'Remo para Deltoides Posterior en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Codo alto, polea al nivel del pecho. Jala separando el codo del cuerpo.'
      }
    ]
  },

  {
    primaryMuscle: 'Hombros',
    secondaryMuscles: ['Trapecios'],
    type: 'isolation',
    movementPattern: 'upright_row',
    isLengthenedLoad: false,
    notes: 'Lleva los codos hacia arriba por encima de los hombros. Mantén la barra cerca del cuerpo.',
    variations: [
      {
        id: 'upright_row_barbell',
        name: 'Remo al Mentón con Barra',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Puede causar molestias en el hombro. Usa agarre amplio para reducir riesgo.'
      },
      {
        id: 'upright_row_dumbbell',
        name: 'Remo al Mentón con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'upright_row_cable',
        name: 'Remo al Mentón en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'upright_row_band',
        name: 'Remo al Mentón con Banda',
        equipment: ['band'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate']
      }
    ]
  },

  {
    primaryMuscle: 'Hombros',
    secondaryMuscles: ['Core', 'Trapecios'],
    type: 'compound',
    movementPattern: 'handstand',
    isLengthenedLoad: false,
    notes: 'Requiere control y fuerza de hombros. Comienza con variantes asistidas.',
    variations: [
      {
        id: 'handstand_push_up_wall',
        name: 'Flexión en Parada de Manos (Asistida en Pared)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Piernas contra la pared. Baja la cabeza hasta el suelo controladamente.'
      },
      {
        id: 'pike_push_up',
        name: 'Flexión en Pica',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Caderas altas formando un triángulo. Trabaja los hombros con el propio peso.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // BÍCEPS
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Bíceps',
    secondaryMuscles: ['Braquial', 'Braquiorradial'],
    type: 'isolation',
    movementPattern: 'curl_standing',
    isLengthenedLoad: true,
    notes: 'Mantén los codos fijos a los costados. Supina la muñeca al subir para máxima activación del bíceps.',
    variations: [
      {
        id: 'curl_barbell_standing',
        name: 'Curl con Barra de Pie',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'curl_ez_bar',
        name: 'Curl con Barra EZ',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'La barra EZ reduce el estrés en las muñecas. Alternativa cómoda a la barra recta.'
      },
      {
        id: 'curl_dumbbell_standing',
        name: 'Curl con Mancuernas de Pie',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'curl_dumbbell_alternating',
        name: 'Curl Alternado con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'curl_cable_standing',
        name: 'Curl en Cable de Pie',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Tensión constante en todo el rango. Ideal para el pico del bíceps.'
      },
      {
        id: 'curl_band_standing',
        name: 'Curl con Banda Elástica de Pie',
        equipment: ['band'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate']
      }
    ]
  },

  {
    primaryMuscle: 'Bíceps',
    secondaryMuscles: ['Braquial'],
    type: 'isolation',
    movementPattern: 'curl_lengthened',
    isLengthenedLoad: true,
    notes: 'El brazo queda por encima del hombro. Máximo estiramiento del bíceps para mayor hipertrofia.',
    variations: [
      {
        id: 'curl_incline_dumbbell',
        name: 'Curl Inclinado con Mancuernas',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Banco inclinado crea mayor estiramiento en el bíceps. Excelente para isLengthenedLoad.'
      },
      {
        id: 'curl_cable_high_overhead',
        name: 'Curl en Cable Overhead (Bíceps Alargado)',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Cable por encima de la cabeza. Máximo estiramiento del bíceps en posición alargada.'
      },
      {
        id: 'curl_spider',
        name: 'Spider Curl (Pecho sobre el Banco)',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Pecho apoyado en el banco inclinado. Aísla completamente el bíceps.'
      }
    ]
  },

  {
    primaryMuscle: 'Bíceps',
    secondaryMuscles: ['Braquiorradial'],
    type: 'isolation',
    movementPattern: 'curl_isolated',
    isLengthenedLoad: false,
    notes: 'El banco Scott o la concentración maximizan el aislamiento del bíceps.',
    variations: [
      {
        id: 'curl_preacher_ez',
        name: 'Curl en Scott con Barra EZ',
        equipment: ['barbell', 'bench'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'El banco Scott fija los codos y aísla el bíceps. Enfatiza la cabeza corta.'
      },
      {
        id: 'curl_preacher_dumbbell',
        name: 'Curl en Scott con Mancuerna',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'curl_preacher_machine',
        name: 'Curl en Máquina Scott',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'curl_concentration',
        name: 'Curl de Concentración',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Codo apoyado en el muslo. Excelente para el pico del bíceps con máximo aislamiento.'
      }
    ]
  },

  {
    primaryMuscle: 'Bíceps',
    secondaryMuscles: ['Braquiorradial', 'Braquial'],
    type: 'isolation',
    movementPattern: 'curl_neutral',
    isLengthenedLoad: false,
    notes: 'Agarre neutro (pulgar arriba). Activa más el braquiorradial y el braquial.',
    variations: [
      {
        id: 'curl_hammer_dumbbell',
        name: 'Curl Martillo con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'curl_hammer_cable',
        name: 'Curl Martillo en Cable con Cuerda',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'Cuerda en polea baja. Agarre neutro con tensión constante.'
      },
      {
        id: 'curl_cross_body_dumbbell',
        name: 'Curl Cruzado con Mancuerna',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['intermediate'],
        notes: 'Cruza la mancuerna hacia el hombro opuesto. Variante del martillo.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // TRÍCEPS
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Tríceps',
    secondaryMuscles: ['Hombros'],
    type: 'isolation',
    movementPattern: 'triceps_pushdown',
    isLengthenedLoad: false,
    notes: 'Mantén los codos fijos. La extensión debe ser solo del codo, no del hombro.',
    variations: [
      {
        id: 'triceps_pushdown_bar',
        name: 'Extensión en Polea Alta con Barra',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'triceps_pushdown_rope',
        name: 'Extensión en Polea Alta con Cuerda',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Separa la cuerda al final para mayor activación de la cabeza lateral.'
      },
      {
        id: 'triceps_pushdown_single_arm',
        name: 'Extensión Unilateral en Polea Alta',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Un brazo a la vez. Corrige desequilibrios entre lados.'
      },
      {
        id: 'triceps_pushdown_band',
        name: 'Extensión de Tríceps con Banda',
        equipment: ['band'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'triceps_pushdown_reverse_grip',
        name: 'Extensión en Polea Agarre Supino',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Agarre supino activa diferente la cabeza medial del tríceps.'
      }
    ]
  },

  {
    primaryMuscle: 'Tríceps',
    secondaryMuscles: ['Hombros'],
    type: 'isolation',
    movementPattern: 'triceps_overhead',
    isLengthenedLoad: true,
    notes: 'Brazos sobre la cabeza. Máximo estiramiento de la cabeza larga del tríceps.',
    variations: [
      {
        id: 'triceps_overhead_dumbbell',
        name: 'Extensión de Tríceps Overhead con Mancuerna',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Con una o dos manos. Mayor estiramiento de la cabeza larga del tríceps.'
      },
      {
        id: 'triceps_overhead_cable',
        name: 'Extensión de Tríceps Overhead en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Cable a la espalda. Excelente para la cabeza larga del tríceps en posición alargada.'
      },
      {
        id: 'triceps_overhead_barbell',
        name: 'Skullcrusher con Barra EZ',
        equipment: ['barbell', 'bench'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Baja la barra a la frente. Mantén los codos apuntando al techo.'
      },
      {
        id: 'triceps_overhead_band',
        name: 'Extensión de Tríceps Overhead con Banda',
        equipment: ['band'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Banda detrás de la cabeza. Gran opción para entrenar la cabeza larga en casa.'
      }
    ]
  },

  {
    primaryMuscle: 'Tríceps',
    secondaryMuscles: ['Hombros', 'Pecho'],
    type: 'compound',
    movementPattern: 'triceps_press',
    isLengthenedLoad: false,
    notes: 'Movimientos de press que enfatizan el tríceps. Mueve más peso que las extensiones aisladas.',
    variations: [
      {
        id: 'triceps_close_grip_bench',
        name: 'Press de Banca con Agarre Estrecho',
        equipment: ['barbell', 'bench'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Agarre a la anchura de los hombros. Mayor activación de tríceps y pecho interno.'
      },
      {
        id: 'triceps_dip_bench',
        name: 'Fondos de Tríceps en Banco',
        equipment: ['bodyweight', 'bench'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Manos en el banco detrás. Baja hasta que los codos estén a 90°.'
      },
      {
        id: 'triceps_dip_parallel',
        name: 'Fondos en Paralelas (Énfasis Tríceps)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Torso vertical para mayor énfasis en tríceps. Contrario al fondo de pecho.'
      },
      {
        id: 'triceps_machine_extension',
        name: 'Extensión de Tríceps en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'triceps_kickback_dumbbell',
        name: 'Patada de Tríceps con Mancuerna',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Codo fijo a 90° al inicio. Extiende completamente el brazo atrás.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // CUÁDRICEPS
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Cuádriceps',
    secondaryMuscles: ['Glúteo', 'Core', 'Isquiotibiales'],
    type: 'compound',
    movementPattern: 'squat',
    isLengthenedLoad: false,
    notes: 'Rodillas en la dirección de los pies. Espalda neutra. Baja hasta que los muslos estén paralelos al suelo.',
    variations: [
      {
        id: 'squat_barbell_back',
        name: 'Sentadilla con Barra (Back Squat)',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'squat_barbell_front',
        name: 'Sentadilla Frontal con Barra',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['advanced'],
        notes: 'Barra sobre la clavícula. Mayor activación de cuádriceps y core. Requiere buena movilidad.'
      },
      {
        id: 'squat_goblet',
        name: 'Sentadilla Goblet',
        equipment: ['kettlebell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Mancuerna o kettlebell sostenida al pecho. Ideal para aprender la mecánica.'
      },
      {
        id: 'squat_dumbbell',
        name: 'Sentadilla con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'squat_smith',
        name: 'Sentadilla en Smith',
        equipment: ['smith'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'El camino fijo ayuda a la técnica. Menos demanda de estabilizadores.'
      },
      {
        id: 'squat_bodyweight',
        name: 'Sentadilla con Peso Corporal',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner']
      },
      {
        id: 'squat_pause_bottom',
        name: 'Sentadilla con Pausa en el Fondo',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: '2-3 segundos de pausa al fondo. Elimina el rebote y maximiza el trabajo muscular.'
      },
      {
        id: 'squat_overhead',
        name: 'Sentadilla con Barra sobre la Cabeza',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['advanced'],
        notes: 'Requiere alta movilidad de hombros, cadera y tobillos. Excelente indicador de movilidad.'
      }
    ]
  },

  {
    primaryMuscle: 'Cuádriceps',
    secondaryMuscles: ['Glúteo'],
    type: 'compound',
    movementPattern: 'leg_press',
    isLengthenedLoad: false,
    notes: 'Pies bajos en la plataforma para más cuádriceps. Pies altos para más glúteo.',
    variations: [
      {
        id: 'leg_press_standard',
        name: 'Prensa de Piernas',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'leg_press_narrow_feet',
        name: 'Prensa de Piernas (Pies Juntos)',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Pies juntos en la parte baja de la plataforma. Máxima activación de cuádriceps.'
      },
      {
        id: 'leg_press_single_leg',
        name: 'Prensa de Piernas Unilateral',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Una pierna a la vez. Corrige desequilibrios y aumenta la demanda muscular.'
      }
    ]
  },

  {
    primaryMuscle: 'Cuádriceps',
    secondaryMuscles: [],
    type: 'isolation',
    movementPattern: 'knee_extension',
    isLengthenedLoad: false,
    notes: 'Extiende completamente la rodilla. Mantén el muslo pegado al asiento.',
    variations: [
      {
        id: 'leg_extension_machine',
        name: 'Extensión de Piernas en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'leg_extension_cable',
        name: 'Extensión de Piernas en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Útil cuando no hay máquina disponible. Requiere tobillera.'
      },
      {
        id: 'leg_extension_single',
        name: 'Extensión de Piernas Unilateral',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'Una pierna a la vez. Permite corregir desequilibrios entre piernas.'
      }
    ]
  },

  {
    primaryMuscle: 'Cuádriceps',
    secondaryMuscles: ['Glúteo', 'Isquiotibiales'],
    type: 'compound',
    movementPattern: 'hack_squat',
    isLengthenedLoad: false,
    notes: 'La máquina guía el movimiento. Excelente para aislar cuádriceps sin carga espinal.',
    variations: [
      {
        id: 'hack_squat_machine',
        name: 'Hack Squat en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'hack_squat_barbell',
        name: 'Hack Squat con Barra (Detrás)',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['advanced'],
        notes: 'Barra detrás de las piernas. Movimiento original del hack squat. Alta dificultad técnica.'
      }
    ]
  },

  {
    primaryMuscle: 'Cuádriceps',
    secondaryMuscles: ['Glúteo', 'Isquiotibiales'],
    type: 'compound',
    movementPattern: 'lunge',
    isLengthenedLoad: false,
    notes: 'Paso largo hacia adelante. La rodilla trasera baja sin tocar el suelo. Torso erguido.',
    variations: [
      {
        id: 'lunge_walking_dumbbell',
        name: 'Zancada Caminando con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'lunge_reverse_dumbbell',
        name: 'Zancada Inversa con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Paso hacia atrás. Menos estrés en la rodilla que la zancada frontal.'
      },
      {
        id: 'lunge_barbell',
        name: 'Zancada con Barra',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'lunge_bodyweight',
        name: 'Zancada con Peso Corporal',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner']
      },
      {
        id: 'lunge_lateral_dumbbell',
        name: 'Zancada Lateral con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Paso hacia un lado. Activa más el aductor y el cuádriceps lateral.'
      },
      {
        id: 'step_up_dumbbell',
        name: 'Step Up con Mancuernas',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Sube a un escalón o banco. Excelente para cuádriceps y glúteo unilateral.'
      },
      {
        id: 'squat_bulgarian_split',
        name: 'Sentadilla Búlgara (Split Squat)',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Pie trasero elevado. Excelente para cuádriceps y equilibrio unilateral.'
      },
      {
        id: 'pistol_squat',
        name: 'Sentadilla a Una Pierna (Pistol Squat)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['advanced'],
        notes: 'La pierna libre extendida al frente. Máxima dificultad de sentadilla unilateral.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // ISQUIOTIBIALES
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Isquiotibiales',
    secondaryMuscles: ['Glúteo', 'Espalda'],
    type: 'compound',
    movementPattern: 'romanian_deadlift',
    isLengthenedLoad: true,
    notes: 'Bisagra de cadera con rodillas ligeramente dobladas. Siente el estiramiento en los isquiotibiales.',
    variations: [
      {
        id: 'rdl_barbell',
        name: 'Peso Muerto Rumano con Barra',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'rdl_dumbbell',
        name: 'Peso Muerto Rumano con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'rdl_single_leg_dumbbell',
        name: 'Peso Muerto Rumano Unilateral con Mancuerna',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Trabaja cada pierna individualmente. Requiere equilibrio y estabilidad de core.'
      },
      {
        id: 'rdl_cable',
        name: 'Peso Muerto Rumano en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'El cable mantiene tensión constante. Excelente para el trabajo en posición alargada.'
      },
      {
        id: 'rdl_single_leg_barbell',
        name: 'Peso Muerto Rumano Unilateral con Barra',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['advanced'],
        notes: 'Alta dificultad técnica. Máxima tensión unilateral en los isquiotibiales.'
      }
    ]
  },

  {
    primaryMuscle: 'Isquiotibiales',
    secondaryMuscles: ['Glúteo', 'Pantorrillas'],
    type: 'isolation',
    movementPattern: 'leg_curl',
    isLengthenedLoad: true,
    notes: 'Contrae los isquiotibiales completamente. Controla la bajada lentamente.',
    variations: [
      {
        id: 'leg_curl_lying',
        name: 'Curl de Piernas Tumbado en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'leg_curl_seated',
        name: 'Curl de Piernas Sentado en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'La posición sentada alarga el bíceps femoral. Mayor activación en posición alargada.'
      },
      {
        id: 'leg_curl_standing',
        name: 'Curl de Piernas de Pie en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'nordic_curl',
        name: 'Curl Nórdico',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Rodillas fijas, baja el cuerpo controladamente. Uno de los mejores ejercicios para prevenir lesiones.'
      },
      {
        id: 'leg_curl_stability_ball',
        name: 'Curl de Isquiotibiales con Balón',
        equipment: ['stability_ball'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Tumbado, talones en el balón. Eleva las caderas y jala el balón hacia los glúteos.'
      },
      {
        id: 'leg_curl_band',
        name: 'Curl de Isquiotibiales con Banda',
        equipment: ['band'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Ancla la banda a una pared. Tumbado, lleva el talón hacia los glúteos.'
      }
    ]
  },

  {
    primaryMuscle: 'Isquiotibiales',
    secondaryMuscles: ['Glúteo'],
    type: 'compound',
    movementPattern: 'glute_ham',
    isLengthenedLoad: false,
    notes: 'Los isquiotibiales actúan tanto en flexión de rodilla como en extensión de cadera.',
    variations: [
      {
        id: 'glute_ham_raise',
        name: 'Glute Ham Raise',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['advanced'],
        notes: 'Máquina GHD. Trabaja los isquiotibiales en acción tanto de cadera como de rodilla.'
      },
      {
        id: 'kettlebell_swing',
        name: 'Swing con Kettlebell',
        equipment: ['kettlebell'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Potencia explosiva desde los isquiotibiales y glúteos. No es una sentadilla, es una bisagra.'
      },
      {
        id: 'good_morning_hamstring',
        name: 'Good Morning (Énfasis Isquiotibiales)',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Flexión de cadera con rodillas más dobladas. Estiramiento intenso en isquiotibiales.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // GLÚTEO
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Glúteo',
    secondaryMuscles: ['Isquiotibiales', 'Core'],
    type: 'compound',
    movementPattern: 'hip_thrust',
    isLengthenedLoad: false,
    notes: 'Aprieta el glúteo al máximo en la parte superior. Las caderas suben hasta quedar paralelas al suelo.',
    variations: [
      {
        id: 'hip_thrust_barbell',
        name: 'Hip Thrust con Barra',
        equipment: ['barbell', 'bench'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'hip_thrust_dumbbell',
        name: 'Hip Thrust con Mancuerna',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'hip_thrust_machine',
        name: 'Hip Thrust en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'hip_thrust_single_leg',
        name: 'Hip Thrust Unilateral con Barra',
        equipment: ['barbell', 'bench'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Una pierna extendida. Mayor activación y corrección de desequilibrios.'
      },
      {
        id: 'hip_thrust_band',
        name: 'Hip Thrust con Banda en Rodillas',
        equipment: ['band', 'bench'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Banda sobre las rodillas añade resistencia abductora. Activa glúteo mediano.'
      },
      {
        id: 'glute_bridge_floor',
        name: 'Puente de Glúteos en Suelo',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner'],
        notes: 'Sin banco, en el suelo. Versión más accesible del hip thrust.'
      },
      {
        id: 'glute_bridge_single_leg',
        name: 'Puente de Glúteos Unilateral en Suelo',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Una pierna. Mayor activación con solo el peso corporal.'
      }
    ]
  },

  {
    primaryMuscle: 'Glúteo',
    secondaryMuscles: ['Isquiotibiales'],
    type: 'isolation',
    movementPattern: 'glute_kickback',
    isLengthenedLoad: false,
    notes: 'Mantén la cadera estable. Solo extiende la cadera, sin rotar el torso.',
    variations: [
      {
        id: 'glute_kickback_cable',
        name: 'Patada de Glúteo en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'donkey_kick_bodyweight',
        name: 'Donkey Kick en Suelo',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'donkey_kick_band',
        name: 'Donkey Kick con Banda',
        equipment: ['band'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'glute_kickback_machine',
        name: 'Extensión de Cadera en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'glute_kickback_smith',
        name: 'Patada de Glúteo en Smith',
        equipment: ['smith'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'Pie en la barra del Smith. Extensión de cadera con resistencia controlada.'
      }
    ]
  },

  {
    primaryMuscle: 'Glúteo',
    secondaryMuscles: ['Abductores'],
    type: 'isolation',
    movementPattern: 'hip_abduction',
    isLengthenedLoad: false,
    notes: 'Mueve la pierna hacia afuera controladamente. Activa el glúteo mediano.',
    variations: [
      {
        id: 'hip_abduction_machine',
        name: 'Abducción de Cadera en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'hip_abduction_cable',
        name: 'Abducción de Cadera en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'clamshell_band',
        name: 'Apertura de Cadera (Clamshell) con Banda',
        equipment: ['band'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Tumbado de lado, rodillas dobladas. Abre como una almeja. Activa glúteo mediano.'
      },
      {
        id: 'lateral_band_walk',
        name: 'Caminar Lateral con Banda',
        equipment: ['band'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Banda en tobillos o rodillas. Pasos laterales con rodillas semi-dobladas.'
      },
      {
        id: 'fire_hydrant_bodyweight',
        name: 'Fire Hydrant (Abducción en Cuadrupedia)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'En cuadrupedia, eleva la rodilla hacia afuera. Activa glúteo mediano y tensor.'
      }
    ]
  },

  {
    primaryMuscle: 'Glúteo',
    secondaryMuscles: ['Cuádriceps', 'Isquiotibiales'],
    type: 'compound',
    movementPattern: 'glute_squat',
    isLengthenedLoad: false,
    notes: 'Enfatiza el glúteo con mayor profundidad de sentadilla y torso más inclinado.',
    variations: [
      {
        id: 'sumo_squat_dumbbell',
        name: 'Sentadilla Sumo con Mancuerna',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Pies muy abiertos. Activa más el glúteo mediano e interior.'
      },
      {
        id: 'sumo_squat_barbell',
        name: 'Sentadilla Sumo con Barra',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Postura muy amplia. Mayor activación de glúteo e isquiotibiales.'
      },
      {
        id: 'deep_squat_bodyweight',
        name: 'Sentadilla Profunda con Peso Corporal',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Mayor rango de movimiento activa más el glúteo en la posición baja.'
      }
    ]
  },

  {
    primaryMuscle: 'Glúteo',
    secondaryMuscles: ['Cuádriceps', 'Isquiotibiales'],
    type: 'compound',
    movementPattern: 'glute_step',
    isLengthenedLoad: false,
    notes: 'Activa el glúteo conscientemente al subir. La pierna de apoyo hace todo el trabajo.',
    variations: [
      {
        id: 'step_up_bodyweight',
        name: 'Step Up con Peso Corporal',
        equipment: ['bodyweight', 'bench'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner']
      },
      {
        id: 'step_up_dumbbell_glute',
        name: 'Step Up con Mancuernas (Énfasis Glúteo)',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'step_up_barbell',
        name: 'Step Up con Barra',
        equipment: ['barbell', 'bench'],
        environment: ['gym'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'reverse_step_up',
        name: 'Step Up Inverso',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['intermediate'],
        notes: 'Sube desde atrás del escalón. Variante con mayor enfoque en glúteo.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // PANTORRILLAS
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Pantorrillas',
    secondaryMuscles: [],
    type: 'isolation',
    movementPattern: 'calf_raise_standing',
    isLengthenedLoad: false,
    notes: 'Sube al máximo en la punta y baja completamente. El rango completo es clave para las pantorrillas.',
    variations: [
      {
        id: 'calf_raise_standing_machine',
        name: 'Elevación de Talones de Pie en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced']
      },
      {
        id: 'calf_raise_standing_barbell',
        name: 'Elevación de Talones con Barra',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'calf_raise_standing_dumbbell',
        name: 'Elevación de Talones con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'calf_raise_single_leg_bodyweight',
        name: 'Elevación de Talones Unilateral',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Una sola pierna. Mucho más difícil que la bilateral. Excelente para progresar.'
      },
      {
        id: 'calf_raise_leg_press',
        name: 'Elevación de Talones en Prensa',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'En la prensa de piernas, empuja con la punta del pie. Permite mucho peso.'
      },
      {
        id: 'calf_raise_standing_smith',
        name: 'Elevación de Talones en Smith',
        equipment: ['smith'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'Smith machine de pie sobre un escalón. Permite mucho volumen.'
      }
    ]
  },

  {
    primaryMuscle: 'Pantorrillas',
    secondaryMuscles: [],
    type: 'isolation',
    movementPattern: 'calf_raise_seated',
    isLengthenedLoad: false,
    notes: 'Rodilla doblada a 90° aísla el sóleo. Diferente músculo al gastrocnemio.',
    variations: [
      {
        id: 'calf_raise_seated_machine',
        name: 'Elevación de Talones Sentado en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'La posición sentada trabaja principalmente el sóleo, no el gastrocnemio.'
      },
      {
        id: 'calf_raise_seated_dumbbell',
        name: 'Elevación de Talones Sentado con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Mancuernas sobre las rodillas. Simula la máquina sentado.'
      },
      {
        id: 'calf_raise_donkey',
        name: 'Elevación de Talones Donkey',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Torso inclinado a 90°. Estiramiento superior de las pantorrillas.'
      },
      {
        id: 'calf_raise_band_seated',
        name: 'Elevación de Talones Sentado con Banda',
        equipment: ['band'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner'],
        notes: 'Banda sobre las rodillas sentado. Versión accesible para casa.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // CORE
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Core',
    secondaryMuscles: ['Hombros', 'Glúteo'],
    type: 'isolation',
    movementPattern: 'plank',
    isLengthenedLoad: false,
    notes: 'Mantén el cuerpo recto como tabla. Aprieta glúteos y abdomen. Respira normalmente.',
    variations: [
      {
        id: 'plank_standard',
        name: 'Plancha Frontal',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'plank_side_right',
        name: 'Plancha Lateral Derecha',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Apoya el antebrazo derecho y el pie lateral. Activa el oblicuo y cuadrado lumbar.'
      },
      {
        id: 'plank_side_left',
        name: 'Plancha Lateral Izquierda',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Apoya el antebrazo izquierdo y el pie lateral. Activa el oblicuo y cuadrado lumbar.'
      },
      {
        id: 'plank_extended_arms',
        name: 'Plancha con Brazos Extendidos',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Manos en lugar de antebrazos. Mayor demanda en hombros y abdomen.'
      },
      {
        id: 'plank_with_shoulder_tap',
        name: 'Plancha con Toque de Hombros',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Plancha alta. Toca alternadamente el hombro opuesto. Activa anti-rotación.'
      },
      {
        id: 'plank_up_down',
        name: 'Plancha Arriba-Abajo',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Alterna entre plancha alta y baja. Trabaja hombros y core dinámicamente.'
      },
      {
        id: 'pallof_press_cable',
        name: 'Pallof Press en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Anti-rotación de core. Empuja el cable hacia adelante resistiendo la rotación lateral.'
      },
      {
        id: 'plank_body_saw',
        name: 'Plancha Deslizante (Body Saw)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Desliza el cuerpo hacia atrás y adelante sobre los antebrazos. Alta demanda de core.'
      }
    ]
  },

  {
    primaryMuscle: 'Core',
    secondaryMuscles: ['Flexores de Cadera'],
    type: 'isolation',
    movementPattern: 'crunch',
    isLengthenedLoad: false,
    notes: 'Flexiona la columna lumbar, no solo el cuello. El abdomen es el motor del movimiento.',
    variations: [
      {
        id: 'crunch_standard',
        name: 'Crunch Abdominal Estándar',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'crunch_cable',
        name: 'Crunch en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Agachado con la cuerda. Permite añadir carga progresiva al abdomen.'
      },
      {
        id: 'crunch_machine',
        name: 'Crunch en Máquina',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'crunch_reverse',
        name: 'Crunch Inverso',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Eleva las piernas y caderas hacia el pecho. Trabaja el abdomen inferior.'
      },
      {
        id: 'crunch_bicycle',
        name: 'Crunch Bicicleta',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Codo al rodillo opuesto. Activa los oblicuos y el recto abdominal.'
      },
      {
        id: 'crunch_stability_ball',
        name: 'Crunch en Balón de Estabilidad',
        equipment: ['stability_ball'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'El balón permite mayor rango de movimiento y activa los estabilizadores.'
      },
      {
        id: 'sit_up_full',
        name: 'Abdominal Completo (Sit-Up)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Sube todo el torso. Mayor activación de flexores de cadera que el crunch.'
      },
      {
        id: 'v_up',
        name: 'V-Up (Abdominal en V)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Brazos y piernas se elevan simultáneamente. Alta demanda abdominal.'
      }
    ]
  },

  {
    primaryMuscle: 'Core',
    secondaryMuscles: ['Hombros', 'Flexores de Cadera'],
    type: 'isolation',
    movementPattern: 'anti_extension',
    isLengthenedLoad: false,
    notes: 'Resiste la extensión de la columna. Abdomen activo en todo momento.',
    variations: [
      {
        id: 'ab_wheel_rollout',
        name: 'Rueda Abdominal (Ab Wheel)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Uno de los mejores ejercicios para el core. Empieza desde rodillas antes de hacerlo de pie.'
      },
      {
        id: 'dead_bug',
        name: 'Dead Bug',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Tumbado boca arriba. Extiende brazo y pierna opuestos manteniendo la espalda baja pegada al suelo.'
      },
      {
        id: 'hollow_body_hold',
        name: 'Hollow Body Hold',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Posición de plátano. Lumbar pegada al suelo, piernas y brazos elevados.'
      },
      {
        id: 'dragon_flag',
        name: 'Dragon Flag',
        equipment: ['bodyweight', 'bench'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Cuerpo rígido como tabla bajando lentamente desde la vertical. Ejercicio de elite para el core.'
      },
      {
        id: 'ab_wheel_from_feet',
        name: 'Rueda Abdominal de Pie',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Versión avanzada de pie. Requiere dominar la versión de rodillas.'
      }
    ]
  },

  {
    primaryMuscle: 'Core',
    secondaryMuscles: ['Flexores de Cadera'],
    type: 'isolation',
    movementPattern: 'leg_raise',
    isLengthenedLoad: true,
    notes: 'Mantén la espalda baja pegada a la superficie. Las piernas controlan el movimiento.',
    variations: [
      {
        id: 'leg_raise_hanging',
        name: 'Elevación de Piernas Colgado',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Colgado de la barra. Eleva las piernas hasta 90°. Minimiza el balanceo.'
      },
      {
        id: 'leg_raise_floor',
        name: 'Elevación de Piernas en Suelo',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'leg_raise_captain_chair',
        name: 'Elevación de Rodillas en Silla Romana',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'Brazos apoyados. Eleva las rodillas al pecho. Versión más accesible.'
      },
      {
        id: 'toes_to_bar',
        name: 'Toes To Bar',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Colgado de la barra, lleva los pies a tocar la barra. Alta demanda de core y agarre.'
      },
      {
        id: 'knee_raise_hanging',
        name: 'Elevación de Rodillas Colgado',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Versión más accesible del toes to bar. Lleva las rodillas al pecho.'
      },
      {
        id: 'windshield_wiper',
        name: 'Limpiaparabrisas Colgado',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Colgado, piernas extendidas y juntas que se mueven de lado a lado. Activa oblicuos.'
      }
    ]
  },

  {
    primaryMuscle: 'Core',
    secondaryMuscles: ['Oblicuos'],
    type: 'isolation',
    movementPattern: 'rotation',
    isLengthenedLoad: false,
    notes: 'La rotación viene de la columna torácica, no solo de los brazos.',
    variations: [
      {
        id: 'russian_twist_bodyweight',
        name: 'Russian Twist con Peso Corporal',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'russian_twist_plate',
        name: 'Russian Twist con Disco',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'woodchop_cable_high',
        name: 'Leñador en Cable (Alta a Baja)',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Polea alta. Jala en diagonal hacia abajo y al lado contrario.'
      },
      {
        id: 'woodchop_cable_low',
        name: 'Leñador en Cable (Baja a Alta)',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Polea baja. Jala en diagonal hacia arriba. Activa oblicuo opuesto.'
      },
      {
        id: 'landmine_rotation',
        name: 'Rotación con Landmine',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Barra anclada en una esquina. Rotación potente con control de core.'
      },
      {
        id: 'oblique_crunch',
        name: 'Crunch Oblicuo',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Tumbado de lado, eleva el torso hacia la cadera. Aísla el oblicuo.'
      },
      {
        id: 'side_bend_dumbbell',
        name: 'Flexión Lateral con Mancuerna',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'De pie, inclina el torso lateralmente. Trabaja el cuadrado lumbar y el oblicuo.'
      }
    ]
  },

  {
    primaryMuscle: 'Core',
    secondaryMuscles: ['Hombros', 'Glúteo'],
    type: 'compound',
    movementPattern: 'carry',
    isLengthenedLoad: false,
    notes: 'Mantén una postura perfecta mientras caminas. El core trabaja isométricamente.',
    variations: [
      {
        id: 'farmers_walk',
        name: 'Caminata del Granjero (Farmer Walk)',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Mancuernas a los lados. Camina erguido. Excelente para core, agarre y trapecios.'
      },
      {
        id: 'suitcase_carry',
        name: 'Acarreo Maletín (Unilateral)',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Una sola mancuerna. El core resiste la inclinación lateral. Activa cuadrado lumbar.'
      },
      {
        id: 'overhead_carry',
        name: 'Acarreo con Brazo en Alto',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Mancuerna sobre la cabeza mientras caminas. Estabilidad de hombro y core extrema.'
      },
      {
        id: 'bear_hug_carry',
        name: 'Acarreo Abrazando Saco',
        equipment: ['machine'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Abraza un saco de arena o balón medicinal. Excelente para core y resistencia.'
      }
    ]
  },

  {
    primaryMuscle: 'Core',
    secondaryMuscles: ['Cuádriceps', 'Hombros'],
    type: 'compound',
    movementPattern: 'mountain_climber',
    isLengthenedLoad: false,
    notes: 'Lleva las rodillas al pecho alternadamente. Mantén las caderas bajas.',
    variations: [
      {
        id: 'mountain_climber_standard',
        name: 'Escalador (Mountain Climber)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate']
      },
      {
        id: 'mountain_climber_cross_body',
        name: 'Escalador Cruzado',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Rodilla cruza hacia el codo opuesto. Activa más los oblicuos.'
      },
      {
        id: 'mountain_climber_slow',
        name: 'Escalador Lento (Control)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Movimiento controlado sin rebote. Mayor activación del core.'
      },
      {
        id: 'mountain_climber_band',
        name: 'Escalador con Banda en Pies',
        equipment: ['band', 'bodyweight'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Banda en los pies añade resistencia al movimiento de las rodillas.'
      }
    ]
  },

  {
    primaryMuscle: 'Core',
    secondaryMuscles: [],
    type: 'isolation',
    movementPattern: 'abdominal_misc',
    isLengthenedLoad: false,
    notes: 'Ejercicios variados de core que trabajan el abdomen de manera integral.',
    variations: [
      {
        id: 'stomach_vacuum',
        name: 'Vacuum Abdominal',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Inspira, expira todo el aire y mete el abdomen. Fortalece el transverso abdominal.'
      },
      {
        id: 'ab_rollout_stability_ball',
        name: 'Rollout con Balón de Estabilidad',
        equipment: ['stability_ball'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Manos sobre el balón, rueda hacia adelante extendiendo el cuerpo. Alternativa al ab wheel.'
      },
      {
        id: 'scissor_kicks',
        name: 'Patadas de Tijera',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Tumbado, piernas extendidas que alternan arriba y abajo. Trabaja el abdomen inferior.'
      },
      {
        id: 'flutter_kicks',
        name: 'Patadas de Mariposa',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Piernas ligeramente elevadas, pequeños movimientos rápidos. Activa el core de forma continua.'
      },
      {
        id: 'inchworm',
        name: 'Inchworm (Gusano)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Desde de pie, baja las manos al suelo y camina hasta plancha. Excelente como calentamiento y core.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // PECHO — variaciones adicionales
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Pecho',
    secondaryMuscles: ['Tríceps', 'Hombros', 'Core'],
    type: 'compound',
    movementPattern: 'push_up_advanced',
    isLengthenedLoad: false,
    notes: 'Variaciones avanzadas de la flexión que combinan fuerza y coordinación.',
    variations: [
      {
        id: 'push_up_spiderman',
        name: 'Flexión Spiderman',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Lleva la rodilla al codo del mismo lado en cada repetición. Activa el core y la cadera.'
      },
      {
        id: 'push_up_typewriter',
        name: 'Flexión Máquina de Escribir',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['advanced'],
        notes: 'Agarre amplio. Desliza el pecho lateralmente de un lado al otro sin subir del todo.'
      },
      {
        id: 'push_up_staggered',
        name: 'Flexión con Manos Escalonadas',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Una mano adelante y otra atrás. Alterna el lado para trabajar asimétricamente.'
      },
      {
        id: 'push_up_ring',
        name: 'Flexión en Anillas',
        equipment: ['suspension'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Las anillas añaden inestabilidad. Gran activación de los estabilizadores del hombro y pecho.'
      }
    ]
  },

  {
    primaryMuscle: 'Pecho',
    secondaryMuscles: ['Tríceps', 'Hombros'],
    type: 'compound',
    movementPattern: 'chest_press_cable',
    isLengthenedLoad: false,
    notes: 'Press de pecho con cable en diferentes ángulos para tensión constante.',
    variations: [
      {
        id: 'cable_press_flat',
        name: 'Press de Pecho en Cable (Plano)',
        equipment: ['cable', 'bench'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Cable a la altura del pecho. Tensión constante durante todo el rango de movimiento.'
      },
      {
        id: 'cable_press_standing',
        name: 'Press de Pecho en Cable de Pie',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'De pie entre las poleas. Activa más el core. Excelente unilateral o bilateral.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // ESPALDA — variaciones adicionales
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Espalda',
    secondaryMuscles: ['Bíceps', 'Core'],
    type: 'compound',
    movementPattern: 'row_advanced',
    isLengthenedLoad: false,
    notes: 'Variaciones avanzadas de remo para mayor hipertrofia y desarrollo de la espalda.',
    variations: [
      {
        id: 'row_dumbbell_prone',
        name: 'Remo con Mancuernas en Banco (Prono)',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Pecho apoyado en banco inclinado. Elimina el movimiento lumbar y aísla la espalda.'
      },
      {
        id: 'row_wide_grip_cable',
        name: 'Remo en Cable Agarre Amplio',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Barra ancha en polea baja. Mayor énfasis en el dorsal lateral y romboides.'
      },
      {
        id: 'row_underhand_barbell',
        name: 'Remo con Barra Agarre Supino',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Agarre supino activa más el bíceps y la parte inferior del dorsal.'
      },
      {
        id: 'row_cable_face_pull_wide',
        name: 'Remo de Cara Amplio (Face Pull con Cuerda)',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Tira la cuerda hacia la cara, separando las manos. Deltoides posterior y manguito rotador.'
      }
    ]
  },

  {
    primaryMuscle: 'Espalda',
    secondaryMuscles: ['Core', 'Hombros'],
    type: 'isolation',
    movementPattern: 'scapular_movement',
    isLengthenedLoad: false,
    notes: 'Ejercicios que trabajan específicamente el movimiento escapular para salud del hombro.',
    variations: [
      {
        id: 'scapular_pull_up',
        name: 'Dominada Escapular',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Colgado de la barra, sube solo retraendo las escápulas sin doblar los codos. Activa el serrato.'
      },
      {
        id: 'band_pull_apart',
        name: 'Band Pull-Apart con Banda',
        equipment: ['band'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Sostén la banda al frente y jala separando los brazos. Excelente para la salud del hombro.'
      },
      {
        id: 'yt_raise_dumbbell',
        name: 'Elevaciones Y-T con Mancuernas (Prone)',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Tumbado en banco inclinado. Forma Y y T con los brazos. Activa toda la espalda alta.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // HOMBROS — variaciones adicionales
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Hombros',
    secondaryMuscles: ['Trapecios', 'Core'],
    type: 'isolation',
    movementPattern: 'shoulder_circle',
    isLengthenedLoad: false,
    notes: 'Movimientos circulares y de rotación que trabajan todo el deltoides.',
    variations: [
      {
        id: 'shoulder_press_plate',
        name: 'Press de Hombros con Disco',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'Sostén un disco con ambas manos por encima. Ejercicio de agarre y control.'
      },
      {
        id: 'lu_raise_dumbbell',
        name: 'Lu Raise con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Combina elevación frontal y lateral en un movimiento circular. Popularizado por Lu Xiaojun.'
      },
      {
        id: 'lateral_raise_drop_set',
        name: 'Elevaciones Laterales en Drop Set',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Realiza series descendentes de peso sin descanso. Técnica de intensificación para hipertrofia.'
      },
      {
        id: 'cable_lateral_raise_supine',
        name: 'Elevación Lateral en Cable (Desde Polea Contraria)',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Cable desde el lado opuesto pasando por el frente del cuerpo. Tensión diferente al deltoides lateral.'
      }
    ]
  },

  {
    primaryMuscle: 'Hombros',
    secondaryMuscles: ['Core', 'Espalda'],
    type: 'compound',
    movementPattern: 'overhead_carry',
    isLengthenedLoad: false,
    notes: 'El peso sobre la cabeza activa los estabilizadores del hombro de forma funcional.',
    variations: [
      {
        id: 'turkish_get_up',
        name: 'Turkish Get-Up con Kettlebell',
        equipment: ['kettlebell'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Movimiento complejo de suelo a de pie con kettlebell sobre la cabeza. Trabaja todo el cuerpo.'
      },
      {
        id: 'waiter_walk',
        name: 'Caminata del Mesero (Kettlebell Overhead)',
        equipment: ['kettlebell'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Kettlebell sobre la palma hacia arriba caminando. Activa el manguito rotador y el core.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // BÍCEPS — variaciones adicionales
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Bíceps',
    secondaryMuscles: ['Antebrazo'],
    type: 'isolation',
    movementPattern: 'curl_reverse',
    isLengthenedLoad: false,
    notes: 'Agarre prono. Trabaja principalmente el braquiorradial y el extensor del antebrazo.',
    variations: [
      {
        id: 'reverse_curl_barbell',
        name: 'Curl Inverso con Barra',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Agarre prono. Excelente para el braquiorradial y el antebrazo.'
      },
      {
        id: 'reverse_curl_ez',
        name: 'Curl Inverso con Barra EZ',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'reverse_curl_cable',
        name: 'Curl Inverso en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'zottman_curl',
        name: 'Curl Zottman con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Sube con agarre supino, baja con agarre prono. Trabaja bíceps y braquiorradial en un solo movimiento.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // TRÍCEPS — variaciones adicionales
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Tríceps',
    secondaryMuscles: [],
    type: 'isolation',
    movementPattern: 'triceps_iso',
    isLengthenedLoad: true,
    notes: 'Variaciones de aislamiento del tríceps con énfasis en la cabeza larga.',
    variations: [
      {
        id: 'triceps_overhead_dumbbell_single',
        name: 'Extensión de Tríceps Overhead Un Brazo',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Un brazo a la vez. Mayor rango de movimiento y corrección de desequilibrios.'
      },
      {
        id: 'triceps_tate_press',
        name: 'Tate Press con Mancuernas',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Mancuernas verticales sobre el pecho. Baja hacia los costados. Aísla la cabeza medial del tríceps.'
      },
      {
        id: 'triceps_jm_press',
        name: 'JM Press con Barra',
        equipment: ['barbell', 'bench'],
        environment: ['gym'],
        level: ['advanced'],
        notes: 'Híbrido entre press de banca y skullcrusher. Alta activación del tríceps con más carga.'
      },
      {
        id: 'triceps_pushdown_v_bar',
        name: 'Extensión en Polea con Barra en V',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'La barra en V da una posición cómoda para las muñecas. Activa uniformemente las tres cabezas.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // CUÁDRICEPS — variaciones adicionales
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Cuádriceps',
    secondaryMuscles: ['Glúteo'],
    type: 'compound',
    movementPattern: 'squat_variation',
    isLengthenedLoad: false,
    notes: 'Variaciones de sentadilla que enfatizan diferentes aspectos del cuádriceps.',
    variations: [
      {
        id: 'squat_safety_bar',
        name: 'Sentadilla con Safety Bar',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Las asas laterales permiten una posición de manos más cómoda. Menos estrés en hombros.'
      },
      {
        id: 'sissy_squat',
        name: 'Sissy Squat',
        equipment: ['bodyweight'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Talones elevados, rodillas hacia adelante. Aísla completamente el cuádriceps. Alta tensión en la rodilla.'
      },
      {
        id: 'wall_sit',
        name: 'Sentadilla Isométrica en Pared (Wall Sit)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Espalda contra la pared, rodillas a 90°. Excelente para resistencia muscular de cuádriceps.'
      },
      {
        id: 'box_squat_barbell',
        name: 'Sentadilla en Caja (Box Squat)',
        equipment: ['barbell', 'bench'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Baja hasta sentarte en la caja y pausa. Enseña la profundidad y elimina el rebote.'
      },
      {
        id: 'squat_tempo',
        name: 'Sentadilla con Tempo Controlado',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: '3-4 segundos bajando. Elimina el impulso y aumenta el tiempo bajo tensión.'
      }
    ]
  },

  {
    primaryMuscle: 'Cuádriceps',
    secondaryMuscles: ['Glúteo', 'Isquiotibiales'],
    type: 'compound',
    movementPattern: 'lunge_advanced',
    isLengthenedLoad: false,
    notes: 'Variaciones avanzadas de zancada para mayor dificultad y activación.',
    variations: [
      {
        id: 'lunge_curtsy',
        name: 'Zancada Cortesía (Curtsy Lunge)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Pie trasero cruza por detrás de la pierna de apoyo. Activa el glúteo mediano.'
      },
      {
        id: 'lunge_curtsy_dumbbell',
        name: 'Zancada Cortesía con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced']
      },
      {
        id: 'lunge_front_to_reverse',
        name: 'Zancada Frontal + Inversa (Combinada)',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Alterna entre zancada frontal e inversa en la misma pierna. Mayor volumen y coordinación.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // ISQUIOTIBIALES — variaciones adicionales
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Isquiotibiales',
    secondaryMuscles: ['Glúteo'],
    type: 'compound',
    movementPattern: 'hip_hinge_advanced',
    isLengthenedLoad: true,
    notes: 'Variaciones avanzadas de bisagra de cadera para máxima activación de isquiotibiales.',
    variations: [
      {
        id: 'snatch_grip_rdl',
        name: 'RDL con Agarre de Arranque',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['advanced'],
        notes: 'Agarre muy amplio. Mayor activación de la espalda alta y mayor rango de movimiento.'
      },
      {
        id: 'stiff_leg_deadlift',
        name: 'Peso Muerto de Piernas Rígidas',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Rodillas completamente extendidas. Máximo estiramiento del isquiotibial. Cuidado con la lumbar.'
      },
      {
        id: 'rdl_kettlebell',
        name: 'Peso Muerto Rumano con Kettlebell',
        equipment: ['kettlebell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Kettlebell en cada mano o una sola. Trayectoria más natural que la barra.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // GLÚTEO — variaciones adicionales
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Glúteo',
    secondaryMuscles: ['Isquiotibiales', 'Core'],
    type: 'compound',
    movementPattern: 'glute_compound_advanced',
    isLengthenedLoad: false,
    notes: 'Movimientos compuestos avanzados que priorizan el glúteo.',
    variations: [
      {
        id: 'hip_thrust_tempo',
        name: 'Hip Thrust con Tempo Controlado',
        equipment: ['barbell', 'bench'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: '3 segundos bajando, 1 segundo pausa arriba. Mayor tiempo bajo tensión para el glúteo.'
      },
      {
        id: 'hip_thrust_paused',
        name: 'Hip Thrust con Pausa Arriba',
        equipment: ['barbell', 'bench'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: '2-3 segundos de contracción isométrica en el punto máximo. Excelente para la mente-músculo.'
      },
      {
        id: 'cable_pull_through',
        name: 'Cable Pull-Through',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate', 'advanced'],
        notes: 'Polea baja, pasa la cuerda entre las piernas. Bisagra de cadera con tensión en todo el rango.'
      },
      {
        id: 'barbell_frog_pump',
        name: 'Frog Pump con Barra',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Tumbado, pies juntos pegados a los glúteos. Extensión de cadera con rango amplio. Excelente activación.'
      },
      {
        id: 'single_leg_hip_thrust_bodyweight',
        name: 'Hip Thrust Unilateral con Peso Corporal',
        equipment: ['bodyweight', 'bench'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Sin peso adicional. Buena progresión antes del hip thrust con barra.'
      }
    ]
  },

  {
    primaryMuscle: 'Glúteo',
    secondaryMuscles: ['Cuádriceps'],
    type: 'compound',
    movementPattern: 'bulgarian_glute',
    isLengthenedLoad: true,
    notes: 'Sentadilla búlgara y variaciones enfocadas en el glúteo con pie trasero elevado.',
    variations: [
      {
        id: 'bulgarian_split_squat_barbell',
        name: 'Sentadilla Búlgara con Barra',
        equipment: ['barbell', 'bench'],
        environment: ['gym'],
        level: ['advanced'],
        notes: 'Mayor carga que con mancuernas. Excelente para fuerza unilateral de glúteo y cuádriceps.'
      },
      {
        id: 'bulgarian_split_squat_bodyweight',
        name: 'Sentadilla Búlgara con Peso Corporal',
        equipment: ['bodyweight', 'bench'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Sin peso adicional. Ideal para aprender el movimiento y trabajar el equilibrio.'
      },
      {
        id: 'rear_foot_elevated_dumbbell',
        name: 'Sentadilla con Pie Trasero Elevado y Mancuernas',
        equipment: ['dumbbell', 'bench'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced']
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // PANTORRILLAS — variaciones adicionales
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Pantorrillas',
    secondaryMuscles: [],
    type: 'isolation',
    movementPattern: 'calf_advanced',
    isLengthenedLoad: false,
    notes: 'Variaciones avanzadas para pantorrillas con mayor rango o tempo.',
    variations: [
      {
        id: 'calf_raise_weighted_single',
        name: 'Elevación de Talones Unilateral con Mancuerna',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Una mancuerna en una mano, una pierna. Mayor resistencia al unilateral con peso corporal.'
      },
      {
        id: 'calf_raise_jump',
        name: 'Elevación de Talones con Salto (Calf Jump)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Explosión desde la punta del pie. Trabaja el componente pliométrico de las pantorrillas.'
      },
      {
        id: 'tibialis_raise',
        name: 'Elevación de Puntas (Tibial Anterior)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Eleva la punta del pie con el talón fijo. Trabaja el tibial anterior para equilibrar la pantorrilla.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // CORE — variaciones adicionales
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Core',
    secondaryMuscles: ['Hombros', 'Cuádriceps'],
    type: 'compound',
    movementPattern: 'dynamic_core',
    isLengthenedLoad: false,
    notes: 'Ejercicios de core dinámicos que combinan múltiples patrones de movimiento.',
    variations: [
      {
        id: 'burpee',
        name: 'Burpee',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Combina flexión, plancha y salto. Excelente para el acondicionamiento general.'
      },
      {
        id: 'bear_crawl',
        name: 'Gateo del Oso (Bear Crawl)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Cuadrupedia con rodillas ligeramente elevadas. Excelente para el core y la coordinación.'
      },
      {
        id: 'crab_walk',
        name: 'Caminata del Cangrejo',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'De espaldas, manos y pies en el suelo. Trabaja el core, glúteo y tríceps simultáneamente.'
      },
      {
        id: 'turkish_get_up_half',
        name: 'Half Turkish Get-Up',
        equipment: ['kettlebell'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Primera mitad del Turkish Get-Up. Desde el suelo hasta la posición de rodilla. Control total del core.'
      }
    ]
  },

  {
    primaryMuscle: 'Core',
    secondaryMuscles: ['Oblicuos', 'Espalda'],
    type: 'isolation',
    movementPattern: 'lateral_core',
    isLengthenedLoad: false,
    notes: 'Ejercicios específicos para los oblicuos y el núcleo lateral.',
    variations: [
      {
        id: 'windmill_kettlebell',
        name: 'Windmill con Kettlebell',
        equipment: ['kettlebell'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Kettlebell sobre la cabeza, inclina el torso lateralmente. Trabajo de oblicuos y movilidad.'
      },
      {
        id: 'side_plank_star',
        name: 'Plancha Lateral Estrella',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['advanced'],
        notes: 'Plancha lateral con pierna y brazo superiores elevados. Máxima dificultad de plancha lateral.'
      },
      {
        id: 'side_plank_hip_dip',
        name: 'Plancha Lateral con Caída de Cadera',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Desde plancha lateral, baja la cadera al suelo y sube. Activa dinámicamente el oblicuo.'
      },
      {
        id: 'copenhagen_plank',
        name: 'Plancha de Copenhague',
        equipment: ['bodyweight', 'bench'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Pie superior sobre el banco en plancha lateral. Alta activación del aductor y oblicuo.'
      }
    ]
  },

  {
    primaryMuscle: 'Core',
    secondaryMuscles: ['Glúteo', 'Isquiotibiales'],
    type: 'compound',
    movementPattern: 'hip_core',
    isLengthenedLoad: false,
    notes: 'Ejercicios que conectan la fuerza del core con la movilidad y estabilidad de la cadera.',
    variations: [
      {
        id: 'bird_dog',
        name: 'Bird Dog',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'En cuadrupedia, extiende brazo y pierna opuestos simultáneamente. Excelente para el core y el equilibrio.'
      },
      {
        id: 'hip_circle_band',
        name: 'Círculos de Cadera con Banda',
        equipment: ['band'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Banda en tobillos. Traza círculos con la rodilla activando el glúteo mediano y el core.'
      },
      {
        id: 'l_sit_floor',
        name: 'L-Sit en Suelo',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['advanced'],
        notes: 'Manos en el suelo, piernas extendidas y elevadas. Trabaja el core, la cadera y el tríceps.'
      }
    ]
  },

  {
    primaryMuscle: 'Core',
    secondaryMuscles: ['Hombros'],
    type: 'isolation',
    movementPattern: 'core_stretch',
    isLengthenedLoad: false,
    notes: 'Ejercicios de core que incluyen componente de estiramiento y movilidad.',
    variations: [
      {
        id: 'thoracic_rotation',
        name: 'Rotación Torácica en Suelo',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner'],
        notes: 'Tumbado de lado, rodillas dobladas. Abre la parte superior hacia el otro lado. Movilidad torácica.'
      },
      {
        id: 'cat_cow',
        name: 'Gato-Vaca (Cat-Cow)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner'],
        notes: 'En cuadrupedia, alterna entre arquearse y redondear la espalda. Movilidad lumbar y torácica.'
      },
      {
        id: 'downward_dog_push_up',
        name: 'Flexión de Perra Mirando al Suelo',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Desde posición de perro boca abajo, baja a plancha y sube. Trabaja hombros, core y flexibilidad.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // ESPALDA — variaciones finales
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Espalda',
    secondaryMuscles: ['Bíceps', 'Hombros'],
    type: 'compound',
    movementPattern: 'cable_row_advanced',
    isLengthenedLoad: false,
    notes: 'Variantes de remo en cable para mayor especificidad muscular.',
    variations: [
      {
        id: 'cable_row_high_elbow',
        name: 'Remo en Cable Codo Alto (Énfasis Romboides)',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Codo hacia arriba y afuera al tirar. Activa principalmente romboides y trapecio medio.'
      },
      {
        id: 'cable_row_neutral_close',
        name: 'Remo en Cable con Agarre Neutro Cerrado',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'Agarradera en V cerrada. Mayor activación de la parte media de la espalda.'
      },
      {
        id: 'cable_row_standing',
        name: 'Remo en Cable de Pie',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'De pie, ligera bisagra de cadera. Activa más el core como estabilizador.'
      }
    ]
  },

  {
    primaryMuscle: 'Espalda',
    secondaryMuscles: ['Core'],
    type: 'isolation',
    movementPattern: 'lat_stretch',
    isLengthenedLoad: true,
    notes: 'Ejercicios que estiran y activan el dorsal en posición alargada.',
    variations: [
      {
        id: 'lat_stretch_cable_overhead',
        name: 'Estiramiento Activo del Dorsal en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'Cable desde arriba, inclínate lateralmente dejando que el dorsal se estire. Activación del dorsal.'
      },
      {
        id: 'single_arm_pulldown_leaning',
        name: 'Jalón Unilateral con Inclinación Lateral',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Inclínate al lado opuesto de la polea. Mayor rango y tensión en el dorsal en posición alargada.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // HOMBROS — variaciones finales
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Hombros',
    secondaryMuscles: ['Trapecios'],
    type: 'isolation',
    movementPattern: 'shoulder_isolation_extra',
    isLengthenedLoad: false,
    notes: 'Ejercicios complementarios para el desarrollo completo del deltoides.',
    variations: [
      {
        id: 'cable_front_raise_unilateral',
        name: 'Elevación Frontal Unilateral en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'Un brazo a la vez. Tensión constante y mayor control de la trayectoria.'
      },
      {
        id: 'band_lateral_raise_seated',
        name: 'Elevación Lateral con Banda Sentado',
        equipment: ['band'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner'],
        notes: 'Sentado sobre la banda. Mayor tensión en el punto alto del movimiento.'
      },
      {
        id: 'behind_back_cable_lateral',
        name: 'Elevación Lateral desde Atrás en Cable',
        equipment: ['cable'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Cable pasa por detrás del cuerpo. Activa el deltoides lateral desde un ángulo diferente.'
      },
      {
        id: 'plate_lateral_raise',
        name: 'Elevación Lateral con Disco',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'Disco de lado en la mano. Cambia el centro de gravedad para mayor activación.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // CUÁDRICEPS — variaciones finales
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Cuádriceps',
    secondaryMuscles: ['Glúteo'],
    type: 'compound',
    movementPattern: 'squat_home',
    isLengthenedLoad: false,
    notes: 'Variaciones de sentadilla para entrenar en casa sin equipamiento.',
    variations: [
      {
        id: 'jump_squat',
        name: 'Sentadilla con Salto (Jump Squat)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Baja a la sentadilla y explota hacia arriba. Desarrolla potencia en el tren inferior.'
      },
      {
        id: 'squat_isometric_holds',
        name: 'Sentadilla con Pausas Isométricas',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Pausa 3-5 segundos en diferentes ángulos de la bajada. Aumenta la fuerza en puntos débiles.'
      },
      {
        id: 'narrow_squat_dumbbell',
        name: 'Sentadilla Estrecha con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Pies juntos. Mayor activación del vasto externo del cuádriceps.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // GLÚTEO — variaciones finales
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Glúteo',
    secondaryMuscles: ['Isquiotibiales'],
    type: 'isolation',
    movementPattern: 'glute_isolation_extra',
    isLengthenedLoad: false,
    notes: 'Ejercicios de aislamiento del glúteo para mayor volumen de entrenamiento.',
    variations: [
      {
        id: 'glute_squeeze_standing',
        name: 'Contracción de Glúteo de Pie',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner'],
        notes: 'De pie, contrae los glúteos y mantén. Activa la conexión mente-músculo. Ideal para principiantes.'
      },
      {
        id: 'prone_hip_extension',
        name: 'Extensión de Cadera Tumbado (Prono)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner'],
        notes: 'Tumbado boca abajo, eleva una pierna extendida. Activa glúteo sin carga articular.'
      },
      {
        id: 'quadruped_hip_extension_band',
        name: 'Extensión de Cadera en Cuadrupedia con Banda',
        equipment: ['band'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner', 'intermediate'],
        notes: 'Banda en la rodilla. En cuadrupedia, extiende la cadera hacia atrás y arriba.'
      },
      {
        id: 'lying_hip_abduction',
        name: 'Abducción de Cadera Tumbado',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['beginner'],
        notes: 'Tumbado de lado, eleva la pierna superior lateralmente. Activa el glúteo mediano.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // PECHO — variaciones finales
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Pecho',
    secondaryMuscles: ['Tríceps'],
    type: 'isolation',
    movementPattern: 'chest_stretch_extra',
    isLengthenedLoad: true,
    notes: 'Ejercicios adicionales de estiramiento activo del pecho para máxima hipertrofia.',
    variations: [
      {
        id: 'chest_fly_cable_incline_low',
        name: 'Apertura en Cable Inclinado (Polea Baja)',
        equipment: ['cable', 'bench'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Banco inclinado con poleas bajas. Tensión constante en el pecho superior en posición alargada.'
      },
      {
        id: 'svend_press',
        name: 'Svend Press con Disco',
        equipment: ['barbell'],
        environment: ['gym'],
        level: ['beginner', 'intermediate'],
        notes: 'Presiona un disco entre las palmas al frente del pecho. Alta activación de la línea media del pectoral.'
      },
      {
        id: 'cable_fly_single_arm_incline',
        name: 'Apertura Unilateral en Cable Inclinado',
        equipment: ['cable', 'bench'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Un brazo a la vez con polea baja y banco inclinado. Máximo estiramiento del pecho superior.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // CORE — variaciones finales
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Core',
    secondaryMuscles: ['Hombros', 'Isquiotibiales'],
    type: 'compound',
    movementPattern: 'core_functional',
    isLengthenedLoad: false,
    notes: 'Ejercicios funcionales de core que se transfieren a los movimientos de entrenamiento principales.',
    variations: [
      {
        id: 'plank_to_push_up',
        name: 'Plancha a Flexión (Plank to Push-Up)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Desde plancha baja a alta alternando. Activa core, hombros y tríceps dinámicamente.'
      },
      {
        id: 'renegade_row',
        name: 'Remo con Mancuernas en Plancha (Renegade Row)',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Plancha alta sobre mancuernas. Alterna el remo con cada brazo. Core y espalda simultáneamente.'
      },
      {
        id: 'turkish_sit_up',
        name: 'Sit-Up Turco',
        equipment: ['kettlebell'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Kettlebell en alto, sube a sentado manteniendo el peso estable. Parte del Turkish Get-Up.'
      },
      {
        id: 'sandbag_rotation',
        name: 'Rotación con Saco de Arena',
        equipment: ['machine'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Sostén peso y rota el torso en pie. Transfiere la potencia rotatoria al deporte.'
      }
    ]
  },

  // ══════════════════════════════════════════════════
  // COMPLEMENTARIOS — Fuerza funcional y accesorios
  // ══════════════════════════════════════════════════

  {
    primaryMuscle: 'Espalda',
    secondaryMuscles: ['Bíceps', 'Hombros'],
    type: 'compound',
    movementPattern: 'ring_row',
    isLengthenedLoad: false,
    notes: 'Remo en anillas con tensión variable según la inclinación del cuerpo.',
    variations: [
      {
        id: 'ring_row_bodyweight',
        name: 'Remo en Anillas',
        equipment: ['suspension'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Inclina el cuerpo más para mayor dificultad. La inestabilidad activa estabilizadores adicionales.'
      },
      {
        id: 'ring_pull_up',
        name: 'Dominadas en Anillas',
        equipment: ['suspension'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Anillas inestables exigen mayor activación del manguito rotador y los estabilizadores.'
      }
    ]
  },

  {
    primaryMuscle: 'Hombros',
    secondaryMuscles: ['Core', 'Trapecios'],
    type: 'compound',
    movementPattern: 'clean_press',
    isLengthenedLoad: false,
    notes: 'Movimientos olímpicos adaptados que combinan fuerza y potencia.',
    variations: [
      {
        id: 'dumbbell_clean_press',
        name: 'Clean and Press con Mancuernas',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Jala las mancuernas al hombro y presiona. Combina potencia y fuerza de hombros.'
      },
      {
        id: 'kettlebell_press_single',
        name: 'Press con Kettlebell Un Brazo',
        equipment: ['kettlebell'],
        environment: ['gym', 'home'],
        level: ['intermediate', 'advanced'],
        notes: 'Un kettlebell en posición de rack. El centro de masa descentrado activa el core lateralmente.'
      },
      {
        id: 'kettlebell_bottoms_up_press',
        name: 'Press Kettlebell Boca Abajo',
        equipment: ['kettlebell'],
        environment: ['gym', 'home'],
        level: ['advanced'],
        notes: 'Kettlebell invertida sobre la mano. Activa intensamente el manguito rotador y el antebrazo.'
      }
    ]
  },

  {
    primaryMuscle: 'Cuádriceps',
    secondaryMuscles: ['Glúteo', 'Core'],
    type: 'compound',
    movementPattern: 'plyometric_lower',
    isLengthenedLoad: false,
    notes: 'Ejercicios pliométricos de tren inferior para desarrollar potencia y agilidad.',
    variations: [
      {
        id: 'box_jump',
        name: 'Salto a Cajón (Box Jump)',
        equipment: ['bench'],
        environment: ['gym'],
        level: ['intermediate', 'advanced'],
        notes: 'Salta con ambos pies a un cajón. Desarrolla potencia explosiva del tren inferior.'
      },
      {
        id: 'lateral_box_jump',
        name: 'Salto Lateral a Cajón',
        equipment: ['bench'],
        environment: ['gym'],
        level: ['advanced'],
        notes: 'Salta lateralmente al cajón. Activa el glúteo mediano y desarrolla potencia lateral.'
      },
      {
        id: 'squat_jump_weighted',
        name: 'Sentadilla con Salto y Peso',
        equipment: ['dumbbell'],
        environment: ['gym'],
        level: ['advanced'],
        notes: 'Mancuernas ligeras. Añade resistencia al salto de sentadilla para mayor demanda muscular.'
      }
    ]
  },

  {
    primaryMuscle: 'Isquiotibiales',
    secondaryMuscles: ['Glúteo', 'Core'],
    type: 'compound',
    movementPattern: 'hamstring_plyo',
    isLengthenedLoad: false,
    notes: 'Ejercicios explosivos para isquiotibiales que mejoran la potencia y previenen lesiones.',
    variations: [
      {
        id: 'broad_jump',
        name: 'Salto de Longitud (Broad Jump)',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Salto horizontal máximo. Activa isquiotibiales, glúteos y pantorrillas de forma explosiva.'
      },
      {
        id: 'deadlift_jump',
        name: 'Peso Muerto con Salto',
        equipment: ['bodyweight'],
        environment: ['gym', 'home', 'none'],
        level: ['intermediate', 'advanced'],
        notes: 'Bisagra de cadera explosiva con salto al final. Trabaja la transición isométrica-concéntrica.'
      }
    ]
  },

  {
    primaryMuscle: 'Bíceps',
    secondaryMuscles: ['Antebrazo'],
    type: 'isolation',
    movementPattern: 'curl_wrist',
    isLengthenedLoad: false,
    notes: 'Ejercicios de antebrazo y muñeca que complementan el trabajo de bíceps.',
    variations: [
      {
        id: 'wrist_curl_dumbbell',
        name: 'Flexión de Muñeca con Mancuerna',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Antebrazo apoyado en el muslo. Flexiona la muñeca. Fortalece el flexor del carpo.'
      },
      {
        id: 'reverse_wrist_curl_dumbbell',
        name: 'Extensión de Muñeca con Mancuerna',
        equipment: ['dumbbell'],
        environment: ['gym', 'home'],
        level: ['beginner', 'intermediate'],
        notes: 'Antebrazo apoyado, muñeca cuelga. Extiende hacia arriba. Trabaja el extensor del carpo y previene epicondilitis.'
      }
    ]
  }

]

export const EXERCISES = generate(BASE_EXERCISES)

export function getByMuscle(muscle, environment, level) {
  return EXERCISES.filter(ex =>
    ex.muscle === muscle &&
    (!environment || environment === 'any' || ex.environment.includes(environment)) &&
    (!level || ex.level.includes(level))
  )
}

export function getExerciseImage(exerciseId, sex = 'male') {
  return `/exercises/${exerciseId}/${sex}.jpg`
}
