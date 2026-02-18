import React, { useState, useEffect } from 'react';
import {
  Dashboard as DashboardIcon,
  Group as GroupIcon,
  VerifiedUser as VerifiedUserIcon,
  ChildCare as ChildCareIcon,
  ContentCopy as ContentCopyIcon,
  HistoryEdu as HistoryEduIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingActionsIcon,
  FamilyRestroom as FamilyRestroomIcon,
  Shield as ShieldIcon,

} from '@mui/icons-material';

// ============== Import AccountAuthorization Component ==============
import AccountAuthorization from './AccountAuthorization';
import { EditIcon } from 'lucide-react';
import UserManagement from '../UserManagement/UserManagement';
import ChildSubmissions from '../ChildSubmissions/ChildSubmissions';
import DuplicationConflicts from '../DuplicationAlerts/DuplicationConflicts';
import AuditLogs from '../AuditLogs/AuditLogs';

// ============== Types and Interfaces ==============

interface SystemMetric {
  id: string;
  label: string;
  value: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ElementType;
  alert?: boolean;
}

interface QueueItem {
  id: number;
  initials: string;
  name: string;
  role: string;
  roleColor: string;
  date: string;
}

interface DuplicateAlert {
  id: number;
  type: 'high' | 'medium' | 'low';
  title: string;
  time: string;
  primary: {
    name: string;
    id?: string;
    dob?: string;
  };
  conflict: {
    name: string;
    id?: string;
    dob?: string;
  };
}

interface AuditItem {
  id: number;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  message: React.ReactNode;
  timestamp: string;
  module: string;
}

// ============== Dashboard Home Component ==============

