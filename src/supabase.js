import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY)
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      }
    })
  : null

export const isSupabaseConfigured = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

// ── Auth helpers ──────────────────────────────────────────────
export async function sbSignUp(email, password) {
  if (!supabase) throw new Error('Supabase no configurado')
  return supabase.auth.signUp({ email, password })
}

export async function sbSignIn(email, password) {
  if (!supabase) throw new Error('Supabase no configurado')
  return supabase.auth.signInWithPassword({ email, password })
}

export async function sbSignInGoogle() {
  if (!supabase) throw new Error('Supabase no configurado')
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin }
  })
}

export async function sbSignOut() {
  if (!supabase) return
  return supabase.auth.signOut()
}

export function sbOnAuthChange(cb) {
  if (!supabase) return () => {}
  const { data } = supabase.auth.onAuthStateChange(cb)
  return data.subscription.unsubscribe
}

export async function sbGetUser() {
  if (!supabase) return null
  const { data } = await supabase.auth.getUser()
  return data?.user ?? null
}

// ── Training plans ────────────────────────────────────────────
export async function sbUpsertPlan(userId, plan) {
  if (!supabase) return
  await supabase.from('training_plans').upsert({
    user_id: userId,
    plan_data: plan,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' })
}

export async function sbGetPlan(userId) {
  if (!supabase) return null
  const { data } = await supabase
    .from('training_plans')
    .select('plan_data')
    .eq('user_id', userId)
    .single()
  return data?.plan_data ?? null
}

export async function sbDeletePlan(userId) {
  if (!supabase) return
  await supabase.from('training_plans').delete().eq('user_id', userId)
}

// ── Session logs ──────────────────────────────────────────────
export async function sbUpsertSessionLog(userId, log) {
  if (!supabase) return
  await supabase.from('session_logs').upsert({
    user_id: userId,
    session_id: log.sessionId,
    log_data: log,
    completed_at: log.completedAt
  }, { onConflict: 'user_id,session_id' })
}

export async function sbGetSessionLogs(userId) {
  if (!supabase) return []
  const { data } = await supabase
    .from('session_logs')
    .select('log_data')
    .eq('user_id', userId)
  return (data || []).map(r => r.log_data)
}

export async function sbDeleteSessionLogs(userId) {
  if (!supabase) return
  await supabase.from('session_logs').delete().eq('user_id', userId)
}

// ── Exercise logs ─────────────────────────────────────────────
export async function sbUpsertExLog(userId, log) {
  if (!supabase) return
  await supabase.from('exercise_logs').upsert({
    user_id: userId,
    ex_id: log.exId,
    session_id: log.sessionId,
    log_data: log,
    completed_at: log.completedAt
  }, { onConflict: 'user_id,ex_id,session_id' })
}

export async function sbGetExLogs(userId) {
  if (!supabase) return []
  const { data } = await supabase
    .from('exercise_logs')
    .select('log_data')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
  return (data || []).map(r => r.log_data)
}

export async function sbDeleteExLogs(userId) {
  if (!supabase) return
  await supabase.from('exercise_logs').delete().eq('user_id', userId)
}

// ── Body metrics ──────────────────────────────────────────────
export async function sbUpsertBodyMetric(userId, metric) {
  if (!supabase) return
  await supabase.from('body_metrics').upsert({
    user_id: userId,
    date: metric.date,
    metric_data: metric
  }, { onConflict: 'user_id,date' })
}

export async function sbGetBodyMetrics(userId) {
  if (!supabase) return []
  const { data } = await supabase
    .from('body_metrics')
    .select('metric_data')
    .eq('user_id', userId)
    .order('date', { ascending: true })
  return (data || []).map(r => r.metric_data)
}

// ── User preferences ──────────────────────────────────────────
export async function sbUpsertUserPrefs(userId, prefs) {
  if (!supabase) return
  await supabase.from('user_preferences').upsert({
    user_id: userId,
    prefs_data: prefs,
    updated_at: new Date().toISOString()
  }, { onConflict: 'user_id' })
}

export async function sbGetUserPrefs(userId) {
  if (!supabase) return null
  const { data } = await supabase
    .from('user_preferences')
    .select('prefs_data')
    .eq('user_id', userId)
    .single()
  return data?.prefs_data ?? null
}

// ── Nutrition logs ────────────────────────────────────────────
export async function sbUpsertNutritionLog(userId, date, meals) {
  if (!supabase) return
  await supabase.from('nutrition_logs').upsert({
    user_id: userId,
    date,
    meals_data: meals
  }, { onConflict: 'user_id,date' })
}

export async function sbGetNutritionLogs(userId) {
  if (!supabase) return []
  const { data } = await supabase
    .from('nutrition_logs')
    .select('date, meals_data')
    .eq('user_id', userId)
  return data || []
}
