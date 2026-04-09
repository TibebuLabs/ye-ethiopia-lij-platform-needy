import api from './axios'
import type { AxiosResponse } from 'axios'
import type { AcademicReport, PaginatedResponse } from '../types'

type ListResponse = Promise<AxiosResponse<PaginatedResponse<AcademicReport> | AcademicReport[]>>

export const listReports = (params?: Record<string, string>): ListResponse =>
  api.get('/acadamicreport/results/', { params })

export const getReport = (id: string): Promise<AxiosResponse<AcademicReport>> =>
  api.get(`/acadamicreport/results/${id}/`)

export const createReport = (formData: FormData): Promise<AxiosResponse<AcademicReport>> =>
  api.post('/acadamicreport/results/', formData)

export const updateReport = (id: string, formData: FormData): Promise<AxiosResponse<AcademicReport>> =>
  api.put(`/acadamicreport/results/${id}/`, formData)

export const deleteReport = (id: string): Promise<AxiosResponse<void>> =>
  api.delete(`/acadamicreport/results/${id}/`)

export const myReports = (): ListResponse =>
  api.get('/acadamicreport/results/my_reports/')

export const enrolledChildrenReports = (): ListResponse =>
  api.get('/acadamicreport/results/enrolled_children_reports/')

export const updateAcademicStatus = (id: string, data: Partial<AcademicReport>): Promise<AxiosResponse<{ message: string; data: AcademicReport }>> =>
  api.patch(`/acadamicreport/results/${id}/update_academic_status/`, data)

export interface ReportSummary {
  avg_score: number
  max_score: number
  min_score: number
  avg_attendance: number
  total_records: number
  total_children: number
  filters: { child_id: string | null; academic_year: string | null; term: string | null }
}

export interface ChildSummary {
  child_id: string
  child_name: string
  avg_score: number
  avg_attendance: number
  report_count: number
  latest_grade: string
}

export interface GeneratedReport {
  message?: string
  summary: ReportSummary | null
  children: ChildSummary[]
  records: AcademicReport[]
}

export const generateReport = (params: {
  child_id?: string
  academic_year?: string
  term?: string
}): Promise<AxiosResponse<GeneratedReport>> =>
  api.get('/acadamicreport/results/generate_report/', { params })

export interface SchoolStat {
  school_name: string
  report_count: number
  avg_score: number
  avg_attendance: number
}

export interface GovernmentAcademicSummary {
  overall: { total_reports: number; avg_score: number; avg_attendance: number }
  by_school: SchoolStat[]
  recent_reports: AcademicReport[]
}

export const getGovernmentAcademicSummary = (params?: Record<string, string>): Promise<AxiosResponse<GovernmentAcademicSummary>> =>
  api.get('/acadamicreport/results/government_summary/', { params })
