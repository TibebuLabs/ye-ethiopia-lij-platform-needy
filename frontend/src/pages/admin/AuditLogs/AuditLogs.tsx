import React, { useState } from 'react';
import {
  HistoryEdu as HistoryEduIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon,
  Visibility as VisibilityIcon,
  Schedule as ScheduleIcon,
  Language as LanguageIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  VerifiedUser as VerifiedUserIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';

// ============== Types and Interfaces ==============

interface AuditEntry {
  id: number;
  timestamp: string;
  ethiopianDate: string;
  user: {
    initials: string;
    name: string;
    role: string;
    avatar?: string;
  };
  action: {
    category: string;
    type: 'success' | 'warning' | 'error' | 'info' | 'security';
    description: string;
  };
  recordId: string;
  details: string;
  ipAddress?: string;
  location?: string;
}

// ============== Log Entry Component ==============

interface LogEntryProps {
  entry: AuditEntry;
  onViewDetails: (id: number) => void;
}

const LogEntry: React.FC<LogEntryProps> = ({ entry, onViewDetails }) => {
  const getActionIcon = (type: string) => {
    switch(type) {
      case 'success':
        return <CheckCircleIcon className="text-green-500" />;
      case 'warning':
        return <WarningIcon className="text-amber-500" />;
      case 'error':
        return <ErrorIcon className="text-red-500" />;
      case 'security':
        return <SecurityIcon className="text-purple-500" />;
      default:
        return <InfoIcon className="text-blue-500" />;
    }
  };

  const getActionBg = (type: string) => {
    switch(type) {
      case 'success': return 'bg-green-50';
      case 'warning': return 'bg-amber-50';
      case 'error': return 'bg-red-50';
      case 'security': return 'bg-purple-50';
      default: return 'bg-blue-50';
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'Child Registration':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Permission Change':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Record Deletion':
        return 'bg-red-50 text-red-700 border-red-100';
      case 'Account Approval':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'Security Audit':
        return 'bg-gray-50 text-gray-700 border-gray-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 
                  transition-all duration-300 group cursor-pointer
                  relative overflow-hidden">
      {/* Hover effect line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b 
                    from-[#2E8B57] to-[#3CB371] opacity-0 
                    group-hover:opacity-100 transition-opacity duration-300" />
      
      <td className="px-6 py-4">
        <div className={`
          rounded-xl p-2 w-fit transition-all duration-300
          group-hover:scale-110 group-hover:rotate-6
          ${getActionBg(entry.action.type)}
        `}>
          {getActionIcon(entry.action.type)}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="text-sm font-semibold text-slate-900 dark:text-white
                      group-hover:text-[#2E8B57] transition-colors">
          {entry.timestamp}
        </div>
        <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
          <CalendarIcon className="text-[12px]" />
          {entry.ethiopianDate}
        </div>
      </td>
      
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">
          <div className={`
            size-8 rounded-xl flex items-center justify-center 
            text-xs font-bold transition-all duration-300
            group-hover:scale-110 group-hover:rotate-6
            bg-gradient-to-br from-[#2E8B57]/10 to-[#3CB371]/10 
            text-[#2E8B57]
          `}>
            {entry.user.initials}
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900 dark:text-white">
              {entry.user.name}
            </div>
            <div className="text-[10px] text-slate-500 flex items-center gap-1">
              <PersonIcon className="text-[10px]" />
              {entry.user.role}
            </div>
          </div>
        </div>
      </td>
      
      <td className="px-6 py-4">
        <span className={`
          px-3 py-1 rounded-full text-[10px] font-bold 
          border uppercase tracking-tight whitespace-nowrap
          transition-all duration-300 group-hover:scale-105
          ${getCategoryColor(entry.action.category)}
        `}>
          {entry.action.category}
        </span>
      </td>
      
      <td className="px-6 py-4">
        <span className="text-sm font-mono text-slate-500 
                       bg-slate-50 dark:bg-slate-800/50 
                       px-2 py-1 rounded-lg">
          {entry.recordId}
        </span>
      </td>
      
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => onViewDetails(entry.id)}
          className="text-[#2E8B57] hover:text-[#3CB371] 
                   text-xs font-bold flex items-center gap-1 ml-auto
                   transition-all hover:scale-105 active:scale-95
                   group/btn"
        >
          View Details
          <ChevronRightIcon className="text-sm group-hover/btn:translate-x-1 
                                     transition-transform" />
        </button>
      </td>
    </tr>
  );
};

// ============== Filter Section Component ==============

interface FilterSectionProps {
  dateRange: string;
  setDateRange: (value: string) => void;
  roleFilter: string;
  setRoleFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  showEthiopianDate: boolean;
  setShowEthiopianDate: (value: boolean) => void;
  onApplyFilters: () => void;
  onRefresh: () => void;
}

const FilterSection: React.FC<FilterSectionProps> = ({
  dateRange,
  setDateRange,
  roleFilter,
  setRoleFilter,
  categoryFilter,
  setCategoryFilter,
  showEthiopianDate,
  setShowEthiopianDate,
  onApplyFilters,
  onRefresh
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 
                  border border-slate-200 dark:border-slate-800 
                  shadow-lg hover:shadow-2xl transition-all duration-500">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Date Range */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-slate-500 
                          tracking-wider flex items-center gap-1">
            <CalendarIcon className="text-sm" />
            Date Range
          </label>
          <div className="relative">
            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 
                                   text-slate-400 text-sm" />
            <input
              type="text"
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 
                       border-none rounded-xl text-sm 
                       focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20
                       placeholder:text-slate-400"
              placeholder="Oct 01 - Oct 31, 2023"
            />
          </div>
        </div>

        {/* User Role Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-slate-500 
                          tracking-wider flex items-center gap-1">
            <PersonIcon className="text-sm" />
            User Role
          </label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 
                     border-none rounded-xl text-sm 
                     focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20
                     cursor-pointer appearance-none"
          >
            <option>All Roles</option>
            <option>System Admin</option>
            <option>Sub-Admin</option>
            <option>Social Worker</option>
            <option>Registration Officer</option>
          </select>
        </div>

        {/* Action Category Filter */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold uppercase text-slate-500 
                          tracking-wider flex items-center gap-1">
            <AssignmentIcon className="text-sm" />
            Action Category
          </label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 
                     border-none rounded-xl text-sm 
                     focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20
                     cursor-pointer appearance-none"
          >
            <option>All Actions</option>
            <option>Child Registration</option>
            <option>Account Approval</option>
            <option>Permission Change</option>
            <option>System Update</option>
            <option>Record Deletion</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          <button
            onClick={onApplyFilters}
            className="flex-1 py-2.5 bg-gradient-to-r from-[#2E8B57] 
                     to-[#3CB371] text-white text-sm font-bold 
                     rounded-xl hover:shadow-lg hover:scale-105 
                     active:scale-95 transition-all duration-300
                     relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] 
                          group-hover:translate-x-[100%] transition-transform 
                          duration-700" />
            Apply Filters
          </button>
          <button
            onClick={onRefresh}
            className="p-2.5 border border-slate-200 dark:border-slate-700 
                     text-slate-500 rounded-xl hover:bg-slate-50 
                     dark:hover:bg-slate-800 transition-all 
                     hover:scale-110 active:scale-95
                     hover:rotate-90 duration-500"
          >
            <RefreshIcon className="text-sm" />
          </button>
        </div>
      </div>

      {/* Ethiopian Date Toggle */}
      <div className="mt-4 flex items-center gap-4 pt-4 border-t 
                    border-slate-100 dark:border-slate-800">
        <label className="flex items-center gap-2 cursor-pointer group">
          <input
            type="checkbox"
            checked={showEthiopianDate}
            onChange={(e) => setShowEthiopianDate(e.target.checked)}
            className="rounded border-slate-300 text-[#2E8B57] 
                     focus:ring-[#2E8B57] focus:ring-offset-0
                     transition-all duration-300
                     group-hover:scale-110"
          />
          <span className="text-xs font-medium text-slate-600 
                         dark:text-slate-400 flex items-center gap-1
                         group-hover:text-[#2E8B57] transition-colors">
            <LanguageIcon className="text-sm" />
            Show Ethiopian Date (GC to EC)
          </span>
        </label>
      </div>
    </div>
  );
};

// ============== Pagination Component ==============

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startEntry: number;
  endEntry: number;
  totalEntries: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  startEntry,
  endEntry,
  totalEntries,
  onPageChange
}) => {
  return (
    <div className="px-6 py-4 bg-slate-50/50 dark:bg-slate-800/20 
                  border-t border-slate-200 dark:border-slate-800
                  flex flex-col sm:flex-row sm:items-center 
                  justify-between gap-4">
      <p className="text-xs text-slate-500">
        Showing <span className="font-bold text-slate-900 dark:text-white">
          {startEntry}-{endEntry}
        </span> of{' '}
        <span className="font-bold text-slate-900 dark:text-white">
          {totalEntries}
        </span> entries
      </p>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-slate-200 dark:border-slate-700 
                   rounded-lg bg-white dark:bg-slate-900 
                   text-slate-400 disabled:opacity-50 
                   disabled:cursor-not-allowed
                   hover:bg-slate-50 dark:hover:bg-slate-800 
                   transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeftIcon className="text-sm" />
        </button>
        
        {[...Array(Math.min(5, totalPages))].map((_, i) => {
          const pageNum = i + 1;
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`
                min-w-[32px] h-8 rounded-lg text-xs font-bold 
                transition-all hover:scale-110 active:scale-95
                ${currentPage === pageNum
                  ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white shadow-lg'
                  : 'border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
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
              onClick={() => onPageChange(totalPages)}
              className="min-w-[32px] h-8 rounded-lg text-xs font-bold
                       border border-slate-200 dark:border-slate-700 
                       bg-white dark:bg-slate-900 text-slate-600 
                       dark:text-slate-400 hover:bg-slate-50
                       transition-all hover:scale-110 active:scale-95"
            >
              {totalPages}
            </button>
          </>
        )}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-slate-200 dark:border-slate-700 
                   rounded-lg bg-white dark:bg-slate-900 
                   text-slate-400 disabled:opacity-50 
                   disabled:cursor-not-allowed
                   hover:bg-slate-50 dark:hover:bg-slate-800 
                   transition-all hover:scale-110 active:scale-95"
        >
          <ChevronRightIcon className="text-sm" />
        </button>
      </div>
    </div>
  );
};

// ============== Log Details Modal Component ==============

interface LogDetailsModalProps {
  entry: AuditEntry | null;
  onClose: () => void;
}

const LogDetailsModal: React.FC<LogDetailsModalProps> = ({ entry, onClose }) => {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl 
                    max-w-lg w-full p-6 animate-slideIn shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 
                   dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <CloseIcon className="text-slate-500" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 
                        bg-gradient-to-br from-[#2E8B57] to-[#3CB371] 
                        rounded-2xl flex items-center justify-center">
            <HistoryEduIcon className="text-white text-3xl" />
          </div>
          <h3 className="text-2xl font-bold">Audit Log Details</h3>
          <p className="text-slate-500 mt-1">Entry #{entry.recordId}</p>
        </div>
        
        <div className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-xl bg-[#2E8B57]/10 
                            flex items-center justify-center">
                <PersonIcon className="text-[#2E8B57]" />
              </div>
              <div>
                <p className="text-sm font-semibold">{entry.user.name}</p>
                <p className="text-xs text-slate-500">{entry.user.role}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-slate-500">Timestamp</p>
                <p className="font-medium">{entry.timestamp}</p>
                <p className="text-xs text-slate-400">{entry.ethiopianDate}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">IP Address</p>
                <p className="font-medium">{entry.ipAddress || '192.168.1.45'}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 rounded-xl border border-slate-200 
                        dark:border-slate-700">
            <p className="text-xs text-slate-500 mb-2">Action Details</p>
            <p className="text-sm">{entry.action.description}</p>
            <div className="mt-3 flex gap-2">
              <span className="text-xs px-2 py-1 rounded-full 
                             bg-blue-50 text-blue-600">
                {entry.action.category}
              </span>
              <span className="text-xs px-2 py-1 rounded-full 
                             bg-slate-50 text-slate-600">
                ID: {entry.recordId}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== Main AuditLogs Component ==============

interface AuditLogsProps {
  onNavigate?: (page: string) => void;
}

const AuditLogs: React.FC<AuditLogsProps> = ({ onNavigate }) => {
  const [dateRange, setDateRange] = useState('Oct 01 - Oct 31, 2023');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [categoryFilter, setCategoryFilter] = useState('All Actions');
  const [showEthiopianDate, setShowEthiopianDate] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEntry, setSelectedEntry] = useState<AuditEntry | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Sample audit log data
  const auditEntries: AuditEntry[] = [
    {
      id: 1,
      timestamp: 'Oct 24, 2023 · 14:32:11',
      ethiopianDate: '14 Tikimt, 2016 EC',
      user: {
        initials: 'SM',
        name: 'Sara Mesfin',
        role: 'Social Worker'
      },
      action: {
        category: 'Child Registration',
        type: 'success',
        description: 'New child record created with all required documentation'
      },
      recordId: '#CH-4491-ET',
      details: 'Child registration approved after document verification',
      ipAddress: '192.168.1.102'
    },
    {
      id: 2,
      timestamp: 'Oct 24, 2023 · 12:05:45',
      ethiopianDate: '14 Tikimt, 2016 EC',
      user: {
        initials: 'AK',
        name: 'Abebe Kebede',
        role: 'System Admin'
      },
      action: {
        category: 'Permission Change',
        type: 'warning',
        description: 'User permissions modified for registration module'
      },
      recordId: '#USR-8820-AA',
      details: 'Added approval rights for child registration',
      ipAddress: '192.168.1.45'
    },
    {
      id: 3,
      timestamp: 'Oct 24, 2023 · 09:15:00',
      ethiopianDate: '14 Tikimt, 2016 EC',
      user: {
        initials: 'DK',
        name: 'Dawit Kassahun',
        role: 'Sub-Admin'
      },
      action: {
        category: 'Record Deletion',
        type: 'error',
        description: 'Child record marked for deletion due to duplicate'
      },
      recordId: '#CH-1209-GD',
      details: 'Soft delete initiated, pending supervisor approval',
      ipAddress: '192.168.1.67'
    },
    {
      id: 4,
      timestamp: 'Oct 23, 2023 · 16:45:22',
      ethiopianDate: '13 Tikimt, 2016 EC',
      user: {
        initials: 'HA',
        name: 'Hana Alemu',
        role: 'Social Worker'
      },
      action: {
        category: 'Account Approval',
        type: 'success',
        description: 'New sponsor account verified and activated'
      },
      recordId: '#USR-9912-BB',
      details: 'All KYC documents verified, account approved',
      ipAddress: '192.168.1.89'
    },
    {
      id: 5,
      timestamp: 'Oct 23, 2023 · 11:20:10',
      ethiopianDate: '13 Tikimt, 2016 EC',
      user: {
        initials: 'SYS',
        name: 'System Core',
        role: 'Automation Engine'
      },
      action: {
        category: 'Security Audit',
        type: 'security',
        description: 'Automated security scan completed'
      },
      recordId: '#SEC-LOG-404',
      details: 'No threats detected, system secure',
      ipAddress: '127.0.0.1'
    }
  ];

  const totalEntries = 1284;
  const entriesPerPage = 5;
  const totalPages = Math.ceil(totalEntries / entriesPerPage);
  const startEntry = (currentPage - 1) * entriesPerPage + 1;
  const endEntry = Math.min(currentPage * entriesPerPage, totalEntries);

  const handleViewDetails = (id: number) => {
    const entry = auditEntries.find(e => e.id === id);
    if (entry) {
      setSelectedEntry(entry);
      setShowDetailsModal(true);
    }
  };

  const handleApplyFilters = () => {
    console.log('Applying filters:', { dateRange, roleFilter, categoryFilter, showEthiopianDate });
    // In real app, fetch filtered data here
  };

  const handleRefresh = () => {
    console.log('Refreshing data...');
    // In real app, refresh data here
  };

  const handleExport = () => {
    alert('Exporting audit logs...');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FA] dark:bg-slate-900">
      <div className="p-4 lg:p-8 max-w-[1400px] mx-auto w-full space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black bg-gradient-to-r from-[#2E8B57] 
                         to-[#3CB371] bg-clip-text text-transparent">
              System Audit Trail & Logs
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Track all system activities and user actions
            </p>
          </div>
          
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2.5 
                     bg-white dark:bg-slate-900 
                     border border-slate-200 dark:border-slate-800 
                     rounded-xl text-sm font-bold 
                     hover:bg-slate-50 dark:hover:bg-slate-800 
                     transition-all hover:scale-105 active:scale-95
                     relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#2E8B57]/10 
                          to-[#3CB371]/10 opacity-0 group-hover:opacity-100 
                          transition-opacity duration-300" />
            <DownloadIcon className="text-sm" />
            Export CSV
          </button>
        </div>

        {/* Filter Section */}
        <FilterSection
          dateRange={dateRange}
          setDateRange={setDateRange}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          showEthiopianDate={showEthiopianDate}
          setShowEthiopianDate={setShowEthiopianDate}
          onApplyFilters={handleApplyFilters}
          onRefresh={handleRefresh}
        />

        {/* Logs Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl 
                      border border-slate-200 dark:border-slate-800 
                      shadow-lg overflow-hidden hover:shadow-2xl 
                      transition-all duration-500">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50 dark:bg-slate-800/50 
                             border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4 text-[11px] uppercase tracking-wider 
                               text-slate-500 font-bold w-12">Log</th>
                  <th className="px-6 py-4 text-[11px] uppercase tracking-wider 
                               text-slate-500 font-bold">Timestamp</th>
                  <th className="px-6 py-4 text-[11px] uppercase tracking-wider 
                               text-slate-500 font-bold">User (Actor)</th>
                  <th className="px-6 py-4 text-[11px] uppercase tracking-wider 
                               text-slate-500 font-bold">Action Category</th>
                  <th className="px-6 py-4 text-[11px] uppercase tracking-wider 
                               text-slate-500 font-bold">Record ID</th>
                  <th className="px-6 py-4 text-[11px] uppercase tracking-wider 
                               text-slate-500 font-bold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {auditEntries.map((entry) => (
                  <LogEntry
                    key={entry.id}
                    entry={entry}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            startEntry={startEntry}
            endEntry={endEntry}
            totalEntries={totalEntries}
            onPageChange={setCurrentPage}
          />
        </div>

        {/* Log Details Modal */}
        {showDetailsModal && (
          <LogDetailsModal
            entry={selectedEntry}
            onClose={() => {
              setShowDetailsModal(false);
              setSelectedEntry(null);
            }}
          />
        )}
      </div>

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

        .animate-slideIn {
          animation: slideIn 0.3s ease-out;
        }

        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d4e2da;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2E8B57;
        }
      `}</style>
    </div>
  );
};

export default AuditLogs;