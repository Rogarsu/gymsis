// ─────────────────────────────────────────────────────────────
// nutrition.js — Módulo de nutrición y plan de comidas
// ─────────────────────────────────────────────────────────────
import { getFoodProfile, setFoodProfile, getMealsForDay, setMealsForDay, todayStr } from './storage.js'

// ── Horarios disponibles ──────────────────────────────────────
const TRAINING_HOURS = [
  '6:00','7:00','8:00','9:00','10:00','11:00','12:00','13:00',
  '14:00','15:00','16:00','17:00','18:00','19:00','20:00'
]

// ── Recetas por tipo de comida ────────────────────────────────
const RECIPES = {
  breakfast: [
    { name: 'Avena con Frutas y Proteína', protein: 30, carbs: 55, fat: 8, kcal: 408, time: '10 min',
      ingredients: ['80g avena','1 scoop proteína (30g)','1 banana','30g arándanos','200ml leche desnatada'],
      instructions: 'Cocina la avena con leche, mezcla la proteína al final y añade las frutas.' },
    { name: 'Huevos Revueltos con Pan Integral', protein: 28, carbs: 40, fat: 14, kcal: 398, time: '10 min',
      ingredients: ['3 huevos','2 claras','2 rebanadas pan integral','1 tomate','Espinacas'],
      instructions: 'Bate los huevos con las claras, cocina con espinacas. Sirve con pan y tomate.' },
    { name: 'Yogur Griego con Granola', protein: 25, carbs: 45, fat: 6, kcal: 338, time: '3 min',
      ingredients: ['200g yogur griego 0%','50g granola','1 kiwi','15g miel'],
      instructions: 'Sirve el yogur en un bol, añade granola y fruta cortada.' }
  ],
  preworkout: [
    { name: 'Banana con Mantequilla de Cacahuete', protein: 7, carbs: 36, fat: 8, kcal: 244, time: '2 min',
      ingredients: ['1 banana grande','20g mantequilla de cacahuete natural'],
      instructions: 'Corta la banana y úntala con mantequilla de cacahuete.' },
    { name: 'Tostada con Atún', protein: 22, carbs: 28, fat: 4, kcal: 236, time: '5 min',
      ingredients: ['2 tostadas integrales','1 lata atún al natural','Tomate','Orégano'],
      instructions: 'Tuesta el pan, escurre el atún y sírvelo encima con tomate.' },
    { name: 'Batido de Plátano y Avena', protein: 28, carbs: 50, fat: 4, kcal: 348, time: '3 min',
      ingredients: ['1 plátano','40g avena','1 scoop proteína','250ml agua o leche'],
      instructions: 'Mezcla todo en una licuadora hasta obtener consistencia homogénea.' }
  ],
  postworkout: [
    { name: 'Batido de Proteína con Fruta', protein: 30, carbs: 40, fat: 2, kcal: 298, time: '2 min',
      ingredients: ['1 scoop proteína whey (30g)','1 banana','300ml agua','Hielo'],
      instructions: 'Mezcla en shaker o licuadora. Consume dentro de los 30 min post-entreno.' },
    { name: 'Arroz con Pollo', protein: 40, carbs: 60, fat: 6, kcal: 458, time: '20 min',
      ingredients: ['150g pechuga de pollo','120g arroz blanco','Verduras al gusto','Sal, pimienta'],
      instructions: 'Cocina el arroz. A la plancha el pollo. Sirve junto con verduras.' }
  ],
  lunch: [
    { name: 'Pollo a la Plancha con Quinoa', protein: 45, carbs: 50, fat: 8, kcal: 456, time: '25 min',
      ingredients: ['180g pechuga pollo','100g quinoa','Brócoli','Pimiento','AOVE','Limón'],
      instructions: 'Cocina la quinoa. Asa el pollo a la plancha con limón. Cocina las verduras al vapor.' },
    { name: 'Salmón al Horno con Patata', protein: 38, carbs: 45, fat: 18, kcal: 494, time: '30 min',
      ingredients: ['180g salmón','200g patata','Espárragos','Ajo','Limón','AOVE'],
      instructions: 'Hornea el salmón con limón y ajo a 180°C 20 min. Patata y espárragos al vapor.' },
    { name: 'Lentejas con Arroz', protein: 22, carbs: 65, fat: 5, kcal: 393, time: '30 min',
      ingredients: ['200g lentejas cocidas','80g arroz','Zanahoria','Cebolla','Comino','AOVE'],
      instructions: 'Sofríe cebolla y zanahoria. Añade lentejas y arroz cocidos. Sazona con comino.' }
  ],
  snack1: [
    { name: 'Manzana con Queso Cottage', protein: 14, carbs: 22, fat: 2, kcal: 162, time: '2 min',
      ingredients: ['1 manzana','100g queso cottage 0%','Canela'],
      instructions: 'Corta la manzana, sirve con el queso cottage y una pizca de canela.' },
    { name: 'Mix de Frutos Secos y Fruta', protein: 8, carbs: 30, fat: 12, kcal: 260, time: '1 min',
      ingredients: ['20g almendras','10g nueces','1 naranja'],
      instructions: 'Combina los frutos secos con la fruta. Ideal para media mañana.' }
  ],
  dinner: [
    { name: 'Tortilla de Claras con Verduras', protein: 28, carbs: 12, fat: 8, kcal: 232, time: '15 min',
      ingredients: ['5 claras','2 huevos','Pimiento rojo','Cebolla','Champiñones','AOVE'],
      instructions: 'Saltea las verduras. Añade la mezcla de huevos. Cocina a fuego medio.' },
    { name: 'Merluza al Vapor con Verduras', protein: 35, carbs: 15, fat: 5, kcal: 245, time: '20 min',
      ingredients: ['200g merluza','Brócoli','Zanahoria','Judías verdes','Limón','AOVE'],
      instructions: 'Cocina la merluza al vapor 12 min. Verduras al vapor 8 min. Aliña con limón.' },
    { name: 'Ensalada de Pollo Completa', protein: 38, carbs: 20, fat: 10, kcal: 322, time: '10 min',
      ingredients: ['150g pollo cocido','Lechuga mixta','Tomate cherry','Pepino','Aguacate ½','AOVE'],
      instructions: 'Mezcla todos los ingredientes. Aliña con AOVE y sal.' }
  ],
  snack2: [
    { name: 'Caseinato con Almendras', protein: 25, carbs: 6, fat: 9, kcal: 205, time: '2 min',
      ingredients: ['1 scoop caseína (25g)','15g almendras','200ml leche o agua'],
      instructions: 'Mezcla la caseína con agua fría. Acompaña con almendras.' },
    { name: 'Yogur Griego con Nueces', protein: 20, carbs: 8, fat: 8, kcal: 184, time: '1 min',
      ingredients: ['200g yogur griego 0%','15g nueces'],
      instructions: 'Sirve el yogur con las nueces partidas por encima.' }
  ]
}

