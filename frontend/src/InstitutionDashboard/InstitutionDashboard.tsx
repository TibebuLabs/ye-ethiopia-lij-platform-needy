import React, { useState } from 'react';
import {
  Dashboard as DashboardIcon,
  PersonAdd as PersonAddIcon,
  TrackChanges as TrackChangesIcon,
  NoteAlt as NoteAltIcon,
  CalendarToday as CalendarIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ChildCare as ChildCareIcon,
  MedicalServices as MedicalServicesIcon,
  PendingActions as PendingActionsIcon,
  Warning as WarningIcon,
  ImageNotSupported as ImageNotSupportedIcon,
  Description as DescriptionIcon,
  PostAdd as PostAddIcon,
  ContactSupport as ContactSupportIcon,
  CheckCircle as CheckCircleIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Upload as UploadIcon,
  ArrowBack as ArrowBackIcon,
  History as HistoryIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

// ============== Types and Interfaces ==============

interface ActionItem {
  id: number;
  name: string;
  issue: string;
  icon: React.ElementType;
  action: string;
}

interface RecentSubmission {
  id: number;
  name: string;
  type: string;
  time: string;
  status: 'pending' | 'approved' | 'review';
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

interface StatCard {
  id: string;
  label: string;
  value: string;
  icon: React.ElementType;
  trend?: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'warning' | 'success';
}

interface User {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

// ============== User Menu Component ==============

interface UserMenuProps {
  user: User;
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

// ============== Notifications Dropdown Component ==============

interface NotificationsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
}

const NotificationsDropdown: React.FC<NotificationsDropdownProps> = ({ isOpen, onClose, notifications }) => {
  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'warning':
        return <WarningIcon className="text-amber-500" />;
      case 'success':
        return <CheckCircleIcon className="text-green-500" />;
      default:
        return <InfoIcon className="text-blue-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose} />
      <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl 
                    border border-slate-100 z-40 overflow-hidden animate-slideIn">
        <div className="p-4 bg-gradient-to-r from-[#2E8B57]/10 to-[#3CB371]/10 
                      border-b border-slate-100 flex justify-between items-center">
          <div>
            <p className="font-bold">Notifications</p>
            <p className="text-xs text-slate-500">{unreadCount} unread</p>
          </div>
          <button className="text-xs text-[#2E8B57] font-semibold hover:underline">
            Mark all read
          </button>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <NotificationsIcon className="text-4xl mb-2 opacity-30" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id}
                className={`p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 
                          transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50/30' : ''}`}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{notification.title}</p>
                    <p className="text-xs text-slate-500 mt-1">{notification.message}</p>
                    <p className="text-[10px] text-slate-400 mt-2">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-[#2E8B57] rounded-full mt-1" />
                  )}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="p-3 border-t border-slate-100 text-center">
          <button className="text-xs text-[#2E8B57] font-semibold hover:underline">
            View all notifications
          </button>
        </div>
      </div>
    </>
  );
};

// ============== Sidebar Component ==============

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mobileSidebarOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  activePage,
  setActivePage
}) => {
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'submit', label: 'Submit Child Profile', icon: PersonAddIcon },
    { id: 'track', label: 'Track Status', icon: TrackChangesIcon },
    { id: 'intervention', label: 'Intervention Log', icon: NoteAltIcon },
    { id: 'children', label: 'Children List', icon: ChildCareIcon }
    // Reports item removed as requested
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-20 lg:hidden animate-fadeIn"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

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
                  <ChildCareIcon className="text-white" />
                </div>
              </div>
              <div className={`
                transition-all duration-500 overflow-hidden
                ${!sidebarOpen ? 'lg:w-0 lg:opacity-0' : 'lg:w-auto lg:opacity-100'}
              `}>
                <span className="text-xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] 
                               bg-clip-text text-transparent whitespace-nowrap">
                  Institution Portal
                </span>
                <p className="text-xs text-slate-500">St. Gabriel Center</p>
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
              onClick={() => {
                setActivePage(item.id);
                setMobileSidebarOpen(false);
              }}
              className={`
                relative w-full flex items-center gap-4 px-4 py-3 rounded-xl
                font-medium transition-all duration-300 group
                ${!sidebarOpen && 'lg:justify-center'}
                ${activePage === item.id 
                  ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white shadow-lg scale-105' 
                  : 'text-slate-600 hover:bg-slate-100'
                }
              `}
            >
              <div className={`
                transition-all duration-300
                ${activePage === item.id ? 'text-white' : 'text-[#2E8B57]'}
              `}>
                <item.icon className="text-xl" />
              </div>
              
              <span className={`
                transition-all duration-500 whitespace-nowrap text-sm
                ${!sidebarOpen && 'lg:hidden'}
              `}>
                {item.label}
              </span>
              
              {activePage === item.id && sidebarOpen && (
                <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        {/* Institution Info */}
        <div className="p-4 border-t border-slate-200">
          <div className="text-xs text-slate-500 text-center">
            <p>v2.4.1 • YEL</p>
          </div>
        </div>
      </aside>
    </>
  );
};

