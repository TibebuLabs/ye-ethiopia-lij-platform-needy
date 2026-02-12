import React, { useState,  } from 'react';
import { motion, type Variants } from 'framer-motion';
import { 
  User, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  Globe,
  ChevronRight,
  ChevronDown,
  Upload,
  CheckCircle,
  AlertCircle,
  Building,
  Heart,
  GraduationCap,
  Users,
  Settings,
  FileText,
  CreditCard,
  IdCard,
  ArrowLeft,
  X
} from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  role: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface UploadedFile {
  id: string;
  name: string;
  type: string;
  size: number;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

type Language = 'en' | 'am' | 'om' | 'ti';

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [language, setLanguage] = useState<Language>('en');
  const [isLanguageOpen, setIsLanguageOpen] = useState<boolean>(false);
  const [isRoleOpen, setIsRoleOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    role: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [dragActive, setDragActive] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      console.log('Registration attempt:', formData);
      console.log('Uploaded files:', uploadedFiles);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (name === 'password') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password: string): void => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]+/)) strength++;
    if (password.match(/[A-Z]+/)) strength++;
    if (password.match(/[0-9]+/)) strength++;
    if (password.match(/[$@#&!]+/)) strength++;
    setPasswordStrength(strength);
  };

  // File Upload Handlers
  const handleDrag = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList): void => {
    Array.from(files).forEach((file) => {
      const newFile: UploadedFile = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: file.type,
        size: file.size,
        progress: 0,
        status: 'uploading'
      };
      
      setUploadedFiles(prev => [...prev, newFile]);
      simulateFileUpload(newFile.id);
    });
  };

  const simulateFileUpload = (fileId: string): void => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      
      setUploadedFiles(prev =>
        prev.map(file =>
          file.id === fileId
            ? { ...file, progress: progress, status: progress >= 100 ? 'success' : 'uploading' }
            : file
        )
      );

      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 200);
  };

  const removeFile = (fileId: string): void => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleLanguageSelect = (lang: Language): void => {
    setLanguage(lang);
    setIsLanguageOpen(false);
  };

  const handleRoleSelect = (role: string): void => {
    setFormData(prev => ({ ...prev, role }));
    setIsRoleOpen(false);
  };

  const languageOptions = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'am', label: 'አማርኛ', flag: '🇪🇹' },
    { code: 'om', label: 'Oromiffa', flag: '🇪🇹' },
    { code: 'ti', label: 'ትግርኛ', flag: '🇪🇹' }
  ];

  const roleOptions = [
    { value: 'ngo', label: 'NGO', icon: Building, description: 'Non-Governmental Organization' },
    { value: 'orphanage', label: 'Orphanage', icon: Heart, description: 'Child Care Institution' },
    { value: 'religious', label: 'Religious Institution', icon: Users, description: 'Faith-based Organization' },
    { value: 'sponsor', label: 'Individual Sponsor', icon: User, description: 'Personal Sponsor' },
    { value: 'school', label: 'School', icon: GraduationCap, description: 'Educational Institution' },
    { value: 'project', label: 'Project Manager', icon: Settings, description: 'Program Administrator' },
    { value: 'admin', label: 'System Admin', icon: Shield, description: 'Platform Administrator' }
  ];

  const getCurrentLanguage = () => {
    return languageOptions.find(lang => lang.code === language) || languageOptions[0];
  };

  const getSelectedRole = () => {
    return roleOptions.find(role => role.value === formData.role);
  };

  const getPasswordStrengthColor = () => {
    switch(passwordStrength) {
      case 0: return 'bg-gray-200';
      case 1: return 'bg-red-500';
      case 2: return 'bg-orange-500';
      case 3: return 'bg-yellow-500';
      case 4: return 'bg-emerald-500';
      case 5: return 'bg-emerald-600';
      default: return 'bg-gray-200';
    }
  };

  const getPasswordStrengthText = () => {
    switch(passwordStrength) {
      case 0: return 'Enter password';
      case 1: return 'Weak';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Strong';
      case 5: return 'Very Strong';
      default: return 'Enter password';
    }
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
        
        <motion.div 
          className="w-full max-w-md relative z-10"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-gray-100/50 relative">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-600"></div>
            
            <div className="p-8 text-center">
              <motion.div 
                className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <CheckCircle className="text-emerald-600" size={40} />
              </motion.div>
              
              <motion.h2 
                className="text-2xl font-bold text-gray-800 mb-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Registration Submitted!
              </motion.h2>
              
              <motion.p 
                className="text-gray-600 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Your account registration request has been successfully submitted and is awaiting administrator approval.
              </motion.p>
              
              <motion.div 
                className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-start gap-3">
                  <AlertCircle className="text-amber-600 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-sm text-amber-800 text-left">
                    <span className="font-semibold">Pending Approval:</span> You'll receive an email confirmation once your account is verified. This process typically takes 1-2 business days.
                  </p>
                </div>
              </motion.div>
              
              <motion.button
                onClick={() => setIsSubmitted(false)}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 
                         hover:from-emerald-700 hover:to-emerald-600
                         text-white font-semibold py-3.5 px-4 rounded-xl
                         shadow-lg shadow-emerald-200/50 hover:shadow-xl
                         transition-all duration-300 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <ArrowLeft size={18} />
                <span>Back to Registration</span>
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-amber-50 py-8 px-4 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
      
      <motion.div 
        className="w-full max-w-5xl relative z-10"
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
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-600"></div>
          
          <div className="grid md:grid-cols-5 gap-0">
            {/* Left Side - Branding & Documents Required */}
            <div className="md:col-span-2 bg-gradient-to-br from-emerald-600 to-emerald-700 p-6 sm:p-8 text-white">
              <div className="h-full flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                    <Shield className="text-white" size={24} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Ye Ethiopia Lij</h2>
                    <p className="text-xs text-emerald-100">Child Welfare Platform</p>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <FileText size={20} />
                    Required Documents
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <IdCard size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Identification</p>
                        <p className="text-xs text-emerald-100">Government-issued ID, Passport, or Business License</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 bg-white/10 rounded-xl p-3 backdrop-blur-sm">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <CreditCard size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">Bank Statement</p>
                        <p className="text-xs text-emerald-100">Last 3 months bank statement for verification</p>
                      </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-white/10 rounded-xl backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={16} />
                        <span className="text-sm font-medium">Why we need this?</span>
                      </div>
                      <p className="text-xs text-emerald-100 leading-relaxed">
                        To ensure transparency and legitimacy of all partners in our child welfare network. Your documents are encrypted and securely stored.
                      </p>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle size={16} />
                        <span>End-to-end encryption</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <CheckCircle size={16} />
                        <span>GDPR compliant</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm mt-1">
                        <CheckCircle size={16} />
                        <span>24h verification</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-white/20">
                  <p className="text-xs text-emerald-100">
                    Already have an account?{' '}
                    <a href="#" className="text-white font-semibold underline underline-offset-2 hover:no-underline">
                      Sign in
                    </a>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Right Side - Registration Form */}
            <div className="md:col-span-3 p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-1">Create Account</h2>
                <p className="text-sm text-gray-500">Join our network to support children in need</p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Full Name */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    </div>
                    <input
                      id="fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl 
                               bg-gray-50/50 focus:bg-white
                               focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 
                               transition-all duration-200 outline-none text-gray-700
                               placeholder:text-gray-400 hover:border-gray-300"
                      placeholder="John Doe / Organization Name"
                      aria-label="Full name"
                    />
                  </div>
                </motion.div>

                {/* Email */}
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

                {/* Role Dropdown */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Account Type
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsRoleOpen(!isRoleOpen)}
                      className="w-full flex items-center justify-between px-4 py-3 
                               border border-gray-200 rounded-xl bg-gray-50/50
                               hover:border-emerald-300 focus:outline-none focus:ring-2 
                               focus:ring-emerald-500/20 transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        {getSelectedRole() ? (
                          <>
                            {getSelectedRole() && (() => {
                              const Icon = getSelectedRole()?.icon || User;
                              return <Icon className="text-emerald-600" size={18} />;
                            })()}
                            <div className="text-left">
                              <span className="text-sm font-medium text-gray-700">
                                {getSelectedRole()?.label}
                              </span>
                              <p className="text-xs text-gray-500">
                                {getSelectedRole()?.description}
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <User className="text-gray-400" size={18} />
                            <span className="text-sm text-gray-500">Select your account type</span>
                          </>
                        )}
                      </div>
                      <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isRoleOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isRoleOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-20 w-full mt-2 bg-white rounded-xl shadow-xl 
                                 border border-gray-100 overflow-hidden max-h-64 overflow-y-auto"
                      >
                        {roleOptions.map((role) => {
                          const Icon = role.icon;
                          return (
                            <button
                              key={role.value}
                              type="button"
                              onClick={() => handleRoleSelect(role.value)}
                              className={`w-full flex items-center gap-3 px-4 py-3 text-sm 
                                       transition-all duration-200 hover:bg-emerald-50
                                       ${formData.role === role.value ? 'bg-emerald-50' : ''}`}
                            >
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                                            ${formData.role === role.value ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                <Icon size={16} />
                              </div>
                              <div className="flex-1 text-left">
                                <span className={`font-medium ${formData.role === role.value ? 'text-emerald-700' : 'text-gray-700'}`}>
                                  {role.label}
                                </span>
                                <p className="text-xs text-gray-500">{role.description}</p>
                              </div>
                              {formData.role === role.value && (
                                <CheckCircle className="text-emerald-600" size={16} />
                              )}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Password
                  </label>
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
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex gap-1 flex-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-300
                                        ${level <= passwordStrength ? getPasswordStrengthColor() : 'bg-gray-200'}`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-medium text-gray-600 ml-2">
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Use at least 8 characters with uppercase, lowercase, numbers & symbols
                      </p>
                    </div>
                  )}
                </motion.div>

                {/* Confirm Password */}
                <motion.div variants={itemVariants}>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      className={`block w-full pl-10 pr-12 py-3 border rounded-xl 
                               bg-gray-50/50 focus:bg-white
                               focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 
                               transition-all duration-200 outline-none text-gray-700
                               placeholder:text-gray-400 hover:border-gray-300
                               ${formData.confirmPassword && formData.password !== formData.confirmPassword 
                                 ? 'border-red-300 bg-red-50/50' 
                                 : 'border-gray-200'}`}
                      placeholder="••••••••"
                      aria-label="Confirm password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center 
                               text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                      <AlertCircle size={12} />
                      Passwords do not match
                    </p>
                  )}
                </motion.div>

                {/* File Upload Section */}
                <motion.div variants={itemVariants}>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Upload Documents
                  </label>
                  
                  {/* Drag & Drop Zone */}
                  <div
                    className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-200
                              ${dragActive 
                                ? 'border-emerald-500 bg-emerald-50/50' 
                                : 'border-gray-300 hover:border-emerald-400 hover:bg-gray-50/50'}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      multiple
                      onChange={handleFileChange}
                      accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    />
                    
                    <div className="text-center">
                      <Upload className={`mx-auto mb-3 transition-colors duration-200
                                       ${dragActive ? 'text-emerald-600' : 'text-gray-400'}`} 
                              size={32} />
                      <p className="text-sm text-gray-600 mb-1">
                        <span className="font-semibold text-emerald-600 hover:text-emerald-700 cursor-pointer"
                              onClick={() => document.getElementById('file-upload')?.click()}>
                          Click to upload
                        </span>
                        {' '}or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, JPG, PNG, DOC (Max 10MB each)
                      </p>
                    </div>
                  </div>

                  {/* Uploaded Files List */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <p className="text-xs font-medium text-gray-700">Uploaded Files:</p>
                      {uploadedFiles.map((file) => (
                        <div
                          key={file.id}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg border border-gray-100"
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center
                                        ${file.status === 'success' ? 'bg-emerald-100' : 
                                          file.status === 'error' ? 'bg-red-100' : 'bg-amber-100'}`}>
                            {file.status === 'success' ? (
                              <CheckCircle size={16} className="text-emerald-600" />
                            ) : file.status === 'error' ? (
                              <AlertCircle size={16} className="text-red-600" />
                            ) : (
                              <FileText size={16} className="text-amber-600" />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-xs font-medium text-gray-700 truncate">
                                {file.name}
                              </p>
                              <button
                                onClick={() => removeFile(file.id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X size={14} />
                              </button>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-gray-500">
                                {formatFileSize(file.size)}
                              </span>
                              {file.status === 'uploading' && (
                                <>
                                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                                      style={{ width: `${file.progress}%` }}
                                    />
                                  </div>
                                  <span className="text-xs text-gray-500">
                                    {file.progress}%
                                  </span>
                                </>
                              )}
                              {file.status === 'success' && (
                                <span className="text-xs text-emerald-600">Uploaded</span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Terms & Conditions */}
                <motion.div variants={itemVariants}>
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded mt-0.5
                               focus:ring-emerald-500 focus:ring-offset-0
                               cursor-pointer transition-all duration-200
                               group-hover:border-emerald-400"
                      aria-label="Agree to terms"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                      I agree to the{' '}
                      <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-emerald-600 hover:text-emerald-700 font-medium hover:underline">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </motion.div>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isSubmitting || formData.password !== formData.confirmPassword || !formData.agreeTerms || !formData.role}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 
                           hover:from-emerald-700 hover:to-emerald-600
                           text-white font-semibold py-3.5 px-4 rounded-xl
                           shadow-lg shadow-emerald-200/50 hover:shadow-xl hover:shadow-emerald-300/50
                           transition-all duration-300 flex items-center justify-center gap-2
                           disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                           group"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="mt-8 text-center"
          variants={itemVariants}
        >
          <p className="text-xs text-gray-500">
            By registering, you confirm that you have read and agree to our{' '}
            <a href="#" className="text-emerald-600 hover:text-emerald-700 hover:underline">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-emerald-600 hover:text-emerald-700 hover:underline">
              Privacy Policy
            </a>
          </p>
          <p className="text-xs text-gray-400 mt-2">
            © {new Date().getFullYear()} Ye Ethiopia Lij. All rights reserved.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;