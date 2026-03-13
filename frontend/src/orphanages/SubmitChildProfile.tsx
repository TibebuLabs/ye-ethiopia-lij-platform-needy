import React, { useState } from 'react';
import {
  ChildCare as ChildCareIcon,
  ArrowBack as ArrowBackIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Close as CloseIcon,
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  LocationOn as LocationIcon,
  Translate as TranslateIcon,
  Description as DescriptionIcon,
  Image as ImageIcon,
  Upload as UploadIcon,
  Info as InfoIcon,
  School as SchoolIcon,
  MedicalServices as MedicalServicesIcon,
  Restaurant as RestaurantIcon,
  MenuBook as MenuBookIcon,
  SportsSoccer as SportsSoccerIcon,
  MusicNote as MusicNoteIcon,
  Brush as BrushIcon,
  Science as ScienceIcon,
  Publish as PublishIcon
} from '@mui/icons-material';

// ============== Types and Interfaces ==============

interface ChildFormData {
  // Basic Information
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender: 'male' | 'female' | '';
  
  // Demographics
  region: string;
  city: string;
  subCity: string;
  woreda: string;
  kebele: string;
  houseNumber: string;
  
  // Biography
  backgroundStory: string;
  interests: string[];
  
  // Needs Assessment
  needs: string[];
  
  // Caregiver Information
  caregiverName: string;
  caregiverRelationship: string;
  caregiverPhone: string;
  
  // Organization Information
  organizationName: string;
  organizationId: string;
  staffName: string;
  staffId: string;
  
  // Documents
  photos: File[];
  documents: File[];
}

interface DuplicateAlert {
  id: number;
  childName: string;
  organization: string;
  age: number;
  location: string;
  matchPercentage: number;
}

interface SubmitChildProfileProps {
  onNavigate?: (page: string) => void;
}

// ============== Duplicate Alert Modal Component ==============

interface DuplicateAlertModalProps {
  duplicates: DuplicateAlert[];
  onClose: () => void;
  onProceed: () => void;
  onViewExisting: (id: number) => void;
}

