import { motion } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  LayoutDashboard, 
  Search,
  TrendingUp,
  Loader2,
  FileText,
  CheckCircle2,
  Clock,
  Award,
  BookMarked,
  LogOut,
  User,
  Star
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip
} from 'recharts';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { NotificationBell } from '../components/NotificationBell';
import { supabase } from '../lib/supabase';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(() => {
    const saved = localStorage.getItem('alakara_current_student');
    return saved ? JSON.parse(saved) : null;
  });
  const [school, setSchool] = useState<any>(() => {
    const saved = localStorage.getItem('alakara_current_school');
    return saved ? JSON.parse(saved) : null;
  });
  const [isVerifying, setIsVerifying] = useState(!profile);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'results' | 'exams' | 'resources' | 'profile'>('dashboard');

  useEffect(() => {
    const verifySession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          if (!profile) navigate('/student-login');
          setIsVerifying(false);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*, schools(*)')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profileData || profileData.role !== 'student') {
          if (!profile) navigate('/student-login');
          setIsVerifying(false);
          return;
        }

        setProfile(profileData);
        setSchool(profileData.schools);
        localStorage.setItem('alakara_current_student', JSON.stringify(profileData));
        setIsVerifying(false);
      } catch (err) {
        console.error('Verification error:', err);
        if (!profile) navigate('/student-login');
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [navigate, profile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('alakara_current_student');
    navigate('/student-login');
  };

  if (isVerifying && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-kenya-green animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Preparing Your Study Room...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="bg-kenya-green p-1.5 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-kenya-black tracking-tight">
            Student <span className="text-kenya-green">Hub</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'dashboard' ? 'bg-kenya-green/10 text-kenya-green' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'results' ? 'bg-kenya-green/10 text-kenya-green' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Award className="w-5 h-5" />
            My Results
          </button>
          <button 
            onClick={() => setActiveTab('exams')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'exams' ? 'bg-kenya-green/10 text-kenya-green' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BookOpen className="w-5 h-5" />
            Upcoming Exams
          </button>
          <button 
            onClick={() => setActiveTab('resources')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'resources' ? 'bg-kenya-green/10 text-kenya-green' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BookMarked className="w-5 h-5" />
            Study Materials
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'profile' ? 'bg-kenya-green/10 text-kenya-green' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <User className="w-5 h-5" />
            My Profile
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100 mt-auto">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-600 hover:text-kenya-red hover:bg-kenya-red/5 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search subjects, results, or notes..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kenya-green/20 focus:border-kenya-green transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell role="student" userId={profile?.id} />
            <div className="h-8 w-px bg-gray-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-kenya-black">{profile?.name || 'Student'}</p>
                <p className="text-xs text-gray-500">{profile?.class || 'Form 4'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-kenya-green/10 flex items-center justify-center border border-kenya-green/20">
                <Star className="w-6 h-6 text-kenya-green" />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-kenya-black">Habari, {profile?.name?.split(' ')[0]}!</h1>
                  <p className="text-gray-500">Keep up the great work. Your progress is looking good.</p>
                </div>
                <div className="flex gap-3">
                  <Button className="gap-2 bg-kenya-green hover:bg-kenya-green/90">
                    <FileText className="w-4 h-4" />
                    View Report Card
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Overall Rank', value: '12/148', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Mean Grade', value: 'B+', icon: Star, color: 'text-kenya-green', bg: 'bg-kenya-green/5' },
                  { label: 'Attendance', value: '96%', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Assignments', value: '3 Pending', icon: Clock, color: 'text-kenya-red', bg: 'bg-kenya-red/5' },
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-kenya-black">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-kenya-black mb-6">My Academic Progress</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { exam: 'Term 1 Opener', score: 68 },
                          { exam: 'Term 1 Mid', score: 72 },
                          { exam: 'Term 1 End', score: 75 },
                          { exam: 'Term 2 Opener', score: 74 },
                          { exam: 'Term 2 Mid', score: 78 },
                        ]}>
                          <defs>
                            <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#008751" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#008751" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="exam" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                          <Tooltip />
                          <Area type="monotone" dataKey="score" stroke="#008751" strokeWidth={2} fillOpacity={1} fill="url(#colorProgress)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-kenya-black rounded-3xl p-8 text-white shadow-xl text-center">
                    <div className="w-16 h-16 bg-kenya-green/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-kenya-green/30">
                      <TrendingUp className="w-8 h-8 text-kenya-green" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">5 Day Streak!</h4>
                    <p className="text-gray-400 text-sm mb-6">You've logged in every day this week. Keep it up!</p>
                    <Button className="w-full bg-kenya-green hover:bg-kenya-green/90 text-white font-bold py-3 rounded-xl">
                      Start Studying
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
