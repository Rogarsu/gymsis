import { generatePlan } from './src/planner.js'
import { assignMethod } from './src/methods.js'

const PROFILES = [
  { label:'P01 Principiante·músculo·gym·PPL·6d·90m·12sem',       objective:'muscle',    experience:'beginner',     bodyComposition:'normal',    sleep:'good',    stress:'low',     job:'sedentary', age:'18-25', daysPerWeek:6, duration:'90', environment:'gym',  split:'ppl',         planWeeks:12, limitations:[] },
  { label:'P02 Principiante·grasa·gym·FullBody·3d·60m·8sem',      objective:'fat_loss',  experience:'beginner',     bodyComposition:'overweight', sleep:'moderate', stress:'moderate', job:'sedentary', age:'26-35', daysPerWeek:3, duration:'60', environment:'gym',  split:'fullbody',    planWeeks:8,  limitations:[] },
  { label:'P03 Principiante·recomp·casa·FullBody·3d·60m·8sem',    objective:'recomp',    experience:'beginner',     bodyComposition:'normal',    sleep:'moderate', stress:'moderate', job:'moderate',  age:'18-25', daysPerWeek:3, duration:'60', environment:'home', split:'fullbody',    planWeeks:8,  limitations:[] },
  { label:'P04 Principiante·fuerza·ninguno·FB·3d·45m·4sem',       objective:'strength',  experience:'beginner',     bodyComposition:'lean',      sleep:'good',    stress:'low',     job:'sedentary', age:'26-35', daysPerWeek:3, duration:'45', environment:'none', split:'fullbody',    planWeeks:4,  limitations:[] },
  { label:'P05 Principiante·general·gym·UL·4d·75m·8sem·46+',      objective:'general',   experience:'beginner',     bodyComposition:'normal',    sleep:'poor',    stress:'high',    job:'active',    age:'46+',   daysPerWeek:4, duration:'75', environment:'gym',  split:'upper_lower', planWeeks:8,  limitations:[] },
  { label:'P06 Intermedio·músculo·gym·PPL·6d·90m·12sem',          objective:'muscle',    experience:'intermediate', bodyComposition:'lean',      sleep:'good',    stress:'low',     job:'sedentary', age:'26-35', daysPerWeek:6, duration:'90', environment:'gym',  split:'ppl',         planWeeks:12, limitations:[] },
  { label:'P07 Intermedio·fuerza·gym·UL·4d·90m·12sem',            objective:'strength',  experience:'intermediate', bodyComposition:'muscular',  sleep:'good',    stress:'moderate', job:'sedentary', age:'26-35', daysPerWeek:4, duration:'90', environment:'gym',  split:'upper_lower', planWeeks:12, limitations:[] },
  { label:'P08 Intermedio·grasa·casa·FB·4d·60m·8sem·estrés',      objective:'fat_loss',  experience:'intermediate', bodyComposition:'overweight', sleep:'moderate', stress:'high',    job:'active',    age:'36-45', daysPerWeek:4, duration:'60', environment:'home', split:'fullbody',    planWeeks:8,  limitations:[] },
  { label:'P09 Intermedio·recomp·gym·Upper·5d·75m·8sem',          objective:'recomp',    experience:'intermediate', bodyComposition:'normal',    sleep:'good',    stress:'moderate', job:'moderate',  age:'26-35', daysPerWeek:5, duration:'75', environment:'gym',  split:'upper',       planWeeks:8,  limitations:[] },
  { label:'P10 Intermedio·resistencia·ninguno·FB·3d·60m·8sem',    objective:'endurance', experience:'intermediate', bodyComposition:'lean',      sleep:'moderate', stress:'low',     job:'sedentary', age:'18-25', daysPerWeek:3, duration:'60', environment:'none', split:'fullbody',    planWeeks:8,  limitations:[] },
  { label:'P11 Avanzado·músculo·gym·PPL·6d·90m·12sem·DUP',        objective:'muscle',    experience:'advanced',     bodyComposition:'muscular',  sleep:'good',    stress:'low',     job:'sedentary', age:'26-35', daysPerWeek:6, duration:'90', environment:'gym',  split:'ppl',         planWeeks:12, limitations:[] },
  { label:'P12 Avanzado·fuerza·gym·UL·4d·90m·12sem',              objective:'strength',  experience:'advanced',     bodyComposition:'muscular',  sleep:'good',    stress:'low',     job:'sedentary', age:'26-35', daysPerWeek:4, duration:'90', environment:'gym',  split:'upper_lower', planWeeks:12, limitations:[] },
  { label:'P13 Avanzado·recomp·casa·FB·3d·75m·8sem',              objective:'recomp',    experience:'advanced',     bodyComposition:'normal',    sleep:'good',    stress:'moderate', job:'moderate',  age:'36-45', daysPerWeek:3, duration:'75', environment:'home', split:'fullbody',    planWeeks:8,  limitations:[] },
  { label:'P14 Avanzado·grasa·gym·Lower·3d·60m·8sem·46+',         objective:'fat_loss',  experience:'advanced',     bodyComposition:'overweight', sleep:'poor',    stress:'high',    job:'active',    age:'46+',   daysPerWeek:3, duration:'60', environment:'gym',  split:'lower',       planWeeks:8,  limitations:[] },
  { label:'P15 Avanzado·músculo·gym·Upper·5d·90m·12sem',          objective:'muscle',    experience:'advanced',     bodyComposition:'lean',      sleep:'good',    stress:'low',     job:'sedentary', age:'26-35', daysPerWeek:5, duration:'90', environment:'gym',  split:'upper',       planWeeks:12, limitations:[] },
  { label:'P16 Principiante·rodillas·Lower·3d·60m',               objective:'muscle',    experience:'beginner',     bodyComposition:'normal',    sleep:'good',    stress:'low',     job:'sedentary', age:'26-35', daysPerWeek:3, duration:'60', environment:'gym',  split:'lower',       planWeeks:8,  limitations:['knees'] },
  { label:'P17 Intermedio·espalda·PPL·5d·90m',                    objective:'muscle',    experience:'intermediate', bodyComposition:'normal',    sleep:'good',    stress:'low',     job:'sedentary', age:'36-45', daysPerWeek:5, duration:'90', environment:'gym',  split:'ppl',         planWeeks:12, limitations:['back'] },
  { label:'P18 Avanzado·hombros·Upper·4d·75m',                    objective:'strength',  experience:'advanced',     bodyComposition:'muscular',  sleep:'good',    stress:'low',     job:'sedentary', age:'26-35', daysPerWeek:4, duration:'75', environment:'gym',  split:'upper',       planWeeks:12, limitations:['shoulders'] },
  { label:'P19 Principiante·cadera·FB·3d·60m',                    objective:'fat_loss',  experience:'beginner',     bodyComposition:'overweight', sleep:'moderate', stress:'moderate', job:'sedentary', age:'26-35', daysPerWeek:3, duration:'60', environment:'gym',  split:'fullbody',    planWeeks:8,  limitations:['hips'] },
  { label:'P20 Intermedio·rodillas+espalda·PPL·4d·75m',           objective:'muscle',    experience:'intermediate', bodyComposition:'normal',    sleep:'moderate', stress:'moderate', job:'moderate',  age:'36-45', daysPerWeek:4, duration:'75', environment:'gym',  split:'ppl',         planWeeks:12, limitations:['knees','back'] },
  { label:'P21 Principiante·músculo·gym·PPL·3d·45m (mínimo)',     objective:'muscle',    experience:'beginner',     bodyComposition:'normal',    sleep:'good',    stress:'low',     job:'sedentary', age:'18-25', daysPerWeek:3, duration:'45', environment:'gym',  split:'ppl',         planWeeks:4,  limitations:[] },
  { label:'P22 Avanzado·fuerza·gym·PPL·6d·90m (máximo)',          objective:'strength',  experience:'advanced',     bodyComposition:'muscular',  sleep:'good',    stress:'low',     job:'sedentary', age:'26-35', daysPerWeek:6, duration:'90', environment:'gym',  split:'ppl',         planWeeks:12, limitations:[] },
  { label:'P23 Principiante·general·ninguno·FB·2d·45m·46+',       objective:'general',   experience:'beginner',     bodyComposition:'normal',    sleep:'moderate', stress:'moderate', job:'sedentary', age:'46+',   daysPerWeek:2, duration:'45', environment:'none', split:'fullbody',    planWeeks:4,  limitations:[] },
  { label:'P24 Intermedio·músculo·gym·UL·5d·90m·12sem',           objective:'muscle',    experience:'intermediate', bodyComposition:'lean',      sleep:'good',    stress:'low',     job:'sedentary', age:'18-25', daysPerWeek:5, duration:'90', environment:'gym',  split:'upper_lower', planWeeks:12, limitations:[] },
  { label:'P25 Avanzado·grasa·casa·PPL·6d·60m·8sem',              objective:'fat_loss',  experience:'advanced',     bodyComposition:'overweight', sleep:'moderate', stress:'moderate', job:'moderate',  age:'36-45', daysPerWeek:6, duration:'60', environment:'home', split:'ppl',         planWeeks:8,  limitations:[] },
  { label:'P26 Principiante·grasa·casa·FB·4d·75m·sobrepeso',      objective:'fat_loss',  experience:'beginner',     bodyComposition:'overweight', sleep:'poor',    stress:'high',    job:'active',    age:'36-45', daysPerWeek:4, duration:'75', environment:'home', split:'fullbody',    planWeeks:8,  limitations:[] },
  { label:'P27 Intermedio·fuerza·gym·Upper·4d·90m·12sem',         objective:'strength',  experience:'intermediate', bodyComposition:'muscular',  sleep:'good',    stress:'low',     job:'sedentary', age:'26-35', daysPerWeek:4, duration:'90', environment:'gym',  split:'upper',       planWeeks:12, limitations:[] },
  { label:'P28 Avanzado·resistencia·ninguno·FB·5d·60m·8sem',      objective:'endurance', experience:'advanced',     bodyComposition:'lean',      sleep:'moderate', stress:'low',     job:'active',    age:'26-35', daysPerWeek:5, duration:'60', environment:'none', split:'fullbody',    planWeeks:8,  limitations:[] },
  { label:'P29 Intermedio·recomp·gym·PPL·5d·75m·12sem',           objective:'recomp',    experience:'intermediate', bodyComposition:'normal',    sleep:'good',    stress:'moderate', job:'sedentary', age:'26-35', daysPerWeek:5, duration:'75', environment:'gym',  split:'ppl',         planWeeks:12, limitations:[] },
  { label:'P30 Avanzado·músculo·gym·PPL·6d·90m·12sem (máximo)',   objective:'muscle',    experience:'advanced',     bodyComposition:'lean',      sleep:'good',    stress:'low',     job:'sedentary', age:'26-35', daysPerWeek:6, duration:'90', environment:'gym',  split:'ppl',         planWeeks:12, limitations:[] },
]

