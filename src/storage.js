// ─────────────────────────────────────────────────────────────
// storage.js  —  localStorage helpers with namespacing
// ─────────────────────────────────────────────────────────────

const KEY = {
  PLAN_META:    'sv_plan_meta',
  PLAN_CACHE:   'sv_plan_cache',
  LOGS:         'sv_logs',
  FOOD_PROFILE: 'sv_food_profile',
  BODY_METRICS: 'sv_body_metrics',
  USER_ID:      'sv_user_id',
  ex:           (exId, sessionId) => `sv_ex_${exId}_${sessionId}`,
  exSwap:       (exId, sessionId) => `sv_ex_swap_${exId}_${sessionId}`,
  meal:         (date) => `sv_meal_${date}`,
  sessionStart: (id)  => `sv_session_start_${id}`,
  sessionEnd:   (id)  => `sv_session_end_${id}`,
}

function get(key) {
  try {
    const val = localStorage.getItem(key)
    return val ? JSON.parse(val) : null
  } catch { return null }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch (e) {
    console.warn('[storage] write failed', key, e)
  }
}

function del(key) {
  localStorage.removeItem(key)
}

// ── Plan meta (onboarding answers) ───────────────────────────
export const getPlanMeta     = ()  => get(KEY.PLAN_META)
export const setPlanMeta     = (v) => set(KEY.PLAN_META, v)
export const clearPlanMeta   = ()  => del(KEY.PLAN_META)

// ── Plan cache (full generated plan) ─────────────────────────
export const getPlanCache    = ()  => get(KEY.PLAN_CACHE)
export const setPlanCache    = (v) => set(KEY.PLAN_CACHE, v)
export const clearPlanCache  = ()  => del(KEY.PLAN_CACHE)

// ── Session completion logs ───────────────────────────────────
export const getLogs         = ()  => get(KEY.LOGS) || []
export const setLogs         = (v) => set(KEY.LOGS, v)
export const clearLogs       = ()  => del(KEY.LOGS)

export function addLog(log) {
  const logs = getLogs()
  const idx = logs.findIndex(l => l.sessionId === log.sessionId)
  if (idx >= 0) logs[idx] = log
  else logs.push(log)
  setLogs(logs)
}

export function getLog(sessionId) {
  return getLogs().find(l => l.sessionId === sessionId) || null
}

// ── Exercise logs (per exercise per session) ──────────────────
export function getExLog(exId, sessionId) {
  return get(KEY.ex(exId, sessionId))
}

export function setExLog(exId, sessionId, data) {
  set(KEY.ex(exId, sessionId), data)
}

export function clearExLog(exId, sessionId) {
  del(KEY.ex(exId, sessionId))
}

// Get ALL exercise logs (scan localStorage)
export function getAllExLogs() {
  const result = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('sv_ex_') && !key.includes('_swap_')) {
      const val = get(key)
      if (val) result.push(val)
    }
  }
  return result
}

export function clearAllExLogs() {
  const toRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('sv_ex_')) toRemove.push(key)
  }
  toRemove.forEach(k => localStorage.removeItem(k))
}

// ── Exercise swaps ────────────────────────────────────────────
export const getExSwap  = (exId, sessionId) => get(KEY.exSwap(exId, sessionId))
export const setExSwap  = (exId, sessionId, newExId) => set(KEY.exSwap(exId, sessionId), newExId)
export const clearExSwap = (exId, sessionId) => del(KEY.exSwap(exId, sessionId))

export function clearAllExSwaps() {
  const toRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.includes('_swap_')) toRemove.push(key)
  }
  toRemove.forEach(k => localStorage.removeItem(k))
}

// ── Food profile ──────────────────────────────────────────────
export const getFoodProfile  = ()  => get(KEY.FOOD_PROFILE)
export const setFoodProfile  = (v) => set(KEY.FOOD_PROFILE, v)
export const clearFoodProfile = ()  => del(KEY.FOOD_PROFILE)

// ── Body metrics ──────────────────────────────────────────────
export const getBodyMetrics  = ()  => get(KEY.BODY_METRICS) || []
export const setBodyMetrics  = (v) => set(KEY.BODY_METRICS, v)

export function addBodyMetric(metric) {
  const metrics = getBodyMetrics()
  const idx = metrics.findIndex(m => m.date === metric.date)
  if (idx >= 0) metrics[idx] = { ...metrics[idx], ...metric }
  else metrics.push(metric)
  metrics.sort((a, b) => a.date.localeCompare(b.date))
  setBodyMetrics(metrics)
}

// ── Daily meals marked ────────────────────────────────────────
export const getMealsForDay  = (date) => get(KEY.meal(date)) || []
export const setMealsForDay  = (date, v) => set(KEY.meal(date), v)

// ── Session timers ────────────────────────────────────────────
export const getSessionStart = (id) => get(KEY.sessionStart(id))
export const setSessionStart = (id, ts) => set(KEY.sessionStart(id), ts)
export const getSessionEnd   = (id) => get(KEY.sessionEnd(id))
export const setSessionEnd   = (id, ts) => set(KEY.sessionEnd(id), ts)

// ── User ID ───────────────────────────────────────────────────
export const getUserId  = ()  => get(KEY.USER_ID)
export const setUserId  = (v) => set(KEY.USER_ID, v)
export const clearUserId = ()  => del(KEY.USER_ID)

// ── Full reset ────────────────────────────────────────────────
export function clearAllUserData() {
  const toRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && key.startsWith('sv_')) toRemove.push(key)
  }
  toRemove.forEach(k => localStorage.removeItem(k))
}

// Clear just progress (keep plan)
export function clearProgressData() {
  clearLogs()
  clearAllExLogs()
  clearAllExSwaps()
  // Clear meal marks
  const toRemove = []
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key && (key.startsWith('sv_meal_') || key.startsWith('sv_session_start_') || key.startsWith('sv_session_end_')))
      toRemove.push(key)
  }
  toRemove.forEach(k => localStorage.removeItem(k))
}

// ── Utilities ─────────────────────────────────────────────────
export function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

export function nowIso() {
  return new Date().toISOString()
}
