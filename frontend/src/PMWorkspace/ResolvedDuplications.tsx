// ============== ResolvedDuplications.tsx ==============
import React, { useState } from 'react';
import {
  Layers as LayersIcon,
  Search as SearchIcon,
  Download as DownloadIcon,
  AddCircle as AddCircleIcon,
  Close as CloseIcon,
  Compare as CompareIcon,
  Merge as MergeIcon,
  VerifiedUser as VerifiedUserIcon,
  Report as ReportIcon,
  CalendarToday as CalendarIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  ExpandMore as ExpandMoreIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';

// ============== Types and Interfaces ==============

interface ResolutionItem {
  id: number;
  childName: string;
  childId: string;
  matchScore: number;
  sourceNgo: string;
  status: 'pending' | 'flagged' | 'resolved';
  image: string;
  masterRecord: {
    name: string;
    dob: string;
    guardian: string;
    location: string;
    image: string;
  };
  conflictRecord: {
    name: string;
    dob: string;
    guardian: string;
    location: string;
    image: string;
  };
  confidenceIndicators: {
    biometric: boolean;
    nameSimilarity: number;
    ngoProximity: string;
  };
  conflictContext: string;
}

// ============== ResolutionQueue Component ==============

interface ResolutionQueueProps {
  selectedItem: ResolutionItem | null;
  onSelectItem: (item: ResolutionItem) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const ResolutionQueue: React.FC<ResolutionQueueProps> = ({ selectedItem, onSelectItem, searchTerm, setSearchTerm }) => {
  const [filterScore, setFilterScore] = useState('all');
  const [filterNgo, setFilterNgo] = useState('all');

  const resolutionItems: ResolutionItem[] = [
    {
      id: 1,
      childName: 'John Doe',
      childId: '#RE-9920',
      matchScore: 94,
      sourceNgo: 'Global Hope International',
      status: 'pending',
      image: 'https://i.pravatar.cc/150?img=1',
      masterRecord: {
        name: 'John D. Doe',
        dob: '12 Mar 2018',
        guardian: 'Alice Doe',
        location: 'Kajiado Central',
        image: 'https://i.pravatar.cc/150?img=2'
      },
      conflictRecord: {
        name: 'Johnathan Doe',
        dob: '12 Mar 2018',
        guardian: 'Alice D. Doe',
        location: 'Kajiado (West)',
        image: 'https://i.pravatar.cc/150?img=3'
      },
      confidenceIndicators: {
        biometric: true,
        nameSimilarity: 98,
        ngoProximity: '8.2km Radius'
      },
      conflictContext: 'Detected by AI Engine v4.2 at 09:44 AM today. The incoming record was submitted via Mobile Uplink by Global Hope International agent "M. Obasi".'
    },
    {
      id: 2,
      childName: 'Jane Smith',
      childId: '#RE-4412',
      matchScore: 88,
      sourceNgo: 'ChildFirst NGO',
      status: 'flagged',
      image: 'https://i.pravatar.cc/150?img=4',
      masterRecord: {
        name: 'Jane M. Smith',
        dob: '23 Jun 2017',
        guardian: 'Robert Smith',
        location: 'Nairobi West',
        image: 'https://i.pravatar.cc/150?img=5'
      },
      conflictRecord: {
        name: 'Jane Smith',
        dob: '23 Jun 2017',
        guardian: 'R. Smith',
        location: 'Nairobi',
        image: 'https://i.pravatar.cc/150?img=6'
      },
      confidenceIndicators: {
        biometric: false,
        nameSimilarity: 95,
        ngoProximity: '5.5km Radius'
      },
      conflictContext: 'Flagged due to incomplete biometric data. Requires manual verification.'
    },
    {
      id: 3,
      childName: 'Robert Chen',
      childId: '#RE-2109',
      matchScore: 91,
      sourceNgo: 'Unity Relief Foundation',
      status: 'pending',
      image: 'https://i.pravatar.cc/150?img=7',
      masterRecord: {
        name: 'Robert Chen',
        dob: '05 Nov 2016',
        guardian: 'Mei Chen',
        location: 'Mombasa',
        image: 'https://i.pravatar.cc/150?img=8'
      },
      conflictRecord: {
        name: 'Robert C. Chen',
        dob: '05 Nov 2016',
        guardian: 'Mei Chen',
        location: 'Mombasa Central',
        image: 'https://i.pravatar.cc/150?img=9'
      },
      confidenceIndicators: {
        biometric: true,
        nameSimilarity: 97,
        ngoProximity: '2.1km Radius'
      },
      conflictContext: 'High confidence match. Records show same guardian information.'
    }
  ];

  const filteredItems = resolutionItems.filter(item => {
    const matchesSearch = item.childName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.childId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sourceNgo.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesScore = filterScore === 'all' || 
      (filterScore === 'high' && item.matchScore > 90) ||
      (filterScore === 'medium' && item.matchScore >= 80 && item.matchScore <= 90) ||
      (filterScore === 'low' && item.matchScore < 80);
    
    const matchesNgo = filterNgo === 'all' || item.sourceNgo === filterNgo;

    return matchesSearch && matchesScore && matchesNgo;
  });

  const ngos = ['all', ...new Set(resolutionItems.map(item => item.sourceNgo))];

  const getMatchScoreBadge = (score: number) => {
    if (score >= 90) {
      return { bg: 'bg-[#FFD700]/20', text: 'text-[#FFD700]', label: `${score}%` };
    }
    return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', label: `${score}%` };
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending': return { bg: 'bg-amber-100 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', label: 'Pending Review' };
      case 'flagged': return { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', label: 'Flagged' };
      case 'resolved': return { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', label: 'Resolved' };
      default: return { bg: 'bg-slate-100', text: 'text-slate-600', label: status };
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-3xl font-black bg-gradient-to-r from-[#2E8B57] to-[#3CB371] bg-clip-text text-transparent">
            Resolved Duplication Alert Queue
          </h2>
          <p className="text-slate-500 mt-1">Reviewing {filteredItems.length} flagged potential duplicates for immediate resolution.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hover:scale-105 active:scale-95">
            <DownloadIcon className="text-sm" /> Export Report
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#2E8B57]/20 hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300">
            <AddCircleIcon className="text-sm" /> Manual Search
          </button>
        </div>
      </header>

      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg flex flex-wrap gap-4 items-center mb-6">
        <div className="flex-1 min-w-[300px] relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
          <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by child name, ID, or NGO..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20 placeholder:text-slate-400" />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select value={filterScore} onChange={(e) => setFilterScore(e.target.value)} className="appearance-none px-4 py-2.5 pr-10 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20 cursor-pointer">
              <option value="all">Match Score: All</option>
              <option value="high">Match Score &gt; 90%</option>
              <option value="medium">Match Score 80-90%</option>
              <option value="low">Match Score &lt; 80%</option>
            </select>
            <ExpandMoreIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm" />
          </div>
          <div className="relative">
            <select value={filterNgo} onChange={(e) => setFilterNgo(e.target.value)} className="appearance-none px-4 py-2.5 pr-10 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2E8B57]/20 cursor-pointer">
              {ngos.map((ngo, index) => (
                <option key={index} value={ngo}>{ngo === 'all' ? 'NGO: All' : ngo}</option>
              ))}
            </select>
            <ExpandMoreIcon className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-sm" />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex-1">
        <div className="overflow-x-auto h-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 sticky top-0">
              <tr>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Child Name</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Match Score</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Source NGO</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredItems.map((item) => {
                const scoreBadge = getMatchScoreBadge(item.matchScore);
                const statusBadge = getStatusBadge(item.status);
                return (
                  <tr key={item.id} onClick={() => onSelectItem(item)} className={`hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all duration-300 cursor-pointer group ${selectedItem?.id === item.id ? 'bg-[#2E8B57]/5 dark:bg-[#2E8B57]/10 border-l-4 border-[#2E8B57]' : ''}`}>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-700 group-hover:border-[#2E8B57] transition-colors">
                          <img src={item.image} alt={item.childName} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#2E8B57] transition-colors">{item.childName}</p>
                          <p className="text-xs text-slate-500 font-mono">{item.childId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-black ${scoreBadge.bg} ${scoreBadge.text}`}>{scoreBadge.label}</span>
                    </td>
                    <td className="px-6 py-5"><span className="text-sm font-medium text-slate-600 dark:text-slate-400">{item.sourceNgo}</span></td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold ${statusBadge.bg} ${statusBadge.text}`}>{statusBadge.label}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button onClick={(e) => { e.stopPropagation(); onSelectItem(item); }} className="text-[#2E8B57] hover:text-[#3CB371] text-xs font-bold transition-all hover:scale-105 active:scale-95">View Comparison</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredItems.length === 0 && <div className="text-center py-12"><p className="text-slate-500">No items match your filters</p></div>}
        </div>
      </div>
    </div>
  );
};

// ============== ComparisonPanel Component ==============

interface ComparisonPanelProps {
  item: ResolutionItem | null;
  onClose: () => void;
  onMerge: (id: number) => void;
  onApprove: (id: number) => void;
  onFlag: (id: number) => void;
}

const ComparisonPanel: React.FC<ComparisonPanelProps> = ({ item, onClose, onMerge, onApprove, onFlag }) => {
  if (!item) {
    return (
      <div className="w-[500px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8">
        <LayersIcon className="text-6xl text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-300 mb-2">No Item Selected</h3>
        <p className="text-sm text-slate-500 text-center">Select an item from the queue to view comparison details</p>
      </div>
    );
  }

  return (
    <div className="w-[500px] border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col h-full overflow-y-auto">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 sticky top-0 z-10">
        <h3 className="font-bold text-lg flex items-center gap-2"><CompareIcon className="text-[#FFD700]" /> Conflict Comparison</h3>
        <button onClick={onClose} className="size-8 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-center transition-all hover:scale-110">
          <CloseIcon className="text-slate-500 text-sm" />
        </button>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="size-20 rounded-full border-2 border-slate-200 dark:border-slate-700 p-1 mb-2">
                <img src={item.masterRecord.image} alt="Master Record" className="w-full h-full rounded-full object-cover grayscale" />
              </div>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-widest">Master Record</span>
              <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">{item.masterRecord.name}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3">
              <div><label className="text-[10px] uppercase font-bold text-slate-400">Date of Birth</label><p className="text-xs font-medium text-slate-900 dark:text-white">{item.masterRecord.dob}</p></div>
              <div><label className="text-[10px] uppercase font-bold text-slate-400">Guardian Name</label><p className="text-xs font-medium text-slate-900 dark:text-white">{item.masterRecord.guardian}</p></div>
              <div><label className="text-[10px] uppercase font-bold text-slate-400">Village/Region</label><p className="text-xs font-medium text-slate-900 dark:text-white">{item.masterRecord.location}</p></div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col items-center">
              <div className="size-20 rounded-full border-2 border-[#FFD700] p-1 mb-2 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
                <img src={item.conflictRecord.image} alt="Conflict Record" className="w-full h-full rounded-full object-cover" />
              </div>
              <span className="text-[10px] uppercase font-bold text-[#FFD700] tracking-widest">Incoming Conflict</span>
              <p className="font-bold text-sm text-[#FFD700] mt-1">{item.conflictRecord.name}</p>
            </div>
            <div className="bg-[#FFD700]/5 dark:bg-[#FFD700]/10 p-4 rounded-xl border border-[#FFD700]/20 space-y-3">
              <div><label className="text-[10px] uppercase font-bold text-slate-400">Date of Birth</label><p className="text-xs font-medium text-[#FFD700]">{item.conflictRecord.dob}</p></div>
              <div><label className="text-[10px] uppercase font-bold text-slate-400">Guardian Name</label><p className="text-xs font-medium text-[#FFD700]">{item.conflictRecord.guardian}</p></div>
              <div><label className="text-[10px] uppercase font-bold text-slate-400">Village/Region</label><p className="text-xs font-medium text-slate-900 dark:text-white">{item.conflictRecord.location}</p></div>
            </div>
          </div>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-xl p-5">
          <h4 className="text-xs font-bold uppercase text-slate-500 mb-3">Confidence Indicators</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">Biometric Match</span>
              <span className={`font-bold flex items-center gap-1 ${item.confidenceIndicators.biometric ? 'text-[#2E8B57]' : 'text-red-500'}`}>
                {item.confidenceIndicators.biometric ? <><CheckCircleIcon className="text-sm" /> Confirmed</> : <><ErrorIcon className="text-sm" /> Pending</>}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">Name Phonetic (Soundex)</span>
              <span className="font-bold text-[#FFD700]">{item.confidenceIndicators.nameSimilarity}% Similarity</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-600 dark:text-slate-400">NGO Proximity</span>
              <span className="font-medium text-slate-500">{item.confidenceIndicators.ngoProximity}</span>
            </div>
          </div>
        </div>

        <div className="pt-4 space-y-3">
          <button onClick={() => onMerge(item.id)} className="w-full py-3.5 bg-gradient-to-r from-[#2E8B57] to-[#3CB371] text-white rounded-xl font-bold text-sm hover:shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 relative overflow-hidden group">
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <MergeIcon className="text-sm" /> MERGE INTO MASTER
          </button>
          <button onClick={() => onApprove(item.id)} className="w-full py-3.5 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white rounded-xl font-bold text-sm hover:bg-slate-300 dark:hover:bg-slate-700 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
            <VerifiedUserIcon className="text-sm" /> APPROVE AS UNIQUE
          </button>
          <button onClick={() => onFlag(item.id)} className="w-full py-2 text-red-500 font-bold text-xs hover:underline flex items-center justify-center gap-1 transition-all hover:scale-105">
            <ReportIcon className="text-xs" /> Flag for Field Verification
          </button>
        </div>
      </div>

      <div className="mt-auto p-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Conflict Context</p>
        <div className="text-[11px] text-slate-500 leading-relaxed">{item.conflictContext}</div>
      </div>
    </div>
  );
};

// ============== Main ResolvedDuplications Component (No Sidebar) ==============

const ResolvedDuplications: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<ResolutionItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleMerge = (id: number) => { alert(`Merging record #${id}`); setSelectedItem(null); };
  const handleApprove = (id: number) => { alert(`Approving record #${id} as unique`); setSelectedItem(null); };
  const handleFlag = (id: number) => { alert(`Flagging record #${id} for field verification`); };

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left Section - Table */}
      <section className="flex-1 overflow-y-auto pr-6">
        <ResolutionQueue 
          selectedItem={selectedItem} 
          onSelectItem={setSelectedItem} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
      </section>

      {/* Right Section - Comparison Panel */}
      <ComparisonPanel 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)} 
        onMerge={handleMerge} 
        onApprove={handleApprove} 
        onFlag={handleFlag} 
      />
    </div>
  );
};

export default ResolvedDuplications;