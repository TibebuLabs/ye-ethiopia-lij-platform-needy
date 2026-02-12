import React, { useState } from 'react';
import { 
  Favorite, 
  Dashboard, 
  ChildCare, 
  Assessment, 
  Payments, 
  Notifications,
  Public,
  AccountBalanceWallet,
  Group,
  Healing,
  History,
  MedicalServices,
  School,
  Restaurant
} from '@mui/icons-material';

interface Child {
  id: number;
  name: string;
  age: number;
  location: string;
  image: string;
  educationProgress: number;
  healthProgress: number;
}

interface Activity {
  id: number;
  icon: React.ReactNode;
  title: string;
  childName: string;
  timestamp: string;
  description: string;
}

const SponsorDashboard: React.FC = () => {
  const [selectedChild, setSelectedChild] = useState<number | null>(null);

  const children: Child[] = [
    {
      id: 1,
      name: 'Abebe Kebede',
      age: 8,
      location: 'Addis Ababa',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCz0-HQEpCvQJPK-g-iDXiTJorPyVm0ST4f9vdzBwPAHGAQiBMApDWj5UeOx5uomY_imqi5KjEW3V8Gzxn1EH8ZNFMyhyrpSsCodC1IfvUSRrAomwTd-mEuok__QP8TYYRvFXAtHBvLUokLAVCy40HKbMePWhjeDeSK9CdgiW6c7O50-nFXeZc8feEBbIctx5Cp7oAQPT85INT5AUuwm73kTk1ZGixyCL1UPGRCHzrhnu3qy85WdfyGEShVHs4oZDg4wwa9vM6vkZk',
      educationProgress: 85,
      healthProgress: 92
    },
    {
      id: 2,
      name: 'Sara Tesfaye',
      age: 6,
      location: 'Bahir Dar',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAJmIRIAjQxleW2_YbrAgCasicT7XvFM0yu7ThO6v57QUiyk8B-W2Q2LRK8TFofoXhk57dGmygvda7kivAxdrxCkZnWiyHYd4sJn7R2mbhlSqbS_m0lYn-tCdhwv_s8dq1OTwpDuKWH_lsgSfoobFFP-hb1NYt3HEVoXUFs4tMvIaEV3cAxGuDWQtVVntpsLf5v59O97fThLQ4siRW1nvLo7zIlGIANIBlX1JE5Otu6S9mj1BHEyekq1ust32pEs0lx3FYT0fLPuNc',
      educationProgress: 60,
      healthProgress: 78
    }
  ];

  const activities: Activity[] = [
    {
      id: 1,
      icon: <MedicalServices className="text-sm" />,
      title: 'Health checkup completed',
      childName: 'Abebe Kebede',
      timestamp: 'Today',
      description: 'Routine quarterly checkup. Results within normal ranges.'
    },
    {
      id: 2,
      icon: <School className="text-sm" />,
      title: 'School supplies delivered',
      childName: 'Sara Tesfaye',
      timestamp: '2 days ago',
      description: 'New textbooks and uniform delivered for the semester.'
    },
    {
      id: 3,
      icon: <Restaurant className="text-sm" />,
      title: 'Nutrition plan updated',
      childName: 'All Children',
      timestamp: '1 week ago',
      description: 'Monthly protein-rich meal plan adjustments implemented.'
    }
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8F9FA] text-[#374151] font-['Inter',_sans-serif]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#2E8B57] rounded-lg flex items-center justify-center">
              <Favorite className="text-white text-sm" />
            </div>
            <span className="text-xl font-bold tracking-tight text-[#2E8B57]">
              Ye Ethiopia Lij
            </span>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <a 
            href="#" 
            className="flex items-center gap-3 px-4 py-3 bg-[#2E8B57] text-white rounded-lg font-medium shadow-sm"
          >
            <Dashboard />
            <span>Dashboard</span>
          </a>
          <a 
            href="#" 
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <ChildCare />
            <span>My Children</span>
          </a>
          <a 
            href="#" 
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Assessment />
            <span>Reports</span>
          </a>
          <a 
            href="#" 
            className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <Payments />
            <span>Payments</span>
          </a>
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs font-semibold text-[#2E8B57] uppercase tracking-wider mb-2">
              Impact Goal
            </p>
            <div className="flex justify-between items-end mb-1">
              <span className="text-sm font-medium">Community Fund</span>
              <span className="text-xs font-bold bg-[#FFD700] px-1.5 rounded">75%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div 
                className="bg-[#2E8B57] h-2 rounded-full transition-all duration-500" 
                style={{ width: '75%' }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-sm border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h1 className="text-lg font-semibold text-[#374151]">Sponsor Overview</h1>
          
          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-[#2E8B57] transition-colors">
              <Notifications />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FFD700] border-2 border-white rounded-full" />
            </button>
            
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="text-sm font-semibold">Ttibebu bunna</p>
                <p className="text-xs text-slate-500">Premium Partner</p>
              </div>
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBaRd-WkizriI0yTtGy3IgtQiW-wpdxs4qeObydkJrxochFlnzjRVOTjKBJxlBn0WuL0ulDbvTkO5qJFHljgv5DFWNQ01est3L9H4OF_hrSP5-7qsYkguzYGlqhHWnyutwlcBt_mia0kLyy33fn5Pw7-d_L8A5Oh3lgY_WCsBK5JgZapjeMzSAZRm6Lebvrh-JoA4rfrN6sE3dRZaMZDRdbWNyB3Me4iGjAAwG5uKofG9c2WyJamQq6LgIyUVWd9V3_TZV1xzhogyU"
                alt="Portrait oftibebu bunna"
                className="w-10 h-10 rounded-full object-cover border-2 border-[#2E8B57]/20"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8">
          {/* Welcome Banner */}
          <div className="relative bg-[#2E8B57] rounded-xl p-8 text-white overflow-hidden mb-8 shadow-lg">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-bold mb-2">Welcome back, Abeba!</h2>
              <p className="text-white/90 leading-relaxed">
                Your support is currently transforming the lives of 3 children in Addis Ababa. 
                Every donation contributes to their future education and holistic health.
              </p>
              <div className="mt-6 flex gap-4">
                <button className="bg-white text-[#2E8B57] px-6 py-2.5 rounded-lg font-bold hover:bg-slate-100 transition-all">
                  Write a Message
                </button>
                <button className="bg-[#2E8B57] border border-white/50 px-6 py-2.5 rounded-lg font-bold hover:bg-white/10 transition-all">
                  Annual Impact Report
                </button>
              </div>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 flex items-center justify-center">
              <Public className="text-[200px]" />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium">Total Donated</span>
                <AccountBalanceWallet className="text-[#2E8B57] bg-[#2E8B57]/10 p-1.5 rounded-lg" />
              </div>
              <p className="text-2xl font-bold">$4,250.00</p>
              <p className="text-xs mt-2 font-bold flex items-center gap-1">
                <span className="bg-[#FFD700] px-1.5 rounded">+12% from last year</span>
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium">Children Sponsored</span>
                <Group className="text-[#2E8B57] bg-[#2E8B57]/10 p-1.5 rounded-lg" />
              </div>
              <p className="text-2xl font-bold">03</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">Active sponsorships</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-500 text-sm font-medium">Active Interventions</span>
                <Healing className="text-[#2E8B57] bg-[#2E8B57]/10 p-1.5 rounded-lg" />
              </div>
              <p className="text-2xl font-bold">12</p>
              <p className="text-xs text-slate-500 mt-2 font-medium">Monthly health checks</p>
            </div>
          </div>

          {/* Children and Activity Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Sponsored Children */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">My Sponsored Children</h3>
                <button className="text-[#2E8B57] text-sm font-bold hover:underline">
                  View All
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {children.map((child) => (
                  <div 
                    key={child.id}
                    className={`bg-white rounded-xl overflow-hidden border shadow-sm transition-all
                              ${selectedChild === child.id 
                                ? 'border-[#2E8B57] ring-2 ring-[#2E8B57]/20' 
                                : 'border-slate-100 hover:border-[#2E8B57]/30'}`}
                    onClick={() => setSelectedChild(child.id)}
                  >
                    <div className="relative h-48">
                      <img 
                        src={child.image} 
                        alt={child.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-4 left-4 text-white">
                        <h4 className="font-bold text-lg">{child.name}</h4>
                        <p className="text-sm opacity-90">Age: {child.age} • {child.location}</p>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wider">
                            <span className="text-slate-500">Education Goal</span>
                            <span className="text-[#2E8B57]">{child.educationProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div 
                              className="bg-[#2E8B57] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${child.educationProgress}%` }}
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wider">
                            <span className="text-slate-500">Health Goal</span>
                            <span className="text-[#2E8B57]">{child.healthProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2">
                            <div 
                              className="bg-[#2E8B57] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${child.healthProgress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <button className="w-full mt-6 py-2.5 text-sm font-bold border-2 border-[#2E8B57] 
                                       text-[#2E8B57] hover:bg-[#2E8B57] hover:text-white 
                                       rounded-lg transition-all">
                        View Updates
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Timeline */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Activity Timeline</h3>
                <History className="text-slate-400" />
              </div>

              <div className="bg-white rounded-xl p-6 border border-slate-100 shadow-sm">
                <div className="space-y-6">
                  {activities.map((activity, index) => (
                    <div key={activity.id} className="flex gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 bg-[#2E8B57]/10 rounded-full flex items-center justify-center text-[#2E8B57]">
                          {activity.icon}
                        </div>
                        {index < activities.length - 1 && (
                          <div className="absolute top-10 bottom-[-24px] left-1/2 -translate-x-1/2 w-0.5 bg-slate-100" />
                        )}
                      </div>
                      
                      <div>
                        <p className="text-sm font-bold">{activity.title}</p>
                        <p className="text-xs text-slate-500 mb-1">
                          {activity.childName} • {activity.timestamp}
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {activity.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-8 py-2 text-xs font-bold text-slate-500 
                                 uppercase tracking-widest hover:text-[#2E8B57] transition-colors">
                  View Full History
                </button>
              </div>

              {/* CTA Card */}
              <div className="mt-8 p-6 bg-[#2E8B57] rounded-xl text-white shadow-lg">
                <h4 className="font-bold text-lg mb-2">Want to do more?</h4>
                <p className="text-sm text-white/90 mb-6">
                  Start a new intervention for community clean water projects in rural districts.
                </p>
                <button className="w-full bg-[#FFD700] text-[#374151] py-3 rounded-lg 
                                 font-bold text-sm shadow-md hover:brightness-105 transition-all">
                  Contribute Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SponsorDashboard;