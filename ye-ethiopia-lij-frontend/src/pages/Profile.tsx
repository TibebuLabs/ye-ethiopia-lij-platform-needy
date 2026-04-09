import { useState } from 'react'
import Layout from '../components/Layout'
import Spinner from '../components/Spinner'
import { useAuth } from '../context/AuthContext'
import { changePassword } from '../api/auth'
import toast from 'react-hot-toast'
import { Lock, Eye, EyeOff, Shield } from 'lucide-react'
import type { UserRole } from '../types'

interface PwForm {
  old_password: string
  new_password: string
  new_password_confirm: string
}

const ROLE_COLORS: Record<UserRole, string> = {
  ADMIN: 'bg-red-100 text-red-700',
  ORG_STAFF: 'bg-blue-100 text-blue-700',
  SPONSOR: 'bg-green-100 text-green-700',
  SCHOOL: 'bg-purple-100 text-purple-700',
  GOVERNMENT: 'bg-orange-100 text-orange-700',
}

export default function Profile() {
  const { user } = useAuth()
  const [pwForm, setPwForm] = useState<PwForm>({ old_password: '', new_password: '', new_password_confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const set = (k: keyof PwForm) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setPwForm({ ...pwForm, [k]: e.target.value })

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (pwForm.new_password !== pwForm.new_password_confirm) {
      toast.error('New passwords do not match')
      return
    }
    setLoading(true)
    try {
      await changePassword(pwForm)
      toast.success('Password updated successfully!')
      setPwForm({ old_password: '', new_password: '', new_password_confirm: '' })
    } catch (err: unknown) {
      const errors = (err as { response?: { data?: Record<string, unknown> } })?.response?.data
      const msg =
        (errors?.error as { message?: string })?.message ??
        (Object.values(errors ?? {})[0] as string[])?.[0] ??
        'Failed to update password'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-500 text-sm">Manage your account settings</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="card">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-2xl">{user?.name?.charAt(0)?.toUpperCase()}</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Role</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${user?.role ? ROLE_COLORS[user.role] : 'bg-gray-100 text-gray-600'}`}>
                {user?.role?.replace('_', ' ')}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Account Status</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${user?.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {user?.status}
              </span>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">Email Verified</p>
              <p className="font-medium text-gray-700">{user?.email_verified ? 'Yes' : 'No'}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-400 text-xs mb-1">User ID</p>
              <p className="font-mono text-xs text-gray-500 truncate">{user?.id}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center gap-2 mb-5">
            <Lock size={18} className="text-green-600" />
            <h3 className="font-semibold text-gray-800">Change Password</h3>
          </div>

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                className="input-field"
                value={pwForm.old_password}
                onChange={set('old_password')}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="input-field pr-10"
                  placeholder="Min 8 chars, 1 uppercase, 1 digit, 1 special (!@#$...)"
                  value={pwForm.new_password}
                  onChange={set('new_password')}
                  required
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
              <input
                type={showPw ? 'text' : 'password'}
                className="input-field"
                value={pwForm.new_password_confirm}
                onChange={set('new_password_confirm')}
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
              {loading ? <Spinner size="sm" /> : <Shield size={16} />}
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  )
}
