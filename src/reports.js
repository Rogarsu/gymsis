// ─────────────────────────────────────────────────────────────
// reports.js — Generación de reportes PDF (via ventana de impresión)
// ─────────────────────────────────────────────────────────────
import { getAllExLogs, getLogs } from './storage.js'
import { getAllSessions } from './planner.js'
import { ic, refreshIcons } from './icons.js'

let _plan = null

export function initReports(plan) {
  _plan = plan
}

export function renderReports() {
  const view = document.getElementById('view-reportes')
  if (!view) return

  view.innerHTML = `
    <div class="module-header">
      <h2 class="module-title">${ic('file-text')} Reportes</h2>
      <p class="module-subtitle">Descarga tus datos en PDF para compartir con un entrenador o llevar un registro.</p>
    </div>

    <div class="reports-grid">
      <div class="report-card">
        <div class="report-card-icon">${ic('clipboard-list')}</div>
        <div class="report-card-info">
          <h3>Plan de Entrenamiento Completo</h3>
          <p>Todas las sesiones organizadas por fase, con ejercicios, series, reps, descanso, guía de peso y notas técnicas.</p>
        </div>
        <button class="btn btn-primary" onclick="downloadPlanPDF()">${ic('download')} Descargar PDF</button>
      </div>

      <div class="report-card">
        <div class="report-card-icon">${ic('bar-chart-2')}</div>
        <div class="report-card-info">
          <h3>Historial de Pesos</h3>
          <p>Progresión cronológica de todos tus ejercicios con indicadores de progreso y mejor marca.</p>
        </div>
        <button class="btn btn-primary" onclick="downloadHistorialPDF()">${ic('download')} Descargar PDF</button>
      </div>
    </div>

    <div class="report-instructions">
      <h3>${ic('book-open')} Cómo descargar</h3>
      <ol>
        <li>Toca el botón "Descargar PDF"</li>
        <li>Se abrirá una nueva ventana con el contenido formateado</li>
        <li>Usa <strong>Ctrl+P</strong> (PC) o <strong>Cmd+P</strong> (Mac) para imprimir</li>
        <li>En "Destino" selecciona <strong>"Guardar como PDF"</strong></li>
        <li>En móvil: toca el ícono compartir → "Imprimir" → "Guardar como PDF"</li>
      </ol>
    </div>
  `
  refreshIcons()
}

// ── PDF Plan de entrenamiento ─────────────────────────────────
export function downloadPlanPDF() {
  if (!_plan) { alert('No hay plan disponible'); return }

  const html = buildPlanHTML(_plan)
  openPrintWindow('Plan de Entrenamiento — SistemaVida', html)
}

// Tablas de etiquetas para el perfil del onboarding
const LABEL_MAPS = {
  sex:             { male: 'Hombre', female: 'Mujer', other: 'Prefiero no responder' },
  objectives:      { strength: 'Ganar fuerza', muscle: 'Ganar músculo', fat_loss: 'Perder grasa', recomp: 'Recomposición', endurance: 'Resistencia', general: 'General' },
  level:           { beginner: 'Principiante', intermediate: 'Intermedio', advanced: 'Avanzado' },
  bodyComposition: { lean: 'Delgado/a', normal: 'Normal', overweight: 'Sobrepeso', muscular: 'Musculoso/a' },
  sleep:           { good: 'Bueno (7–9 h)', moderate: 'Regular (5–7 h)', poor: 'Malo (<5 h)' },
  stress:          { low: 'Bajo', moderate: 'Moderado', high: 'Alto' },
  job:             { sedentary: 'Sedentario', moderate: 'Mixto', active: 'Activo' },
  limitations:     { knees: 'Rodillas', back: 'Espalda', shoulders: 'Hombros', hips: 'Cadera' },
  environment:     { gym: 'Gimnasio', home: 'Casa con equipo', none: 'Sin equipamiento' },
  split:           { ppl: 'Push/Pull/Legs', fullbody: 'Full Body', upper_lower: 'Upper/Lower', upper: 'Upper Only', lower: 'Lower Only' },
  methodId:        { linear_progression: 'Progresión Lineal', pure_strength: 'Fuerza Pura', hypertrophy: 'Hipertrofia', dup: 'DUP (Periodización Ondulante)', fat_loss: 'Pérdida de Grasa', recomp: 'Recomposición' }
}

function label(map, val) {
  if (!val) return '—'
  if (Array.isArray(val)) return val.map(v => LABEL_MAPS[map]?.[v] || v).join(', ') || '—'
  return LABEL_MAPS[map]?.[val] || val
}

