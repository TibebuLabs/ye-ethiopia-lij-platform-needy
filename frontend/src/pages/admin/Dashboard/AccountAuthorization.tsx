import React, { useState } from 'react';
import {
  VerifiedUser as VerifiedUserIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  Sync as SyncIcon,
  Check as CheckIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Block as BlockIcon,
  Verified as VerifiedIcon,
  Public as PublicIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  AttachMoney as AttachMoneyIcon,
  Shield as ShieldIcon} from '@mui/icons-material';

// ============== Types and Interfaces ==============

interface PendingAccount {
  id: number;
  name: string;
  taxId: string;
  type: 'Organization' | 'Sponsor' | 'NGO';
  submittedDate: string;
  riskLevel: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'awaiting-review';
  website?: string;
  description?: string;
  documents?: Document[];
  verificationSteps?: VerificationStep[];
}

interface VerificationStep {
  id: number;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'in-progress';
  completedDate?: string;
  icon?: React.ElementType;
}

interface Document {
  id: number;
  name: string;
  type: string;
  verified: boolean;
}

// ============== Account Detail Panel Component ==============

interface AccountDetailPanelProps {
  account: PendingAccount | null;
  onClose: () => void;
  onAuthorize: (id: number) => void;
  onDeny: (id: number, reason: string) => void;
}

