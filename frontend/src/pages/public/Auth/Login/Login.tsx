import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
   
  Shield, 
  Globe,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

type Language = 'en' | 'am' | 'om' | 'ti';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('en');
  const [isLanguageOpen, setIsLanguageOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Login attempt:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLanguageSelect = (lang: Language): void => {
    setLanguage(lang);
    setIsLanguageOpen(false);
  };

  const languageOptions = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
    { code: 'om', label: 'Oromiffa', flag: '🇪🇹' },
    { code: 'ti', label: 'ትግርኛ', flag: '🇪🇹' }
  ];

  const getCurrentLanguage = () => {
    return languageOptions.find(lang => lang.code === language) || languageOptions[0];
  };

  // Animation variants
  const containerVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  const footerLinks: string[] = ['Privacy Policy', 'Terms of Service', 'Help Center'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
      
      <motion.div 
        className="w-full max-w-md relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Language Dropdown */}
        <motion.div 
          className="flex justify-end mb-6 relative"
          variants={itemVariants}
        >
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm 
                       border border-gray-200 rounded-xl shadow-sm hover:shadow-md 
                       transition-all duration-300 text-sm font-medium text-gray-700
                       hover:border-emerald-300 focus:outline-none focus:ring-2 
                       focus:ring-emerald-500/20"
              type="button"
            >
              <Globe size={16} className="text-emerald-600" />
              <span>{getCurrentLanguage().flag}</span>
              <span>{getCurrentLanguage().label}</span>
              <ChevronDown size={16} className={`transition-transform duration-300 ${isLanguageOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown Menu */}
            {isLanguageOpen && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl 
                         border border-gray-100 overflow-hidden z-50"
              >
                {languageOptions.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageSelect(lang.code as Language)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm 
                             transition-all duration-200 hover:bg-emerald-50
                             ${language === lang.code ? 'bg-emerald-50 text-emerald-700 font-medium' : 'text-gray-700'}`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span>{lang.label}</span>
                    {language === lang.code && (
                      <span className="ml-auto text-emerald-600">✓</span>
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Main Card */}
        <motion.div 
          className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden 
                   border border-gray-100/50 relative"
          variants={itemVariants}
        >
          {/* Modern gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600"></div>
          
          <div className="p-6 sm:p-8">
            {/* Logo Section with Lock Image */}
            <motion.div 
              className="text-center mb-8"
              variants={itemVariants}
            >
              <div className="relative inline-block mb-4">
                {/* Lock Image Container */}
                <div className="relative group">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 mx-auto relative">
                    {/* Outer glow */}
                    <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-xl group-hover:bg-emerald-500/30 transition-all duration-500"></div>
                    
                    {/* Main icon container */}
                    <div className="relative w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-600 
                                  rounded-2xl rotate-12 shadow-xl flex items-center justify-center
                                  group-hover:rotate-45 group-hover:scale-105 transition-all duration-500">
                      <div className="-rotate-12 group-hover:-rotate-45 transition-all duration-500">
                        <Lock className="text-white" size={48} strokeWidth={1.5} />
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-amber-400 rounded-full 
                                  flex items-center justify-center text-white font-bold shadow-lg
                                  border-2 border-white animate-pulse">
                      <Shield size={16} />
                    </div>
                    
                    {/* Security badge */}
                    <div className="absolute -bottom-2 -left-2 bg-white rounded-full px-3 py-1 
                                  shadow-lg border border-gray-100 flex items-center gap-1">
                      <span className="text-xs font-semibold text-emerald-700">Secured</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 
                           bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                <Shield size={14} className="text-emerald-500" />
                Ye Ethiopia Lij - Child Welfare Platform
              </p>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
              <motion.div variants={itemVariants}>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl 
                             bg-gray-50/50 focus:bg-white
                             focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 
                             transition-all duration-200 outline-none text-gray-700
                             placeholder:text-gray-400 hover:border-gray-300"
                    placeholder="name@example.com"
                    aria-label="Email address"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a 
                    href="#" 
                    className="text-xs font-medium text-emerald-600 hover:text-emerald-700 
                             transition-colors hover:underline"
                    onClick={(e) => e.preventDefault()}
                  >
                    Forgot?
                  </a>
                </div>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="block w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl 
                             bg-gray-50/50 focus:bg-white
                             focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 
                             transition-all duration-200 outline-none text-gray-700
                             placeholder:text-gray-400 hover:border-gray-300"
                    placeholder="••••••••"
                    aria-label="Password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center 
                             text-gray-400 hover:text-emerald-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-center justify-between"
                variants={itemVariants}
              >
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded 
                             focus:ring-emerald-500 focus:ring-offset-0
                             cursor-pointer transition-all duration-200
                             group-hover:border-emerald-400"
                    aria-label="Remember me"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    Keep me signed in
                  </span>
                </label>
              </motion.div>

              <motion.button
                type="submit"
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 
                         hover:from-emerald-700 hover:to-emerald-600
                         text-white font-semibold py-3.5 px-4 rounded-xl
                         shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50
                         transition-all duration-300 flex items-center justify-center gap-2
                         group"
              >
                <span>Sign In</span>
                <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>

              {/* Sign Up Link */}
              <motion.div 
                className="pt-4 text-center"
                variants={itemVariants}
              >
                <p className="text-sm text-gray-600">
                  New to Ye Ethiopia Lij?{' '}
                  <a 
                    href="#" 
                    className="font-semibold text-emerald-600 hover:text-emerald-700 
                             inline-flex items-center gap-1 group transition-all"
                    onClick={(e) => e.preventDefault()}
                  >
                    Create account
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </p>
              </motion.div>
            </form>
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div 
          className="mt-8 text-center"
          variants={itemVariants}
        >
          <div className="flex items-center justify-center flex-wrap gap-4 sm:gap-6">
            {footerLinks.map((item, index) => (
              <a 
                key={index}
                href="#" 
                className="text-xs text-gray-500 hover:text-emerald-600 
                         transition-colors relative group"
                onClick={(e) => e.preventDefault()}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-600 
                               group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </div>
          
          {/* Official Seal */}
          <motion.div 
            className="flex justify-center items-center mt-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-sm 
                          rounded-full shadow-sm border border-gray-100">
              <div className="relative">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-amber-500 
                              rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">🇪🇹</span>
                </div>
              </div>
              <span className="text-xs font-medium text-gray-600">Official Partner</span>
            </div>
          </motion.div>
          
          <p className="text-xs text-gray-400 mt-4">
            © {new Date().getFullYear()} Ye Ethiopia Lij. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;