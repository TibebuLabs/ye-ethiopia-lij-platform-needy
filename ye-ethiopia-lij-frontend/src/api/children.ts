import api from './axios'
import type { AxiosResponse } from 'axios'
import type { ChildProfile, Sponsorship, Intervention, Notification, ProgramMetrics, PaginatedResponse } from '../types'

type ListResponse<T> = Promise<AxiosResponse<PaginatedResponse<T> | T[]>>

export const listChildren = (params?: Record<string, string>): ListResponse<ChildProfile> =>
  api.get('/childs/list/', { params })

export const listAllChildren = (params?: Record<string, string>): ListResponse<ChildProfile> =>
  api.get('/childs/all/', { params })

export const getChild = (id: string): Promise<AxiosResponse<ChildProfile>> =>
  api.get(`/childs/${id}/`)

export const registerChild = (formData: FormData): Promise<AxiosResponse<ChildProfile>> =>
  api.post('/childs/register/', formData)

export const updateChild = (id: string, formData: FormData): Promise<AxiosResponse<ChildProfile>> =>
  api.put(`/childs/${id}/`, formData)

export const patchChildStatus = (id: string, status: string): Promise<AxiosResponse<ChildProfile>> =>
  api.patch(`/childs/${id}/`, { status })

export const rejectChild = (id: string, reason: string): Promise<AxiosResponse<{ message: string }>> =>
  api.post(`/childs/${id}/reject/`, { reason })

export const resubmitChild = (id: string, formData: FormData): Promise<AxiosResponse<{ message: string; data: ChildProfile }>> =>
  api.post(`/childs/${id}/resubmit/`, formData)

export const deleteChild = (id: string): Promise<AxiosResponse<void>> =>
  api.delete(`/childs/${id}/`)

export const sponsorChild = (childId: string, formData: FormData): Promise<AxiosResponse<{ message: string; data: Sponsorship }>> =>
  api.post(`/childs/sponsor/${childId}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

export const mySponsorships = (): ListResponse<Sponsorship> =>
  api.get('/childs/my-sponsorships/')

export const allSponsorships = (): ListResponse<Sponsorship> =>
  api.get('/childs/all-sponsorships/')

export const pendingSponsorships = (status?: string): ListResponse<Sponsorship> =>
  api.get('/childs/pending-sponsorships/', { params: status ? { status } : {} })

export const verifySponsorship = (id: string, action: 'verify' | 'reject', notes?: string): Promise<AxiosResponse<{ message: string; data: Sponsorship }>> =>
  api.post(`/childs/verify-sponsorship/${id}/`, { action, notes })

export const resubmitSponsorship = (id: string, formData: FormData): Promise<AxiosResponse<{ message: string; data: Sponsorship }>> =>
  api.post(`/childs/resubmit-sponsorship/${id}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

// Interventions
export const listInterventions = (params?: Record<string, string>): ListResponse<Intervention> =>
  api.get('/childs/interventions/', { params })

export const createIntervention = (formData: FormData): Promise<AxiosResponse<Intervention>> =>
  api.post('/childs/interventions/', formData)

export const updateIntervention = (id: string, formData: FormData): Promise<AxiosResponse<Intervention>> =>
  api.put(`/childs/interventions/${id}/`, formData)

export const deleteIntervention = (id: string): Promise<AxiosResponse<void>> =>
  api.delete(`/childs/interventions/${id}/`)

// Notifications
export const listNotifications = (): ListResponse<Notification> =>
  api.get('/childs/notifications/')

export const markNotificationRead = (id: string): Promise<AxiosResponse<{ message: string }>> =>
  api.post(`/childs/notifications/${id}/mark_as_read/`)

export const markAllNotificationsRead = (): Promise<AxiosResponse<{ message: string }>> =>
  api.post('/childs/notifications/mark_all_read/')

export const unreadCount = (): Promise<AxiosResponse<{ unread_count: number }>> =>
  api.get('/childs/notifications/unread_count/')

// Program metrics
export const latestMetrics = (): Promise<AxiosResponse<ProgramMetrics>> =>
  api.get('/childs/program-metrics/latest_metrics/')

export const dashboardStats = (): Promise<AxiosResponse<Record<string, number | null>>> =>
  api.get('/childs/dashboard-stats/')

export const pmFlagChild = (id: string, notes: string): Promise<AxiosResponse<{ message: string; data: ChildProfile }>> =>
  api.post(`/childs/${id}/flag/`, { notes })

export const pmReviewSponsorship = (
  id: string,
  decision: 'VALID' | 'INVALID',
  notes: string
): Promise<AxiosResponse<{ message: string; data: Sponsorship }>> =>
  api.post(`/childs/pm-review-sponsorship/${id}/`, { decision, notes })
