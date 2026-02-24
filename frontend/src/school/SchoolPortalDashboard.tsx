// ============== SchoolPortalDashboard.tsx ==============
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  Group as GroupIcon,
  EventAvailable as EventAvailableIcon,
  Insights as InsightsIcon,
  Description as DescriptionIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  PriorityHigh as PriorityHighIcon,
  AddCircle as AddCircleIcon,
  EditDocument as EditDocumentIcon,
  Share as ShareIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  MilitaryTech as MilitaryTechIcon
} from '@mui/icons-material';

// ============== Types and Interfaces ==============

type PageType = 'dashboard' | 'enroll' | 'update' | 'reports';

interface Activity {
  id: number;
  title: string;
  description: string;
  time: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  dotColor: string;
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

// ============== Stat Card Component ==============

interface StatCardProps {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  trend: string;
  trendColor: string;
  trendIcon: React.ElementType;
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon: Icon, 
  iconBg, 
  iconColor, 
  label, 
  value, 
  trend, 
  trendColor, 
  trendIcon: TrendIcon 
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="group bg-white dark:bg-slate-900 rounded-2xl p-6 
                border border-slate-200 dark:border-slate-800 
                shadow-lg hover:shadow-2xl transition-all duration-500 
                hover:-translate-y-2 cursor-pointer relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#2E8B57] to-[#3CB371] 
                    opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-100 
                    dark:bg-slate-800 rounded-full group-hover:scale-150 
                    transition-transform duration-700" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`
            p-3 rounded-xl transition-all duration-500
            ${hovered ? 'scale-110 rotate-6' : ''}
            ${iconBg}
          `}>
            <Icon className={`text-2xl ${iconColor}`} />
          </div>
          
          <span className="text-xs font-bold text-emerald-600 bg-emerald-50 
                         dark:bg-emerald-900/20 dark:text-emerald-400 px-2 py-1 rounded-full">
            +12%
          </span>
        </div>
        
        <p className="text-sm text-slate-500 font-medium">{label}</p>
        <h3 className="text-3xl font-bold mt-1 tracking-tight text-slate-900 dark:text-white">
          {value}
        </h3>
        
        <p className={`text-xs ${trendColor} mt-2 flex items-center font-semibold`}>
          <TrendIcon className="text-xs mr-1" />
          {trend}
        </p>
      </div>
    </div>
  );
};

// ============== Activity Item Component ==============

interface ActivityItemProps {
  activity: Activity;
  isLast: boolean;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity, isLast }) => {
  return (
    <div className="flex gap-4 relative group">
      {!isLast && (
        <div className="absolute left-2.5 top-8 bottom-0 w-px bg-gradient-to-b from-slate-200 to-transparent dark:from-slate-700" />
      )}
      
      <div className={`
        w-5 h-5 rounded-full flex items-center justify-center shrink-0 z-10 
        border-2 border-white dark:border-slate-900 transition-all duration-300
        group-hover:scale-110 ${activity.iconBg}
      `}>
        <div className={`w-2 h-2 rounded-full ${activity.dotColor}`} />
      </div>
      
      <div className="flex-1 pb-6">
        <p className="text-sm font-semibold text-slate-900 dark:text-white 
                    group-hover:text-[#2E8B57] transition-colors">
          {activity.title}
        </p>
        <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
        <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
          <ScheduleIcon className="text-xs" />
          {activity.time}
        </p>
      </div>
    </div>
  );
};

// ============== Quick Action Button Component ==============

interface QuickActionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  bgColor: string;
  textColor: string;
  onClick?: () => void;
}

const QuickAction: React.FC<QuickActionProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  bgColor,
  textColor,
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 p-4 rounded-xl transition-all 
                 duration-300 group hover:shadow-lg ${bgColor} ${textColor}
                 hover:scale-105 active:scale-95`}
    >
      <div className="p-2 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
        <Icon className="text-sm" />
      </div>
      <div className="text-left">
        <p className="text-sm font-bold">{title}</p>
        <p className="text-[10px] opacity-70">{description}</p>
      </div>
    </button>
  );
};

