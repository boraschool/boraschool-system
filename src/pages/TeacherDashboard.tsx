import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  Bell, 
  Search,
  TrendingUp,
  Plus,
  Loader2,
  Calendar,
  Clock,
  AlertCircle,
  ClipboardList,
  UserCheck
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { NotificationBell } from '../components/NotificationBell';
import { supabase } from '../lib/supabase';

export const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(() => {
    const saved = localStorage.getItem('alakara_current_teacher');
    return saved ? JSON.parse(saved) : null;
  });
  const [school, setSchool] = useState<any>(() => {
    const saved = localStorage.getItem('alakara_current_school');
    return saved ? JSON.parse(saved) : null;
  });
  const [isVerifying, setIsVerifying] = useState(!profile);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'classes' | 'exams' | 'results' | 'profile'>('dashboard');

  useEffect(() => {
    const verifySession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          if (!profile) navigate('/teacher-login');
          setIsVerifying(false);
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*, schools(*)')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profileData || profileData.role !== 'teacher') {
          // Try a simpler query if the join fails
          const { data: simpleProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (simpleProfile && simpleProfile.role === 'teacher') {
            setProfile(simpleProfile);
            localStorage.setItem('alakara_current_teacher', JSON.stringify(simpleProfile));
            setIsVerifying(false);
            return;
          }

          if (!profile) navigate('/teacher-login');
          setIsVerifying(false);
          return;
        }

        setProfile(profileData);
        setSchool(profileData.schools);
        localStorage.setItem('alakara_current_teacher', JSON.stringify(profileData));
        setIsVerifying(false);
      } catch (err) {
        console.error('Verification error:', err);
        if (!profile) navigate('/teacher-login');
        setIsVerifying(false);
      }
    };

    verifySession();
  }, [navigate, profile]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('alakara_current_teacher');
    navigate('/teacher-login');
  };

  if (isVerifying && !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-kenya-green animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying Staff Credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="bg-kenya-red p-1.5 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-kenya-black tracking-tight">
            Staff <span className="text-kenya-red">Portal</span>
          </span>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'dashboard' ? 'bg-kenya-red/10 text-kenya-red' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('classes')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'classes' ? 'bg-kenya-red/10 text-kenya-red' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users className="w-5 h-5" />
            My Classes
          </button>
          <button 
            onClick={() => setActiveTab('exams')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'exams' ? 'bg-kenya-red/10 text-kenya-red' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BookOpen className="w-5 h-5" />
            Examinations
          </button>
          <button 
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'results' ? 'bg-kenya-red/10 text-kenya-red' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <ClipboardList className="w-5 h-5" />
            Mark Entry
          </button>
          <button 
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'profile' ? 'bg-kenya-red/10 text-kenya-red' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Settings className="w-5 h-5" />
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
                placeholder="Search students, marks, or resources..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kenya-red/20 focus:border-kenya-red transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell role="teacher" userId={profile?.id} />
            <div className="h-8 w-px bg-gray-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-kenya-black">{profile?.name || 'Teacher'}</p>
                <p className="text-xs text-gray-500">{school?.name || 'Educator'}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-kenya-red/10 flex items-center justify-center border border-kenya-red/20">
                <UserCheck className="w-6 h-6 text-kenya-red" />
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
                  <h1 className="text-2xl font-bold text-kenya-black">Mambo, {profile?.name?.split(' ')[0]}!</h1>
                  <p className="text-gray-500">Ready to inspire your students today?</p>
                </div>
                <div className="flex gap-3">
                  <Button className="gap-2 bg-kenya-red hover:bg-kenya-red/90">
                    <Plus className="w-4 h-4" />
                    Enter Marks
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'My Students', value: '184', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Classes Today', value: '5', icon: Calendar, color: 'text-kenya-green', bg: 'bg-kenya-green/5' },
                  { label: 'Pending Grading', value: '12', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Avg. Class Score', value: '68%', icon: TrendingUp, color: 'text-kenya-red', bg: 'bg-kenya-red/5' },
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
                    <h3 className="font-bold text-kenya-black mb-6">Class Performance Overview</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                          { class: 'Form 1A', score: 62 },
                          { class: 'Form 2B', score: 75 },
                          { class: 'Form 3A', score: 68 },
                          { class: 'Form 4C', score: 82 },
                        ]}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="class" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                          <Tooltip />
                          <Bar dataKey="score" fill="#BB1924" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-kenya-black rounded-3xl p-8 text-white shadow-xl">
                    <h4 className="font-bold mb-6 flex items-center gap-2">
                      <UserCheck className="w-5 h-5 text-kenya-green" />
                      Quick Actions
                    </h4>
                    <div className="space-y-3">
                      <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium text-left transition-all flex items-center justify-between">
                        Upload Study Material
                        <Plus className="w-4 h-4" />
                      </button>
                      <button className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium text-left transition-all flex items-center justify-between">
                        Mark Attendance
                        <UserCheck className="w-4 h-4" />
                      </button>
                    </div>
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
