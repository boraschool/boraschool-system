import { motion } from 'motion/react';
import { 
  GraduationCap, 
  Users, 
  BookOpen, 
  Settings, 
  LogOut, 
  LayoutDashboard, 
  School as SchoolIcon, 
  Bell, 
  Search,
  TrendingUp,
  ShieldCheck,
  MoreVertical,
  Plus,
  X,
  Check,
  Copy,
  Mail,
  Key,
  Filter,
  ShieldAlert,
  Trash2,
  Eye,
  EyeOff,
  Edit,
  Quote
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
import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';

interface School {
  id: string;
  name: string;
  county: string;
  students: string;
  status: 'Active' | 'Pending' | 'Suspended';
  date: string;
  principalEmail: string;
  principalPass: string;
  teacherEmail: string;
  teacherPass: string;
}

interface ExamMaterial {
  id: string;
  title: string;
  subject: string;
  schoolName: string;
  teacherName: string;
  uploadDate: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  fileType: 'PDF' | 'DOCX' | 'ZIP';
  visibility: 'Public' | 'Hidden';
}

export const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'schools' | 'analytics' | 'exams' | 'stories'>('dashboard');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showStoryModal, setShowStoryModal] = useState(false);
  const [editingStory, setEditingStory] = useState<any>(null);
  const [newStory, setNewStory] = useState({
    studentName: '',
    title: '',
    description: '',
    image: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [successStories, setSuccessStories] = useState<any[]>(() => {
    const saved = localStorage.getItem('alakara_success_stories');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 's1',
        studentName: 'Faith Mwangi',
        title: 'Top Scorer 2025',
        description: 'Faith achieved an incredible mean grade of A plain in the 2025 KCSE exams, emerging as the top student in her county.',
        image: 'https://picsum.photos/seed/student1/400/300',
        date: '2025-12-20'
      }
    ];
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending' | 'Suspended'>('All');
  const [generatedCreds, setGeneratedCreds] = useState<{principal: string, teacher: string, pass: string} | null>(null);

  useEffect(() => {
    localStorage.setItem('alakara_success_stories', JSON.stringify(successStories));
  }, [successStories]);

  const [examMaterials, setExamMaterials] = useState<ExamMaterial[]>(() => {
    const saved = localStorage.getItem('alakara_exam_materials');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'm1',
        title: 'KCSE Mathematics Mock 2026',
        subject: 'Mathematics',
        schoolName: 'Oakwood Academy',
        teacherName: 'Mr. Kamau',
        uploadDate: '2 hours ago',
        status: 'Pending',
        fileType: 'PDF',
        visibility: 'Public'
      },
      {
        id: 'm2',
        title: 'English Literature Analysis - Blossoms',
        subject: 'English',
        schoolName: 'City High School',
        teacherName: 'Mrs. Anyango',
        uploadDate: '5 hours ago',
        status: 'Pending',
        fileType: 'PDF',
        visibility: 'Public'
      },
      {
        id: 'm3',
        title: 'Biology Practical Guide - Form 4',
        subject: 'Biology',
        schoolName: 'Global International',
        teacherName: 'Dr. Omondi',
        uploadDate: '1 day ago',
        status: 'Approved',
        fileType: 'ZIP',
        visibility: 'Public'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('alakara_exam_materials', JSON.stringify(examMaterials));
  }, [examMaterials]);
  
  const [schools, setSchools] = useState<School[]>(() => {
    const saved = localStorage.getItem('alakara_schools');
    if (saved) return JSON.parse(saved);
    return [
      { 
        id: '1', 
        name: 'Oakwood Academy', 
        location: 'Nairobi, KE', 
        students: '1,200', 
        status: 'Active', 
        date: '2 hours ago',
        principalEmail: 'principal.oakwood@alakara.ac.ke',
        principalPass: 'P@ss123',
        teacherEmail: 'staff.oakwood@alakara.ac.ke',
        teacherPass: 'T@ech456'
      },
      { 
        id: '2', 
        name: 'City High School', 
        location: 'Mombasa, KE', 
        students: '2,450', 
        status: 'Active', 
        date: '5 hours ago',
        principalEmail: 'principal.cityhigh@alakara.ac.ke',
        principalPass: 'P@ss123',
        teacherEmail: 'staff.cityhigh@alakara.ac.ke',
        teacherPass: 'T@ech456'
      },
      { 
        id: '3', 
        name: 'Global International', 
        location: 'Kisumu, KE', 
        students: '850', 
        status: 'Pending', 
        date: '1 day ago',
        principalEmail: 'principal.global@alakara.ac.ke',
        principalPass: 'P@ss123',
        teacherEmail: 'staff.global@alakara.ac.ke',
        teacherPass: 'T@ech456'
      },
    ];
  });

  useEffect(() => {
    localStorage.setItem('alakara_schools', JSON.stringify(schools));
  }, [schools]);

  const [newSchool, setNewSchool] = useState({
    name: '',
    location: '',
    students: '',
  });

  const generateCredentials = (schoolName: string) => {
    const slug = schoolName.toLowerCase().replace(/\s+/g, '');
    const pass = Math.random().toString(36).slice(-8).toUpperCase();
    return {
      principal: `principal.${slug}@alakara.ac.ke`,
      teacher: `staff.${slug}@alakara.ac.ke`,
      pass
    };
  };

  const handleAddSchool = (e: FormEvent) => {
    e.preventDefault();
    const creds = generateCredentials(newSchool.name);
    
    const school: School = {
      id: Math.random().toString(36).substr(2, 9),
      ...newSchool,
      status: 'Active',
      date: 'Just now',
      principalEmail: creds.principal,
      principalPass: creds.pass,
      teacherEmail: creds.teacher,
      teacherPass: creds.pass
    };

    setSchools([school, ...schools]);
    setGeneratedCreds({ principal: creds.principal, teacher: creds.teacher, pass: creds.pass });
    setNewSchool({ name: '', location: '', students: '' });
  };

  const stats = [
    { label: 'Total Schools', value: schools.length.toString(), change: '+12%', icon: SchoolIcon, color: 'text-kenya-green', bg: 'bg-kenya-green/10' },
    { label: 'Active Exams', value: '45,201', change: '+18%', icon: BookOpen, color: 'text-kenya-red', bg: 'bg-kenya-red/10' },
    { label: 'Total Students', value: '892,400', change: '+7%', icon: Users, color: 'text-kenya-black', bg: 'bg-kenya-black/10' },
    { label: 'System Health', value: '99.9%', change: 'Stable', icon: ShieldCheck, color: 'text-kenya-green', bg: 'bg-kenya-green/10' },
  ];

  const handleLogout = () => {
    navigate('/super-admin');
  };

  const toggleSchoolStatus = (id: string) => {
    setSchools(schools.map(school => {
      if (school.id === id) {
        const nextStatus = school.status === 'Active' ? 'Suspended' : 'Active';
        return { ...school, status: nextStatus as any };
      }
      return school;
    }));
  };

  const handleMaterialAction = (id: string, action: 'Approved' | 'Rejected') => {
    setExamMaterials(examMaterials.map(m => m.id === id ? { ...m, status: action } : m));
  };

  const toggleMaterialVisibility = (id: string) => {
    setExamMaterials(examMaterials.map(m => {
      if (m.id === id) {
        return { ...m, visibility: m.visibility === 'Public' ? 'Hidden' : 'Public' };
      }
      return m;
    }));
  };

  const handleDeleteMaterial = (id: string) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      setExamMaterials(examMaterials.filter(m => m.id !== id));
    }
  };

  const handleAddStory = (e: FormEvent) => {
    e.preventDefault();
    if (editingStory) {
      setSuccessStories(successStories.map(s => s.id === editingStory.id ? { ...newStory, id: s.id } : s));
      setEditingStory(null);
    } else {
      const story = {
        id: Math.random().toString(36).substr(2, 9),
        ...newStory
      };
      setSuccessStories([story, ...successStories]);
    }
    setNewStory({ studentName: '', title: '', description: '', image: '', date: new Date().toISOString().split('T')[0] });
    setShowStoryModal(false);
  };

  const handleDeleteStory = (id: string) => {
    if (window.confirm('Are you sure you want to delete this success story?')) {
      setSuccessStories(successStories.filter(s => s.id !== id));
    }
  };

  const openEditStory = (story: any) => {
    setEditingStory(story);
    setNewStory({
      studentName: story.studentName,
      title: story.title,
      description: story.description,
      image: story.image,
      date: story.date
    });
    setShowStoryModal(true);
  };

  const filteredSchools = schools.filter(school => {
    const matchesStatus = statusFilter === 'All' || school.status === statusFilter;
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          school.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const registrationData = [
    { month: 'Jan', schools: 400, users: 2400 },
    { month: 'Feb', schools: 520, users: 3100 },
    { month: 'Mar', schools: 680, users: 4200 },
    { month: 'Apr', schools: 850, users: 5800 },
    { month: 'May', schools: 1100, users: 7500 },
    { month: 'Jun', schools: 1284, users: 9200 },
  ];

  const performanceData = [
    { subject: 'Mathematics', score: 78 },
    { subject: 'English', score: 82 },
    { subject: 'Kiswahili', score: 75 },
    { subject: 'Science', score: 88 },
    { subject: 'Social Studies', score: 72 },
  ];

  const statusData = [
    { name: 'Active', value: 85, color: '#008751' },
    { name: 'Pending', value: 10, color: '#FFD700' },
    { name: 'Suspended', value: 5, color: '#BB1924' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex relative">
      <div className="absolute inset-0 opacity-[0.01] pointer-events-none" style={{ backgroundImage: 'var(--background-kenya-pattern)', backgroundSize: '40px 40px' }} />
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col relative z-10">
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="bg-kenya-green p-1.5 rounded-lg">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-kenya-black tracking-tight">Alakara <span className="text-kenya-red">KE</span></span>
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
            onClick={() => setActiveTab('schools')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'schools' ? 'bg-kenya-green/10 text-kenya-green' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <SchoolIcon className="w-5 h-5" />
            Schools
          </button>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <Users className="w-5 h-5" />
            Users
          </a>
          <button 
            onClick={() => setActiveTab('exams')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'exams' ? 'bg-kenya-green/10 text-kenya-green' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <BookOpen className="w-5 h-5" />
            Exams
          </button>
          <button 
            onClick={() => setActiveTab('stories')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'stories' ? 'bg-kenya-green/10 text-kenya-green' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Quote className="w-5 h-5" />
            Success Stories
          </button>
          <button 
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-medium transition-all ${activeTab === 'analytics' ? 'bg-kenya-green/10 text-kenya-green' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <TrendingUp className="w-5 h-5" />
            Analytics
          </button>
          <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
            <Settings className="w-5 h-5" />
            Settings
          </a>
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
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search schools, exams, or users..." 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kenya-green/20 focus:border-kenya-green transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-400 hover:text-kenya-red relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-kenya-red rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-px bg-gray-200 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-kenya-black">Super Admin</p>
                <p className="text-xs text-gray-500">System Controller</p>
              </div>
              <img 
                src="https://picsum.photos/seed/admin-avatar/100/100" 
                alt="Admin" 
                className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8">
          {activeTab === 'dashboard' ? (
            <>
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-kenya-black">System Overview</h1>
                  <p className="text-gray-500">Welcome back, here's what's happening across the Kenyan network.</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2" onClick={() => setActiveTab('analytics')}>
                    <TrendingUp className="w-4 h-4" />
                    Full Report
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
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
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-kenya-green/10 text-kenya-green' : 'bg-gray-50 text-gray-600'}`}>
                        {stat.change}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-kenya-black">{stat.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Charts Preview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-kenya-black mb-6">Registration Growth</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={registrationData}>
                        <defs>
                          <linearGradient id="colorSchools" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#008751" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#008751" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Area type="monotone" dataKey="schools" stroke="#008751" strokeWidth={2} fillOpacity={1} fill="url(#colorSchools)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-kenya-black mb-6">Performance by Subject</h3>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                        <Tooltip 
                          cursor={{fill: '#f9fafb'}}
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                        />
                        <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                          {performanceData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#008751' : '#BB1924'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Recent Activity & Schools */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                      <h3 className="font-bold text-kenya-black">Recently Joined Kenyan Schools</h3>
                      <Button variant="ghost" size="sm" className="text-kenya-green" onClick={() => setActiveTab('schools')}>View All</Button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <th className="px-6 py-4">School Name</th>
                            <th className="px-6 py-4">Location</th>
                            <th className="px-6 py-4">Students</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Joined</th>
                            <th className="px-6 py-4"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {schools.slice(0, 4).map((school) => (
                            <tr key={school.id} className="hover:bg-gray-50/50 transition-colors">
                              <td className="px-6 py-4">
                                <p className="font-bold text-kenya-black">{school.name}</p>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">{school.location}</td>
                              <td className="px-6 py-4 text-sm text-kenya-black font-medium">{school.students}</td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  school.status === 'Active' ? 'bg-kenya-green/10 text-kenya-green' : 'bg-kenya-red/10 text-kenya-red'
                                }`}>
                                  {school.status}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">{school.date}</td>
                              <td className="px-6 py-4 text-right">
                                <button className="p-1 text-gray-400 hover:text-gray-600">
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-kenya-black mb-6">System Health</h3>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Database Load</span>
                          <span className="font-bold text-kenya-black">24%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-kenya-green rounded-full" style={{ width: '24%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">Storage Usage</span>
                          <span className="font-bold text-kenya-black">68%</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-kenya-red rounded-full" style={{ width: '68%' }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-500">API Latency</span>
                          <span className="font-bold text-kenya-black">42ms</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-kenya-green rounded-full" style={{ width: '15%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-kenya-black via-kenya-red to-kenya-green p-6 rounded-2xl text-white shadow-lg shadow-kenya-black/20">
                    <h3 className="font-bold mb-2">Need Support?</h3>
                    <p className="text-gray-100 text-sm mb-6 leading-relaxed">
                      Our technical team is available 24/7 for system-wide emergencies in Kenya.
                    </p>
                    <Button variant="secondary" size="sm" className="w-full">Open Support Ticket</Button>
                  </div>
                </div>
              </div>
            </>
          ) : activeTab === 'schools' ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-kenya-black">School Management</h1>
                  <p className="text-gray-500">Register and manage educational institutions across Kenya.</p>
                </div>
                <Button 
                  onClick={() => {
                    setShowAddModal(true);
                    setGeneratedCreds(null);
                  }}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Register New School
                </Button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search schools..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kenya-green/20 focus:border-kenya-green transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="bg-gray-50 border border-gray-200 rounded-xl text-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-kenya-green/20 focus:border-kenya-green transition-all"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Pending">Pending</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <th className="px-6 py-4">School Details</th>
                        <th className="px-6 py-4">Principal Account</th>
                        <th className="px-6 py-4">Staff Account</th>
                        <th className="px-6 py-4">Students</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredSchools.map((school) => (
                        <tr key={school.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <p className="font-bold text-kenya-black">{school.name}</p>
                            <p className="text-xs text-gray-500">{school.location}</p>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Mail className="w-3 h-3" />
                                {school.principalEmail}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                                <Key className="w-3 h-3" />
                                {school.principalPass}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Mail className="w-3 h-3" />
                                {school.teacherEmail}
                              </div>
                              <div className="flex items-center gap-2 text-[10px] text-gray-400 font-mono">
                                <Key className="w-3 h-3" />
                                {school.teacherPass}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-kenya-black font-medium">{school.students}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              school.status === 'Active' ? 'bg-kenya-green/10 text-kenya-green' : 
                              school.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-kenya-red/10 text-kenya-red'
                            }`}>
                              {school.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {school.status === 'Suspended' ? (
                                <button 
                                  onClick={() => toggleSchoolStatus(school.id)}
                                  className="p-2 text-gray-400 hover:text-kenya-green transition-colors"
                                  title="Activate School"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              ) : (
                                <button 
                                  onClick={() => toggleSchoolStatus(school.id)}
                                  className="p-2 text-gray-400 hover:text-kenya-red transition-colors"
                                  title="Suspend School"
                                >
                                  <ShieldAlert className="w-4 h-4" />
                                </button>
                              )}
                              <button className="p-2 text-gray-400 hover:text-gray-600">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'exams' ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-kenya-black">Exam Materials Review</h1>
                  <p className="text-gray-500">Approve or reject educational materials uploaded by teachers.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                        <th className="px-6 py-4">Material Title</th>
                        <th className="px-6 py-4">Source</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Visibility</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {examMaterials.map((material) => (
                        <tr key={material.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                <BookOpen className="w-5 h-5" />
                              </div>
                              <div>
                                <p className="font-bold text-kenya-black">{material.title}</p>
                                <p className="text-xs text-gray-500">{material.subject} • {material.fileType}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm font-medium text-kenya-black">{material.teacherName}</p>
                            <p className="text-xs text-gray-500">{material.schoolName}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{material.uploadDate}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              material.status === 'Approved' ? 'bg-kenya-green/10 text-kenya-green' : 
                              material.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-kenya-red/10 text-kenya-red'
                            }`}>
                              {material.status}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              material.visibility === 'Public' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {material.visibility}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {material.status === 'Pending' && (
                                <>
                                  <button 
                                    onClick={() => handleMaterialAction(material.id, 'Approved')}
                                    className="p-2 text-kenya-green hover:bg-kenya-green/10 rounded-lg transition-colors"
                                    title="Approve"
                                  >
                                    <Check className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleMaterialAction(material.id, 'Rejected')}
                                    className="p-2 text-kenya-red hover:bg-kenya-red/10 rounded-lg transition-colors"
                                    title="Reject"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                              <button 
                                onClick={() => toggleMaterialVisibility(material.id)}
                                className="p-2 text-gray-400 hover:text-blue-600 rounded-lg transition-colors"
                                title={material.visibility === 'Public' ? 'Hide from Public' : 'Show to Public'}
                              >
                                {material.visibility === 'Public' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                              <button 
                                onClick={() => handleDeleteMaterial(material.id)}
                                className="p-2 text-gray-400 hover:text-kenya-red rounded-lg transition-colors"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-gray-600">
                                <MoreVertical className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : activeTab === 'stories' ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-kenya-black">Success Stories</h1>
                  <p className="text-gray-500">Manage student achievements and success stories displayed on the platform.</p>
                </div>
                <Button 
                  onClick={() => {
                    setEditingStory(null);
                    setNewStory({ studentName: '', title: '', description: '', image: '', date: new Date().toISOString().split('T')[0] });
                    setShowStoryModal(true);
                  }}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Post Success Story
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {successStories.map((story) => (
                  <motion.div
                    key={story.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={story.image || 'https://picsum.photos/seed/placeholder/400/300'} 
                        alt={story.studentName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button 
                          onClick={() => openEditStory(story)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-kenya-green shadow-sm transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteStory(story.id)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-lg text-gray-600 hover:text-kenya-red shadow-sm transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-kenya-black">{story.studentName}</h3>
                        <span className="text-xs text-gray-400">{story.date}</span>
                      </div>
                      <p className="text-sm font-bold text-kenya-red mb-3 uppercase tracking-wider">{story.title}</p>
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {story.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {successStories.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                  <Quote className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-medium">No success stories posted yet.</p>
                </div>
              )}
            </div>
          ) : activeTab === 'analytics' ? (
            <div className="space-y-8">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-kenya-black">Advanced Analytics</h1>
                <p className="text-gray-500">Deep dive into school performance and system usage trends.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-kenya-black mb-6">User Acquisition Trend</h3>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={registrationData}>
                          <defs>
                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#BB1924" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#BB1924" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Area type="monotone" dataKey="users" stroke="#BB1924" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-kenya-black mb-6">Regional Performance Distribution</h3>
                    <div className="h-80 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={performanceData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                          <XAxis type="number" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} />
                          <YAxis dataKey="subject" type="category" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#9ca3af'}} width={100} />
                          <Tooltip 
                            cursor={{fill: '#f9fafb'}}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="score" fill="#008751" radius={[0, 4, 4, 0]} barSize={20} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-kenya-black mb-6">School Status</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={statusData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                          >
                            {statusData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 mt-4">
                      {statusData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-sm text-gray-600">{item.name}</span>
                          </div>
                          <span className="text-sm font-bold text-kenya-black">{item.value}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-kenya-black mb-4">Key Insights</h3>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-kenya-green mt-2 shrink-0" />
                        <p className="text-sm text-gray-600">Nairobi region shows 15% higher engagement in Science subjects.</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-kenya-red mt-2 shrink-0" />
                        <p className="text-sm text-gray-600">Active user growth peaked in March due to end-of-term exams.</p>
                      </li>
                      <li className="flex gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 mt-2 shrink-0" />
                        <p className="text-sm text-gray-600">System latency remains below 50ms despite 20% traffic increase.</p>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        {/* Story Modal */}
        {showStoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-kenya-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] w-full max-w-2xl p-8 shadow-2xl border border-gray-100"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-kenya-black">
                  {editingStory ? 'Edit Success Story' : 'Post Success Story'}
                </h3>
                <button onClick={() => setShowStoryModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStory} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-kenya-black ml-1">Student Name</label>
                    <input 
                      type="text" 
                      required
                      value={newStory.studentName}
                      onChange={(e) => setNewStory({...newStory, studentName: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20"
                      placeholder="e.g. John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-kenya-black ml-1">Title</label>
                    <input 
                      type="text" 
                      required
                      value={newStory.title}
                      onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20"
                      placeholder="e.g. Top Scorer 2025"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-kenya-black ml-1">Image URL</label>
                  <input 
                    type="url" 
                    required
                    value={newStory.image}
                    onChange={(e) => setNewStory({...newStory, image: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-kenya-black ml-1">Description / Story Content</label>
                  <textarea 
                    required
                    rows={4}
                    value={newStory.description}
                    onChange={(e) => setNewStory({...newStory, description: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20 resize-none"
                    placeholder="Write the success story here..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-kenya-black ml-1">Date</label>
                  <input 
                    type="date" 
                    required
                    value={newStory.date}
                    onChange={(e) => setNewStory({...newStory, date: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setShowStoryModal(false)} className="flex-1 py-4 rounded-xl font-bold">Cancel</Button>
                  <Button type="submit" className="flex-1 py-4 rounded-xl font-bold">
                    {editingStory ? 'Update Story' : 'Post Story'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* Add School Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                <h3 className="text-xl font-bold text-kenya-black">Register New Institution</h3>
                <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8">
                {!generatedCreds ? (
                  <form onSubmit={handleAddSchool} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">School Name</label>
                      <input 
                        type="text" 
                        required
                        value={newSchool.name}
                        onChange={(e) => setNewSchool({ ...newSchool, name: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20 focus:border-kenya-green"
                        placeholder="e.g. Alliance High School"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                        <input 
                          type="text" 
                          required
                          value={newSchool.location}
                          onChange={(e) => setNewSchool({ ...newSchool, location: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20 focus:border-kenya-green"
                          placeholder="e.g. Kiambu, KE"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Est. Students</label>
                        <input 
                          type="text" 
                          required
                          value={newSchool.students}
                          onChange={(e) => setNewSchool({ ...newSchool, students: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20 focus:border-kenya-green"
                          placeholder="e.g. 1,500"
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full py-4">Generate Access Details</Button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-kenya-green/10 p-6 rounded-2xl border border-kenya-green/20 text-center">
                      <div className="w-12 h-12 bg-kenya-green rounded-full flex items-center justify-center text-white mx-auto mb-4">
                        <Check className="w-6 h-6" />
                      </div>
                      <h4 className="text-lg font-bold text-kenya-green mb-1">Registration Successful!</h4>
                      <p className="text-sm text-gray-600">Login details have been generated with the @alakara.ac.ke extension.</p>
                    </div>

                    <div className="space-y-4">
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Principal Account</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-mono text-kenya-black">{generatedCreds.principal}</p>
                          <button className="text-gray-400 hover:text-kenya-green"><Copy className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Staff Account</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-mono text-kenya-black">{generatedCreds.teacher}</p>
                          <button className="text-gray-400 hover:text-kenya-green"><Copy className="w-4 h-4" /></button>
                        </div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Default Password</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-mono font-bold text-kenya-red">{generatedCreds.pass}</p>
                          <button className="text-gray-400 hover:text-kenya-red"><Copy className="w-4 h-4" /></button>
                        </div>
                      </div>
                    </div>

                    <Button onClick={() => setShowAddModal(false)} className="w-full">Done</Button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};
