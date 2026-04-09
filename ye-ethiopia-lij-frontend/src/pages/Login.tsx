import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Mail, Lock, LogIn, Shield, CheckCircle } from 'lucide-react'
import Spinner from '../components/Spinner'

export default function Login() {
  const { login, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [remember, setRemember] = useState(true)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await login(form.email, form.password, remember)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ?? 'Login failed'
      toast.error(msg)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-poppins">

      {/* Card */}
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden">

        {/* Green top bar */}
        <div className="h-1.5 bg-gradient-to-r from-green-500 to-green-400" />

        <div className="px-8 pt-8 pb-6">

          {/* Lock icon */}
          <div className="flex justify-center mb-5">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl rotate-6 shadow-lg flex items-center justify-center">
                <Lock size={32} className="text-white -rotate-6" />
              </div>
              {/* Secured badge */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-white border border-gray-100 shadow-sm rounded-full px-2 py-0.5 flex items-center gap-1 whitespace-nowrap">
                <CheckCircle size={10} className="text-green-500 fill-green-500" />
                <span className="text-[10px] font-semibold text-gray-600">Secured</span>
              </div>
              {/* Yellow dot */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-6 mt-3">
            <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
            <p className="text-green-600 text-sm mt-1 flex items-center justify-center gap-1">
              <Shield size={12} /> Ye Ethiopia Lij · Child Welfare Platform
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-300 transition"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-gray-700">Password</label>
                <Link to="/forgot-password" className="text-xs text-green-600 hover:underline font-medium">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPw ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder-gray-300 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-400"
              />
              <span className="text-xs text-gray-600">Keep me signed in</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors shadow-md shadow-green-200 text-sm"
            >
              {loading ? <Spinner size="sm" /> : <LogIn size={16} />}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Register link */}
          <p className="text-center text-xs text-gray-500 mt-5">
            New to Ye Ethiopia Lij?{' '}
            <Link to="/register" className="text-green-600 font-semibold hover:underline">
              Create account &rsaquo;
            </Link>
          </p>
        </div>
      </div>

      {/* Footer links */}
      <div className="flex items-center gap-5 mt-6 text-xs text-gray-400">
        <a href="#" className="hover:text-gray-600 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-gray-600 transition-colors">Terms of Service</a>
        <a href="#" className="hover:text-gray-600 transition-colors">Help Center</a>
      </div>

      {/* Official Partner badge */}
      <div className="mt-4 flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-full px-4 py-2">
        <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
          <Shield size={12} className="text-white" />
        </div>
        <span className="text-xs font-semibold text-gray-700">Official Partner</span>
      </div>

      {/* Copyright */}
      <p className="mt-4 text-[11px] text-gray-400">
        © 2026 Ye Ethiopia Lij. All rights reserved.
      </p>
    </div>
  )
}
