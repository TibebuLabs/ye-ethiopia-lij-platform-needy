import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Heart, BookOpen, Users, Shield, CheckCircle,
  ChevronDown, ArrowRight, Play, Mail, ArrowRightCircle
} from 'lucide-react'

export default function Home() {
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-[#f9faf7] font-poppins">

      {/* ── Navbar ─────────────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-green-600 rounded-xl flex items-center justify-center shadow">
              <Heart size={18} className="text-white fill-white" />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-green-700 text-base leading-none">Ye Ethiopia Lij</p>
              <p className="text-[10px] text-gray-400 leading-none">Child Welfare Platform</p>
            </div>
          </Link>

          {/* Links */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#home" className="hover:text-green-600 transition-colors">Home</a>
            <a href="#about" className="hover:text-green-600 transition-colors">About</a>
            <a href="#programs" className="hover:text-green-600 transition-colors">Programs</a>
            <a href="#contact" className="hover:text-green-600 transition-colors">Contact</a>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm font-medium text-gray-700 hover:text-green-600 px-4 py-2 rounded-lg hover:bg-green-50 transition-colors"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm font-semibold bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
            >
              <Users size={14} /> Join Us
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section id="home" className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row items-center gap-12">
        {/* Left */}
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full">
            <Heart size={12} className="fill-green-600 text-green-600" />
            Transforming Lives in Ethiopia
          </div>

          <h1 className="text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight">
            Give Children a<br />
            <span className="text-green-600">Bright Future</span>
          </h1>

          <p className="text-gray-500 text-lg leading-relaxed max-w-md">
            Join us in transforming lives through education, healthcare, and sustainable
            support. Together, we can create lasting change for children across Ethiopia.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-md"
            >
              Start Sponsoring Today <ArrowRight size={16} />
            </Link>
            <button className="flex items-center gap-2 border border-gray-300 hover:border-green-400 text-gray-700 font-medium px-6 py-3 rounded-xl transition-colors">
              <Play size={15} className="text-green-600 fill-green-600" /> Watch Our Story
            </button>
          </div>

          {/* Trust badges */}
          <div className="flex items-center gap-6 flex-wrap pt-2">
            {['Verified Non-Profit', '100% Transparency', 'Tax Deductible'].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-sm text-gray-500">
                <CheckCircle size={14} className="text-green-500" /> {t}
              </span>
            ))}
          </div>
        </div>

        {/* Right — program card */}
        <div className="flex-shrink-0 w-full max-w-sm">
          <div className="bg-white rounded-3xl shadow-xl p-6 border border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Our Programs</p>

            <div className="space-y-3 mb-6">
              {[
                { icon: BookOpen, label: 'Education Sponsorship', color: 'bg-green-50 text-green-600' },
                { icon: Heart,    label: 'Healthcare Support',    color: 'bg-red-50 text-red-500' },
                { icon: Users,    label: 'Family Empowerment',    color: 'bg-yellow-50 text-yellow-600' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${color} bg-opacity-60`}>
                  <Icon size={16} />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
              ))}
            </div>

            <Link
              to="/register"
              className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              <Users size={15} /> Join Us Now <ArrowRight size={14} />
            </Link>
            <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1">
              <Shield size={11} /> Secure &amp; encrypted • Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Scroll indicator */}
      <div className="flex justify-center pb-8 animate-bounce">
        <ChevronDown size={24} className="text-gray-400" />
      </div>

      {/* ── About ──────────────────────────────────────────────────────── */}
      <section id="about" className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Ye Ethiopia Lij?</h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-12">
            We connect compassionate sponsors with vulnerable children across Ethiopia,
            ensuring every child gets the support they deserve.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: '2,400+ Children', desc: 'Supported through education and healthcare programs', color: 'bg-green-100 text-green-600' },
              { icon: Heart,    title: '98% Impact Rate', desc: 'Of donations go directly to child welfare programs', color: 'bg-red-100 text-red-500' },
              { icon: Users,    title: '150+ Partners',   desc: 'Organizations and schools working with us nationwide', color: 'bg-blue-100 text-blue-600' },
            ].map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mx-auto mb-4`}>
                  <Icon size={22} />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
                <p className="text-gray-500 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Programs ───────────────────────────────────────────────────── */}
      <section id="programs" className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our Programs</h2>
            <p className="text-gray-500 max-w-lg mx-auto">
              Comprehensive support designed to give every child a fair chance at a better life.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: BookOpen,
                title: 'Education Sponsorship',
                desc: 'Fund school fees, uniforms, books, and tutoring for children who would otherwise miss out on education.',
                color: 'border-t-green-500',
                bg: 'bg-green-50',
                iconColor: 'text-green-600',
              },
              {
                icon: Heart,
                title: 'Healthcare Support',
                desc: 'Provide medical checkups, vaccinations, nutrition programs, and emergency healthcare access.',
                color: 'border-t-red-400',
                bg: 'bg-red-50',
                iconColor: 'text-red-500',
              },
              {
                icon: Users,
                title: 'Family Empowerment',
                desc: 'Strengthen families through vocational training, microfinance, and community development programs.',
                color: 'border-t-yellow-400',
                bg: 'bg-yellow-50',
                iconColor: 'text-yellow-600',
              },
            ].map(({ icon: Icon, title, desc, color, bg, iconColor }) => (
              <div key={title} className={`bg-white rounded-2xl border-t-4 ${color} shadow-sm hover:shadow-md transition-shadow p-6`}>
                <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon size={20} className={iconColor} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                <Link to="/register" className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${iconColor} hover:underline`}>
                  Get involved <ArrowRightCircle size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact / CTA ──────────────────────────────────────────────── */}
      <section id="contact" className="bg-green-600 py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to Make a Difference?</h2>
          <p className="text-green-100 mb-8">
            Join thousands of sponsors who are already changing lives across Ethiopia.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/register"
              className="bg-white text-green-700 font-semibold px-8 py-3 rounded-xl hover:bg-green-50 transition-colors shadow"
            >
              Start Sponsoring Today
            </Link>
            <Link
              to="/login"
              className="border-2 border-white text-white font-semibold px-8 py-3 rounded-xl hover:bg-green-700 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="bg-gray-900 text-gray-400 py-14">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <Heart size={14} className="text-white fill-white" />
              </div>
              <span className="font-bold text-white text-sm">Ye Ethiopia Lij</span>
            </div>
            <p className="text-sm leading-relaxed">
              Transforming lives through education, healthcare, and sustainable support for children in Ethiopia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {['About Us', 'Our Programs', 'Sponsor a Child', 'Contact'].map((l) => (
                <li key={l}><a href="#" className="hover:text-green-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 text-sm">Support</h4>
            <ul className="space-y-2 text-sm">
              {['FAQ', 'Privacy Policy', 'Terms of Service', 'Accessibility'].map((l) => (
                <li key={l}><a href="#" className="hover:text-green-400 transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-semibold mb-2 text-sm">Newsletter</h4>
            <p className="text-sm mb-4">Subscribe to receive impact stories and updates.</p>
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="flex-1 bg-gray-800 border border-gray-700 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-green-500 placeholder-gray-500"
              />
              <button className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors">
                <Mail size={16} />
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-10 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          © 2026 Ye Ethiopia Lij. All rights reserved. Registered 501(c)(3) nonprofit organization.
        </div>
      </footer>
    </div>
  )
}
