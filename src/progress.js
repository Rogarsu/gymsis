// ─────────────────────────────────────────────────────────────
// progress.js — Módulo de progreso: métricas, gráficos y racha
// ─────────────────────────────────────────────────────────────
import { getBodyMetrics, addBodyMetric, getAllExLogs, getLogs, getMealsForDay, todayStr } from './storage.js'
import { Chart } from 'chart.js/auto'
import { ic, refreshIcons } from './icons.js'

let _charts = {}
let _plan = null

export function initProgress(plan) {
  _plan = plan
}

export function renderProgress() {
  const view = document.getElementById('view-progreso')
  if (!view) return

  const metrics = getBodyMetrics()
  const logs    = getLogs()
  const exLogs  = getAllExLogs()
  const streak  = calcStreak(logs)

  view.innerHTML = `
    <div class="module-header">
      <h2 class="module-title">${ic('trending-up')} Mi Progreso</h2>
    </div>

    <!-- Métricas rápidas -->
    <div class="progress-metrics">
      <div class="metric-card">
        <div class="metric-value">${streak.current} ${ic('flame')}</div>
        <div class="metric-label">Semanas seguidas</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${streak.best} ${ic('trophy')}</div>
        <div class="metric-label">Mejor racha</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${calcSessionsThisWeek(logs)} ${ic('calendar')}</div>
        <div class="metric-label">Sesiones esta semana</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${calcNutritionDays()} ${ic('leaf')}</div>
        <div class="metric-label">Días con nutrición</div>
      </div>
    </div>

    <!-- Peso corporal -->
    <div class="card">
      <h3 class="card-title">${ic('scale')} Peso corporal</h3>
      <div class="weight-input-row">
        <input type="number" id="weight-input" class="form-input" step="0.1" placeholder="75.5" />
        <span class="weight-unit">kg</span>
        <button class="btn btn-primary" onclick="saveBodyWeight()">Guardar</button>
      </div>
      ${metrics.length > 0 ? `
        <div class="weight-delta">
          ${calcWeightDelta(metrics)}
        </div>
        <div class="chart-container">
          <canvas id="chart-weight"></canvas>
        </div>
      ` : '<p class="chart-empty">Registra tu primer peso para ver la gráfica de evolución</p>'}
    </div>

    <!-- Medidas corporales -->
    <div class="card">
      <h3 class="card-title">${ic('ruler')} Medidas corporales</h3>
      <div class="measures-grid">
        <div class="form-group">
          <label class="form-label">Cintura (cm)</label>
          <input type="number" id="measure-waist" class="form-input" step="0.5" />
        </div>
        <div class="form-group">
          <label class="form-label">Cadera (cm)</label>
          <input type="number" id="measure-hip" class="form-input" step="0.5" />
        </div>
        <div class="form-group">
          <label class="form-label">Pecho (cm)</label>
          <input type="number" id="measure-chest" class="form-input" step="0.5" />
        </div>
        <div class="form-group">
          <label class="form-label">Brazo (cm)</label>
          <input type="number" id="measure-arm" class="form-input" step="0.5" />
        </div>
        <div class="form-group">
          <label class="form-label">Muslo (cm)</label>
          <input type="number" id="measure-thigh" class="form-input" step="0.5" />
        </div>
      </div>
      <button class="btn btn-primary" onclick="saveMeasures()">${ic('check')} Guardar medidas</button>
      ${renderMeasuresTable(metrics)}
    </div>

    <!-- Progresión de ejercicios -->
    <div class="card">
      <h3 class="card-title">${ic('dumbbell')} Progresión de ejercicios</h3>
      ${exLogs.length > 0 ? `
        <select class="form-input" onchange="renderExerciseChart(this.value)" id="ex-chart-select">
          ${getUniqueExercises(exLogs).map(ex => `<option value="${ex.id}">${ex.name}</option>`).join('')}
        </select>
        <div class="chart-container">
          <canvas id="chart-exercise"></canvas>
        </div>
      ` : '<p class="chart-empty">Registra entrenamientos para ver la progresión de tus ejercicios</p>'}
    </div>

    <!-- Tendencia de bienestar -->
    <div class="card">
      <h3 class="card-title">${ic('thermometer')} Tendencia de bienestar</h3>
      ${logs.filter(l => l.energy || l.fatigue).length >= 2 ? `
        <div class="chart-container">
          <canvas id="chart-wellness"></canvas>
        </div>
      ` : '<p class="chart-empty">Completa al menos 2 sesiones con registro de energía y fatiga</p>'}
    </div>

    <!-- Notificaciones -->
    <div class="card">
      <h3 class="card-title">${ic('bell')} Recordatorios de entrenamiento</h3>
      <div class="notification-actions">
        <button class="btn btn-secondary" onclick="enableNotifications()">Habilitar recordatorios</button>
        <button class="btn btn-ghost" onclick="sendTestNotification()">Enviar prueba</button>
      </div>
    </div>
  `

  refreshIcons()

  // Renderizar gráficas
  requestAnimationFrame(() => {
    if (metrics.length > 0)        renderWeightChart(metrics)
    if (logs.filter(l => l.energy || l.fatigue).length >= 2) renderWellnessChart(logs)
    if (exLogs.length > 0) {
      const sel = document.getElementById('ex-chart-select')
      if (sel) renderExerciseChart(sel.value)
    }
  })
}

