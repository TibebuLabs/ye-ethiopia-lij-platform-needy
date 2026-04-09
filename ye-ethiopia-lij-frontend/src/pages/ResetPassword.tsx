import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../api/auth'
import toast from 'react-hot-toast'
import { Lock, Eye, EyeOff, ArrowLeft, Shield, CheckCircle } from 'lucide-react'
import Spinner from '../components/Spinner'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const navigate = useNavigate()

  const [form, setForm] = useState({ new_password: '', new_password_confirm: '' })
  const [show, setShow] = useState({ password: false, confirm: false })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.new_password !== form.new_password_confirm) {
      toast.error('Passwords do not match')
      return
    }
    if (!token) {
      toast.error('Invalid or missing reset token')
      return
    }
    setLoading(true)
    try {
      await resetPassword(token, form.new_password, form.new_password_confirm)
      setDone(true)
      setTimeout(() => navigate('/login'), 3000)
    } catch (err: any) {
      const msg =
        err?.response?.data?.error?.message ??
        err?.response?.data?.detail ??
        'Failed to reset password. The link may have expired.'
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-poppins">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-green-500 to-green-400" />

        <div className="px-8 pt-8 pb-6">
          {/* Icon */}
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Lock size={28} className="text-white" />
            </div>
          </div>

          {done ? (
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Password Reset!</h1>
              <p className="text-sm text-gray-500 mb-6">
                Your password has been updated. Redirecting to login...
              </p>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
              >
                <ArrowLeft size={15} /> Go to Login
              </Link>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
                <p className="text-gray-500 text-sm mt-1">
                  Must be at least 8 chars with uppercase, digit, and special character.
                </p>
              </div>

              {!token && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                  Invalid reset link. Please request a new one.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* New password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={show.password ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.new_password}
                      onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                      required
                      disabled={!token}
                      className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-300 transition disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => ({ ...s, password: !s.password }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {show.password ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                {/* Confirm password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type={show.confirm ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.new_password_confirm}
                      onChange={(e) => setForm({ ...form, new_password_confirm: e.target.value })}
                      required
                      disabled={!token}
                      className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-300 transition disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShow((s) => ({ ...s, confirm: !s.confirm }))}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {show.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors shadow-md shadow-green-200 text-sm"
                >
                  {loading ? <Spinner size="sm" /> : <Lock size={16} />}
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>

              <Link
                to="/login"
                className="flex items-center justify-center gap-1.5 mt-5 text-xs text-gray-500 hover:text-green-600 transition-colors"
              >
                <ArrowLeft size={13} /> Back to Login
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-full px-4 py-2">
        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
          <Shield size={12} className="text-white" />
        </div>
        <span className="text-xs font-semibold text-gray-700">Ye Ethiopia Lij</span>
      </div>
    </div>
  )
}
