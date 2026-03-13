import React, { useState } from 'react';
import {
  Group as GroupIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Download as DownloadIcon,
  PersonAdd as PersonAddIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  School as SchoolIcon,
  VolunteerActivism as VolunteerActivismIcon,
  Business as BusinessIcon,
  Block as BlockIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon
} from '@mui/icons-material';

// ============== Types and Interfaces ==============

interface User {
  id: number;
  initials: string;
  name: string;
  email: string;
  role: 'NGO' | 'Sponsor' | 'School' | 'Admin';
  status: 'active' | 'pending' | 'suspended';
  dateRegistered: string;
  avatarColor: string;
  organization?: string;
}

interface UserStats {
  ngos: number;
  schools: number;
  sponsors: number;
  total: number;
}

// ============== User Row Component ==============

interface UserRowProps {
  user: User;
  onAction: (userId: number, action: string) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onAction }) => {
  const [showActions, setShowActions] = useState(false);

  const getRoleColor = (role: string) => {
    switch(role) {
      case 'NGO': return 'bg-blue-100 text-blue-800';
      case 'Sponsor': return 'bg-purple-100 text-purple-800';
      case 'School': return 'bg-amber-100 text-amber-800';
      case 'Admin': return 'bg-slate-200 text-slate-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active':
        return {
          bg: 'bg-emerald-100',
          text: 'text-emerald-800',
          dot: 'bg-emerald-500'
        };
      case 'pending':
        return {
          bg: 'bg-amber-100',
          text: 'text-amber-800',
          dot: 'bg-amber-500'
        };
      case 'suspended':
        return {
          bg: 'bg-red-100',
          text: 'text-red-800',
          dot: 'bg-red-500'
        };
      default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-800',
          dot: 'bg-slate-500'
        };
    }
  };

  const statusColors = getStatusColor(user.status);

  return (
    <tr className="hover:bg-slate-50/80 transition-all duration-300 group relative">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className={`
            h-10 w-10 rounded-xl flex items-center justify-center 
            font-bold text-sm transition-all duration-300
            group-hover:scale-110 group-hover:rotate-6
            ${user.avatarColor}
          `}>
            {user.initials}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 
                        group-hover:text-[#2E8B57] transition-colors">
              {user.name}
            </p>
            <p className="text-xs text-slate-500">{user.email}</p>
            {user.organization && (
              <p className="text-[10px] text-slate-400 mt-0.5">{user.organization}</p>
            )}
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <span className={`
          inline-flex items-center px-2.5 py-1 rounded-lg 
          text-xs font-medium transition-all duration-300
          group-hover:scale-105 ${getRoleColor(user.role)}
        `}>
          {user.role}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <span className={`
          inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg 
          text-xs font-medium transition-all duration-300
          group-hover:scale-105 ${statusColors.bg} ${statusColors.text}
        `}>
          <span className={`w-1.5 h-1.5 rounded-full ${statusColors.dot} animate-pulse`} />
          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
        </span>
      </td>
      
      <td className="px-6 py-4 text-sm text-slate-500 hidden md:table-cell">
        {user.dateRegistered}
      </td>
      
      <td className="px-6 py-4 text-right relative">
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => onAction(user.id, 'view')}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 
                     hover:text-[#2E8B57] transition-all hover:scale-110"
          >
            <VisibilityIcon className="text-sm" />
          </button>
          <button 
            onClick={() => onAction(user.id, 'edit')}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 
                     hover:text-blue-500 transition-all hover:scale-110"
          >
            <EditIcon className="text-sm" />
          </button>
          <button 
            onClick={() => setShowActions(!showActions)}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 
                     hover:text-slate-600 transition-all hover:scale-110 relative"
          >
            <MoreVertIcon className="text-sm" />
          </button>
          
          {/* Action Dropdown */}
          {showActions && (
            <>
              <div 
                className="fixed inset-0 z-30"
                onClick={() => setShowActions(false)}
              />
              <div className="absolute right-0 top-12 mt-2 w-48 bg-white 
                            rounded-xl shadow-2xl border border-slate-100 
                            z-40 overflow-hidden animate-slideIn">
                <button 
                  onClick={() => {
                    onAction(user.id, 'suspend');
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 
                           text-sm text-amber-600 hover:bg-amber-50 
                           transition-colors"
                >
                  <BlockIcon className="text-sm" />
                  Suspend User
                </button>
                <button 
                  onClick={() => {
                    onAction(user.id, 'delete');
                    setShowActions(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 
                           text-sm text-red-600 hover:bg-red-50 
                           transition-colors"
                >
                  <DeleteIcon className="text-sm" />
                  Delete User
                </button>
              </div>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

// ============== Stat Card Component ==============

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: number;
  change: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, change, color }) => {
  return (
    <div className="group bg-white rounded-xl p-6 border border-slate-200 
                  hover:shadow-2xl transition-all duration-500 
                  hover:-translate-y-2 cursor-pointer relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#2E8B57] to-[#3CB371] 
                    opacity-0 group-hover:opacity-5 transition-opacity duration-500" />
      <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-100 
                    rounded-full group-hover:scale-150 transition-transform duration-700" />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-2">
          <div className={`p-2 rounded-lg bg-${color}-100 
                        group-hover:scale-110 group-hover:rotate-6 
                        transition-all duration-300`}>
            <Icon className={`text-${color}-600`} />
          </div>
          <h4 className="text-sm font-bold text-slate-900">
            {label}
          </h4>
        </div>
        <p className="text-3xl font-black text-[#2E8B57]">{value}</p>
        <p className="text-xs text-slate-500 mt-1">{change}</p>
      </div>
    </div>
  );
};

// ============== Main UserManagement Component ==============

interface UserManagementProps {
  onNavigate?: (page: string) => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Sample users data
  const users: User[] = [
    {
      id: 1,
      initials: 'AB',
      name: 'Abebe Bikila',
      email: 'abebe.b@example.et',
      role: 'NGO',
      status: 'active',
      dateRegistered: 'Oct 12, 2023',
      avatarColor: 'bg-blue-100 text-blue-600',
      organization: 'Hope for Children'
    },
    {
      id: 2,
      initials: 'LK',
      name: 'Liya Kebede',
      email: 'liya.k@foundation.org',
      role: 'Sponsor',
      status: 'active',
      dateRegistered: 'Nov 05, 2023',
      avatarColor: 'bg-purple-100 text-purple-600',
      organization: 'Individual Sponsor'
    },
    {
      id: 3,
      initials: 'SM',
      name: 'St. Mary School',
      email: 'contact@stmaryedu.et',
      role: 'School',
      status: 'pending',
      dateRegistered: 'Dec 01, 2023',
      avatarColor: 'bg-amber-100 text-amber-600',
      organization: 'Education Institution'
    },
    {
      id: 4,
      initials: 'DI',
      name: 'Dawit Isaac',
      email: 'dawit.isaac@yeethiopialij.et',
      role: 'Admin',
      status: 'suspended',
      dateRegistered: 'Jan 20, 2024',
      avatarColor: 'bg-slate-200 text-slate-600',
      organization: 'System Admin'
    },
    {
      id: 5,
      initials: 'MT',
      name: 'Mulu Tesfaye',
      email: 'mulu.tesf@sponsor.et',
      role: 'Sponsor',
      status: 'active',
      dateRegistered: 'Feb 15, 2024',
      avatarColor: 'bg-pink-100 text-pink-600',
      organization: 'Individual Sponsor'
    },
    {
      id: 6,
      initials: 'GF',
      name: 'Global Fund',
      email: 'admin@globalfund.org',
      role: 'NGO',
      status: 'active',
      dateRegistered: 'Mar 03, 2024',
      avatarColor: 'bg-blue-100 text-blue-600',
      organization: 'International NGO'
    },
    {
      id: 7,
      initials: 'AA',
      name: 'Addis Ababa Uni',
      email: 'partnership@aau.edu.et',
      role: 'School',
      status: 'active',
      dateRegistered: 'Mar 10, 2024',
      avatarColor: 'bg-amber-100 text-amber-600',
      organization: 'University'
    }
  ];

  // Stats
  const stats: UserStats = {
    ngos: users.filter(u => u.role === 'NGO').length,
    schools: users.filter(u => u.role === 'School').length,
    sponsors: users.filter(u => u.role === 'Sponsor').length,
    total: users.length
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'All Statuses' || 
                         user.status === statusFilter.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const usersPerPage = 5;
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  const handleUserAction = (userId: number, action: string) => {
    console.log(`User ${userId}: ${action}`);
    switch(action) {
      case 'view':
        alert(`Viewing user ${userId}`);
        break;
      case 'edit':
        alert(`Editing user ${userId}`);
        break;
      case 'suspend':
        alert(`Suspending user ${userId}`);
        break;
      case 'delete':
        alert(`Deleting user ${userId}`);
        break;
      default:
        break;
    }
  };

  const handleExport = () => {
    alert('Exporting user data...');
  };

  const handleCreateAdmin = () => {
    setShowCreateModal(true);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FA]">
      {/* Page Content */}
      <div className="p-4 lg:p-8 max-w-[1400px] mx-auto w-full space-y-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-[#2E8B57] 
                         to-[#3CB371] bg-clip-text text-transparent">
              User Management
            </h1>
            <p className="text-slate-500 text-base font-normal mt-1">
              Review system users, roles, and account permissions across the platform.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2.5 
                       bg-white border border-slate-200 
                       rounded-xl text-slate-700 text-sm font-bold 
                       hover:bg-slate-50 transition-all 
                       hover:scale-105 active:scale-95"
            >
              <DownloadIcon className="text-sm" />
              Export CSV
            </button>
            
            <button 
              onClick={handleCreateAdmin}
              className="flex items-center gap-2 px-4 py-2.5 
                       bg-gradient-to-r from-[#2E8B57] to-[#3CB371] 
                       text-white rounded-xl text-sm font-bold 
                       shadow-lg shadow-[#2E8B57]/20 
                       hover:shadow-xl hover:scale-105 
                       active:scale-95 transition-all duration-300
                       relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] 
                            group-hover:translate-x-[100%] transition-transform duration-700" />
              <PersonAddIcon className="text-sm" />
              Create New Admin
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={BusinessIcon}
            label="Active NGOs"
            value={stats.ngos}
            change="+12% from last month"
            color="blue"
          />
          <StatCard 
            icon={SchoolIcon}
            label="Partner Schools"
            value={stats.schools}
            change="+4% from last month"
            color="amber"
          />
          <StatCard 
            icon={VolunteerActivismIcon}
            label="Active Sponsors"
            value={stats.sponsors}
            change="+28% from last month"
            color="purple"
          />
          <StatCard 
            icon={GroupIcon}
            label="Total Users"
            value={stats.total}
            change="+15% from last month"
            color="green"
          />
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 
                      shadow-sm flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 
                                 text-slate-400 text-sm" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, email, or ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 
                       border-none rounded-xl text-sm 
                       focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20 
                       transition-all placeholder:text-slate-400"
            />
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Role Filter */}
            <div className="relative min-w-[140px]">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full appearance-none bg-slate-50 
                         border-none rounded-xl py-2.5 pl-4 pr-10 
                         text-sm font-medium text-slate-700 
                         focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20 
                         cursor-pointer"
              >
                <option>All Roles</option>
                <option>NGO</option>
                <option>Sponsor</option>
                <option>School</option>
                <option>Admin</option>
              </select>
              <ExpandMoreIcon className="absolute right-3 top-1/2 -translate-y-1/2 
                                      text-slate-400 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative min-w-[140px]">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none bg-slate-50 
                         border-none rounded-xl py-2.5 pl-4 pr-10 
                         text-sm font-medium text-slate-700 
                         focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20 
                         cursor-pointer"
              >
                <option>All Statuses</option>
                <option>Active</option>
                <option>Pending</option>
                <option>Suspended</option>
              </select>
              <ExpandMoreIcon className="absolute right-3 top-1/2 -translate-y-1/2 
                                      text-slate-400 pointer-events-none" />
            </div>

            {/* Filter Button */}
            <button className="p-2.5 bg-slate-50 rounded-xl text-slate-600 
                            hover:bg-slate-100 transition-all hover:scale-105 
                            active:scale-95">
              <FilterListIcon className="text-sm" />
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-slate-200 
                      shadow-sm overflow-hidden hover:shadow-2xl 
                      transition-all duration-500">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold uppercase 
                               tracking-wider text-slate-500">Name</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase 
                               tracking-wider text-slate-500">Role</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase 
                               tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-bold uppercase 
                               tracking-wider text-slate-500 hidden md:table-cell">
                    Date Registered
                  </th>
                  <th className="px-6 py-4 text-xs font-bold uppercase 
                               tracking-wider text-slate-500 text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedUsers.map((user) => (
                  <UserRow 
                    key={user.id} 
                    user={user} 
                    onAction={handleUserAction}
                  />
                ))}
              </tbody>
            </table>

            {paginatedUsers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500">No users match your filters</p>
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center 
                        justify-between gap-4 border-t border-slate-100 
                        bg-slate-50/50">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold">
                {(currentPage - 1) * usersPerPage + 1}-
                {Math.min(currentPage * usersPerPage, filteredUsers.length)}
              </span> of <span className="font-semibold">{filteredUsers.length}</span> users
            </p>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center justify-center size-8 
                         rounded-lg border border-slate-200 
                         bg-white text-slate-400 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:bg-slate-50 transition-all hover:scale-105 
                         active:scale-95"
              >
                <ChevronLeftIcon className="text-sm" />
              </button>
              
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`
                      flex items-center justify-center size-8 rounded-lg 
                      text-xs font-bold transition-all hover:scale-105 
                      active:scale-95
                      ${currentPage === pageNum
                        ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white shadow-lg'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }
                    `}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              {totalPages > 5 && (
                <>
                  <span className="text-slate-400 px-1">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className="flex items-center justify-center size-8 
                             rounded-lg border border-slate-200 
                             bg-white text-slate-600 text-xs 
                             font-bold hover:bg-slate-50 transition-all 
                             hover:scale-105 active:scale-95"
                  >
                    {totalPages}
                  </button>
                </>
              )}
              
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center justify-center size-8 
                         rounded-lg border border-slate-200 
                         bg-white text-slate-400 
                         disabled:opacity-50 disabled:cursor-not-allowed
                         hover:bg-slate-50 transition-all hover:scale-105 
                         active:scale-95"
              >
                <ChevronRightIcon className="text-sm" />
              </button>
            </div>
          </div>
        </div>

        {/* Create Admin Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowCreateModal(false)}
            />
            <div className="relative bg-white rounded-2xl max-w-md w-full p-6 animate-slideIn shadow-2xl">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 
                         rounded-lg transition-colors"
              >
                <CloseIcon className="text-slate-500" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 
                              bg-gradient-to-br from-[#2E8B57] to-[#3CB371] 
                              rounded-2xl flex items-center justify-center">
                  <PersonAddIcon className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold">Create New Admin</h3>
                <p className="text-slate-500 mt-1">Add a new administrator to the platform</p>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl 
                             border border-slate-200 focus:outline-none 
                             focus:ring-2 focus:ring-[#2E8B57]/20"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl 
                             border border-slate-200 focus:outline-none 
                             focus:ring-2 focus:ring-[#2E8B57]/20"
                    placeholder="Enter email address"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
                  <select
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl 
                             border border-slate-200 focus:outline-none 
                             focus:ring-2 focus:ring-[#2E8B57]/20"
                  >
                    <option>Super Admin</option>
                    <option>Admin</option>
                    <option>Moderator</option>
                    <option>Viewer</option>
                  </select>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 px-4 py-3 border border-slate-200 
                             rounded-xl hover:bg-slate-50 
                             transition-colors font-medium text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] 
                             text-white px-4 py-3 rounded-xl font-semibold 
                             hover:shadow-lg transition-all duration-300
                             hover:scale-105 active:scale-95"
                  >
                    Create Admin
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

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

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default UserManagement;