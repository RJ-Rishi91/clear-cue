import React, { useState, useEffect } from 'react';
import { UserProfile, AccountRole } from '../types';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  LogIn, 
  UserPlus, 
  AlertCircle, 
  CheckCircle2, 
  Database, 
  Sparkles,
  Shield,
  Eye,
  EyeOff,
  Crown,
  GraduationCap,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { loginUser, registerUser, fetchBackendStatus, BackendStatus } from '../utils/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
  initialMode?: 'login' | 'signup';
}

const VA_ROLES = [
  'Insurance Operations Specialist (VA)',
  'Commercial Lines Account Manager',
  'Personal Lines CSR / Assistant',
  'Claims & Endorsements Specialist',
  'Certificate of Insurance (COI) Specialist',
  'Underwriting & Renewal Assistant',
  'BPO Team Lead / Quality Coach',
];

const POPULAR_AGENCIES = [
  'CoverDirect Agency US',
  'Summit Peak Risk Partners',
  'Beacon Heritage Insurance Group',
  'Valor Commercial Underwriters',
  'ClearCue Training Academy',
];

interface QuickRoleAccount {
  role: AccountRole;
  label: string;
  badge: string;
  username: string;
  password: string;
  name: string;
  desc: string;
  icon: any;
  colorClass: string;
  bgClass: string;
}

