import api from './axios'
import type { AxiosResponse } from 'axios'
import type { ProgramMetrics, PaginatedResponse } from '../types'

// ── Generic record types ──────────────────────────────────────────────────────
export interface Enrollment {
  id: string
  child: string
  child_name: string
  school: string
  school_name: string
  enrollment_date: string
  grade_level: string
  status: string
  enrollment_number: string
  class_section: string
  created_at: string
}

export interface SponsorshipPayment {
  id: string
  sponsorship: string
  sponsor_name: string
  child_name: string
  amount: string
  payment_date: string
  status: string
  payment_method: string
  transaction_id: string | null
  notes: string
  created_at: string
}

export interface ProgressReport {
  id: string
  child: string
  child_name: string
  academic_progress: string
  attendance_progress: string
  behavior_progress: string
  overall_progress: string
  summary: string
  recommendations: string
  reported_by: string
  reported_by_name: string
  report_date: string
  created_at: string
}

export interface DuplicationAlert {
  id: string
  primary_child: string
  primary_child_name: string
  duplicate_child: string
  duplicate_child_name: string
  similarity_score: number
  matching_fields: Record<string, unknown>
  status: string
  resolved_by: string | null
  resolution_notes: string
  created_at: string
  resolved_at: string | null
}

export interface FinancialDocument {
  id: string
  sponsorship: string
  child_name: string
  document_type: string
  document_file: string
  document_date: string
  status: string
  reviewed_by: string | null
  review_notes: string
  amount: string | null
  description: string
  created_at: string
}

type ListResponse<T> = Promise<AxiosResponse<PaginatedResponse<T> | T[]>>

// Enrollments
export const listEnrollments = (params?: Record<string, string>): ListResponse<Enrollment> =>
  api.get('/childs/enrollments/', { params })

export const createEnrollment = (data: Partial<Enrollment>): Promise<AxiosResponse<Enrollment>> =>
  api.post('/childs/enrollments/', data)

export const activeEnrollments = (): ListResponse<Enrollment> =>
  api.get('/childs/enrollments/active_enrollments/')

export const approvedChildrenForEnrollment = (search?: string): Promise<AxiosResponse<import('../types').ChildProfile[]>> =>
  api.get('/childs/enrollments/approved_children/', { params: search ? { search } : {} })

export const updateEnrollment = (id: string, data: Partial<Enrollment>): Promise<AxiosResponse<Enrollment>> =>
  api.patch(`/childs/enrollments/${id}/`, data)

// Payments
export const listPayments = (params?: Record<string, string>): ListResponse<SponsorshipPayment> =>
  api.get('/childs/payments/', { params })

export const createPayment = (data: Partial<SponsorshipPayment>): Promise<AxiosResponse<SponsorshipPayment>> =>
  api.post('/childs/payments/', data)

export const paymentSummary = (sponsorshipId: string): Promise<AxiosResponse<{ total_paid: number; pending: number; payment_count: number; completed_count: number }>> =>
  api.get('/childs/payments/payment_summary/', { params: { sponsorship_id: sponsorshipId } })

// Progress Reports
export const listProgressReports = (params?: Record<string, string>): ListResponse<ProgressReport> =>
  api.get('/childs/progress-reports/', { params })

export const createProgressReport = (data: Partial<ProgressReport>): Promise<AxiosResponse<ProgressReport>> =>
  api.post('/childs/progress-reports/', data)

export const childProgress = (childId: string): ListResponse<ProgressReport> =>
  api.get('/childs/progress-reports/child_progress/', { params: { child_id: childId } })

// Duplication Alerts
export const listDuplicationAlerts = (params?: Record<string, string>): ListResponse<DuplicationAlert> =>
  api.get('/childs/duplication-alerts/', { params })

export const pendingAlerts = (): ListResponse<DuplicationAlert> =>
  api.get('/childs/duplication-alerts/pending_alerts/')

export const resolveDuplicate = (id: string, data: { action: string; notes?: string }): Promise<AxiosResponse<{ message: string }>> =>
  api.post(`/childs/duplication-alerts/${id}/resolve_duplicate/`, data)

// Financial Documents
export const listFinancialDocs = (params?: Record<string, string>): ListResponse<FinancialDocument> =>
  api.get('/childs/financial-documents/', { params })

export const createFinancialDoc = (formData: FormData): Promise<AxiosResponse<FinancialDocument>> =>
  api.post('/childs/financial-documents/', formData)

export const approveFinancialDoc = (id: string, notes: string): Promise<AxiosResponse<{ message: string }>> =>
  api.post(`/childs/financial-documents/${id}/approve_document/`, { notes })

export const rejectFinancialDoc = (id: string, notes: string): Promise<AxiosResponse<{ message: string }>> =>
  api.post(`/childs/financial-documents/${id}/reject_document/`, { notes })

// Program Metrics
export const latestMetrics = (): Promise<AxiosResponse<ProgramMetrics>> =>
  api.get('/childs/program-metrics/latest_metrics/')

export const metricsRange = (start: string, end: string): ListResponse<ProgramMetrics> =>
  api.get('/childs/program-metrics/metrics_range/', { params: { start_date: start, end_date: end } })

// System Logs
export const recentActivity = (limit = 50): Promise<AxiosResponse<unknown[]>> =>
  api.get('/childs/system-logs/recent_activity/', { params: { limit } })

export const errorLogs = (): Promise<AxiosResponse<unknown[]>> =>
  api.get('/childs/system-logs/error_logs/')

// PM: Publish child / Return for correction
export const pmPublishChild = (id: string): Promise<AxiosResponse<{ message: string }>> =>
  api.post(`/childs/${id}/publish/`)

export const returnForCorrection = (id: string, reason: string): Promise<AxiosResponse<{ message: string }>> =>
  api.post(`/childs/${id}/return-for-correction/`, { reason })

// PM: Review financial document (mark VALID or INVALID, notify Admin)
export const pmReviewFinancialDoc = (
  id: string,
  decision: 'VALID' | 'INVALID',
  notes: string
): Promise<AxiosResponse<{ message: string; data: FinancialDocument }>> =>
  api.post(`/childs/financial-documents/${id}/pm-review/`, { decision, notes })