// ============== Dashboard Content Component ==============

interface DashboardContentProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  onNavigate: (page: string) => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ searchTerm, setSearchTerm, onNavigate }) => {
  const activities: Activity[] = [
    {
      id: 1,
      title: 'Child Enrolled',
      description: 'Selam Mekonnen was enrolled in Grade 2.',
      time: '2 hours ago',
      icon: PersonAddIcon,
      iconBg: 'bg-[#2E8B57]/20',
      iconColor: 'text-[#2E8B57]',
      dotColor: 'bg-[#2E8B57]'
    },
    {
      id: 2,
      title: 'Status Updated',
      description: 'Academic status for Bereket Tadesse set to "Excellent".',
      time: '4 hours ago',
      icon: UpdateIcon,
      iconBg: 'bg-[#FFD700]/20',
      iconColor: 'text-[#FFD700]',
      dotColor: 'bg-[#FFD700]'
    },
    {
      id: 3,
      title: 'Report Generated',
      description: 'Term 2 Performance Report exported as PDF.',
      time: 'Yesterday',
      icon: AssessmentIcon,
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-500',
      dotColor: 'bg-blue-500'
    },
    {
      id: 4,
      title: 'System Backup',
      description: 'Automated cloud backup completed successfully.',
      time: '2 days ago',
      icon: SettingsIcon,
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-400',
      dotColor: 'bg-slate-400'
    }
  ];

  const stats = [
    {
      icon: GroupIcon,
      iconBg: 'bg-[#2E8B57]/10',
      iconColor: 'text-[#2E8B57]',
      label: 'Total Students',
      value: '1,284',
      trend: '+12% from last term',
      trendColor: 'text-[#2E8B57]',
      trendIcon: TrendingUpIcon
    },
    {
      icon: EventAvailableIcon,
      iconBg: 'bg-[#2E8B57]/10',
      iconColor: 'text-[#2E8B57]',
      label: 'Avg. Attendance',
      value: '94.2%',
      trend: 'Target: 90%',
      trendColor: 'text-emerald-500',
      trendIcon: CheckCircleIcon
    },
    {
      icon: InsightsIcon,
      iconBg: 'bg-[#FFD700]/20',
      iconColor: 'text-amber-600',
      label: 'Performance Trend',
      value: 'High',
      trend: 'Top 5% Regionally',
      trendColor: 'text-slate-400',
      trendIcon: MilitaryTechIcon
    },
    {
      icon: DescriptionIcon,
      iconBg: 'bg-red-50',
      iconColor: 'text-red-600',
      label: 'Pending Reports',
      value: '08',
      trend: 'Due by Friday',
      trendColor: 'text-red-500',
      trendIcon: PriorityHighIcon
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
          Academic Overview
        </h2>
        <p className="text-slate-500 text-sm">Real-time statistics for the current academic year.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      {/* Charts and Activities Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Performance Chart */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">Academic Performance</h4>
              <p className="text-xs text-slate-400">Monthly progress tracking across all grades</p>
            </div>
            <div className="flex gap-2">
              <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                2023
              </span>
              <span className="flex items-center gap-1 text-[10px] font-bold text-white bg-gradient-to-r from-[#2E8B57] to-[#3CB371] px-2 py-1 rounded shadow-lg">
                2024
              </span>
            </div>
          </div>

          <div className="h-64 flex items-end justify-between relative px-2">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="border-t border-slate-100 dark:border-slate-800 w-full h-px" />
              ))}
            </div>

