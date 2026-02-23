// ============== NotificationsCenter.tsx ==============
import React, { useState } from 'react';
import {
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  Group as GroupIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  Send as SendIcon,
  Visibility as VisibilityIcon,
  Mail as MailIcon,
  Link as LinkIcon,
  Image as ImageIcon,
  Code as CodeIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';

// ============== Types and Interfaces ==============

interface NotificationItem {
  id: number;
  title: string;
  stakeholder: string;
  status: 'approved' | 'rejected' | 'pending';
  time: string;
  project: string;
}

// ============== Notification List Item Component ==============

interface NotificationListItemProps {
  notification: NotificationItem;
  isSelected: boolean;
  onClick: () => void;
}

const NotificationListItem: React.FC<NotificationListItemProps> = ({ notification, isSelected, onClick }) => {
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return {
          bg: 'bg-[#2E8B57]/10',
          text: 'text-[#2E8B57]',
          border: 'border-[#2E8B57]/20',
          label: 'Approved'
        };
      case 'rejected':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-500',
          border: 'border-red-500/20',
          label: 'Rejected'
        };
      case 'pending':
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-500',
          border: 'border-amber-500/20',
          label: 'Pending'
        };
      default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-600',
          border: 'border-slate-200',
          label: status
        };
    }
  };

  const statusBadge = getStatusBadge(notification.status);

  return (
    <div
      onClick={onClick}
      className={`
        p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer
        ${isSelected 
          ? 'border-[#2E8B57] bg-[#2E8B57]/5' 
          : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#2E8B57]/30 hover:bg-slate-50 dark:hover:bg-slate-800/50'
        }
      `}
    >
      <div className="flex justify-between items-start mb-2">
        <span className={`
          px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider
          ${statusBadge.bg} ${statusBadge.text} border ${statusBadge.border}
        `}>
          {statusBadge.label}
        </span>
        <span className="text-[10px] text-slate-500 font-medium">{notification.time}</span>
      </div>
      <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#2E8B57] transition-colors">
        {notification.title}
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
        Stakeholder: {notification.stakeholder}
      </p>
      {isSelected && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#2E8B57]">
          <ChevronRightIcon className="text-sm" />
        </div>
      )}
    </div>
  );
};

// ============== Main NotificationsCenter Component ==============

const NotificationsCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'pending' | 'sent' | 'drafts'>('pending');
  const [selectedNotification, setSelectedNotification] = useState<number>(1);
  const [subject, setSubject] = useState('Notification: Feature X - UI Redesign - Review Status Update');
  const [message, setMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  // Sample notifications data
  const notifications: NotificationItem[] = [
    {
      id: 1,
      title: 'Feature X - UI Redesign',
      stakeholder: 'Alex Rivera',
      status: 'rejected',
      time: '2m ago',
      project: 'UI Redesign'
    },
    {
      id: 2,
      title: 'Milestone 2 - Backend',
      stakeholder: 'Sarah Chen',
      status: 'approved',
      time: '1h ago',
      project: 'Backend Development'
    },
    {
      id: 3,
      title: 'Mobile App API',
      stakeholder: 'James Wilson',
      status: 'rejected',
      time: '3h ago',
      project: 'Mobile App'
    },
    {
      id: 4,
      title: 'Database Migration',
      stakeholder: 'Emily Blunt',
      status: 'approved',
      time: 'Yesterday',
      project: 'Database'
    }
  ];

  const getFilteredNotifications = () => {
    if (activeTab === 'pending') return notifications.filter(n => n.status === 'pending');
    if (activeTab === 'sent') return notifications.filter(n => n.status === 'approved');
    return notifications; // drafts would be a different filter
  };

  const filteredNotifications = getFilteredNotifications();
  const selectedData = notifications.find(n => n.id === selectedNotification) || notifications[0];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return {
          bg: 'bg-[#2E8B57]/10',
          text: 'text-[#2E8B57]',
          border: 'border-[#2E8B57]/20',
          label: 'Approved'
        };
      case 'rejected':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-500',
          border: 'border-red-500/20',
          label: 'Rejected'
        };
      case 'pending':
        return {
          bg: 'bg-amber-500/10',
          text: 'text-amber-500',
          border: 'border-amber-500/20',
          label: 'Pending'
        };
      default:
        return {
          bg: 'bg-slate-100',
          text: 'text-slate-600',
          border: 'border-slate-200',
          label: status
        };
    }
  };

  const statusBadge = getStatusBadge(selectedData.status);

  const handleSendNotification = () => {
    if (!message.trim()) {
      alert('Please enter a justification message');
      return;
    }
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveDraft = () => {
    alert('Draft saved successfully');
  };

  return (
    <div className="flex h-full overflow-hidden bg-[#F8F9FA] dark:bg-slate-900">
      {/* Left Panel - Notification List */}
      <div className="w-96 border-r border-slate-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-2xl font-black bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
            Delivery Center
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
            Pending review decision notifications
          </p>
          
          {/* Tabs */}
          <div className="mt-4 flex border-b border-slate-200 dark:border-slate-800">
            <button
              onClick={() => setActiveTab('pending')}
              className={`
                px-4 py-2 text-xs font-bold transition-all relative
                ${activeTab === 'pending' 
                  ? 'text-[#2E8B57] border-b-2 border-[#2E8B57]' 
                  : 'text-slate-500 hover:text-[#2E8B57]'
                }
              `}
            >
              Pending (8)
              {activeTab === 'pending' && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#2E8B57] to-[#3CB371]" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`
                px-4 py-2 text-xs font-bold transition-all
                ${activeTab === 'sent' 
                  ? 'text-[#2E8B57] border-b-2 border-[#2E8B57]' 
                  : 'text-slate-500 hover:text-[#2E8B57]'
                }
              `}
            >
              Sent
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`
                px-4 py-2 text-xs font-bold transition-all
                ${activeTab === 'drafts' 
                  ? 'text-[#2E8B57] border-b-2 border-[#2E8B57]' 
                  : 'text-slate-500 hover:text-[#2E8B57]'
                }
              `}
            >
              Drafts
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
          {filteredNotifications.map(notification => (
            <NotificationListItem
              key={notification.id}
              notification={notification}
              isSelected={selectedNotification === notification.id}
              onClick={() => setSelectedNotification(notification.id)}
            />
          ))}
        </div>
      </div>

      {/* Right Panel - Communication Composer */}
      <div className="flex-1 flex flex-col bg-[#F8F9FA] dark:bg-slate-900 overflow-y-auto">
        <header className="p-6 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">Communication Composer</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-slate-500 font-medium">Drafting for:</span>
              <span className="text-xs font-bold text-[#2E8B57]">{selectedData.title}</span>
              <span className="text-slate-400">•</span>
              <span className={`text-xs font-bold uppercase tracking-tighter ${statusBadge.text}`}>
                {statusBadge.label}
              </span>
            </div>
          </div>
          <button
            onClick={handleSaveDraft}
            className="px-4 py-2 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-105 flex items-center gap-2"
          >
            <SaveIcon className="text-sm" />
            Save as Draft
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Recipient Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Stakeholder
                </label>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 hover:border-[#2E8B57]/30 transition-all">
                  <PersonIcon className="text-slate-400 text-sm" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {selectedData.stakeholder} (Product Lead)
                  </span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  Contact Email
                </label>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 hover:border-[#2E8B57]/30 transition-all">
                  <MailIcon className="text-slate-400 text-sm" />
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {selectedData.stakeholder.toLowerCase().replace(' ', '.')}@company.com
                  </span>
                </div>
              </div>
            </div>

            {/* Subject Line */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20 focus:border-[#2E8B57] transition-all"
              />
            </div>

            {/* Rich Text Editor */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                Justification <span className="text-red-500">*</span>
              </label>
              <div className={`
                rounded-xl border-2 overflow-hidden flex flex-col
                ${!message.trim() && selectedData.status === 'rejected' 
                  ? 'border-red-500/50' 
                  : 'border-slate-200 dark:border-slate-800'
                }
              `}>
                {/* Formatting Toolbar */}
                <div className="p-2 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 flex gap-1 flex-wrap">
                  <button className="p-1.5 rounded hover:bg-[#2E8B57]/10 text-slate-600 dark:text-slate-300 transition-all hover:scale-110">
                    <FormatBoldIcon className="text-sm" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-[#2E8B57]/10 text-slate-600 dark:text-slate-300 transition-all hover:scale-110">
                    <FormatItalicIcon className="text-sm" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-[#2E8B57]/10 text-slate-600 dark:text-slate-300 transition-all hover:scale-110">
                    <FormatListBulletedIcon className="text-sm" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-[#2E8B57]/10 text-slate-600 dark:text-slate-300 transition-all hover:scale-110">
                    <FormatListNumberedIcon className="text-sm" />
                  </button>
                  <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                  <button className="p-1.5 rounded hover:bg-[#2E8B57]/10 text-slate-600 dark:text-slate-300 transition-all hover:scale-110">
                    <LinkIcon className="text-sm" />
                  </button>
                  <button className="p-1.5 rounded hover:bg-[#2E8B57]/10 text-slate-600 dark:text-slate-300 transition-all hover:scale-110">
                    <ImageIcon className="text-sm" />
                  </button>
                  <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1"></div>
                  <button className="p-1.5 rounded hover:bg-[#2E8B57]/10 text-slate-600 dark:text-slate-300 transition-all hover:scale-110">
                    <CodeIcon className="text-sm" />
                  </button>
                </div>

                {/* Text Area */}
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 p-6 bg-white dark:bg-slate-900 resize-none focus:outline-none text-slate-700 dark:text-slate-200 text-sm leading-relaxed min-h-[300px]"
                  placeholder="Enter the justification for this decision. Please be as specific as possible to help the team understand the reasoning."
                />
              </div>

              {/* Error Message */}
              {!message.trim() && selectedData.status === 'rejected' && (
                <div className="flex items-center gap-1.5 mt-2 text-red-500">
                  <ErrorIcon className="text-sm" />
                  <span className="text-xs font-bold">Reason for rejection is required</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <footer className="p-6 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                <div className="size-7 rounded-full border-2 border-white dark:border-slate-900 bg-[#2E8B57]/20 flex items-center justify-center">
                  <VisibilityIcon className="text-[12px] text-[#2E8B57]" />
                </div>
                <div className="size-7 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-300">
                  +2
                </div>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                Stakeholders will be notified upon sending.
              </span>
            </div>

            <div className="flex gap-3">
              <button className="px-6 py-2.5 text-sm font-bold rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all hover:scale-105">
                Cancel
              </button>
              <button
                onClick={handleSendNotification}
                className="px-8 py-2.5 text-sm font-black rounded-xl bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white hover:shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-2 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                Send Notification
                <SendIcon className="text-sm" />
              </button>
            </div>
          </div>
        </footer>
      </div>

      {/* Success Toast */}
      {showToast && (
        <div className="fixed bottom-8 right-8 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 animate-slideIn z-50">
          <div className="bg-white/20 p-2 rounded-full">
            <CheckCircleIcon className="text-sm" />
          </div>
          <div>
            <p className="font-black text-sm">Notification Sent Successfully</p>
            <p className="text-xs font-medium opacity-80">
              {selectedData.stakeholder} has been notified of the decision.
            </p>
          </div>
        </div>
      )}

      {/* Custom styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(46, 139, 87, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(46, 139, 87, 0.4);
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
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

export default NotificationsCenter;