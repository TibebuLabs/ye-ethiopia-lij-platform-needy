// ============== EnrollChild.tsx ==============
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  School as SchoolIcon,
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
  Verified as VerifiedIcon,
  Done as DoneIcon,
  Pending as PendingIcon,
  SupportAgent as SupportAgentIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';

// ============== Types and Interfaces ==============

interface Child {
  id: number;
  initials: string;
  name: string;
  applicationId: string;
  parentName: string;
  approvedDate: string;
  isSelected: boolean;
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
                <PersonAddIcon className="text-[#2E8B57] text-sm group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">My Profile</span>
              </button>
              <button onClick={() => { onSettings(); setIsOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all group">
                <UpdateIcon className="text-[#2E8B57] text-sm group-hover:rotate-90 transition-transform" />
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
        w-full flex items-center gap-3 px-4 py-3 rounded-xl
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

// ============== Step Component ==============

interface StepProps {
  number: number;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  icon?: React.ReactNode;
}

const Step: React.FC<StepProps> = ({ number, title, description, isActive, isCompleted, icon }) => {
  return (
    <div className="flex items-center gap-4 flex-1">
      <div className={`
        w-10 h-10 rounded-xl flex items-center justify-center font-bold transition-all
        ${isActive 
          ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white shadow-lg' 
          : isCompleted
            ? 'bg-[#2E8B57] text-white'
            : 'border-2 border-slate-200 dark:border-slate-700 text-slate-400'
        }
      `}>
        {isCompleted ? <DoneIcon className="text-sm" /> : icon || number}
      </div>
      <div>
        <p className={`text-sm font-bold ${isActive ? 'text-[#2E8B57]' : 'text-slate-900 dark:text-white'}`}>
          {title}
        </p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
};

// ============== ChildCard Component ==============

interface ChildCardProps {
  child: Child;
  onSelect: (id: number) => void;
}

const ChildCard: React.FC<ChildCardProps> = ({ child, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(child.id)}
      className={`
        p-5 rounded-xl transition-all duration-300 cursor-pointer relative
        ${child.isSelected 
          ? 'border-2 border-[#2E8B57] bg-[#2E8B57]/5' 
          : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-[#2E8B57]/50 hover:shadow-lg'
        }
      `}
    >
      {child.isSelected && (
        <div className="absolute top-4 right-4 text-[#2E8B57]">
          <CheckCircleIcon className="text-sm" />
        </div>
      )}
      
      <div className="flex gap-4">
        <div className={`
          w-14 h-14 rounded-xl flex items-center justify-center font-bold text-xl
          ${child.isSelected 
            ? 'bg-[#2E8B57] text-white' 
            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700'
          }
        `}>
          {child.initials}
        </div>
        <div>
          <p className="font-bold text-slate-900 dark:text-white">{child.name}</p>
          <p className="text-xs font-semibold text-[#2E8B57]">{child.applicationId}</p>
          <p className="text-[10px] text-slate-500 mt-1">Parent: {child.parentName}</p>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
        <span className="text-slate-400">Approved On</span>
        <span className="text-slate-700 dark:text-slate-300">{child.approvedDate}</span>
      </div>
    </div>
  );
};

// ============== ValidationItem Component ==============

interface ValidationItemProps {
  title: string;
  description: string;
  status: 'success' | 'warning' | 'pending';
}

const ValidationItem: React.FC<ValidationItemProps> = ({ title, description, status }) => {
  const getStatusIcon = () => {
    switch(status) {
      case 'success':
        return <DoneIcon className="text-sm text-white" />;
      case 'warning':
        return <WarningIcon className="text-sm text-amber-600" />;
      case 'pending':
        return <PendingIcon className="text-sm text-amber-600" />;
      default:
        return null;
    }
  };

  const getStatusBg = () => {
    switch(status) {
      case 'success':
        return 'bg-green-500';
      case 'warning':
        return 'bg-amber-100 border border-amber-200';
      case 'pending':
        return 'bg-amber-100 border border-amber-200';
      default:
        return 'bg-slate-100';
    }
  };

  return (
    <div className="flex gap-4">
      <div className={`shrink-0 w-6 h-6 rounded-full ${getStatusBg()} flex items-center justify-center`}>
        {getStatusIcon()}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-bold text-slate-900 dark:text-white">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
};

// ============== Main EnrollChild Component ==============

interface EnrollChildProps {
  onNavigate?: (page: string) => void;
  onLogout?: () => void;
}

const EnrollChild: React.FC<EnrollChildProps> = ({ onNavigate, onLogout }) => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedChild, setSelectedChild] = useState<number>(1);
  const [selectedSection, setSelectedSection] = useState('A');

  const children: Child[] = [
    {
      id: 1,
      initials: 'HM',
      name: 'Hanna Mekonnen',
      applicationId: 'APP-2024-001',
      parentName: 'Mekonnen Ayalew',
      approvedDate: 'Oct 12, 2023',
      isSelected: true
    },
    {
      id: 2,
      initials: 'YG',
      name: 'Yonas Girma',
      applicationId: 'APP-2024-042',
      parentName: 'Girma Tola',
      approvedDate: 'Oct 14, 2023',
      isSelected: false
    },
    {
      id: 3,
      initials: 'AT',
      name: 'Abebech Tesfaye',
      applicationId: 'APP-2024-038',
      parentName: 'Tesfaye Hailu',
      approvedDate: 'Oct 10, 2023',
      isSelected: false
    }
  ];

  const handleChildSelect = (id: number) => {
    setSelectedChild(id);
  };

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
            onClick={() => handleNavigation('dashboard')}
          />
          <NavItem 
            icon={PersonAddIcon} 
            label="Enroll Child" 
            active={true}
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
            onClick={() => handleNavigation('reports')}
          />
        </nav>

        {/* Empty div for spacing */}
        <div className="p-4" />
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
              <span className="text-slate-400">Workspace</span>
              <ChevronRightIcon className="text-slate-300 text-xs" />
              <span className="font-semibold text-slate-900 dark:text-white">Enroll Approved Child</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="px-3 py-1.5 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-bold rounded-full border border-green-200 dark:border-green-800">
              Academic Year: 2024/25
            </div>
            
            <button className="p-2 text-slate-500 hover:text-[#2E8B57] transition-all hover:scale-110">
              <NotificationsIcon />
            </button>
            
            <UserMenu 
              user={user}
              onLogout={handleLogout}
              onProfile={handleProfile}
              onSettings={handleSettings}
            />
          </div>
        </header>

        {/* Main Content Area */}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Main Workflow */}
            <div className="lg:col-span-8 space-y-8">
              {/* Progress Steps */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                <div className="flex items-center justify-between">
                  <Step 
                    number={1}
                    title="Select Child"
                    description="Find approved applicant"
                    isActive={currentStep === 1}
                    isCompleted={currentStep > 1}
                  />
                  
                  <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1 mx-4" />
                  
                  <Step 
                    number={2}
                    title="Academic Details"
                    description="Grade & Classroom"
                    isActive={currentStep === 2}
                    isCompleted={currentStep > 2}
                  />
                  
                  <div className="h-px bg-slate-200 dark:bg-slate-700 flex-1 mx-4" />
                  
                  <Step 
                    number={3}
                    title="Finish"
                    description="Confirm enrollment"
                    isActive={currentStep === 3}
                    isCompleted={currentStep > 3}
                    icon={<DoneIcon className="text-sm" />}
                  />
                </div>
              </div>

              {/* Step 1: Find Approved Child */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6">
                      Step 1: Find Approved Child
                    </h3>
                    
                    <div className="relative">
                      <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter Child Name, Parent Name or Application ID (e.g. APP-2024-001)..."
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20 placeholder:text-slate-400 shadow-inner"
                      />
                    </div>

                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {children.map(child => (
                        <ChildCard 
                          key={child.id} 
                          child={{
                            ...child,
                            isSelected: selectedChild === child.id
                          }}
                          onSelect={handleChildSelect}
                        />
                      ))}
                    </div>

                    <div className="mt-8 flex justify-end">
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="px-8 py-3.5 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                      >
                        Continue to Academic Details
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Academic Enrollment Details */}
              {currentStep === 2 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <SchoolIcon className="text-[#2E8B57] text-sm" />
                    <h3 className="font-bold text-slate-900 dark:text-white">Step 2: Academic Enrollment Details</h3>
                  </div>

                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Assigned Grade Level
                      </label>
                      <select className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20">
                        <option value="">Select Target Grade</option>
                        <option value="1">Grade 1</option>
                        <option value="2">Grade 2</option>
                        <option value="3" selected>Grade 3</option>
                        <option value="4">Grade 4</option>
                        <option value="5">Grade 5</option>
                      </select>
                      <p className="text-[10px] text-slate-400">Based on previous records (Grade 2 completed)</p>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Official Enrollment Date
                      </label>
                      <input
                        type="date"
                        defaultValue="2024-09-01"
                        className="w-full p-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Classroom / Section Assignment
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {['A', 'B', 'C'].map(section => (
                          <button
                            key={section}
                            onClick={() => setSelectedSection(section)}
                            className={`
                              p-3 rounded-xl text-sm font-bold transition-all
                              ${selectedSection === section
                                ? 'border-2 border-[#2E8B57] bg-[#2E8B57]/5 text-[#2E8B57]'
                                : 'border border-slate-200 dark:border-slate-700 text-slate-500 hover:border-[#2E8B57]/30'
                              }
                            `}
                          >
                            Section {section}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <button 
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      Back
                    </button>
                    <div className="flex gap-4">
                      <button className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors">
                        Discard Draft
                      </button>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="px-8 py-2.5 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                      >
                        Continue to Confirmation
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden">
                  <div className="bg-slate-50 dark:bg-slate-800/50 px-8 py-5 border-b border-slate-200 dark:border-slate-800">
                    <h3 className="font-bold text-slate-900 dark:text-white">Step 3: Confirm Enrollment</h3>
                  </div>

                  <div className="p-8 space-y-6">
                    <div className="bg-[#2E8B57]/5 rounded-xl p-6 border border-[#2E8B57]/20">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#2E8B57] to-[#3CB371] flex items-center justify-center text-white text-2xl font-bold">
                          HM
                        </div>
                        <div>
                          <h4 className="text-xl font-bold text-slate-900 dark:text-white">Hanna Mekonnen</h4>
                          <p className="text-sm text-[#2E8B57]">SCH-2024-HM-01</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-slate-500">Grade Level</p>
                          <p className="text-sm font-bold">Grade 3</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Section</p>
                          <p className="text-sm font-bold">Section {selectedSection}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Enrollment Date</p>
                          <p className="text-sm font-bold">September 1, 2024</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Fee Status</p>
                          <p className="text-sm font-bold text-green-600">Sponsored</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                      <div className="flex items-start gap-3">
                        <InfoIcon className="text-amber-600 text-sm mt-0.5" />
                        <p className="text-sm text-amber-800 dark:text-amber-400">
                          By confirming, you agree to enroll this child in your school. This action cannot be undone.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <button 
                      onClick={() => setCurrentStep(2)}
                      className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => alert('Enrollment completed successfully!')}
                      className="px-8 py-2.5 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    >
                      Complete Enrollment
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Validation Panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg overflow-hidden sticky top-24">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold flex items-center gap-2">
                    <VerifiedIcon className="text-[#2E8B57] text-sm" />
                    Validation Status
                  </h4>
                </div>

                <div className="p-6 space-y-6">
                  <ValidationItem
                    title="Child Eligibility"
                    description="Selected child is fully approved and cleared for enrollment."
                    status="success"
                  />

                  <ValidationItem
                    title="Grade Availability"
                    description="Grade 3 has 12 seats remaining for the upcoming term."
                    status="success"
                  />

                  <ValidationItem
                    title="Class Capacity"
                    description="Section A is reaching 90% capacity. Review section balance."
                    status="warning"
                  />

                  <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl space-y-3">
                    <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Enrollment Preview</h5>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Student:</span>
                      <span className="font-bold text-slate-900 dark:text-white">Hanna Mekonnen</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Assigned ID:</span>
                      <span className="font-bold text-[#2E8B57]">SCH-2024-HM-01</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Fee Status:</span>
                      <span className="font-bold text-green-600">Sponsored</span>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[#2E8B57]/5 dark:bg-[#2E8B57]/10 border-t border-[#2E8B57]/10">
                  <p className="text-[11px] text-[#2E8B57] font-medium text-center">
                    Data is synchronized in real-time with the central foundation database.
                  </p>
                </div>
              </div>

              {/* Help Card */}
              <div className="bg-gradient-to-br from-[#2E8B57] to-[#3CB371] text-white p-6 rounded-2xl shadow-xl relative overflow-hidden group">
                <div className="relative z-10 space-y-3">
                  <HelpIcon className="text-3xl" />
                  <h4 className="font-bold">Need assistance?</h4>
                  <p className="text-xs text-white/80 leading-relaxed">
                    If you cannot find an approved child in the search, please contact the Foundation Support desk.
                  </p>
                  <button className="bg-white text-[#2E8B57] px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-100 transition-colors">
                    Support Center
                  </button>
                </div>
                <div className="absolute -right-8 -bottom-8 opacity-10 group-hover:scale-110 transition-transform">
                  <SupportAgentIcon className="text-[120px]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-auto py-6 px-8 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs font-medium">
            <p>© 2024 Ye Ethiopia Lij Foundation. Educational Management System.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-[#2E8B57] transition-colors">User Guide</a>
              <a href="#" className="hover:text-[#2E8B57] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[#2E8B57] transition-colors">Platform Status</a>
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

export default EnrollChild;