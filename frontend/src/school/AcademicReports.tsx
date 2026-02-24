// ============== AcademicReports.tsx ==============
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  School as SchoolIcon,
  Dashboard as DashboardIcon,
  PersonAdd as PersonAddIcon,
  Update as UpdateIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
  Person as PersonIcon,
  SettingsSuggest as SettingsSuggestIcon,
  FilterAlt as FilterAltIcon,
  BrandingWatermark as BrandingWatermarkIcon,
  Schedule as ScheduleIcon
} from '@mui/icons-material';

// ============== Types and Interfaces ==============

interface ReportConfig {
  reportType: string;
  startDate: string;
  endDate: string;
  gradeLevel: string;
  includeInactive: boolean;
  showDemographics: boolean;
  includeLetterhead: boolean;
  showComments: boolean;
  requireSignature: boolean;
}

interface StudentPreview {
  id: number;
  name: string;
  studentId: string;
  grade: string;
  attendance: number;
  score: number;
  performance: 'Excellent' | 'Good' | 'Average' | 'Poor';
}

// ============== Custom Dropdown Menu Component ==============

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    role: string;
    avatar: string;
  };
  onLogout: () => void;
  onProfile: () => void;
  onSettings: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, onProfile, onSettings }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <div 
        className="flex items-center gap-3 pl-4 lg:pl-6 border-l border-slate-200 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold">{user.name}</p>
          <p className="text-xs text-slate-500">{user.role}</p>
        </div>
        <div className="relative">
          <img 
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl object-cover 
                     border-2 border-[#2E8B57] group-hover:scale-110 
                     transition-transform duration-300"
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 
                        border-2 border-white rounded-full" />
        </div>
      </div>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl 
                        border border-slate-100 z-40 overflow-hidden animate-slideIn">
            <div className="p-4 bg-gradient-to-r from-[#2E8B57]/10 to-[#3CB371]/10">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <div className="p-2">
              <button onClick={() => { onProfile(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all group">
                <PersonIcon className="text-[#2E8B57] text-sm group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">My Profile</span>
              </button>
              <button onClick={() => { onSettings(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all group">
                <SettingsIcon className="text-[#2E8B57] text-sm group-hover:rotate-90 transition-transform" />
                <span className="text-sm font-medium">Settings</span>
              </button>
              <div className="h-px bg-slate-100 my-2" />
              <button onClick={() => { onLogout(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all group">
                <LogoutIcon className="text-sm group-hover:translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ============== NavItem Component ==============

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-4 py-3.5 rounded-xl
        transition-all duration-300 group relative overflow-hidden
        ${active 
          ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white shadow-lg scale-105' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
        }
      `}
    >
      <div className={`
        transition-all duration-300
        ${active ? 'text-white' : 'text-[#2E8B57]'}
      `}>
        <Icon className="text-sm" />
      </div>
      <span className="text-sm font-medium flex-1 text-left">{label}</span>
    </button>
  );
};

// ============== Configuration Card Component ==============

interface ConfigCardProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}

const ConfigCard: React.FC<ConfigCardProps> = ({ icon: Icon, title, children }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500">
      <div className="flex items-center gap-2 text-[#2E8B57] mb-4">
        <Icon className="text-sm" />
        <h3 className="font-bold">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
};

// ============== Toggle Switch Component ==============

interface ToggleSwitchProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`
          w-12 h-6 rounded-full relative transition-all duration-300
          ${checked ? 'bg-[#2E8B57]' : 'bg-slate-300 dark:bg-slate-600'}
        `}
      >
        <div className={`
          absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300
          ${checked ? 'right-1' : 'left-1'}
        `} />
      </button>
    </div>
  );
};

// ============== Main AcademicReports Component ==============

interface AcademicReportsProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const AcademicReports: React.FC<AcademicReportsProps> = ({ onNavigate, onLogout }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [config, setConfig] = useState<ReportConfig>({
    reportType: 'Performance Reports',
    startDate: '2024-09-01',
    endDate: '2024-10-24',
    gradeLevel: 'All Grades',
    includeInactive: false,
    showDemographics: true,
    includeLetterhead: true,
    showComments: false,
    requireSignature: true
  });

  const previewStudents: StudentPreview[] = [
    {
      id: 1,
      name: 'Tewodros Kassaye',
      studentId: 'STU-10221',
      grade: 'Grade 4',
      attendance: 95,
      score: 88.5,
      performance: 'Excellent'
    },
    {
      id: 2,
      name: 'Eden Solomon',
      studentId: 'STU-10222',
      grade: 'Grade 4',
      attendance: 91,
      score: 76.2,
      performance: 'Good'
    },
    {
      id: 3,
      name: 'Samuel Biruk',
      studentId: 'STU-10223',
      grade: 'Grade 4',
      attendance: 78,
      score: 62.0,
      performance: 'Average'
    }
  ];

  const handleNavigation = (page: string) => {
    if (onNavigate) {
      onNavigate(page);
    } else {
      navigate(`/school/${page}`);
    }
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    else {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleProfile = () => navigate('/school/profile');
  const handleSettings = () => navigate('/school/settings');

  const getPerformanceColor = (performance: string) => {
    switch(performance) {
      case 'Excellent': return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-200';
      case 'Good': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-200';
      case 'Average': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-200';
      case 'Poor': return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getAttendanceColor = (attendance: number) => {
    if (attendance >= 85) return 'bg-[#2E8B57]';
    if (attendance >= 70) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const user = {
    name: 'Abebe Kebede',
    email: 'abebe.k@school.et',
    role: 'Administrator',
    avatar: 'https://i.pravatar.cc/150?img=8'
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA] dark:bg-slate-900">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden animate-fadeIn" onClick={() => setMobileSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        transform transition-all duration-500 ease-in-out
        ${sidebarOpen ? 'w-72' : 'w-24'}
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-gradient-to-b from-white to-slate-50 dark:from-[#1a2620] dark:to-[#1a2620]
        border-r border-slate-200 dark:border-white/10 flex flex-col h-full
        shadow-2xl lg:shadow-none
      `}>
        {/* Logo Area */}
        <div className="relative p-6 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2E8B57]/10 to-transparent" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#2E8B57] to-[#3CB371] 
                              rounded-xl flex items-center justify-center shadow-lg
                              animate-pulse-slow">
                  <SchoolIcon className="text-white" />
                </div>
              </div>
              <div className={`
                transition-all duration-500 overflow-hidden
                ${!sidebarOpen ? 'lg:w-0 lg:opacity-0' : 'lg:w-auto lg:opacity-100'}
              `}>
                <span className="text-xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] 
                               bg-clip-text text-transparent whitespace-nowrap">
                  Ye Ethiopia Lij
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">Academic Portal</p>
              </div>
            </div>
            
            {/* Toggle Button */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 hover:bg-slate-100 dark:hover:bg-slate-800 
                       rounded-xl transition-all hover:scale-110 active:scale-95"
            >
              {sidebarOpen ? <ChevronLeftIcon className="text-slate-500" /> : 
               <ChevronRightIcon className="text-slate-500" />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          <NavItem 
            icon={DashboardIcon} 
            label="Dashboard" 
            onClick={() => handleNavigation('dashboard')}
          />
          <NavItem 
            icon={PersonAddIcon} 
            label="Enroll Child" 
            onClick={() => handleNavigation('enroll')}
          />
          <NavItem 
            icon={UpdateIcon} 
            label="Update Status" 
            onClick={() => handleNavigation('update-status')}
          />
          <NavItem 
            icon={AssessmentIcon} 
            label="Generate Report" 
            active={true}
            onClick={() => handleNavigation('reports')}
          />
        </nav>

        {/* User Info in Sidebar (mobile) */}
        <div className="p-4 border-t border-slate-200 dark:border-white/10 lg:hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-[#2E8B57] overflow-hidden">
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.role}</p>
            </div>
            <button onClick={handleLogout} className="text-red-500 hover:text-red-600">
              <LogoutIcon className="text-sm" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] dark:bg-slate-900 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 h-20 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:scale-110">
              <MenuIcon className="text-slate-500" />
            </button>
            
            <div className="flex items-center gap-2 text-sm">
              <span className="text-slate-400">Management</span>
              <ChevronRightIcon className="text-slate-300 text-xs" />
              <span className="font-semibold text-slate-900 dark:text-white">Generate Report</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="p-2 text-slate-500 hover:text-[#2E8B57] transition-all hover:scale-110">
              <NotificationsIcon />
            </button>
            <button className="p-2 text-slate-500 hover:text-[#2E8B57] transition-all hover:scale-110">
              <SettingsIcon />
            </button>
            
            {/* User Menu - Desktop */}
            <div className="hidden lg:block">
              <UserMenu 
                user={user}
                onLogout={handleLogout}
                onProfile={handleProfile}
                onSettings={handleSettings}
              />
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 lg:p-8 max-w-6xl mx-auto w-full space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
                Academic Report Center
              </h2>
              <p className="text-slate-500 text-sm mt-1">
                Configure and export detailed academic and administrative reports.
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white font-semibold rounded-xl hover:shadow-lg transition-all hover:scale-105 shadow-sm">
                <DownloadIcon className="text-sm" />
                Download PDF
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-105 shadow-sm">
                <UploadIcon className="text-sm" />
                Export CSV
              </button>
            </div>
          </div>

          {/* Configuration Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* General Configuration */}
            <ConfigCard icon={SettingsSuggestIcon} title="General Configuration">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
                    Report Type
                  </label>
                  <select 
                    value={config.reportType}
                    onChange={(e) => setConfig({...config, reportType: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20"
                  >
                    <option>Performance Reports</option>
                    <option>Attendance Reports</option>
                    <option>Enrollment Summaries</option>
                    <option>Financial Overview</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={config.startDate}
                      onChange={(e) => setConfig({...config, startDate: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={config.endDate}
                      onChange={(e) => setConfig({...config, endDate: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20"
                    />
                  </div>
                </div>
              </div>
            </ConfigCard>

            {/* Student Selection */}
            <ConfigCard icon={FilterAltIcon} title="Student Selection">
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1.5">
                    Grade Level
                  </label>
                  <select 
                    value={config.gradeLevel}
                    onChange={(e) => setConfig({...config, gradeLevel: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20"
                  >
                    <option>All Grades</option>
                    <option>Grade 1</option>
                    <option>Grade 2</option>
                    <option>Grade 3</option>
                    <option>Grade 4</option>
                  </select>
                </div>
                <ToggleSwitch
                  label="Include Inactive"
                  checked={config.includeInactive}
                  onChange={(checked) => setConfig({...config, includeInactive: checked})}
                />
                <ToggleSwitch
                  label="Show Demographics"
                  checked={config.showDemographics}
                  onChange={(checked) => setConfig({...config, showDemographics: checked})}
                />
              </div>
            </ConfigCard>

            {/* Output Format */}
            <ConfigCard icon={BrandingWatermarkIcon} title="Output Format">
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={config.includeLetterhead}
                    onChange={(e) => setConfig({...config, includeLetterhead: e.target.checked})}
                    className="rounded border-slate-300 text-[#2E8B57] focus:ring-[#2E8B57] focus:ring-offset-0 transition-all group-hover:scale-110"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Include School Letterhead</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={config.showComments}
                    onChange={(e) => setConfig({...config, showComments: e.target.checked})}
                    className="rounded border-slate-300 text-[#2E8B57] focus:ring-[#2E8B57] focus:ring-offset-0 transition-all group-hover:scale-110"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Show Teacher Comments</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={config.requireSignature}
                    onChange={(e) => setConfig({...config, requireSignature: e.target.checked})}
                    className="rounded border-slate-300 text-[#2E8B57] focus:ring-[#2E8B57] focus:ring-offset-0 transition-all group-hover:scale-110"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Signature Line Required</span>
                </label>
                <div className="pt-2">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <InfoIcon className="text-sm" />
                    <span>Report will be saved in archives</span>
                  </div>
                </div>
              </div>
            </ConfigCard>
          </div>

          {/* Live Report Preview */}
          <section className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">Live Report Preview</h2>
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Sample View
                </span>
              </div>
              <button className="text-sm font-semibold text-[#2E8B57] flex items-center gap-1 hover:underline hover:scale-105 transition-all">
                <RefreshIcon className="text-sm" />
                Refresh Preview
              </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
              {/* Report Header */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <img 
                    alt="School Logo" 
                    className="h-12 opacity-60 grayscale" 
                    src="https://via.placeholder.com/48x48?text=Logo" 
                  />
                  <div className="border-l border-slate-200 dark:border-slate-700 pl-4">
                    <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Ye Ethiopia Lij Academy</p>
                    <p className="text-xs text-slate-500 font-medium">Academic Performance Summary Report - Term 1</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase">Generated On</p>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Oct 24, 2024</p>
                </div>
              </div>

              {/* Report Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[11px] uppercase tracking-wider font-bold">
                      <th className="px-6 py-4">Student Identity</th>
                      <th className="px-6 py-4">Current Grade</th>
                      <th className="px-6 py-4">Avg. Attendance</th>
                      <th className="px-6 py-4">Academic Score</th>
                      <th className="px-6 py-4">Performance Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {previewStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#2E8B57] transition-colors">
                              {student.name}
                            </span>
                            <span className="text-xs text-slate-400">{student.studentId}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-slate-700 dark:text-slate-300">{student.grade}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 w-20 bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                              <div 
                                className={`h-2 rounded-full transition-all duration-500 ${getAttendanceColor(student.attendance)}`}
                                style={{ width: `${student.attendance}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">{student.attendance}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-700 dark:text-slate-300">{student.score}/100</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getPerformanceColor(student.performance)}`}>
                            {student.performance}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Preview Footer */}
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex justify-center">
                <span className="text-xs text-slate-400 italic">
                  Showing top 3 entries as preview. Final report contains 124 students.
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-auto py-6 px-8 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 dark:text-slate-400 text-xs font-medium">
            <p>© 2024 Ye Ethiopia Lij Platform. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#2E8B57] transition-colors">Help Center</a>
              <a href="#" className="hover:text-[#2E8B57] transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-[#2E8B57] transition-colors">System Status</a>
            </div>
          </div>
        </footer>
      </main>

      {/* Custom animations */}
      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
};

export default AcademicReports;