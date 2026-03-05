// InstitutionDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

// Material Icons as components (you can also use @mui/icons-material if installed)
const DashboardIcon = () => <span className="material-symbols-outlined">dashboard</span>;
const PersonAddIcon = () => <span className="material-symbols-outlined">person_add</span>;
const TrackChangesIcon = () => <span className="material-symbols-outlined">track_changes</span>;
const ClinicalNotesIcon = () => <span className="material-symbols-outlined">clinical_notes</span>;
const NotificationsIcon = () => <span className="material-symbols-outlined">notifications</span>;
const SettingsIcon = () => <span className="material-symbols-outlined">settings</span>;
const LogoutIcon = () => <span className="material-symbols-outlined">logout</span>;
const ChildCareIcon = () => <span className="material-symbols-outlined">child_care</span>;
const MedicalServicesIcon = () => <span className="material-symbols-outlined">medical_services</span>;
const PendingActionsIcon = () => <span className="material-symbols-outlined">pending_actions</span>;
const WarningIcon = () => <span className="material-symbols-outlined">warning</span>;
const DescriptionIcon = () => <span className="material-symbols-outlined">description</span>;
const CheckCircleIcon = () => <span className="material-symbols-outlined">check_circle</span>;
const VisibilityIcon = () => <span className="material-symbols-outlined">visibility</span>;
const EditIcon = () => <span className="material-symbols-outlined">edit</span>;
const CloseIcon = () => <span className="material-symbols-outlined">close</span>;
const SearchIcon = () => <span className="material-symbols-outlined">search</span>;
const CalendarIcon = () => <span className="material-symbols-outlined">calendar_today</span>;
const LocationIcon = () => <span className="material-symbols-outlined">location_on</span>;
const UploadIcon = () => <span className="material-symbols-outlined">upload</span>;
const ArrowBackIcon = () => <span className="material-symbols-outlined">arrow_back</span>;
const FavoriteIcon = () => <span className="material-symbols-outlined">favorite</span>;
const SchoolIcon = () => <span className="material-symbols-outlined">school</span>;
const RestaurantIcon = () => <span className="material-symbols-outlined">restaurant</span>;
const TimelineIcon = () => <span className="material-symbols-outlined">timeline</span>;
const AssignmentIcon = () => <span className="material-symbols-outlined">assignment</span>;
const MenuIcon = () => <span className="material-symbols-outlined">menu</span>;
const ChevronLeftIcon = () => <span className="material-symbols-outlined">chevron_left</span>;
const ChevronRightIcon = () => <span className="material-symbols-outlined">chevron_right</span>;
const PersonIcon = () => <span className="material-symbols-outlined">person</span>;
const ArrowForwardIcon = () => <span className="material-symbols-outlined">arrow_forward</span>;

// ============== Types and Interfaces ==============

interface Child {
  id: number;
  name: string;
  age: number;
  gender: string;
  location: string;
  region: string;
  image: string;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  submissionDate: string;
  needs: string[];
  bio: string;
  organization: string;
  educationProgress?: number;
  healthProgress?: number;
  lastUpdate?: string;
}

interface Intervention {
  id: number;
  childId: number;
  childName: string;
  type: 'health' | 'education' | 'nutrition' | 'general';
  title: string;
  description: string;
  date: string;
  receipt?: string;
  status: 'pending' | 'completed' | 'verified';
  verifiedBy?: string;
}

interface Submission {
  id: number;
  childId: number;
  childName: string;
  age: number;
  location: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  feedback?: string;
  reviewer?: string;
  reviewDate?: string;
  image: string;
}

interface Activity {
  id: number;
  type: 'submission' | 'approval' | 'intervention' | 'sponsorship';
  title: string;
  childName: string;
  timestamp: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface Stats {
  activeChildren: number;
  pendingApprovals: number;
  recentInterventions: number;
  totalSponsored: number;
  monthlyChange: number;
}

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    role: string;
    institution: string;
    avatar: string;
  };
  onLogout: () => void;
  onProfile: () => void;
  onSettings: () => void;
}

// ============== Custom Dropdown Menu Component ==============

