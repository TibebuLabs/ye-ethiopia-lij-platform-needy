import { useEffect, useState, useRef } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { listOrgReports } from '../api/organization'
import { dashboardStats, allSponsorships, listInterventions } from '../api/children'
import { listReports, getGovernmentAcademicSummary } from '../api/academic'
import type { GovernmentAcademicSummary, SchoolStat } from '../api/academic'
import toast from 'react-hot-toast'
import {
  FileText, Download, Printer, Search,
  Users, Heart, Activity, Building2, X,
  GraduationCap, BookOpen, School, Stethoscope
} from 'lucide-react'
import type { OrgReport, AcademicReport, Sponsorship, Intervention } from '../types'

// ── Helpers ───────────────────────────────────────────────────────────────────
const PERIOD_LABELS: Record<string, string> = {
  MONTHLY: 'Monthly', QUARTERLY: 'Quarterly', ANNUAL: 'Annual',
}

function exportCSV(rows: Record<string, string | number>[], filename: string) {
  if (!rows.length) { toast.error('No data to export'); return }
  const headers = Object.keys(rows[0])
  const csv = [
    headers.join(','),
    ...rows.map(r => headers.map(h => `"${String(r[h] ?? '').replace(/"/g, '""')}"`).join(',')),
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename; a.click()
  URL.revokeObjectURL(url)
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, color }: {
  label: string; value: number | string; icon: typeof Users; color: string
}) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={22} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value ?? '—'}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  )
}