function buildProfileSection(meta) {
  const rows = [
    ['Sexo',               label('sex',             meta.sex)],
    ['Objetivo',           label('objectives',       meta.objectives)],
    ['Nivel',              label('level',            meta.level)],
    ['Composición corporal', label('bodyComposition', meta.bodyComposition)],
    ['Sueño',              label('sleep',            meta.sleep)],
    ['Estrés',             label('stress',           meta.stress)],
    ['Tipo de trabajo',    label('job',              meta.job)],
    ['Edad',               meta.age || '—'],
    ['Limitaciones físicas', meta.limitations?.length ? label('limitations', meta.limitations) : 'Ninguna'],
    ['Entorno',            label('environment',      meta.environment)],
    ['Días por semana',    meta.daysPerWeek ? `${meta.daysPerWeek} días` : '—'],
    ['Duración por sesión',meta.duration   ? `${meta.duration} min`     : '—'],
    ['División',           label('split',            meta.split)],
    ['Duración del plan',  meta.planWeeks  ? `${meta.planWeeks} semanas (${meta.totalSessions} sesiones)` : '—'],
    ['Método de entrenamiento', label('methodId',   meta.methodId)],
  ]

  return `
    <div class="pdf-profile">
      <h2 class="pdf-profile-title">Perfil del Atleta</h2>
      <p class="pdf-profile-subtitle">Respuestas del cuestionario inicial — contexto para el coach</p>
      <table class="pdf-profile-table">
        <tbody>
          ${rows.map(([k, v]) => `
            <tr>
              <td class="pdf-profile-key">${k}</td>
              <td class="pdf-profile-val">${v}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `
}

function buildPlanHTML(plan) {
  const meta = plan.meta || {}

  const phaseHTML = plan.phases.map(phase => `
    <div class="pdf-phase">
      <h2 class="pdf-phase-title">${phase.name} ${phase.isDeload ? '(Deload)' : ''}</h2>
      <p class="pdf-phase-meta">${phase.weeks} semana(s) · ${phase.sessions.length} sesiones</p>

      ${phase.sessions.map(session => `
        <div class="pdf-session">
          <h3 class="pdf-session-title">Sesión ${session.number} — ${session.name}</h3>
          <table class="pdf-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Ejercicio</th>
                <th>Músculo</th>
                <th>Series</th>
                <th>Reps</th>
                <th>Descanso</th>
                <th>Guía de peso</th>
                <th>Notas</th>
              </tr>
            </thead>
            <tbody>
              ${session.exercises.map((ex, i) => `
                <tr>
                  <td>${i + 1}</td>
                  <td><strong>${ex.name}</strong></td>
                  <td>${ex.muscle}</td>
                  <td>${ex.sets}</td>
                  <td>${ex.reps}</td>
                  <td>${ex.rest}</td>
                  <td>${ex.weightGuide}</td>
                  <td>${ex.notes || '—'}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `).join('')}
    </div>
  `).join('')

  return `
    <div class="pdf-header">
      <h1>SistemaVida — Plan de Entrenamiento</h1>
      <p class="pdf-header-date">Generado el ${meta.createdAt || '—'}</p>
    </div>
    ${buildProfileSection(meta)}
    ${phaseHTML}
  `
}

// ── PDF Historial de pesos ────────────────────────────────────
export function downloadHistorialPDF() {
  const exLogs = getAllExLogs()
  if (exLogs.length === 0) { alert('No tienes registros aún'); return }

  const html = buildHistorialHTML(exLogs)
  openPrintWindow('Historial de Pesos — SistemaVida', html)
}

function buildHistorialHTML(exLogs) {
  // Agrupar por músculo y ejercicio
  const byMuscle = {}
  exLogs.forEach(log => {
    const muscle = log.muscle || 'Sin clasificar'
    if (!byMuscle[muscle]) byMuscle[muscle] = {}
    const name = log.name || log.exId
    if (!byMuscle[muscle][name]) byMuscle[muscle][name] = []
    byMuscle[muscle][name].push(log)
  })

  const muscleHTML = Object.entries(byMuscle).map(([muscle, exercises]) => `
    <div class="pdf-muscle-group">
      <h2 class="pdf-muscle-title">${muscle}</h2>
      ${Object.entries(exercises).map(([exName, logs]) => {
        const sorted = [...logs].sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt))
        const maxWeights = sorted.map(log => Math.max(...(log.sets || []).map(s => s.weight || 0)))
        const allTimeMax = Math.max(...maxWeights)

        return `
          <div class="pdf-exercise-group">
            <h3 class="pdf-ex-title">${exName}</h3>
            <table class="pdf-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Sesión</th>
                  <th>Series (kg × reps)</th>
                  <th>Volumen total</th>
                  <th>Progreso</th>
                </tr>
              </thead>
              <tbody>
                ${sorted.map((log, idx) => {
                  const sets = log.sets || []
                  const maxW = Math.max(...sets.map(s => s.weight || 0))
                  const volume = sets.reduce((s, set) => s + (set.weight || 0) * (set.reps || 0), 0)
                  const prev  = idx > 0 ? Math.max(...(sorted[idx-1].sets || []).map(s => s.weight||0)) : null
                  const delta = prev !== null ? maxW - prev : null
                  const isMax = maxW === allTimeMax && maxW > 0

                  return `
                    <tr class="${isMax ? 'pdf-best-row' : ''}">
                      <td>${formatDate(log.completedAt)}</td>
                      <td>${log.sessionId || '—'}</td>
                      <td>${sets.map(s => `${s.weight}×${s.reps}`).join(' | ')}</td>
                      <td>${volume.toFixed(0)} kg</td>
                      <td>${delta !== null ? (delta >= 0 ? `↑ +${delta}kg` : `↓ ${delta}kg`) : '—'} ${isMax ? '🏆' : ''}</td>
                    </tr>
                  `
                }).join('')}
              </tbody>
            </table>
          </div>
        `
      }).join('')}
    </div>
  `).join('')

  return `
    <div class="pdf-header">
      <h1>🏋️ SistemaVida — Historial de Pesos</h1>
      <p>Generado el ${new Date().toLocaleDateString('es-ES', { day:'2-digit', month:'long', year:'numeric' })}</p>
    </div>
    ${muscleHTML}
  `
}

// ── Ventana de impresión ──────────────────────────────────────
function openPrintWindow(title, content) {
  const win = window.open('', '_blank')
  if (!win) { alert('Permite las ventanas emergentes para descargar el PDF'); return }

  win.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>${title}</title>
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Helvetica Neue', Arial, sans-serif; font-size: 11px; color: #1a1a2e; padding: 20px; }
        h1 { font-size: 20px; color: #7c3aed; margin-bottom: 8px; }
        h2 { font-size: 15px; color: #4a0080; margin: 20px 0 8px; border-bottom: 2px solid #7c3aed; padding-bottom: 4px; }
        h3 { font-size: 13px; color: #333; margin: 14px 0 6px; }
        .pdf-header { margin-bottom: 20px; padding-bottom: 12px; border-bottom: 3px solid #7c3aed; }
        .pdf-header-date { font-size: 10px; color: #666; margin-top: 4px; }
        .pdf-profile { margin-bottom: 24px; padding: 14px 16px; background: #faf9ff; border: 1px solid #d4c8f5; border-radius: 6px; page-break-inside: avoid; }
        .pdf-profile-title { font-size: 15px; color: #7c3aed; margin-bottom: 2px; border-bottom: none; }
        .pdf-profile-subtitle { font-size: 10px; color: #888; margin-bottom: 10px; }
        .pdf-profile-table { width: 100%; border-collapse: collapse; }
        .pdf-profile-table tr:nth-child(even) td { background: #f0ebff; }
        .pdf-profile-key { padding: 4px 10px 4px 0; font-weight: 600; color: #4a0080; width: 42%; font-size: 10px; vertical-align: top; }
        .pdf-profile-val { padding: 4px 0; color: #1a1a2e; font-size: 10px; }
        .pdf-phase { margin-bottom: 24px; }
        .pdf-phase-title { font-size: 16px; color: #7c3aed; margin-bottom: 4px; }
        .pdf-phase-meta { font-size: 10px; color: #666; margin-bottom: 10px; }
        .pdf-session { margin-bottom: 16px; page-break-inside: avoid; }
        .pdf-session-title { font-size: 13px; background: #f3f0ff; padding: 6px 10px; border-radius: 4px; margin-bottom: 6px; }
        .pdf-table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
        .pdf-table th { background: #7c3aed; color: white; padding: 5px 6px; text-align: left; font-size: 10px; }
        .pdf-table td { padding: 4px 6px; border-bottom: 1px solid #e0e0e0; font-size: 10px; }
        .pdf-table tr:nth-child(even) td { background: #faf9ff; }
        .pdf-best-row td { background: #f0fff4 !important; font-weight: bold; }
        .pdf-muscle-group { margin-bottom: 20px; }
        .pdf-muscle-title { font-size: 16px; }
        .pdf-exercise-group { margin-bottom: 14px; }
        .pdf-ex-title { font-size: 12px; color: #7c3aed; margin-bottom: 4px; }
        @media print {
          body { padding: 10px; }
          .pdf-phase, .pdf-session { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      ${content}
      <script>setTimeout(() => window.print(), 600)</script>
    </body>
    </html>
  `)
  win.document.close()
}

function formatDate(iso) {
  if (!iso) return '—'
  try {
    return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch { return iso }
}
