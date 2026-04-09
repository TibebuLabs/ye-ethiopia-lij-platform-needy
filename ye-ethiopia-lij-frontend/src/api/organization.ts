import api from './axios'
import type { AxiosResponse } from 'axios'
import type { Organization, OrgReport, PaginatedResponse } from '../types'

type ListResponse<T> = Promise<AxiosResponse<PaginatedResponse<T> | T[]>>

export const listOrganizations = (params?: Record<string, string>): ListResponse<Organization> =>
  api.get('/organization/profile/', { params })

export const getOrganization = (id: string): Promise<AxiosResponse<Organization>> =>
  api.get(`/organization/profile/${id}/`)

export const createOrganization = (formData: FormData): Promise<AxiosResponse<Organization>> =>
  api.post('/organization/profile/', formData)

export const updateOrganization = (id: string, formData: FormData): Promise<AxiosResponse<Organization>> =>
  api.put(`/organization/profile/${id}/`, formData)

export const approveOrganization = (id: string): Promise<AxiosResponse<{ message: string }>> =>
  api.post(`/organization/profile/${id}/approve/`)

export const rejectOrganization = (id: string, reason: string): Promise<AxiosResponse<{ message: string }>> =>
  api.post(`/organization/profile/${id}/reject/`, { reason })

export const changeOrgStatus = (id: string, status: string): Promise<AxiosResponse<{ message: string }>> =>
  api.post(`/organization/profile/${id}/change-status/`, { status })

export const myOrganization = (): Promise<AxiosResponse<Organization>> =>
  api.get('/organization/profile/my_organization/')

// Org reports
export const listOrgReports = (params?: Record<string, string>): ListResponse<OrgReport> =>
  api.get('/organization/reports/', { params })

export const createOrgReport = (formData: FormData): Promise<AxiosResponse<OrgReport>> =>
  api.post('/organization/reports/', formData)

export const reviewOrgReport = (id: string, notes: string): Promise<AxiosResponse<{ message: string }>> =>
  api.post(`/organization/reports/${id}/review/`, { notes })

export const myOrgReports = (): ListResponse<OrgReport> =>
  api.get('/organization/reports/my_reports/')
