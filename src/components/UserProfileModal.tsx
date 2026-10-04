import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { 
  X, 
  User, 
  Building2, 
  Briefcase, 
  Mail, 
  Database, 
  Check, 
  UserPlus, 
  Users, 
  Edit3, 
  Save, 
  Flame, 
  Award, 
  Send,
  Sparkles
} from 'lucide-react';
import { fetchUsers, createUser, updateUserProfile, fetchBackendStatus, BackendStatus } from '../utils/api';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onUserChanged: (user: UserProfile) => void;
  onOpenSignup?: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUserChanged,
  onOpenSignup,
}) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);

  // Edit form state
  const [editName, setEditName] = useState(currentUser.name);
  const [editRole, setEditRole] = useState(currentUser.role);
  const [editAgency, setEditAgency] = useState(currentUser.agency);
  const [editEmail, setEditEmail] = useState(currentUser.email || '');

  // New user form state
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('clearcue123');
  const [newRole, setNewRole] = useState('Insurance VA Trainee');
  const [newAgency, setNewAgency] = useState('CoverDirect Agency');

  useEffect(() => {
    if (isOpen) {
      loadUsers();
      fetchBackendStatus().then(setBackendStatus).catch(() => {});
      setEditName(currentUser.name);
      setEditRole(currentUser.role);
      setEditAgency(currentUser.agency);
      setEditEmail(currentUser.email || '');
      setIsEditing(false);
      setIsCreating(false);
      setError(null);
    }
  }, [isOpen, currentUser]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const list = await fetchUsers();
      setUsers(list);
    } catch (err: any) {
      setError(err.message || 'Failed to load user profiles from database');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const updated = await updateUserProfile(currentUser.id, {
        name: editName,
        role: editRole,
        agency: editAgency,
        email: editEmail,
      });
      onUserChanged(updated);
      setIsEditing(false);
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNewUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newUsername.trim()) {
      setError('Please provide both username and full name');
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const created = await createUser({
        username: newUsername.trim(),
        name: newName.trim(),
        role: newRole.trim(),
        agency: newAgency.trim(),
        password: newPassword.trim() || 'clearcue123',
      });
      onUserChanged(created);
      setIsCreating(false);
      setNewName('');
      setNewUsername('');
      setNewPassword('clearcue123');
      await loadUsers();
    } catch (err: any) {
      setError(err.message || 'Failed to create new user profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchUser = (user: UserProfile) => {
    onUserChanged(user);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#14362b] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700/80 border border-emerald-500/30 flex items-center justify-center font-bold text-white shadow-inner">
              <User className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold tracking-tight">User Account & AI Engine Settings</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-300 font-medium">
                  <Database className="w-3 h-3 text-emerald-400" />
                  {backendStatus?.database || 'SQLite Local Persistent Store'}
                </span>
                <span className="text-slate-400">•</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-200 font-medium">
                  <Sparkles className="w-3 h-3 text-emerald-300" /> 100% Free AI (No Paid Tools Required)
                </span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 font-medium">
              {error}
            </div>
          )}

          {/* AI Engine Status & Transparency Card */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                AI Engine: Active & Self-Contained (100% Free / No Paid API Needed)
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/80 text-emerald-900">
                $0 / Unlimited Local AI
              </span>
            </div>
            <p className="text-[11px] text-emerald-900/80 leading-relaxed">
              All 6 training modules (Message Analysis, Email Writer, AI Mock Calls, Voice Pronunciation, Practice Scenarios, and Professor Cuckoo Mascot) are fully equipped with built-in heuristic & phonetic engines that run locally on your system. No paid tools, paid subscriptions, or paid API keys are required.
            </p>
          </div>

          {/* Active Profile Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-200/80 shadow-xs">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#14362b] text-white flex items-center justify-center text-xl font-bold font-serif shadow-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-slate-900">{currentUser.name}</h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Active
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      currentUser.accountRole === 'master' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                      currentUser.accountRole === 'admin' ? 'bg-blue-100 text-blue-900 border border-blue-300' :
                      currentUser.accountRole === 'teacher' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                      'bg-slate-100 text-slate-800 border border-slate-200'
                    }`}>
                      {currentUser.accountRole || 'user'}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 mt-0.5">
                    <Briefcase className="w-3.5 h-3.5 text-emerald-600" />
                    {currentUser.role}
                  </p>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    {currentUser.agency}
                  </p>
                  {currentUser.email && (
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {currentUser.email}
                    </p>
                  )}
                </div>
              </div>

              {!isEditing && !isCreating && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 text-xs font-bold text-[#14362b] bg-white hover:bg-emerald-50 border border-emerald-200 rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Quick Metrics from DB */}
            <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-200/60">
              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-100 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
                  <Send className="w-3 h-3 text-emerald-600" /> Checks
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {currentUser.total_checked ?? 0}
                </div>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-100 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
                  <Award className="w-3 h-3 text-emerald-600" /> Avg Score
                </div>
                <div className="text-base font-bold text-emerald-700 mt-0.5">
                  {currentUser.average_score ?? 0}%
                </div>
              </div>
              <div className="bg-white/80 p-2.5 rounded-xl border border-slate-100 text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 text-amber-500" /> Streak
                </div>
                <div className="text-base font-bold text-slate-900 mt-0.5">
                  {currentUser.streak_days ?? 1} Days
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          {isEditing && (
            <form onSubmit={handleSaveProfile} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Update Profile Details</h4>
                <button 
                  type="button" 
                  onClick={() => setIsEditing(false)}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">VA Role</label>
                  <input
                    type="text"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Agency / Team</label>
                  <input
                    type="text"
                    value={editAgency}
                    onChange={(e) => setEditAgency(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 text-xs font-bold bg-[#14362b] text-white hover:bg-emerald-900 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" /> Save Changes
                </button>
              </div>
            </form>
          )}

          {/* Create New User Form */}
          {isCreating && (
            <form onSubmit={handleCreateNewUser} className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">Add New Trainee / Specialist Profile</h4>
                <button 
                  type="button" 
                  onClick={() => setIsCreating(false)}
                  className="text-xs text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Username (Identifier)</label>
                  <input
                    type="text"
                    placeholder="e.g. alex_chen"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Display Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Chen"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">VA Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Commercial Lines CSR"
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Agency Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Summit Risk Partners"
                    value={newAgency}
                    onChange={(e) => setNewAgency(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Account Password</label>
                  <input
                    type="password"
                    placeholder="Min 6 characters (default: clearcue123)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 text-xs font-bold bg-[#14362b] text-white hover:bg-emerald-900 rounded-lg shadow-xs flex items-center gap-1.5"
                >
                  <UserPlus className="w-3.5 h-3.5" /> Create Profile
                </button>
              </div>
            </form>
          )}

          {/* All Registered Profiles on SQLite / MongoDB */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-emerald-700" />
                Profiles in Database ({users.length})
              </h4>
              {!isCreating && (
                <div className="flex items-center gap-2">
                  {onOpenSignup && (
                    <button
                      onClick={() => {
                        onClose();
                        onOpenSignup();
                      }}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Full Registration
                    </button>
                  )}
                  <button
                    onClick={() => setIsCreating(true)}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> + New User
                  </button>
                </div>
              )}
            </div>

            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
              {users.map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <div
                    key={u.id}
                    className={`p-3.5 flex items-center justify-between transition-colors ${
                      isSelected ? 'bg-emerald-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm">
                        {u.name.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">{u.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">@{u.username}</span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          {u.role} • {u.agency}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right text-[11px] hidden sm:block">
                        <span className="font-semibold text-slate-700">{u.total_checked ?? 0} checks</span>
                        <span className="text-slate-400 mx-1">|</span>
                        <span className="font-semibold text-emerald-700">{u.average_score ?? 0}% avg</span>
                      </div>
                      {isSelected ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-600 text-white">
                          <Check className="w-3 h-3" /> Active
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSwitchUser(u)}
                          className="px-3 py-1 rounded-lg text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-200/70 border border-slate-300 transition-colors cursor-pointer"
                        >
                          Switch
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Training metrics, check histories & mock call evaluations sync to {backendStatus?.database || 'database'} automatically.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
