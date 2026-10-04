import React, { useState, useEffect } from 'react';
import { UserProfile, AccountRole } from '../types';
import { 
  Crown, 
  Users, 
  ShieldCheck, 
  GraduationCap, 
  UserCheck, 
  Trash2, 
  RefreshCw, 
  Search, 
  Database, 
  Server, 
  Activity,
  Award,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { fetchAdminUsers, updateUserRole, deleteAdminUser, AdminUserRecord, fetchBackendStatus, BackendStatus } from '../utils/api';

interface MasterPanelProps {
  currentUser: UserProfile;
}

export const MasterPanel: React.FC<MasterPanelProps> = ({ currentUser }) => {
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | AccountRole>('all');
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [userList, status] = await Promise.all([
        fetchAdminUsers(),
        fetchBackendStatus().catch(() => null),
      ]);
      setUsers(userList);
      setBackendStatus(status);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch platform users.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRoleChange = async (userId: string, newRole: AccountRole) => {
    try {
      setActionLoadingId(userId);
      await updateUserRole(userId, newRole);
      setSuccessMsg(`User role updated to ${newRole.toUpperCase()}.`);
      setTimeout(() => setSuccessMsg(null), 3000);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, accountRole: newRole } : u));
    } catch (err: any) {
      setError(err.message || 'Failed to update user role.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (userId === currentUser.id) {
      alert('You cannot delete your own Master account.');
      return;
    }
    if (!window.confirm(`Are you sure you want to delete user "${userName}"? This will erase all training records.`)) {
      return;
    }

    try {
      setActionLoadingId(userId);
      await deleteAdminUser(userId);
      setSuccessMsg(`User "${userName}" deleted.`);
      setTimeout(() => setSuccessMsg(null), 3000);
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete user.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.agency || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || (u.accountRole || 'user') === roleFilter;
    return matchesSearch && matchesRole;
  });

  const roleCounts = {
    master: users.filter(u => u.accountRole === 'master').length,
    admin: users.filter(u => u.accountRole === 'admin').length,
    teacher: users.filter(u => u.accountRole === 'teacher').length,
    user: users.filter(u => (u.accountRole || 'user') === 'user').length,
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-950 via-[#14362b] to-slate-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-inner">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold font-serif tracking-tight">Master Control Console</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30 uppercase tracking-wider">
                  Root Admin
                </span>
              </div>
              <p className="text-xs text-amber-100/80 mt-0.5">
                Full platform governance: Multi-role hierarchy, user access management, and system telemetry.
              </p>
            </div>
          </div>

          <button
            onClick={loadData}
            disabled={loading}
            className="self-start md:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/10 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Roster</span>
          </button>
        </div>

        {/* Telemetry quick strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-amber-200/70 block">Total Users</span>
            <span className="text-xl font-bold text-white">{users.length}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-amber-200/70 block">Database</span>
            <span className="text-sm font-bold text-emerald-300 flex items-center gap-1.5 mt-1">
              <Database className="w-3.5 h-3.5" />
              <span className="truncate">{backendStatus?.database || 'Connected'}</span>
            </span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-amber-200/70 block">Teachers & Admins</span>
            <span className="text-xl font-bold text-white">{roleCounts.teacher + roleCounts.admin}</span>
          </div>
          <div className="bg-white/5 rounded-xl p-3 border border-white/5">
            <span className="text-[11px] text-amber-200/70 block">Active Trainees</span>
            <span className="text-xl font-bold text-white">{roleCounts.user}</span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-3">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">{successMsg}</span>
        </div>
      )}

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, username, agency..."
            className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Role Filter Chips */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'master', 'admin', 'teacher', 'user'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap capitalize ${
                roleFilter === r
                  ? 'bg-[#14362b] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {r === 'all' ? `All (${users.length})` : `${r} (${roleCounts[r]})`}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-3.5 px-4">User</th>
                <th className="py-3.5 px-4">Account Role</th>
                <th className="py-3.5 px-4">Organization & Title</th>
                <th className="py-3.5 px-4">Messages Checked</th>
                <th className="py-3.5 px-4">Avg Score</th>
                <th className="py-3.5 px-4">Streak</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    No users matching the current query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const role = u.accountRole || 'user';
                  const isCurrent = u.id === currentUser.id;
                  const isBusy = actionLoadingId === u.id;

                  const roleBadgeConfig = {
                    master: 'bg-amber-100 text-amber-900 border-amber-300',
                    admin: 'bg-blue-100 text-blue-900 border-blue-300',
                    teacher: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                    user: 'bg-slate-100 text-slate-800 border-slate-200',
                  }[role] || 'bg-slate-100 text-slate-800 border-slate-200';

                  return (
                    <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#14362b] text-white flex items-center justify-center font-bold text-xs font-serif shrink-0">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 flex items-center gap-1.5">
                              <span>{u.name}</span>
                              {isCurrent && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-800 font-bold">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">@{u.username} {u.email ? `• ${u.email}` : ''}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5">
                          <select
                            value={role}
                            disabled={isCurrent || isBusy}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as AccountRole)}
                            className={`text-xs font-bold px-2 py-1 rounded-lg border cursor-pointer ${roleBadgeConfig} disabled:opacity-75`}
                          >
                            <option value="user">User (Trainee)</option>
                            <option value="teacher">Teacher (Instructor)</option>
                            <option value="admin">Admin (Manager)</option>
                            <option value="master">Master (Super Admin)</option>
                          </select>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-800 truncate max-w-[180px]">{u.agency || 'CoverDirect'}</div>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{u.role}</div>
                      </td>

                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        {u.totalChecked || 0}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`inline-block font-bold px-2 py-0.5 rounded-full text-[11px] ${
                          (u.averageScore || 0) >= 85 ? 'bg-emerald-100 text-emerald-800' :
                          (u.averageScore || 0) >= 70 ? 'bg-amber-100 text-amber-800' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {u.averageScore || 0}%
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 font-semibold">
                        {u.streakDays || 1} d
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {!isCurrent && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            disabled={isBusy}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
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
  );
};
