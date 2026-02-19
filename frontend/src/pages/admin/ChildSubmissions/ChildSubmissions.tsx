import React, { useState } from 'react';
import {
  ChildCare as ChildCareIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Download as DownloadIcon,
  History as HistoryIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  Translate as TranslateIcon,
  Check as CheckIcon,
  Edit as EditIcon,
  Block as BlockIcon,
  Reply as ReplyIcon,
  Publish as PublishIcon,
  FactCheck as FactCheckIcon,
  Info as InfoIcon,
  VerifiedUser as VerifiedUserIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  ChevronRight as ChevronRightIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon
} from '@mui/icons-material';

// ============== Types and Interfaces ==============

interface ChildRegistration {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  location: string;
  language: string;
  image: string;
  status: 'pending' | 'approved' | 'rejected' | 'correction';
  submittedBy: string;
  submittedDate: string;
  organization: string;
  birthInfo: {
    fullName: string;
    placeOfBirth: string;
    dateOfBirth: string;
    caregiver: string;
  };
  backgroundStory: string;
  auditLog: AuditEntry[];
}

interface AuditEntry {
  id: number;
  action: string;
  description: string;
  timestamp: string;
  user: string;
  role: string;
  type: 'submission' | 'edit' | 'review' | 'approval' | 'rejection';
}

interface ChecklistItem {
  id: number;
  label: string;
  description: string;
  verified: boolean;
}

// ============== Audit Timeline Component ==============

interface AuditTimelineProps {
  entries: AuditEntry[];
}