// ============== Stat Card Component ==============

interface StatCardProps {
  stat: StatCard;
  index: number;
}

const StatCard: React.FC<StatCardProps> = ({ stat }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 
                 shadow-sm hover:shadow-xl transition-all duration-500 
                 hover:-translate-y-2 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4">
        <div className={`
          size-14 rounded-full bg-[#2E8B57]/10 text-[#2E8B57] flex items-center justify-center
          transition-all duration-500 group-hover:scale-110 group-hover:rotate-6
          ${isHovered ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white' : ''}
        `}>
          <stat.icon className="text-3xl" />
        </div>
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">
            {stat.label}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-slate-900 dark:text-slate-50">
              {stat.value}
            </p>
            {stat.trend && (
              <span className="text-xs font-bold text-green-600 bg-green-50 
                             px-1.5 py-0.5 rounded">
                {stat.trend}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== Action Item Component ==============

interface ActionItemProps {
  item: ActionItem;
}

const ActionItem: React.FC<ActionItemProps> = ({ item }) => {
  return (
    <div className="p-6 flex flex-col sm:flex-row sm:items-center 
                    justify-between gap-4 hover:bg-slate-50 transition-all 
                    duration-300 group">
      <div className="flex items-center gap-4">
        <div className="size-12 rounded-lg bg-slate-100 dark:bg-slate-800 
                      flex items-center justify-center text-slate-400
                      group-hover:scale-110 group-hover:rotate-6 transition-all 
                      duration-300 group-hover:bg-[#2E8B57]/10">
          <item.icon className="text-2xl" />
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-slate-100 
                       group-hover:text-[#2E8B57] transition-colors">
            {item.name}
          </p>
          <p className="text-sm text-slate-500">{item.issue}</p>
        </div>
      </div>
      <button className="px-4 py-2 text-[#2E8B57] font-semibold hover:underline 
                       hover:scale-105 transition-all active:scale-95 
                       text-left sm:text-right">
        {item.action}
      </button>
    </div>
  );
};

// ============== Recent Submission Component ==============

interface RecentSubmissionProps {
  submission: RecentSubmission;
}

const RecentSubmission: React.FC<RecentSubmissionProps> = ({ submission }) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending':
        return 'bg-blue-100 text-blue-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'review':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending':
        return 'Pending';
      case 'approved':
        return 'Approved';
      case 'review':
        return 'Under Review';
      default:
        return status;
    }
  };

  return (
    <div className="flex items-start gap-3 pb-4 border-b border-slate-200 
                    last:border-0 last:pb-0 group hover:bg-slate-50 
                    p-2 rounded-lg transition-all duration-300">
      <div className={`
        size-8 rounded-full ${submission.iconBg} ${submission.iconColor} 
        flex items-center justify-center flex-shrink-0
        group-hover:scale-110 group-hover:rotate-6 transition-all duration-300
      `}>
        <submission.icon className="text-sm" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold group-hover:text-[#2E8B57] transition-colors">
          {submission.name}
        </p>
        <p className="text-xs text-slate-500">
          {submission.type} • {submission.time}
        </p>
        <span className={`
          inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase
          ${getStatusColor(submission.status)}
        `}>
          {getStatusText(submission.status)}
        </span>
      </div>
    </div>
  );
};

// ============== Main Dashboard Component ==============

const InstitutionDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activePage, setActivePage] = useState('dashboard');
  const [selectedMonth, setSelectedMonth] = useState('6');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  // Stats data
  const stats: StatCard[] = [
    {
      id: 'children',
      label: 'Active Children',
      value: '128',
      icon: ChildCareIcon,
      trend: '+12%'
    },
    {
      id: 'interventions',
      label: 'Recent Interventions',
      value: '45',
      icon: MedicalServicesIcon,
      trend: '+8%'
    },
    {
      id: 'pending',
      label: 'Pending Approvals',
      value: '12',
      icon: PendingActionsIcon
    },
    {
      id: 'staff',
      label: 'Staff Members',
      value: '8',
      icon: PersonIcon,
      trend: '+2'
    }
  ];

  // Action items data
  const actionItems: ActionItem[] = [
    {
      id: 1,
      name: 'Abebe Kebede',
      issue: 'Profile photo missing clear lighting. Please re-upload.',
      icon: ImageNotSupportedIcon,
      action: 'Correct Profile'
    },
    {
      id: 2,
      name: 'Sara Tesfaye',
      issue: 'Intervention log dated 10/12/23 is missing physician signature.',
      icon: DescriptionIcon,
      action: 'Update Log'
    }
  ];

  // Recent submissions data
  const recentSubmissions: RecentSubmission[] = [
    {
      id: 1,
      name: 'Mekdes Ayele',
      type: 'Medical Intervention',
      time: '2 hrs ago',
      status: 'pending',
      icon: DescriptionIcon,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      id: 2,
      name: 'Dawit Belay',
      type: 'New Profile',
      time: '5 hrs ago',
      status: 'approved',
      icon: CheckCircleIcon,
      iconBg: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      id: 3,
      name: 'Hirut Bekele',
      type: 'Educational Grant',
      time: 'Yesterday',
      status: 'review',
      icon: DescriptionIcon,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-600'
    }
  ];

  // Notifications data
  const notifications: Notification[] = [
    {
      id: 1,
      title: 'New Submission',
      message: 'A new child profile has been submitted for review.',
      time: '5 minutes ago',
      read: false,
      type: 'info'
    },
    {
      id: 2,
      title: 'Approval Required',
      message: 'Medical intervention report needs your approval.',
      time: '1 hour ago',
      read: false,
      type: 'warning'
    },
    {
      id: 3,
      title: 'Update Successful',
      message: 'Child profile has been successfully updated.',
      time: '3 hours ago',
      read: true,
      type: 'success'
    }
  ];

  // Quick actions data
  const quickActions = [
    { id: 1, label: 'New Child Profile', icon: PersonAddIcon },
    { id: 2, label: 'Log Weekly Report', icon: PostAddIcon },
    { id: 3, label: 'Contact Regional Admin', icon: ContactSupportIcon }
    // Removed "Generate Report" quick action to match sidebar removal
  ];

  // Activities data
  const activities = [
    {
      id: 1,
      icon: <MedicalServicesIcon />,
      title: 'Health checkup completed',
      childName: 'Abebe Kebede',
      timestamp: 'Today, 10:30 AM',
      description: 'Routine quarterly checkup. Results within normal ranges.',
      type: 'health'
    },
    {
      id: 2,
      icon: <CheckCircleIcon />,
      title: 'Submission approved',
      childName: 'Tigist Alemu',
      timestamp: '2 days ago',
      description: 'Child profile has been approved and is now visible to sponsors.',
      type: 'submission'
    }
  ];

  const user: User = {
    name: 'Abeba Tesfaye',
    email: 'abeba.tesfaye@stgabriel.org',
    role: 'Institution Admin',
    avatar: 'https://i.pravatar.cc/150?img=7'
  };

  const handleLogout = () => {
    alert('Logging out...');
  };

  const handleProfile = () => {
    setActivePage('profile');
  };

  const handleSettings = () => {
    setActivePage('settings');
  };

  // Chart data
  const chartData = [
    { month: 'May', value: 40 },
    { month: 'Jun', value: 65 },
    { month: 'Jul', value: 55 },
    { month: 'Aug', value: 85 },
    { month: 'Sep', value: 95 },
    { month: 'Oct', value: 60 }
  ];

  const getActivityColor = (type: string) => {
    switch(type) {
      case 'health': return 'text-blue-500 bg-blue-50';
      case 'education': return 'text-purple-500 bg-purple-50';
      case 'submission': return 'text-orange-500 bg-orange-50';
      default: return 'text-slate-500 bg-slate-50';
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA] text-[#374151]">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="flex-1 overflow-y-auto bg-[#F8F9FA]">
        {/* Modern Header with User Menu */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-xl border-b border-slate-200">
          <div className="flex items-center justify-between px-4 lg:px-8 h-20">
            <div className="flex items-center gap-4">
              {/* Mobile Menu Button */}
              <button 
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-xl transition-all
                         hover:scale-110 active:scale-95"
              >
                <MenuIcon />
              </button>
              
              {/* Page Title */}
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] 
                           bg-clip-text text-transparent animate-slideIn">
                Institution Dashboard
              </h1>
            </div>
            
            {/* Right Side Icons */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Search */}
              <button className="hidden lg:block p-2 text-slate-500 hover:text-[#2E8B57] 
                               transition-all hover:scale-110 active:scale-95">
                <SearchIcon />
              </button>

              {/* Notifications */}
              <div className="relative">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-2 text-slate-500 hover:text-[#2E8B57] 
                           transition-all hover:scale-110 active:scale-95 relative"
                >
                  <NotificationsIcon />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFD700] 
                                 border-2 border-white rounded-full animate-ping" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFD700] 
                                 border-2 border-white rounded-full" />
                </button>
                
                <NotificationsDropdown 
                  isOpen={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  notifications={notifications}
                />
              </div>
              
              {/* User Menu Dropdown */}
              <UserMenu 
                user={user}
                onLogout={handleLogout}
                onProfile={handleProfile}
                onSettings={handleSettings}
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
          {/* Animated Welcome Banner */}
          <div className={`
            relative bg-gradient-to-r from-[#2E8B57] to-[#3CB371] rounded-2xl p-8 text-white overflow-hidden shadow-xl
            transition-all duration-500 transform hover:scale-[1.02] cursor-pointer
            ${showWelcome ? 'opacity-100' : 'opacity-90'}
          `}
          onClick={() => setShowWelcome(!showWelcome)}
          >
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full animate-pulse" />
              <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-white rounded-full animate-pulse delay-1000" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
                  Welcome Back
                </span>
              </div>
              <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
                St. Gabriel Center 👋
              </h2>
              <p className="text-white/90 leading-relaxed max-w-2xl text-lg">
                You're making a difference in the lives of 128 children. Track your impact, 
                manage submissions, and monitor interventions all in one place.
              </p>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={stat.id}
                className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl 
                         transition-all duration-500 transform hover:-translate-y-2 cursor-pointer
                         border border-slate-100 overflow-hidden"
                onMouseEnter={() => setHoveredStat(index)}
                onMouseLeave={() => setHoveredStat(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#2E8B57] to-[#3CB371] opacity-0 
                              group-hover:opacity-5 transition-opacity duration-500" />
                
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-100 rounded-full 
                              group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`
                      text-3xl transition-all duration-500
                      ${hoveredStat === index ? 'scale-110 rotate-12' : ''}
                      text-[#2E8B57]
                    `} />
                    {stat.trend && (
                      <span className={`
                        text-xs font-bold px-2 py-1 rounded-full transition-all duration-500
                        ${hoveredStat === index ? 'bg-[#2E8B57] text-white' : 'bg-green-100 text-green-700'}
                      `}>
                        {stat.trend}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-500">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-12 gap-8">
            {/* Left Column */}
            <div className="col-span-12 lg:col-span-8 space-y-8">
              {/* Action Required */}
              <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500">
                <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-lg font-bold flex items-center gap-2">
                    <WarningIcon className="text-amber-500" />
                    Action Required
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold uppercase animate-pulse">
                    3 Needs Correction
                  </span>
                </div>
                <div className="divide-y divide-slate-200">
                  {actionItems.map(item => (
                    <ActionItem key={item.id} item={item} />
                  ))}
                </div>
              </section>

              {/* Activity Timeline */}
              <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
                <h3 className="text-lg font-bold mb-6">Recent Activity</h3>
                <div className="space-y-6">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4 group">
                      <div className="relative">
                        <div className={`
                          w-12 h-12 rounded-2xl flex items-center justify-center
                          transition-all duration-300 group-hover:scale-110 group-hover:rotate-6
                          ${getActivityColor(activity.type)}
                        `}>
                          {activity.icon}
                        </div>
                        {index < activities.length - 1 && (
                          <div className="absolute top-12 bottom-[-24px] left-1/2 -translate-x-1/2 
                                        w-0.5 bg-gradient-to-b from-[#2E8B57]/20 to-transparent" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <p className="font-bold group-hover:text-[#2E8B57] transition-colors">
                          {activity.title}
                        </p>
                        <p className="text-xs text-slate-500 mb-2 flex items-center gap-2">
                          <span className="font-medium">{activity.childName}</span>
                          <span>•</span>
                          <span>{activity.timestamp}</span>
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 
                                  p-3 rounded-xl group-hover:bg-slate-100 transition-colors">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Chart Section */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                  <h3 className="text-lg font-bold">Support Impact Tracking</h3>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="text-sm border-slate-200 rounded-lg focus:ring-[#2E8B57] focus:border-[#2E8B57] px-3 py-2 bg-slate-50"
                  >
                    <option value="6">Last 6 Months</option>
                    <option value="12">Last 12 Months</option>
                  </select>
                </div>

                <div className="h-64 flex items-end gap-4 px-2">
                  {chartData.map((data, index) => {
                    const opacity = ['20', '40', '60', '80', '', '30'][index];
                    const bgColor = opacity ? `bg-[#2E8B57]/${opacity}` : 'bg-[#2E8B57]';
                    
                    return (
                      <div key={data.month} className="flex-1 flex flex-col items-center gap-2 group">
                        <div 
                          className={`w-full ${bgColor} group-hover:opacity-80 rounded-t transition-all duration-500 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-[#2E8B57]/20`}
                          style={{ height: `${data.value}%` }}
                        />
                        <span className="text-xs font-medium text-slate-400">{data.month}</span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-6 flex flex-wrap gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#2E8B57]"></span>
                    <span className="text-slate-500">Nutritional Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#2E8B57]/30"></span>
                    <span className="text-slate-500">Health Interventions</span>
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column */}
            <div className="col-span-12 lg:col-span-4 space-y-8">
              {/* Quick Actions */}
              <section className="bg-[#2E8B57]/5 p-6 rounded-2xl border border-[#2E8B57]/20 hover:shadow-xl transition-all duration-500">
                <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  {quickActions.map(action => (
                    <button
                      key={action.id}
                      className="w-full flex items-center justify-start gap-3 p-4 bg-white rounded-lg 
                               border border-slate-200 hover:border-[#2E8B57] transition-all 
                               group hover:scale-[1.02] active:scale-95"
                    >
                      <action.icon className="text-[#2E8B57] group-hover:scale-110 
                                            transition-transform duration-300" />
                      <span className="font-medium text-sm">{action.label}</span>
                    </button>
                  ))}
                </div>
              </section>

              {/* Recent Submissions */}
              <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-500">
                <h3 className="text-lg font-bold mb-4">Recent Submissions</h3>
                <div className="space-y-4">
                  {recentSubmissions.map(submission => (
                    <RecentSubmission key={submission.id} submission={submission} />
                  ))}
                </div>
                <button className="w-full mt-4 py-2 text-[#2E8B57] font-bold text-sm 
                                 hover:bg-[#2E8B57]/5 rounded-lg transition-all 
                                 hover:scale-105 active:scale-95">
                  View All Activities
                </button>
              </section>

              {/* Institution Info Card */}
              <section className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-2xl shadow-2xl
                                hover:scale-[1.02] transition-all duration-500">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <HistoryIcon className="text-[#2E8B57]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">Member Since</p>
                    <p className="text-[10px] text-white/60 uppercase tracking-widest">
                      January 2023
                    </p>
                  </div>
                </div>
                
                <p className="text-xs text-white/80 leading-relaxed">
                  Your institution has been actively participating in the program for over 1 year.
                  Total children supported: <span className="text-[#2E8B57] font-bold">128</span>
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Custom Animations */}
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

export default InstitutionDashboard;