            {/* Bars */}
            {[
              { month: 'Sept', current: 65, previous: 40 },
              { month: 'Oct', current: 75, previous: 50 },
              { month: 'Nov', current: 82, previous: 55 },
              { month: 'Dec', current: 78, previous: 48 },
              { month: 'Jan', current: 85, previous: 60 },
              { month: 'Feb', current: 92, previous: 65 }
            ].map((item, index) => (
              <div key={index} className="flex flex-col items-center gap-2 group relative h-full justify-end">
                <div className="relative w-16">
                  {/* Previous Year Bar */}
                  <div 
                    className="absolute bottom-0 left-0 w-6 bg-slate-200 dark:bg-slate-700 rounded-t-lg transition-all duration-300 group-hover:bg-[#2E8B57]/20"
                    style={{ height: `${item.previous}%`, left: '0' }}
                  />
                  {/* Current Year Bar */}
                  <div 
                    className="absolute bottom-0 right-0 w-6 bg-gradient-to-t from-[#2E8B57] to-[#3CB371] rounded-t-lg shadow-lg transition-all duration-300 group-hover:scale-105"
                    style={{ height: `${item.current}%`, right: '0' }}
                  />
                  {item.month === 'Feb' && (
                    <div className="absolute -top-2 right-0 w-6 h-1 bg-[#FFD700] rounded-t-lg" />
                  )}
                </div>
                <span className="text-[10px] font-medium text-slate-400 mt-2">{item.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg p-6 hover:shadow-2xl transition-all duration-500">
          <div className="flex items-center justify-between mb-6">
            <h4 className="font-bold text-slate-900 dark:text-white">Recent Activities</h4>
            <button className="text-[#2E8B57] text-xs font-bold hover:underline hover:scale-105 transition-all">
              View All
            </button>
          </div>

          <div className="space-y-6">
            {activities.map((activity, index) => (
              <ActivityItem 
                key={activity.id} 
                activity={activity} 
                isLast={index === activities.length - 1}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <QuickAction
          icon={AddCircleIcon}
          title="Quick Enroll"
          description="New student registration"
          bgColor="bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white"
          textColor="text-white"
          onClick={() => onNavigate('enroll')}
        />
        
        <QuickAction
          icon={EditDocumentIcon}
          title="Attendance Log"
          description="Update daily classroom log"
          bgColor="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white"
          textColor="text-slate-700 dark:text-white"
          onClick={() => alert('Attendance Log')}
        />
        
        <QuickAction
          icon={ShareIcon}
          title="Share Portal"
          description="Invite teacher or faculty"
          bgColor="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-white"
          textColor="text-slate-700 dark:text-white"
          onClick={() => alert('Share Portal')}
        />
      </div>
    </div>
  );
};

// ============== EnrollChildContent Component ==============

const EnrollChildContent: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
      <PersonAddIcon className="text-6xl text-[#2E8B57]/30 mb-4" />
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Enroll Child (UC-15)</h3>
      <p className="text-slate-500">Enroll an approved child into your school</p>
    </div>
  );
};

// ============== UpdateStatusContent Component ==============

const UpdateStatusContent: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
      <UpdateIcon className="text-6xl text-[#2E8B57]/30 mb-4" />
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Update Academic Status (UC-16)</h3>
      <p className="text-slate-500">Update academic information for enrolled children</p>
    </div>
  );
};

// ============== ReportsContent Component ==============

const ReportsContent: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
      <AssessmentIcon className="text-6xl text-[#2E8B57]/30 mb-4" />
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Academic Reports</h3>
      <p className="text-slate-500">Generate and view academic performance reports</p>
    </div>
  );
};

// ============== Main SchoolPortalDashboard Component ==============

interface SchoolPortalDashboardProps {
  onLogout?: () => void;
}