const AuditTimeline: React.FC<AuditTimelineProps> = ({ entries }) => {
  const getIcon = (type: string) => {
    switch(type) {
      case 'submission': return <PublishIcon className="text-sm" />;
      case 'edit': return <EditIcon className="text-sm" />;
      case 'review': return <FactCheckIcon className="text-sm" />;
      case 'approval': return <CheckIcon className="text-sm" />;
      case 'rejection': return <BlockIcon className="text-sm" />;
      default: return <HistoryIcon className="text-sm" />;
    }
  };

  const getIconBg = (type: string) => {
    switch(type) {
      case 'submission': return 'bg-[#2E8B57]';
      case 'edit': return 'bg-amber-500';
      case 'review': return 'bg-blue-500';
      case 'approval': return 'bg-green-500';
      case 'rejection': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="space-y-4">
      {entries.map((entry, index) => (
        <div key={entry.id} className="flex gap-4 items-start relative group">
          {index < entries.length - 1 && (
            <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gradient-to-b 
                          from-[#2E8B57]/20 to-transparent" />
          )}
          
          <div className={`
            size-6 rounded-xl flex items-center justify-center z-10
            transition-all duration-300 group-hover:scale-110
            ${getIconBg(entry.type)} text-white
          `}>
            {getIcon(entry.type)}
          </div>
          
          <div className="flex-1 pb-4">
            <div className="flex flex-wrap justify-between items-start gap-2">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {entry.action}
              </p>
              <span className="text-xs text-[#2E8B57] font-medium">
                {entry.timestamp}
              </span>
            </div>
            
            <p className="text-xs text-slate-500 mt-1">
              By <span className="font-bold text-slate-700 dark:text-slate-300">
                {entry.user}
              </span> ({entry.role})
            </p>
            
            {entry.description && (
              <div className="mt-2 text-xs bg-slate-50 dark:bg-slate-800/50 
                            p-3 rounded-lg text-slate-600 dark:text-slate-400
                            border border-slate-100 dark:border-slate-700">
                "{entry.description}"
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// ============== Checklist Item Component ==============

interface ChecklistItemProps {
  item: ChecklistItem;
  onToggle: (id: number) => void;
}

const ChecklistItemComponent: React.FC<ChecklistItemProps> = ({ item, onToggle }) => {
  return (
    <label className={`
      flex items-start gap-3 p-4 rounded-xl border transition-all duration-300
      cursor-pointer group hover:scale-[1.02] hover:shadow-md
      ${item.verified 
        ? 'border-[#2E8B57] bg-[#2E8B57]/5' 
        : 'border-slate-200 dark:border-slate-700 hover:border-[#2E8B57]/30'
      }
    `}>
      <input
        type="checkbox"
        checked={item.verified}
        onChange={() => onToggle(item.id)}
        className="mt-1 rounded border-slate-300 text-[#2E8B57] 
                 focus:ring-[#2E8B57] focus:ring-offset-0
                 transition-all duration-300"
      />
      <div>
        <p className="text-sm font-bold text-slate-900 dark:text-white 
                     group-hover:text-[#2E8B57] transition-colors">
          {item.label}
        </p>
        <p className="text-xs text-slate-500 mt-1">{item.description}</p>
      </div>
    </label>
  );
};

// ============== Main ChildSubmissions Component ==============

interface ChildSubmissionsProps {
  onNavigate?: (page: string) => void;
}

const ChildSubmissions: React.FC<ChildSubmissionsProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'bio' | 'story' | 'documents'>('bio');
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 1,
      label: 'Identity Verified',
      description: 'Photo matches physical description and birth record.',
      verified: false
    },
    {
      id: 2,
      label: 'Location Accuracy',
      description: 'Geo-tag matches Kampala Central District office range.',
      verified: false
    },
    {
      id: 3,
      label: 'Documentation Complete',
      description: 'Birth certificate or LC1 letter is clearly legible.',
      verified: false
    },
    {
      id: 4,
      label: 'Consent Form Signed',
      description: 'Guardian signature and thumbprint are present.',
      verified: false
    }
  ]);
  const [reviewerComments, setReviewerComments] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);

  // Sample child registration data
  const registration: ChildRegistration = {
    id: 'UG-2024-0081',
    name: 'Samuel Okecho',
    age: 8,
    gender: 'Male',
    location: 'Kampala Central',
    language: 'Luganda, English',
    image: 'https://i.pravatar.cc/300?img=1',
    status: 'pending',
    submittedBy: 'David Okello',
    submittedDate: 'Oct 24, 2023 · 10:15 AM',
    organization: 'Compassion Intl.',
    birthInfo: {
      fullName: 'Samuel Peter Okecho',
      placeOfBirth: 'Mulago Hospital, Kampala',
      dateOfBirth: 'March 12, 2016',
      caregiver: 'Sarah Namazzi (Aunt)'
    },
    backgroundStory: `Samuel was referred to our partner NGO after his primary caregiver became unable to provide adequate medical support. He is currently living in a temporary foster arrangement in the Kampala Central District. Samuel is a bright child who shows a keen interest in drawings and rhythmic music. He has missed two years of formal schooling due to displacement and lack of documentation.`,
    auditLog: [
      {
        id: 1,
        action: 'Record Submitted',
        description: 'Bio-data verified with local LC1 authorities. All medical records attached.',
        timestamp: '2 hours ago',
        user: 'David Okello',
        role: 'Senior Field Officer, Compassion Intl.',
        type: 'submission'
      },
      {
        id: 2,
        action: 'Draft Created',
        description: '',
        timestamp: 'Oct 24, 2023 · 10:15 AM',
        user: 'System Auto-save',
        role: 'System',
        type: 'edit'
      }
    ]
  };

  const handleChecklistToggle = (id: number) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id ? { ...item, verified: !item.verified } : item
      )
    );
  };

  const handleApprove = () => {
    alert('Child registration approved successfully!');
  };

  const handleCorrection = (reason: string) => {
    alert(`Correction requested: ${reason}`);
    setShowCorrectionModal(false);
  };

  const handleReject = (reason: string) => {
    alert(`Registration rejected: ${reason}`);
    setShowRejectModal(false);
  };

  const allChecklistVerified = checklist.every(item => item.verified);

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FA] dark:bg-slate-900">
      <div className="p-4 lg:p-8 max-w-[1440px] mx-auto w-full">
        {/* Breadcrumbs & Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <button 
              onClick={() => onNavigate?.('submissions')}
              className="text-[#2E8B57] hover:underline flex items-center gap-1"
            >
              <ArrowBackIcon className="text-sm" />
              Registrations
            </button>
            <ChevronRightIcon className="text-xs text-slate-400" />
            <span className="text-slate-600 dark:text-slate-400">
              Review Child: {registration.id}
            </span>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-[#2E8B57] 
                           to-[#3CB371] bg-clip-text text-transparent mb-2">
                Review Child Registration
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-amber-100 text-amber-700 px-3 py-1 
                               rounded-full text-xs font-bold uppercase 
                               tracking-wider border border-amber-200
                               animate-pulse flex items-center gap-1">
                  <WarningIcon className="text-sm" />
                  Pending Approval
                </span>
                <p className="text-[#2E8B57] text-sm font-medium">
                  Flow: UC-08 Approval for New Entry
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 h-10 
                               rounded-xl bg-white dark:bg-slate-900 
                               border border-slate-200 dark:border-slate-800 
                               text-slate-700 dark:text-slate-300 
                               text-sm font-bold hover:bg-slate-50 
                               dark:hover:bg-slate-800 transition-all 
                               hover:scale-105 active:scale-95">
                <HistoryIcon className="text-sm" />
                View Audit Log
              </button>
              
              <button className="flex items-center gap-2 px-4 h-10 
                               rounded-xl bg-white dark:bg-slate-900 
                               border border-slate-200 dark:border-slate-800 
                               text-slate-700 dark:text-slate-300 
                               text-sm font-bold hover:bg-slate-50 
                               dark:hover:bg-slate-800 transition-all 
                               hover:scale-105 active:scale-95">
                <DownloadIcon className="text-sm" />
                Download Dossier
              </button>
            </div>
          </div>
        </div>

        {/* Main Split Screen Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Side: Child Information */}
          <div className="lg:col-span-7 space-y-6">
            {/* Bio-Data Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl 
                          border border-slate-200 dark:border-slate-800 
                          overflow-hidden shadow-lg hover:shadow-2xl 
                          transition-all duration-500">
              {/* Header with Image */}
              <div className="p-6 border-b border-slate-200 dark:border-slate-800 
                            flex flex-col sm:flex-row gap-6 items-center
                            bg-gradient-to-r from-white to-slate-50 
                            dark:from-slate-900 dark:to-slate-800/50">
                <div className="relative group">
                  <div className="size-32 rounded-2xl bg-cover bg-center 
                                border-4 border-white dark:border-slate-800 
                                shadow-xl flex-shrink-0
                                transition-transform duration-500 
                                group-hover:scale-105 group-hover:rotate-2"
                       style={{ backgroundImage: `url(${registration.image})` }} />
                  <div className="absolute inset-0 rounded-2xl 
                                bg-gradient-to-t from-black/50 to-transparent 
                                opacity-0 group-hover:opacity-100 
                                transition-opacity duration-300" />
                </div>
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white
                               group-hover:text-[#2E8B57] transition-colors">
                    {registration.name}
                  </h3>
                  <p className="text-[#2E8B57] font-semibold mb-3">
                    ID: #{registration.id}
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-slate-600 
                                  dark:text-slate-400">
                      <CalendarIcon className="text-[#2E8B57] text-sm" />
                      Age: {registration.age} Years
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 
                                  dark:text-slate-400">
                      <PersonIcon className="text-[#2E8B57] text-sm" />
                      Gender: {registration.gender}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 
                                  dark:text-slate-400">
                      <LocationIcon className="text-[#2E8B57] text-sm" />
                      {registration.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 
                                  dark:text-slate-400">
                      <TranslateIcon className="text-[#2E8B57] text-sm" />
                      {registration.language}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="px-6 pt-4 border-b border-slate-200 dark:border-slate-800
                            flex gap-6 overflow-x-auto">
                {['bio', 'story', 'documents'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`
                      pb-3 text-sm font-bold capitalize whitespace-nowrap
                      transition-all duration-300 relative
                      ${activeTab === tab
                        ? 'text-[#2E8B57] border-b-2 border-[#2E8B57]'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                      }
                    `}
                  >
                    {tab === 'bio' ? 'Bio-Data' : 
                     tab === 'story' ? 'Background Story' : 'Documents'}
                    {activeTab === tab && (
                      <span className="absolute -bottom-0 left-0 w-full h-0.5 
                                     bg-gradient-to-r from-[#2E8B57] to-[#3CB371]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === 'bio' && (
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-widest 
                                   text-[#2E8B57] mb-4">
                        Personal Details
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-slate-50 dark:bg-slate-800/50 
                                      p-4 rounded-xl">
                          <span className="text-xs text-slate-500 font-medium">
                            Full Name at Birth
                          </span>
                          <p className="text-sm font-semibold text-slate-900 
                                      dark:text-white mt-1">
                            {registration.birthInfo.fullName}
                          </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 
                                      p-4 rounded-xl">
                          <span className="text-xs text-slate-500 font-medium">
                            Place of Birth
                          </span>
                          <p className="text-sm font-semibold text-slate-900 
                                      dark:text-white mt-1">
                            {registration.birthInfo.placeOfBirth}
                          </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 
                                      p-4 rounded-xl">
                          <span className="text-xs text-slate-500 font-medium">
                            Date of Birth
                          </span>
                          <p className="text-sm font-semibold text-slate-900 
                                      dark:text-white mt-1">
                            {registration.birthInfo.dateOfBirth}
                          </p>
                        </div>
                        <div className="bg-slate-50 dark:bg-slate-800/50 
                                      p-4 rounded-xl">
                          <span className="text-xs text-slate-500 font-medium">
                            Primary Caregiver
                          </span>
                          <p className="text-sm font-semibold text-slate-900 
                                      dark:text-white mt-1">
                            {registration.birthInfo.caregiver}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'story' && (
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-6 
                                rounded-xl border border-slate-200 
                                dark:border-slate-700">
                    <h4 className="text-xs font-black uppercase tracking-widest 
                                 text-[#2E8B57] mb-3">
                      Background Story
                    </h4>
                    <p className="text-sm leading-relaxed text-slate-700 
                                dark:text-slate-300 italic">
                      "{registration.backgroundStory}"
                    </p>
                  </div>
                )}

                {activeTab === 'documents' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 
                                  rounded-xl border border-slate-200 
                                  dark:border-slate-700
                                  hover:scale-105 transition-all duration-300
                                  cursor-pointer group">
                      <div className="flex items-center gap-3 mb-2">
                        <DescriptionIcon className="text-[#2E8B57]" />
                        <span className="text-sm font-semibold">Birth Certificate</span>
                      </div>
                      <p className="text-xs text-slate-500">PDF • 2.4 MB</p>
                      <div className="mt-3 h-20 bg-slate-200 dark:bg-slate-700 
                                    rounded-lg flex items-center justify-center
                                    group-hover:bg-[#2E8B57]/10 transition-colors">
                        <span className="text-xs text-slate-400">Preview</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 
                                  rounded-xl border border-slate-200 
                                  dark:border-slate-700
                                  hover:scale-105 transition-all duration-300
                                  cursor-pointer group">
                      <div className="flex items-center gap-3 mb-2">
                        <ImageIcon className="text-[#2E8B57]" />
                        <span className="text-sm font-semibold">Child Photo</span>
                      </div>
                      <p className="text-xs text-slate-500">JPG • 1.1 MB</p>
                      <div className="mt-3 h-20 bg-slate-200 dark:bg-slate-700 
                                    rounded-lg flex items-center justify-center
                                    group-hover:bg-[#2E8B57]/10 transition-colors">
                        <span className="text-xs text-slate-400">Preview</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Audit Log Section */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl 
                          border border-slate-200 dark:border-slate-800 
                          p-6 shadow-lg hover:shadow-2xl transition-all duration-500">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white 
                           mb-4 flex items-center gap-2">
                <HistoryIcon className="text-[#2E8B57]" />
                Registration Audit Log
              </h4>
              <AuditTimeline entries={registration.auditLog} />
            </div>
          </div>

          {/* Right Side: Approval Actions */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            {/* Review Checklist Card */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl 
                          border-2 border-[#2E8B57]/20 shadow-xl 
                          hover:shadow-2xl transition-all duration-500
                          overflow-hidden">
              <div className="bg-gradient-to-r from-[#2E8B57]/10 to-[#3CB371]/10 
                            p-5 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white 
                             flex items-center gap-2">
                  <FactCheckIcon className="text-[#2E8B57]" />
                  Review Checklist
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Please verify all fields before taking action.
                </p>
              </div>
              
              <div className="p-6 space-y-3">
                {checklist.map(item => (
                  <ChecklistItemComponent
                    key={item.id}
                    item={item}
                    onToggle={handleChecklistToggle}
                  />
                ))}
                
                <div className="mt-6">
                  <label className="block text-sm font-bold text-slate-900 
                                  dark:text-white mb-2">
                    Reviewer Comments
                  </label>
                  <textarea
                    value={reviewerComments}
                    onChange={(e) => setReviewerComments(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 
                             dark:border-slate-700 focus:border-[#2E8B57] 
                             focus:ring-[#2E8B57] text-sm min-h-[100px] 
                             placeholder:text-slate-400 resize-none
                             bg-slate-50 dark:bg-slate-800"
                    placeholder="Add notes for the field officer or final approval record..."
                  />
                </div>
              </div>
              
              <div className="p-6 bg-slate-50 dark:bg-slate-800/50 
                            border-t border-slate-200 dark:border-slate-800
                            flex flex-col gap-3">
                <button
                  onClick={handleApprove}
                  disabled={!allChecklistVerified}
                  className={`
                    w-full py-3 rounded-xl flex items-center justify-center 
                    gap-2 font-bold transition-all duration-300
                    relative overflow-hidden group
                    ${allChecklistVerified
                      ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white shadow-lg shadow-[#2E8B57]/20 hover:shadow-xl hover:scale-105'
                      : 'bg-slate-300 dark:bg-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="absolute inset-0 bg-white/20 translate-x-[-100%] 
                                group-hover:translate-x-[100%] transition-transform 
                                duration-700" />
                  <PublishIcon className="text-sm" />
                  Approve and Post
                </button>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowCorrectionModal(true)}
                    className="bg-amber-500 hover:bg-amber-600 
                             text-white font-bold py-3 rounded-xl 
                             flex items-center justify-center gap-2 
                             transition-all hover:scale-105 
                             active:scale-95 shadow-lg shadow-amber-500/20"
                  >
                    <ReplyIcon className="text-sm" />
                    Correction
                  </button>
                  
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="bg-red-500 hover:bg-red-600 
                             text-white font-bold py-3 rounded-xl 
                             flex items-center justify-center gap-2 
                             transition-all hover:scale-105 
                             active:scale-95 shadow-lg shadow-red-500/20"
                  >
                    <BlockIcon className="text-sm" />
                    Reject
                  </button>
                </div>
              </div>
            </div>

            {/* Policy Note Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 
                          text-white p-6 rounded-2xl shadow-2xl
                          hover:scale-[1.02] transition-all duration-500">
              <div className="flex items-center gap-3 mb-3">
                <div className="size-10 rounded-xl bg-white/10 
                              flex items-center justify-center
                              group-hover:scale-110 transition-transform">
                  <InfoIcon className="text-[#2E8B57]" />
                </div>
                <div>
                  <p className="text-sm font-bold">Policy Note</p>
                  <p className="text-[10px] text-white/60 uppercase tracking-widest">
                    Regulatory Compliance
                  </p>
                </div>
              </div>
              
              <p className="text-xs text-white/80 leading-relaxed">
                Under policy <span className="text-[#2E8B57] font-bold">
                  DIR-2024-C
                </span>, all registrations from urban centers must be reviewed 
                within 48 hours of submission. Please ensure medical privacy 
                standards are maintained in your comments.
              </p>
            </div>
          </div>
        </div>

        {/* Reject Modal */}
        {showRejectModal && (
          <RejectModal
            onClose={() => setShowRejectModal(false)}
            onSubmit={handleReject}
          />
        )}

        {/* Correction Modal */}
        {showCorrectionModal && (
          <CorrectionModal
            onClose={() => setShowCorrectionModal(false)}
            onSubmit={handleCorrection}
          />
        )}
      </div>
    </div>
  );
};

// ============== Reject Modal Component ==============

interface RejectModalProps {
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const RejectModal: React.FC<RejectModalProps> = ({ onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl 
                    max-w-md w-full p-6 animate-slideIn shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 
                   dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <CloseIcon className="text-slate-500" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-red-100 dark:bg-red-900/30 
                        rounded-2xl flex items-center justify-center">
            <BlockIcon className="text-red-500 text-3xl" />
          </div>
          <h3 className="text-2xl font-bold">Reject Registration</h3>
          <p className="text-slate-500 mt-1">
            Please provide a reason for rejection
          </p>
        </div>
        
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explain why this registration is being rejected..."
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 
                   rounded-xl border border-slate-200 dark:border-slate-700
                   focus:outline-none focus:ring-2 focus:ring-red-500/20
                   min-h-[120px] resize-none"
        />
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 
                     dark:border-slate-700 rounded-xl
                     hover:bg-slate-50 dark:hover:bg-slate-800 
                     transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(reason)}
            disabled={!reason.trim()}
            className="flex-1 bg-red-500 text-white px-4 py-3 
                     rounded-xl font-semibold hover:bg-red-600 
                     transition-all disabled:opacity-50 
                     disabled:cursor-not-allowed"
          >
            Confirm Reject
          </button>
        </div>
      </div>
    </div>
  );
};

// ============== Correction Modal Component ==============

interface CorrectionModalProps {
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

const CorrectionModal: React.FC<CorrectionModalProps> = ({ onClose, onSubmit }) => {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl 
                    max-w-md w-full p-6 animate-slideIn shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 
                   dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <CloseIcon className="text-slate-500" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 dark:bg-amber-900/30 
                        rounded-2xl flex items-center justify-center">
            <ReplyIcon className="text-amber-500 text-3xl" />
          </div>
          <h3 className="text-2xl font-bold">Request Correction</h3>
          <p className="text-slate-500 mt-1">
            Specify what needs to be corrected
          </p>
        </div>
        
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Describe the changes needed..."
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 
                   rounded-xl border border-slate-200 dark:border-slate-700
                   focus:outline-none focus:ring-2 focus:ring-amber-500/20
                   min-h-[120px] resize-none"
        />
        
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 
                     dark:border-slate-700 rounded-xl
                     hover:bg-slate-50 dark:hover:bg-slate-800 
                     transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(reason)}
            disabled={!reason.trim()}
            className="flex-1 bg-amber-500 text-white px-4 py-3 
                     rounded-xl font-semibold hover:bg-amber-600 
                     transition-all disabled:opacity-50 
                     disabled:cursor-not-allowed"
          >
            Request Correction
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChildSubmissions;