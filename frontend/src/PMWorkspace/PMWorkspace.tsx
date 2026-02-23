// ============== PMWorkspace.tsx ==============
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  ContentCopy as ContentCopyIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  NotificationsActive as NotificationsActiveIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Help as HelpIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  RateReview as RateReviewIcon,
  ReportProblem as ReportProblemIcon,
  Description as DescriptionIcon,
  FilterList as FilterListIcon,
  Add as AddIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Person as PersonIcon,
  Diversity1 as Diversity1Icon,
  CalendarToday as CalendarIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Layers as LayersIcon
} from '@mui/icons-material';

// Import the ResolvedDuplications component
import ResolvedDuplications from './ResolvedDuplications';
import FinancialDocuments from './FinancialDocuments';
import NotificationsCenter from './NotificationsCenter';

// ============== Types and Interfaces ==============

interface MetricCard {
  id: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: number;
  change: number;
  trend: 'up' | 'down';
}

interface Task {
  id: number;
  title: string;
  priority: 'high' | 'medium' | 'low';
  due: string;
  completed: boolean;
}

interface QueueItem {
  id: number;
  beneficiary: string;
  issueType: string;
  issueColor: string;
  issueBg: string;
  reportDate: string;
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

// ============== Metric Card Component ==============

interface MetricCardProps {
  metric: MetricCard;
  index: number;
  hoveredCard: number | null;
  setHoveredCard: (index: number | null) => void;
}

const MetricCard: React.FC<MetricCardProps> = ({ metric, index, hoveredCard, setHoveredCard }) => {
  return (
    <div
      className="group bg-white dark:bg-slate-900 rounded-2xl p-6 
                border border-slate-200 dark:border-slate-800 
                shadow-lg hover:shadow-2xl transition-all duration-500 
                hover:-translate-y-2 cursor-pointer relative overflow-hidden"
      onMouseEnter={() => setHoveredCard(index)}
      onMouseLeave={() => setHoveredCard(null)}
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
            ${hoveredCard === index ? 'scale-110 rotate-6' : ''}
            ${metric.iconBg}
          `}>
            <metric.icon className={`text-2xl ${metric.iconColor}`} />
          </div>
          
          <span className={`
            text-xs font-bold px-2 py-1 rounded-full 
            flex items-center gap-1 transition-all duration-500
            ${hoveredCard === index ? 'bg-[#2E8B57] text-white' : 
              metric.trend === 'up' ? 'bg-green-50 text-green-600' : 
              'bg-red-50 text-red-600'}
          `}>
            {metric.trend === 'up' ? <ArrowUpwardIcon className="text-xs" /> : 
             <ArrowDownwardIcon className="text-xs" />}
            {metric.change}%
          </span>
        </div>
        
        <p className="text-sm text-slate-500 font-medium">{metric.label}</p>
        <h3 className="text-3xl font-bold mt-1 tracking-tight text-slate-900 dark:text-white">
          {metric.value}
        </h3>
      </div>
    </div>
  );
};

// ============== Task Item Component ==============

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'high':
        return {
          bg: 'bg-red-100 dark:bg-red-900/20',
          text: 'text-red-600 dark:text-red-400',
          label: 'High'
        };
      case 'medium':
        return {
          bg: 'bg-blue-100 dark:bg-blue-900/20',
          text: 'text-blue-600 dark:text-blue-400',
          label: 'Medium'
        };
      case 'low':
        return {
          bg: 'bg-slate-100 dark:bg-slate-800',
          text: 'text-slate-600 dark:text-slate-400',
          label: 'Low'
        };
      default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-600',
          label: 'Unknown'
        };
    }
  };

  const priority = getPriorityBadge(task.priority);

  return (
    <label className="flex items-start gap-3 group cursor-pointer p-2 rounded-xl
                     hover:bg-slate-50 dark:hover:bg-slate-800/50 
                     transition-all duration-300">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="mt-1 rounded border-slate-300 text-[#2E8B57] 
                 focus:ring-[#2E8B57] focus:ring-offset-0
                 transition-all duration-300 group-hover:scale-110"
      />
      
      <div className="flex-1">
        <p className={`
          text-sm font-medium transition-all duration-300
          ${task.completed 
            ? 'line-through text-slate-400' 
            : 'text-slate-900 dark:text-white group-hover:text-[#2E8B57]'}
        `}>
          {task.title}
        </p>
        
        <div className="flex items-center gap-2 mt-1">
          <span className={`
            text-[10px] font-bold px-2 py-0.5 rounded-full
            ${priority.bg} ${priority.text}
          `}>
            {priority.label}
          </span>
          
          <span className={`
            text-[10px] flex items-center gap-1
            ${task.due.includes('2h') ? 'text-red-500 font-medium' : 'text-slate-400'}
          `}>
            <CalendarIcon className="text-[10px]" />
            {task.due}
          </span>
          
          {task.completed && (
            <span className="text-[10px] text-emerald-600 font-medium 
                           flex items-center gap-1 ml-auto">
              <CheckCircleIcon className="text-xs" />
              Completed
            </span>
          )}
        </div>
      </div>
    </label>
  );
};

// ============== NavItem Component ==============

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  badge?: number;
  active?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, badge, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl
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
      {badge && badge > 0 && (
        <span className="ml-auto bg-[#FFD700] text-slate-900 text-[10px] 
                       font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
};

// ============== Dashboard Content Component ==============

const DashboardContent: React.FC = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Verify NGO Budget Report', priority: 'high', due: 'Due in 2h', completed: false },
    { id: 2, title: 'Clear Duplicate ID Alerts', priority: 'medium', due: 'Due Today', completed: false },
    { id: 3, title: 'Notify Regional Leads', priority: 'low', due: 'Overdue', completed: true },
    { id: 4, title: 'Audit Last Quarter Grants', priority: 'high', due: 'Due Tomorrow', completed: false }
  ]);

  const metrics: MetricCard[] = [
    { id: 'pending-reviews', icon: RateReviewIcon, iconBg: 'bg-blue-100 dark:bg-blue-900/20', iconColor: 'text-blue-600 dark:text-blue-400', label: 'Total Pending Reviews', value: 24, change: 12, trend: 'up' },
    { id: 'critical-conflicts', icon: ReportProblemIcon, iconBg: 'bg-red-100 dark:bg-red-900/20', iconColor: 'text-red-600 dark:text-red-400', label: 'Critical Conflicts', value: 12, change: 5, trend: 'up' },
    { id: 'pending-docs', icon: DescriptionIcon, iconBg: 'bg-amber-100 dark:bg-amber-900/20', iconColor: 'text-amber-600 dark:text-amber-400', label: 'Pending Financial Docs', value: 8, change: 8, trend: 'down' }
  ];

  const queueItems: QueueItem[] = [
    { id: 1, beneficiary: 'Abebe Kebede', issueType: 'Duplicate ID', issueBg: 'bg-red-50 dark:bg-red-900/20', issueColor: 'text-red-700 dark:text-red-300', reportDate: 'Oct 24, 2023' },
    { id: 2, beneficiary: 'Fatima Ahmed', issueType: 'Incorrect Document', issueBg: 'bg-amber-50 dark:bg-amber-900/20', issueColor: 'text-amber-700 dark:text-amber-300', reportDate: 'Oct 23, 2023' },
    { id: 3, beneficiary: 'Samuel Tekle', issueType: 'Financial Discrepancy', issueBg: 'bg-blue-50 dark:bg-blue-900/20', issueColor: 'text-blue-700 dark:text-blue-300', reportDate: 'Oct 22, 2023' }
  ];

  const handleTaskToggle = (id: number) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, completed: !task.completed } : task));
  };

  return (
    <div className="space-y-8">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {metrics.map((metric, index) => (
          <MetricCard key={metric.id} metric={metric} index={index} hoveredCard={hoveredCard} setHoveredCard={setHoveredCard} />
        ))}
      </div>

      {/* Charts and Tasks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <h4 className="font-bold text-slate-900 dark:text-white">Approval Queue Throughput</h4>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 text-xs font-bold bg-[#2E8B57] text-white rounded-lg hover:bg-[#3CB371] transition-all hover:scale-105 active:scale-95">7 Days</button>
              <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all hover:scale-105">30 Days</button>
            </div>
          </div>
          <div className="p-6">
            <div className="h-64 w-full relative">
              <div className="absolute inset-x-0 bottom-8 h-px bg-slate-200 dark:bg-slate-700" />
              <div className="absolute inset-x-0 top-1/2 -translate-y-4 h-px bg-slate-200 dark:bg-slate-700" />
              <div className="absolute inset-x-0 top-0 h-px bg-slate-200 dark:bg-slate-700" />
              <div className="flex items-end justify-around h-full relative">
                {[
                  { day: 'Mon', value: 40 }, { day: 'Tue', value: 65 }, { day: 'Wed', value: 90 },
                  { day: 'Thu', value: 55 }, { day: 'Fri', value: 75 }, { day: 'Sat', value: 30 }, { day: 'Sun', value: 20 }
                ].map((item, index) => (
                  <div key={index} className="flex flex-col items-center gap-2 w-full">
                    <div className="w-12 rounded-t-xl transition-all duration-500 hover:scale-110 hover:-translate-y-1 cursor-pointer bg-gradient-to-t from-[#2E8B57] to-[#3CB371] shadow-lg" style={{ height: `${item.value}%` }} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.day}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Tasks */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <h4 className="font-bold text-slate-900 dark:text-white">Daily Tasks</h4>
            <button className="text-[#2E8B57] text-sm font-semibold hover:underline hover:scale-105 transition-all">View All</button>
          </div>
          <div className="p-4 flex-1 space-y-2 overflow-y-auto max-h-[300px]">
            {tasks.map(task => <TaskItem key={task.id} task={task} onToggle={handleTaskToggle} />)}
          </div>
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <button onClick={() => alert('Add new task')} className="w-full py-3 bg-[#2E8B57]/10 text-[#2E8B57] text-sm font-bold rounded-xl hover:bg-[#2E8B57]/20 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
              <AddIcon className="text-sm" /> Add New Task
            </button>
          </div>
        </div>
      </div>

      {/* Pending Review Queue Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h4 className="font-bold text-slate-900 dark:text-white">Pending Review Queue</h4>
          <button className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#2E8B57] transition-all hover:scale-105 active:scale-95">
            <FilterListIcon className="text-sm" /> Filter
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Beneficiary</th>
                <th className="px-6 py-4">Issue Type</th>
                <th className="px-6 py-4">Report Date</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {queueItems.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-300 group cursor-pointer">
                  <td className="px-6 py-4">
                    <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#2E8B57] transition-colors">
                      {item.beneficiary}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all duration-300 group-hover:scale-105 ${item.issueBg} ${item.issueColor}`}>
                      {item.issueType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.reportDate}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-[#2E8B57] hover:text-[#3CB371] font-bold text-xs transition-all hover:scale-110 active:scale-95 flex items-center gap-1 ml-auto">
                      Review <ChevronRightIcon className="text-sm" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============== FinancialDocumentsContent Component ==============

const FinancialDocumentsContent: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
      <AccountBalanceWalletIcon className="text-6xl text-[#2E8B57]/30 mb-4" />
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Financial Documents</h3>
      <p className="text-slate-500">Review and manage financial documents</p>
    </div>
  );
};

// ============== NotificationsContent Component ==============

const NotificationsContent: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
      <NotificationsActiveIcon className="text-6xl text-[#2E8B57]/30 mb-4" />
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Notification Center</h3>
      <p className="text-slate-500">Manage your notifications and alerts</p>
    </div>
  );
};