const DashboardHome: React.FC = () => {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  // System metrics data
  const metrics: SystemMetric[] = [
    {
      id: 'users',
      label: 'Total Users',
      value: '12,450',
      change: '+12%',
      trend: 'up',
      icon: PersonIcon
    },
    {
      id: 'pending',
      label: 'Pending Authorizations',
      value: '85',
      change: 'Active',
      trend: 'neutral',
      icon: PendingActionsIcon
    },
    {
      id: 'duplicates',
      label: 'Flagged Duplicates',
      value: '24',
      change: '-2%',
      trend: 'down',
      icon: WarningIcon,
      alert: true
    },
    {
      id: 'children',
      label: 'Active Children',
      value: '3,120',
      change: '+8%',
      trend: 'up',
      icon: FamilyRestroomIcon
    }
  ];

  // Registration queue data
  const queueItems: QueueItem[] = [
    { 
      id: 1, 
      initials: 'SM', 
      name: 'Sara Mesfin', 
      role: 'Social Worker', 
      roleColor: 'blue',
      date: 'Oct 24, 2023' 
    },
    { 
      id: 2, 
      initials: 'DK', 
      name: 'Dawit Kassahun', 
      role: 'Sub-Admin', 
      roleColor: 'purple',
      date: 'Oct 23, 2023' 
    },
    { 
      id: 3, 
      initials: 'HA', 
      name: 'Hana Alemu', 
      role: 'Social Worker', 
      roleColor: 'blue',
      date: 'Oct 23, 2023' 
    }
  ];

  // Duplication alerts data
  const duplicateAlerts: DuplicateAlert[] = [
    {
      id: 1,
      type: 'high',
      title: 'Identity Mismatch Found',
      time: '15m ago',
      primary: { name: 'Biruk Tadesse', id: '#YEL-4402' },
      conflict: { name: 'Biruk Tadesse G.', id: '#YEL-4911' }
    },
    {
      id: 2,
      type: 'medium',
      title: 'Possible Duplicate',
      time: '2h ago',
      primary: { name: 'Mekdes Ayele', dob: '12/04/2018' },
      conflict: { name: 'Mekdes A.', dob: '12/04/2018' }
    }
  ];

  // Audit stream data
  const auditItems: AuditItem[] = [
    {
      id: 1,
      icon: CheckCircleIcon,
      iconBg: 'bg-green-50',
      iconColor: 'text-[#2E8B57]',
      message: (
        <>
          <span className="font-bold">System</span> approved child submission{' '}
          <span className="text-[#2E8B57] font-bold">#CH-9921</span>
        </>
      ),
      timestamp: '10 minutes ago',
      module: 'Automation Engine'
    },
    {
      id: 2,
      icon: EditIcon,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      message: (
        <>
          <span className="font-bold">Zelalem Worku</span> updated profile 
          permissions for <span className="font-bold">Adisu B.</span>
        </>
      ),
      timestamp: '45 minutes ago',
      module: 'Security Module'
    },
    {
      id: 3,
      icon: WarningIcon,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      message: (
        <>
          <span className="font-bold">Alert:</span> Multiple failed login 
          attempts detected on IP <span className="font-bold">192.168.1.44</span>
        </>
      ),
      timestamp: '1 hour ago',
      module: 'Security Guard'
    }
  ];

  const getRoleColor = (role: string, color: string) => {
    switch(color) {
      case 'blue': return 'bg-blue-50 text-blue-600';
      case 'purple': return 'bg-purple-50 text-purple-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Summary Section */}
      <section>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] 
                         bg-clip-text text-transparent">
              System Overview
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Real-time platform performance and data integrity metrics.
            </p>
          </div>
          <div className="text-xs font-medium text-slate-500 whitespace-nowrap
                        bg-white px-3 py-1.5 rounded-lg shadow-sm">
            Last updated: 2 mins ago
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <StatCard
              key={metric.id}
              metric={metric}
              index={index}
              hoveredStat={hoveredStat}
              setHoveredStat={setHoveredStat}
            />
          ))}
        </div>
      </section>

      {/* Priority Action Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registration Queue */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 
                      flex flex-col overflow-hidden hover:shadow-2xl 
                      transition-all duration-500">
          <div className="p-6 border-b border-slate-100 flex flex-wrap 
                        justify-between items-center gap-2">
            <div>
              <h3 className="font-bold text-lg">Registration Queue</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Approve or reject new administrator requests
              </p>
            </div>
            <button className="text-[#2E8B57] text-xs font-bold 
                             hover:underline hover:scale-105 transition-transform">
              View All
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-[10px] uppercase tracking-wider 
                              text-slate-500 font-bold">
                <tr>
                  <th className="px-6 py-3">Applicant</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queueItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors 
                                              group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`
                          w-8 h-8 rounded-xl flex items-center justify-center 
                          text-xs font-bold transition-all duration-300
                          group-hover:scale-110 group-hover:rotate-6
                          bg-[#2E8B57]/10 text-[#2E8B57]
                        `}>
                          {item.initials}
                        </div>
                        <div className="text-sm font-medium">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        text-xs px-2 py-1 rounded-lg font-medium
                        ${getRoleColor(item.role, item.roleColor)}
                      `}>
                        {item.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button className="px-3 py-1.5 bg-[#2E8B57] text-white 
                                         text-xs font-bold rounded-lg
                                         hover:bg-[#3CB371] hover:scale-105 
                                         transition-all duration-300">
                          Approve
                        </button>
                        <button className="px-3 py-1.5 bg-slate-100 text-slate-600 
                                         text-xs font-bold rounded-lg
                                         hover:bg-slate-200 hover:scale-105 
                                         transition-all duration-300">
                          Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Duplication Alerts */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 
                      flex flex-col overflow-hidden hover:shadow-2xl 
                      transition-all duration-500">
          <div className="p-6 border-b border-slate-100 flex flex-wrap 
                        justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg">Duplication Alerts</h3>
              <span className="bg-amber-100 text-amber-700 text-[10px] 
                             font-extrabold px-2 py-0.5 rounded-full 
                             uppercase tracking-tighter animate-pulse">
                High Priority
              </span>
            </div>
            <button className="text-[#2E8B57] text-xs font-bold 
                             hover:underline hover:scale-105 transition-transform">
              Resolve All
            </button>
          </div>
          
          <div className="p-4 flex flex-col gap-4">
            {duplicateAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`
                  p-4 rounded-xl flex flex-col gap-3 transition-all duration-300
                  hover:scale-[1.02] hover:shadow-md cursor-pointer
                  ${alert.type === 'high' 
                    ? 'bg-amber-50/50 border border-amber-200' 
                    : 'bg-slate-50 border border-slate-200'}
                `}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <WarningIcon className={`
                      text-[20px] transition-transform duration-300
                      group-hover:rotate-12
                      ${alert.type === 'high' ? 'text-amber-500' : 'text-slate-500'}
                    `} />
                    <span className={`
                      text-xs font-bold uppercase
                      ${alert.type === 'high' ? 'text-amber-800' : 'text-slate-600'}
                    `}>
                      {alert.title}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {alert.time}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-xs">
                    <p className="text-slate-500 mb-1">Primary Record</p>
                    <p className="font-bold">{alert.primary.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {alert.primary.id || alert.primary.dob}
                    </p>
                  </div>
                  <div className="text-xs">
                    <p className="text-slate-500 mb-1">Conflicting Record</p>
                    <p className="font-bold">{alert.conflict.name}</p>
                    <p className="text-[10px] text-slate-500">
                      {alert.conflict.id || alert.conflict.dob}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-1">
                  <button className={`
                    flex-1 py-2 text-white text-xs font-bold rounded-lg 
                    shadow-sm transition-all duration-300 hover:scale-105
                    ${alert.type === 'high' 
                      ? 'bg-amber-500 hover:bg-amber-600' 
                      : 'bg-[#2E8B57] hover:bg-[#3CB371]'}
                  `}>
                    {alert.type === 'high' ? 'Merge Records' : 'Review Dispute'}
                  </button>
                  {alert.type === 'high' && (
                    <button className="px-3 py-2 border border-amber-200 
                                     text-amber-700 text-xs font-bold rounded-lg
                                     hover:bg-amber-100 hover:scale-105 
                                     transition-all duration-300">
                      Ignore
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <section className="bg-white rounded-2xl shadow-lg border border-slate-100 
                        p-6 hover:shadow-2xl transition-all duration-500">
        <h3 className="font-bold text-lg mb-6 bg-gradient-to-r from-[#2E8B57] 
                     to-[#3CB371] bg-clip-text text-transparent">
          Global Audit Stream
        </h3>
        
        <div className="space-y-6">
          {auditItems.map((item, index) => (
            <div key={item.id} className="flex gap-4 group">
              <div className={`
                w-10 h-10 rounded-xl flex items-center justify-center
                transition-all duration-300 group-hover:scale-110 
                group-hover:rotate-6 ${item.iconBg} ${item.iconColor}
              `}>
                <item.icon className="text-lg" />
              </div>
              
              <div className={`
                flex-1 transition-all duration-300
                ${index < auditItems.length - 1 
                  ? 'pb-4 border-b border-slate-100' 
                  : ''}
              `}>
                <p className="text-sm font-medium group-hover:text-[#2E8B57] 
                            transition-colors">
                  {item.message}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {item.timestamp} • {item.module}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// ============== Stat Card Component ==============

interface StatCardProps {
  metric: SystemMetric;
  index: number;
  hoveredStat: number | null;
  setHoveredStat: (index: number | null) => void;
}

const StatCard: React.FC<StatCardProps> = ({ metric, index, hoveredStat, setHoveredStat }) => {
  return (
    <div
      className={`
        group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl 
        transition-all duration-500 transform hover:-translate-y-2 cursor-pointer
        border ${metric.alert ? 'border-amber-200' : 'border-slate-100'} 
        overflow-hidden
      `}
      onMouseEnter={() => setHoveredStat(index)}
      onMouseLeave={() => setHoveredStat(null)}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#2E8B57] to-[#3CB371] opacity-0 
                    group-hover:opacity-5 transition-opacity duration-500" />
      
      {/* Decorative circle */}
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-100 rounded-full 
                    group-hover:scale-150 transition-transform duration-700" />
      
      {/* Alert indicator */}
      {metric.alert && (
        <div className="absolute top-0 right-0 w-1 h-full bg-[#FFD700]" />
      )}
      
      <div className="relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`
            p-2 rounded-lg transition-all duration-500
            ${hoveredStat === index ? 'scale-110 rotate-6' : ''}
            ${metric.alert ? 'bg-amber-100' : 'bg-[#2E8B57]/10'}
          `}>
            <metric.icon className={`
              text-2xl transition-all duration-500
              ${metric.alert ? 'text-amber-600' : 'text-[#2E8B57]'}
            `} />
          </div>
          
          {metric.change && (
            <span className={`
              text-xs font-bold px-2 py-1 rounded-full transition-all duration-500
              ${hoveredStat === index ? 'bg-[#2E8B57] text-white' : 
                metric.trend === 'up' ? 'bg-green-50 text-green-600' :
                metric.trend === 'down' ? 'bg-red-50 text-red-600' :
                'bg-gray-50 text-gray-600'}
            `}>
              {metric.change}
            </span>
          )}
        </div>
        
        <p className="text-sm text-slate-500 font-medium">{metric.label}</p>
        <h3 className="text-3xl font-bold mt-1 tracking-tight">{metric.value}</h3>
      </div>
    </div>
  );
};

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

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-30"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl 
                        border border-slate-100 z-40 overflow-hidden animate-slideIn">
            {/* User Info */}
            <div className="p-4 bg-gradient-to-r from-[#2E8B57]/10 to-[#3CB371]/10">
              <p className="font-semibold">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <button 
                onClick={() => {
                  onProfile();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                         text-slate-600 hover:bg-slate-50 transition-all
                         group"
              >
                <PersonIcon className="text-[#2E8B57] text-sm group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">My Profile</span>
              </button>

              <button 
                onClick={() => {
                  onSettings();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                         text-slate-600 hover:bg-slate-50 transition-all
                         group"
              >
                <SettingsIcon className="text-[#2E8B57] text-sm group-hover:rotate-90 transition-transform" />
                <span className="text-sm font-medium">Settings</span>
              </button>

              <div className="h-px bg-slate-100 my-2" />

              <button 
                onClick={() => {
                  onLogout();
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                         text-red-600 hover:bg-red-50 transition-all
                         group"
              >
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

// ============== Main SystemAdminDashboard Component ==============

const SystemAdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activePage, setActivePage] = useState('dashboard');
  // eslint-disable-next-line no-empty-pattern
  const [] = useState(5);

  // Navigation items with onClick handlers
  const navigationItems = [
  { 
    id: 'dashboard', 
    label: 'Dashboard', 
    icon: DashboardIcon, 
    onClick: () => handleNavigation('dashboard') 
  },
  { 
    id: 'users', 
    label: 'User Management', 
    icon: GroupIcon, 
    onClick: () => handleNavigation('users')  // This now points to UserManagement
  },
  { 
    id: 'auth', 
    label: 'Account Authorization', 
    icon: VerifiedUserIcon, 
    onClick: () => handleNavigation('authorization') 
  },
  { 
    id: 'submissions', 
    label: 'Child Submissions', 
    icon: ChildCareIcon, 
    onClick: () => handleNavigation('submissions')  // This now points to ChildSubmissions
  },
   { 
    id: 'duplicates', 
    label: 'Duplication Conflicts', 
    icon: ContentCopyIcon, 
    onClick: () => handleNavigation('duplicates')  // This now points to DuplicationConflicts
  },
 { 
    id: 'audit', 
    label: 'Audit Logs', 
    icon: HistoryEduIcon, 
    onClick: () => handleNavigation('audit')  // This now points to AuditLogs
  }
];

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNavigation = (page: string) => {
    setActivePage(page);
    setMobileSidebarOpen(false);
    console.log(`Navigating to ${page}`);
  };

  const handleLogout = () => {
    alert('Logging out...');
  };

  // Render content based on active page
  // Update the renderContent function:
const renderContent = () => {
  switch(activePage) {
    case 'users':
      return <UserManagement />;
    case 'authorization':
      return <AccountAuthorization />;
    case 'dashboard':
      return <DashboardHome />;
     case 'submissions':
      return <ChildSubmissions onNavigate={handleNavigation} />;
     case 'duplicates':
      return <DuplicationConflicts onNavigate={handleNavigation} />;
     case 'audit':
      return <AuditLogs onNavigate={handleNavigation} />;
    default:
      return <DashboardHome />;
  }
};

  const user = {
    name: 'Abebe Kebede',
    email: 'abebe.k@yel.org',
    role: 'System Administrator',
    avatar: 'https://i.pravatar.cc/150?img=8'
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA] text-[#374151] font-['Inter']">
      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden animate-fadeIn"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        transform transition-all duration-500 ease-in-out
        ${sidebarOpen ? 'w-72' : 'w-24'}
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        bg-gradient-to-b from-white to-slate-50
        border-r border-slate-200 flex flex-col h-full
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
                  <ShieldIcon className="text-white" />
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
                <p className="text-xs text-slate-500">System Admin</p>
              </div>
            </div>
            
            {/* Toggle Button */}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden lg:block p-2 hover:bg-slate-100 rounded-xl transition-all
                       hover:scale-110 active:scale-95"
            >
              {sidebarOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={item.onClick}
              className={`
                relative w-full flex items-center gap-4 px-4 py-3 rounded-xl
                font-medium transition-all duration-300 group
                ${!sidebarOpen && 'lg:justify-center'}
                ${activePage === item.id || (item.id === 'auth' && activePage === 'authorization')
                  ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white shadow-lg scale-105' 
                  : 'text-slate-600 hover:bg-slate-100'
                }
              `}
            >
              <div className={`
                transition-all duration-300
                ${(activePage === item.id || (item.id === 'auth' && activePage === 'authorization')) 
                  ? 'text-white' 
                  : 'text-[#2E8B57]'}
              `}>
                <item.icon />
              </div>
              
              <span className={`
                transition-all duration-500 whitespace-nowrap
                ${!sidebarOpen && 'lg:hidden'}
              `}>
                {item.label}
              </span>
              
              {(activePage === item.id || (item.id === 'auth' && activePage === 'authorization')) 
                && sidebarOpen && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        {/* System Info */}
        <div className="p-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 text-center">
            <p>v2.4.1 • YEL</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#F8F9FA]">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="flex items-center justify-between px-4 lg:px-8 h-20">
            <div className="flex items-center gap-4 flex-1">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-all
                         hover:scale-110 active:scale-95"
              >
                <MenuIcon />
              </button>
              
              {/* Search Bar */}
              <div className="relative w-full max-w-md">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search records, users, or children..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 rounded-xl 
                           border border-slate-200 focus:outline-none 
                           focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent
                           placeholder:text-slate-400"
                />
              </div>
            </div>
            
            {/* Right Side Icons */}
            <div className="flex items-center gap-2 lg:gap-4">
              <button className="relative p-2 text-slate-500 hover:text-[#2E8B57] 
                               transition-all hover:scale-110 active:scale-95">
                <NotificationsIcon />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFD700] 
                               border-2 border-white rounded-full animate-ping" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFD700] 
                               border-2 border-white rounded-full" />
              </button>
              
              <button className="p-2 text-slate-500 hover:text-[#2E8B57] 
                               transition-all hover:scale-110 active:scale-95
                               hover:rotate-90 duration-500">
                <SettingsIcon />
              </button>
              
              {/* User Menu */}
              <UserMenu 
                user={user}
                onLogout={handleLogout}
                onProfile={() => handleNavigation('profile')}
                onSettings={() => handleNavigation('settings')}
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-8 max-w-[1400px] mx-auto w-full animate-fadeIn">
          {renderContent()}
        </div>
      </main>

      {/* Add custom animations */}
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

export default SystemAdminDashboard;