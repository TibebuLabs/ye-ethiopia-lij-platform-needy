import React, { useState } from 'react';
import {
  ContentCopy as ContentCopyIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  History as HistoryIcon,
  Flag as FlagIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  PersonAdd as PersonAddIcon,
  Merge as MergeIcon,
  DeleteForever as DeleteForeverIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ChevronRight as ChevronRightIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  CalendarToday as CalendarIcon,
  Phone as PhoneIcon,
  Verified as VerifiedIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

// ============== Types and Interfaces ==============

interface ChildRecord {
  id: string;
  name: string;
  age: number;
  dateOfBirth: string;
  location: string;
  guardian: string;
  phone?: string;
  image: string;
  matchConfidence?: number;
  status: 'source' | 'pending' | 'duplicate';
  highlightFields?: string[];
}

interface ConflictMatch {
  field: string;
  existingValue: string;
  newValue: string;
  confidence: number;
  status: 'match' | 'conflict' | 'partial';
}

// ============== Comparison Field Component ==============

interface ComparisonFieldProps {
  label: string;
  existingValue: React.ReactNode;
  newValue: React.ReactNode;
  confidence?: number;
  status: 'match' | 'conflict' | 'partial';
  icon?: React.ReactNode;
}

const ComparisonField: React.FC<ComparisonFieldProps> = ({
  label,
  existingValue,
  newValue,
  confidence,
  status,
  icon
}) => {
  const getStatusStyles = () => {
    switch(status) {
      case 'match':
        return {
          bg: 'bg-[#2E8B57]/5',
          border: 'border-[#2E8B57]',
          text: 'text-[#2E8B57]',
          icon: <CheckCircleIcon className="text-sm" />
        };
      case 'conflict':
        return {
          bg: 'bg-red-50 dark:bg-red-900/10',
          border: 'border-red-400',
          text: 'text-red-500',
          icon: <ErrorIcon className="text-sm" />
        };
      case 'partial':
        return {
          bg: 'bg-amber-50 dark:bg-amber-900/10',
          border: 'border-amber-400',
          text: 'text-amber-500',
          icon: <WarningIcon className="text-sm" />
        };
      default:
        return {
          bg: 'bg-slate-50',
          border: 'border-slate-200',
          text: 'text-slate-500',
          icon: null
        };
    }
  };

  const styles = getStatusStyles();

  return (
    <div className={`
      p-5 rounded-xl border transition-all duration-300
      hover:scale-[1.02] hover:shadow-md
      ${styles.bg} ${styles.border}
    `}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {icon}
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {label}
          </label>
        </div>
        {confidence && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${styles.bg} ${styles.text}`}>
            {confidence}% Match
          </span>
        )}
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-slate-500 mb-1">Existing Record</p>
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            {existingValue}
          </p>
        </div>
        <div>
          <p className="text-sm text-slate-500 mb-1">New Submission</p>
          <p className="text-base font-semibold text-slate-900 dark:text-white">
            {newValue}
          </p>
          {status !== 'match' && (
            <div className={`flex items-center gap-1 mt-1 text-xs ${styles.text}`}>
              {styles.icon}
              <span>
                {status === 'conflict' ? 'Conflicting data' : 'Partial match'}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============== Resolution Option Component ==============

interface ResolutionOptionProps {
  icon: React.ElementType;
  title: string;
  description: string;
  color: 'primary' | 'red' | 'slate';
  isSelected?: boolean;
  onClick: () => void;
}

const ResolutionOption: React.FC<ResolutionOptionProps> = ({
  icon: Icon,
  title,
  description,
  color,
  isSelected,
  onClick
}) => {
  const getColorStyles = () => {
    switch(color) {
      case 'primary':
        return {
          default: 'border-slate-200 hover:border-[#2E8B57] hover:bg-[#2E8B57]/5',
          selected: 'border-[#2E8B57] bg-[#2E8B57] text-white hover:bg-[#2E8B57]',
          icon: 'text-slate-400 group-hover:text-[#2E8B57]',
          selectedIcon: 'text-white'
        };
      case 'red':
        return {
          default: 'border-slate-200 hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/10',
          selected: 'border-red-500 bg-red-500 text-white hover:bg-red-600',
          icon: 'text-red-300 group-hover:text-red-500',
          selectedIcon: 'text-white'
        };
      case 'slate':
        return {
          default: 'border-slate-200 hover:border-slate-400 hover:bg-slate-50',
          selected: 'border-slate-500 bg-slate-500 text-white hover:bg-slate-600',
          icon: 'text-slate-400 group-hover:text-slate-500',
          selectedIcon: 'text-white'
        };
      default:
        return {
          default: '',
          selected: '',
          icon: '',
          selectedIcon: ''
        };
    }
  };

  const styles = getColorStyles();

  return (
    <button
      onClick={onClick}
      className={`
        group flex flex-col items-center justify-center gap-3 p-6 rounded-xl 
        border-2 transition-all duration-300
        hover:scale-105 active:scale-95
        ${isSelected ? styles.selected : styles.default}
      `}
    >
      <Icon className={`
        text-3xl transition-all duration-300
        ${isSelected ? styles.selectedIcon : styles.icon}
        group-hover:scale-110
      `} />
      <div className="text-center">
        <p className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
          {title}
        </p>
        <p className={`text-xs mt-1 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
          {description}
        </p>
      </div>
    </button>
  );
};

// ============== Main DuplicationConflicts Component ==============

interface DuplicationConflictsProps {
  onNavigate?: (page: string) => void;
}

const DuplicationConflicts: React.FC<DuplicationConflictsProps> = ({ onNavigate }) => {
  const [selectedResolution, setSelectedResolution] = useState<string | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Sample conflict data
  const existingRecord = {
    id: '#REG-8829-01',
    name: 'Jonathan Doe',
    age: 8,
    dateOfBirth: '2015-05-12',
    location: 'Sector 4, Zone B, Kampala',
    guardian: 'Mary Doe (Mother)',
    phone: '+256 701 234 567',
    image: 'https://i.pravatar.cc/300?img=1',
    status: 'source' as const
  };

  const newSubmission = {
    id: '#NEW-SUB-9902',
    name: 'John Doe',
    age: 8,
    dateOfBirth: '2015-05-12',
    location: 'Sector 4, Zone B, Kampala',
    guardian: 'M. Doe (Mother)',
    phone: '',
    image: 'https://i.pravatar.cc/300?img=2',
    status: 'pending' as const
  };

  const matches: ConflictMatch[] = [
    {
      field: 'Full Name',
      existingValue: 'Jonathan Doe',
      newValue: 'John Doe',
      confidence: 88,
      status: 'partial'
    },
    {
      field: 'Age / Date of Birth',
      existingValue: '8 years (2015-05-12)',
      newValue: '8 years (2015-05-12)',
      confidence: 100,
      status: 'match'
    },
    {
      field: 'Location',
      existingValue: 'Sector 4, Zone B, Kampala',
      newValue: 'Sector 4, Zone B, Kampala',
      confidence: 100,
      status: 'match'
    },
    {
      field: 'Guardian / Caregiver',
      existingValue: 'Mary Doe (Mother) • +256 701 234 567',
      newValue: 'M. Doe (Mother) • No phone provided',
      confidence: 65,
      status: 'conflict'
    }
  ];

  const handleResolve = () => {
    if (!selectedResolution) return;
    setShowConfirmModal(true);
  };

  const confirmResolution = () => {
    alert(`Resolution: ${selectedResolution}\nNote: ${resolutionNote || 'No note provided'}`);
    setShowConfirmModal(false);
    setSelectedResolution(null);
    setResolutionNote('');
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FA] dark:bg-slate-900">
      <div className="p-4 lg:p-8 max-w-[1400px] mx-auto w-full">
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col gap-2 mb-6">
          <div className="flex items-center gap-2 text-sm font-medium">
            <button 
              onClick={() => onNavigate?.('duplicates')}
              className="text-[#2E8B57] hover:underline flex items-center gap-1"
            >
              <ArrowBackIcon className="text-sm" />
              Alerts
            </button>
            <ChevronRightIcon className="text-xs text-slate-400" />
            <span className="text-slate-600 dark:text-slate-400">
              Conflict UC-09
            </span>
          </div>
          
          <div className="flex flex-wrap justify-between items-end gap-4 mt-2">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-black bg-gradient-to-r from-[#2E8B57] 
                           to-[#3CB371] bg-clip-text text-transparent">
                Conflict Resolution: UC-09
              </h1>
              
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full 
                               text-xs font-bold bg-[#2E8B57]/10 text-[#2E8B57] 
                               border border-[#2E8B57]/30 animate-pulse">
                  <VerifiedIcon className="text-sm mr-1" />
                  94% Match Confidence
                </span>
                <p className="text-slate-500 text-sm font-normal italic">
                  Detected on Oct 24, 2023
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2.5 
                               bg-white dark:bg-slate-900 
                               border border-slate-200 dark:border-slate-800 
                               rounded-xl text-sm font-bold 
                               hover:bg-slate-50 dark:hover:bg-slate-800 
                               transition-all hover:scale-105 active:scale-95">
                <HistoryIcon className="text-sm" />
                View Audit Log
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2.5 
                               bg-white dark:bg-slate-900 
                               border border-slate-200 dark:border-slate-800 
                               rounded-xl text-sm font-bold 
                               hover:bg-slate-50 dark:hover:bg-slate-800 
                               transition-all hover:scale-105 active:scale-95">
                <FlagIcon className="text-sm" />
                Flag for Review
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Left Column: Source of Truth */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 
                        border-2 border-[#2E8B57]/30 rounded-2xl 
                        overflow-hidden shadow-lg hover:shadow-2xl 
                        transition-all duration-500">
            <div className="bg-gradient-to-r from-[#2E8B57]/10 to-[#3CB371]/10 
                          px-6 py-4 border-b border-[#2E8B57]/20 
                          flex justify-between items-center">
              <span className="text-[#2E8B57] font-bold text-xs uppercase tracking-widest">
                Existing Record
              </span>
              <span className="bg-gradient-to-r from-[#2E8B57] to-[#3CB371] 
                             text-white text-[10px] px-3 py-1 
                             rounded-full font-bold shadow-lg">
                SOURCE OF TRUTH
              </span>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="size-32 rounded-full border-4 border-[#2E8B57]/20 
                                overflow-hidden mb-4 bg-slate-100 shadow-xl
                                transition-transform duration-500 group-hover:scale-105">
                    <img 
                      src={existingRecord.image} 
                      alt="Existing child"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-2 right-1/2 translate-x-12 
                                bg-[#2E8B57] text-white text-xs px-2 py-1 
                                rounded-full font-bold shadow-lg">
                    Source
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {existingRecord.name}
                </h3>
                <p className="text-slate-500 text-sm">{existingRecord.id}</p>
              </div>
              
              <div className="space-y-4">
                <ComparisonField
                  label="Full Name"
                  existingValue={existingRecord.name}
                  newValue={newSubmission.name}
                  confidence={88}
                  status="partial"
                  icon={<InfoIcon className="text-amber-500" />}
                />
                
                <ComparisonField
                  label="Age / Date of Birth"
                  existingValue={`${existingRecord.age} years (${existingRecord.dateOfBirth})`}
                  newValue={`${newSubmission.age} years (${newSubmission.dateOfBirth})`}
                  confidence={100}
                  status="match"
                  icon={<CalendarIcon className="text-[#2E8B57]" />}
                />
                
                <ComparisonField
                  label="Location"
                  existingValue={existingRecord.location}
                  newValue={newSubmission.location}
                  confidence={100}
                  status="match"
                  icon={<LocationIcon className="text-[#2E8B57]" />}
                />
                
                <ComparisonField
                  label="Guardian / Caregiver"
                  existingValue={`${existingRecord.guardian} • ${existingRecord.phone}`}
                  newValue={`${newSubmission.guardian} • No phone provided`}
                  confidence={65}
                  status="conflict"
                  icon={<PhoneIcon className="text-red-500" />}
                />
              </div>
            </div>
          </div>

          {/* Right Column: New Submission */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 
                        border-2 border-slate-200 dark:border-slate-800 
                        rounded-2xl overflow-hidden shadow-lg 
                        hover:shadow-2xl transition-all duration-500">
            <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 
                          border-b border-slate-200 dark:border-slate-800 
                          flex justify-between items-center">
              <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">
                New Submission
              </span>
              <span className="bg-amber-100 text-amber-700 text-[10px] 
                             px-3 py-1 rounded-full font-bold">
                PENDING APPROVAL
              </span>
            </div>
            
            <div className="p-8">
              <div className="flex flex-col items-center mb-8">
                <div className="relative group">
                  <div className="size-32 rounded-full border-4 border-slate-200 
                                overflow-hidden mb-4 bg-slate-100 shadow-xl
                                transition-transform duration-500 group-hover:scale-105">
                    <img 
                      src={newSubmission.image} 
                      alt="New submission"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {newSubmission.name}
                </h3>
                <p className="text-slate-500 text-sm">{newSubmission.id}</p>
              </div>
              
              <div className="space-y-4">
                {matches.map((match, index) => (
                  <ComparisonField
                    key={index}
                    label={match.field}
                    existingValue={match.existingValue}
                    newValue={match.newValue}
                    confidence={match.confidence}
                    status={match.status}
                    icon={
                      match.status === 'match' ? <CheckCircleIcon className="text-[#2E8B57]" /> :
                      match.status === 'conflict' ? <ErrorIcon className="text-red-500" /> :
                      <WarningIcon className="text-amber-500" />
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resolution Actions */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 
                      dark:border-slate-800 rounded-2xl p-8 shadow-lg 
                      hover:shadow-2xl transition-all duration-500">
          <div className="flex flex-col gap-6">
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 
                         uppercase tracking-wide flex items-center gap-2">
              <MergeIcon className="text-[#2E8B57]" />
              Resolution Decision
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <ResolutionOption
                icon={PersonAddIcon}
                title="Keep as New (Unique)"
                description="Create separate record for this child"
                color="slate"
                isSelected={selectedResolution === 'unique'}
                onClick={() => setSelectedResolution('unique')}
              />
              
              <ResolutionOption
                icon={MergeIcon}
                title="Merge with Existing"
                description="Update source record with new info"
                color="primary"
                isSelected={selectedResolution === 'merge'}
                onClick={() => setSelectedResolution('merge')}
              />
              
              <ResolutionOption
                icon={DeleteForeverIcon}
                title="Reject as Duplicate"
                description="Discard submission as redundant"
                color="red"
                isSelected={selectedResolution === 'reject'}
                onClick={() => setSelectedResolution('reject')}
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-slate-700 
                              dark:text-slate-300 mb-2">
                Resolution Note (Optional)
              </label>
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                className="w-full rounded-xl border border-slate-200 
                         dark:border-slate-700 focus:ring-[#2E8B57] 
                         focus:border-[#2E8B57] bg-slate-50 dark:bg-slate-800 
                         dark:text-white resize-none"
                placeholder="Provide context for your decision..."
                rows={2}
              />
            </div>

            {selectedResolution && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleResolve}
                  className="px-8 py-3 bg-gradient-to-r from-[#2E8B57] 
                           to-[#3CB371] text-white rounded-xl font-bold 
                           shadow-lg shadow-[#2E8B57]/20 hover:shadow-xl 
                           hover:scale-105 active:scale-95 
                           transition-all duration-300
                           relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] 
                                group-hover:translate-x-[100%] transition-transform 
                                duration-700" />
                  Confirm Resolution
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Confirm Resolution Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowConfirmModal(false)}
            />
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl 
                          max-w-md w-full p-6 animate-slideIn shadow-2xl">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 
                         dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                <CloseIcon className="text-slate-500" />
              </button>
              
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 
                              bg-gradient-to-br from-[#2E8B57] to-[#3CB371] 
                              rounded-2xl flex items-center justify-center">
                  <MergeIcon className="text-white text-3xl" />
                </div>
                <h3 className="text-2xl font-bold">Confirm Resolution</h3>
                <p className="text-slate-500 mt-1">
                  Are you sure you want to proceed with this resolution?
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl mb-6">
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Selected Action: <span className="text-[#2E8B57] font-bold">
                    {selectedResolution === 'unique' && 'Keep as New (Unique)'}
                    {selectedResolution === 'merge' && 'Merge with Existing'}
                    {selectedResolution === 'reject' && 'Reject as Duplicate'}
                  </span>
                </p>
                {resolutionNote && (
                  <p className="text-xs text-slate-500 mt-2">
                    Note: {resolutionNote}
                  </p>
                )}
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 
                           dark:border-slate-700 rounded-xl
                           hover:bg-slate-50 dark:hover:bg-slate-800 
                           transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmResolution}
                  className="flex-1 bg-gradient-to-r from-[#2E8B57] 
                           to-[#3CB371] text-white px-4 py-3 rounded-xl 
                           font-semibold hover:shadow-lg 
                           transition-all duration-300"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 
                         text-center">
          <p className="text-xs text-slate-400">
            © 2023 Duplication Conflict Resolver System • Version 4.2.0 • Data Security Compliant
          </p>
        </footer>
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
      `}</style>
    </div>
  );
};

export default DuplicationConflicts;