const QUICK_ROLE_ACCOUNTS: QuickRoleAccount[] = [
  {
    role: 'master',
    label: 'Master',
    badge: 'Super Admin',
    username: 'master',
    password: 'MasterPassword123!',
    name: 'Chief Master Supervisor',
    desc: 'Full system control, manage roles & platform settings',
    icon: Crown,
    colorClass: 'text-amber-500 border-amber-300 bg-amber-50 hover:bg-amber-100/80',
    bgClass: 'bg-amber-500',
  },
  {
    role: 'admin',
    label: 'Admin',
    badge: 'Operations',
    username: 'admin',
    password: 'AdminPassword123!',
    name: 'Operations Admin Director',
    desc: 'Organization metrics, roster & team oversight',
    icon: ShieldCheck,
    colorClass: 'text-blue-600 border-blue-300 bg-blue-50 hover:bg-blue-100/80',
    bgClass: 'bg-blue-600',
  },
  {
    role: 'teacher',
    label: 'Teacher',
    badge: 'Instructor',
    username: 'teacher',
    password: 'TeacherPassword123!',
    name: 'Professor Cuckoo (Lead Coach)',
    desc: 'Student rosters, call evaluations & feedback',
    icon: GraduationCap,
    colorClass: 'text-emerald-700 border-emerald-300 bg-emerald-50 hover:bg-emerald-100/80',
    bgClass: 'bg-emerald-700',
  },
  {
    role: 'user',
    label: 'User',
    badge: 'Trainee',
    username: 'user',
    password: 'UserPassword123!',
    name: 'Alex Taylor (Trainee)',
    desc: 'Interactive 7 Cs, AI Mock Calls & drills',
    icon: UserCheck,
    colorClass: 'text-slate-700 border-slate-300 bg-slate-50 hover:bg-slate-100/80',
    bgClass: 'bg-slate-700',
  },
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [backendStatus, setBackendStatus] = useState<BackendStatus | null>(null);

  // Login form state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Signup form state
  const [signupName, setSignupName] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [signupAccountRole, setSignupAccountRole] = useState<AccountRole>('user');
  const [signupRole, setSignupRole] = useState(VA_ROLES[0]);
  const [signupAgency, setSignupAgency] = useState(POPULAR_AGENCIES[0]);
  const [signupAvatar, setSignupAvatar] = useState('avatar-1');

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setError(null);
      setSuccessMsg(null);
      checkStatus();
    }
  }, [isOpen, initialMode]);

  const checkStatus = async () => {
    try {
      const status = await fetchBackendStatus();
      setBackendStatus(status);
    } catch {
      // Offline or mock
    }
  };

  if (!isOpen) return null;

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginIdentifier.trim() || !loginPassword.trim()) {
      setError('Please enter your username/email and password.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await loginUser({
        identifier: loginIdentifier.trim(),
        password: loginPassword,
      });
      setSuccessMsg(`Welcome back, ${res.user.name} (${res.user.accountRole?.toUpperCase() || 'USER'})!`);
      setTimeout(() => {
        onAuthSuccess(res.user);
        onClose();
      }, 600);
    } catch (err: any) {
      setError(err.message || 'Invalid username/email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim() || !signupUsername.trim() || !signupPassword.trim()) {
      setError('Full Name, Username, and Password are required.');
      return;
    }

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match. Please verify your password confirmation.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await registerUser({
        name: signupName.trim(),
        username: signupUsername.trim(),
        email: signupEmail.trim() || undefined,
        password: signupPassword,
        accountRole: signupAccountRole,
        role: signupRole,
        agency: signupAgency,
        avatar: signupAvatar,
      });
      setSuccessMsg(`Account created! Welcome, ${res.user.name} (${signupAccountRole.toUpperCase()}).`);
      setTimeout(() => {
        onAuthSuccess(res.user);
        onClose();
      }, 700);
    } catch (err: any) {
      setError(err.message || 'Could not register user. Try a different username.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleSelect = async (account: QuickRoleAccount) => {
    setLoginIdentifier(account.username);
    setLoginPassword(account.password);
    try {
      setLoading(true);
      setError(null);
      const res = await loginUser({
        identifier: account.username,
        password: account.password,
      });
      setSuccessMsg(`Logged in as ${account.label} (${res.user.name})!`);
      setTimeout(() => {
        onAuthSuccess(res.user);
        onClose();
      }, 500);
    } catch {
      // If user was wiped or not initialized, try registering it immediately
      try {
        const res = await registerUser({
          username: account.username,
          password: account.password,
          name: account.name,
          email: `${account.username}@clearcue.app`,
          role: account.role === 'teacher' ? 'Lead Insurance Communication Instructor' : 
                account.role === 'master' ? 'System Master Administrator' :
                account.role === 'admin' ? 'Agency Operations Director' : 'Insurance CSR (Trainee)',
          accountRole: account.role,
          agency: 'ClearCue Operations',
          avatar: account.role === 'master' ? 'avatar-4' : account.role === 'admin' ? 'avatar-2' : account.role === 'teacher' ? 'avatar-5' : 'avatar-1',
        });
        setSuccessMsg(`Initialized & Logged in as ${account.label}!`);
        setTimeout(() => {
          onAuthSuccess(res.user);
          onClose();
        }, 500);
      } catch (regErr: any) {
        setError(regErr.message || `Login as ${account.label} failed.`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/65 backdrop-blur-xs animate-fade-in">
      <div 
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with decorative brand banner */}
        <div className="bg-[#14362b] text-white px-6 pt-5 pb-4 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif tracking-tight text-white">
                {mode === 'login' ? 'ClearCue Access Portal' : 'Create ClearCue Account'}
              </h2>
            </div>
          </div>
          <p className="text-xs text-emerald-100/80 pl-10.5">
            {mode === 'login'
              ? 'Multi-role sign in: Master, Admin, Teacher, and User accounts'
              : 'Join as a Trainee, Teacher/Coach, Operations Admin, or Master'}
          </p>

          {/* Database & Cloud Deployment Status Badge */}
          <div className="mt-3 pt-2.5 border-t border-emerald-800/60 flex items-center justify-between text-[11px] text-emerald-200/90 font-medium">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              <span>Database Engine:</span>
              <strong className="text-white font-semibold">
                {backendStatus?.mongoConnected ? 'MongoDB Atlas Cloud' : 'SQLite Local Persistent Store'}
              </strong>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="Database Active" />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50/80 px-6 pt-2">
          <button
            onClick={() => {
              setMode('login');
              setError(null);
            }}
            className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'login'
                ? 'border-[#14362b] text-[#14362b]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
          <button
            onClick={() => {
              setMode('signup');
              setError(null);
            }}
            className={`flex-1 pb-3 text-xs font-bold transition-all border-b-2 flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'signup'
                ? 'border-[#14362b] text-[#14362b]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start gap-2 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">{successMsg}</span>
            </div>
          )}

          {mode === 'login' ? (
            <div className="space-y-4">
              {/* Quick 1-Click Role Login Grid */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                  1-Click Role Fast Login
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_ROLE_ACCOUNTS.map((acc) => {
                    const IconComponent = acc.icon;
                    return (
                      <button
                        key={acc.role}
                        type="button"
                        onClick={() => handleQuickRoleSelect(acc)}
                        disabled={loading}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${acc.colorClass}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="flex items-center gap-1.5 font-bold text-xs">
                            <IconComponent className="w-3.5 h-3.5" />
                            <span>{acc.label}</span>
                          </span>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-white/80 uppercase shadow-2xs">
                            {acc.badge}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-600 leading-tight">
                          {acc.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-200"></div>
                <span className="flex-shrink mx-3 text-[11px] text-slate-400 uppercase font-semibold">Or Sign In Manually</span>
                <div className="flex-grow border-t border-slate-200"></div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Username or Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="e.g. master, admin, teacher, or user"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 px-4 bg-[#14362b] hover:bg-[#0e271f] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <LogIn className="w-3.5 h-3.5 text-emerald-300" />
                      <span>Sign In with Credentials</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          ) : (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              {/* Account Role Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  System Account Role *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {[
                    { id: 'user', label: 'User', icon: UserCheck, desc: 'Trainee' },
                    { id: 'teacher', label: 'Teacher', icon: GraduationCap, desc: 'Instructor' },
                    { id: 'admin', label: 'Admin', icon: ShieldCheck, desc: 'Manager' },
                    { id: 'master', label: 'Master', icon: Crown, desc: 'Super' },
                  ].map((item) => {
                    const isSelected = signupAccountRole === item.id;
                    const IconComp = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSignupAccountRole(item.id as AccountRole)}
                        className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-0.5 ${
                          isSelected
                            ? 'border-[#14362b] bg-emerald-50 text-[#14362b] font-bold shadow-2xs'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <IconComp className={`w-3.5 h-3.5 ${isSelected ? 'text-emerald-700' : 'text-slate-400'}`} />
                        <span className="text-xs">{item.label}</span>
                        <span className="text-[9px] text-slate-400">{item.desc}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Username *
                  </label>
                  <input
                    type="text"
                    required
                    value={signupUsername}
                    onChange={(e) => setSignupUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_'))}
                    placeholder="sarah_j"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Work Email (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="name@agency.com"
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupPassword(!showSignupPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                      aria-label="Toggle password visibility"
                    >
                      {showSignupPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <input
                      type={showSignupConfirmPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={signupConfirmPassword}
                      onChange={(e) => setSignupConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full pl-3 pr-9 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                      aria-label="Toggle confirm password visibility"
                    >
                      {showSignupConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Professional / Industry Title
                </label>
                <select
                  value={signupRole}
                  onChange={(e) => setSignupRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                >
                  {VA_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Agency / Organization
                </label>
                <input
                  type="text"
                  value={signupAgency}
                  onChange={(e) => setSignupAgency(e.target.value)}
                  placeholder="e.g. CoverDirect Agency US"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-2.5 px-4 bg-[#14362b] hover:bg-[#0e271f] text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5 text-emerald-300" />
                    <span>Complete {signupAccountRole.toUpperCase()} Registration</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Cloud hosting architecture notes */}
          <div className="pt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <p className="flex items-center gap-1 font-semibold text-slate-700 mb-0.5">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              <span>Multi-Tier Role Architecture</span>
            </p>
            <p>
              Master, Admin, Teacher, and User roles are fully authenticated with JWT & persistent storage in MongoDB Atlas & SQLite.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
