// ── Auth / Users ─────────────────────────────────────────────────────────────
export type UserRole = 'ADMIN' | 'ORG_STAFF' | 'SPONSOR' | 'SCHOOL' | 'GOVERNMENT' | 'PROJECT_MANAGER'
export type UserStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED'

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

export interface InlineOrganization {
  id: string
  name: string
  org_type: string
  status: string
  address: string
  city: string
  phone: string
  email: string
  website: string
  registration_number: string
  description: string
  established_year: number | null
  license_document: string | null
  logo: string | null
  created_at: string
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  status: UserStatus
  is_active: boolean
  email_verified: boolean
  created_at: string
  school_profile?: SchoolProfile | null
  verification_document?: string | null
  organization?: InlineOrganization | null
}

export interface AuthTokens {
  access: string
  refresh: string
  user: User
}

// ── Child Profile ─────────────────────────────────────────────────────────────
export type ChildStatus = 'PENDING' | 'PUBLISHED' | 'SPONSORED' | 'REJECTED'
export type ChildGender = 'MALE' | 'FEMALE' | 'OTHER'

export interface ChildProfile {
  id: string
  full_name: string
  age: number
  gender: ChildGender
  location: string
  biography: string
  vulnerability_status: string
  guardian_info: string
  photo: string | null
  supporting_docs: string | null
  status: ChildStatus
  rejection_reason: string
  pm_notes: string
  organization: string
  organization_name: string
  created_at: string
  updated_at: string
}

// ── Sponsorship ───────────────────────────────────────────────────────────────
export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED'
export type PaymentProvider = 'TELEBIRR' | 'CBE' | 'BANK'

export interface Sponsorship {
  id: string
  sponsor: string
  sponsor_name: string
  child: string
  child_name: string
  child_photo: string | null
  start_date: string
  end_date: string | null
  commitment_amount: string
  is_active: boolean
  payment_provider: PaymentProvider | null
  payment_proof: string | null
  verification_status: VerificationStatus
  verification_notes: string
  verified_by: string | null
  verified_by_name: string | null
  verified_at: string | null
  created_at: string
}

// ── Intervention ──────────────────────────────────────────────────────────────
export type InterventionType = 'HEALTH' | 'EDUCATION' | 'NUTRITION' | 'CLOTHING'

export interface Intervention {
  id: string
  child: string
  child_name: string
  type: InterventionType
  description: string
  date_provided: string
  receipt_image: string | null
  recorded_by: string
  recorded_by_name: string
  created_at: string
}

// ── Academic Report ───────────────────────────────────────────────────────────
export type ReportTerm = 'TERM_1' | 'TERM_2' | 'ANNUAL'

export interface AcademicReport {
  id: string
  child: string
  child_name: string
  reported_by: string
  reported_by_name: string
  school_name: string
  academic_year: string
  term: ReportTerm
  grade_level: string
  average_score: string
  rank: number | null
  attendance_rate: string
  report_card_image: string | null
  teacher_comments: string
  created_at: string
  updated_at: string
}

// ── Organization ──────────────────────────────────────────────────────────────
export type OrgStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED'

export interface Organization {
  id: string
  name: string
  org_type: string
  type?: string          // alias kept for compatibility
  description: string
  address: string
  city: string
  phone: string
  email: string
  website: string
  registration_number: string
  license_document: string | null
  logo: string | null
  status: OrgStatus
  owner_name: string
  owner_email?: string
  established_year?: number | null
  verification_document?: string | null
  created_at: string
  updated_at: string
}

export interface OrgReport {
  id: string
  title: string
  period: string
  report_period?: string  // alias kept for compatibility
  report_date: string
  summary: string
  report_file: string | null
  status: string
  created_at: string
  updated_at: string
}

// ── Notification ──────────────────────────────────────────────────────────────
export type NotificationType =
  | 'PROFILE_APPROVED'
  | 'PROFILE_REJECTED'
  | 'SPONSORED'
  | 'INTERVENTION_ADDED'
  | 'REPORT_SUBMITTED'
  | 'STATUS_UPDATED'
  | 'USER_REGISTERED'
  | 'ACCOUNT_APPROVED'
  | 'ACCOUNT_REJECTED'
  | 'ACCOUNT_SUSPENDED'
  | 'ORG_CREATED'
  | 'ORG_APPROVED'
  | 'ORG_REJECTED'
  | 'SCHOOL_PROFILE_CREATED'
  | 'SCHOOL_PROFILE_UPDATED'

export interface Notification {
  id: string
  child: string
  child_name: string
  notification_type: NotificationType
  title: string
  message: string
  recipient: string
  is_read: boolean
  read_at: string | null
  created_at: string
}

// ── Program Metrics ───────────────────────────────────────────────────────────
export interface ProgramMetrics {
  id: string
  metric_date: string
  total_children_registered: number
  total_children_sponsored: number
  total_children_unsponsored: number
  total_sponsorships: number
  active_sponsorships: number
  total_commitment_amount: string
  total_interventions: number
  health_interventions: number
  education_interventions: number
  nutrition_interventions: number
  clothing_interventions: number
  average_attendance_rate: string
  average_score: string
  total_organizations: number
  active_organizations: number
  total_users: number
  total_sponsors: number
  total_schools: number
}

// ── Paginated Response ────────────────────────────────────────────────────────
export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}
