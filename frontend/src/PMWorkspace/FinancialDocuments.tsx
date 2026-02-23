// ============== FinancialDocuments.tsx ==============
import React, { useState } from 'react';
import {
  AccountBalance as AccountBalanceIcon,
  Search as SearchIcon,
  PictureAsPdf as PdfIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  RotateRight as RotateRightIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  EditNote as EditNoteIcon,
  History as HistoryIcon,
  Upload as UploadIcon,
  Visibility as VisibilityIcon,
  Lock as LockIcon,
  CalendarToday as CalendarIcon,
  VerifiedUser as VerifiedUserIcon,
  Help as HelpIcon,
  Notifications as NotificationsIcon,
  ChevronRight as ChevronRightIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// ============== Types and Interfaces ==============

interface SponsorDocument {
  id: number;
  sponsorName: string;
  documentName: string;
  status: 'under-review' | 'revised' | 'verified' | 'pending';
  date: string;
  time: string;
  uploadedBy: string;
}

interface AuditEvent {
  id: number;
  action: string;
  user: string;
  time: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

// ============== Sponsor List Item Component ==============

interface SponsorListItemProps {
  sponsor: SponsorDocument;
  isActive: boolean;
  onClick: () => void;
}

const SponsorListItem: React.FC<SponsorListItemProps> = ({ sponsor, isActive, onClick }) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'under-review':
        return { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', label: 'Under Review' };
      case 'revised':
        return { bg: 'bg-amber-100 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', label: 'Revised' };
      case 'verified':
        return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400', label: 'Verified' };
      case 'pending':
        return { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', label: 'Pending' };
      default:
        return { bg: 'bg-slate-100', text: 'text-slate-600', label: status };
    }
  };

  const statusBadge = getStatusBadge(sponsor.status);

  return (
    <div 
      onClick={onClick}
      className={`
        p-4 border-b border-slate-100 dark:border-slate-800 
        hover:bg-slate-50 dark:hover:bg-slate-800/50 
        transition-all duration-300 cursor-pointer
        ${isActive ? 'bg-[#2E8B57]/5 dark:bg-[#2E8B57]/10 border-l-4 border-l-[#2E8B57]' : ''}
      `}
    >
      <div className="flex justify-between items-start mb-1">
        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
          {sponsor.sponsorName}
        </h3>
        <span className={`
          text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-tighter
          ${statusBadge.bg} ${statusBadge.text}
        `}>
          {statusBadge.label}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-2">{sponsor.documentName}</p>
      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
        <CalendarIcon className="text-xs" />
        {sponsor.date} {sponsor.time}
      </div>
    </div>
  );
};

// ============== Main FinancialDocuments Component ==============

const FinancialDocuments: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSponsor, setSelectedSponsor] = useState<number>(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [highPriority, setHighPriority] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');

  // Sample sponsor documents data
  const sponsorDocuments: SponsorDocument[] = [
    {
      id: 1,
      sponsorName: 'Alpha Corp',
      documentName: 'Q3 Bank Statement.pdf',
      status: 'under-review',
      date: 'Oct 24, 2023',
      time: '10:45 AM',
      uploadedBy: 'Jane Doe (CFO)'
    },
    {
      id: 2,
      sponsorName: 'Lumina Ventures',
      documentName: 'Proof_of_Funds.jpg',
      status: 'revised',
      date: 'Oct 23, 2023',
      time: '04:12 PM',
      uploadedBy: 'John Smith'
    },
    {
      id: 3,
      sponsorName: 'Horizon Tech',
      documentName: 'Account_Balance_Audit.pdf',
      status: 'verified',
      date: 'Oct 20, 2023',
      time: '09:30 AM',
      uploadedBy: 'Sarah Johnson'
    },
    {
      id: 4,
      sponsorName: 'Silverline Assets',
      documentName: 'Finance_Summary_2023.pdf',
      status: 'pending',
      date: 'Oct 19, 2023',
      time: '11:15 AM',
      uploadedBy: 'Mike Wilson'
    }
  ];

  // Filter sponsors based on search
  const filteredSponsors = sponsorDocuments.filter(sponsor =>
    sponsor.sponsorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sponsor.documentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get selected sponsor details
  const selectedSponsorData = sponsorDocuments.find(s => s.id === selectedSponsor) || sponsorDocuments[0];

  // Audit trail data
  const auditEvents: AuditEvent[] = [
    {
      id: 1,
      action: 'Document Uploaded',
      user: 'Jane Doe',
      time: 'Oct 24, 10:45 AM',
      icon: UploadIcon,
      iconBg: 'bg-[#2E8B57]',
      iconColor: 'text-white'
    },
    {
      id: 2,
      action: 'Initial Review Started',
      user: 'Alex Morgan',
      time: 'Oct 24, 11:02 AM',
      icon: VisibilityIcon,
      iconBg: 'bg-slate-200 dark:bg-slate-700',
      iconColor: 'text-slate-500'
    },
    {
      id: 3,
      action: 'Compliance Check Pass',
      user: 'System Bot',
      time: 'Oct 24, 11:15 AM',
      icon: LockIcon,
      iconBg: 'bg-slate-200 dark:bg-slate-700',
      iconColor: 'text-slate-500'
    }
  ];

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 25, 50));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const handleReject = () => alert('Document rejected');
  const handleRequestRevision = () => alert('Revision requested');
  const handleVerify = () => alert('Document verified');

  return (
    <div className="flex h-full overflow-hidden bg-[#F8F9FA] dark:bg-slate-900">
      {/* Sponsor List Pane (Left) */}
      <section className="w-80 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search sponsors..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-slate-800 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredSponsors.map(sponsor => (
            <SponsorListItem
              key={sponsor.id}
              sponsor={sponsor}
              isActive={selectedSponsor === sponsor.id}
              onClick={() => setSelectedSponsor(sponsor.id)}
            />
          ))}
        </div>
      </section>

      {/* Document Viewer (Center) */}
      <section className="flex-1 flex flex-col bg-slate-100 dark:bg-slate-950 overflow-hidden">
        {/* Workspace Header */}
        <div className="bg-white dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[#2E8B57]">
              <PdfIcon className="text-3xl" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Review: {selectedSponsorData.documentName}
              </h1>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span>ID: DOC-{selectedSponsorData.id}-{selectedSponsorData.sponsorName.substring(0, 2).toUpperCase()}</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>Uploaded by: {selectedSponsorData.uploadedBy}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
              <button onClick={handleZoomIn} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 border-r border-slate-200 dark:border-slate-800 transition-all hover:scale-110">
                <ZoomInIcon className="text-sm" />
              </button>
              <button onClick={handleZoomOut} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 border-r border-slate-200 dark:border-slate-800 transition-all hover:scale-110">
                <ZoomOutIcon className="text-sm" />
              </button>
              <button onClick={handleRotate} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-110">
                <RotateRightIcon className="text-sm" />
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all hover:scale-105">
              <DownloadIcon className="text-sm" />
              Download
            </button>
          </div>
        </div>

        {/* Document Viewer Pane */}
        <div className="flex-1 overflow-auto p-8 flex justify-center document-canvas custom-scrollbar">
          <div 
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 shadow-2xl rounded-xl min-h-[1200px] p-8 border border-slate-200 dark:border-slate-800 transition-all duration-300"
            style={{
              transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
              transformOrigin: 'center center'
            }}
          >
            {/* Mock Document Content */}
            <div className="border-b-2 border-slate-900 dark:border-slate-100 pb-8 flex justify-between items-start mb-8">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tighter italic text-[#2E8B57]">Global Bank</h2>
                <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mt-1">Authorized Statement</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 dark:text-white">Statement Period</p>
                <p className="text-sm text-slate-500">Jul 01, 2023 - Sep 30, 2023</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-12 mb-12">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Account Holder</p>
                <p className="text-base font-bold text-slate-900 dark:text-white">{selectedSponsorData.sponsorName} LLC</p>
                <p className="text-sm text-slate-500">451 Business Plaza, Tech District</p>
                <p className="text-sm text-slate-500">San Francisco, CA 94105</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Account Details</p>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Corporate Treasury (Checking)</p>
                <p className="text-sm text-slate-500">**** **** **** 8820</p>
                <p className="text-sm font-bold mt-2 text-slate-900 dark:text-white">
                  Opening Balance: <span className="text-[#2E8B57]">$2,450,910.12</span>
                </p>
              </div>
            </div>

            <div className="mb-12">
              <h3 className="text-xs font-bold uppercase tracking-widest bg-slate-100 dark:bg-slate-800 p-2 mb-4 rounded">Summary of Activity</h3>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800">
                    <th className="text-left py-2 font-semibold text-slate-900 dark:text-white">Date</th>
                    <th className="text-left py-2 font-semibold text-slate-900 dark:text-white">Description</th>
                    <th className="text-right py-2 font-semibold text-slate-900 dark:text-white">Inflow</th>
                    <th className="text-right py-2 font-semibold text-slate-900 dark:text-white">Outflow</th>
                    <th className="text-right py-2 font-semibold text-slate-900 dark:text-white">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 text-slate-500">Aug 12</td>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">Electronic Deposit - CLIENT_PYMT_001</td>
                    <td className="py-3 text-right text-green-600 font-bold">$145,000.00</td>
                    <td className="py-3 text-right">-</td>
                    <td className="py-3 text-right font-medium text-slate-900 dark:text-white">$2,595,910.12</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 text-slate-500">Aug 15</td>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">Payroll Transfer - SEP_2023</td>
                    <td className="py-3 text-right">-</td>
                    <td className="py-3 text-right text-red-600">($850,220.00)</td>
                    <td className="py-3 text-right font-medium text-slate-900 dark:text-white">$1,745,690.12</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 text-slate-500">Sep 01</td>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">Investment Return - ASSET_PROFIT</td>
                    <td className="py-3 text-right text-green-600 font-bold">$312,000.00</td>
                    <td className="py-3 text-right">-</td>
                    <td className="py-3 text-right font-medium text-slate-900 dark:text-white">$2,057,690.12</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="py-3 text-slate-500">Sep 28</td>
                    <td className="py-3 font-medium text-slate-900 dark:text-white">Office Lease Payment</td>
                    <td className="py-3 text-right">-</td>
                    <td className="py-3 text-right text-red-600">($12,400.00)</td>
                    <td className="py-3 text-right font-medium text-slate-900 dark:text-white">$2,045,290.12</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-auto pt-12 border-t border-slate-100 dark:border-slate-800">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                <p className="text-[10px] text-center text-slate-400 font-medium">
                  DOCUMENT SECURED BY BLOCKCHAIN VERIFICATION LOG #88129-X-B12<br/>
                  INTERNAL USE ONLY — CONFIDENTIAL FINANCIAL DATA
                </p>
              </div>
            </div>

            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none rotate-12">
              <span className="text-[140px] font-black uppercase text-[#2E8B57]">Internal Copy</span>
            </div>
          </div>
        </div>

        {/* Sticky Action Toolbar */}
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 p-4 px-8 flex flex-wrap items-center justify-between gap-4 shadow-lg">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <HistoryIcon className="text-slate-400 text-sm" />
              <div className="text-[10px] leading-tight">
                <p className="font-bold uppercase text-slate-400">Last Audit</p>
                <p className="font-medium text-slate-900 dark:text-white">System checked: Today, 09:00 AM</p>
              </div>
            </div>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700"></div>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={highPriority}
                onChange={(e) => setHighPriority(e.target.checked)}
                className="rounded border-slate-300 text-[#2E8B57] focus:ring-[#2E8B57] focus:ring-offset-0 transition-all group-hover:scale-110"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">Mark as high priority</span>
            </label>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleReject}
              className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <CancelIcon className="text-sm" />
              Reject Document
            </button>
            <button
              onClick={handleRequestRevision}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-sm"
            >
              <EditNoteIcon className="text-sm" />
              Request Revision
            </button>
            <button
              onClick={handleVerify}
              className="px-8 py-2.5 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white rounded-xl text-sm font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-md relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              <CheckCircleIcon className="text-sm" />
              Verify Status
            </button>
          </div>
        </footer>
      </section>

      {/* Right Metadata Panel */}
      <aside className="w-80 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col p-5 space-y-6 overflow-y-auto custom-scrollbar">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Sponsor Information</h4>
          <div className="space-y-4">
            <div>
              <p className="text-[10px] font-medium text-slate-400">Full Entity Name</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{selectedSponsorData.sponsorName} LLC</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-400">Account Type</p>
              <p className="text-sm font-bold text-slate-900 dark:text-white">Strategic Partner (Tier 1)</p>
            </div>
            <div>
              <p className="text-[10px] font-medium text-slate-400">Compliance Rating</p>
              <div className="flex items-center gap-1.5 mt-1">
                <div className="flex gap-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-200"></span>
                </div>
                <span className="text-xs font-bold text-green-600">High</span>
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Audit Trail</h4>
          <div className="space-y-5 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-slate-100 dark:before:bg-slate-800">
            {auditEvents.map((event) => (
              <div key={event.id} className="relative pl-7 group">
                <div className={`absolute left-0 top-1 w-5 h-5 rounded-full ${event.iconBg} flex items-center justify-center ring-4 ring-white dark:ring-slate-900 transition-all group-hover:scale-110`}>
                  <event.icon className={`text-[10px] ${event.iconColor}`} />
                </div>
                <p className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-[#2E8B57] transition-colors">{event.action}</p>
                <p className="text-[10px] text-slate-500">{event.time} by {event.user}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="h-px bg-slate-100 dark:bg-slate-800"></div>

        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Review Notes</h4>
          <textarea
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20 resize-none"
            placeholder="Enter private observation notes..."
            rows={4}
          />
          <p className="text-[10px] text-slate-400 mt-2 italic">Notes are only visible to the internal PM team.</p>
        </div>
      </aside>

      {/* Custom styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #2E8B57;
        }
        .document-canvas {
          background-image: radial-gradient(#e2e8f0 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .dark .document-canvas {
          background-image: radial-gradient(#334155 1px, transparent 1px);
        }
      `}</style>
    </div>
  );
};

export default FinancialDocuments;