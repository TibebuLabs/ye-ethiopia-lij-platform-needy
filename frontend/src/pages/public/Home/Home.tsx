import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Menu, 
  X, 
  ChevronRight, 

  Users, 
  GraduationCap, 
  
  ArrowRight,
  Sparkles,
  BookOpen,
  Home,
  Info,
  LogIn,
  UserPlus,
  CheckCircle,
  Play,
  Mail} from 'lucide-react';




// ==================== Main Component ====================
const HomePage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('home');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Statistics Data

  // Programs Data

  // Testimonials Data

  // Navigation Items
  const navItems = [
    { id: 'home', label: 'Home', icon: Home, href: '#home' },
    { id: 'about', label: 'About', icon: Info, href: '#about' },
    { id: 'programs', label: 'Programs', icon: BookOpen, href: '#programs' },
    { id: 'contact', label: 'Contact', icon: Mail, href: '#contact' }
  ];

  // ==================== Navigation Handler ====================
  const handleNavigation = (path: string) => {
    setIsMenuOpen(false);
    window.location.href = path;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-emerald-50/30">
      {/* ==================== Navigation Bar ==================== */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg py-3' 
          : 'bg-transparent py-5'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => handleNavigation('/')}>
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-emerald-500 
                            rounded-xl shadow-lg flex items-center justify-center transform -rotate-12 
                            group-hover:rotate-0 transition-all duration-500">
                <Heart className="text-white" size={22} fill="white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-emerald-700 to-emerald-600 
                               bg-clip-text text-transparent">
                  Ye Ethiopia Lij
                </span>
                <span className="hidden sm:block text-xs text-gray-500">Child Welfare Platform</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-all duration-300
                              hover:text-emerald-600 group
                              ${activeSection === item.id ? 'text-emerald-600' : 'text-gray-600'}`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveSection(item.id);
                    }}
                  >
                    <Icon size={16} className="group-hover:scale-110 transition-transform" />
                    {item.label}
                  </a>
                );
              })}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => handleNavigation('/login')}
                className="px-5 py-2.5 text-sm font-semibold text-gray-700 hover:text-emerald-600 
                         transition-colors flex items-center gap-2 group"
              >
                <LogIn size={16} className="group-hover:scale-110 transition-transform" />
                Login
              </button>
              <button
                onClick={() => handleNavigation('/register')}
                className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 
                         text-white text-sm font-semibold rounded-xl shadow-lg 
                         hover:shadow-emerald-200/50 hover:scale-105 transition-all duration-300 
                         flex items-center gap-2 group"
              >
                <UserPlus size={16} className="group-hover:rotate-12 transition-transform" />
                Join Us
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden fixed inset-0 top-16 bg-white/95 backdrop-blur-xl z-40 
                       transition-all duration-500 transform ${
                         isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                       }`}>
          <div className="container mx-auto px-4 py-8">
            <div className="space-y-6">
              {/* Mobile Nav Items */}
              <div className="space-y-3">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.id}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 
                               rounded-xl transition-colors group"
                      onClick={(e) => {
                        e.preventDefault();
                        setActiveSection(item.id);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Icon size={20} className="group-hover:text-emerald-600 group-hover:scale-110 
                                               transition-all" />
                      <span className="font-medium">{item.label}</span>
                    </a>
                  );
                })}
              </div>

              {/* Mobile Auth Buttons */}
              <div className="space-y-3 pt-6 border-t border-gray-100">
                <button
                  onClick={() => handleNavigation('/login')}
                  className="w-full px-4 py-3 text-gray-700 font-medium rounded-xl 
                           hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <LogIn size={18} />
                  Login
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 
                           text-white font-medium rounded-xl shadow-lg 
                           hover:shadow-emerald-200/50 transition-all duration-300 
                           flex items-center justify-center gap-2"
                >
                  <UserPlus size={18} />
                  Join Us
                </button>
              </div>

              {/* Mobile Impact Stats */}
              <div className="pt-6">
                <div className="bg-gradient-to-br from-emerald-50 to-amber-50 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles size={18} className="text-emerald-600" />
                    <span className="text-sm font-semibold text-gray-800">Our Impact</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xl font-bold text-emerald-700">5,000+</p>
                      <p className="text-xs text-gray-600">Children</p>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-amber-700">15+</p>
                      <p className="text-xs text-gray-600">Years</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* ==================== Hero Section ==================== */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-amber-50/50">
          <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 
                            px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles size={16} />
                <span>Empowering Ethiopia's Future 🇪🇹</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Every Child Deserves a{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-emerald-500 bg-clip-text text-transparent">
                  Bright Future
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Join us in transforming lives through education, healthcare, and sustainable support. 
                Together, we can create lasting change for children across Ethiopia.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => handleNavigation('/register')}
                  className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-emerald-500 
                           text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl 
                           hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <span>Start Sponsoring Today</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                
                <button className="group px-8 py-4 bg-white border-2 border-emerald-600 
                                 text-emerald-700 font-bold rounded-2xl hover:bg-emerald-50 
                                 transition-all duration-300 flex items-center justify-center gap-2">
                  <Play size={16} className="group-hover:scale-110 transition-transform" />
                  <span>Watch Our Story</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 flex flex-wrap items-center gap-8 justify-center lg:justify-start">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="text-sm text-gray-600">Verified Non-Profit</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="text-sm text-gray-600">100% Transparency</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-600" />
                  <span className="text-sm text-gray-600">Tax Deductible</span>
                </div>
              </div>
            </div>

            {/* Right Content - Hero Image/Card */}
            <div className="relative lg:block">
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
                <div className="absolute -top-4 -right-4 bg-amber-400 text-gray-900 
                              px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                  ⚡ 5,000+ Lives Changed
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 
                                rounded-2xl flex items-center justify-center">
                    <Heart className="text-emerald-600" size={32} fill="currentColor" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Make a Difference</h3>
                    <p className="text-gray-500">Start from $25/month</p>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                    <GraduationCap size={20} className="text-emerald-600" />
                    <span className="text-sm font-medium text-gray-700">Education Sponsorship</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-rose-50 rounded-xl">
                    <Heart size={20} className="text-rose-600" />
                    <span className="text-sm font-medium text-gray-700">Healthcare Support</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl">
                    <Users size={20} className="text-amber-600" />
                    <span className="text-sm font-medium text-gray-700">Family Empowerment</span>
                  </div>
                </div>

                <button
                  onClick={() => handleNavigation('/register')}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 
                           text-white font-semibold rounded-xl hover:shadow-lg 
                           transition-all duration-300 flex items-center justify-center gap-2 group"
                >
                  <UserPlus size={18} />
                  Join Us Now
                  <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <p className="text-xs text-center text-gray-500 mt-4">
                  🔒 Secure & encrypted • Cancel anytime
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center">
            <ChevronRight size={20} className="text-emerald-600 rotate-90" />
          </div>
        </div>
      </section>
           
     


      
      {/* ==================== Footer ==================== */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
                  <Heart className="text-white" size={20} fill="white" />
                </div>
                <span className="text-xl font-bold">Ye Ethiopia Lij</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Transforming lives through education, healthcare, and sustainable support for children in Ethiopia.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Our Programs</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Sponsor a Child</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">Accessibility</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Newsletter</h4>
              <p className="text-sm text-gray-400 mb-4">
                Subscribe to receive impact stories and updates.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-l-xl 
                           focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 
                           transition-all duration-200 outline-none text-sm"
                />
                <button className="px-4 py-2 bg-emerald-600 rounded-r-xl hover:bg-emerald-700 
                                 transition-colors">
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-800 text-center">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Ye Ethiopia Lij. All rights reserved. 
              Registered 501(c)(3) nonprofit organization.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;