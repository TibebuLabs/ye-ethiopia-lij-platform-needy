import { useState, useEffect, useRef } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { generateReport } from '../api/academic'
import { listEnrollments } from '../api/extended'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import {
  FileText, Download, Printer, BarChart2, TrendingUp,
  Users, BookOpen, Award, AlertCircle, ChevronDown,
  Filter, X, GraduationCap, Star, TrendingDown,
  CheckCircle, Clock, User, School, Table2,
} from 'lucide-react'
import type { AcademicReport } from '../types'
import type { Enrollment } from '../api/extended'
import type { GeneratedReport, ChildSummary } from '../api/academic'

const TERMS: { value: string; label: string }[] = [
  { value: '', label: 'All Terms' },
  { value: 'TERM_1', label: 'Term 1' },
  { value: 'TERM_2', label: 'Term 2' },
  { value: 'ANNUAL', label: 'Annual' },
]
const TERM_LABELS: Record<string, string> = {
  TERM_1: 'Term 1', TERM_2: 'Term 2', ANNUAL: 'Annual',
}

function scoreColor(n: number) {
  if (n >= 75) return 'text-green-600'
  if (n >= 50) return 'text-yellow-600'
  return 'text-red-500'
}
function scoreBg(n: number) {
  if (n >= 75) return 'bg-green-100 text-green-700'
  if (n >= 50) return 'bg-yellow-100 text-yellow-700'
  return 'bg-red-100 text-red-600'
}
function scoreBarColor(n: number) {
  if (n >= 75) return 'bg-green-500'
  if (n >= 50) return 'bg-yellow-400'
  return 'bg-red-400'
}
function grade(n: number) {
  if (n >= 90) return 'A+'
  if (n >= 80) return 'A'
  if (n >= 70) return 'B'
  if (n >= 60) return 'C'
  if (n >= 50) return 'D'
  return 'F'
}
function gradeRemark(n: number) {
  if (n >= 90) return 'Excellent'
  if (n >= 80) return 'Very Good'
  if (n >= 70) return 'Good'
  if (n >= 60) return 'Satisfactory'
  if (n >= 50) return 'Pass'
  return 'Needs Improvement'
}

// ── CSV export ────────────────────────────────────────────────────────────────
function exportCSV(records: AcademicReport[], schoolName: string, filename: string) {
  const headers = ['Student Name', 'School', 'Academic Year', 'Term', 'Grade Level', 'Score (%)', 'Grade', 'Remark', 'Attendance (%)', 'Rank', 'Teacher Comments']
  const rows = records.map(r => [
    r.child_name,
    schoolName,
    r.academic_year,
    TERM_LABELS[r.term] ?? r.term,
    r.grade_level,
    r.average_score,
    grade(Number(r.average_score)),
    gradeRemark(Number(r.average_score)),
    r.attendance_rate,
    r.rank ?? '',
    `"${(r.teacher_comments ?? '').replace(/"/g, '""')}"`,
  ])
  const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

// ── Score bar ─────────────────────────────────────────────────────────────────
function ScoreBar({ value, max = 100 }: { value: number; max?: number }) {
  const pct = Math.min(100, (value / max) * 100)
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${scoreBarColor(value)}`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-bold w-10 text-right ${scoreColor(value)}`}>{value}%</span>
    </div>
  )
}

