import React, { useState } from 'react';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Assignment as AssignmentIcon,
  ChevronRight as ChevronRightIcon,
  Timeline as TimelineIcon,
  Public as PublicIcon,
  Close as CloseIcon,
  ArrowBack as ArrowBackIcon,
  Visibility as VisibilityIcon
} from '@mui/icons-material';

// ============== Types and Interfaces ==============

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

interface SubmissionStatusPageProps {
  onNavigate?: (page: string) => void;
}

// ============== Submission Status Page (UC-04) ==============

const SubmissionStatusPage: React.FC<SubmissionStatusPageProps> = ({ onNavigate }) => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

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
      feedback: 'Duplicate record found. Child already registered with another organization. Please verify the child\'s information and ensure they are not already in the system.',
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
      case 'published': return <PublicIcon className="text-sm" />;
      default: return <AssignmentIcon className="text-sm" />;
    }
  };

  const handleViewFeedback = (submission: Submission) => {
    setSelectedSubmission(submission);
    setShowFeedbackModal(true);
  };

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header with Back Button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate?.('dashboard')}
            className="p-2 hover:bg-slate-100 rounded-xl transition-all
                     hover:scale-110 active:scale-95"
          >
            <ArrowBackIcon className="text-[#2E8B57]" />
          </button>
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
              Submission Status
            </h2>
            <p className="text-slate-500 mt-1">Track the status of your submitted child profiles (UC-04)</p>
          </div>
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
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <p className="text-2xl font-bold text-[#2E8B57]">{submissions.length}</p>
          <p className="text-sm text-slate-500">Total</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <p className="text-2xl font-bold text-yellow-600">
            {submissions.filter(s => s.status === 'pending').length}
          </p>
          <p className="text-sm text-slate-500">Pending</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <p className="text-2xl font-bold text-green-600">
            {submissions.filter(s => s.status === 'approved').length}
          </p>
          <p className="text-sm text-slate-500">Approved</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <p className="text-2xl font-bold text-red-600">
            {submissions.filter(s => s.status === 'rejected').length}
          </p>
          <p className="text-sm text-slate-500">Rejected</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all">
          <p className="text-2xl font-bold text-blue-600">
            {submissions.filter(s => s.status === 'published').length}
          </p>
          <p className="text-sm text-slate-500">Published</p>
        </div>
      </div>

      {/* Submissions List */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-500">
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
                <tr key={submission.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={submission.image} 
                        alt={submission.childName} 
                        className="w-10 h-10 rounded-xl object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div>
                        <p className="font-medium group-hover:text-[#2E8B57] transition-colors">{submission.childName}</p>
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
                    <button 
                      onClick={() => handleViewFeedback(submission)}
                      className="text-[#2E8B57] hover:underline text-sm font-medium
                               flex items-center gap-1 group/btn"
                    >
                      {submission.status === 'rejected' ? 'View Feedback' : 'View Details'}
                      <ChevronRightIcon className="text-sm group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && selectedSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowFeedbackModal(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 animate-slideIn shadow-2xl">
            <button
              onClick={() => setShowFeedbackModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <CloseIcon className="text-slate-500" />
            </button>
            
            <div className="text-center mb-6">
              <div className={`
                w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center
                ${selectedSubmission.status === 'rejected' 
                  ? 'bg-red-100 dark:bg-red-900/30' 
                  : 'bg-green-100 dark:bg-green-900/30'}
              `}>
                {selectedSubmission.status === 'rejected' 
                  ? <WarningIcon className="text-red-500 text-3xl" />
                  : <CheckCircleIcon className="text-green-500 text-3xl" />
                }
              </div>
              <h3 className="text-2xl font-bold">
                {selectedSubmission.status === 'rejected' ? 'Rejection Feedback' : 'Submission Details'}
              </h3>
              <p className="text-slate-500 mt-1">Child: {selectedSubmission.childName}</p>
            </div>
            
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                <div className="flex items-center gap-3 mb-3">
                  <img 
                    src={selectedSubmission.image} 
                    alt={selectedSubmission.childName}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-semibold">{selectedSubmission.childName}</p>
                    <p className="text-xs text-slate-500">{selectedSubmission.organization}</p>
                  </div>
                </div>
                
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  <span className="font-medium">Bio:</span> {selectedSubmission.bio}
                </p>
              </div>

              {selectedSubmission.feedback && (
                <div className="p-4 rounded-xl border border-red-200 bg-red-50 dark:bg-red-900/10">
                  <p className="text-sm font-medium text-red-800 dark:text-red-400 mb-2">Feedback:</p>
                  <p className="text-sm text-red-700 dark:text-red-300">{selectedSubmission.feedback}</p>
                  {selectedSubmission.reviewer && (
                    <p className="text-xs text-red-600 dark:text-red-400 mt-2">
                      Reviewed by {selectedSubmission.reviewer} on {selectedSubmission.reviewDate}
                    </p>
                  )}
                </div>
              )}

              {selectedSubmission.status === 'approved' && (
                <div className="p-4 rounded-xl border border-green-200 bg-green-50 dark:bg-green-900/10">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    Your submission has been approved and will be published soon.
                  </p>
                </div>
              )}

              {selectedSubmission.status === 'published' && (
                <div className="p-4 rounded-xl border border-blue-200 bg-blue-50 dark:bg-blue-900/10">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    This child profile is now visible to sponsors.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="flex-1 px-4 py-3 border border-slate-200 dark:border-slate-700 
                         rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 
                         transition-colors font-medium"
              >
                Close
              </button>
              {selectedSubmission.status === 'rejected' && (
                <button
                  onClick={() => {
                    setShowFeedbackModal(false);
                    onNavigate?.('submit');
                  }}
                  className="flex-1 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white 
                           px-4 py-3 rounded-xl font-semibold hover:shadow-lg 
                           transition-all duration-300"
                >
                  Resubmit
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Feedback Available Banner */}
      {filteredSubmissions.some(s => s.status === 'rejected' && s.feedback) && !showFeedbackModal && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 animate-pulse">
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

export default SubmissionStatusPage;