const LIMITATION_EXCLUSIONS = {
  knees:    ['squat','squat_variation','squat_home','hack_squat','lunge','lunge_advanced','bulgarian_glute','leg_press','knee_extension','plyometric_lower','glute_squat'],
  back:     ['deadlift','romanian_deadlift','romanian_deadlift_back','back_extension','clean_press','hip_hinge_advanced','horizontal_row','row_advanced'],
  shoulders:['overhead_press','incline_push','push_up','push_up_advanced','upright_row','lateral_raise','front_raise','shoulder_circle','handstand','clean_press','overhead_carry'],
  hips:     ['hip_thrust','hip_abduction','hip_core','bulgarian_glute','glute_step','glute_compound_advanced','lunge','lunge_advanced','hip_hinge_advanced']
}

function analyzePlan(profile, plan) {
  const issues = []
  const warnings = []
  const sessions = plan.phases.flatMap(p => p.sessions)

  const expectedSessions = profile.daysPerWeek * profile.planWeeks
  if (sessions.length !== expectedSessions)
    issues.push(`Sesiones esperadas ${expectedSessions}, generadas ${sessions.length}`)

  const excludedPatterns = (profile.limitations || [])
    .flatMap(l => LIMITATION_EXCLUSIONS[l] || [])

  let patternRedundancies = 0, limitationViolations = 0
  let totalCompound = 0, totalIsolation = 0
  const allExIds = []

  sessions.forEach(s => {
    if (s.exercises.length === 0) {
      issues.push(`Sesion ${s.number} (${s.name}): SIN ejercicios`)
      return
    }
    const seen = new Set()
    s.exercises.forEach(e => {
      const p = e.movementPattern
      if (p && seen.has(p)) patternRedundancies++
      if (p) seen.add(p)
      if (excludedPatterns.includes(p)) {
        limitationViolations++
        issues.push(`s${s.number} VIOLACION: ${p} "${e.name}"`)
      }
      if (e.type === 'compound') totalCompound++
      else totalIsolation++
      allExIds.push(e.id)
    })
  })

  const counts = {}
  allExIds.forEach(id => counts[id] = (counts[id]||0)+1)
  const maxRepeat = allExIds.length > 0 ? Math.max(...Object.values(counts)) : 0
  const uniqueCount = new Set(allExIds).size
  const total = totalCompound + totalIsolation
  const compPct = total > 0 ? Math.round(totalCompound/total*100) : 0

  // Validar coherencia método-reps
  const m = plan.meta.methodId
  const phases = plan.phases
  phases.forEach(ph => {
    if (ph.isDeload) return
    ph.sessions.slice(0,1).forEach(s => {
      s.exercises.filter(e => e.type === 'compound').forEach(e => {
        const [lo, hi] = e.reps.split('-').map(Number)
        if (m === 'pure_strength' && lo > 6)
          warnings.push(`pure_strength comp reps altas: ${e.reps} (${e.name})`)
        if (m === 'fat_loss' && hi < 12)
          warnings.push(`fat_loss comp reps bajas: ${e.reps} (${e.name})`)
        if (m === 'hypertrophy' && lo > 14)
          warnings.push(`hypertrophy comp reps muy altas: ${e.reps} (${e.name})`)
      })
    })
  })

  const shortSessions = sessions.filter(s => s.exercises.length < 3).length
  if (shortSessions > 0) warnings.push(`${shortSessions} sesiones con <3 ejercicios`)

  // Verificar que sesiones de piernas tienen quad/glute/hamstring
  if (profile.split === 'ppl' || profile.split === 'lower') {
    const legSessions = sessions.filter(s => s.name.toLowerCase().includes('pierna') || s.name.toLowerCase().includes('inferior'))
    legSessions.slice(0,2).forEach(s => {
      const muscles = new Set(s.exercises.map(e => e.muscle))
      if (!muscles.has('Cuádriceps') && !muscles.has('Glúteo') && !muscles.has('Isquiotibiales'))
        issues.push(`${s.name}: sin músculos de pierna`)
    })
  }

  // Verificar que sesiones Push tienen pecho Y hombros
  if (profile.split === 'ppl') {
    const pushSessions = sessions.filter(s => s.name.toLowerCase().includes('push'))
    pushSessions.slice(0,2).forEach(s => {
      const muscles = new Set(s.exercises.map(e => e.muscle))
      if (!muscles.has('Pecho'))    warnings.push(`${s.name} s${s.number}: sin Pecho`)
      if (!muscles.has('Hombros')) warnings.push(`${s.name} s${s.number}: sin Hombros`)
    })
  }

  return {
    sessions: sessions.length,
    uniqueEx: uniqueCount,
    maxRepeat,
    compPct,
    patternRedundancies,
    limitationViolations,
    issues,
    warnings,
    methodId: plan.meta.methodId,
    ok: issues.length === 0 && patternRedundancies === 0 && limitationViolations === 0
  }
}