// ── Inicialización ────────────────────────────────────────────
let _currentObjectives = ['general']

export function initNutrition(objectives = ['general']) {
  _currentObjectives = objectives
}

// ── Renderizado principal ─────────────────────────────────────
export function renderNutrition() {
  const view = document.getElementById('view-nutricion')
  if (!view) return

  const profile = getFoodProfile()

  if (!profile) {
    view.innerHTML = renderNutritionSetup()
    return
  }

  view.innerHTML = renderMealPlan(profile)
}

// Setup inicial del perfil
function renderNutritionSetup() {
  return `
    <div class="module-header">
      <h2 class="module-title">🍃 Configuración Nutricional</h2>
      <p class="module-subtitle">Completa tu perfil para recibir un plan de comidas personalizado</p>
    </div>
    <div class="card">
      <div class="form-group">
        <label class="form-label">Preferencia dietética</label>
        <select id="food-diet" class="form-input">
          <option value="omnivore">Omnívoro</option>
          <option value="vegetarian">Vegetariano</option>
          <option value="vegan">Vegano</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Alergias o intolerancias (opcional)</label>
        <input type="text" id="food-allergies" class="form-input" placeholder="Ej: lactosa, gluten..." />
      </div>
      <div class="form-group">
        <label class="form-label">Objetivo nutricional</label>
        <select id="food-goal" class="form-input">
          <option value="muscle">Ganar músculo — alta proteína</option>
          <option value="weight_loss">Perder peso — déficit calórico</option>
          <option value="maintain">Mantenimiento — equilibrio</option>
          <option value="endurance">Resistencia — alto en carbos</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Presupuesto semanal</label>
        <select id="food-budget" class="form-input">
          <option value="economic">Económico</option>
          <option value="normal">Normal</option>
          <option value="premium">Premium</option>
        </select>
      </div>
      <button class="btn btn-primary btn-full" onclick="saveNutritionProfile()">Guardar y ver mi plan</button>
    </div>
    ${renderNutritionEducation()}
  `
}

export function saveNutritionProfile() {
  const profile = {
    diet:      document.getElementById('food-diet')?.value || 'omnivore',
    allergies: document.getElementById('food-allergies')?.value || '',
    goal:      document.getElementById('food-goal')?.value || 'muscle',
    budget:    document.getElementById('food-budget')?.value || 'normal',
    savedAt:   new Date().toISOString()
  }
  setFoodProfile(profile)
  renderNutrition()
}

// ── Plan de comidas ───────────────────────────────────────────
function renderMealPlan(profile) {
  const today = todayStr()
  const markedMeals = getMealsForDay(today)
  const selectedHour = profile.trainingHour || '18:00'

  const meals = buildMeals(profile)

  return `
    <div class="module-header">
      <h2 class="module-title">🍃 Plan de Comidas</h2>
      <div class="module-header-actions">
        <button class="btn btn-ghost btn-sm" onclick="editNutritionProfile()">Editar perfil</button>
      </div>
    </div>

    <!-- Hora de entrenamiento -->
    <div class="card">
      <div class="nutrition-time-row">
        <label class="form-label">🕐 Hora de entrenamiento</label>
        <select class="form-input form-input-sm" onchange="updateTrainingHour(this.value)">
          ${TRAINING_HOURS.map(h => `<option value="${h}" ${h === selectedHour ? 'selected' : ''}>${h}</option>`).join('')}
        </select>
      </div>
    </div>

    <!-- Comidas del día -->
    <div class="meals-grid">
      ${meals.map((meal, i) => {
        const isMarked = markedMeals.includes(meal.id)
        return `
          <div class="meal-card ${isMarked ? 'marked' : ''}">
            <div class="meal-card-header">
              <div class="meal-info">
                <span class="meal-time">${meal.time}</span>
                <h3 class="meal-name">${meal.icon} ${meal.name}</h3>
                <div class="meal-macros">
                  <span class="macro protein">P: ${meal.recipe.protein}g</span>
                  <span class="macro carbs">C: ${meal.recipe.carbs}g</span>
                  <span class="macro fat">G: ${meal.recipe.fat}g</span>
                  <span class="macro kcal">${meal.recipe.kcal} kcal</span>
                </div>
              </div>
              <button class="btn-mark ${isMarked ? 'marked' : ''}" onclick="toggleMealMark('${meal.id}', '${today}')">
                ${isMarked ? '✓' : '○'}
              </button>
            </div>
            <details class="meal-recipe">
              <summary>Ver receta · ${meal.recipe.time}</summary>
              <div class="recipe-content">
                <h4>Ingredientes</h4>
                <ul>${meal.recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
                <h4>Preparación</h4>
                <p>${meal.recipe.instructions}</p>
              </div>
            </details>
          </div>
        `
      }).join('')}
    </div>

    ${renderNutritionEducation()}
  `
}

function buildMeals(profile) {
  const hour = parseInt(profile.trainingHour?.split(':')[0] || 18)
  const preHour = hour - 2

  return [
    { id: 'breakfast', icon: '☀️', name: 'Desayuno',     time: '7:00–8:00', recipe: pickRecipe('breakfast', profile) },
    { id: 'snack1',    icon: '🍎', name: 'Merienda 1',   time: '10:00–11:00', recipe: pickRecipe('snack1', profile) },
    { id: 'preworkout',icon: '⚡', name: 'Pre-Entreno',  time: `${preHour}:00`, recipe: pickRecipe('preworkout', profile) },
    { id: 'lunch',     icon: '🍽️', name: 'Almuerzo',     time: '13:00–14:00', recipe: pickRecipe('lunch', profile) },
    { id: 'postworkout',icon:'💪', name: 'Post-Entreno', time: `${hour + 1}:00`, recipe: pickRecipe('postworkout', profile) },
    { id: 'dinner',    icon: '🌙', name: 'Cena',         time: '20:00–21:00', recipe: pickRecipe('dinner', profile) },
    { id: 'snack2',    icon: '🥛', name: 'Snack Nocturno',time: '22:00–23:00', recipe: pickRecipe('snack2', profile) }
  ]
}

function pickRecipe(type, profile) {
  const pool = RECIPES[type] || []
  if (pool.length === 0) return { name: '—', protein: 0, carbs: 0, fat: 0, kcal: 0, time: '—', ingredients: [], instructions: '' }
  // Selección simple basada en hash del día para variar cada día
  const dayIndex = new Date().getDate() % pool.length
  return pool[dayIndex] || pool[0]
}

export function toggleMealMark(mealId, date) {
  const marked = getMealsForDay(date)
  const idx = marked.indexOf(mealId)
  if (idx >= 0) marked.splice(idx, 1)
  else marked.push(mealId)
  setMealsForDay(date, marked)
  renderNutrition()
}

export function updateTrainingHour(hour) {
  const profile = getFoodProfile() || {}
  profile.trainingHour = hour
  setFoodProfile(profile)
  renderNutrition()
}

export function editNutritionProfile() {
  const profile = getFoodProfile()
  const view = document.getElementById('view-nutricion')
  if (!view || !profile) return
  view.innerHTML = renderNutritionSetup()
  // Pre-rellenar valores
  const diet = document.getElementById('food-diet')
  const allergies = document.getElementById('food-allergies')
  const goal = document.getElementById('food-goal')
  const budget = document.getElementById('food-budget')
  if (diet) diet.value = profile.diet || 'omnivore'
  if (allergies) allergies.value = profile.allergies || ''
  if (goal) goal.value = profile.goal || 'muscle'
  if (budget) budget.value = profile.budget || 'normal'
}

// ── Educación nutricional ─────────────────────────────────────
function renderNutritionEducation() {
  const topics = [
    { title: '🥩 Proteína y síntesis muscular', content: 'La proteína es el macronutriente más importante para la construcción muscular. Objetivo: 1.6–2.2g por kg de peso corporal. Fuentes: pollo, pavo, atún, huevos, yogur griego, legumbres. La síntesis proteica se eleva 24-48h post-entrenamiento.' },
    { title: '🍚 Carbohidratos y energía', content: 'Los carbohidratos son el principal combustible para el entrenamiento de alta intensidad. Carbos complejos (avena, arroz integral, patata) para energía sostenida. Carbos simples (fruta, arroz blanco) post-entrenamiento para recuperación rápida.' },
    { title: '🥑 Grasas saludables', content: 'Las grasas son esenciales para la producción hormonal (testosterona, estrógenos). Fuentes: aguacate, aceite de oliva, frutos secos, salmón. Objetivo: 20-30% de las calorías totales.' },
    { title: '💧 Hidratación y electrolitos', content: 'Deshidratación del 2% reduce el rendimiento un 20%. Objetivo: 35–40 ml por kg de peso corporal al día. Durante el ejercicio: 500–700 ml por hora. Añade electrolitos en sesiones de más de 60 min.' },
    { title: '⏰ Timing de nutrientes', content: 'Pre-entreno (90 min antes): carbos + proteína. Post-entreno (30 min): proteína + carbos simples. Antes de dormir: caseína o proteína lenta (yogur griego, queso cottage) para recuperación nocturna.' }
  ]

  return `
    <div class="education-section">
      <h3 class="education-title">📚 Fundamentos de Nutrición</h3>
      ${topics.map(t => `
        <details class="education-item">
          <summary>${t.title}</summary>
          <p>${t.content}</p>
        </details>
      `).join('')}
    </div>
  `
}
