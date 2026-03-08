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
  ShieldCheck,
  Plus,
  MoreVertical,
  Loader2,
  School as SchoolIcon,
  Calendar,
  FileText,
  UserPlus,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { NotificationBell, addNotification } from '../components/NotificationBell';
import { supabase } from '../lib/supabase';
import { supabaseService } from '../services/supabaseService';

export const PrincipalDashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [school, setSchool] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'staff' | 'students' | 'exams' | 'settings'>('dashboard');

  useEffect(() => {
    const verifySession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          // Check localStorage as fallback
          const savedPrincipal = localStorage.getItem('alakara_current_principal');
          if (savedPrincipal) {
            const principal = JSON.parse(savedPrincipal);
            setProfile(principal);
            if (principal.school_id) {
              const schoolData = await supabase.from('schools').select('*').eq('id', principal.school_id).single();
              if (schoolData.data) setSchool(schoolData.data);
            }
            setIsVerifying(false);
            return;
          }
          navigate('/principal-login');
          return;
        }

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*, schools(*)')
          .eq('id', session.user.id)
          .single();

        if (profileError || !profileData || profileData.role !== 'principal') {
          console.error('Unauthorized access or profile error:', profileError);
          navigate('/principal-login');
          return;
        }

        setProfile(profileData);
        setSchool(profileData.schools);
        localStorage.setItem('alakara_current_principal', JSON.stringify(profileData));
        localStorage.setItem('alakara_current_school', JSON.stringify(profileData.schools));
        setIsVerifying(false);
      } catch (err) {
        console.error('Verification error:', err);
        navigate('/principal-login');
      }
    };

    verifySession();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('alakara_current_principal');
    localStorage.removeItem('alakara_current_school');
    navigate('/principal-login');
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-kenya-green animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying Command Authority...</p>
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
            {school?.name || 'School'} <span className="text-kenya-red">HQ</span>
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
            onClick={() => setActiveTab('staff')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'staff' ? 'bg-kenya-green/10 text-kenya-green' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Users className="w-5 h-5" />
            Staff Management
          </button>
          <button 
            onClick={() => setActiveTab('students')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'students' ? 'bg-kenya-green/10 text-kenya-green' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <GraduationCap className="w-5 h-5" />
            Students
          </button>
          <button 
            onClick={() => setActiveTab('exams')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'exams' ? 'bg-kenya-green/10 text-kenya-green' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BookOpen className="w-5 h-5" />
            Examinations
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'settings' ? 'bg-kenya-green/10 text-kenya-green' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Settings className="w-5 h-5" />
            School Settings
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
                placeholder="Search staff, students, or records..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kenya-green/20 focus:border-kenya-green transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell role="principal" userId={profile?.id} />
            <div className="h-8 w-px bg-gray-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-kenya-black">{profile?.name || 'Principal'}</p>
                <p className="text-xs text-gray-500">School Principal</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-kenya-green/10 flex items-center justify-center border border-kenya-green/20">
                <ShieldCheck className="w-6 h-6 text-kenya-green" />
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
                  <h1 className="text-2xl font-bold text-kenya-black">Welcome, Principal {profile?.name?.split(' ')[0]}</h1>
                  <p className="text-gray-500">Here's the current status of {school?.name || 'your school'}.</p>
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" className="gap-2">
                    <FileText className="w-4 h-4" />
                    Generate Report
                  </Button>
                  <Button className="gap-2 bg-kenya-green hover:bg-kenya-green/90">
                    <Plus className="w-4 h-4" />
                    New Admission
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Total Students', value: '1,248', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'Teaching Staff', value: '42', icon: GraduationCap, color: 'text-kenya-green', bg: 'bg-kenya-green/5' },
                  { label: 'Avg. Performance', value: '74.2%', icon: TrendingUp, color: 'text-kenya-red', bg: 'bg-kenya-red/5' },
                  { label: 'Active Exams', value: '12', icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50' },
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

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  {/* Performance Chart */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-kenya-black mb-6">School Performance Trend</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                          { month: 'Jan', score: 65 },
                          { month: 'Feb', score: 68 },
                          { month: 'Mar', score: 72 },
                          { month: 'Apr', score: 70 },
                          { month: 'May', score: 75 },
                          { month: 'Jun', score: 74 },
                        ]}>
                          <defs>
                            <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#008751" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#008751" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                          <Tooltip />
                          <Area type="monotone" dataKey="score" stroke="#008751" strokeWidth={2} fillOpacity={1} fill="url(#colorScore)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-bold text-kenya-black">Recent Staff Activity</h3>
                      <Button variant="ghost" size="sm" className="text-kenya-green">View All</Button>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {[
                        { user: 'Mr. Kamau', action: 'Uploaded Term 2 Math Results', time: '2 hours ago', icon: FileText },
                        { user: 'Ms. Njeri', action: 'Marked Attendance for Form 4B', time: '4 hours ago', icon: Users },
                        { user: 'System', action: 'Generated Monthly Performance Report', time: '1 day ago', icon: TrendingUp },
                      ].map((activity, i) => (
                        <div key={i} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                          <div className="bg-gray-100 p-2 rounded-lg">
                            <activity.icon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-kenya-black">
                              <span className="font-bold">{activity.user}</span> {activity.action}
                            </p>
                            <p className="text-xs text-gray-500">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  {/* School Info Card */}
                  <div className="bg-kenya-black rounded-3xl p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="bg-kenya-green p-2 rounded-xl">
                        <SchoolIcon className="w-5 h-5" />
                      </div>
                      <h4 className="font-bold">School Identity</h4>
                    </div>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{school?.location || 'Nairobi, Kenya'}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>+254 700 000 000</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{school?.principal_email || 'contact@school.ac.ke'}</span>
                      </div>
                    </div>
                    <Button className="w-full bg-white text-kenya-black hover:bg-gray-100 font-bold py-3 rounded-xl">
                      Edit School Profile
                    </Button>
                  </div>

                  {/* Upcoming Events */}
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-kenya-black mb-4">Upcoming Events</h3>
                    <div className="space-y-4">
                      {[
                        { date: '15 Jun', title: 'PTA Meeting', type: 'Meeting' },
                        { date: '22 Jun', title: 'Mid-Term Exams', type: 'Academic' },
                        { date: '28 Jun', title: 'Sports Day', type: 'Extra-curricular' },
                      ].map((event, i) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="bg-kenya-red/5 text-kenya-red p-2 rounded-lg text-center min-w-[50px]">
                            <p className="text-xs font-bold uppercase">{event.date.split(' ')[1]}</p>
                            <p className="text-lg font-bold leading-none">{event.date.split(' ')[0]}</p>
                          </div>
                          <div>
                            <p className="text-sm font-bold text-kenya-black">{event.title}</p>
                            <p className="text-xs text-gray-500">{event.type}</p>
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
              <p className="text-gray-500">We are preparing the {activeTab} management interface for you.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