// ── Org Report Modal ──────────────────────────────────────────────────────────
function OrgReportModal({ report, onClose }: { report: OrgReport; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const handlePrint = () => {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`<html><head><title>${report.title}</title>
      <style>body{font-family:sans-serif;padding:32px;color:#111}p{margin:4px 0}
      .label{font-size:11px;color:#888;text-transform:uppercase}</style></head>
      <body>${ref.current?.innerHTML ?? ''}</body></html>`)
    win.document.close(); win.print()
  }
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slideIn" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-semibold text-gray-800">{report.title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
        </div>
        <div ref={ref} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {[
              ['Period', PERIOD_LABELS[report.period ?? report.report_period ?? ''] ?? report.period],
              ['Report Date', report.report_date],
              ['Status', report.status],
              ['Submitted', new Date(report.created_at).toLocaleDateString()],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="text-xs text-gray-400 uppercase tracking-wide">{l}</p>
                <p className="text-sm font-medium text-gray-700 mt-0.5">{v}</p>
              </div>
            ))}
          </div>
          {report.summary && (
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">Summary</p>
              <p className="text-sm text-gray-600 leading-relaxed">{report.summary}</p>
            </div>
          )}
        </div>
        <div className="flex gap-3 p-5 border-t border-gray-100">
          <button onClick={handlePrint} className="flex-1 flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm font-medium py-2 rounded-xl transition-colors">
            <Printer size={15} /> Print / PDF
          </button>
          <button
            onClick={() => exportCSV([{ Title: report.title, Period: report.period ?? '', Date: report.report_date, Status: report.status, Summary: report.summary ?? '' }], `org_report_${report.id}.csv`)}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-xl transition-colors"
          >
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Tabs ──────────────────────────────────────────────────────────────────────
type Tab = 'org' | 'school' | 'sponsor' | 'intervention'

const TABS: { key: Tab; label: string; icon: typeof FileText }[] = [
  { key: 'org',          label: 'Organization Reports', icon: Building2     },
  { key: 'school',       label: 'School / Academic',    icon: GraduationCap },
  { key: 'sponsor',      label: 'Sponsorship',          icon: Heart         },
  { key: 'intervention', label: 'Interventions',        icon: Stethoscope   },
]

const INTERVENTION_TYPE_LABELS: Record<string, string> = {
  HEALTH: 'Healthcare', EDUCATION: 'Education',
  NUTRITION: 'Nutrition', CLOTHING: 'Clothing/Shelter',
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function GovernmentReports() {
  const [tab, setTab] = useState<Tab>('org')
  const [stats, setStats] = useState<Record<string, number>>({})

  // Org reports
  const [orgReports, setOrgReports] = useState<OrgReport[]>([])
  const [orgLoading, setOrgLoading] = useState(true)
  const [orgSearch, setOrgSearch] = useState('')
  const [orgPeriod, setOrgPeriod] = useState('')
  const [selectedOrg, setSelectedOrg] = useState<OrgReport | null>(null)

  // Academic
  const [academicSummary, setAcademicSummary] = useState<GovernmentAcademicSummary | null>(null)
  const [academicReports, setAcademicReports] = useState<AcademicReport[]>([])
  const [academicLoading, setAcademicLoading] = useState(true)
  const [academicSearch, setAcademicSearch] = useState('')

  // Sponsorships
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([])
  const [sponsorLoading, setSponsorLoading] = useState(true)
  const [sponsorSearch, setSponsorSearch] = useState('')

  // Interventions
  const [interventions, setInterventions] = useState<Intervention[]>([])
  const [interventionLoading, setInterventionLoading] = useState(true)
  const [interventionSearch, setInterventionSearch] = useState('')
  const [interventionType, setInterventionType] = useState('')

  useEffect(() => {
    dashboardStats().then(r => setStats(r.data as Record<string, number>)).catch(() => {})

    listOrgReports({ status: 'REVIEWED' })
      .then(r => {
        const d = r.data
        const list: OrgReport[] = Array.isArray(d) ? d : d.results
        list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setOrgReports(list)
      })
      .catch(() => toast.error('Failed to load organization reports'))
      .finally(() => setOrgLoading(false))

    Promise.all([getGovernmentAcademicSummary(), listReports()])
      .then(([sumRes, repRes]) => {
        setAcademicSummary(sumRes.data)
        const d = repRes.data
        const list: AcademicReport[] = Array.isArray(d) ? d : d.results
        list.sort((a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime())
        setAcademicReports(list)
      }).catch(() => toast.error('Failed to load academic reports'))
      .finally(() => setAcademicLoading(false))

    allSponsorships()
      .then(r => {
        const d = r.data
        const list: Sponsorship[] = Array.isArray(d) ? d : (d as { results: Sponsorship[] }).results
        list.sort((a, b) => new Date(b.created_at ?? b.start_date ?? 0).getTime() - new Date(a.created_at ?? a.start_date ?? 0).getTime())
        setSponsorships(list)
      })
      .catch(() => toast.error('Failed to load sponsorship data'))
      .finally(() => setSponsorLoading(false))

    listInterventions()
      .then(r => {
        const d = r.data
        const list: Intervention[] = Array.isArray(d) ? d : (d as { results: Intervention[] }).results
        list.sort((a, b) => new Date(b.date_provided ?? 0).getTime() - new Date(a.date_provided ?? 0).getTime())
        setInterventions(list)
      })
      .catch(() => toast.error('Failed to load interventions'))
      .finally(() => setInterventionLoading(false))
  }, [])

  const filteredOrg = orgReports.filter(r => {
    if (orgPeriod && (r.period ?? r.report_period) !== orgPeriod) return false
    if (orgSearch) {
      const q = orgSearch.toLowerCase()
      return r.title.toLowerCase().includes(q) || (r.summary ?? '').toLowerCase().includes(q)
    }
    return true
  })

  const filteredAcademic = academicReports.filter(r => {
    if (!academicSearch) return true
    const q = academicSearch.toLowerCase()
    return r.child_name?.toLowerCase().includes(q) || r.school_name?.toLowerCase().includes(q)
  })

  const filteredSponsorships = sponsorships.filter(s => {
    if (!sponsorSearch) return true
    const q = sponsorSearch.toLowerCase()
    return s.child_name?.toLowerCase().includes(q) || s.sponsor_name?.toLowerCase().includes(q)
  })

  const filteredInterventions = interventions.filter(i => {
    if (interventionType && i.type !== interventionType) return false
    if (interventionSearch) {
      const q = interventionSearch.toLowerCase()
      return (i.child_name ?? '').toLowerCase().includes(q) || i.description.toLowerCase().includes(q)
    }
    return true
  })

  const statCards = [
    { label: 'Total Children',   value: stats.total_children ?? '—',     icon: Users,     color: 'bg-green-500'  },
    { label: 'Sponsorships',     value: sponsorships.length || '—',       icon: Heart,     color: 'bg-blue-500'   },
    { label: 'Interventions',    value: interventions.length || '—',      icon: Activity,  color: 'bg-purple-500' },
    { label: 'Organizations',    value: stats.organizations ?? '—',       icon: Building2, color: 'bg-orange-500' },
  ]

  const handleExport = () => {
    if (tab === 'org')
      exportCSV(filteredOrg.map(r => ({ Title: r.title, Period: r.period ?? '', Date: r.report_date, Status: r.status, Summary: r.summary ?? '' })), 'org_reports.csv')
    else if (tab === 'school')
      exportCSV(filteredAcademic.map(r => ({ Child: r.child_name, School: r.school_name, Year: r.academic_year, Term: r.term, Score: r.average_score, Attendance: r.attendance_rate, Grade: r.grade_level })), 'academic_reports.csv')
    else if (tab === 'sponsor')
      exportCSV(filteredSponsorships.map(s => ({ Child: s.child_name, Sponsor: s.sponsor_name, Amount: s.commitment_amount, Active: s.is_active ? 'Yes' : 'No', Start: s.start_date })), 'sponsorships.csv')
    else
      exportCSV(filteredInterventions.map(i => ({ Child: i.child_name ?? '', Type: i.type, Description: i.description, Date: i.date_provided })), 'interventions.csv')
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Government Reporting Dashboard</h1>
          <p className="text-gray-500 text-sm">Summarized child welfare reports from all institutions</p>
        </div>
        <button onClick={handleExport} className="btn-primary flex items-center gap-2">
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statCards.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              tab === key ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-700'
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* ── ORG REPORTS TAB ── */}
      {tab === 'org' && (
        <>
          <div className="card mb-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="input-field pl-9" placeholder="Search reports..." value={orgSearch} onChange={e => setOrgSearch(e.target.value)} />
            </div>
            <select className="input-field sm:w-36" value={orgPeriod} onChange={e => setOrgPeriod(e.target.value)}>
              <option value="">All Periods</option>
              <option value="MONTHLY">Monthly</option>
              <option value="QUARTERLY">Quarterly</option>
              <option value="ANNUAL">Annual</option>
            </select>
          </div>
          {orgLoading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            : filteredOrg.length === 0 ? (
              <div className="card text-center py-16">
                <FileText size={44} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No organization reports available</p>
                <p className="text-gray-400 text-sm mt-1">Reports appear here once reviewed by the admin.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrg.map(r => (
                  <div key={r.id} onClick={() => setSelectedOrg(r)}
                    className="card cursor-pointer flex items-start gap-4 hover:shadow-md hover:border-green-200 transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0 group-hover:bg-green-200 transition-colors">
                      <Building2 size={18} className="text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold text-gray-800">{r.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{PERIOD_LABELS[r.period ?? r.report_period ?? ''] ?? r.period} · {r.report_date}</p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium flex-shrink-0">{r.status}</span>
                      </div>
                      {r.summary && <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{r.summary}</p>}
                    </div>
                    <button onClick={e => { e.stopPropagation(); exportCSV([{ Title: r.title, Period: r.period ?? '', Date: r.report_date, Status: r.status, Summary: r.summary ?? '' }], `report_${r.id}.csv`) }}
                      className="p-1.5 rounded-lg hover:bg-green-50 text-green-600 transition-colors flex-shrink-0" title="Export">
                      <Download size={15} />
                    </button>
                  </div>
                ))}
              </div>
            )}
        </>
      )}

      {/* ── SCHOOL / ACADEMIC TAB ── */}
      {tab === 'school' && (
        <>
          {academicSummary && (
            <div className="grid grid-cols-3 gap-4 mb-5">
              <div className="card text-center">
                <p className="text-2xl font-bold text-gray-900">{academicSummary.overall.total_reports}</p>
                <p className="text-sm text-gray-500 mt-0.5">Total Reports</p>
              </div>
              <div className="card text-center">
                <p className="text-2xl font-bold text-green-600">{academicSummary.overall.avg_score}%</p>
                <p className="text-sm text-gray-500 mt-0.5">Avg Score</p>
              </div>
              <div className="card text-center">
                <p className="text-2xl font-bold text-blue-600">{academicSummary.overall.avg_attendance}%</p>
                <p className="text-sm text-gray-500 mt-0.5">Avg Attendance</p>
              </div>
            </div>
          )}
          {academicSummary && academicSummary.by_school.length > 0 && (
            <div className="card mb-5 p-0 overflow-hidden">
              <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <School size={15} className="text-green-600" />
                <p className="text-sm font-semibold text-gray-700">Performance by School</p>
              </div>
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-5 py-2.5 font-medium text-gray-600">School</th>
                    <th className="text-left px-5 py-2.5 font-medium text-gray-600">Reports</th>
                    <th className="text-left px-5 py-2.5 font-medium text-gray-600">Avg Score</th>
                    <th className="text-left px-5 py-2.5 font-medium text-gray-600">Avg Attendance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {academicSummary.by_school.map((s: SchoolStat) => (
                    <tr key={s.school_name} className="hover:bg-gray-50">
                      <td className="px-5 py-2.5 font-medium text-gray-800">{s.school_name}</td>
                      <td className="px-5 py-2.5 text-gray-500">{s.report_count}</td>
                      <td className="px-5 py-2.5">
                        <span className={`font-semibold ${Number(s.avg_score) >= 70 ? 'text-green-600' : Number(s.avg_score) >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                          {s.avg_score}%
                        </span>
                      </td>
                      <td className="px-5 py-2.5 text-blue-600 font-medium">{s.avg_attendance}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="input-field pl-9" placeholder="Search by child or school name..." value={academicSearch} onChange={e => setAcademicSearch(e.target.value)} />
          </div>
          {academicLoading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            : filteredAcademic.length === 0 ? (
              <div className="card text-center py-16">
                <BookOpen size={44} className="text-gray-200 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">No academic reports found</p>
              </div>
            ) : (
              <div className="card p-0 overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-5 py-3 font-medium text-gray-600">Child</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-600 hidden sm:table-cell">School</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-600">Year / Term</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-600">Score</th>
                      <th className="text-left px-5 py-3 font-medium text-gray-600 hidden md:table-cell">Attendance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredAcademic.map(r => (
                      <tr key={r.id} className="hover:bg-gray-50">
                        <td className="px-5 py-3">
                          <p className="font-medium text-gray-800">{r.child_name}</p>
                          <p className="text-xs text-gray-400">{r.grade_level}</p>
                        </td>
                        <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{r.school_name}</td>
                        <td className="px-5 py-3 text-gray-500">{r.academic_year} · {r.term?.replace('_', ' ')}</td>
                        <td className="px-5 py-3">
                          <span className={`font-semibold ${Number(r.average_score) >= 70 ? 'text-green-600' : Number(r.average_score) >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>
                            {r.average_score}%
                          </span>
                        </td>
                        <td className="px-5 py-3 text-blue-600 font-medium hidden md:table-cell">{r.attendance_rate}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
        </>
      )}

      {/* ── SPONSORSHIP TAB ── */}
      {tab === 'sponsor' && (
        <>
          {sponsorLoading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-5">
                  <div className="card text-center">
                    <p className="text-2xl font-bold text-gray-900">{sponsorships.length}</p>
                    <p className="text-sm text-gray-500 mt-0.5">Total Sponsorships</p>
                  </div>
                  <div className="card text-center">
                    <p className="text-2xl font-bold text-green-600">{sponsorships.filter(s => s.is_active).length}</p>
                    <p className="text-sm text-gray-500 mt-0.5">Active</p>
                  </div>
                  <div className="card text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {sponsorships.reduce((sum, s) => sum + Number(s.commitment_amount), 0).toLocaleString()} ETB
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">Total Commitment</p>
                  </div>
                </div>
                <div className="relative mb-4">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input className="input-field pl-9" placeholder="Search by child or sponsor name..." value={sponsorSearch} onChange={e => setSponsorSearch(e.target.value)} />
                </div>
                {filteredSponsorships.length === 0 ? (
                  <div className="card text-center py-16">
                    <Heart size={44} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No sponsorship records found</p>
                  </div>
                ) : (
                  <div className="card p-0 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="text-left px-5 py-3 font-medium text-gray-600">Child</th>
                          <th className="text-left px-5 py-3 font-medium text-gray-600 hidden sm:table-cell">Sponsor</th>
                          <th className="text-left px-5 py-3 font-medium text-gray-600">Amount / mo</th>
                          <th className="text-left px-5 py-3 font-medium text-gray-600">Status</th>
                          <th className="text-left px-5 py-3 font-medium text-gray-600 hidden md:table-cell">Start Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredSponsorships.map(s => (
                          <tr key={s.id} className="hover:bg-gray-50">
                            <td className="px-5 py-3 font-medium text-gray-800">{s.child_name}</td>
                            <td className="px-5 py-3 text-gray-500 hidden sm:table-cell">{s.sponsor_name}</td>
                            <td className="px-5 py-3 text-green-600 font-semibold">ETB {Number(s.commitment_amount).toLocaleString()}</td>
                            <td className="px-5 py-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                {s.is_active ? 'Active' : 'Ended'}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-gray-400 text-xs hidden md:table-cell">{s.start_date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
        </>
      )}

      {/* ── INTERVENTIONS TAB ── */}
      {tab === 'intervention' && (
        <>
          {interventionLoading ? <div className="flex justify-center py-16"><Spinner size="lg" /></div>
            : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
                  {(['HEALTH', 'EDUCATION', 'NUTRITION', 'CLOTHING'] as const).map(type => (
                    <div key={type} className="card text-center">
                      <p className="text-2xl font-bold text-gray-900">
                        {interventions.filter(i => i.type === type).length}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">{INTERVENTION_TYPE_LABELS[type]}</p>
                    </div>
                  ))}
                </div>
                <div className="card mb-4 flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input className="input-field pl-9" placeholder="Search by child or description..." value={interventionSearch} onChange={e => setInterventionSearch(e.target.value)} />
                  </div>
                  <select className="input-field sm:w-44" value={interventionType} onChange={e => setInterventionType(e.target.value)}>
                    <option value="">All Types</option>
                    {Object.entries(INTERVENTION_TYPE_LABELS).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                </div>
                {filteredInterventions.length === 0 ? (
                  <div className="card text-center py-16">
                    <Stethoscope size={44} className="text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No interventions found</p>
                  </div>
                ) : (
                  <div className="card p-0 overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                          <th className="text-left px-5 py-3 font-medium text-gray-600">Child</th>
                          <th className="text-left px-5 py-3 font-medium text-gray-600">Type</th>
                          <th className="text-left px-5 py-3 font-medium text-gray-600 hidden sm:table-cell">Description</th>
                          <th className="text-left px-5 py-3 font-medium text-gray-600">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredInterventions.map(i => (
                          <tr key={i.id} className="hover:bg-gray-50">
                            <td className="px-5 py-3 font-medium text-gray-800">{i.child_name ?? '—'}</td>
                            <td className="px-5 py-3">
                              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                i.type === 'HEALTH' ? 'bg-red-100 text-red-700' :
                                i.type === 'EDUCATION' ? 'bg-blue-100 text-blue-700' :
                                i.type === 'NUTRITION' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-purple-100 text-purple-700'
                              }`}>
                                {INTERVENTION_TYPE_LABELS[i.type] ?? i.type}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-gray-500 hidden sm:table-cell max-w-xs truncate">{i.description}</td>
                            <td className="px-5 py-3 text-gray-400 text-xs">{i.date_provided}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
        </>
      )}

      {selectedOrg && <OrgReportModal report={selectedOrg} onClose={() => setSelectedOrg(null)} />}
    </Layout>
  )
}
