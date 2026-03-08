import { motion } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  LayoutDashboard, 
  Bell, 
  Search,
  TrendingUp,
  ShieldCheck,
  Loader2,
  Calendar,
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
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { NotificationBell, addNotification } from '../components/NotificationBell';
import { supabase } from '../lib/supabase';

export const StudentDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [school, setSchool] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'results' | 'exams' | 'resources' | 'profile'>('dashboard');

  useEffect(() => {
    const verifySession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          const savedStudent = localStorage.getItem('alakara_current_student');
          if (savedStudent) {
            const student = JSON.parse(savedStudent);
            setProfile(student);
            if (student.school_id) {
              const schoolData = await supabase.from('schools').select('*').eq('id', student.school_id).single();
              if (schoolData.data) setSchool(schoolData.data);
            }
            setIsVerifying(false);
            return;
          }
          navigate('/student-login');
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*, schools(*)')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profileData || profileData.role !== 'student') {
          console.error('Unauthorized access or profile error:', profileError);
          navigate('/student-login');
          return;
        }

        setProfile(profileData);
        setSchool(profileData.schools);
        localStorage.setItem('alakara_current_student', JSON.stringify(profileData));
        setIsVerifying(false);
      } catch (err) {
        console.error('Verification error:', err);
        navigate('/student-login');
      }
    };

    verifySession();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('alakara_current_student');
    navigate('/student-login');
  };

  if (isVerifying) {
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

        <div className="p-4 border-t border-gray-100">
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
                  {/* Performance Trend */}
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

                  {/* Recent Results */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-bold text-kenya-black">Recent Subject Performance</h3>
                      <Button variant="ghost" size="sm" className="text-kenya-green">View All</Button>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {[
                        { subject: 'Mathematics', score: 82, grade: 'A-', trend: 'up' },
                        { subject: 'English', score: 75, grade: 'B+', trend: 'stable' },
                        { subject: 'Biology', score: 88, grade: 'A', trend: 'up' },
                        { subject: 'History', score: 64, grade: 'C+', trend: 'down' },
                      ].map((result, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-4">
                            <div className="bg-gray-100 p-2 rounded-lg">
                              <BookOpen className="w-4 h-4 text-gray-600" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-kenya-black">{result.subject}</p>
                              <p className="text-xs text-gray-500">Score: {result.score}%</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-kenya-green">{result.grade}</p>
                            <span className={`text-[10px] uppercase font-bold ${
                              result.trend === 'up' ? 'text-green-500' : 
                              result.trend === 'down' ? 'text-red-500' : 'text-gray-400'
                            }`}>
                              {result.trend}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* Study Streak */}
                  <div className="bg-kenya-black rounded-3xl p-8 text-white shadow-xl text-center">
                    <div className="w-16 h-16 bg-kenya-green/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-kenya-green/30">
                      <TrendingUp className="w-8 h-8 text-kenya-green" />
                    </div>
                    <h4 className="text-xl font-bold mb-2">5 Day Streak!</h4>
                    <p className="text-gray-400 text-sm mb-6">You've logged in every day this week. Keep it up!</p>
                    <div className="flex justify-center gap-2 mb-8">
                      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                        <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${i < 5 ? 'bg-kenya-green text-white' : 'bg-white/10 text-gray-500'}`}>
                          {day}
                        </div>
                      ))}
                    </div>
                    <Button className="w-full bg-kenya-green hover:bg-kenya-green/90 text-white font-bold py-3 rounded-xl">
                      Start Studying
                    </Button>
                  </div>

                  {/* Upcoming Exams */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-kenya-black mb-4">Exam Countdown</h3>
                    <div className="space-y-4">
                      {[
                        { subject: 'Mathematics', date: '12 Jun', days: 4 },
                        { subject: 'Kiswahili', date: '14 Jun', days: 6 },
                        { subject: 'Physics', date: '18 Jun', days: 10 },
                      ].map((exam, i) => (
                        <div key={i} className="flex items-center gap-4 p-3 rounded-xl border border-gray-50">
                          <div className="bg-kenya-red/5 text-kenya-red p-2 rounded-lg text-center min-w-[50px]">
                            <p className="text-xs font-bold uppercase">{exam.date.split(' ')[1]}</p>
                            <p className="text-lg font-bold leading-none">{exam.date.split(' ')[0]}</p>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-kenya-black">{exam.subject}</p>
                            <p className="text-xs text-gray-500">{exam.days} days left</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'dashboard' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
              <Loader2 className="w-12 h-12 text-kenya-green animate-spin mx-auto mb-4" />
              <h2 className="text-xl font-bold text-kenya-black mb-2">Module Loading...</h2>
              <p className="text-gray-500">We are preparing your {activeTab} for you.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