const AccountDetailPanel: React.FC<AccountDetailPanelProps> = ({ 
  account, 
  onClose, 
  onAuthorize, 
  onDeny 
}) => {
  const [denyReason, setDenyReason] = useState('');
  const [showDenyBox, setShowDenyBox] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!account) {
    return (
      <aside className="w-[450px] bg-white border-l border-slate-200 flex flex-col items-center justify-center p-8">
        <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
          <VerifiedUserIcon className="text-4xl text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-700 mb-2">No Account Selected</h3>
        <p className="text-sm text-slate-500 text-center">
          Select an account from the list to view details and authorize
        </p>
      </aside>
    );
  }

  const handleAuthorize = () => {
    setIsProcessing(true);
    // Simulate processing
    setTimeout(() => {
      onAuthorize(account.id);
      setIsProcessing(false);
    }, 1000);
  };

  const handleDeny = () => {
    if (!denyReason && showDenyBox) return;
    setIsProcessing(true);
    setTimeout(() => {
      onDeny(account.id, denyReason);
      setIsProcessing(false);
      setShowDenyBox(false);
      setDenyReason('');
    }, 1000);
  };

  const getRiskColor = (risk: string) => {
    switch(risk) {
      case 'low': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-amber-600 bg-amber-50';
      case 'high': return 'text-red-600 bg-red-50';
      default: return 'text-slate-600 bg-slate-50';
    }
  };

  const verificationSteps: VerificationStep[] = account.verificationSteps || [
    {
      id: 1,
      title: 'Financial Review',
      description: 'Tax exemption documents (501c3) verified and audited by compliance team.',
      status: 'completed',
      completedDate: 'OCT 12',
      icon: AttachMoneyIcon
    },
    {
      id: 2,
      title: 'ID Documentation',
      description: 'Primary contact photo ID and organization charter documents cross-referenced.',
      status: 'completed',
      completedDate: 'OCT 12',
      icon: DescriptionIcon
    },
    {
      id: 3,
      title: 'Admin Authorization',
      description: 'Final manual approval required to activate account and grant system permissions.',
      status: 'pending',
      icon: ShieldIcon
    }
  ];

  return (
    <aside className="w-full lg:w-[450px] bg-white border-l border-slate-200 flex flex-col h-full overflow-hidden">
      {/* Panel Header */}
      <div className="border-b border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center rounded-full bg-[#2E8B57]/10 px-3 py-1 
                         text-xs font-bold text-[#2E8B57] uppercase animate-pulse">
            Active Selection
          </span>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-all 
                     hover:scale-110 active:scale-95"
          >
            <CloseIcon className="text-slate-400" />
          </button>
        </div>
        
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-xl 
                        bg-gradient-to-br from-[#2E8B57]/10 to-[#3CB371]/10 
                        border border-[#2E8B57]/20">
            <BusinessIcon className="text-3xl text-[#2E8B57]" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-xl font-black text-slate-900">{account.name}</h3>
            <p className="text-sm text-slate-500">Vetted {account.type}</p>
            
            {account.website && (
              <div className="mt-2 flex items-center gap-2">
                <PublicIcon className="text-sm text-[#2E8B57]" />
                <a href="#" className="text-xs font-medium text-slate-600 
                                     hover:text-[#2E8B57] hover:underline">
                  {account.website}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Risk Badge */}
        <div className="mt-4 flex gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getRiskColor(account.riskLevel)}`}>
            {account.riskLevel.charAt(0).toUpperCase() + account.riskLevel.slice(1)} Risk
          </span>
          <span className="px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600">
            ID: {account.taxId}
          </span>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Organization Details */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            Organization Details
          </h4>
          <div className="bg-slate-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Type</span>
              <span className="text-sm font-semibold">{account.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Submitted</span>
              <span className="text-sm font-semibold">{account.submittedDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Tax ID</span>
              <span className="text-sm font-mono font-semibold">{account.taxId}</span>
            </div>
          </div>
        </div>

        {/* Verification Timeline */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            Verification History
          </h4>
          
          <div className="space-y-6">
            {verificationSteps.map((step, index) => (
              <div key={step.id} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className={`
                    flex h-8 w-8 items-center justify-center rounded-xl
                    transition-all duration-300 group-hover:scale-110
                    ${step.status === 'completed' 
                      ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white' 
                      : 'border-2 border-[#2E8B57] bg-white text-[#2E8B57]'
                    }
                  `}>
                    {step.status === 'completed' ? (
                      <CheckIcon className="text-sm" />
                    ) : (
                      <HourglassEmptyIcon className="text-sm" />
                    )}
                  </div>
                  {index < verificationSteps.length - 1 && (
                    <div className="h-full w-0.5 bg-gradient-to-b from-[#2E8B57]/20 to-transparent" />
                  )}
                </div>
                
                <div className="flex-1 pb-6">
                  <p className="font-bold text-slate-900 leading-none flex items-center gap-2">
                    {step.title}
                    {step.icon && <step.icon className="text-sm text-slate-400" />}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 leading-tight">
                    {step.description}
                  </p>
                  {step.status === 'completed' ? (
                    <span className="mt-2 inline-block text-[10px] font-bold text-[#2E8B57] 
                                   bg-[#2E8B57]/10 px-2 py-0.5 rounded-full">
                      COMPLETED • {step.completedDate}
                    </span>
                  ) : (
                    <span className="mt-2 inline-block text-[10px] font-bold text-amber-600 
                                   bg-amber-50 px-2 py-0.5 rounded-full animate-pulse">
                      PENDING ACTION
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Documents Section */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
            Verified Documents
          </h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg
                          border border-green-100">
              <div className="flex items-center gap-3">
                <DescriptionIcon className="text-green-600" />
                <span className="text-sm font-medium">Tax Exemption (501c3)</span>
              </div>
              <CheckIcon className="text-green-600 text-sm" />
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg
                          border border-green-100">
              <div className="flex items-center gap-3">
                <DescriptionIcon className="text-green-600" />
                <span className="text-sm font-medium">Organization Charter</span>
              </div>
              <CheckIcon className="text-green-600 text-sm" />
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg
                          border border-green-100">
              <div className="flex items-center gap-3">
                <PersonIcon className="text-green-600" />
                <span className="text-sm font-medium">ID Document (Contact)</span>
              </div>
              <CheckIcon className="text-green-600 text-sm" />
            </div>
          </div>
        </div>

        {/* Denial Reason Box */}
        {showDenyBox && (
          <div className="rounded-xl bg-red-50 p-4 border border-red-200 
                        animate-slideIn">
            <label className="block mb-2 text-xs font-bold text-red-600 
                            uppercase tracking-wider">
              Reason for Rejection (Required)
            </label>
            <textarea 
              value={denyReason}
              onChange={(e) => setDenyReason(e.target.value)}
              className="w-full rounded-lg border-red-200 bg-white p-3 text-sm 
                       focus:border-red-500 focus:ring-red-500/20 resize-none"
              placeholder="Explain why this account is being denied authorization..."
              rows={3}
            />
          </div>
        )}
      </div>

      {/* Panel Footer Actions */}
      <div className="border-t border-slate-100 bg-slate-50 p-6">
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => {
              if (showDenyBox && denyReason) {
                handleDeny();
              } else {
                setShowDenyBox(true);
              }
            }}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl 
                     bg-red-600 px-4 py-3 text-sm font-bold text-white 
                     shadow-lg shadow-red-600/20 hover:bg-red-700 
                     active:scale-95 transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BlockIcon className="text-lg" />
            {showDenyBox ? 'Confirm Deny' : 'Deny Account'}
          </button>
          
          <button 
            onClick={handleAuthorize}
            disabled={isProcessing}
            className="flex items-center justify-center gap-2 rounded-xl 
                     bg-gradient-to-r from-[#2E8B57] to-[#3CB371] 
                     px-4 py-3 text-sm font-bold text-white 
                     shadow-lg shadow-[#2E8B57]/20 hover:shadow-xl
                     active:scale-95 transition-all duration-300
                     disabled:opacity-50 disabled:cursor-not-allowed
                     relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] 
                          group-hover:translate-x-[100%] transition-transform duration-700" />
            <VerifiedIcon className="text-lg" />
            {isProcessing ? 'Processing...' : 'Authorize'}
          </button>
        </div>
        
        <p className="mt-4 text-center text-[11px] font-medium text-slate-400">
          Authorization will grant immediate access to the organization's dashboard.
        </p>
      </div>
    </aside>
  );
};

// ============== Main AccountAuthorization Component ==============

interface AccountAuthorizationProps {
  onNavigate?: (page: string) => void;
}

// eslint-disable-next-line no-empty-pattern
const AccountAuthorization: React.FC<AccountAuthorizationProps> = ({ }) => {
  const [selectedAccount, setSelectedAccount] = useState<PendingAccount | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sample pending accounts data
  const pendingAccounts: PendingAccount[] = [
    {
      id: 1,
      name: 'Global Relief Fund',
      taxId: '99-001245',
      type: 'Organization',
      submittedDate: 'Oct 12, 2023',
      riskLevel: 'low',
      status: 'awaiting-review',
      website: 'www.globalrelief.org',
      description: 'International humanitarian organization focused on disaster relief.',
      verificationSteps: [
        {
          id: 1,
          title: 'Financial Review',
          description: 'Tax exemption documents verified and audited.',
          status: 'completed',
          completedDate: 'OCT 12'
        },
        {
          id: 2,
          title: 'ID Documentation',
          description: 'Primary contact photo ID verified.',
          status: 'completed',
          completedDate: 'OCT 12'
        },
        {
          id: 3,
          title: 'Admin Authorization',
          description: 'Final manual approval required.',
          status: 'pending'
        }
      ]
    },
    {
      id: 2,
      name: 'Tech Sponsor Inc',
      taxId: '45-882190',
      type: 'Sponsor',
      submittedDate: 'Oct 14, 2023',
      riskLevel: 'medium',
      status: 'in-progress',
      website: 'www.techsponsor.com',
      verificationSteps: [
        {
          id: 1,
          title: 'Financial Review',
          description: 'Financial documents under review.',
          status: 'in-progress'
        },
        {
          id: 2,
          title: 'ID Documentation',
          description: 'Pending ID verification.',
          status: 'pending'
        }
      ]
    },
    {
      id: 3,
      name: 'Unity Alliance',
      taxId: '21-003312',
      type: 'Organization',
      submittedDate: 'Oct 15, 2023',
      riskLevel: 'high',
      status: 'pending',
      website: 'www.unityalliance.org',
      verificationSteps: [
        {
          id: 1,
          title: 'Financial Review',
          description: 'Incomplete financial documentation.',
          status: 'pending'
        }
      ]
    },
    {
      id: 4,
      name: 'Hope International',
      taxId: '33-778899',
      type: 'NGO',
      submittedDate: 'Oct 16, 2023',
      riskLevel: 'low',
      status: 'pending',
      website: 'www.hopeintl.org'
    },
    {
      id: 5,
      name: 'Education First',
      taxId: '12-445566',
      type: 'Organization',
      submittedDate: 'Oct 17, 2023',
      riskLevel: 'low',
      status: 'pending',
      website: 'www.educationfirst.org'
    },
    {
      id: 6,
      name: 'Health Care Initiative',
      taxId: '78-990011',
      type: 'NGO',
      submittedDate: 'Oct 18, 2023',
      riskLevel: 'medium',
      status: 'pending'
    }
  ];

  // Filter accounts based on search and filters
  const filteredAccounts = pendingAccounts.filter(account => {
    const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         account.taxId.includes(searchTerm);
    const matchesType = filterType === 'all' || account.type === filterType;
    const matchesRisk = filterRisk === 'all' || account.riskLevel === filterRisk;
    return matchesSearch && matchesType && matchesRisk;
  });

  const stats = {
    total: pendingAccounts.length,
    organizations: pendingAccounts.filter(a => a.type === 'Organization').length,
    sponsors: pendingAccounts.filter(a => a.type === 'Sponsor').length,
    ngos: pendingAccounts.filter(a => a.type === 'NGO').length
  };

  const handleAuthorize = (id: number) => {
    console.log(`Authorizing account ${id}`);
    // In real app, call API here
    setSelectedAccount(null);
    alert(`Account ${id} has been authorized successfully!`);
  };

  const handleDeny = (id: number, reason: string) => {
    console.log(`Denying account ${id}: ${reason}`);
    // In real app, call API here
    setSelectedAccount(null);
    alert(`Account ${id} has been denied. Reason: ${reason}`);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getRiskBadge = (risk: string) => {
    switch(risk) {
      case 'low':
        return (
          <span className="flex items-center gap-1.5 text-sm font-medium text-green-600">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Low
          </span>
        );
      case 'medium':
        return (
          <span className="flex items-center gap-1.5 text-sm font-medium text-amber-600">
            <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            Medium
          </span>
        );
      case 'high':
        return (
          <span className="flex items-center gap-1.5 text-sm font-medium text-red-600">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            High Risk
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full overflow-hidden bg-[#F8F9FA]">
      {/* Left Section: Pending Accounts List */}
      <section className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 bg-white">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-[#2E8B57] to-[#3CB371] 
                           bg-clip-text text-transparent">
                Account Authorization
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                UC-06: Authorization and validation workflow
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 
                                     text-slate-400 text-sm" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search accounts..."
                  className="pl-10 pr-4 py-2 bg-white rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] 
                           focus:border-transparent w-full lg:w-64"
                />
              </div>
              
              {/* Filter Buttons */}
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 bg-white rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57]
                           text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="Organization">Organizations</option>
                  <option value="Sponsor">Sponsors</option>
                  <option value="NGO">NGOs</option>
                </select>
                
                <select
                  value={filterRisk}
                  onChange={(e) => setFilterRisk(e.target.value)}
                  className="px-4 py-2 bg-white rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57]
                           text-sm"
                >
                  <option value="all">All Risks</option>
                  <option value="low">Low Risk</option>
                  <option value="medium">Medium Risk</option>
                  <option value="high">High Risk</option>
                </select>
                
                <button 
                  onClick={handleRefresh}
                  className="p-2 bg-white rounded-xl border border-slate-200
                           hover:bg-slate-50 transition-all hover:scale-105
                           active:scale-95"
                >
                  <SyncIcon className={`text-slate-600 text-lg 
                    ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100
                        hover:shadow-lg transition-all duration-300
                        hover:scale-105 cursor-pointer">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Pending
            </p>
            <p className="text-2xl font-black text-[#2E8B57]">{stats.total}</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100
                        hover:shadow-lg transition-all duration-300
                        hover:scale-105 cursor-pointer">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Organizations
            </p>
            <p className="text-2xl font-black text-slate-900">{stats.organizations}</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100
                        hover:shadow-lg transition-all duration-300
                        hover:scale-105 cursor-pointer">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Sponsors
            </p>
            <p className="text-2xl font-black text-slate-900">{stats.sponsors}</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100
                        hover:shadow-lg transition-all duration-300
                        hover:scale-105 cursor-pointer">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              NGOs
            </p>
            <p className="text-2xl font-black text-slate-900">{stats.ngos}</p>
          </div>
        </div>

        {/* Table Container */}
        <div className="flex-1 overflow-auto px-6 pb-6">
          <div className="bg-white rounded-xl shadow-lg border border-slate-100 
                        overflow-hidden hover:shadow-2xl transition-all duration-500">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
                <tr>
                  <th className="px-6 py-4">Account Name</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4">Risk Level</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAccounts.map((account) => (
                  <tr 
                    key={account.id}
                    onClick={() => setSelectedAccount(account)}
                    className={`
                      group cursor-pointer transition-all duration-300
                      hover:bg-slate-50 hover:scale-[1.01] hover:shadow-md
                      ${selectedAccount?.id === account.id 
                        ? 'bg-[#2E8B57]/5 border-l-4 border-[#2E8B57]' 
                        : 'border-l-4 border-transparent'}
                    `}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 group-hover:text-[#2E8B57] 
                                       transition-colors">
                          {account.name}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {account.taxId}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-lg 
                                     bg-slate-100 px-2 py-1 text-xs font-medium 
                                     text-slate-600 group-hover:bg-[#2E8B57]/10 
                                     group-hover:text-[#2E8B57] transition-all">
                        {account.type}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {account.submittedDate}
                    </td>
                    
                    <td className="px-6 py-4">
                      {getRiskBadge(account.riskLevel)}
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <span className={`
                        text-xs font-bold px-2 py-1 rounded-full
                        ${account.status === 'awaiting-review' 
                          ? 'bg-[#2E8B57]/10 text-[#2E8B57] animate-pulse' 
                          : account.status === 'in-progress'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-slate-100 text-slate-500'}
                      `}>
                        {account.status === 'awaiting-review' && 'AWAITING REVIEW'}
                        {account.status === 'in-progress' && 'IN PROGRESS'}
                        {account.status === 'pending' && 'PENDING'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredAccounts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-500">No accounts match your filters</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Right Section: Account Detail Panel */}
      <AccountDetailPanel
        account={selectedAccount}
        onClose={() => setSelectedAccount(null)}
        onAuthorize={handleAuthorize}
        onDeny={handleDeny}
      />
    </div>
  );
};

// ============== Updated SystemAdminDashboard with Navigation ==============

// Update the navigation in your SystemAdminDashboard to include this page:
// In the navigationItems array, add onClick handlers:

/*
const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon, 
    onClick: () => handleNavigation('dashboard') },
  { id: 'users', label: 'User Management', icon: GroupIcon, 
    onClick: () => handleNavigation('users') },
  { id: 'auth', label: 'Account Authorization', icon: VerifiedUserIcon, 
    onClick: () => handleNavigation('authorization') },  // This one!
  { id: 'submissions', label: 'Child Submissions', icon: ChildCareIcon, 
    onClick: () => handleNavigation('submissions') },
  // ... rest of items
];

// Then in your main render, conditionally show the page:
const renderContent = () => {
  switch(activePage) {
    case 'authorization':
      return <AccountAuthorization onNavigate={handleNavigation} />;
    case 'dashboard':
      return <DashboardHome />;
    // ... other cases
    default:
      return <DashboardHome />;
  }
};
*/

export default AccountAuthorization;