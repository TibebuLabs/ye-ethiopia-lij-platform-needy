export interface Child {
  id: number;
  name: string;
  age: number;
  location: string;
  image: string;
  educationProgress: number;
  healthProgress: number;
  nutritionProgress?: number;
  lastUpdate?: string;
  status?: 'active' | 'pending' | 'completed';
  sponsorSince?: string;
  nextPayment?: string;
  monthlyContribution?: number;
}

export interface Activity {
  id: number;
  icon: React.ReactNode;
  title: string;
  childName: string;
  timestamp: string;
  description: string;
  type: 'health' | 'education' | 'nutrition' | 'payment' | 'general';
}

export interface Payment {
  id: number;
  date: string;
  amount: number;
  childId: number;
  childName: string;
  status: 'success' | 'pending' | 'failed';
  paymentMethod: string;
  transactionId: string;
}

export interface Report {
  id: number;
  childId: number;
  childName: string;
  month: string;
  year: number;
  type: 'monthly' | 'quarterly' | 'annual';
  education: {
    attendance: number;
    grades: number;
    teacherComments: string;
    suppliesProvided: string[];
  };
  health: {
    checkups: number;
    vaccinations: string[];
    height: number;
    weight: number;
    notes: string;
  };
  nutrition: {
    mealsProvided: number;
    dietaryNeeds: string;
    progress: string;
  };
  downloadUrl: string;
}

export interface SponsorStats {
  totalDonated: number;
  childrenSponsored: number;
  activeInterventions: number;
  impactScore: number;
  monthlyChange: number;
}