// ── Cálculos ──────────────────────────────────────────────────
function calcStreak(logs) {
  if (!logs.length) return { current: 0, best: 0 }

  // Agrupar por semana ISO
  const weeks = new Set(logs.map(l => getISOWeek(new Date(l.completedAt))))
  const sortedWeeks = [...weeks].sort()
  const thisWeek = getISOWeek(new Date())

  let current = 0
  let best = 0
  let streak = 0
  let prevWeek = null

  for (let i = sortedWeeks.length - 1; i >= 0; i--) {
    const w = sortedWeeks[i]
    if (prevWeek === null || parseInt(prevWeek) - parseInt(w) <= 1) {
      streak++
      if (i === sortedWeeks.length - 1 || sortedWeeks[sortedWeeks.length - 1] === thisWeek) {
        current = streak
      }
    } else {
      break
    }
    prevWeek = w
    best = Math.max(best, streak)
  }

  return { current, best }
}

function getISOWeek(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const week = Math.ceil((((d - yearStart) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-W${String(week).padStart(2,'0')}`
}

function calcSessionsThisWeek(logs) {
  const thisWeek = getISOWeek(new Date())
  return logs.filter(l => getISOWeek(new Date(l.completedAt)) === thisWeek).length
}

function calcNutritionDays() {
  // Contar días de la semana actual con comidas marcadas
  let count = 0
  for (let d = 0; d < 7; d++) {
    const date = new Date()
    date.setDate(date.getDate() - d)
    const dateStr = date.toISOString().slice(0,10)
    const meals = getMealsForDay(dateStr)
    if (meals.length > 0) count++
  }
  return count
}

function calcWeightDelta(metrics) {
  if (metrics.length < 2) return ''
  const first = metrics.find(m => m.weight)?.weight
  const last  = [...metrics].reverse().find(m => m.weight)?.weight
  if (!first || !last) return ''
  const delta = (last - first).toFixed(1)
  const sign  = delta >= 0 ? '+' : ''
  const color = delta >= 0 ? 'var(--success)' : 'var(--warning)'
  return `<span class="weight-delta-value" style="color:${color}">${sign}${delta} kg desde el inicio</span>`
}

function renderMeasuresTable(metrics) {
  const measures = metrics.filter(m => m.waist || m.hip || m.chest || m.arm || m.thigh)
  if (measures.length === 0) return '<p class="chart-empty">Sin medidas registradas aún</p>'

  const first = measures[0]
  const last  = measures[measures.length - 1]

  const fields = [
    { key: 'waist', label: 'Cintura' },
    { key: 'hip',   label: 'Cadera' },
    { key: 'chest', label: 'Pecho' },
    { key: 'arm',   label: 'Brazo' },
    { key: 'thigh', label: 'Muslo' }
  ]

  const rows = fields
    .filter(f => last[f.key])
    .map(f => {
      const current = last[f.key]
      const initial = first[f.key]
      const delta = initial ? (current - initial).toFixed(1) : null
      const sign = delta >= 0 ? '+' : ''
      return `<tr>
        <td>${f.label}</td>
        <td>${current} cm</td>
        <td class="${delta < 0 ? 'delta-good' : delta > 0 ? 'delta-bad' : ''}">${delta !== null ? `${sign}${delta} cm` : '—'}</td>
      </tr>`
    }).join('')

  if (!rows) return ''

  return `
    <div class="measures-table-wrapper">
      <table class="measures-table">
        <thead><tr><th>Medida</th><th>Último</th><th>Δ inicial</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
    <div class="chart-container">
      <canvas id="chart-measures"></canvas>
    </div>
    <select class="form-input form-input-sm" onchange="renderMeasureChart(this.value)" id="measure-chart-select">
      ${fields.filter(f => last[f.key]).map(f => `<option value="${f.key}">${f.label}</option>`).join('')}
    </select>
  `
}

function getUniqueExercises(exLogs) {
  const seen = new Map()
  exLogs.forEach(log => {
    if (!seen.has(log.exId)) seen.set(log.exId, { id: log.exId, name: log.name })
  })
  return [...seen.values()]
}

// ── Gráficas ──────────────────────────────────────────────────
function destroyChart(id) {
  if (_charts[id]) { _charts[id].destroy(); delete _charts[id] }
}

function renderWeightChart(metrics) {
  destroyChart('weight')
  const canvas = document.getElementById('chart-weight')
  if (!canvas) return
  const data = metrics.filter(m => m.weight).map(m => ({ x: m.date, y: m.weight }))
  _charts.weight = new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.map(d => formatShortDate(d.x)),
      datasets: [{
        label: 'Peso (kg)',
        data: data.map(d => d.y),
        borderColor: '#7c3aed',
        backgroundColor: 'rgba(124,58,237,0.1)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#7c3aed'
      }]
    },
    options: chartOptions('kg')
  })
}

export function renderExerciseChart(exId) {
  destroyChart('exercise')
  const canvas = document.getElementById('chart-exercise')
  if (!canvas || !exId) return

  const allLogs = getAllExLogs()
  const logs = allLogs.filter(l => l.exId === exId)
    .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))

  const data = logs.map(log => {
    const maxWeight = Math.max(...(log.sets || []).map(s => s.weight || 0))
    return { x: log.completedAt?.slice(0,10), y: maxWeight }
  })

  const exName = logs[0]?.name || exId

  _charts.exercise = new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.map(d => formatShortDate(d.x)),
      datasets: [{
        label: `${exName} — Peso máximo (kg)`,
        data: data.map(d => d.y),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6,182,212,0.1)',
        fill: true,
        tension: 0.3,
        pointBackgroundColor: '#06b6d4'
      }]
    },
    options: chartOptions('kg')
  })
}

function renderWellnessChart(logs) {
  destroyChart('wellness')
  const canvas = document.getElementById('chart-wellness')
  if (!canvas) return

  const sorted = [...logs]
    .filter(l => l.energy || l.fatigue)
    .sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))

  _charts.wellness = new Chart(canvas, {
    type: 'line',
    data: {
      labels: sorted.map(l => formatShortDate(l.completedAt?.slice(0,10))),
      datasets: [
        {
          label: 'Energía',
          data: sorted.map(l => l.energy || null),
          borderColor: '#10b981',
          backgroundColor: 'rgba(16,185,129,0.1)',
          tension: 0.3, fill: false,
          pointBackgroundColor: '#10b981'
        },
        {
          label: 'Fatiga',
          data: sorted.map(l => l.fatigue || null),
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245,158,11,0.1)',
          tension: 0.3, fill: false,
          pointBackgroundColor: '#f59e0b'
        }
      ]
    },
    options: { ...chartOptions('/10'), scales: { ...chartOptions('/10').scales, y: { ...chartOptions('/10').scales?.y, min: 0, max: 10 } } }
  })
}

export function renderMeasureChart(field) {
  destroyChart('measures')
  const canvas = document.getElementById('chart-measures')
  if (!canvas || !field) return

  const metrics = getBodyMetrics().filter(m => m[field])
  const data = metrics.map(m => ({ x: m.date, y: m[field] }))

  _charts.measures = new Chart(canvas, {
    type: 'line',
    data: {
      labels: data.map(d => formatShortDate(d.x)),
      datasets: [{
        label: `${field} (cm)`,
        data: data.map(d => d.y),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245,158,11,0.1)',
        fill: true, tension: 0.3,
        pointBackgroundColor: '#f59e0b'
      }]
    },
    options: chartOptions('cm')
  })
}

function chartOptions(unit = '') {
  return {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#e6edf3' } },
      tooltip: { callbacks: { label: ctx => `${ctx.raw} ${unit}` } }
    },
    scales: {
      x: { ticks: { color: '#7d8590' }, grid: { color: '#30363d' } },
      y: { ticks: { color: '#7d8590', callback: v => `${v}${unit}` }, grid: { color: '#30363d' } }
    }
  }
}

// ── Guardar datos ─────────────────────────────────────────────
export function saveBodyWeight() {
  const val = parseFloat(document.getElementById('weight-input')?.value)
  if (!val || isNaN(val)) { alert('Ingresa un peso válido'); return }
  addBodyMetric({ date: todayStr(), weight: val })
  renderProgress()
}

export function saveMeasures() {
  const fields = ['waist','hip','chest','arm','thigh']
  const metric = { date: todayStr() }
  fields.forEach(f => {
    const val = parseFloat(document.getElementById(`measure-${f}`)?.value)
    if (val) metric[f] = val
  })
  if (Object.keys(metric).length <= 1) { alert('Ingresa al menos una medida'); return }
  addBodyMetric(metric)
  renderProgress()
}

// ── Notificaciones ────────────────────────────────────────────
export async function enableNotifications() {
  if (!('Notification' in window)) { alert('Tu navegador no soporta notificaciones'); return }
  const perm = await Notification.requestPermission()
  if (perm === 'granted') {
    alert('✓ Recordatorios habilitados. Recibirás una notificación diaria.')
  } else {
    alert('Permiso denegado. Habilita las notificaciones en la configuración de tu navegador.')
  }
}

export function sendTestNotification() {
  if (Notification.permission === 'granted') {
    new Notification('SistemaVida 🏋️', {
      body: '¡Es hora de entrenar! 💪 Tu sesión de hoy te espera.',
      icon: '/icons/icon-192.png'
    })
  } else {
    alert('Primero habilita los recordatorios')
  }
}

// ── Helpers ───────────────────────────────────────────────────
function formatShortDate(dateStr) {
  if (!dateStr) return ''
  const [, m, d] = dateStr.split('-')
  return `${d}/${m}`
}
