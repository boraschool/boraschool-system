import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  LogOut, 
  LayoutDashboard, 
  Search,
  Download,
  FileText,
  Star,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'learning' | 'exams' | 'results' | 'materials'>('learning');

  useEffect(() => {
    const loadMaterials = () => {
      const saved = localStorage.getItem('alakara_exam_materials');
      if (saved) {
        const allMaterials = JSON.parse(saved);
        // Only show approved AND public materials to students
        setMaterials(allMaterials.filter((m: any) => m.status === 'Approved' && m.visibility === 'Public'));
      }
    };

    loadMaterials();
    // Poll for updates in this demo
    const interval = setInterval(loadMaterials, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    navigate('/login');
  };

  const filteredMaterials = materials.filter(m => 
    m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FF6321] flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-black text-white flex flex-col shrink-0 border-r-8 border-black">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-white p-2 rounded-xl group-hover:rotate-12 transition-transform">
              <GraduationCap className="w-8 h-8 text-black" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Alakara <span className="text-[#FF6321]">Students</span></span>
          </div>

          <nav className="space-y-4">
            <button 
              onClick={() => setActiveTab('learning')}
              className={`w-full flex items-center gap-4 px-6 py-4 font-black uppercase tracking-widest transition-all ${activeTab === 'learning' ? 'bg-white text-black shadow-[8px_8px_0px_0px_rgba(0,255,0,1)]' : 'text-white hover:bg-white/10'}`}
            >
              <LayoutDashboard className="w-6 h-6" />
              My Learning
            </button>
            <button 
              onClick={() => setActiveTab('materials')}
              className={`w-full flex items-center gap-4 px-6 py-4 font-black uppercase tracking-widest transition-all ${activeTab === 'materials' ? 'bg-white text-black shadow-[8px_8px_0px_0px_rgba(0,255,0,1)]' : 'text-white hover:bg-white/10'}`}
            >
              <FileText className="w-6 h-6" />
              Approved Materials
            </button>
            <button 
              onClick={() => setActiveTab('exams')}
              className={`w-full flex items-center gap-4 px-6 py-4 font-black uppercase tracking-widest transition-all ${activeTab === 'exams' ? 'bg-white text-black shadow-[8px_8px_0px_0px_rgba(0,255,0,1)]' : 'text-white hover:bg-white/10'}`}
            >
              <BookOpen className="w-6 h-6" />
              Exams
            </button>
            <button 
              onClick={() => setActiveTab('results')}
              className={`w-full flex items-center gap-4 px-6 py-4 font-black uppercase tracking-widest transition-all ${activeTab === 'results' ? 'bg-white text-black shadow-[8px_8px_0px_0px_rgba(0,255,0,1)]' : 'text-white hover:bg-white/10'}`}
            >
              <Star className="w-6 h-6" />
              Results
            </button>
          </nav>
        </div>

        <div className="mt-auto p-8">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 text-white hover:text-kenya-red font-black uppercase tracking-widest transition-all border-4 border-white hover:border-kenya-red"
          >
            <LogOut className="w-6 h-6" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white border-l-8 border-black">
        {/* Header */}
        <header className="h-24 bg-white border-b-8 border-black flex items-center justify-between px-10 shrink-0">
          <div className="flex items-center gap-6 flex-1">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-black" />
              <input 
                type="text" 
                placeholder="SEARCH MATERIALS..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-gray-100 border-4 border-black font-black uppercase tracking-widest focus:outline-none focus:bg-yellow-50 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 ml-10">
            <div className="text-right">
              <p className="text-sm font-black text-black uppercase tracking-widest">Student Portal</p>
              <p className="text-xs font-bold text-gray-500 uppercase">ADM-2024-001</p>
            </div>
            <div className="w-14 h-14 bg-[#FF6321] border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <GraduationCap className="w-8 h-8 text-white" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-[#f0f0f0]">
          {activeTab === 'materials' ? (
            <>
              <div className="mb-12">
                <h1 className="text-5xl font-black text-black uppercase tracking-tighter italic mb-4">Approved Learning Materials</h1>
                <div className="h-4 w-48 bg-[#FF6321] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredMaterials.map((material, index) => (
                  <motion.div
                    key={material.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white border-4 border-black p-8 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-2 hover:translate-y-2 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="w-16 h-16 bg-black flex items-center justify-center group-hover:rotate-12 transition-transform">
                        <FileText className="w-8 h-8 text-white" />
                      </div>
                      <span className="bg-kenya-green text-white px-4 py-1 font-black uppercase text-xs border-2 border-black">
                        {material.fileType}
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-black uppercase tracking-tight mb-2 leading-none">
                      {material.title}
                    </h3>
                    <p className="text-sm font-bold text-[#FF6321] uppercase mb-6">
                      {material.subject}
                    </p>

                    <div className="space-y-3 mb-8">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                        <Clock className="w-4 h-4" />
                        Uploaded {material.uploadDate}
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase">
                        <GraduationCap className="w-4 h-4" />
                        By {material.teacherName} ({material.schoolName})
                      </div>
                    </div>

                    <Button className="w-full bg-black hover:bg-gray-800 text-white py-4 rounded-none font-black uppercase tracking-widest flex items-center justify-center gap-3 shadow-[4px_4px_0px_0px_rgba(255,99,33,1)]">
                      <Download className="w-5 h-5" />
                      Download Now
                    </Button>
                  </motion.div>
                ))}

                {filteredMaterials.length === 0 && (
                  <div className="col-span-full py-20 text-center border-8 border-dashed border-black/10">
                    <p className="text-3xl font-black text-black/20 uppercase italic">No materials available yet</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-32 h-32 bg-black flex items-center justify-center mb-8 rotate-3">
                <ShieldCheck className="w-16 h-16 text-white" />
              </div>
              <h2 className="text-4xl font-black text-black uppercase tracking-tighter mb-4 italic">Section Under Maintenance</h2>
              <p className="text-xl font-bold text-gray-500 uppercase max-w-md">
                We're currently updating your {activeTab} portal to bring you a better learning experience!
              </p>
              <div className="mt-12 h-4 w-64 bg-[#FF6321] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]" />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