const DuplicateAlertModal: React.FC<DuplicateAlertModalProps> = ({ 
  duplicates, 
  onClose, 
  onProceed,
  onViewExisting 
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-2xl w-full p-6 animate-slideIn shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <CloseIcon className="text-slate-500" />
        </button>
        
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-amber-100 rounded-2xl flex items-center justify-center">
            <WarningIcon className="text-amber-600 text-4xl" />
          </div>
          <h3 className="text-2xl font-bold text-amber-700">
            Duplicate Record Alert
          </h3>
          <p className="text-slate-500 mt-2">
            The system found potential matches with existing child profiles.
            This child may already be registered.
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          <p className="text-sm font-semibold text-slate-700">
            Potential matches found ({duplicates.length}):
          </p>
          
          {duplicates.map((dup) => (
            <div 
              key={dup.id}
              className="p-4 bg-amber-50 rounded-xl border border-amber-200"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-bold text-slate-900">
                    {dup.childName}
                  </p>
                  <p className="text-sm text-slate-600">
                    {dup.age} years • {dup.location}
                  </p>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">
                  {dup.matchPercentage}% Match
                </span>
              </div>
              
              <p className="text-xs text-slate-500 mb-3">
                Registered by: {dup.organization}
              </p>
              
              <button
                onClick={() => onViewExisting(dup.id)}
                className="text-[#2E8B57] text-sm font-semibold hover:underline
                         flex items-center gap-1"
              >
                View Existing Record
                <ArrowBackIcon className="text-sm rotate-180" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="bg-blue-50 p-4 rounded-xl mb-6">
          <p className="text-sm text-blue-700">
            <span className="font-bold">Policy Note:</span> To prevent double sponsorship, 
            the system blocks duplicate registrations. If you're sure this is a different child, 
            you can proceed with additional verification.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl
                     hover:bg-slate-50 transition-colors font-medium"
          >
            Cancel Registration
          </button>
          <button
            onClick={onProceed}
            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white 
                     px-4 py-3 rounded-xl font-semibold transition-all 
                     hover:scale-105 active:scale-95 shadow-lg shadow-amber-500/20"
          >
            Proceed Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

// ============== Success Modal Component ==============

interface SuccessModalProps {
  childName: string;
  onClose: () => void;
  onViewStatus: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ childName, onClose, onViewStatus }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl max-w-md w-full p-6 animate-slideIn shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#2E8B57] to-[#3CB371] 
                        rounded-2xl flex items-center justify-center">
            <CheckCircleIcon className="text-white text-4xl" />
          </div>
          <h3 className="text-2xl font-bold text-[#2E8B57]">Submission Successful!</h3>
          <p className="text-slate-500 mt-2">
            {childName}'s profile has been submitted successfully.
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-xl mb-6">
          <p className="text-sm text-blue-700">
            <span className="font-bold">Status:</span> Pending Administrative Review
          </p>
          <p className="text-xs text-blue-600 mt-2">
            The system has saved the child profile and set its status to "Pending" for 
            administrator review. You'll be notified once the review is complete.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-slate-200 rounded-xl
                     hover:bg-slate-50 transition-colors font-medium"
          >
            Submit Another
          </button>
          <button
            onClick={onViewStatus}
            className="flex-1 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] 
                     text-white px-4 py-3 rounded-xl font-semibold 
                     hover:shadow-lg transition-all duration-300
                     hover:scale-105 active:scale-95"
          >
            View Status
          </button>
        </div>
      </div>
    </div>
  );
};

// ============== Main SubmitChildProfile Component ==============

const SubmitChildProfile: React.FC<SubmitChildProfileProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<ChildFormData>({
    fullName: '',
    dateOfBirth: '',
    age: 0,
    gender: '',
    region: '',
    city: '',
    subCity: '',
    woreda: '',
    kebele: '',
    houseNumber: '',
    backgroundStory: '',
    interests: [],
    needs: [],
    caregiverName: '',
    caregiverRelationship: '',
    caregiverPhone: '',
    organizationName: 'St. Gabriel Center',
    organizationId: 'ORG-2024-0081',
    staffName: 'Abeba Tesfaye',
    staffId: 'ET-550',
    photos: [],
    documents: []
  });

  const [showDuplicateAlert, setShowDuplicateAlert] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock duplicate detection data
  const [duplicates] = useState<DuplicateAlert[]>([
    {
      id: 101,
      childName: 'Samuel Okecho',
      organization: 'Compassion Intl.',
      age: 8,
      location: 'Kampala Central',
      matchPercentage: 95
    },
    {
      id: 102,
      childName: 'Samuel Peter',
      organization: 'Save the Children',
      age: 7,
      location: 'Kampala',
      matchPercentage: 82
    }
  ]);

  const needsOptions = [
    { id: 'education', label: 'Education', icon: SchoolIcon },
    { id: 'healthcare', label: 'Healthcare', icon: MedicalServicesIcon },
    { id: 'nutrition', label: 'Nutrition', icon: RestaurantIcon },
    { id: 'school_supplies', label: 'School Supplies', icon: MenuBookIcon },
    { id: 'uniform', label: 'Uniform', icon: PersonIcon },
    { id: 'books', label: 'Books', icon: MenuBookIcon }
  ];

  const interestOptions = [
    { id: 'math', label: 'Math', icon: ScienceIcon },
    { id: 'science', label: 'Science', icon: ScienceIcon },
    { id: 'reading', label: 'Reading', icon: MenuBookIcon },
    { id: 'sports', label: 'Sports', icon: SportsSoccerIcon },
    { id: 'art', label: 'Art', icon: BrushIcon },
    { id: 'music', label: 'Music', icon: MusicNoteIcon }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-calculate age from date of birth
    if (name === 'dateOfBirth') {
      const birthDate = new Date(value);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData(prev => ({ ...prev, age }));
    }
  };

  const handleNeedToggle = (needId: string) => {
    setFormData(prev => ({
      ...prev,
      needs: prev.needs.includes(needId)
        ? prev.needs.filter(n => n !== needId)
        : [...prev.needs, needId]
    }));
  };

  const handleInterestToggle = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(i => i !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'photos' | 'documents') => {
    if (e.target.files) {
      setFormData(prev => ({
        ...prev,
        [type]: Array.from(e.target.files || [])
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    switch(step) {
      case 1: // Basic Information
        return !!(
          formData.fullName &&
          formData.dateOfBirth &&
          formData.gender
        );
      case 2: // Location & Demographics
        return !!(
          formData.region &&
          formData.city &&
          formData.woreda
        );
      case 3: // Biography & Needs
        return !!(
          formData.backgroundStory &&
          formData.needs.length > 0
        );
      case 4: // Caregiver Information
        return !!(
          formData.caregiverName &&
          formData.caregiverRelationship &&
          formData.caregiverPhone
        );
      case 5: // Documents
        return formData.photos.length > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Simulate API call and duplicate check
    setTimeout(() => {
      setIsSubmitting(false);
      
      // Show duplicate alert if matches found (simulated)
      if (formData.fullName.toLowerCase().includes('samuel')) {
        setShowDuplicateAlert(true);
      } else {
        // No duplicates found - show success
        setShowSuccessModal(true);
      }
    }, 1500);
  };

  const handleProceedWithDuplicate = () => {
    setShowDuplicateAlert(false);
    setShowSuccessModal(true);
  };

  const getStepTitle = (step: number) => {
    switch(step) {
      case 1: return 'Basic Information';
      case 2: return 'Location & Demographics';
      case 3: return 'Biography & Needs Assessment';
      case 4: return 'Caregiver Information';
      case 5: return 'Documents & Photos';
      default: return '';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[#F8F9FA]">
      <div className="p-4 lg:p-8 max-w-4xl mx-auto w-full">
        {/* Header with Back Button */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm font-medium mb-2">
            <button 
              onClick={() => onNavigate?.('dashboard')}
              className="text-[#2E8B57] hover:underline flex items-center gap-1"
            >
              <ArrowBackIcon className="text-sm" />
              Dashboard
            </button>
          </div>
          
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black bg-gradient-to-r from-[#2E8B57] 
                           to-[#3CB371] bg-clip-text text-transparent mb-2">
                Submit New Child Profile
              </h1>
              <p className="text-slate-500">
                Register a new child for sponsorship (UC-03)
              </p>
            </div>
            
            <div className="bg-blue-50 px-4 py-2 rounded-xl">
              <p className="text-sm text-blue-700 flex items-center gap-2">
                <InfoIcon className="text-sm" />
                Staff ID: <span className="font-bold">ET-550</span>
              </p>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div className={`
                  w-10 h-10 rounded-2xl flex items-center justify-center font-semibold
                  transition-all duration-300
                  ${currentStep >= step 
                    ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white shadow-lg' 
                    : 'bg-white text-slate-400 border-2 border-slate-200'
                  }
                  ${currentStep === step ? 'scale-110' : ''}
                `}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`
                    flex-1 h-1 mx-2 rounded transition-all duration-500
                    ${currentStep > step 
                      ? 'bg-gradient-to-r from-[#2E8B57] to-[#3CB371]' 
                      : 'bg-slate-200'
                    }
                  `} />
                )}
              </div>
            ))}
          </div>
          <p className="text-center mt-4 text-sm font-medium text-[#2E8B57]">
            Step {currentStep} of 5: {getStepTitle(currentStep)}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden
                      hover:shadow-2xl transition-all duration-500">
          
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="p-6 lg:p-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <PersonIcon className="text-[#2E8B57]" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57] 
                             focus:border-transparent transition-all"
                    placeholder="Enter child's full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57] 
                             focus:border-transparent transition-all"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Age (calculated)
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    className="w-full px-4 py-3 bg-slate-100 rounded-xl border border-slate-200
                             cursor-not-allowed"
                    disabled
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57] 
                             focus:border-transparent transition-all"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Location & Demographics */}
          {currentStep === 2 && (
            <div className="p-6 lg:p-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <LocationIcon className="text-[#2E8B57]" />
                Location & Demographics
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Region <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57] 
                             focus:border-transparent"
                    placeholder="e.g., Kampala"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57] 
                             focus:border-transparent"
                    placeholder="e.g., Kampala Central"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sub-City
                  </label>
                  <input
                    type="text"
                    name="subCity"
                    value={formData.subCity}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57] 
                             focus:border-transparent"
                    placeholder="e.g., Nakawa"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Woreda <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="woreda"
                    value={formData.woreda}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57] 
                             focus:border-transparent"
                    placeholder="e.g., Woreda 8"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Kebele
                  </label>
                  <input
                    type="text"
                    name="kebele"
                    value={formData.kebele}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57] 
                             focus:border-transparent"
                    placeholder="e.g., Kebele 03"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    House Number
                  </label>
                  <input
                    type="text"
                    name="houseNumber"
                    value={formData.houseNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57] 
                             focus:border-transparent"
                    placeholder="e.g., H-245"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Biography & Needs Assessment */}
          {currentStep === 3 && (
            <div className="p-6 lg:p-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <DescriptionIcon className="text-[#2E8B57]" />
                Biography & Needs Assessment
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Background Story <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="backgroundStory"
                  value={formData.backgroundStory}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                           focus:outline-none focus:ring-2 focus:ring-[#2E8B57] 
                           focus:border-transparent resize-none"
                  placeholder="Tell us about the child's background, family situation, and dreams..."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Needs Assessment <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {needsOptions.map((need) => (
                    <button
                      key={need.id}
                      type="button"
                      onClick={() => handleNeedToggle(need.id)}
                      className={`
                        p-4 rounded-xl border-2 transition-all duration-300
                        flex items-center gap-3
                        ${formData.needs.includes(need.id)
                          ? 'border-[#2E8B57] bg-[#2E8B57]/5'
                          : 'border-slate-200 hover:border-[#2E8B57]/30'
                        }
                      `}
                    >
                      <need.icon className={`
                        text-xl
                        ${formData.needs.includes(need.id)
                          ? 'text-[#2E8B57]'
                          : 'text-slate-400'
                        }
                      `} />
                      <span className="text-sm font-medium">{need.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Interests (Optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {interestOptions.map((interest) => (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => handleInterestToggle(interest.id)}
                      className={`
                        p-4 rounded-xl border transition-all duration-300
                        flex items-center gap-3
                        ${formData.interests.includes(interest.id)
                          ? 'border-[#2E8B57] bg-[#2E8B57]/5'
                          : 'border-slate-200 hover:border-[#2E8B57]/30'
                        }
                      `}
                    >
                      <interest.icon className={`
                        text-xl
                        ${formData.interests.includes(interest.id)
                          ? 'text-[#2E8B57]'
                          : 'text-slate-400'
                        }
                      `} />
                      <span className="text-sm font-medium">{interest.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Caregiver Information */}
          {currentStep === 4 && (
            <div className="p-6 lg:p-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <PersonIcon className="text-[#2E8B57]" />
                Caregiver Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Caregiver Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="caregiverName"
                    value={formData.caregiverName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57] 
                             focus:border-transparent"
                    placeholder="Enter caregiver's full name"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Relationship to Child <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="caregiverRelationship"
                    value={formData.caregiverRelationship}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57] 
                             focus:border-transparent"
                    placeholder="e.g., Mother, Father, Guardian"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="caregiverPhone"
                    value={formData.caregiverPhone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-slate-50 rounded-xl border border-slate-200
                             focus:outline-none focus:ring-2 focus:ring-[#2E8B57] 
                             focus:border-transparent"
                    placeholder="e.g., +251 912 345 678"
                    required
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-xl">
                <p className="text-sm text-blue-700 flex items-center gap-2">
                  <InfoIcon className="text-sm" />
                  Organization: {formData.organizationName} (ID: {formData.organizationId})
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  Staff: {formData.staffName} (ID: {formData.staffId})
                </p>
              </div>
            </div>
          )}

          {/* Step 5: Documents & Photos */}
          {currentStep === 5 && (
            <div className="p-6 lg:p-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="text-[#2E8B57]" />
                Documents & Photos
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Child Photos <span className="text-red-500">*</span>
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center
                              hover:border-[#2E8B57] transition-colors duration-300">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'photos')}
                    className="hidden"
                    id="photo-upload"
                  />
                  <label htmlFor="photo-upload" className="cursor-pointer">
                    <UploadIcon className="text-4xl text-slate-400 mb-3 mx-auto" />
                    <p className="text-sm text-slate-500 mb-2">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-slate-400">
                      PNG, JPG up to 10MB (Max 5 photos)
                    </p>
                  </label>
                </div>
                {formData.photos.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.photos.length} photo(s) selected
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Supporting Documents
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center
                              hover:border-[#2E8B57] transition-colors duration-300">
                  <input
                    type="file"
                    multiple
                    onChange={(e) => handleFileUpload(e, 'documents')}
                    className="hidden"
                    id="document-upload"
                  />
                  <label htmlFor="document-upload" className="cursor-pointer">
                    <DescriptionIcon className="text-4xl text-slate-400 mb-3 mx-auto" />
                    <p className="text-sm text-slate-500 mb-2">
                      Upload birth certificate, health records, etc.
                    </p>
                    <p className="text-xs text-slate-400">
                      PDF, DOC up to 20MB
                    </p>
                  </label>
                </div>
                {formData.documents.length > 0 && (
                  <p className="text-sm text-green-600 mt-2">
                    ✓ {formData.documents.length} document(s) selected
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form Navigation */}
          <div className="p-6 lg:p-8 bg-slate-50 border-t border-slate-200 flex justify-between">
            {currentStep > 1 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 border border-slate-200 rounded-xl hover:bg-white 
                         transition-all font-medium flex items-center gap-2
                         hover:scale-105 active:scale-95"
              >
                <ArrowBackIcon className="text-sm" />
                Previous
              </button>
            )}
            
            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                className="ml-auto px-6 py-3 bg-gradient-to-r from-[#2E8B57] 
                         to-[#3CB371] text-white rounded-xl font-semibold 
                         hover:shadow-lg transition-all hover:scale-105 
                         active:scale-95 flex items-center gap-2"
              >
                Next Step
                <ArrowBackIcon className="text-sm rotate-180" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="ml-auto px-8 py-3 bg-gradient-to-r from-[#2E8B57] 
                         to-[#3CB371] text-white rounded-xl font-semibold 
                         hover:shadow-lg transition-all hover:scale-105 
                         active:scale-95 disabled:opacity-50 
                         disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <PublishIcon className="text-sm" />
                    Submit Profile
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Policy Note */}
        <div className="mt-6 bg-gradient-to-r from-amber-50 to-orange-50 p-4 rounded-xl border border-amber-200">
          <div className="flex items-start gap-3">
            <InfoIcon className="text-amber-600 mt-1" />
            <div>
              <p className="text-sm font-semibold text-amber-800">
                Duplicate Prevention Policy
              </p>
              <p className="text-xs text-amber-700 mt-1">
                The system will automatically check for duplicate records upon submission. 
                If a match is found, you'll be alerted to prevent double sponsorship.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Duplicate Alert Modal */}
      {showDuplicateAlert && (
        <DuplicateAlertModal
          duplicates={duplicates}
          onClose={() => setShowDuplicateAlert(false)}
          onProceed={handleProceedWithDuplicate}
          onViewExisting={(id) => {
            setShowDuplicateAlert(false);
            alert(`Viewing existing record #${id}`);
          }}
        />
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          childName={formData.fullName || 'Child'}
          onClose={() => {
            setShowSuccessModal(false);
            setFormData({
              fullName: '',
              dateOfBirth: '',
              age: 0,
              gender: '',
              region: '',
              city: '',
              subCity: '',
              woreda: '',
              kebele: '',
              houseNumber: '',
              backgroundStory: '',
              interests: [],
              needs: [],
              caregiverName: '',
              caregiverRelationship: '',
              caregiverPhone: '',
              organizationName: 'St. Gabriel Center',
              organizationId: 'ORG-2024-0081',
              staffName: 'Abeba Tesfaye',
              staffId: 'ET-550',
              photos: [],
              documents: []
            });
            setCurrentStep(1);
          }}
          onViewStatus={() => {
            setShowSuccessModal(false);
            onNavigate?.('submissions');
          }}
        />
      )}
    </div>
  );
};

export default SubmitChildProfile;