console.log('='.repeat(90))
console.log('ANÁLISIS CRÍTICO — 30 PLANES CON PERFILES VARIADOS')
console.log('='.repeat(90))

let passed = 0
const allIssues = []
const allWarnings = []

for (const profile of PROFILES) {
  const answers = {
    objectives:      [profile.objective],
    objective:       profile.objective,
    level:           profile.experience,
    experience:      profile.experience,
    bodyComposition: profile.bodyComposition,
    sleep:           profile.sleep,
    stress:          profile.stress,
    job:             profile.job,
    age:             profile.age,
    daysPerWeek:     profile.daysPerWeek,
    duration:        profile.duration,
    environment:     profile.environment,
    split:           profile.split,
    planWeeks:       profile.planWeeks,
    limitations:     profile.limitations,
  }
  const { methodId, modifiers } = assignMethod(answers)
  answers.methodId = methodId
  answers.modifiers = modifiers

  let result
  try {
    const plan = generatePlan(answers)
    result = analyzePlan(profile, plan)
  } catch(e) {
    result = { ok:false, issues:[`CRASH: ${e.message}`], warnings:[], sessions:0, uniqueEx:0, maxRepeat:0, compPct:0, patternRedundancies:0, limitationViolations:0, methodId }
  }

  if (result.ok) passed++

  const status = result.ok ? 'OK' : 'XX'
  const flag = result.ok ? '✓' : '!'
  console.log(`\n[${flag}] ${profile.label}`)
  console.log(`    Método: ${result.methodId?.padEnd(20)} | Ses: ${String(result.sessions).padStart(3)} | Únicos: ${String(result.uniqueEx).padStart(3)} | MaxRep: ${result.maxRepeat}x | Comp: ${result.compPct}% / Iso: ${100-result.compPct}%`)
  console.log(`    PatrónRedund: ${result.patternRedundancies} | LimitViolac: ${result.limitationViolations}`)

  result.issues.forEach(i => { console.log(`    [ISSUE] ${i}`); allIssues.push(`${profile.label}: ${i}`) })
  result.warnings.forEach(w => { console.log(`    [aviso] ${w}`); allWarnings.push(`${profile.label}: ${w}`) })
}

console.log('\n' + '='.repeat(90))
console.log(`RESULTADO: ${passed}/30 planes 100% limpios`)
console.log(`Issues totales: ${allIssues.length} | Avisos: ${allWarnings.length}`)
if (allIssues.length > 0) { console.log('\nISSUES CRITICOS:'); allIssues.forEach(i => console.log('  - '+i)) }
if (allWarnings.length > 0) { console.log('\nAVISOS:'); allWarnings.forEach(w => console.log('  - '+w)) }
console.log('='.repeat(90))
