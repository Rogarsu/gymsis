// ─────────────────────────────────────────────────────────────
// history.js — Historial de pesos registrados por ejercicio
// ─────────────────────────────────────────────────────────────
import { getAllExLogs } from './storage.js'
import { ic, refreshIcons } from './icons.js'

let _sortAsc = false
let _searchTerm = ''

export function renderHistory() {
  const view = document.getElementById('view-historial')
  if (!view) return

  view.innerHTML = `
    <div class="module-header">
      <h2 class="module-title">${ic('clipboard-list')} Historial de entrenamientos</h2>
    </div>
    <div class="history-toolbar">
      <input type="text" id="history-search" class="form-input" placeholder="Buscar ejercicio o músculo..."
        oninput="filterHistory(this.value)" value="${_searchTerm}" />
    </div>
    <div class="history-table-wrapper" id="history-table-wrapper">
      ${buildHistoryTable()}
    </div>
  `
  refreshIcons()
}

function buildHistoryTable() {
  let logs = getAllExLogs()

  // Filtro de búsqueda
  if (_searchTerm) {
    const q = _searchTerm.toLowerCase()
    logs = logs.filter(log =>
      log.name?.toLowerCase().includes(q) ||
      log.muscle?.toLowerCase().includes(q)
    )
  }

  // Expandir logs en filas (una por serie)
  const rows = []
  logs.forEach(log => {
    if (!log.sets) return
    log.sets.forEach((s, i) => {
      rows.push({
        muscle:    log.muscle || '—',
        name:      log.name   || '—',
        serie:     i + 1,
        reps:      s.reps   || 0,
        weight:    s.weight || 0,
        sessionId: log.sessionId || '—',
        date:      log.completedAt || ''
      })
    })
  })

  // Ordenar por fecha
  rows.sort((a, b) => {
    const cmp = new Date(a.date) - new Date(b.date)
    return _sortAsc ? cmp : -cmp
  })

  if (rows.length === 0) {
    return `<div class="empty-state">
      <div class="empty-icon">${ic('clipboard-list')}</div>
      <p>Aún no tienes registros. ¡Completa tu primera sesión!</p>
    </div>`
  }

  return `
    <table class="history-table">
      <thead>
        <tr>
          <th>Músculo</th>
          <th>Ejercicio</th>
          <th>Serie</th>
          <th>Reps</th>
          <th>Peso (kg)</th>
          <th>Sesión</th>
          <th class="sortable" onclick="sortHistory()">
            Fecha & Hora ${_sortAsc ? '↑' : '↓'}
          </th>
        </tr>
      </thead>
      <tbody>
        ${rows.map(r => `
          <tr>
            <td><span class="muscle-badge">${r.muscle}</span></td>
            <td>${r.name}</td>
            <td>${r.serie}</td>
            <td>${r.reps}</td>
            <td><strong>${r.weight}</strong></td>
            <td>${r.sessionId}</td>
            <td class="date-cell">${formatDate(r.date)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `
}

export function filterHistory(term) {
  _searchTerm = term
  const wrapper = document.getElementById('history-table-wrapper')
  if (wrapper) wrapper.innerHTML = buildHistoryTable()
}

export function sortHistory() {
  _sortAsc = !_sortAsc
  const wrapper = document.getElementById('history-table-wrapper')
  if (wrapper) wrapper.innerHTML = buildHistoryTable()
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return d.toLocaleString('es-ES', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })
  } catch { return iso }
}