const UserMenu: React.FC<UserMenuProps> = ({ user, onLogout, onProfile, onSettings }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all"
      >
        <div className="hidden sm:block text-right">
          <p className="text-sm font-semibold text-slate-900">{user.name}</p>
          <p className="text-xs text-[#2E8B57]">{user.role}</p>
        </div>
        <div className="relative">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-10 h-10 rounded-xl object-cover border-2 border-[#2E8B57]"
          />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        </div>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-40 overflow-hidden animate-slideIn">
            <div className="p-4 bg-gradient-to-r from-[#2E8B57]/10 to-[#3CB371]/10">
              <p className="font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
              <p className="text-xs text-[#2E8B57] mt-1">{user.institution}</p>
            </div>
            
            <div className="p-2">
              <button
                onClick={() => { onProfile(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
              >
                <PersonIcon />
                <span className="text-sm font-medium">My Profile</span>
              </button>
              
              <button
                onClick={() => { onSettings(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-600 hover:bg-slate-50 transition-all"
              >
                <SettingsIcon />
                <span className="text-sm font-medium">Settings</span>
              </button>
              
              <div className="h-px bg-slate-100 my-2" />
              
              <button
                onClick={() => { onLogout(); setIsOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-all"
              >
                <LogoutIcon />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// ============== Dashboard Home Component ==============

const DashboardHome: React.FC = () => {
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);
  
  const stats: Stats = {
    activeChildren: 128,
    pendingApprovals: 12,
    recentInterventions: 45,
    totalSponsored: 156,
    monthlyChange: 15
  };

  const activities: Activity[] = [
    {
      id: 1,
      type: 'submission',
      title: 'New Child Profile Submitted',
      childName: 'Abebe Kebede',
      timestamp: 'Today, 10:30 AM',
      description: 'Child profile submitted for review. Awaiting admin approval.',
      icon: <PersonAddIcon />,
      color: 'blue'
    },
    {
      id: 2,
      type: 'approval',
      title: 'Profile Approved',
      childName: 'Sara Tesfaye',
      timestamp: 'Yesterday',
      description: 'Child profile has been approved and is now visible to sponsors.',
      icon: <CheckCircleIcon />,
      color: 'green'
    },
    {
      id: 3,
      type: 'intervention',
      title: 'Health Intervention Logged',
      childName: 'Mekdes Hailu',
      timestamp: '2 days ago',
      description: 'Quarterly health checkup completed. Results within normal ranges.',
      icon: <MedicalServicesIcon />,
      color: 'purple'
    },
    {
      id: 4,
      type: 'sponsorship',
      title: 'New Sponsor Matched',
      childName: 'Dawit Mengistu',
      timestamp: '3 days ago',
      description: 'A new sponsor has been matched with your child.',
      icon: <FavoriteIcon />,
      color: 'pink'
    }
  ];

  const pendingActions = [
    {
      id: 1,
      childName: 'Abebe Kebede',
      issue: 'Profile photo missing clear lighting. Please re-upload.',
      action: 'Correct Profile',
      icon: <WarningIcon />
    },
    {
      id: 2,
      childName: 'Sara Tesfaye',
      issue: 'Intervention log dated 10/12/23 is missing physician signature.',
      action: 'Update Log',
      icon: <DescriptionIcon />
    }
  ];

  const getActivityColor = (color: string): string => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-50 text-blue-600',
      green: 'bg-green-50 text-green-600',
      purple: 'bg-purple-50 text-purple-600',
      pink: 'bg-pink-50 text-pink-600'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative bg-gradient-to-r from-[#2E8B57] to-[#3CB371] rounded-2xl p-8 text-white overflow-hidden shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full animate-pulse" />
          <div className="absolute -right-20 -bottom-20 w-60 h-60 bg-white rounded-full animate-pulse delay-1000" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-sm font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              Institution Dashboard
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-3">Welcome back, St. Gabriel Center! 👋</h2>
          <p className="text-white/90 leading-relaxed max-w-2xl text-lg">
            You're making a difference in the lives of 128 children. Track your impact, 
            manage child profiles, and submit new registrations all in one place.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: <ChildCareIcon />, label: 'Active Children', value: stats.activeChildren, change: '+12%' },
          { icon: <MedicalServicesIcon />, label: 'Recent Interventions', value: stats.recentInterventions, subtext: 'Last 30 days' },
          { icon: <PendingActionsIcon />, label: 'Pending Approvals', value: stats.pendingApprovals, subtext: 'Awaiting review' },
          { icon: <FavoriteIcon />, label: 'Total Sponsored', value: stats.totalSponsored, subtext: 'Active sponsorships' }
        ].map((stat, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl 
                     transition-all duration-500 hover:-translate-y-2 cursor-pointer
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
                <div className={`
                  text-3xl transition-all duration-500
                  ${hoveredStat === index ? 'scale-110 rotate-12' : ''}
                  text-[#2E8B57]
                `}>
                  {stat.icon}
                </div>
                {stat.change && (
                  <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-100 text-green-700">
                    {stat.change}
                  </span>
                )}
              </div>
              
              <p className="text-3xl font-bold mb-1 text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
              {stat.subtext && (
                <p className="text-xs text-slate-400 mt-2">{stat.subtext}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Left Column - Activity & Actions */}
        <div className="col-span-12 lg:col-span-8 space-y-8">
          {/* Action Required */}
          <section className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold flex items-center gap-2 text-slate-900">
                <WarningIcon />
                <span>Action Required</span>
              </h3>
              <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                {pendingActions.length} Needs Correction
              </span>
            </div>
            
            <div className="divide-y divide-slate-100">
              {pendingActions.map((action) => (
                <div key={action.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="size-12 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                      {action.icon}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{action.childName}</p>
                      <p className="text-sm text-slate-500">{action.issue}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-[#2E8B57] font-semibold hover:underline">
                    {action.action}
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Activity Timeline */}
          <section className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <h3 className="text-lg font-bold mb-6 text-slate-900">Recent Activity</h3>
            
            <div className="space-y-6">
              {activities.map((activity, index) => (
                <div key={activity.id} className="flex gap-4 group">
                  <div className="relative">
                    <div className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center
                      transition-all duration-300 group-hover:scale-110
                      ${getActivityColor(activity.color)}
                    `}>
                      {activity.icon}
                    </div>
                    {index < activities.length - 1 && (
                      <div className="absolute top-12 bottom-[-24px] left-1/2 -translate-x-1/2 
                                    w-0.5 bg-gradient-to-b from-[#2E8B57]/20 to-transparent" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <p className="font-bold text-slate-900 group-hover:text-[#2E8B57] transition-colors">
                      {activity.title}
                    </p>
                    <p className="text-xs text-slate-500 mb-2 flex items-center gap-2">
                      <span className="font-medium">{activity.childName}</span>
                      <span>•</span>
                      <span>{activity.timestamp}</span>
                    </p>
                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl group-hover:bg-slate-100 transition-colors">
                      {activity.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Impact Chart */}
          <section className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Support Impact Tracking</h3>
              <select className="text-sm border-slate-200 rounded-lg focus:ring-[#2E8B57] focus:border-[#2E8B57] p-2">
                <option>Last 6 Months</option>
                <option>Last 12 Months</option>
              </select>
            </div>
            
            <div className="h-64 flex items-end gap-4 px-2">
              {['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'].map((month, i) => {
                const heights = [40, 65, 55, 85, 95, 60];
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-2 group">
                    <div 
                      className={`w-full bg-gradient-to-t from-[#2E8B57] to-[#3CB371] rounded-t transition-all duration-300 group-hover:opacity-80`}
                      style={{ height: `${heights[i]}%` }}
                    />
                    <span className="text-xs font-medium text-slate-500">{month}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 flex gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#2E8B57]"></span>
                <span className="text-slate-600">Nutritional Support</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded-full bg-[#3CB371]"></span>
                <span className="text-slate-600">Health Interventions</span>
              </div>
            </div>
          </section>
        </div>

        {/* Right Column - Quick Actions & Recent Submissions */}
        <div className="col-span-12 lg:col-span-4 space-y-8">
          {/* Quick Actions */}
          <section className="bg-gradient-to-br from-[#2E8B57]/5 to-[#3CB371]/5 p-6 rounded-2xl border border-[#2E8B57]/20">
            <h3 className="text-lg font-bold mb-4 text-slate-900">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-start gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-[#2E8B57] transition-all group">
                <div className="size-10 rounded-lg bg-[#2E8B57]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <PersonAddIcon />
                </div>
                <div className="text-left">
                  <span className="font-medium text-slate-900">New Child Profile</span>
                  <p className="text-xs text-slate-500">Register a new child</p>
                </div>
              </button>
              
              <button className="w-full flex items-center justify-start gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-[#2E8B57] transition-all group">
                <div className="size-10 rounded-lg bg-[#2E8B57]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ClinicalNotesIcon />
                </div>
                <div className="text-left">
                  <span className="font-medium text-slate-900">Log Intervention</span>
                  <p className="text-xs text-slate-500">Record support activity</p>
                </div>
              </button>
              
              <button className="w-full flex items-center justify-start gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-[#2E8B57] transition-all group">
                <div className="size-10 rounded-lg bg-[#2E8B57]/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <TrackChangesIcon />
                </div>
                <div className="text-left">
                  <span className="font-medium text-slate-900">Track Submissions</span>
                  <p className="text-xs text-slate-500">Check approval status</p>
                </div>
              </button>
            </div>
          </section>

          {/* Recent Submissions */}
          <section className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <h3 className="text-lg font-bold mb-4 text-slate-900">Recent Submissions</h3>
            <div className="space-y-4">
              {[
                { name: 'Mekdes Ayele', type: 'Medical Intervention', time: '2 hrs ago', status: 'pending' },
                { name: 'Dawit Belay', type: 'New Profile', time: '5 hrs ago', status: 'approved' },
                { name: 'Hirut Bekele', type: 'Educational Grant', time: 'Yesterday', status: 'review' }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-3 pb-4 border-b border-slate-100 last:border-0 last:pb-0">
                  <div className={`size-10 rounded-lg flex items-center justify-center flex-shrink-0
                    ${item.status === 'pending' ? 'bg-blue-50 text-blue-600' : 
                      item.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                    {item.status === 'pending' ? <TimelineIcon /> :
                     item.status === 'approved' ? <CheckCircleIcon /> :
                     <PendingActionsIcon />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.type} • {item.time}</p>
                    <span className={`inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium
                      ${item.status === 'pending' ? 'bg-blue-100 text-blue-700' :
                        item.status === 'approved' ? 'bg-green-100 text-green-700' :
                        'bg-orange-100 text-orange-700'}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-[#2E8B57] font-semibold text-sm hover:bg-slate-50 rounded-lg transition-colors">
              View All Activities
            </button>
          </section>

          {/* Upcoming Events */}
          <section className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <h3 className="text-lg font-bold mb-4 text-slate-900">Upcoming Events</h3>
            <div className="space-y-3">
              {[
                { event: 'Health Checkup', child: 'Abebe Kebede', date: 'Mar 15, 2024' },
                { event: 'School Visit', child: 'Sara Tesfaye', date: 'Mar 18, 2024' },
                { event: 'Nutrition Program', child: 'Multiple', date: 'Mar 20, 2024' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <CalendarIcon />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{item.event}</p>
                    <p className="text-xs text-slate-500">{item.child} • {item.date}</p>
                  </div>
                  <ArrowForwardIcon />
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

// ============== Submit Child Profile Page (UC-03) ==============

const SubmitChildProfilePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [showDuplicateAlert, setShowDuplicateAlert] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    dateOfBirth: '',
    gender: '',
    region: '',
    city: '',
    address: '',
    bio: '',
    needs: [] as string[],
    interests: [] as string[],
    educationLevel: '',
    healthStatus: '',
    guardianName: '',
    guardianRelation: '',
    guardianPhone: '',
    documents: [] as File[],
    photos: [] as File[]
  });

  const needs: string[] = ['Education', 'Healthcare', 'Nutrition', 'School Supplies', 'Uniform', 'Books', 'Counseling', 'Clothing'];
  const interests: string[] = ['Mathematics', 'Science', 'Reading', 'Sports', 'Art', 'Music', 'Dancing', 'Writing'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate duplicate check
    const isDuplicate = Math.random() > 0.7; // 30% chance of duplicate for demo
    if (isDuplicate) {
      setShowDuplicateAlert(true);
    } else {
      alert('Child profile submitted successfully! Pending review.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
          Submit Child Profile
        </h2>
        <p className="text-slate-500 mt-1">Register a new child for sponsorship (UC-03)</p>
      </div>

      {/* Duplicate Alert Modal */}
      {showDuplicateAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDuplicateAlert(false)} />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 animate-slideIn">
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-red-100 rounded-2xl flex items-center justify-center">
                <WarningIcon />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Duplicate Detected!</h3>
              <p className="text-slate-500 mt-2">
                This child appears to be already registered in our system through another organization.
              </p>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-xl mb-6">
              <p className="text-sm text-orange-800">
                <strong>Alert:</strong> A child matching this information is already registered with "Hope for Children". 
                Please verify before proceeding.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowDuplicateAlert(false)}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setShowDuplicateAlert(false);
                  alert('Override submitted for admin review.');
                }}
                className="flex-1 bg-[#2E8B57] text-white px-4 py-3 rounded-xl font-semibold hover:bg-[#3CB371] transition-all"
              >
                Submit Anyway
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {[1, 2, 3, 4].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className={`
              w-10 h-10 rounded-2xl flex items-center justify-center font-semibold
              ${currentStep >= step 
                ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white' 
                : 'bg-slate-100 text-slate-400'}
            `}>
              {step}
            </div>
            {step < 4 && (
              <div className={`
                flex-1 h-1 mx-2 rounded
                ${currentStep > step ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371]' : 'bg-slate-200'}
              `} />
            )}
          </div>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
        {currentStep === 1 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold mb-6 text-slate-900">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                  placeholder="Enter child's full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Age *</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="18"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                  placeholder="Age"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Gender *</label>
                <select
                  required
                  value={formData.gender}
                  onChange={(e) => setFormData({...formData, gender: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-slate-700">Biography *</label>
              <textarea
                required
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                         focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                placeholder="Tell us about the child's background, personality, and dreams..."
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold mb-6 text-slate-900">Location & Guardian Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Region *</label>
                <input
                  type="text"
                  required
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                  placeholder="e.g., Oromia"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">City *</label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                  placeholder="e.g., Addis Ababa"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-2 text-slate-700">Full Address *</label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                  placeholder="Kebele, house number, landmark"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Guardian Name *</label>
                <input
                  type="text"
                  required
                  value={formData.guardianName}
                  onChange={(e) => setFormData({...formData, guardianName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                  placeholder="Guardian's full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Relationship *</label>
                <input
                  type="text"
                  required
                  value={formData.guardianRelation}
                  onChange={(e) => setFormData({...formData, guardianRelation: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                  placeholder="e.g., Mother, Grandmother"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Guardian Phone</label>
                <input
                  type="tel"
                  value={formData.guardianPhone}
                  onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                  placeholder="+251 9XX XXX XXX"
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold mb-6 text-slate-900">Needs & Interests</h3>
            
            <div>
              <label className="block text-sm font-medium mb-3 text-slate-700">Support Needs *</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {needs.map((need) => (
                  <label key={need} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.needs.includes(need)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, needs: [...formData.needs, need]});
                        } else {
                          setFormData({...formData, needs: formData.needs.filter(n => n !== need)});
                        }
                      }}
                      className="text-[#2E8B57] focus:ring-[#2E8B57] rounded"
                    />
                    <span className="text-sm text-slate-700">{need}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-slate-700">Interests</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {interests.map((interest) => (
                  <label key={interest} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                    <input
                      type="checkbox"
                      checked={formData.interests.includes(interest)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({...formData, interests: [...formData.interests, interest]});
                        } else {
                          setFormData({...formData, interests: formData.interests.filter(i => i !== interest)});
                        }
                      }}
                      className="text-[#2E8B57] focus:ring-[#2E8B57] rounded"
                    />
                    <span className="text-sm text-slate-700">{interest}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Education Level</label>
                <select
                  value={formData.educationLevel}
                  onChange={(e) => setFormData({...formData, educationLevel: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                >
                  <option value="">Select level</option>
                  <option value="preschool">Preschool</option>
                  <option value="primary">Primary (1-4)</option>
                  <option value="primary2">Primary (5-8)</option>
                  <option value="secondary">Secondary</option>
                  <option value="none">Not in school</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Health Status</label>
                <select
                  value={formData.healthStatus}
                  onChange={(e) => setFormData({...formData, healthStatus: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                >
                  <option value="">Select status</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="needs-care">Needs medical care</option>
                  <option value="special-needs">Special needs</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold mb-6 text-slate-900">Documents & Photos</h3>
            
            <div>
              <label className="block text-sm font-medium mb-3 text-slate-700">Child Photos *</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-[#2E8B57] transition-colors">
                <UploadIcon />
                <p className="text-sm text-slate-500 mb-2">Drag and drop photos here, or click to select</p>
                <p className="text-xs text-slate-400">Maximum 5 photos, 10MB each (JPG, PNG)</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFormData({...formData, photos: Array.from(e.target.files)});
                    }
                  }}
                />
              </div>
              {formData.photos.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.photos.map((photo, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${index + 1}`}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <button className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5">
                        <CloseIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-3 text-slate-700">Supporting Documents</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-[#2E8B57] transition-colors">
                <DescriptionIcon />
                <p className="text-sm text-slate-500 mb-2">Upload birth certificate, health records, etc.</p>
                <p className="text-xs text-slate-400">PDF, JPG, PNG (Max 20MB)</p>
                <input
                  type="file"
                  multiple
                  accept=".pdf,image/*"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFormData({...formData, documents: Array.from(e.target.files)});
                    }
                  }}
                />
              </div>
              {formData.documents.length > 0 && (
                <div className="mt-3 space-y-2">
                  {formData.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <DescriptionIcon />
                        <span className="text-sm text-slate-700">{doc.name}</span>
                      </div>
                      <button className="text-red-500 hover:text-red-700">
                        <CloseIcon />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form Navigation */}
        <div className="flex justify-between mt-6">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50
                       transition-colors font-medium text-slate-700 flex items-center gap-2"
            >
              <ArrowBackIcon />
              Previous
            </button>
          )}
          {currentStep < 4 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="ml-auto px-6 py-3 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] 
                       text-white rounded-xl font-semibold hover:shadow-lg 
                       transition-all duration-300"
            >
              Next Step
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto px-8 py-3 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] 
                       text-white rounded-xl font-semibold hover:shadow-lg 
                       transition-all duration-300"
            >
              Submit for Review
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// ============== Submission Status Page (UC-04) ==============

const SubmissionStatusPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  const submissions: Submission[] = [
    {
      id: 1,
      childId: 101,
      childName: 'Tigist Alemu',
      age: 7,
      location: 'Addis Ababa',
      submittedDate: '2024-02-15',
      status: 'approved',
      reviewer: 'Admin Team',
      reviewDate: '2024-02-17',
      image: 'https://i.pravatar.cc/150?img=6'
    },
    {
      id: 2,
      childId: 102,
      childName: 'Dawit Mengistu',
      age: 9,
      location: 'Bahir Dar',
      submittedDate: '2024-02-10',
      status: 'pending',
      image: 'https://i.pravatar.cc/150?img=7'
    },
    {
      id: 3,
      childId: 103,
      childName: 'Birtukan Tadesse',
      age: 6,
      location: 'Gondar',
      submittedDate: '2024-02-05',
      status: 'rejected',
      feedback: 'Duplicate record found. Child already registered with another organization.',
      reviewer: 'Admin Team',
      reviewDate: '2024-02-07',
      image: 'https://i.pravatar.cc/150?img=8'
    },
    {
      id: 4,
      childId: 104,
      childName: 'Yonas Haile',
      age: 8,
      location: 'Hawassa',
      submittedDate: '2024-01-28',
      status: 'published',
      reviewer: 'Admin Team',
      reviewDate: '2024-01-30',
      image: 'https://i.pravatar.cc/150?img=9'
    }
  ];

  const filteredSubmissions = selectedFilter === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === selectedFilter);

  const getStatusColor = (status: string): string => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'rejected': return 'bg-red-100 text-red-700';
      case 'published': return 'bg-blue-100 text-blue-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusIcon = (status: string): React.ReactNode => {
    switch(status) {
      case 'approved': return <CheckCircleIcon />;
      case 'pending': return <PendingActionsIcon />;
      case 'rejected': return <WarningIcon />;
      case 'published': return <VisibilityIcon />;
      default: return <AssignmentIcon />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
            Submission Status
          </h2>
          <p className="text-slate-500 mt-1">Track the status of your submitted child profiles (UC-04)</p>
        </div>
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="px-4 py-2 bg-white rounded-xl border border-slate-200
                   focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
        >
          <option value="all">All Submissions</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: submissions.length, color: 'text-[#2E8B57]' },
          { label: 'Pending', value: submissions.filter(s => s.status === 'pending').length, color: 'text-yellow-600' },
          { label: 'Approved', value: submissions.filter(s => s.status === 'approved').length, color: 'text-green-600' },
          { label: 'Rejected', value: submissions.filter(s => s.status === 'rejected').length, color: 'text-red-600' },
          { label: 'Published', value: submissions.filter(s => s.status === 'published').length, color: 'text-blue-600' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Child</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Location</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Submitted</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Status</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Reviewed</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((submission) => (
                <tr key={submission.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={submission.image} 
                        alt={submission.childName} 
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <p className="font-medium text-slate-900">{submission.childName}</p>
                        <p className="text-xs text-slate-500">{submission.age} years</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600">{submission.location}</td>
                  <td className="p-4 text-slate-600">{submission.submittedDate}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold 
                                   flex items-center gap-1 w-fit ${getStatusColor(submission.status)}`}>
                      {getStatusIcon(submission.status)}
                      {submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    {submission.reviewDate ? (
                      <div>
                        <p className="text-sm text-slate-600">{submission.reviewDate}</p>
                        <p className="text-xs text-slate-400">by {submission.reviewer}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">Not reviewed</span>
                    )}
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => setSelectedSubmission(submission)}
                      className="text-[#2E8B57] hover:underline text-sm font-medium flex items-center gap-1"
                    >
                      View Details
                      <ChevronRightIcon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Modal */}
      {selectedSubmission && selectedSubmission.status === 'rejected' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedSubmission(null)} />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 animate-slideIn">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Rejection Feedback</h3>
              <button onClick={() => setSelectedSubmission(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <CloseIcon />
              </button>
            </div>
            
            <div className="bg-red-50 p-4 rounded-xl mb-4">
              <div className="flex items-start gap-3">
                <WarningIcon />
                <div>
                  <p className="font-medium text-red-800 mb-2">Submission Rejected</p>
                  <p className="text-sm text-red-700">{selectedSubmission.feedback}</p>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setSelectedSubmission(null)}
                className="flex-1 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button className="flex-1 bg-[#2E8B57] text-white px-4 py-2 rounded-xl hover:bg-[#3CB371] transition-colors">
                Edit & Resubmit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============== Intervention Logs Page (UC-05) ==============

const InterventionLogsPage: React.FC = () => {
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const interventions: Intervention[] = [
    {
      id: 1,
      childId: 101,
      childName: 'Abebe Kebede',
      type: 'health',
      title: 'Quarterly Health Checkup',
      description: 'Routine medical examination. Height, weight, and general health assessment.',
      date: '2024-02-15',
      status: 'completed',
      verifiedBy: 'Dr. Tadesse'
    },
    {
      id: 2,
      childId: 102,
      childName: 'Sara Tesfaye',
      type: 'education',
      title: 'School Supplies Distribution',
      description: 'Provided textbooks, notebooks, and uniform for the semester.',
      date: '2024-02-10',
      receipt: 'receipt-123.pdf',
      status: 'verified'
    },
    {
      id: 3,
      childId: 103,
      childName: 'Mekdes Hailu',
      type: 'nutrition',
      title: 'Monthly Food Package',
      description: 'Distributed nutritional food package including grains, oil, and supplements.',
      date: '2024-02-05',
      status: 'pending'
    }
  ];

  const getTypeIcon = (type: string): React.ReactNode => {
    switch(type) {
      case 'health': return <MedicalServicesIcon />;
      case 'education': return <SchoolIcon />;
      case 'nutrition': return <RestaurantIcon />;
      default: return <ClinicalNotesIcon />;
    }
  };

  const getTypeColor = (type: string): string => {
    switch(type) {
      case 'health': return 'text-blue-600 bg-blue-50';
      case 'education': return 'text-purple-600 bg-purple-50';
      case 'nutrition': return 'text-green-600 bg-green-50';
      default: return 'text-orange-600 bg-orange-50';
    }
  };

  const getStatusBadge = (status: string): string => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'verified': return 'bg-green-100 text-green-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
            Intervention Logs
          </h2>
          <p className="text-slate-500 mt-1">Record and track support activities (UC-05)</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <PersonAddIcon />
          Log New Intervention
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'This Month', value: '24', icon: <ClinicalNotesIcon />, color: 'blue' },
          { label: 'Pending Verification', value: '8', icon: <PendingActionsIcon />, color: 'orange' },
          { label: 'Verified', value: '42', icon: <CheckCircleIcon />, color: 'green' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className={`text-3xl text-${stat.color}-600`}>{stat.icon}</div>
              <span className={`text-2xl font-bold text-${stat.color}-600`}>{stat.value}</span>
            </div>
            <p className="text-sm text-slate-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Interventions List */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-900">Recent Interventions</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {interventions.map((intervention) => (
            <div key={intervention.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-4">
                  <div className={`size-12 rounded-xl flex items-center justify-center ${getTypeColor(intervention.type)}`}>
                    {getTypeIcon(intervention.type)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{intervention.title}</h4>
                    <p className="text-sm text-slate-500">for {intervention.childName}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(intervention.status)}`}>
                  {intervention.status.toUpperCase()}
                </span>
              </div>
              
              <p className="text-sm text-slate-600 mb-3 ml-16">{intervention.description}</p>
              
              <div className="flex items-center justify-between ml-16">
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <CalendarIcon />
                    {intervention.date}
                  </span>
                  {intervention.verifiedBy && (
                    <span>Verified by {intervention.verifiedBy}</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                    <EditIcon />
                  </button>
                  {intervention.receipt && (
                    <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors">
                      <DescriptionIcon />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Intervention Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 animate-slideIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Log New Intervention</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                <CloseIcon />
              </button>
            </div>
            
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Select Child *</label>
                <select className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]">
                  <option value="">Choose a child</option>
                  <option value="101">Abebe Kebede</option>
                  <option value="102">Sara Tesfaye</option>
                  <option value="103">Mekdes Hailu</option>
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Intervention Type *</label>
                  <select className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]">
                    <option value="health">Health</option>
                    <option value="education">Education</option>
                    <option value="nutrition">Nutrition</option>
                    <option value="general">General Support</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Date *</label>
                  <input
                    type="date"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Title *</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                  placeholder="e.g., Health Checkup, School Supplies"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Description *</label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                  placeholder="Provide detailed description of the intervention..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Supporting Documents</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center">
                  <UploadIcon />
                  <p className="text-sm text-slate-500">Upload receipts, photos, or reports</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Log Intervention
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ============== Profile Page ==============

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [profile, setProfile] = useState({
    fullName: 'Abeba Tesfaye',
    email: 'abeba.tesfaye@example.com',
    phone: '+251 912 345 678',
    institution: 'St. Gabriel Center',
    role: 'NGO Staff Member',
    joinDate: 'Jan 15, 2023',
    address: 'Bole Sub-city, Addis Ababa',
    bio: 'Dedicated to improving children\'s lives through education and healthcare support.',
    totalChildren: 128,
    totalInterventions: 245,
    totalSponsored: 156
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
        Institution Profile
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            <div className="h-32 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] relative">
              <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
                <div className="relative">
                  <img 
                    src="https://i.pravatar.cc/150?img=7"
                    alt={profile.fullName}
                    className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg"
                  />
                  <button className="absolute bottom-0 right-0 bg-[#2E8B57] text-white p-2 rounded-lg hover:bg-[#3CB371] transition-colors">
                    <EditIcon />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="pt-20 p-6 text-center">
              <h3 className="text-xl font-bold text-slate-900">{profile.fullName}</h3>
              <p className="text-sm text-slate-500 mb-2">{profile.role}</p>
              <p className="text-sm font-medium text-[#2E8B57] mb-4">{profile.institution}</p>
              
              <div className="grid grid-cols-3 gap-2 py-4 border-t border-slate-100">
                <div>
                  <p className="text-xl font-bold text-[#2E8B57]">{profile.totalChildren}</p>
                  <p className="text-xs text-slate-500">Children</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#2E8B57]">{profile.totalInterventions}</p>
                  <p className="text-xs text-slate-500">Interventions</p>
                </div>
                <div>
                  <p className="text-xl font-bold text-[#2E8B57]">{profile.totalSponsored}</p>
                  <p className="text-xs text-slate-500">Sponsored</p>
                </div>
              </div>
              
              <p className="text-sm text-slate-600 mt-4">
                Member since {profile.joinDate}
              </p>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900">Personal Information</h3>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-[#2E8B57] text-white rounded-xl font-semibold hover:bg-[#3CB371] transition-all duration-300"
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-slate-50 rounded-xl text-slate-900">{profile.fullName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-slate-50 rounded-xl text-slate-900">{profile.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-slate-50 rounded-xl text-slate-900">{profile.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2 text-slate-700">Institution</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.institution}
                      onChange={(e) => setProfile({...profile, institution: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-slate-50 rounded-xl text-slate-900">{profile.institution}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                  />
                ) : (
                  <p className="px-4 py-2 bg-slate-50 rounded-xl text-slate-900">{profile.address}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-slate-700">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                  />
                ) : (
                  <p className="px-4 py-2 bg-slate-50 rounded-xl text-slate-900">{profile.bio}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== Settings Page ==============

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('account');

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
        Settings
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            {[
              { id: 'account', label: 'Account Settings' },
              { id: 'notifications', label: 'Notifications' },
              { id: 'privacy', label: 'Privacy & Security' },
              { id: 'institution', label: 'Institution Settings' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full text-left px-6 py-4 border-b border-slate-100 last:border-0
                         transition-colors
                         ${activeTab === tab.id 
                           ? 'bg-gradient-to-r from-[#2E8B57]/10 to-[#3CB371]/10 text-[#2E8B57] font-semibold' 
                           : 'hover:bg-slate-50 text-slate-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Account Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Current Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                      placeholder="Enter new password"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                      placeholder="Confirm new password"
                    />
                  </div>
                </div>
                
                <div className="pt-4">
                  <button className="px-6 py-3 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Notification Preferences</h3>
                
                <div className="space-y-3">
                  {[
                    { id: 'email_submissions', label: 'Email notifications for child submissions' },
                    { id: 'sms_interventions', label: 'SMS alerts for urgent interventions' },
                    { id: 'push_approvals', label: 'Push notifications for profile approvals' },
                    { id: 'weekly_reports', label: 'Weekly impact reports' },
                    { id: 'sponsor_updates', label: 'Sponsor match notifications' }
                  ].map((item) => (
                    <label key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                      <span className="text-sm text-slate-700">{item.label}</span>
                      <input 
                        type="checkbox" 
                        defaultChecked={['email_submissions', 'push_approvals'].includes(item.id)} 
                        className="text-[#2E8B57] focus:ring-[#2E8B57] rounded"
                      />
                    </label>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Privacy & Security</h3>
                
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">Two-Factor Authentication</span>
                      <button className="px-4 py-2 bg-[#2E8B57] text-white rounded-lg text-sm font-semibold hover:bg-[#3CB371]">
                        Enable
                      </button>
                    </div>
                    <p className="text-xs text-slate-500">Add an extra layer of security to your account</p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">Session Timeout</span>
                      <select className="text-sm border-slate-200 rounded-lg focus:ring-[#2E8B57] focus:border-[#2E8B57] p-2">
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>2 hours</option>
                      </select>
                    </div>
                    <p className="text-xs text-slate-500">Automatically log out after inactivity</p>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-slate-900">Data Sharing</span>
                      <input type="checkbox" defaultChecked className="text-[#2E8B57] focus:ring-[#2E8B57]" />
                    </div>
                    <p className="text-xs text-slate-500">Allow anonymous data for program improvement</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'institution' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Institution Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Institution Name</label>
                    <input
                      type="text"
                      defaultValue="St. Gabriel Center"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">License Number</label>
                    <input
                      type="text"
                      defaultValue="NGO-2023-0452"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Contact Email</label>
                    <input
                      type="email"
                      defaultValue="contact@stgabriel.org"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2 text-slate-700">Program Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Orphanage', 'School', 'Health Center', 'Nutrition Program'].map((program) => (
                        <label key={program} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                          <input type="checkbox" className="text-[#2E8B57] focus:ring-[#2E8B57]" />
                          <span className="text-sm text-slate-700">{program}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="pt-4">
                  <button className="px-6 py-3 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                    Save Institution Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== Main InstitutionDashboard Component ==============

const InstitutionDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Determine active page based on URL path
  const getActivePage = (): string => {
    const path = location.pathname.split('/').pop();
    if (path === 'submit-child') return 'submit';
    if (path === 'submission-status') return 'submissions';
    if (path === 'intervention-logs') return 'interventions';
    if (path === 'profile') return 'profile';
    if (path === 'settings') return 'settings';
    return 'dashboard';
  };

  const [activePage, setActivePage] = useState<string>(getActivePage());

  const handleNavigation = (page: string, path: string) => {
    setActivePage(page);
    navigate(path);
    setMobileSidebarOpen(false);
  };

  const handleLogout = () => {
    // Handle logout logic here
    alert('Logging out...');
    navigate('/login');
  };

  // Update active page when URL changes
  useEffect(() => {
    setActivePage(getActivePage());
  }, [location]);

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

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <DashboardIcon />, path: '/institution/dashboard' },
    { id: 'submit', label: 'Submit Child', icon: <PersonAddIcon />, path: '/institution/submit-child' },
    { id: 'submissions', label: 'Submission Status', icon: <TrackChangesIcon />, path: '/institution/submission-status' },
    { id: 'interventions', label: 'Intervention Logs', icon: <ClinicalNotesIcon />, path: '/institution/intervention-logs' },
  ];

  // Render the appropriate page based on activePage
  const renderPage = (): React.ReactNode => {
    switch(activePage) {
      case 'submit':
        return <SubmitChildProfilePage />;
      case 'submissions':
        return <SubmissionStatusPage />;
      case 'interventions':
        return <InterventionLogsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <DashboardHome />;
    }
  };

  const user = {
    name: 'Abeba Tesfaye',
    email: 'abeba.tesfaye@example.com',
    role: 'NGO Staff',
    institution: 'St. Gabriel Center',
    avatar: 'https://i.pravatar.cc/150?img=7'
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA]">
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
                              rounded-xl flex items-center justify-center shadow-lg">
                  <ChildCareIcon />
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
              onClick={() => handleNavigation(item.id, item.path)}
              onMouseEnter={() => setHoveredItem(item.id)}
              onMouseLeave={() => setHoveredItem(null)}
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
                transition-all duration-300 relative
                ${hoveredItem === item.id ? 'scale-110 rotate-6' : ''}
              `}>
                {item.icon}
              </div>
              
              <span className={`
                transition-all duration-500 whitespace-nowrap
                ${!sidebarOpen && 'lg:hidden'}
              `}>
                {item.label}
              </span>
              
              {activePage === item.id && sidebarOpen && (
                <div className="absolute right-2 w-2 h-2 bg-white rounded-full animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        {/* Bottom Links */}
        <div className="p-4 border-t border-slate-200 space-y-2">
          <button
            onClick={() => handleNavigation('profile', '/institution/profile')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl
              ${activePage === 'profile' 
                ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white' 
                : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <PersonIcon />
            <span className={!sidebarOpen ? 'lg:hidden' : ''}>Profile</span>
          </button>
          
          <button
            onClick={() => handleNavigation('settings', '/institution/settings')}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl
              ${activePage === 'settings' 
                ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white' 
                : 'text-slate-600 hover:bg-slate-100'}`}
          >
            <SettingsIcon />
            <span className={!sidebarOpen ? 'lg:hidden' : ''}>Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#F8F9FA]">
        {/* Header */}
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
                           bg-clip-text text-transparent">
                {activePage === 'dashboard' && 'Dashboard'}
                {activePage === 'submit' && 'Submit Child Profile'}
                {activePage === 'submissions' && 'Submission Status'}
                {activePage === 'interventions' && 'Intervention Logs'}
                {activePage === 'profile' && 'My Profile'}
                {activePage === 'settings' && 'Settings'}
              </h1>
            </div>
            
            {/* Right Side Icons */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Notifications */}
              <button className="relative p-2 text-slate-500 hover:text-[#2E8B57] 
                               transition-all hover:scale-110 active:scale-95">
                <NotificationsIcon />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-yellow-400 
                               border-2 border-white rounded-full animate-ping" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-yellow-400 
                               border-2 border-white rounded-full" />
              </button>
              
              {/* User Menu */}
              <UserMenu 
                user={user}
                onLogout={handleLogout}
                onProfile={() => handleNavigation('profile', '/institution/profile')}
                onSettings={() => handleNavigation('settings', '/institution/settings')}
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-4 lg:p-8 animate-fadeIn">
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default InstitutionDashboard;