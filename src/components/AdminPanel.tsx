import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  ShieldCheck, 
  Users, 
  Award, 
  TrendingUp, 
  Target, 
  Search, 
  RefreshCw,
  Building2,
  FileSpreadsheet,
  CheckCircle2
} from 'lucide-react';
import { fetchAdminUsers, AdminUserRecord } from '../utils/api';

interface AdminPanelProps {
  currentUser: UserProfile;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminUsers();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch team records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const trainees = users.filter(u => (u.accountRole || 'user') === 'user');
  const teachers = users.filter(u => u.accountRole === 'teacher');
  const admins = users.filter(u => u.accountRole === 'admin');

  const totalAudits = users.reduce((acc, u) => acc + (u.totalChecked || 0), 0);
  const avgOverallScore = trainees.length > 0 
    ? Math.round(trainees.reduce((acc, u) => acc + (u.averageScore || 0), 0) / trainees.length)
    : 0;

  const filteredTrainees = trainees.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.agency || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-[#14362b] to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-blue-500/20 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-serif tracking-tight">Operations Admin Portal</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-400/20 text-blue-200 border border-blue-400/30 uppercase">
                  Management
                </span>
              </div>
              <p className="text-xs text-blue-100/80 mt-0.5">
                Organizational oversight: Training compliance, cohort analytics, and operational communication standards.
              </p>
            </div>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Stats</span>
          </button>
        </div>

        {/* Aggregate KPI Bento */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-blue-200/70 block">Active Trainees</span>
            <span className="text-2xl font-bold text-white">{trainees.length}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-blue-200/70 block">Total Audits Conducted</span>
            <span className="text-2xl font-bold text-white">{totalAudits}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-blue-200/70 block">Cohort Average Score</span>
            <span className="text-2xl font-bold text-emerald-300">{avgOverallScore}%</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-blue-200/70 block">Assigned Instructors</span>
            <span className="text-2xl font-bold text-white">{teachers.length}</span>
          </div>
        </div>
      </div>

      {/* Trainees Performance Table */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search trainees by name or agency..."
              className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredTrainees.length}</strong> active trainees
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Trainee</th>
                  <th className="py-3.5 px-4">Agency</th>
                  <th className="py-3.5 px-4">Messages Audited</th>
                  <th className="py-3.5 px-4">Avg Score</th>
                  <th className="py-3.5 px-4">Active Streak</th>
                  <th className="py-3.5 px-4">Compliance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTrainees.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No trainees found.
                    </td>
                  </tr>
                ) : (
                  filteredTrainees.map((t) => {
                    const score = t.averageScore || 0;
                    const isProficient = score >= 80;
                    return (
                      <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#14362b] text-white flex items-center justify-center font-bold text-xs font-serif shrink-0">
                              {t.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-slate-900">{t.name}</div>
                              <div className="text-[10px] text-slate-400">@{t.username}</div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-medium text-slate-700">
                          {t.agency || 'CoverDirect Agency'}
                        </td>

                        <td className="py-3.5 px-4 font-bold text-slate-800">
                          {t.totalChecked || 0}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-block font-bold px-2.5 py-0.5 rounded-full text-[11px] ${
                            score >= 85 ? 'bg-emerald-100 text-emerald-800' :
                            score >= 70 ? 'bg-amber-100 text-amber-800' :
                            'bg-slate-100 text-slate-700'
                          }`}>
                            {score}%
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-slate-600 font-semibold">
                          {t.streakDays || 1} days
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center gap-1 font-bold px-2 py-0.5 rounded-md text-[10px] ${
                            isProficient 
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>{isProficient ? 'Proficient' : 'In Training'}</span>
                          </span>
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
    </div>
  );
};
