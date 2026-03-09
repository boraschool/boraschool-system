import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  GraduationCap, 
  BookOpen, 
  LogOut, 
  LayoutDashboard, 
  Search,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Save,
  ChevronRight,
  ArrowLeft,
  Upload,
  Download,
  BarChart3,
  FileSpreadsheet,
  ClipboardList,
  Filter,
  ArrowUpDown,
  FileSpreadsheet as ExcelIcon,
  Users,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';
import * as XLSX from 'xlsx';

import { academicService } from '../services/academicService';
import { studentService } from '../services/studentService';

export const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState<any[]>([]);
  const [activeExam, setActiveExam] = useState<any>(null);
  const [marks, setMarks] = useState<any[]>(() => {
    const saved = localStorage.getItem('alakara_marks');
    return saved ? JSON.parse(saved) : [];
  });
  const [currentMarks, setCurrentMarks] = useState<any>({});
  const [activeTab, setActiveTab] = useState<'exams' | 'analysis' | 'individual-marks' | 'class-management' | 'profile'>('exams');
  const [assignedClasses] = useState<string[]>(['Form 1', 'Grade 7']); // Mock assigned classes
  const [teacherRole] = useState<'Teacher' | 'Class Teacher'>('Class Teacher'); // Mock role
  const [managedClass] = useState<string>('Form 1'); // Mock managed class
  const [selectedAnalysisExamId, setSelectedAnalysisExamId] = useState('');
  const [selectedIndividualStudent, setSelectedIndividualStudent] = useState<any>(null);
  const [individualMarks, setIndividualMarks] = useState<any>({}); // {subject: score}
  const [individualExamId, setIndividualExamId] = useState('');
  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [analysisOptions, setAnalysisOptions] = useState({
    showGrades: true,
    showRank: true
  });

  const [learningAreas] = useState<string[]>(() => {
    const saved = localStorage.getItem('alakara_learning_areas');
    return saved ? JSON.parse(saved) : ['Mathematics', 'English', 'Kiswahili', 'Science', 'Social Studies', 'CRE'];
  });

  const [gradingSystem] = useState<any[]>(() => {
    const saved = localStorage.getItem('alakara_grading');
    return saved ? JSON.parse(saved) : [
      { grade: 'A', min: 80, max: 100, points: 12 },
      { grade: 'A-', min: 75, max: 79, points: 11 },
      { grade: 'B+', min: 70, max: 74, points: 10 },
      { grade: 'B', min: 65, max: 69, points: 9 },
      { grade: 'B-', min: 60, max: 64, points: 8 },
      { grade: 'C+', min: 55, max: 59, points: 7 },
      { grade: 'C', min: 50, max: 54, points: 6 },
      { grade: 'C-', min: 45, max: 49, points: 5 },
      { grade: 'D+', min: 40, max: 44, points: 4 },
      { grade: 'D', min: 35, max: 39, points: 3 },
      { grade: 'D-', min: 30, max: 34, points: 2 },
      { grade: 'E', min: 0, max: 29, points: 1 },
    ];
  });

  // Load students from localStorage if available
  const [allStudents, setAllStudents] = useState<any[]>(() => {
    const saved = localStorage.getItem('alakara_students');
    return saved ? JSON.parse(saved) : [
      { id: 'S1', name: 'Alice Wanjiku', adm: 'ADM-2024-001', class: 'Form 1' },
      { id: 'S2', name: 'Bob Otieno', adm: 'ADM-2024-002', class: 'Form 2' },
      { id: 'S3', name: 'Charlie Mutua', adm: 'ADM-2024-003', class: 'Form 1' },
      { id: 'S4', name: 'Diana Anyango', adm: 'ADM-2024-004', class: 'Form 2' },
      { id: 'S5', name: 'Evans Kiprop', adm: 'ADM-2024-005', class: 'Form 1' },
    ];
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Only attempt to fetch if Supabase is configured
        if (import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY) {
          const fetchedStudents = await studentService.getAllStudents();
          if (fetchedStudents.length > 0) setAllStudents(fetchedStudents);
          
          const fetchedExams = await academicService.getExams();
          if (fetchedExams.length > 0) setExams(fetchedExams);
        }
      } catch (err) {
        console.error('Error loading data from Supabase:', err);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadExams = () => {
      const saved = localStorage.getItem('alakara_exams');
      if (saved) {
        setExams(JSON.parse(saved));
      }
    };
    loadExams();
    const interval = setInterval(loadExams, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    localStorage.setItem('alakara_marks', JSON.stringify(marks));
  }, [marks]);

  useEffect(() => {
    localStorage.setItem('alakara_students', JSON.stringify(allStudents));
  }, [allStudents]);

  const [newStudent, setNewStudent] = useState({ name: '', adm: '' });
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);

  const handleAddStudent = (e: FormEvent) => {
    e.preventDefault();
    const student = {
      id: Math.random().toString(36).substr(2, 9),
      ...newStudent,
      class: managedClass,
      status: 'Active'
    };
    setAllStudents([...allStudents, student]);
    setNewStudent({ name: '', adm: '' });
    setShowAddStudentModal(false);
    alert('Student admitted successfully!');
  };

  const deleteStudent = (id: string) => {
    if (window.confirm('Are you sure you want to remove this student?')) {
      setAllStudents(allStudents.filter(s => s.id !== id));
    }
  };

  const handleLogout = () => {
    navigate('/teacher-login');
  };

  const startMarkEntry = (exam: any) => {
    setActiveExam(exam);
    // Load existing marks for this exam if any
    const examMarks = marks.filter(m => m.examId === exam.id);
    const marksMap: any = {};
    examMarks.forEach(m => {
      marksMap[m.studentId] = m.score;
    });
    setCurrentMarks(marksMap);
  };

  const handleMarkChange = (studentId: string, score: string) => {
    if (activeExam.status !== 'Active') return;
    setCurrentMarks({ ...currentMarks, [studentId]: score });
  };

  const saveMarks = () => {
    const newMarks = [...marks.filter(m => m.examId !== activeExam.id)];
    Object.entries(currentMarks).forEach(([studentId, score]) => {
      newMarks.push({
        id: `${activeExam.id}-${studentId}`,
        examId: activeExam.id,
        studentId,
        score,
        subject: 'Mathematics', // Mock subject for demo
        updatedAt: new Date().toISOString()
      });
    });
    setMarks(newMarks);
    alert('Marks saved successfully!');
  };

  const handleBulkUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 }) as any[][];

      // Assuming format: [Admission No, Score]
      // Skip header row if it exists
      const newMarksMap = { ...currentMarks };
      data.forEach((row, index) => {
        if (index === 0 && isNaN(Number(row[1]))) return; // Skip header
        const admNo = String(row[0]).trim();
        const score = row[1];

        const student = allStudents.find(s => s.adm === admNo);
        if (student) {
          newMarksMap[student.id] = String(score);
        }
      });

      setCurrentMarks(newMarksMap);
      alert('Bulk marks loaded! Review and save to finalize.');
    };
    reader.readAsBinaryString(file);
  };

  const downloadMarksTemplate = () => {
    const data = [
      ['Admission Number', 'Score (0-100)'],
      ['ADM-2024-001', '85'],
      ['ADM-2024-002', '72']
    ];
    const ws = XLSX.utils.aoa_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Marks");
    XLSX.writeFile(wb, `${activeExam.title}_Marks_Template.xlsx`);
  };

  const [selectedRankingSubject, setSelectedRankingSubject] = useState('');

  const getAnalysisData = () => {
    if (!selectedAnalysisExamId) return [];
    
    const examMarks = marks.filter(m => m.examId === selectedAnalysisExamId);
    const exam = exams.find(e => e.id === selectedAnalysisExamId);
    if (!exam) return [];

    // Group marks by student - Filtered by assigned classes
    const studentAnalysis = allStudents
      .filter(s => exam.classes.includes(s.class) && assignedClasses.includes(s.class))
      .map(student => {
        const studentMarks = examMarks.filter(m => m.studentId === student.id);
        const subjectScores: any = {};
        let totalScore = 0;
        let subjectsCount = 0;

        learningAreas.forEach(la => {
          const mark = studentMarks.find(m => m.subject === la);
          const score = mark ? parseFloat(mark.score) : null;
          subjectScores[la] = score;
          if (score !== null) {
            totalScore += score;
            subjectsCount++;
          }
        });

        const average = subjectsCount > 0 ? totalScore / subjectsCount : 0;
        
        // Find grade
        const gradeObj = gradingSystem.find(g => average >= g.min && average <= g.max);
        const grade = gradeObj ? gradeObj.grade : 'E';

        return {
          id: student.id,
          name: student.name,
          adm: student.adm,
          class: student.class,
          subjectScores,
          totalScore,
          average,
          grade
        };
      });

    // Rank students
    const ranked = studentAnalysis.sort((a, b) => b.totalScore - a.totalScore);
    return ranked.map((s, index) => ({ ...s, rank: index + 1 }));
  };

  const handleIndividualStudentSelect = (studentId: string) => {
    const student = allStudents.find(s => s.id === studentId);
    setSelectedIndividualStudent(student);
    
    if (student && individualExamId) {
      const studentMarks = marks.filter(m => m.studentId === student.id && m.examId === individualExamId);
      const marksMap: any = {};
      studentMarks.forEach(m => {
        marksMap[m.subject] = m.score;
      });
      setIndividualMarks(marksMap);
    } else {
      setIndividualMarks({});
    }
  };

  const handleIndividualMarkChange = (subject: string, score: string) => {
    setIndividualMarks({ ...individualMarks, [subject]: score });
  };

  const saveIndividualMarks = () => {
    if (!selectedIndividualStudent || !individualExamId) {
      alert('Please select a student and an examination.');
      return;
    }

    const newMarks = [...marks.filter(m => !(m.studentId === selectedIndividualStudent.id && m.examId === individualExamId))];
    
    Object.entries(individualMarks).forEach(([subject, score]) => {
      if (score !== '') {
        newMarks.push({
          id: `${individualExamId}-${selectedIndividualStudent.id}-${subject}`,
          examId: individualExamId,
          studentId: selectedIndividualStudent.id,
          score,
          subject,
          updatedAt: new Date().toISOString()
        });
      }
    });

    setMarks(newMarks);
    alert('Individual marks saved successfully!');
  };
  const getSubjectRanking = () => {
    if (!selectedAnalysisExamId || !selectedRankingSubject) return [];
    
    const examMarks = marks.filter(m => m.examId === selectedAnalysisExamId && m.subject === selectedRankingSubject);
    
    const ranked = examMarks
      .map(m => {
        const student = allStudents.find(s => s.id === m.studentId);
        return {
          id: m.studentId,
          name: student?.name || 'Unknown',
          adm: student?.adm || 'N/A',
          score: parseFloat(m.score)
        };
      })
      .sort((a, b) => b.score - a.score);

    return ranked.map((s, index) => ({ ...s, rank: index + 1 }));
  };

  const analysisData = getAnalysisData();
  const subjectRanking = getSubjectRanking();

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-kenya-black text-white flex flex-col shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12 group cursor-pointer" onClick={() => navigate('/')}>
            <div className="bg-kenya-green p-2 rounded-lg group-hover:rotate-12 transition-transform">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">Alakara <span className="text-kenya-red">Staff</span></span>
          </div>

          <nav className="space-y-2">
            <button 
              onClick={() => { setActiveTab('exams'); setActiveExam(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'exams' ? 'bg-kenya-green text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <BookOpen className="w-5 h-5" />
              Examinations
            </button>
            <button 
              onClick={() => { setActiveTab('analysis'); setActiveExam(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'analysis' ? 'bg-kenya-green text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <BarChart3 className="w-5 h-5" />
              Exam Analysis
            </button>
            <button 
              onClick={() => { setActiveTab('individual-marks'); setActiveExam(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'individual-marks' ? 'bg-kenya-green text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <ClipboardList className="w-5 h-5" />
              Individual Marks
            </button>
            {teacherRole === 'Class Teacher' && (
              <button 
                onClick={() => { setActiveTab('class-management'); setActiveExam(null); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'class-management' ? 'bg-kenya-green text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
              >
                <Users className="w-5 h-5" />
                Class Management
              </button>
            )}
            <button 
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold transition-all ${activeTab === 'profile' ? 'bg-kenya-green text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
            >
              <LayoutDashboard className="w-5 h-5" />
              My Profile
            </button>
          </nav>
        </div>

        <div className="mt-auto p-8">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-kenya-red transition-all"
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
          <div className="flex items-center gap-4">
            <h2 className="font-bold text-kenya-black text-lg">
              {activeExam ? `Mark Entry: ${activeExam.title}` : 'Teacher Portal'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-kenya-black">Mr. Kamau</p>
              <p className="text-xs text-gray-500">Mathematics Dept.</p>
            </div>
            <div className="w-10 h-10 rounded-xl bg-kenya-green/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-kenya-green" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
          {activeTab === 'exams' ? (
            !activeExam ? (
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-black text-kenya-black uppercase tracking-tight">Active Examinations</h1>
                    <p className="text-gray-500">Select an exam to start entering or viewing marks.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {exams
                    .filter(exam => exam.classes.some((c: string) => assignedClasses.includes(c)))
                    .map((exam) => (
                      <motion.div
                        key={exam.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-kenya-green/10 p-3 rounded-2xl group-hover:rotate-6 transition-transform">
                          <BookOpen className="w-6 h-6 text-kenya-green" />
                        </div>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          exam.status === 'Active' ? 'bg-kenya-green/10 text-kenya-green' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {exam.status === 'Active' ? 'Open for Marks' : 'Processed (View Only)'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-kenya-black mb-1">{exam.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">{exam.term} - {exam.year}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        {exam.classes.map((c: string) => (
                          <span key={c} className="px-2 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-600 uppercase">
                            {c}
                          </span>
                        ))}
                      </div>

                      <Button 
                        onClick={() => startMarkEntry(exam)}
                        className="w-full gap-2 rounded-2xl"
                        variant={exam.status === 'Active' ? 'default' : 'secondary'}
                      >
                        {exam.status === 'Active' ? 'Enter Marks' : 'View Performance'}
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}

                  {exams.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
                      <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-xl font-bold text-gray-400 uppercase tracking-tight">No active exams assigned yet</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="flex items-center justify-between">
                  <button 
                    onClick={() => setActiveExam(null)}
                    className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-kenya-black transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Exams
                  </button>
                  <div className="flex items-center gap-4">
                    {activeExam.status === 'Active' && (
                      <>
                        <input 
                          type="file" 
                          id="bulk-upload" 
                          className="hidden" 
                          accept=".xlsx, .xls, .csv"
                          onChange={handleBulkUpload}
                        />
                        <Button 
                          variant="secondary" 
                          onClick={() => document.getElementById('bulk-upload')?.click()}
                          className="gap-2 rounded-2xl"
                        >
                          <Upload className="w-4 h-4" />
                          Bulk Upload (Excel)
                        </Button>
                        <Button 
                          variant="ghost" 
                          onClick={downloadMarksTemplate}
                          className="gap-2 rounded-2xl"
                        >
                          <Download className="w-4 h-4" />
                          Template
                        </Button>
                        <Button onClick={saveMarks} className="gap-2 rounded-2xl shadow-lg shadow-kenya-green/20">
                          <Save className="w-4 h-4" />
                          Save All Marks
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                  <div className="p-8 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-2xl font-bold text-kenya-black">Student Mark Entry</h2>
                        <p className="text-gray-500">Subject: Mathematics | Assigned Classes: {assignedClasses.join(', ')}</p>
                      </div>
                      {activeExam.status !== 'Active' && (
                        <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-xl font-bold text-sm">
                          <CheckCircle2 className="w-4 h-4" />
                          Marks Processed - Read Only
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                          <th className="px-8 py-4">Admission No</th>
                          <th className="px-8 py-4">Student Name</th>
                          <th className="px-8 py-4 w-48">Score (0-100)</th>
                          <th className="px-8 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {allStudents
                          .filter(s => activeExam.classes.includes(s.class) && assignedClasses.includes(s.class))
                          .map((student) => (
                            <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-8 py-6 font-mono text-sm text-gray-500">{student.adm}</td>
                            <td className="px-8 py-6 font-bold text-kenya-black">{student.name}</td>
                            <td className="px-8 py-6">
                              <input 
                                type="number"
                                min="0"
                                max="100"
                                value={currentMarks[student.id] || ''}
                                onChange={(e) => handleMarkChange(student.id, e.target.value)}
                                disabled={activeExam.status !== 'Active'}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20 font-bold text-lg disabled:opacity-50"
                                placeholder="--"
                              />
                            </td>
                            <td className="px-8 py-6">
                              {currentMarks[student.id] ? (
                                <span className="text-kenya-green flex items-center gap-1 text-xs font-bold uppercase">
                                  <CheckCircle2 className="w-4 h-4" />
                                  Entered
                                </span>
                              ) : (
                                <span className="text-gray-300 flex items-center gap-1 text-xs font-bold uppercase">
                                  <Clock className="w-4 h-4" />
                                  Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )
          ) : activeTab === 'individual-marks' ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-kenya-black uppercase tracking-tight">Individual Marks Upload</h1>
                  <p className="text-gray-500">Enter marks for a specific student across all subjects.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-kenya-black mb-4">Select Context</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Examination</label>
                        <select 
                          value={individualExamId}
                          onChange={(e) => {
                            setIndividualExamId(e.target.value);
                            setSelectedIndividualStudent(null);
                            setIndividualMarks({});
                          }}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20 font-bold text-sm"
                        >
                          <option value="">Select Exam...</option>
                          {exams
                            .filter(e => e.status === 'Active' && e.classes.some((c: string) => assignedClasses.includes(c)))
                            .map(e => (
                              <option key={e.id} value={e.id}>{e.title}</option>
                            ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Student</label>
                        <div className="space-y-2">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input 
                              type="text"
                              placeholder="Search student..."
                              value={studentSearchQuery}
                              onChange={(e) => setStudentSearchQuery(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20 font-bold text-sm"
                            />
                          </div>
                          <select 
                            value={selectedIndividualStudent?.id || ''}
                            onChange={(e) => handleIndividualStudentSelect(e.target.value)}
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20 font-bold text-sm"
                          >
                            <option value="">Select Student...</option>
                            {allStudents
                              .filter(s => assignedClasses.includes(s.class))
                              .filter(s => s.name.toLowerCase().includes(studentSearchQuery.toLowerCase()) || s.adm.toLowerCase().includes(studentSearchQuery.toLowerCase()))
                              .sort((a, b) => a.name.localeCompare(b.name))
                              .map(s => (
                                <option key={s.id} value={s.id}>{s.name} ({s.adm})</option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {selectedIndividualStudent && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-kenya-black text-white p-6 rounded-3xl shadow-xl"
                    >
                      <h3 className="font-bold mb-4 flex items-center gap-2">
                        <Users className="w-4 h-4 text-kenya-green" />
                        Student Details
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-xs text-gray-400">Name</span>
                          <span className="text-sm font-bold">{selectedIndividualStudent.name}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-xs text-gray-400">Student ID</span>
                          <span className="text-sm font-mono">{selectedIndividualStudent.adm}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/10 pb-2">
                          <span className="text-xs text-gray-400">Class</span>
                          <span className="text-sm font-bold">{selectedIndividualStudent.class}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-xs text-gray-400">Section</span>
                          <span className="text-sm font-bold">{selectedIndividualStudent.stream || 'A'}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                <div className="lg:col-span-2">
                  {!selectedIndividualStudent || !individualExamId ? (
                    <div className="bg-white rounded-[2.5rem] border-4 border-dashed border-gray-100 p-20 text-center">
                      <ClipboardList className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                      <p className="text-gray-400 font-bold uppercase tracking-widest">Select an exam and student to enter marks</p>
                    </div>
                  ) : (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden"
                    >
                      <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                        <h3 className="font-bold text-kenya-black">Subject-wise Marks Entry</h3>
                        <Button onClick={saveIndividualMarks} className="gap-2 rounded-2xl">
                          <Save className="w-4 h-4" />
                          Save Student Marks
                        </Button>
                      </div>
                      <div className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {learningAreas.map((subject) => (
                            <div key={subject} className="space-y-2">
                              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">{subject}</label>
                              <div className="relative">
                                <input 
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={individualMarks[subject] || ''}
                                  onChange={(e) => handleIndividualMarkChange(subject, e.target.value)}
                                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20 font-bold text-lg"
                                  placeholder="--"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold">%</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          ) : activeTab === 'analysis' ? (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-kenya-black">Performance Analysis</h3>
                    <p className="text-sm text-gray-500">View detailed results and subject rankings.</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <select 
                      value={selectedAnalysisExamId}
                      onChange={(e) => setSelectedAnalysisExamId(e.target.value)}
                      className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20 font-bold text-sm"
                    >
                      <option value="">Select Examination...</option>
                      {exams
                        .filter(e => e.classes.some((c: string) => assignedClasses.includes(c)))
                        .map(e => (
                          <option key={e.id} value={e.id}>{e.title} ({e.term} {e.year})</option>
                        ))}
                    </select>
                    
                    {selectedAnalysisExamId && (
                      <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={analysisOptions.showGrades}
                            onChange={(e) => setAnalysisOptions({...analysisOptions, showGrades: e.target.checked})}
                            className="w-4 h-4 rounded border-gray-300 text-kenya-green focus:ring-kenya-green"
                          />
                          <span className="text-xs font-bold text-gray-600">Show Grades</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox"
                            checked={analysisOptions.showRank}
                            onChange={(e) => setAnalysisOptions({...analysisOptions, showRank: e.target.checked})}
                            className="w-4 h-4 rounded border-gray-300 text-kenya-green focus:ring-kenya-green"
                          />
                          <span className="text-xs font-bold text-gray-600">Show Rank</span>
                        </label>
                      </div>
                    )}
                  </div>
                </div>

                {!selectedAnalysisExamId ? (
                  <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium italic">Please select an examination to begin analysis.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50 text-[10px] font-black text-gray-400 uppercase tracking-wider border-b border-gray-100">
                          {analysisOptions.showRank && <th className="px-4 py-4 sticky left-0 bg-gray-50 z-10">Rank</th>}
                          <th className="px-4 py-4 sticky left-0 bg-gray-50 z-10">Adm No</th>
                          <th className="px-4 py-4 sticky left-0 bg-gray-50 z-10 min-w-[150px]">Student Name</th>
                          {learningAreas.map(la => (
                            <th key={la} className="px-4 py-4 text-center min-w-[80px]">{la}</th>
                          ))}
                          <th className="px-4 py-4 text-center font-black text-kenya-black">Total</th>
                          <th className="px-4 py-4 text-center font-black text-kenya-black">Avg</th>
                          {analysisOptions.showGrades && <th className="px-4 py-4 text-center font-black text-kenya-black">Grade</th>}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {analysisData.map((row: any) => (
                          <tr key={row.id} className="hover:bg-gray-50/50 transition-colors text-sm">
                            {analysisOptions.showRank && (
                              <td className="px-4 py-4 sticky left-0 bg-white z-10">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-black ${
                                  row.rank === 1 ? 'bg-yellow-100 text-yellow-700' : 
                                  row.rank === 2 ? 'bg-gray-100 text-gray-600' :
                                  row.rank === 3 ? 'bg-orange-100 text-orange-700' : 'text-gray-400'
                                }`}>
                                  {row.rank}
                                </span>
                              </td>
                            )}
                            <td className="px-4 py-4 font-mono text-xs text-gray-500 sticky left-0 bg-white z-10">{row.adm}</td>
                            <td className="px-4 py-4 font-bold text-kenya-black sticky left-0 bg-white z-10">{row.name}</td>
                            {learningAreas.map(la => {
                              const score = row.subjectScores[la];
                              const gradeObj = gradingSystem.find(g => score !== null && score >= g.min && score <= g.max);
                              return (
                                <td key={la} className="px-4 py-4 text-center">
                                  <div className="flex flex-col items-center">
                                    <span className={`font-bold ${score === null ? 'text-gray-300' : 'text-kenya-black'}`}>
                                      {score !== null ? score : '--'}
                                    </span>
                                    {analysisOptions.showGrades && score !== null && (
                                      <span className="text-[10px] font-black text-kenya-green">{gradeObj?.grade}</span>
                                    )}
                                  </div>
                                </td>
                              );
                            })}
                            <td className="px-4 py-4 text-center font-black text-kenya-black">{row.totalScore.toFixed(0)}</td>
                            <td className="px-4 py-4 text-center font-bold text-kenya-green">{row.average.toFixed(1)}%</td>
                            {analysisOptions.showGrades && (
                              <td className="px-4 py-4 text-center">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-kenya-green/10 text-kenya-green">
                                  {row.grade}
                                </span>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {selectedAnalysisExamId && (
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-kenya-black">Subject Ranking</h3>
                      <p className="text-sm text-gray-500">Rank students based on individual learning areas.</p>
                    </div>
                    <select 
                      value={selectedRankingSubject}
                      onChange={(e) => setSelectedRankingSubject(e.target.value)}
                      className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20 font-bold text-sm"
                    >
                      <option value="">Select Subject...</option>
                      {learningAreas.map(la => (
                        <option key={la} value={la}>{la}</option>
                      ))}
                    </select>
                  </div>

                  {!selectedRankingSubject ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <Filter className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400 font-medium">Select a subject to view rankings.</p>
                    </div>
                  ) : subjectRanking.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                      <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-400 font-medium">No marks recorded for this subject yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {subjectRanking.slice(0, 10).map((row) => (
                        <div key={row.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${
                            row.rank === 1 ? 'bg-yellow-400 text-white' : 
                            row.rank === 2 ? 'bg-gray-300 text-white' :
                            row.rank === 3 ? 'bg-orange-400 text-white' : 'bg-white text-gray-400 border border-gray-200'
                          }`}>
                            {row.rank}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-kenya-black truncate">{row.name}</p>
                            <p className="text-[10px] text-gray-500 font-mono uppercase">{row.adm}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-black text-kenya-green">{row.score}%</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : activeTab === 'class-management' ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-black text-kenya-black uppercase tracking-tight">Class Management</h1>
                  <p className="text-gray-500">Managing learners for <span className="font-bold text-kenya-green">{managedClass}</span></p>
                </div>
                <Button onClick={() => setShowAddStudentModal(true)} className="gap-2 rounded-2xl shadow-lg shadow-kenya-green/20">
                  <Plus className="w-5 h-5" />
                  Admit New Learner
                </Button>
              </div>

              <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <th className="px-8 py-4">Admission No</th>
                        <th className="px-8 py-4">Student Name</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {allStudents.filter(s => s.class === managedClass).map((student) => (
                        <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-8 py-6 font-mono text-sm text-gray-500">{student.adm}</td>
                          <td className="px-8 py-6 font-bold text-kenya-black">{student.name}</td>
                          <td className="px-8 py-6">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black bg-kenya-green/10 text-kenya-green uppercase">
                              Active
                            </span>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => deleteStudent(student.id)}
                              className="p-2 text-gray-400 hover:text-kenya-red transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h2 className="text-2xl font-bold text-kenya-black mb-4">My Profile</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 rounded-full bg-kenya-green/10 flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-kenya-green" />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-kenya-black">Mr. John Kamau</p>
                    <p className="text-gray-500">Mathematics Department</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border border-gray-100 rounded-xl">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Email Address</p>
                    <p className="font-bold text-kenya-black">j.kamau@alakara.ac.ke</p>
                  </div>
                  <div className="p-4 border border-gray-100 rounded-xl">
                    <p className="text-xs text-gray-400 uppercase font-bold mb-1">Staff ID</p>
                    <p className="font-bold text-kenya-black">STF-2024-088</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Add Student Modal */}
        {showAddStudentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-kenya-black/60 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl border border-gray-100"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-kenya-black">Admit New Learner</h3>
                <button onClick={() => setShowAddStudentModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddStudent} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-kenya-black ml-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={newStudent.name}
                    onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20"
                    placeholder="e.g. John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-kenya-black ml-1">Admission Number</label>
                  <input 
                    type="text" 
                    required
                    value={newStudent.adm}
                    onChange={(e) => setNewStudent({...newStudent, adm: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-kenya-green/20"
                    placeholder="e.g. ADM-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-kenya-black ml-1">Class</label>
                  <input 
                    type="text" 
                    value={managedClass}
                    disabled
                    className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 font-bold"
                  />
                </div>
                <Button type="submit" className="w-full py-4 rounded-xl font-bold">Admit Learner</Button>
              </form>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
};