// ── Student report card ───────────────────────────────────────────────────────
function StudentCard({ child, records, rank }: { child: ChildSummary; records: AcademicReport[]; rank: number }) {
  const [expanded, setExpanded] = useState(false)
  const childRecords = records.filter(r => r.child_name === child.child_name)
  const g = grade(child.avg_score)
  const remark = gradeRemark(child.avg_score)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Student header */}
      <div className="flex items-center gap-4 p-5">
        {/* Rank badge */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-sm ${
          rank === 1 ? 'bg-yellow-100 text-yellow-700' :
          rank === 2 ? 'bg-gray-100 text-gray-600' :
          rank === 3 ? 'bg-orange-100 text-orange-600' :
          'bg-green-50 text-green-600'
        }`}>
          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`}
        </div>

        {/* Avatar */}
        <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
          <User size={18} className="text-green-600" />
        </div>

        {/* Name + grade */}
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 truncate">{child.child_name}</p>
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
            <GraduationCap size={11} /> {child.latest_grade}
            <span className="text-gray-200">·</span>
            <FileText size={11} /> {child.report_count} report{child.report_count !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Grade badge */}
        <div className="text-center flex-shrink-0">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black ${scoreBg(child.avg_score)}`}>
            {g}
          </div>
          <p className="text-xs text-gray-400 mt-1">{remark}</p>
        </div>
      </div>

      {/* Score bars */}
      <div className="px-5 pb-4 space-y-2.5">
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Average Score</span>
          </div>
          <ScoreBar value={child.avg_score} />
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Attendance Rate</span>
          </div>
          <ScoreBar value={child.avg_attendance} />
        </div>
      </div>

      {/* Expand toggle */}
      {childRecords.length > 0 && (
        <>
          <button
            onClick={() => setExpanded(e => !e)}
            className="w-full flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <span>Term-by-term breakdown</span>
            <ChevronDown size={14} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>

          {expanded && (
            <div className="border-t border-gray-100">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-2 font-semibold text-gray-500">Year</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-500">Term</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-500">Score</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-500">Attend.</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-500">Rank</th>
                    <th className="text-left px-4 py-2 font-semibold text-gray-500">Comments</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {childRecords.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 text-gray-600">{r.academic_year}</td>
                      <td className="px-4 py-2.5 text-gray-600">{TERM_LABELS[r.term] ?? r.term}</td>
                      <td className="px-4 py-2.5">
                        <span className={`font-bold ${scoreColor(Number(r.average_score))}`}>{r.average_score}%</span>
                        <span className={`ml-1.5 px-1.5 py-0.5 rounded text-xs font-bold ${scoreBg(Number(r.average_score))}`}>
                          {grade(Number(r.average_score))}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-blue-600 font-semibold">{r.attendance_rate}%</td>
                      <td className="px-4 py-2.5 text-gray-500">{r.rank ?? '—'}</td>
                      <td className="px-4 py-2.5 text-gray-400 max-w-[160px] truncate">{r.teacher_comments || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color, sub }: {
  label: string; value: string | number; icon: React.ElementType; color: string; sub?: string
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-xl font-black text-gray-900">{value}</p>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

const PRINT_STYLE = `
@media print {
  body * { visibility: hidden !important; }
  #print-area, #print-area * { visibility: visible !important; }
  #print-area { position: fixed; inset: 0; padding: 32px; background: white; }
  .no-print { display: none !important; }
}
`

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AcademicPerformanceReport() {
  const { user } = useAuth()
  const schoolName = user?.school_profile?.school_name ?? 'School'

  const [childId, setChildId]       = useState('')
  const [academicYear, setAcademicYear] = useState('')
  const [term, setTerm]             = useState('')
  const [reportType, setReportType] = useState<'group' | 'individual'>('group')

  // Data state
  const [result, setResult]         = useState<GeneratedReport | null>(null)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [loading, setLoading]       = useState(false)
  const [generated, setGenerated]   = useState(false)

  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    listEnrollments()
      .then(r => {
        const d = r.data
        const list = Array.isArray(d) ? d : (d as { results: Enrollment[] }).results
        setEnrollments(list.filter(e => e.status === 'ENROLLED'))
      })
      .catch(() => {})
  }, [])

  const handleGenerate = async () => {
    setLoading(true)
    setGenerated(false)
    try {
      const params: Record<string, string> = {}
      if (childId)      params.child_id      = childId
      if (academicYear) params.academic_year = academicYear
      if (term)         params.term          = term
      const res = await generateReport(params)
      setResult(res.data)
      setGenerated(true)
      if (!res.data.summary) toast('No academic data found for the selected criteria', { icon: '📭' })
    } catch {
      toast.error('Failed to generate report')
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    if (!document.getElementById('academic-print-style')) {
      const s = document.createElement('style')
      s.id = 'academic-print-style'
      s.textContent = PRINT_STYLE
      document.head.appendChild(s)
    }
    window.print()
  }

  const handlePrintTable = (mode: 'all' | 'individual') => {
    if (!result?.summary) return
    const filteredChildren = mode === 'individual' && childId
      ? (result.children ?? []).filter(c => c.child_id === childId)
      : (result.children ?? [])
    const filteredRecords = mode === 'individual' && childId
      ? (result.records ?? []).filter(r => filteredChildren.some(c => c.child_name === r.child_name))
      : (result.records ?? [])

    const sorted = [...filteredChildren].sort((a, b) => b.avg_score - a.avg_score)
    const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    const termLabel = term ? (TERM_LABELS[term] ?? term) : 'All Terms'
    const yearLabel = academicYear || 'All Years'

    const gradeOf = (n: number) => n >= 90 ? 'A+' : n >= 80 ? 'A' : n >= 70 ? 'B' : n >= 60 ? 'C' : n >= 50 ? 'D' : 'F'
    const remarkOf = (n: number) => n >= 90 ? 'Excellent' : n >= 80 ? 'Very Good' : n >= 70 ? 'Good' : n >= 60 ? 'Satisfactory' : n >= 50 ? 'Pass' : 'Needs Improvement'
    const scoreCol = (n: number) => n >= 75 ? '#15803d' : n >= 50 ? '#d97706' : '#dc2626'
    const passing = filteredChildren.filter(c => c.avg_score >= 50).length
    const passRate = filteredChildren.length > 0 ? Math.round((passing / filteredChildren.length) * 100) : 0

    const summaryBoxes = [
      { label: 'Students', value: result.summary.total_children },
      { label: 'Avg Score', value: `${result.summary.avg_score}%` },
      { label: 'Top Score', value: `${result.summary.max_score}%` },
      { label: 'Avg Attendance', value: `${result.summary.avg_attendance}%` },
      { label: 'Pass Rate', value: `${passRate}%` },
    ]

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8"/>
  <title>${schoolName} - Academic Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Arial, sans-serif; font-size: 12px; color: #111; background: white; padding: 32px; }
    .header { border-bottom: 3px solid #16a34a; padding-bottom: 14px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: flex-start; }
    .school-name { font-size: 22px; font-weight: 900; color: #15803d; }
    .report-title { font-size: 15px; font-weight: 700; color: #374151; margin-top: 4px; }
    .meta { font-size: 11px; color: #6b7280; margin-top: 3px; }
    .right-meta { text-align: right; font-size: 10px; color: #9ca3af; }
    .confidential { color: #dc2626; font-weight: 700; }
    .summary-row { display: flex; gap: 10px; margin-bottom: 18px; flex-wrap: wrap; }
    .summary-box { border: 1px solid #d1fae5; border-radius: 8px; padding: 8px 14px; background: #f0fdf4; min-width: 80px; }
    .summary-val { font-size: 16px; font-weight: 900; color: #15803d; }
    .summary-lbl { font-size: 10px; color: #6b7280; margin-top: 2px; }
    .section-title { font-size: 13px; font-weight: 700; color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 8px; margin-top: 20px; }
    table { width: 100%; border-collapse: collapse; font-size: 11px; }
    th { padding: 8px 9px; text-align: left; font-weight: 700; font-size: 11px; }
    td { padding: 6px 9px; border-bottom: 1px solid #f3f4f6; }
    .thead-green { background: #15803d; color: white; }
    .thead-dark { background: #374151; color: white; }
    .grade-badge { border-radius: 4px; padding: 2px 6px; color: white; font-weight: 700; font-size: 10px; }
    .footer { margin-top: 28px; padding-top: 10px; border-top: 1px solid #e5e7eb; display: flex; justify-content: space-between; font-size: 10px; color: #9ca3af; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="school-name">${schoolName}</div>
      <div class="report-title">Academic Performance Report${mode === 'individual' && filteredChildren[0] ? ` — ${filteredChildren[0].child_name}` : ''}</div>
      <div class="meta">${yearLabel} · ${termLabel}</div>
    </div>
    <div class="right-meta">
      <div>Generated: ${date}</div>
      <div>Ye Ethiopia Lij Platform</div>
      <div class="confidential">CONFIDENTIAL</div>
    </div>
  </div>

  <div class="summary-row">
    ${summaryBoxes.map(s => `<div class="summary-box"><div class="summary-val">${s.value}</div><div class="summary-lbl">${s.label}</div></div>`).join('')}
  </div>

  <div class="section-title">Student Performance Summary</div>
  <table>
    <thead class="thead-green">
      <tr>
        <th>#</th><th>Student Name</th><th>Grade Level</th><th>Avg Score</th><th>Grade</th><th>Remark</th><th>Avg Attendance</th><th>Reports</th>
      </tr>
    </thead>
    <tbody>
      ${sorted.map((c, i) => `
        <tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'}">
          <td style="color:#9ca3af;font-weight:600">${i + 1}</td>
          <td style="font-weight:700">${c.child_name}</td>
          <td>${c.latest_grade}</td>
          <td style="font-weight:900;color:${scoreCol(c.avg_score)}">${c.avg_score}%</td>
          <td><span class="grade-badge" style="background:${scoreCol(c.avg_score)}">${gradeOf(c.avg_score)}</span></td>
          <td>${remarkOf(c.avg_score)}</td>
          <td style="color:#2563eb;font-weight:600">${c.avg_attendance}%</td>
          <td style="color:#6b7280">${c.report_count}</td>
        </tr>`).join('')}
    </tbody>
  </table>

  <div class="section-title">Detailed Academic Records</div>
  <table>
    <thead class="thead-dark">
      <tr>
        <th>Student</th><th>Year</th><th>Term</th><th>Grade Level</th><th>Score</th><th>Grade</th><th>Attendance</th><th>Rank</th><th>Teacher Comments</th>
      </tr>
    </thead>
    <tbody>
      ${filteredRecords.map((r, i) => {
        const sc = Number(r.average_score)
        return `<tr style="background:${i % 2 === 0 ? '#fff' : '#f9fafb'}">
          <td style="font-weight:600">${r.child_name}</td>
          <td>${r.academic_year}</td>
          <td>${TERM_LABELS[r.term] ?? r.term}</td>
          <td>${r.grade_level}</td>
          <td style="font-weight:700;color:${scoreCol(sc)}">${r.average_score}%</td>
          <td><span class="grade-badge" style="background:${scoreCol(sc)}">${gradeOf(sc)}</span></td>
          <td style="color:#2563eb;font-weight:600">${r.attendance_rate}%</td>
          <td style="color:#6b7280">${r.rank ?? '—'}</td>
          <td style="color:#6b7280;max-width:150px">${r.teacher_comments || '—'}</td>
        </tr>`
      }).join('')}
    </tbody>
  </table>

  <div class="footer">
    <span>${schoolName} · Academic Performance Report · ${date}</span>
    <span>Ye Ethiopia Lij Platform · Confidential</span>
  </div>
  <script>window.onload = () => { window.print(); }</script>
</body>
</html>`

    const win = window.open('', '_blank')
    if (win) { win.document.write(html); win.document.close() }
  }

  const handleExportCSV = () => {
    if (!result?.records?.length) return
    const year = academicYear || 'all'
    const t = term ? `_${term}` : ''
    exportCSV(result.records, schoolName, `${schoolName}_report_${year}${t}.csv`)
    toast.success('CSV downloaded')
  }

  const summary  = result?.summary
  const children: ChildSummary[]  = result?.children ?? []
  const records: AcademicReport[] = result?.records  ?? []
  const topStudent  = [...children].sort((a, b) => b.avg_score - a.avg_score)[0]
  const needsHelp   = children.filter(c => c.avg_score < 50)
  const passing     = children.filter(c => c.avg_score >= 50).length

  return (
    <Layout>
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6 no-print">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <School size={16} className="text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Academic Performance Report</h1>
          </div>
          <p className="text-gray-500 text-sm ml-10">{schoolName} · Student academic records</p>
        </div>
        {generated && summary && (
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleExportCSV}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <Download size={15} /> Export CSV
            </button>
            <button onClick={() => handlePrintTable('all')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-green-300 bg-green-50 text-green-700 text-sm font-semibold hover:bg-green-100 transition-colors">
              <Table2 size={15} /> Print All (Table)
            </button>
            {childId && (
              <button onClick={() => handlePrintTable('individual')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-300 bg-blue-50 text-blue-700 text-sm font-semibold hover:bg-blue-100 transition-colors">
                <Printer size={15} /> Print Individual
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Filter Panel ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6 no-print">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={15} className="text-green-600" />
          <h2 className="text-sm font-bold text-gray-800">Report Filters</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Report Type</label>
            <div className="flex rounded-xl border border-gray-200 overflow-hidden">
              {(['group', 'individual'] as const).map(t => (
                <button key={t} onClick={() => { setReportType(t); if (t === 'group') setChildId('') }}
                  className={`flex-1 py-2 text-xs font-semibold transition-colors ${reportType === t ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'}`}>
                  {t === 'group' ? 'All Students' : 'Individual'}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">
              Student {reportType === 'individual' && <span className="text-red-400">*</span>}
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select value={childId} onChange={e => setChildId(e.target.value)} disabled={reportType === 'group'}
                className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-white disabled:opacity-50 disabled:cursor-not-allowed appearance-none">
                <option value="">All enrolled students</option>
                {enrollments.map(e => <option key={e.id} value={e.child}>{e.child_name}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Academic Year</label>
            <div className="relative">
              <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="e.g. 2016 E.C" value={academicYear}
                onChange={e => setAcademicYear(e.target.value)}
                className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Term</label>
            <div className="relative">
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <select value={term} onChange={e => setTerm(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 bg-white appearance-none">
                {TERMS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <button onClick={handleGenerate} disabled={loading || (reportType === 'individual' && !childId)}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-sm shadow-green-200">
            {loading ? <Spinner size="sm" /> : <BarChart2 size={15} />}
            {loading ? 'Generating...' : 'Generate Report'}
          </button>
          {generated && (
            <button onClick={() => { setResult(null); setGenerated(false) }}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* ── No data ── */}
      {generated && !summary && (
        <div className="bg-white rounded-2xl border border-gray-100 text-center py-16">
          <AlertCircle size={48} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No academic data found</p>
          <p className="text-gray-400 text-sm mt-1">Try different filters or add reports from Academic Status.</p>
        </div>
      )}

      {/* ── Report Output ── */}
      {generated && summary && (
        <div id="print-area" ref={printRef}>
          {/* Print header */}
          <div className="hidden print:block mb-6 pb-4 border-b-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-gray-900">{schoolName}</h1>
                <h2 className="text-lg font-bold text-gray-700 mt-0.5">Academic Performance Report</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Generated: {new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                  {academicYear && ` · Year: ${academicYear}`}
                  {term && ` · ${TERM_LABELS[term]}`}
                </p>
              </div>
              <div className="text-right text-xs text-gray-400">
                <p>Ye Ethiopia Lij Platform</p><p>Confidential</p>
              </div>
            </div>
          </div>

          {/* School banner */}
          <div className="no-print bg-gradient-to-r from-green-700 to-green-500 rounded-2xl p-5 mb-6 text-white flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <School size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">{schoolName}</h2>
              <p className="text-green-100 text-sm">
                {academicYear || 'All Years'}{term && ` · ${TERM_LABELS[term]}`}
                {' · '}{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-3xl font-black">{summary.total_children}</p>
              <p className="text-green-100 text-xs">Students</p>
            </div>
          </div>

          {/* Summary stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            <StatCard label="Students" value={summary.total_children} icon={Users} color="bg-green-600" />
            <StatCard label="Total Reports" value={summary.total_records} icon={FileText} color="bg-blue-500" />
            <StatCard label="Avg Score" value={`${summary.avg_score}%`} icon={TrendingUp} color="bg-purple-500" />
            <StatCard label="Top Score" value={`${summary.max_score}%`} icon={Award} color="bg-yellow-500" />
            <StatCard label="Lowest Score" value={`${summary.min_score}%`} icon={TrendingDown} color="bg-red-400" />
            <StatCard label="Avg Attendance" value={`${summary.avg_attendance}%`} icon={Clock} color="bg-teal-500" />
          </div>

          {/* Insights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle size={15} className="text-green-600" />
                <p className="text-sm font-bold text-gray-800">Pass Rate</p>
              </div>
              <p className="text-3xl font-black text-green-600">
                {summary.total_children > 0 ? Math.round((passing / summary.total_children) * 100) : 0}%
              </p>
              <p className="text-xs text-gray-400 mt-1">{passing} of {summary.total_children} students passing</p>
            </div>
            {topStudent && (
              <div className="bg-yellow-50 rounded-2xl border border-yellow-200 shadow-sm p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Star size={15} className="text-yellow-500 fill-yellow-500" />
                  <p className="text-sm font-bold text-gray-800">Top Student</p>
                </div>
                <p className="font-bold text-gray-900 truncate">{topStudent.child_name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{topStudent.latest_grade} · <span className="font-bold text-green-600">{topStudent.avg_score}%</span></p>
              </div>
            )}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={15} className="text-red-500" />
                <p className="text-sm font-bold text-gray-800">Needs Attention</p>
              </div>
              <p className="text-3xl font-black text-red-500">{needsHelp.length}</p>
              <p className="text-xs text-gray-400 mt-1">
                {needsHelp.length === 0 ? 'All students passing' : needsHelp.map(c => c.child_name).join(', ')}
              </p>
            </div>
          </div>

          {/* Grade distribution */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 size={15} className="text-green-600" />
              <h3 className="text-sm font-bold text-gray-800">Grade Distribution</h3>
            </div>
            <div className="flex items-end gap-3 h-24">
              {['A+','A','B','C','D','F'].map(g => {
                const count = children.filter(c => grade(c.avg_score) === g).length
                const maxCount = Math.max(...children.map(c => 1), 1)
                const allCounts = ['A+','A','B','C','D','F'].map(x => children.filter(c => grade(c.avg_score) === x).length)
                const max = Math.max(...allCounts, 1)
                const heightPct = (count / max) * 100
                const color = g === 'A+' || g === 'A' ? 'bg-green-500' : g === 'B' ? 'bg-blue-400' : g === 'C' ? 'bg-yellow-400' : g === 'D' ? 'bg-orange-400' : 'bg-red-400'
                return (
                  <div key={g} className="flex-1 flex flex-col items-center gap-1">
                    {count > 0 && <span className="text-xs font-bold text-gray-600">{count}</span>}
                    <div className="w-full flex items-end justify-center" style={{ height: '64px' }}>
                      <div className={`w-full rounded-t-lg ${color}`} style={{ height: count > 0 ? `${heightPct}%` : '3px', opacity: count > 0 ? 1 : 0.15 }} />
                    </div>
                    <span className="text-xs font-bold text-gray-500">{g}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Student cards */}
          <div className="flex items-center gap-2 mb-4">
            <GraduationCap size={16} className="text-green-600" />
            <h3 className="text-sm font-bold text-gray-800">Student Performance</h3>
            <span className="text-xs text-gray-400">({children.length} students · ranked by score)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {[...children].sort((a, b) => b.avg_score - a.avg_score).map((c, i) => (
              <StudentCard key={c.child_id} child={c} records={records} rank={i + 1} />
            ))}
          </div>

          {/* Print footer */}
          <div className="hidden print:block mt-8 pt-4 border-t border-gray-200 text-xs text-gray-400 flex items-center justify-between">
            <span>{schoolName} · Academic Performance Report</span>
            <span>Ye Ethiopia Lij Platform · Confidential</span>
          </div>
        </div>
      )}
    </Layout>
  )
}

// intentional trailing newline