const SchoolPortalDashboard: React.FC<SchoolPortalDashboardProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Determine active page based on URL path
  const getActivePage = (): PageType => {
    const path = location.pathname.split('/').pop();
    if (path === 'dashboard') return 'dashboard';
    if (path === 'enroll') return 'enroll';
    if (path === 'update-status') return 'update';
    if (path === 'reports') return 'reports';
    return 'dashboard';
  };

  const activePage = getActivePage();

  const handleNavigation = (page: string) => {
    navigate(`/school/${page}`);
    setMobileSidebarOpen(false);
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

  const renderContent = () => {
    switch(activePage) {
      case 'dashboard':
        return <DashboardContent searchTerm={searchTerm} setSearchTerm={setSearchTerm} onNavigate={handleNavigation} />;
      case 'enroll':
        return <EnrollChildContent />;
      case 'update':
        return <UpdateStatusContent />;
      case 'reports':
        return <ReportsContent />;
      default:
        return <DashboardContent searchTerm={searchTerm} setSearchTerm={setSearchTerm} onNavigate={handleNavigation} />;
    }
  };

  const user = {
    name: 'Abebe Kebede',
    email: 'abebe.k@school.et',
    role: 'School Administrator',
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
                <p className="text-xs text-slate-500 dark:text-slate-400">School Portal</p>
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
            active={activePage === 'dashboard'}
            onClick={() => handleNavigation('dashboard')}
          />
          <NavItem 
            icon={PersonAddIcon} 
            label="Enroll Child" 
            active={activePage === 'enroll'}
            onClick={() => handleNavigation('enroll')}
          />
          <NavItem 
            icon={UpdateIcon} 
            label="Update Status" 
            active={activePage === 'update'}
            onClick={() => handleNavigation('update-status')}
          />
          <NavItem 
            icon={AssessmentIcon} 
            label="Generate Report" 
            active={activePage === 'reports'}
            onClick={() => handleNavigation('reports')}
          />
        </nav>

        {/* Empty div to maintain spacing */}
        <div className="p-4" />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] dark:bg-slate-900 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 h-20 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Button */}
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:scale-110 active:scale-95">
              <MenuIcon className="text-slate-500" />
            </button>
            
            {/* Page Title */}
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
                {activePage === 'dashboard' && 'School Dashboard'}
                {activePage === 'enroll' && 'Enroll Child'}
                {activePage === 'update' && 'Update Academic Status'}
                {activePage === 'reports' && 'Academic Reports'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {activePage === 'dashboard' && 'Welcome back, School Administrator'}
                {activePage === 'enroll' && 'Enroll an approved child into your school (UC-15)'}
                {activePage === 'update' && 'Update academic information for enrolled children (UC-16)'}
                {activePage === 'reports' && 'Generate and view academic performance reports'}
              </p>
            </div>
          </div>

          {/* Search - only show on dashboard */}
          {activePage === 'dashboard' && (
            <div className="hidden lg:block relative w-64 mr-4">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search students, classes..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20 placeholder:text-slate-400"
              />
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4 lg:gap-6">
            {/* Notifications */}
            <button className="relative p-2 text-slate-500 hover:text-[#2E8B57] transition-all hover:scale-110 active:scale-95">
              <NotificationsIcon />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFD700] border-2 border-white rounded-full animate-ping" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFD700] border-2 border-white rounded-full" />
            </button>

            {/* Help Button */}
            <button className="p-2 text-slate-500 hover:text-[#2E8B57] transition-all hover:scale-110 active:scale-95">
              <HelpIcon className="text-sm" />
            </button>

            {/* User Menu */}
            <UserMenu 
              user={user}
              onLogout={handleLogout}
              onProfile={handleProfile}
              onSettings={handleSettings}
            />
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 lg:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
          {renderContent()}
        </div>

        {/* Footer */}
        <footer className="mt-auto py-6 px-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs font-medium">
            <p>© 2024 Ye Ethiopia Lij Integrated Platform. School Portal v1.0</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#2E8B57] transition-colors">Documentation</a>
              <a href="#" className="hover:text-[#2E8B57] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#2E8B57] transition-colors">Support</a>
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

export default SchoolPortalDashboard;