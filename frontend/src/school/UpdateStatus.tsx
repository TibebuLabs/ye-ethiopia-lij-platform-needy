// ============== UpdateStatus.tsx ==============
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
  Help as HelpIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
  Sync as SyncIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon
} from '@mui/icons-material';

// ============== Types and Interfaces ==============

interface Student {
  id: number;
  initials: string;
  name: string;
  studentId: string;
  grade: string;
  section: string;
  attendance: number;
  performance: 'Excellent' | 'Good' | 'Average' | 'Poor';
  lastUpdated: string;
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

// ============== UpdateStatusModal Component ==============

interface UpdateStatusModalProps {
  student: Student | null;
  onClose: () => void;
  onSave: (id: number, attendance: number, performance: string, notes: string) => void;
}

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ student, onClose, onSave }) => {
  const [attendance, setAttendance] = useState(student?.attendance || 92);
  const [performance, setPerformance] = useState(student?.performance || 'Excellent');
  const [notes, setNotes] = useState('');

  if (!student) return null;

  const getPerformanceColor = (perf: string) => {
    switch(perf) {
      case 'Excellent': return 'text-green-600 bg-green-100';
      case 'Good': return 'text-blue-600 bg-blue-100';
      case 'Average': return 'text-yellow-600 bg-yellow-100';
      case 'Poor': return 'text-red-600 bg-red-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-slideIn">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#2E8B57] to-[#3CB371] text-white flex items-center justify-center font-bold text-xl">
              {student.initials}
            </div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-white">Update Academic Status</h3>
              <p className="text-sm text-slate-500">
                {student.name} • {student.grade}, Section {student.section}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all hover:scale-110"
          >
            <CloseIcon className="text-slate-500 text-sm" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Attendance Slider */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                Monthly Attendance
              </label>
              <span className="px-4 py-1.5 bg-[#2E8B57]/10 text-[#2E8B57] rounded-full text-lg font-bold">
                {attendance}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={attendance}
              onChange={(e) => setAttendance(parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#2E8B57]"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <span>0%</span>
              <span>25%</span>
              <span>50%</span>
              <span>75%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Performance Rating */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Overall Performance Rating
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['Poor', 'Average', 'Good', 'Excellent'].map((perf) => (
                <button
                  key={perf}
                  onClick={() => setPerformance(perf)}
                  className={`
                    py-3 rounded-xl text-xs font-bold transition-all
                    ${performance === perf
                      ? perf === 'Excellent' ? 'bg-green-500 text-white' :
                        perf === 'Good' ? 'bg-blue-500 text-white' :
                        perf === 'Average' ? 'bg-yellow-500 text-white' :
                        'bg-red-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }
                  `}
                >
                  {perf}
                </button>
              ))}
            </div>
          </div>

          {/* Internal Observations */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              Internal Observations
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20 resize-none"
              placeholder="Add any specific comments about student progress..."
              rows={4}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 text-sm font-bold text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSave(student.id, attendance, performance, notes);
              onClose();
            }}
            className="flex-1 px-6 py-3 text-sm font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white rounded-xl hover:shadow-lg transition-all hover:scale-105 shadow-lg shadow-[#2E8B57]/20"
          >
            Save Updates
          </button>
        </div>
      </div>
    </div>
  );
};

// ============== Main UpdateStatus Component ==============

interface UpdateStatusProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const UpdateStatus: React.FC<UpdateStatusProps> = ({ onNavigate, onLogout }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All Grades');
  const [performanceFilter, setPerformanceFilter] = useState('All Performance');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);

  const students: Student[] = [
    {
      id: 1,
      initials: 'BT',
      name: 'Bereket Tadesse',
      studentId: 'STU-8821',
      grade: 'Grade 3',
      section: 'A',
      attendance: 92,
      performance: 'Excellent',
      lastUpdated: 'Oct 24, 2023'
    },
    {
      id: 2,
      initials: 'SM',
      name: 'Selam Mekonnen',
      studentId: 'STU-4502',
      grade: 'Grade 2',
      section: 'B',
      attendance: 78,
      performance: 'Average',
      lastUpdated: 'Oct 22, 2023'
    },
    {
      id: 3,
      initials: 'ZK',
      name: 'Zewdu Kassahun',
      studentId: 'STU-1109',
      grade: 'Grade 3',
      section: 'A',
      attendance: 89,
      performance: 'Good',
      lastUpdated: 'Oct 20, 2023'
    }
  ];

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter === 'All Grades' || student.grade === gradeFilter;
    const matchesPerformance = performanceFilter === 'All Performance' || student.performance === performanceFilter;
    return matchesSearch && matchesGrade && matchesPerformance;
  });

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

  const handleManageStatus = (student: Student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleSaveStatus = (id: number, attendance: number, performance: string, notes: string) => {
    console.log('Saving status for student', id, { attendance, performance, notes });
    alert(`Status updated for student #${id}`);
  };

  const getPerformanceColor = (performance: string) => {
    switch(performance) {
      case 'Excellent': return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      case 'Good': return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400';
      case 'Average': return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400';
      case 'Poor': return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400';
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
    role: 'Academic Admin',
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
            active={true}
            onClick={() => handleNavigation('update-status')}
          />
          <NavItem 
            icon={AssessmentIcon} 
            label="Generate Report" 
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
              <span className="font-semibold text-slate-900 dark:text-white">Academic Status Manager</span>
            </div>
          </div>

          {/* Search - Desktop */}
          <div className="hidden lg:block relative w-64 mr-4">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Global search..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20"
            />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 lg:gap-6">
            <button className="relative p-2 text-slate-500 hover:text-[#2E8B57] transition-all hover:scale-110">
              <NotificationsIcon />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
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
        <div className="p-4 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
                Academic Status Manager
              </h2>
              <p className="text-slate-500 text-sm">Track and update student attendance and performance ratings for the current term.</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-105">
                <FilterListIcon className="text-sm" />
                Filter List
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all hover:scale-105 shadow-sm">
                <SyncIcon className="text-sm" />
                Bulk Update
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by student name or ID..."
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20"
              />
            </div>
            <div>
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="w-full py-2.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20"
              >
                <option>All Grades</option>
                <option>Grade 1</option>
                <option>Grade 2</option>
                <option>Grade 3</option>
                <option>Grade 4</option>
              </select>
            </div>
            <div>
              <select
                value={performanceFilter}
                onChange={(e) => setPerformanceFilter(e.target.value)}
                className="w-full py-2.5 px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20"
              >
                <option>All Performance</option>
                <option>Excellent</option>
                <option>Good</option>
                <option>Average</option>
                <option>Poor</option>
              </select>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider font-bold">
                  <tr>
                    <th className="px-6 py-5">Student Information</th>
                    <th className="px-6 py-5">Grade Level</th>
                    <th className="px-6 py-5">Attendance %</th>
                    <th className="px-6 py-5">Performance</th>
                    <th className="px-6 py-5">Last Updated</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-300 group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`
                            w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
                            bg-gradient-to-br from-[#2E8B57]/10 to-[#3CB371]/10 text-[#2E8B57]
                            group-hover:scale-110 group-hover:rotate-6 transition-all duration-300
                          `}>
                            {student.initials}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#2E8B57] transition-colors">
                              {student.name}
                            </p>
                            <p className="text-[11px] text-slate-400 font-medium">ID: {student.studentId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-600 dark:text-slate-300">
                          {student.grade}, Section {student.section}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${getAttendanceColor(student.attendance)}`}
                              style={{ width: `${student.attendance}%` }}
                            />
                          </div>
                          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                            {student.attendance}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight ${getPerformanceColor(student.performance)}`}>
                          {student.performance}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-xs text-slate-400">{student.lastUpdated}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleManageStatus(student)}
                          className="px-4 py-2 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white rounded-lg text-xs font-bold hover:shadow-lg transition-all hover:scale-105 shadow-sm"
                        >
                          Manage Status
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-500">No students match your filters</p>
                </div>
              )}
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between border-t border-slate-200 dark:border-slate-800">
              <p className="text-xs text-slate-500">Showing {filteredStudents.length} of 152 enrolled students</p>
              <div className="flex gap-2">
                <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors disabled:opacity-50" disabled>
                  <ChevronLeftIcon className="text-sm" />
                </button>
                <button className="p-2 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-white dark:hover:bg-slate-800 transition-colors">
                  <ChevronRightIcon className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Update Status Modal */}
        {showModal && (
          <UpdateStatusModal
            student={selectedStudent}
            onClose={() => {
              setShowModal(false);
              setSelectedStudent(null);
            }}
            onSave={handleSaveStatus}
          />
        )}

        {/* Footer */}
        <footer className="mt-auto py-6 px-8 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 dark:text-slate-400 text-xs font-medium">
            <p>© 2024 Ye Ethiopia Lij Platform. Academic Status Management Module.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#2E8B57] transition-colors">System Guidelines</a>
              <a href="#" className="hover:text-[#2E8B57] transition-colors">Export History</a>
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

export default UpdateStatus;