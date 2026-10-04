import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  GraduationCap, 
  Users, 
  Award, 
  BookOpen, 
  MessageSquare, 
  Search, 
  RefreshCw,
  PhoneCall,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Send
} from 'lucide-react';
import { fetchTeacherStudents, StudentProgressRecord } from '../utils/api';

interface TeacherStudioProps {
  currentUser: UserProfile;
}

export const TeacherStudio: React.FC<TeacherStudioProps> = ({ currentUser }) => {
  const [students, setStudents] = useState<StudentProgressRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<StudentProgressRecord | null>(null);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchTeacherStudents();
      setStudents(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch student roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (s.agency || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim() || !selectedStudent) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackText('');
      setFeedbackSent(false);
    }, 2500);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Teacher Studio Header */}
      <div className="bg-gradient-to-r from-emerald-950 via-[#14362b] to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-500/20 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-serif tracking-tight">Instructor Coaching Studio</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 uppercase">
                  Teacher
                </span>
              </div>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Instructional monitoring: Review student call audits, track 7 Cs mastery, and provide coaching feedback.
              </p>
            </div>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Update Students</span>
          </button>
        </div>

        {/* Quick Instructor Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-emerald-200/70 block">Enrolled Students</span>
            <span className="text-2xl font-bold text-white">{students.length}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-emerald-200/70 block">Total Exercises Audited</span>
            <span className="text-2xl font-bold text-white">
              {students.reduce((acc, s) => acc + (s.totalChecked || 0), 0)}
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-emerald-200/70 block">Class Avg Competency</span>
            <span className="text-2xl font-bold text-emerald-300">
              {students.length > 0 ? Math.round(students.reduce((acc, s) => acc + (s.averageScore || 0), 0) / students.length) : 0}%
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-emerald-200/70 block">Instructor Coach</span>
            <span className="text-sm font-bold text-white truncate mt-1 block">
              {currentUser.name}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Roster (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search students..."
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Click a student to view drill-down & leave coaching notes
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-3.5 px-4">Student</th>
                    <th className="py-3.5 px-4">Checks</th>
                    <th className="py-3.5 px-4">Avg Score</th>
                    <th className="py-3.5 px-4">Scenarios</th>
                    <th className="py-3.5 px-4">Streak</th>
                    <th className="py-3.5 px-4 text-right">Select</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400">
                        No students enrolled yet.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map((s) => {
                      const isSelected = selectedStudent?.id === s.id;
                      return (
                        <tr 
                          key={s.id} 
                          onClick={() => setSelectedStudent(s)}
                          className={`cursor-pointer transition-colors ${
                            isSelected ? 'bg-emerald-50/80 font-medium' : 'hover:bg-slate-50/70'
                          }`}
                        >
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-full bg-[#14362b] text-white flex items-center justify-center font-bold text-xs font-serif shrink-0">
                                {s.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{s.name}</div>
                                <div className="text-[10px] text-slate-400">@{s.username} • {s.agency}</div>
                              </div>
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {s.totalChecked || 0}
                          </td>

                          <td className="py-3.5 px-4">
                            <span className={`inline-block font-bold px-2 py-0.5 rounded-full text-[11px] ${
                              (s.averageScore || 0) >= 85 ? 'bg-emerald-100 text-emerald-800' :
                              (s.averageScore || 0) >= 70 ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-700'
                            }`}>
                              {s.averageScore || 0}%
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-slate-700 font-semibold">
                            {s.completedScenariosCount || 0}
                          </td>

                          <td className="py-3.5 px-4 text-slate-600">
                            {s.streakDays || 1} d
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <ChevronRight className={`w-4 h-4 ml-auto ${isSelected ? 'text-emerald-700' : 'text-slate-300'}`} />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Student Coaching Drawer (Right col) */}
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5">
            <h3 className="text-sm font-bold font-serif text-slate-900 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Student Performance Drill-Down</span>
            </h3>

            {selectedStudent ? (
              <div className="space-y-4">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-[#14362b] text-white flex items-center justify-center font-bold text-sm font-serif">
                      {selectedStudent.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">{selectedStudent.name}</div>
                      <div className="text-[11px] text-slate-500">{selectedStudent.role}</div>
                      <div className="text-[10px] text-emerald-800 font-semibold">{selectedStudent.agency}</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-200 text-center text-[11px]">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Audits</span>
                      <strong className="text-slate-800">{selectedStudent.totalChecked}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Score</span>
                      <strong className="text-emerald-700">{selectedStudent.averageScore}%</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Streak</span>
                      <strong className="text-amber-700">{selectedStudent.streakDays}d</strong>
                    </div>
                  </div>
                </div>

                {/* Coaching Advice Form */}
                <form onSubmit={handleSendFeedback} className="space-y-2.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Instructor Coaching Feedback Note
                  </label>
                  <textarea
                    rows={3}
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                    placeholder={`Write guidance for ${selectedStudent.name} (e.g. "Focus on Golden Rule #2: attach operational reasons to carrier requests")...`}
                    className="w-full p-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 px-3 bg-[#14362b] hover:bg-[#0e271f] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Send Coaching Note</span>
                  </button>
                  {feedbackSent && (
                    <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-1.5 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Coaching note recorded for student!</span>
                    </div>
                  )}
                </form>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 text-xs">
                Select a student from the roster on the left to inspect detailed scores and issue feedback.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
