import api from './axios'
import type { AxiosResponse } from 'axios'
import type { AuthTokens, User, PaginatedResponse } from '../types'

interface LoginData { email: string; password: string }
interface RegisterData {
  email: string; name: string; role: string; password: string; password_confirm: string
  school_name?: string; school_type?: string; registration_number?: string
  address?: string; city?: string; region?: string; phone?: string
  principal_name?: string; established_year?: string; description?: string
}
interface PasswordChangeData { old_password: string; new_password: string; new_password_confirm: string }
interface StatusChangeData { status: string }

export const login = (data: LoginData): Promise<AxiosResponse<AuthTokens>> =>
  api.post('/accounts/login/', data)

export const register = (data: RegisterData | FormData): Promise<AxiosResponse<{ message: string; data: User }>> =>
  api.post('/accounts/register/', data, {
    headers: data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : {},
  })

// REMOVED: refreshToken export - it's now handled automatically by the interceptor
// If you need to manually refresh, use the interceptor instead

export const changePassword = (data: PasswordChangeData): Promise<AxiosResponse<{ message: string }>> =>
  api.post('/accounts/change-password/', data)

export const listUsers = (params?: Record<string, string>): Promise<AxiosResponse<PaginatedResponse<User> | User[]>> =>
  api.get('/accounts/manage/', { params })

export const changeUserStatus = (id: string, status: string): Promise<AxiosResponse<{ message: string; data: User }>> =>
  api.post(`/accounts/manage/${id}/change-status/`, { status } as StatusChangeData)

export interface SchoolProfile {
  school_name: string
  school_type: string
  registration_number: string
  address: string
  city: string
  region: string
  phone: string
  principal_name: string
  established_year: string
  description: string
  created_at: string
  updated_at: string
}

export const getSchoolProfile = (): Promise<AxiosResponse<SchoolProfile>> =>
  api.get('/accounts/school-profile/')

export const createSchoolProfile = (data: Partial<SchoolProfile>): Promise<AxiosResponse<{ message: string; data: SchoolProfile }>> =>
  api.post('/accounts/school-profile/', data)

export const updateSchoolProfile = (data: Partial<SchoolProfile>): Promise<AxiosResponse<{ message: string; data: SchoolProfile }>> =>
  api.patch('/accounts/school-profile/', data)

export const forgotPassword = (email: string): Promise<AxiosResponse<{ message: string }>> =>
  api.post('/accounts/forgot-password/', { email })

export const resetPassword = (
  token: string,
  new_password: string,
  new_password_confirm: string
): Promise<AxiosResponse<{ message: string }>> =>
  api.post('/accounts/reset-password/', { token, new_password, new_password_confirm })

export const checkAdminExists = (): Promise<AxiosResponse<{ admin_exists: boolean }>> =>
  api.get('/accounts/admin-exists/')

export const pmForwardUser = (userId: string, notes: string): Promise<AxiosResponse<{ message: string }>> =>
  api.post(`/accounts/manage/${userId}/pm-forward/`, { notes })

export const pmListPendingUsers = (params?: Record<string, string>): Promise<AxiosResponse<PaginatedResponse<User> | User[]>> =>
  api.get('/accounts/pending-registrations/', { params })