// ============== SettingsContent Component ==============

const SettingsContent: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
      <SettingsIcon className="text-6xl text-[#2E8B57]/30 mb-4" />
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Settings</h3>
      <p className="text-slate-500">Configure your workspace preferences</p>
    </div>
  );
};

// ============== ProfileContent Component ==============

const ProfileContent: React.FC = () => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center">
      <PersonIcon className="text-6xl text-[#2E8B57]/30 mb-4" />
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">My Profile</h3>
      <p className="text-slate-500">View and edit your profile information</p>
    </div>
  );
};

// ============== Main PMWorkspace Component ==============

interface PMWorkspaceProps {
  onLogout?: () => void;
}

const PMWorkspace: React.FC<PMWorkspaceProps> = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Determine active page based on URL path
  const getActivePage = () => {
    const path = location.pathname.split('/').pop();
    if (path === 'dashboard') return 'dashboard';
    if (path === 'duplications') return 'duplications';
    if (path === 'financial') return 'financial';
    if (path === 'notifications') return 'notifications';
    if (path === 'settings') return 'settings';
    if (path === 'profile') return 'profile';
    return 'dashboard';
  };

  const activePage = getActivePage();

  const handleNavigation = (path: string) => {
    navigate(`/pm/${path}`);
    setMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    if (onLogout) onLogout();
    else {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  const handleProfile = () => navigate('/pm/profile');
  const handleSettings = () => navigate('/pm/settings');

  const renderContent = () => {
    switch(activePage) {
      case 'dashboard':
        return <DashboardContent />;
      case 'duplications':
        return <ResolvedDuplications />;
      case 'financial':
      return <FinancialDocuments />;  // Add this line
      case 'notifications':
      return <NotificationsCenter />;  // Add this line
      case 'settings':
        return <SettingsContent />;
      case 'profile':
        return <ProfileContent />;
      default:
        return <DashboardContent />;
    }
  };

  const user = {
    name: 'Abebe Kebede',
    email: 'abebe.k@yel.org',
    role: 'Project Manager',
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
                <div className="w-10 h-10 bg-gradient-to-br from-[#2E8B57] to-[#3CB371] rounded-xl flex items-center justify-center shadow-lg animate-pulse-slow">
                  <Diversity1Icon className="text-white" />
                </div>
              </div>
              <div className={`transition-all duration-500 overflow-hidden ${!sidebarOpen ? 'lg:w-0 lg:opacity-0' : 'lg:w-auto lg:opacity-100'}`}>
                <span className="text-xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent whitespace-nowrap">
                  Ye Ethiopia Lij
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">PM Workspace</p>
              </div>
            </div>
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hidden lg:block p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:scale-110 active:scale-95">
              {sidebarOpen ? <ChevronLeftIcon className="text-slate-500" /> : <ChevronRightIcon className="text-slate-500" />}
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
            icon={LayersIcon} 
            label="Resolve Duplications Alerts" 
            active={activePage === 'duplications'} 
            onClick={() => handleNavigation('duplications')} 
          />
          <NavItem 
            icon={AccountBalanceWalletIcon} 
            label="Financial Documents" 
            active={activePage === 'financial'} 
            onClick={() => handleNavigation('financial')} 
          />
          <NavItem 
            icon={NotificationsActiveIcon} 
            label="Send Notifications" 
            badge={3} 
            active={activePage === 'notifications'} 
            onClick={() => handleNavigation('notifications')} 
          />
          
          <div className="pt-8 pb-4">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Administration</p>
          </div>
          
          <NavItem 
            icon={SettingsIcon} 
            label="Settings" 
            active={activePage === 'settings'} 
            onClick={() => handleNavigation('settings')} 
          />
          <NavItem 
            icon={PersonIcon} 
            label="Profile" 
            active={activePage === 'profile'} 
            onClick={handleProfile} 
          />
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-300 group">
            <LogoutIcon className="text-sm group-hover:translate-x-1 transition-transform" /> <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F8F9FA] dark:bg-slate-900 overflow-y-auto">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/10 h-20 flex items-center justify-between px-4 lg:px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1">
            <button onClick={() => setMobileSidebarOpen(true)} className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all hover:scale-110 active:scale-95">
              <MenuIcon className="text-slate-500" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
                {activePage === 'dashboard' && 'Home Dashboard'}
                {activePage === 'duplications' && 'Resolve  duplication'}
                {activePage === 'financial' && 'Financial Documents'}
                {activePage === 'notifications' && 'Notification Center'}
                {activePage === 'settings' && 'Settings'}
                {activePage === 'profile' && 'My Profile'}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                {activePage === 'dashboard' && 'Welcome back, Project Manager'}
                {activePage === 'duplications' && 'Review and resolve duplication conflicts'}
                {activePage === 'financial' && 'Review financial documents and reports'}
                {activePage === 'notifications' && 'Manage your notifications and alerts'}
                {activePage === 'settings' && 'Configure your workspace preferences'}
                {activePage === 'profile' && 'View and edit your profile information'}
              </p>
            </div>
          </div>

          {/* Search - only show on dashboard */}
          {activePage === 'dashboard' && (
            <div className="hidden lg:block relative w-64 mr-4">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search projects..." className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20 placeholder:text-slate-400" />
            </div>
          )}

          {/* Right Section */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="relative p-2 text-slate-500 hover:text-[#2E8B57] transition-all hover:scale-110 active:scale-95">
              <NotificationsIcon />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFD700] border-2 border-white rounded-full animate-ping" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFD700] border-2 border-white rounded-full" />
            </button>
            <button className="p-2 text-slate-500 hover:text-[#2E8B57] transition-all hover:scale-110 active:scale-95">
              <HelpIcon className="text-sm" />
            </button>
            <UserMenu user={user} onLogout={handleLogout} onProfile={handleProfile} onSettings={handleSettings} />
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 lg:p-8 space-y-8 max-w-[1400px] mx-auto w-full">
          {renderContent()}
        </div>
      </main>

      <style>{`
        @keyframes slideIn { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @keyframes pulse-slow { 0%,100% { opacity:1; } 50% { opacity:0.8; } }
        .animate-slideIn { animation: slideIn 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-pulse-slow { animation: pulse-slow 2s cubic-bezier(0.4,0,0.6,1) infinite; }
      `}</style>
    </div>
  );
};

export default PMWorkspace;