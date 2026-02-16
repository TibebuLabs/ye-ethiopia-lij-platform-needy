import React, { useState, useEffect } from 'react';
import { 
  Favorite, 
  Dashboard, 
  ChildCare, 
  Assessment, 
  Payments, 
  Notifications,
  Public,
  AccountBalanceWallet,
  Group,
  Healing,
  History,
  MedicalServices,
  School,
  Restaurant,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Search as SearchIcon,
  Star as StarIcon,
  EmojiEvents as EmojiEventsIcon,
  VolunteerActivism as VolunteerActivismIcon,
  RocketLaunch as RocketLaunchIcon,
  Timeline as TimelineIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  AddCircle as AddCircleIcon,
  TrackChanges as TrackChangesIcon,
  Assignment as AssignmentIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Upload as UploadIcon,
  Description as DescriptionIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// ============== Types and Interfaces ==============

interface Child {
  id: number;
  name: string;
  age: number;
  location: string;
  image: string;
  educationProgress: number;
  healthProgress: number;
  lastUpdate: string;
  nextVisit: string;
  bio?: string;
  interests?: string[];
  needs?: string[];
}

interface SponsoredChild extends Child {
  sponsorshipStartDate: string;
  monthlyContribution: number;
  totalContributed: number;
  lastPaymentDate: string;
  nextPaymentDate: string;
}

interface Submission {
  id: number;
  childName: string;
  age: number;
  location: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'published';
  organization: string;
  feedback?: string;
  reviewer?: string;
  reviewDate?: string;
  image: string;
  bio: string;
}

interface Activity {
  id: number;
  icon: React.ReactNode;
  title: string;
  childName: string;
  timestamp: string;
  description: string;
  type: 'health' | 'education' | 'nutrition' | 'general' | 'sponsorship' | 'submission';
}

interface Sponsorship {
  id: number;
  childName: string;
  childId: number;
  startDate: string;
  endDate?: string;
  status: 'active' | 'completed' | 'paused';
  monthlyAmount: number;
  totalAmount: number;
  lastPayment: string;
  nextPayment: string;
  image: string;
}

interface BrowseChild extends Child {
  needs: string[];
  monthlyAmount: number;
  organization: string;
  verified: boolean;
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

// ============== Browse Children Page (UC-03: Submit Child Profile) ==============

const BrowseChildrenPage: React.FC = () => {
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [selectedChildForSponsorship, setSelectedChildForSponsorship] = useState<BrowseChild | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLocation, setFilterLocation] = useState('all');

  const children: BrowseChild[] = [
    {
      id: 1,
      name: 'Abebe Kebede',
      age: 8,
      location: 'Addis Ababa',
      image: 'https://i.pravatar.cc/300?img=1',
      educationProgress: 85,
      healthProgress: 92,
      lastUpdate: '2 days ago',
      nextVisit: 'Mar 15, 2024',
      needs: ['Education', 'Healthcare', 'Nutrition'],
      monthlyAmount: 50,
      organization: 'Hope for Children',
      verified: true
    },
    {
      id: 2,
      name: 'Sara Tesfaye',
      age: 6,
      location: 'Bahir Dar',
      image: 'https://i.pravatar.cc/300?img=2',
      educationProgress: 60,
      healthProgress: 78,
      lastUpdate: '1 week ago',
      nextVisit: 'Mar 20, 2024',
      needs: ['Education', 'Healthcare'],
      monthlyAmount: 45,
      organization: 'Bright Future Foundation',
      verified: true
    },
    {
      id: 3,
      name: 'Mekdes Hailu',
      age: 10,
      location: 'Gondar',
      image: 'https://i.pravatar.cc/300?img=3',
      educationProgress: 92,
      healthProgress: 88,
      lastUpdate: 'Yesterday',
      nextVisit: 'Mar 18, 2024',
      needs: ['Education', 'Healthcare', 'School Supplies'],
      monthlyAmount: 60,
      organization: 'Education for All',
      verified: true
    },
    {
      id: 4,
      name: 'Dawit Mengistu',
      age: 7,
      location: 'Hawassa',
      image: 'https://i.pravatar.cc/300?img=4',
      educationProgress: 70,
      healthProgress: 85,
      lastUpdate: '3 days ago',
      nextVisit: 'Mar 22, 2024',
      needs: ['Healthcare', 'Nutrition'],
      monthlyAmount: 40,
      organization: 'Medical Aid Ethiopia',
      verified: true
    },
    {
      id: 5,
      name: 'Tigist Alemu',
      age: 9,
      location: 'Mekelle',
      image: 'https://i.pravatar.cc/300?img=5',
      educationProgress: 88,
      healthProgress: 79,
      lastUpdate: '5 days ago',
      nextVisit: 'Mar 25, 2024',
      needs: ['Education', 'School Supplies'],
      monthlyAmount: 55,
      organization: 'Children First',
      verified: true
    }
  ];

  const locations = ['all', ...new Set(children.map(c => c.location))];

  const filteredChildren = children.filter(child => 
    (filterLocation === 'all' || child.location === filterLocation) &&
    (child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     child.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSponsorClick = (child: BrowseChild) => {
    setSelectedChildForSponsorship(child);
    setShowSponsorModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
            Browse Children
          </h2>
          <p className="text-slate-500 mt-1">Discover children waiting for your sponsorship</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              placeholder="Search children..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200
                       focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent
                       w-full md:w-64"
            />
          </div>
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
            className="px-4 py-2 bg-white rounded-xl border border-slate-200
                     focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
          >
            {locations.map(loc => (
              <option key={loc} value={loc}>
                {loc === 'all' ? 'All Locations' : loc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-[#2E8B57]">{children.length}</p>
          <p className="text-sm text-slate-500">Available Children</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-[#2E8B57]">5</p>
          <p className="text-sm text-slate-500">Locations</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-[#2E8B57]">$50</p>
          <p className="text-sm text-slate-500">Avg. Monthly</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-[#2E8B57]">100%</p>
          <p className="text-sm text-slate-500">Verified</p>
        </div>
      </div>

      {/* Children Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChildren.map((child) => (
          <div 
            key={child.id}
            className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl 
                     transition-all duration-500 hover:-translate-y-2 cursor-pointer
                     border border-slate-100"
            onClick={() => setSelectedChild(child.id)}
          >
            <div className="relative h-48 overflow-hidden">
              <img 
                src={child.image} 
                alt={child.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              {/* Verification Badge */}
              {child.verified && (
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full 
                                 shadow-lg flex items-center gap-1">
                    <CheckCircleIcon className="text-xs" />
                    Verified
                  </span>
                </div>
              )}
              
              {/* Organization */}
              <div className="absolute bottom-4 left-4 text-white">
                <p className="text-sm opacity-90">{child.organization}</p>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-xl font-bold">{child.name}</h3>
                  <p className="text-sm text-slate-500">
                    {child.age} years • {child.location}
                  </p>
                </div>
                <div className="bg-[#2E8B57]/10 px-3 py-1 rounded-full">
                  <span className="text-[#2E8B57] font-bold">${child.monthlyAmount}</span>
                  <span className="text-xs text-slate-500">/mo</span>
                </div>
              </div>
              
              {/* Needs Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {child.needs.map((need, index) => (
                  <span key={index} className="px-2 py-1 bg-slate-100 text-xs rounded-lg">
                    {need}
                  </span>
                ))}
              </div>
              
              {/* Progress Bars */}
              <div className="space-y-3 mb-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Education</span>
                    <span className="font-bold text-[#2E8B57]">{child.educationProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#2E8B57] to-[#3CB371] rounded-full"
                      style={{ width: `${child.educationProgress}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Health</span>
                    <span className="font-bold text-[#2E8B57]">{child.healthProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#2E8B57] to-[#3CB371] rounded-full"
                      style={{ width: `${child.healthProgress}%` }}
                    />
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <button 
                  className="flex-1 bg-[#2E8B57] text-white py-2.5 rounded-xl font-semibold
                           hover:bg-[#3CB371] transition-all duration-300
                           flex items-center justify-center gap-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSponsorClick(child);
                  }}
                >
                  <Favorite className="text-sm" />
                  Sponsor
                </button>
                <button 
                  className="px-4 py-2.5 border border-[#2E8B57] text-[#2E8B57] rounded-xl
                           hover:bg-[#2E8B57] hover:text-white transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    // View full profile
                  }}
                >
                  <VisibilityIcon className="text-sm" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sponsorship Modal */}
      {showSponsorModal && selectedChildForSponsorship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowSponsorModal(false)} />
          <div className="relative bg-white rounded-2xl max-w-md w-full p-6 animate-slideIn">
            <button 
              onClick={() => setShowSponsorModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <CloseIcon className="text-slate-500" />
            </button>
            
            <div className="text-center mb-6">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#2E8B57] to-[#3CB371] 
                            rounded-2xl flex items-center justify-center">
                <Favorite className="text-white text-3xl" />
              </div>
              <h3 className="text-2xl font-bold">Sponsor {selectedChildForSponsorship.name}</h3>
              <p className="text-slate-500 mt-1">You're about to make a difference</p>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl">
                <div className="flex justify-between mb-2">
                  <span className="text-slate-500">Monthly Contribution</span>
                  <span className="font-bold text-[#2E8B57]">${selectedChildForSponsorship.monthlyAmount}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-slate-500">Annual Total</span>
                  <span className="font-bold">${selectedChildForSponsorship.monthlyAmount * 12}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Organization</span>
                  <span className="font-medium">{selectedChildForSponsorship.organization}</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-blue-800">
                  Your sponsorship provides education, healthcare, and nutrition support.
                  100% of your contribution goes directly to the child's needs.
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSponsorModal(false)}
                className="flex-1 px-4 py-3 border border-slate-200 rounded-xl
                         hover:bg-slate-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  // Process sponsorship
                  setShowSponsorModal(false);
                  alert(`Thank you for sponsoring ${selectedChildForSponsorship.name}!`);
                }}
                className="flex-1 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white 
                         px-4 py-3 rounded-xl font-semibold hover:shadow-lg 
                         transition-all duration-300"
              >
                Confirm Sponsorship
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============== My Children Page (Track Sponsored Children) ==============

const MyChildrenPage: React.FC = () => {
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid');
  const [selectedChild, setSelectedChild] = useState<number | null>(null);

  const sponsoredChildren: SponsoredChild[] = [
    {
      id: 1,
      name: 'Abebe Kebede',
      age: 8,
      location: 'Addis Ababa',
      image: 'https://i.pravatar.cc/300?img=1',
      educationProgress: 85,
      healthProgress: 92,
      lastUpdate: '2 days ago',
      nextVisit: 'Mar 15, 2024',
      sponsorshipStartDate: 'Jan 15, 2023',
      monthlyContribution: 50,
      totalContributed: 650,
      lastPaymentDate: 'Mar 1, 2024',
      nextPaymentDate: 'Apr 1, 2024',
      bio: 'Abebe loves mathematics and wants to become an engineer.',
      interests: ['Math', 'Soccer', 'Drawing'],
      needs: ['School supplies', 'Uniform']
    },
    {
      id: 2,
      name: 'Sara Tesfaye',
      age: 6,
      location: 'Bahir Dar',
      image: 'https://i.pravatar.cc/300?img=2',
      educationProgress: 60,
      healthProgress: 78,
      lastUpdate: '1 week ago',
      nextVisit: 'Mar 20, 2024',
      sponsorshipStartDate: 'Mar 10, 2023',
      monthlyContribution: 45,
      totalContributed: 540,
      lastPaymentDate: 'Mar 1, 2024',
      nextPaymentDate: 'Apr 1, 2024',
      bio: 'Sara enjoys reading and dreams of becoming a teacher.',
      interests: ['Reading', 'Singing', 'Dancing'],
      needs: ['Health checkups', 'Nutrition']
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header with View Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
            My Sponsored Children
          </h2>
          <p className="text-slate-500 mt-1">Track and manage your sponsored children</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm">
          <button 
            onClick={() => setSelectedView('grid')}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedView === 'grid' ? 'bg-[#2E8B57] text-white' : 'text-slate-500'
            }`}
          >
            Grid View
          </button>
          <button 
            onClick={() => setSelectedView('list')}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedView === 'list' ? 'bg-[#2E8B57] text-white' : 'text-slate-500'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-[#2E8B57]">{sponsoredChildren.length}</p>
          <p className="text-sm text-slate-500">Active Sponsorships</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-[#2E8B57]">
            ${sponsoredChildren.reduce((sum, c) => sum + c.totalContributed, 0)}
          </p>
          <p className="text-sm text-slate-500">Total Contributed</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-[#2E8B57]">
            ${sponsoredChildren.reduce((sum, c) => sum + c.monthlyContribution, 0)}
          </p>
          <p className="text-sm text-slate-500">Monthly Commitment</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-[#2E8B57]">2</p>
          <p className="text-sm text-slate-500">Updates This Month</p>
        </div>
      </div>

      {/* Children Display */}
      {selectedView === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sponsoredChildren.map((child) => (
            <div 
              key={child.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl 
                       transition-all duration-500 hover:-translate-y-2 cursor-pointer
                       border border-slate-100"
              onClick={() => setSelectedChild(child.id)}
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={child.image} 
                  alt={child.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                
                {/* Active Badge */}
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full 
                                 shadow-lg flex items-center gap-1">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Active
                  </span>
                </div>
                
                {/* Child Name Overlay */}
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{child.name}</h3>
                  <p className="text-sm opacity-90">{child.age} years • {child.location}</p>
                </div>
              </div>
              
              <div className="p-6">
                {/* Sponsorship Details */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-500">Monthly</p>
                    <p className="font-bold text-[#2E8B57]">${child.monthlyContribution}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Total</p>
                    <p className="font-bold">${child.totalContributed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Since</p>
                    <p className="text-sm font-medium">{child.sponsorshipStartDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Next Payment</p>
                    <p className="text-sm font-medium text-[#2E8B57]">{child.nextPaymentDate}</p>
                  </div>
                </div>
                
                {/* Progress Bars */}
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Education</span>
                      <span className="font-bold text-[#2E8B57]">{child.educationProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#2E8B57] to-[#3CB371] rounded-full"
                        style={{ width: `${child.educationProgress}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-500">Health</span>
                      <span className="font-bold text-[#2E8B57]">{child.healthProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-[#2E8B57] to-[#3CB371] rounded-full"
                        style={{ width: `${child.healthProgress}%` }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button className="flex-1 bg-[#2E8B57] text-white py-2.5 rounded-xl font-semibold
                                   hover:bg-[#3CB371] transition-all duration-300
                                   flex items-center justify-center gap-2">
                    <VisibilityIcon className="text-sm" />
                    View Updates
                  </button>
                  <button className="px-4 py-2.5 border border-[#2E8B57] text-[#2E8B57] rounded-xl
                                   hover:bg-[#2E8B57] hover:text-white transition-all duration-300">
                    <PaymentIcon className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Child</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Location</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Started</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Monthly</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Total</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Progress</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sponsoredChildren.map((child) => (
                <tr key={child.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={child.image} alt={child.name} className="w-10 h-10 rounded-xl object-cover" />
                      <span className="font-medium">{child.name}</span>
                    </div>
                  </td>
                  <td className="p-4">{child.location}</td>
                  <td className="p-4">{child.sponsorshipStartDate}</td>
                  <td className="p-4 font-bold text-[#2E8B57]">${child.monthlyContribution}</td>
                  <td className="p-4 font-bold">${child.totalContributed}</td>
                  <td className="p-4">
                    <div className="w-24 bg-slate-100 rounded-full h-2">
                      <div 
                        className="h-full bg-gradient-to-r from-[#2E8B57] to-[#3CB371] rounded-full"
                        style={{ width: `${(child.educationProgress + child.healthProgress) / 2}%` }}
                      />
                    </div>
                  </td>
                  <td className="p-4">
                    <button className="text-[#2E8B57] hover:underline text-sm font-medium">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ============== Sponsorship History Page ==============

const SponsorshipHistoryPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');

  const sponsorships: Sponsorship[] = [
    {
      id: 1,
      childName: 'Abebe Kebede',
      childId: 1,
      startDate: 'Jan 15, 2023',
      status: 'active',
      monthlyAmount: 50,
      totalAmount: 650,
      lastPayment: 'Mar 1, 2024',
      nextPayment: 'Apr 1, 2024',
      image: 'https://i.pravatar.cc/300?img=1'
    },
    {
      id: 2,
      childName: 'Sara Tesfaye',
      childId: 2,
      startDate: 'Mar 10, 2023',
      status: 'active',
      monthlyAmount: 45,
      totalAmount: 540,
      lastPayment: 'Mar 1, 2024',
      nextPayment: 'Apr 1, 2024',
      image: 'https://i.pravatar.cc/300?img=2'
    },
    {
      id: 3,
      childName: 'Mekdes Hailu',
      childId: 3,
      startDate: 'Jun 5, 2022',
      endDate: 'Dec 5, 2023',
      status: 'completed',
      monthlyAmount: 60,
      totalAmount: 1080,
      lastPayment: 'Dec 1, 2023',
      nextPayment: '-',
      image: 'https://i.pravatar.cc/300?img=3'
    }
  ];

  const filteredSponsorships = selectedPeriod === 'all' 
    ? sponsorships 
    : sponsorships.filter(s => s.status === selectedPeriod);

  const totalActive = sponsorships.filter(s => s.status === 'active').length;
  const totalCompleted = sponsorships.filter(s => s.status === 'completed').length;
  const totalContributed = sponsorships.reduce((sum, s) => sum + s.totalAmount, 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
            Sponsorship History
          </h2>
          <p className="text-slate-500 mt-1">Track all your past and current sponsorships</p>
        </div>
        <select
          value={selectedPeriod}
          onChange={(e) => setSelectedPeriod(e.target.value)}
          className="px-4 py-2 bg-white rounded-xl border border-slate-200
                   focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
        >
          <option value="all">All Sponsorships</option>
          <option value="active">Active Only</option>
          <option value="completed">Completed Only</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Total Sponsorships</p>
          <p className="text-3xl font-bold text-[#2E8B57]">{sponsorships.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600">{totalActive}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Completed</p>
          <p className="text-3xl font-bold text-blue-600">{totalCompleted}</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <p className="text-sm text-slate-500 mb-1">Total Contributed</p>
          <p className="text-3xl font-bold text-[#2E8B57]">${totalContributed}</p>
        </div>
      </div>

      {/* Timeline View */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-semibold">Sponsorship Timeline</h3>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {filteredSponsorships.map((sponsorship, index) => (
              <div key={sponsorship.id} className="relative">
                {index < filteredSponsorships.length - 1 && (
                  <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-slate-200" />
                )}
                <div className="flex gap-6">
                  <div className="relative">
                    <div className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center
                      ${sponsorship.status === 'active' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-blue-100 text-blue-600'}
                    `}>
                      {sponsorship.status === 'active' ? <Favorite /> : <CheckCircleIcon />}
                    </div>
                  </div>
                  
                  <div className="flex-1 bg-slate-50 rounded-xl p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-bold text-lg">{sponsorship.childName}</h4>
                        <p className="text-sm text-slate-500">
                          {sponsorship.startDate} - {sponsorship.endDate || 'Present'}
                        </p>
                      </div>
                      <span className={`
                        px-3 py-1 rounded-full text-xs font-semibold
                        ${sponsorship.status === 'active' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-blue-100 text-blue-600'}
                      `}>
                        {sponsorship.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-slate-500">Monthly</p>
                        <p className="font-bold text-[#2E8B57]">${sponsorship.monthlyAmount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Total</p>
                        <p className="font-bold">${sponsorship.totalAmount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Last Payment</p>
                        <p className="text-sm">{sponsorship.lastPayment}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500">Next Payment</p>
                        <p className="text-sm text-[#2E8B57]">{sponsorship.nextPayment}</p>
                      </div>
                    </div>
                    
                    <button className="mt-3 text-[#2E8B57] text-sm font-semibold hover:underline">
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== Submit Child Profile Page (UC-03) ==============

const SubmitChildProfilePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    dateOfBirth: '',
    gender: '',
    location: '',
    region: '',
    city: '',
    bio: '',
    needs: [] as string[],
    interests: [] as string[],
    educationLevel: '',
    healthStatus: '',
    documents: [] as File[],
    photos: [] as File[]
  });

  const needs = ['Education', 'Healthcare', 'Nutrition', 'School Supplies', 'Uniform', 'Books'];
  const interests = ['Math', 'Science', 'Reading', 'Sports', 'Art', 'Music', 'Dancing'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle submission
    alert('Child profile submitted successfully! Pending review.');
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

      {/* Progress Steps */}
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center flex-1">
            <div className={`
              w-10 h-10 rounded-2xl flex items-center justify-center font-semibold
              ${currentStep >= step 
                ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white' 
                : 'bg-slate-100 text-slate-400'}
            `}>
              {step}
            </div>
            {step < 3 && (
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
            <h3 className="text-xl font-bold mb-6">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
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
                <label className="block text-sm font-medium mb-2">Age *</label>
                <input
                  type="number"
                  required
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                  placeholder="Age"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Date of Birth *</label>
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
                <label className="block text-sm font-medium mb-2">Gender *</label>
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
              <label className="block text-sm font-medium mb-2">Biography *</label>
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
            <h3 className="text-xl font-bold mb-6">Location & Needs</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Region *</label>
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
                <label className="block text-sm font-medium mb-2">City *</label>
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
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Needs *</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {needs.map((need) => (
                  <label key={need} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
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
                      className="text-[#2E8B57] focus:ring-[#2E8B57]"
                    />
                    <span className="text-sm">{need}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Interests</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {interests.map((interest) => (
                  <label key={interest} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
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
                      className="text-[#2E8B57] focus:ring-[#2E8B57]"
                    />
                    <span className="text-sm">{interest}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-100 space-y-6">
            <h3 className="text-xl font-bold mb-6">Documents & Photos</h3>
            
            <div>
              <label className="block text-sm font-medium mb-2">Upload Photos *</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                <UploadIcon className="text-4xl text-slate-400 mb-3 mx-auto" />
                <p className="text-sm text-slate-500 mb-2">Drag and drop photos here, or click to select</p>
                <p className="text-xs text-slate-400">Maximum 5 photos, 10MB each</p>
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
                <p className="text-sm text-green-600 mt-2">
                  {formData.photos.length} photos selected
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Supporting Documents</label>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                <DescriptionIcon className="text-4xl text-slate-400 mb-3 mx-auto" />
                <p className="text-sm text-slate-500 mb-2">Upload birth certificate, health records, etc.</p>
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files) {
                      setFormData({...formData, documents: Array.from(e.target.files)});
                    }
                  }}
                />
              </div>
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
                       transition-colors font-medium flex items-center gap-2"
            >
              <ArrowBackIcon className="text-sm" />
              Previous
            </button>
          )}
          {currentStep < 3 ? (
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
              Submit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

// ============== Submission Status Page (UC-04) ==============

const SubmissionStatusPage: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const submissions: Submission[] = [
    {
      id: 1,
      childName: 'Tigist Alemu',
      age: 7,
      location: 'Addis Ababa',
      submittedDate: '2024-02-15',
      status: 'approved',
      organization: 'Hope for Children',
      reviewer: 'Admin Team',
      reviewDate: '2024-02-17',
      image: 'https://i.pravatar.cc/300?img=6',
      bio: 'Tigist is a bright and energetic girl who loves learning.'
    },
    {
      id: 2,
      childName: 'Dawit Mengistu',
      age: 9,
      location: 'Bahir Dar',
      submittedDate: '2024-02-10',
      status: 'pending',
      organization: 'Bright Future Foundation',
      image: 'https://i.pravatar.cc/300?img=7',
      bio: 'Dawit shows great interest in science and wants to be a doctor.'
    },
    {
      id: 3,
      childName: 'Birtukan Tadesse',
      age: 6,
      location: 'Gondar',
      submittedDate: '2024-02-05',
      status: 'rejected',
      feedback: 'Duplicate record found. Child already registered with another organization.',
      organization: 'Education for All',
      reviewer: 'Admin Team',
      reviewDate: '2024-02-07',
      image: 'https://i.pravatar.cc/300?img=8',
      bio: 'Birtukan enjoys drawing and playing with friends.'
    },
    {
      id: 4,
      childName: 'Yonas Haile',
      age: 8,
      location: 'Hawassa',
      submittedDate: '2024-01-28',
      status: 'published',
      organization: 'Medical Aid Ethiopia',
      reviewer: 'Admin Team',
      reviewDate: '2024-01-30',
      image: 'https://i.pravatar.cc/300?img=9',
      bio: 'Yonas is passionate about soccer and dreams of becoming a player.'
    }
  ];

  const filteredSubmissions = selectedFilter === 'all' 
    ? submissions 
    : submissions.filter(s => s.status === selectedFilter);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-600';
      case 'pending': return 'bg-yellow-100 text-yellow-600';
      case 'rejected': return 'bg-red-100 text-red-600';
      case 'published': return 'bg-blue-100 text-blue-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'approved': return <CheckCircleIcon className="text-sm" />;
      case 'pending': return <TimelineIcon className="text-sm" />;
      case 'rejected': return <WarningIcon className="text-sm" />;
      case 'published': return <Public className="text-sm" />;
      default: return <AssignmentIcon className="text-sm" />;
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
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-[#2E8B57]">{submissions.length}</p>
          <p className="text-sm text-slate-500">Total</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-yellow-600">
            {submissions.filter(s => s.status === 'pending').length}
          </p>
          <p className="text-sm text-slate-500">Pending</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-green-600">
            {submissions.filter(s => s.status === 'approved').length}
          </p>
          <p className="text-sm text-slate-500">Approved</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-red-600">
            {submissions.filter(s => s.status === 'rejected').length}
          </p>
          <p className="text-sm text-slate-500">Rejected</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-2xl font-bold text-blue-600">
            {submissions.filter(s => s.status === 'published').length}
          </p>
          <p className="text-sm text-slate-500">Published</p>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Child</th>
                <th className="text-left p-4 text-sm font-semibold text-slate-600">Organization</th>
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
                        <p className="font-medium">{submission.childName}</p>
                        <p className="text-xs text-slate-500">{submission.age} years</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{submission.organization}</p>
                    <p className="text-xs text-slate-500">{submission.location}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm">{submission.submittedDate}</p>
                  </td>
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
                        <p className="text-sm">{submission.reviewDate}</p>
                        <p className="text-xs text-slate-500">by {submission.reviewer}</p>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-400">Not reviewed</span>
                    )}
                  </td>
                  <td className="p-4">
                    <button className="text-[#2E8B57] hover:underline text-sm font-medium
                                     flex items-center gap-1">
                      View Feedback
                      <ChevronRightIcon className="text-sm" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Modal Example (for rejected submissions) */}
      {filteredSubmissions.some(s => s.status === 'rejected' && s.feedback) && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <WarningIcon className="text-orange-600 mt-1" />
            <div>
              <h4 className="font-semibold text-orange-800 mb-2">Rejection Feedback Available</h4>
              <p className="text-sm text-orange-700">
                Some submissions require attention. Click "View Feedback" for details.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============== Profile Page ==============

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'Abeba Tesfaye',
    email: 'abeba.tesfaye@example.com',
    phone: '+251 912 345 678',
    organization: 'Hope for Children',
    role: 'NGO Staff Member',
    joinDate: 'Jan 15, 2023',
    totalSponsored: 3,
    totalContributed: 1190,
    address: 'Bole Sub-city, Addis Ababa',
    bio: 'Dedicated to improving children\'s lives through education and healthcare support.'
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
        My Profile
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
                  <button className="absolute bottom-0 right-0 bg-[#2E8B57] text-white p-2 
                                   rounded-lg hover:bg-[#3CB371] transition-colors">
                    <EditIcon className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="pt-20 p-6 text-center">
              <h3 className="text-xl font-bold">{profile.fullName}</h3>
              <p className="text-sm text-slate-500 mb-2">{profile.role}</p>
              <p className="text-sm text-[#2E8B57] font-medium mb-4">{profile.organization}</p>
              
              <div className="flex justify-center gap-4 py-4 border-t border-slate-100">
                <div>
                  <p className="text-2xl font-bold text-[#2E8B57]">{profile.totalSponsored}</p>
                  <p className="text-xs text-slate-500">Sponsored</p>
                </div>
                <div className="w-px h-10 bg-slate-200" />
                <div>
                  <p className="text-2xl font-bold text-[#2E8B57]">${profile.totalContributed}</p>
                  <p className="text-xs text-slate-500">Contributed</p>
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
              <h3 className="text-xl font-bold">Personal Information</h3>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 bg-[#2E8B57] text-white rounded-xl font-semibold
                         hover:bg-[#3CB371] transition-all duration-300"
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => setProfile({...profile, fullName: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200
                               focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-slate-50 rounded-xl">{profile.fullName}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({...profile, email: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200
                               focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-slate-50 rounded-xl">{profile.email}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200
                               focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-slate-50 rounded-xl">{profile.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Organization</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.organization}
                      onChange={(e) => setProfile({...profile, organization: e.target.value})}
                      className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200
                               focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                    />
                  ) : (
                    <p className="px-4 py-2 bg-slate-50 rounded-xl">{profile.organization}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({...profile, address: e.target.value})}
                    className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                  />
                ) : (
                  <p className="px-4 py-2 bg-slate-50 rounded-xl">{profile.address}</p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Bio</label>
                {isEditing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    rows={4}
                    className="w-full px-4 py-2 bg-slate-50 rounded-xl border border-slate-200
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                  />
                ) : (
                  <p className="px-4 py-2 bg-slate-50 rounded-xl">{profile.bio}</p>
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
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
        Settings
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
            {['account', 'notifications', 'privacy', 'payments'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-6 py-4 border-b border-slate-100 last:border-0
                         transition-colors capitalize
                         ${activeTab === tab 
                           ? 'bg-gradient-to-r from-[#2E8B57]/10 to-[#3CB371]/10 text-[#2E8B57] font-semibold' 
                           : 'hover:bg-slate-50'}`}
              >
                {tab} Settings
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold mb-4">Account Settings</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Change Password</label>
                  <input
                    type="password"
                    placeholder="Current Password"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 mb-3
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200 mb-3
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                  />
                  <input
                    type="password"
                    placeholder="Confirm New Password"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57]"
                  />
                </div>
                
                <div className="pt-4">
                  <button className="px-6 py-3 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] 
                                   text-white rounded-xl font-semibold hover:shadow-lg 
                                   transition-all duration-300">
                    Update Password
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-4">
                <h3 className="text-xl font-bold mb-4">Notification Preferences</h3>
                
                {[
                  'Email notifications for child updates',
                  'SMS alerts for payment confirmations',
                  'Monthly impact reports',
                  'New sponsorship opportunities',
                  'System announcements'
                ].map((item, index) => (
                  <label key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                    <span className="text-sm">{item}</span>
                    <input type="checkbox" defaultChecked className="text-[#2E8B57] focus:ring-[#2E8B57]" />
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== Dashboard Home Page ==============

const DashboardHome: React.FC = () => {
  const [selectedChild, setSelectedChild] = useState<number | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [hoveredStat, setHoveredStat] = useState<number | null>(null);

  const activities: Activity[] = [
    {
      id: 1,
      icon: <MedicalServices />,
      title: 'Health checkup completed',
      childName: 'Abebe Kebede',
      timestamp: 'Today, 10:30 AM',
      description: 'Routine quarterly checkup. Results within normal ranges.',
      type: 'health'
    },
    {
      id: 2,
      icon: <School />,
      title: 'School supplies delivered',
      childName: 'Sara Tesfaye',
      timestamp: 'Yesterday',
      description: 'New textbooks and uniform delivered for the semester.',
      type: 'education'
    },
    {
      id: 3,
      icon: <CheckCircleIcon />,
      title: 'Submission approved',
      childName: 'Tigist Alemu',
      timestamp: '2 days ago',
      description: 'Child profile has been approved and is now visible to sponsors.',
      type: 'submission'
    },
    {
      id: 4,
      icon: <EmojiEventsIcon />,
      title: 'New sponsor found',
      childName: 'Mekdes Hailu',
      timestamp: '3 days ago',
      description: 'A new sponsor has been matched with your child.',
      type: 'sponsorship'
    }
  ];

  const getActivityColor = (type: string) => {
    switch(type) {
      case 'health': return 'text-blue-500 bg-blue-50';
      case 'education': return 'text-purple-500 bg-purple-50';
      case 'nutrition': return 'text-green-500 bg-green-50';
      case 'submission': return 'text-orange-500 bg-orange-50';
      case 'sponsorship': return 'text-pink-500 bg-pink-50';
      default: return 'text-orange-500 bg-orange-50';
    }
  };

  return (
    <div className="space-y-8">
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
            <RocketLaunchIcon className="animate-bounce" />
            <span className="text-sm font-semibold uppercase tracking-wider bg-white/20 px-3 py-1 rounded-full">
              Welcome to Your Dashboard
            </span>
          </div>
          <h2 className="text-4xl font-bold mb-3 bg-gradient-to-r from-white to-yellow-100 bg-clip-text text-transparent">
            Hello, Abeba! 👋
          </h2>
          <p className="text-white/90 leading-relaxed max-w-2xl text-lg">
            You're making a difference in the lives of 3 children. Track your impact, 
            manage sponsorships, and submit new child profiles all in one place.
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { icon: AccountBalanceWallet, label: 'Total Donated', value: '$4,250', change: '+12%' },
          { icon: Group, label: 'Children Sponsored', value: '03', subtext: 'Active sponsorships' },
          { icon: AssignmentIcon, label: 'Pending Submissions', value: '02', subtext: 'Awaiting review' },
          { icon: EmojiEventsIcon, label: 'Impact Score', value: '94', subtext: 'Top 5% sponsor' }
        ].map((stat, index) => (
          <div
            key={index}
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
                {stat.change && (
                  <span className={`
                    text-xs font-bold px-2 py-1 rounded-full transition-all duration-500
                    ${hoveredStat === index ? 'bg-[#2E8B57] text-white' : 'bg-yellow-100 text-yellow-800'}
                  `}>
                    {stat.change}
                  </span>
                )}
              </div>
              
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
              {stat.subtext && (
                <p className="text-xs text-slate-400 mt-2">{stat.subtext}</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
            Recent Activity
          </h3>
          
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
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
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-2xl font-bold mb-6 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
            Quick Actions
          </h3>
          
          <div className="space-y-4">
            <button className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl 
                             transition-all duration-300 group border border-slate-100
                             flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2E8B57]/10 rounded-xl flex items-center justify-center
                            group-hover:scale-110 transition-transform">
                <AddCircleIcon className="text-[#2E8B57]" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Submit New Child</p>
                <p className="text-xs text-slate-500">Register a child for sponsorship</p>
              </div>
            </button>
            
            <button className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl 
                             transition-all duration-300 group border border-slate-100
                             flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2E8B57]/10 rounded-xl flex items-center justify-center
                            group-hover:scale-110 transition-transform">
                <TrackChangesIcon className="text-[#2E8B57]" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Track Submissions</p>
                <p className="text-xs text-slate-500">Check status of pending profiles</p>
              </div>
            </button>
            
            <button className="w-full bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl 
                             transition-all duration-300 group border border-slate-100
                             flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2E8B57]/10 rounded-xl flex items-center justify-center
                            group-hover:scale-110 transition-transform">
                <ChildCare className="text-[#2E8B57]" />
              </div>
              <div className="text-left">
                <p className="font-semibold">Browse Children</p>
                <p className="text-xs text-slate-500">Find children to sponsor</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== Main SponsorDashboard Component ==============

const SponsorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  
  // Determine active page based on URL path
  const getActivePage = () => {
    const path = location.pathname.split('/').pop();
    if (path === 'browse-children') return 'browse';
    if (path === 'my-children') return 'my-children';
    if (path === 'sponsorship-history') return 'history';
    if (path === 'submit-child') return 'submit';
    if (path === 'submission-status') return 'submissions';
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
    navigate('/');
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
    { id: 'dashboard', label: 'Dashboard', icon: Dashboard, path: '/sponsor/dashboard' },
    { id: 'browse', label: 'Browse Children', icon: SearchIcon, path: '/sponsor/browse-children' },
    { id: 'my-children', label: 'My Children', icon: ChildCare, path: '/sponsor/my-children' },
    { id: 'history', label: 'Sponsorship History', icon: History, path: '/sponsor/sponsorship-history' },
    { id: 'submit', label: 'Submit Child', icon: AddCircleIcon, path: '/sponsor/submit-child' },
    { id: 'submissions', label: 'Submission Status', icon: TrackChangesIcon, path: '/sponsor/submission-status' },
  ];

  // Render the appropriate page based on activePage
  const renderPage = () => {
    switch(activePage) {
      case 'browse':
        return <BrowseChildrenPage />;
      case 'my-children':
        return <MyChildrenPage />;
      case 'history':
        return <SponsorshipHistoryPage />;
      case 'submit':
        return <SubmitChildProfilePage />;
      case 'submissions':
        return <SubmissionStatusPage />;
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
    avatar: 'https://i.pravatar.cc/150?img=7'
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA] text-[#374151]">
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
                  <Favorite className="text-white" />
                </div>
              </div>
              <div className={`
                transition-all duration-500 overflow-hidden
                ${!sidebarOpen ? 'lg:w-0 lg:opacity-0' : 'lg:w-auto lg:opacity-100'}
              `}>
                <span className="text-xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] 
                               bg-clip-text text-transparent whitespace-nowrap">
                  Sponsor Dashboard
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
                <item.icon className={`
                  transition-all duration-300
                  ${activePage === item.id ? 'text-white' : 'text-[#2E8B57]'}
                `} />
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
      </aside>

      {/* Main Content */}
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
                {activePage === 'dashboard' && 'Dashboard'}
                {activePage === 'browse' && 'Browse Children'}
                {activePage === 'my-children' && 'My Children'}
                {activePage === 'history' && 'Sponsorship History'}
                {activePage === 'submit' && 'Submit Child Profile'}
                {activePage === 'submissions' && 'Submission Status'}
                {activePage === 'profile' && 'My Profile'}
                {activePage === 'settings' && 'Settings'}
              </h1>
            </div>
            
            {/* Right Side Icons */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Notifications */}
              <button className="relative p-2 text-slate-500 hover:text-[#2E8B57] 
                               transition-all hover:scale-110 active:scale-95">
                <Notifications />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFD700] 
                               border-2 border-white rounded-full animate-ping" />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FFD700] 
                               border-2 border-white rounded-full" />
              </button>
              
              {/* User Menu Dropdown */}
              <UserMenu 
                user={user}
                onLogout={handleLogout}
                onProfile={() => handleNavigation('profile', '/sponsor/profile')}
                onSettings={() => handleNavigation('settings', '/sponsor/settings')}
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

// Add missing PaymentIcon component
const PaymentIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
  </svg>
);

export default SponsorDashboard;