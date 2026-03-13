import React, { useState } from 'react';
import {
  MedicalServices as MedicalServicesIcon,
  School as SchoolIcon,
  Restaurant as RestaurantIcon,
  HealthAndSafety as HealthAndSafetyIcon,
  Assignment as AssignmentIcon,
  Description as DescriptionIcon,
  AttachFile as AttachFileIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  History as HistoryIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  LocationOn as LocationIcon,
  ArrowBack as ArrowBackIcon,
  ChevronRight as ChevronRightIcon,
  Close as CloseIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Upload as UploadIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Download as DownloadIcon,
  AddCircle as AddCircleIcon
} from '@mui/icons-material';

// ============== Types and Interfaces ==============

interface Child {
  id: number;
  name: string;
  age: number;
  gender: string;
  location: string;
  image: string;
  organization: string;
  sponsorName?: string;
  sponsorId?: string;
}

interface Intervention {
  id: number;
  childId: number;
  childName: string;
  type: 'healthcare' | 'education' | 'nutrition';
  title: string;
  description: string;
  date: string;
  provider: string;
  providerRole: string;
  location: string;
  amount?: number;
  receiptUrl?: string;
  receiptType?: 'pdf' | 'image';
  status: 'completed' | 'pending' | 'verified';
  visibility: 'sponsor' | 'private';
  notes: string;
  createdAt: string;
  updatedAt: string;
  verifiedBy?: string;
  verifiedAt?: string;
}

interface InterventionLogsProps {
  onNavigate?: (page: string) => void;
}

// ============== Add Intervention Modal ==============

interface AddInterventionModalProps {
  child: Child | null;
  onClose: () => void;
  onSave: (intervention: any) => void;
}

const AddInterventionModal: React.FC<AddInterventionModalProps> = ({ child, onClose, onSave }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    provider: '',
    location: '',
    amount: '',
    receipt: null as File | null,
    notes: '',
    visibility: 'sponsor' as 'sponsor' | 'private'
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const interventionTypes = [
    { id: 'healthcare', label: 'Healthcare', icon: MedicalServicesIcon, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'education', label: 'Education', icon: SchoolIcon, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'nutrition', label: 'Nutrition', icon: RestaurantIcon, color: 'text-green-500', bg: 'bg-green-50' }
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setFormData(prev => ({ ...prev, receipt: file }));
        }
      }, 200);
    }
  };

  const handleSubmit = () => {
    const newIntervention = {
      ...formData,
      childId: child?.id,
      childName: child?.name,
      provider: formData.provider || 'St. Gabriel Center Staff',
      date: formData.date,
      status: 'completed',
      createdAt: new Date().toISOString(),
      id: Date.now()
    };
    onSave(newIntervention);
  };

  if (!child) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideIn shadow-2xl">
        
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-12 rounded-xl bg-gradient-to-br 
                            from-[#2E8B57] to-[#3CB371] flex items-center justify-center">
                <AddCircleIcon className="text-white text-2xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Record Intervention</h3>
                <p className="text-sm text-slate-500">Adding for {child.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <CloseIcon className="text-slate-500" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="px-6 pt-6">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`
                  size-8 rounded-lg flex items-center justify-center text-sm font-semibold
                  ${step >= s 
                    ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white' 
                    : 'bg-slate-100 text-slate-400'
                  }
                `}>
                  {s}
                </div>
                {s < 3 && (
                  <div className={`
                    flex-1 h-1 mx-2 rounded
                    ${step > s ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371]' : 'bg-slate-200'}
                  `} />
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-center text-[#2E8B57] font-medium">
            Step {step} of 3: {step === 1 ? 'Select Type' : step === 2 ? 'Enter Details' : 'Upload Receipt'}
          </p>
        </div>

        {/* Step 1: Select Intervention Type */}
        {step === 1 && (
          <div className="p-6 space-y-4">
            <p className="text-sm font-medium text-slate-700 mb-4">
              Select the type of intervention:
            </p>
            <div className="grid grid-cols-1 gap-3">
              {interventionTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, type: type.id }));
                    setStep(2);
                  }}
                  className="p-6 rounded-xl border-2 border-slate-200
                           hover:border-[#2E8B57] hover:bg-[#2E8B57]/5 
                           transition-all duration-300 group text-left
                           flex items-center gap-4"
                >
                  <div className={`size-14 rounded-xl ${type.bg} ${type.color} 
                                flex items-center justify-center group-hover:scale-110 
                                transition-transform duration-300`}>
                    <type.icon className="text-3xl" />
                  </div>
                  <div>
                    <p className="text-lg font-bold">{type.label}</p>
                    <p className="text-sm text-slate-500">
                      Record {type.label.toLowerCase()} support activity
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Enter Details */}
        {step === 2 && (
          <div className="p-6 space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl mb-4">
              <div className="flex items-center gap-3">
                <img src={child.image} alt={child.name} className="size-12 rounded-xl" />
                <div>
                  <p className="font-bold">{child.name}</p>
                  <p className="text-xs text-slate-500">{child.age} years • {child.location}</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Intervention Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                         focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                placeholder="e.g., Medical Checkup, School Supplies Distribution"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                         focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent resize-none"
                placeholder="Describe the intervention in detail..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                  placeholder="Where was this provided?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Amount (if any)</label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                  placeholder="e.g., 50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Visibility</label>
                <select
                  value={formData.visibility}
                  onChange={(e) => setFormData(prev => ({ ...prev, visibility: e.target.value as 'sponsor' | 'private' }))}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                >
                  <option value="sponsor">Visible to Sponsor</option>
                  <option value="private">Private (Internal Only)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                rows={2}
                className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                         focus:outline-none focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent resize-none"
                placeholder="Any additional information..."
              />
            </div>
          </div>
        )}

        {/* Step 3: Upload Receipt */}
        {step === 3 && (
          <div className="p-6 space-y-6">
            <div className="bg-amber-50 p-4 rounded-xl mb-4">
              <div className="flex items-start gap-3">
                <InfoIcon className="text-amber-600 mt-1" />
                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Digital Receipt Required
                  </p>
                  <p className="text-xs text-amber-700">
                    Please upload a digital receipt or proof of the intervention for 
                    accountability and sponsor visibility.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center 
                          hover:border-[#2E8B57] transition-colors duration-300">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileUpload}
                className="hidden"
                id="receipt-upload"
              />
              <label htmlFor="receipt-upload" className="cursor-pointer">
                {formData.receipt ? (
                  <div className="space-y-3">
                    <div className="size-16 mx-auto bg-green-100 rounded-2xl 
                                  flex items-center justify-center">
                      <CheckCircleIcon className="text-green-600 text-3xl" />
                    </div>
                    <p className="font-medium text-green-600">{formData.receipt.name}</p>
                    <p className="text-xs text-slate-500">
                      {(formData.receipt.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                ) : (
                  <>
                    {isUploading ? (
                      <div className="space-y-3">
                        <div className="w-16 h-16 mx-auto relative">
                          <div className="absolute inset-0 rounded-2xl border-4 
                                        border-[#2E8B57] border-t-transparent 
                                        animate-spin" />
                        </div>
                        <p className="text-sm font-medium">Uploading... {uploadProgress}%</p>
                      </div>
                    ) : (
                      <>
                        <UploadIcon className="text-4xl text-slate-400 mb-3 mx-auto" />
                        <p className="text-sm text-slate-500 mb-2">
                          Click to upload receipt or proof
                        </p>
                        <p className="text-xs text-slate-400">
                          PDF, PNG, JPG up to 5MB
                        </p>
                      </>
                    )}
                  </>
                )}
              </label>
            </div>

            {formData.receipt && (
              <div className="bg-green-50 p-4 rounded-xl">
                <p className="text-sm text-green-700 flex items-center gap-2">
                  <CheckCircleIcon className="text-sm" />
                  Receipt uploaded successfully!
                </p>
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-slate-200 p-6">
          <div className="flex justify-between">
            {step > 1 && (
              <button
                onClick={() => setStep(step - 1)}
                className="px-6 py-3 border border-slate-200 rounded-xl 
                         hover:bg-slate-50 transition-all font-medium text-slate-700"
              >
                Back
              </button>
            )}
            {step < 3 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-[#2E8B57] 
                         to-[#3CB371] text-white rounded-xl font-semibold 
                         hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                disabled={step === 2 && !formData.title}
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!formData.receipt}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-[#2E8B57] 
                         to-[#3CB371] text-white rounded-xl font-semibold 
                         hover:shadow-lg transition-all hover:scale-105 active:scale-95 
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Intervention
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============== Intervention Timeline Component ==============

interface InterventionTimelineProps {
  interventions: Intervention[];
  onViewReceipt: (intervention: Intervention) => void;
}

const InterventionTimeline: React.FC<InterventionTimelineProps> = ({ interventions, onViewReceipt }) => {
  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'healthcare':
        return <MedicalServicesIcon className="text-blue-500" />;
      case 'education':
        return <SchoolIcon className="text-purple-500" />;
      case 'nutrition':
        return <RestaurantIcon className="text-green-500" />;
      default:
        return <AssignmentIcon className="text-slate-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'healthcare': return 'bg-blue-50 text-blue-600';
      case 'education': return 'bg-purple-50 text-purple-600';
      case 'nutrition': return 'bg-green-50 text-green-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="space-y-4">
      {interventions.map((intervention, index) => (
        <div key={intervention.id} className="relative group">
          {index < interventions.length - 1 && (
            <div className="absolute left-6 top-16 bottom-0 w-0.5 
                          bg-gradient-to-b from-[#2E8B57]/20 to-transparent" />
          )}
          
          <div className="flex gap-4">
            <div className={`
              size-12 rounded-xl flex items-center justify-center flex-shrink-0
              transition-all duration-300 group-hover:scale-110 group-hover:rotate-6
              ${getTypeColor(intervention.type)}
            `}>
              {getTypeIcon(intervention.type)}
            </div>
            
            <div className="flex-1 bg-white rounded-xl border border-slate-200 p-4
                          hover:shadow-lg transition-all duration-300">
              <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                <div>
                  <h4 className="font-bold group-hover:text-[#2E8B57] transition-colors">
                    {intervention.title}
                  </h4>
                  <p className="text-xs text-slate-500 flex items-center gap-2 mt-1">
                    <CalendarIcon className="text-[10px]" />
                    {intervention.date}
                    <span>•</span>
                    <span>By {intervention.provider}</span>
                  </p>
                </div>
                <span className={`
                  px-2 py-1 rounded-lg text-[10px] font-bold uppercase
                  ${intervention.visibility === 'sponsor' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-slate-100 text-slate-600'
                  }
                `}>
                  {intervention.visibility === 'sponsor' ? 'Visible to Sponsor' : 'Private'}
                </span>
              </div>
              
              <p className="text-sm text-slate-600 mb-3">
                {intervention.description}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {intervention.receipt && (
                    <button
                      onClick={() => onViewReceipt(intervention)}
                      className="text-xs text-[#2E8B57] font-medium 
                               hover:underline flex items-center gap-1"
                    >
                      <AttachFileIcon className="text-xs" />
                      View Receipt
                    </button>
                  )}
                  {intervention.amount && (
                    <span className="text-xs bg-slate-100 px-2 py-1 rounded-lg">
                      ${intervention.amount}
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <HistoryIcon className="text-[10px]" />
                  {new Date(intervention.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============== Main InterventionLogs Component ==============

const InterventionLogs: React.FC<InterventionLogsProps> = ({ onNavigate }) => {
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedIntervention, setSelectedIntervention] = useState<Intervention | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Mock children data
  const children: Child[] = [
    {
      id: 1,
      name: 'Abebe Kebede',
      age: 8,
      gender: 'Male',
      location: 'Addis Ababa',
      image: 'https://i.pravatar.cc/300?img=1',
      organization: 'St. Gabriel Center',
      sponsorName: 'John Smith',
      sponsorId: 'SP-2024-001'
    },
    {
      id: 2,
      name: 'Sara Tesfaye',
      age: 6,
      gender: 'Female',
      location: 'Bahir Dar',
      image: 'https://i.pravatar.cc/300?img=2',
      organization: 'St. Gabriel Center',
      sponsorName: 'Emily Johnson',
      sponsorId: 'SP-2024-002'
    },
    {
      id: 3,
      name: 'Mekdes Hailu',
      age: 10,
      gender: 'Female',
      location: 'Gondar',
      image: 'https://i.pravatar.cc/300?img=3',
      organization: 'St. Gabriel Center',
      sponsorName: 'Michael Brown',
      sponsorId: 'SP-2024-003'
    }
  ];

  // Mock interventions data
  const [interventions, setInterventions] = useState<Intervention[]>([
    {
      id: 1,
      childId: 1,
      childName: 'Abebe Kebede',
      type: 'healthcare',
      title: 'Quarterly Medical Checkup',
      description: 'Complete physical examination, vaccinations updated, and deworming treatment provided.',
      date: '2024-02-15',
      provider: 'Dr. Sarah Mekonnen',
      providerRole: 'Medical Officer',
      location: 'St. Gabriel Health Center',
      amount: 75,
      receiptUrl: '/receipts/med-001.pdf',
      receiptType: 'pdf',
      status: 'completed',
      visibility: 'sponsor',
      notes: 'Child is healthy and meeting all growth milestones.',
      createdAt: '2024-02-15T10:30:00Z',
      updatedAt: '2024-02-15T10:30:00Z',
      verifiedBy: 'Dr. Sarah Mekonnen',
      verifiedAt: '2024-02-15T11:00:00Z'
    },
    {
      id: 2,
      childId: 1,
      childName: 'Abebe Kebede',
      type: 'education',
      title: 'School Supplies Distribution',
      description: 'Provided textbooks, notebooks, and uniform for the new semester.',
      date: '2024-02-10',
      provider: 'Tesfaye Alemu',
      providerRole: 'Education Coordinator',
      location: 'St. Gabriel School',
      amount: 120,
      receiptUrl: '/receipts/edu-001.jpg',
      receiptType: 'image',
      status: 'completed',
      visibility: 'sponsor',
      notes: 'Child showed excitement about new books.',
      createdAt: '2024-02-10T14:15:00Z',
      updatedAt: '2024-02-10T14:15:00Z'
    },
    {
      id: 3,
      childId: 2,
      childName: 'Sara Tesfaye',
      type: 'nutrition',
      title: 'Monthly Food Basket',
      description: 'Provided nutritious food package including grains, vegetables, and protein supplements.',
      date: '2024-02-14',
      provider: 'Hana Worku',
      providerRole: 'Nutrition Specialist',
      location: 'St. Gabriel Distribution Center',
      amount: 85,
      receiptUrl: '/receipts/nut-001.pdf',
      receiptType: 'pdf',
      status: 'completed',
      visibility: 'sponsor',
      notes: 'Regular monthly distribution.',
      createdAt: '2024-02-14T09:00:00Z',
      updatedAt: '2024-02-14T09:00:00Z'
    }
  ]);

  const filteredChildren = children.filter(child =>
    child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    child.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredInterventions = interventions
    .filter(i => !selectedChild || i.childId === selectedChild.id)
    .filter(i => filterType === 'all' || i.type === filterType)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAddIntervention = (newIntervention: any) => {
    const intervention: Intervention = {
      ...newIntervention,
      id: interventions.length + 1,
      childId: selectedChild!.id,
      childName: selectedChild!.name,
      provider: newIntervention.provider || 'St. Gabriel Center Staff',
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setInterventions([intervention, ...interventions]);
    setShowAddModal(false);
  };

  const stats = {
    total: interventions.length,
    healthcare: interventions.filter(i => i.type === 'healthcare').length,
    education: interventions.filter(i => i.type === 'education').length,
    nutrition: interventions.filter(i => i.type === 'nutrition').length,
    totalAmount: interventions.reduce((sum, i) => sum + (i.amount || 0), 0)
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FA]">
      <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate?.('dashboard')}
              className="p-2 hover:bg-slate-100 rounded-xl transition-all hover:scale-110"
            >
              <ArrowBackIcon className="text-[#2E8B57]" />
            </button>
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-[#2E8B57] 
                           to-[#3CB371] bg-clip-text text-transparent">
                Intervention Logs
              </h1>
              <p className="text-slate-500 mt-1">
                Record and manage support activities for accountability (UC-05)
              </p>
            </div>
          </div>
          
          <button
            onClick={() => selectedChild && setShowAddModal(true)}
            disabled={!selectedChild}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-xl font-bold
              transition-all duration-300 hover:scale-105 active:scale-95
              ${selectedChild
                ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white shadow-lg'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            <AddCircleIcon className="text-sm" />
            Add Intervention
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200
                        hover:shadow-lg transition-all">
            <p className="text-2xl font-bold text-[#2E8B57]">{stats.total}</p>
            <p className="text-xs text-slate-500">Total Interventions</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200
                        hover:shadow-lg transition-all">
            <p className="text-2xl font-bold text-blue-600">{stats.healthcare}</p>
            <p className="text-xs text-slate-500">Healthcare</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200
                        hover:shadow-lg transition-all">
            <p className="text-2xl font-bold text-purple-600">{stats.education}</p>
            <p className="text-xs text-slate-500">Education</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200
                        hover:shadow-lg transition-all">
            <p className="text-2xl font-bold text-green-600">{stats.nutrition}</p>
            <p className="text-xs text-slate-500">Nutrition</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200
                        hover:shadow-lg transition-all">
            <p className="text-2xl font-bold text-[#2E8B57]">${stats.totalAmount}</p>
            <p className="text-xs text-slate-500">Total Amount</p>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Children List */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-200 
                          shadow-lg overflow-hidden sticky top-24">
              
              {/* Search */}
              <div className="p-4 border-b border-slate-200">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 
                                       text-slate-400 text-sm" />
                  <input
                    type="text"
                    placeholder="Search children..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl 
                             border border-slate-200 focus:outline-none 
                             focus:ring-2 focus:ring-[#2E8B57] focus:border-transparent"
                  />
                </div>
              </div>
              
              {/* Children List */}
              <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
                {filteredChildren.map((child) => (
                  <button
                    key={child.id}
                    onClick={() => setSelectedChild(child)}
                    className={`
                      w-full p-4 text-left transition-all duration-300
                      hover:bg-slate-50
                      ${selectedChild?.id === child.id 
                        ? 'bg-[#2E8B57]/5 border-l-4 border-[#2E8B57]' 
                        : ''
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={child.image}
                        alt={child.name}
                        className="size-12 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{child.name}</p>
                        <p className="text-xs text-slate-500">
                          {child.age} years • {child.location}
                        </p>
                        {child.sponsorName && (
                          <p className="text-[10px] text-[#2E8B57] mt-1">
                            Sponsor: {child.sponsorName}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Interventions */}
          <div className="col-span-12 lg:col-span-8">
            {selectedChild ? (
              <div className="space-y-6">
                {/* Child Profile Header */}
                <div className="bg-white rounded-2xl border border-slate-200 
                              p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <img
                      src={selectedChild.image}
                      alt={selectedChild.name}
                      className="size-20 rounded-2xl object-cover border-4 
                               border-[#2E8B57]/20"
                    />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h2 className="text-2xl font-bold">{selectedChild.name}</h2>
                          <p className="text-[#2E8B57] font-medium">
                            ID: #{selectedChild.id}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-green-100 text-green-700 
                                       rounded-full text-xs font-bold">
                          Active
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                        <div>
                          <p className="text-xs text-slate-500">Age</p>
                          <p className="font-bold">{selectedChild.age} years</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Gender</p>
                          <p className="font-bold">{selectedChild.gender}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Location</p>
                          <p className="font-bold">{selectedChild.location}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500">Sponsor</p>
                          <p className="font-bold">{selectedChild.sponsorName || 'Not Assigned'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-2xl border border-slate-200 
                              p-4 shadow-lg">
                  <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    <FilterListIcon className="text-slate-400" />
                    <button
                      onClick={() => setFilterType('all')}
                      className={`
                        px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                        transition-all duration-300
                        ${filterType === 'all'
                          ? 'bg-[#2E8B57] text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }
                      `}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setFilterType('healthcare')}
                      className={`
                        px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                        transition-all duration-300 flex items-center gap-2
                        ${filterType === 'healthcare'
                          ? 'bg-blue-500 text-white'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                        }
                      `}
                    >
                      <MedicalServicesIcon className="text-sm" />
                      Healthcare
                    </button>
                    <button
                      onClick={() => setFilterType('education')}
                      className={`
                        px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                        transition-all duration-300 flex items-center gap-2
                        ${filterType === 'education'
                          ? 'bg-purple-500 text-white'
                          : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
                        }
                      `}
                    >
                      <SchoolIcon className="text-sm" />
                      Education
                    </button>
                    <button
                      onClick={() => setFilterType('nutrition')}
                      className={`
                        px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap
                        transition-all duration-300 flex items-center gap-2
                        ${filterType === 'nutrition'
                          ? 'bg-green-500 text-white'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                        }
                      `}
                    >
                      <RestaurantIcon className="text-sm" />
                      Nutrition
                    </button>
                  </div>
                </div>

                {/* Intervention Timeline */}
                <div className="bg-white rounded-2xl border border-slate-200 
                              p-6 shadow-lg">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold flex items-center gap-2">
                      <HistoryIcon className="text-[#2E8B57]" />
                      Intervention Timeline
                    </h3>
                    <button className="text-[#2E8B57] text-sm font-semibold 
                                     hover:underline flex items-center gap-1">
                      View All
                      <ChevronRightIcon className="text-sm" />
                    </button>
                  </div>
                  
                  {filteredInterventions.length > 0 ? (
                    <InterventionTimeline
                      interventions={filteredInterventions}
                      onViewReceipt={(intervention) => {
                        setSelectedIntervention(intervention);
                        setShowReceiptModal(true);
                      }}
                    />
                  ) : (
                    <div className="text-center py-12">
                      <div className="size-20 mx-auto bg-slate-100 rounded-2xl 
                                    flex items-center justify-center mb-4">
                        <HistoryIcon className="text-3xl text-slate-400" />
                      </div>
                      <p className="text-slate-500 font-medium">No interventions recorded</p>
                      <p className="text-sm text-slate-400 mt-1">
                        Click "Add Intervention" to record the first support activity
                      </p>
                    </div>
                  )}
                </div>

                {/* Accountability Note */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 
                              p-4 rounded-xl border border-blue-200">
                  <div className="flex items-start gap-3">
                    <InfoIcon className="text-blue-600 mt-1" />
                    <div>
                      <p className="text-sm font-semibold text-blue-800">
                        Sponsor Visibility
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        All interventions marked as "Visible to Sponsor" will appear in 
                        real-time on the sponsor's dashboard, ensuring transparency and 
                        accountability.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200 
                            p-12 text-center shadow-lg">
                <div className="size-24 mx-auto bg-[#2E8B57]/10 rounded-3xl 
                              flex items-center justify-center mb-4">
                  <PersonIcon className="text-4xl text-[#2E8B57]" />
                </div>
                <h3 className="text-xl font-bold mb-2">Select a Child</h3>
                <p className="text-slate-500">
                  Choose a child from the list to view and manage their intervention logs
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Add Intervention Modal */}
        {showAddModal && selectedChild && (
          <AddInterventionModal
            child={selectedChild}
            onClose={() => setShowAddModal(false)}
            onSave={handleAddIntervention}
          />
        )}

        {/* Receipt Modal */}
        {showReceiptModal && selectedIntervention && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
                 onClick={() => setShowReceiptModal(false)} />
            <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 animate-slideIn shadow-2xl">
              <button
                onClick={() => setShowReceiptModal(false)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <CloseIcon className="text-slate-500" />
              </button>
              
              <div className="text-center mb-6">
                <div className="size-16 mx-auto mb-4 bg-[#2E8B57]/10 
                              rounded-2xl flex items-center justify-center">
                  {selectedIntervention.receiptType === 'pdf' ? (
                    <PdfIcon className="text-3xl text-red-500" />
                  ) : (
                    <ImageIcon className="text-3xl text-blue-500" />
                  )}
                </div>
                <h3 className="text-2xl font-bold">Digital Receipt</h3>
                <p className="text-slate-500">{selectedIntervention.title}</p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-xl mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500">Date</span>
                  <span className="font-medium">{selectedIntervention.date}</span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-500">Provider</span>
                  <span className="font-medium">{selectedIntervention.provider}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Amount</span>
                  <span className="font-bold text-[#2E8B57]">
                    ${selectedIntervention.amount}
                  </span>
                </div>
              </div>
              
              <div className="bg-amber-50 p-4 rounded-xl">
                <p className="text-sm text-amber-700">
                  This receipt has been verified and stored for accountability purposes.
                </p>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowReceiptModal(false)}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-xl
                           hover:bg-slate-50 transition-colors font-medium text-slate-700"
                >
                  Close
                </button>
                <button
                  className="flex-1 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] 
                           text-white px-4 py-3 rounded-xl font-semibold 
                           hover:shadow-lg transition-all flex items-center 
                           justify-center gap-2 hover:scale-105 active:scale-95"
                >
                  <DownloadIcon className="text-sm" />
                  Download Receipt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterventionLogs;