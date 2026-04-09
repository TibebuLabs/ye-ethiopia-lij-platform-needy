import { useState } from 'react'
import { Link } from 'react-router-dom'
import { forgotPassword } from '../api/auth'
import toast from 'react-hot-toast'
import { Mail, ArrowLeft, Shield, CheckCircle } from 'lucide-react'
import Spinner from '../components/Spinner'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await forgotPassword(email)
      setSent(true)
    } catch {
      toast.error('Something went wrong. Please try again.')
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
              <Mail size={28} className="text-white" />
            </div>
          </div>

          {sent ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">Check your email</h1>
              <p className="text-sm text-gray-500 mb-6">
                If <span className="font-medium text-gray-700">{email}</span> is registered,
                you'll receive a password reset link shortly.
              </p>
              <p className="text-xs text-gray-400 mb-6">
                Didn't receive it? Check your spam folder or try again.
              </p>
              <Link
                to="/login"
                className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 rounded-xl transition-colors"
              >
                <ArrowLeft size={15} /> Back to Login
              </Link>
            </div>
          ) : (
            /* ── Form state ── */
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
                <p className="text-gray-500 text-sm mt-1">
                  Enter your email and we'll send you a reset link.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-300 transition"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors shadow-md shadow-green-200 text-sm"
                >
                  {loading ? <Spinner size="sm" /> : <Mail size={16} />}
                  {loading ? 'Sending...' : 'Send Reset Link'}
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
