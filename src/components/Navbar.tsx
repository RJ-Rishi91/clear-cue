import React, { useState } from 'react';
import { NavView, UserProfile } from '../types';
import { 
  BookOpen, 
  Send, 
  Target, 
  Award, 
  Info, 
  Home as HomeIcon, 
  Menu, 
  X, 
  PenLine, 
  Headphones, 
  Layers, 
  PhoneCall, 
  User, 
  Database,
  LogIn,
  LogOut,
  UserPlus,
  Settings,
  ChevronDown
} from 'lucide-react';

interface NavbarProps {
  currentView: NavView;
  onNavigate: (view: NavView) => void;
  checkedCount: number;
  currentUser?: UserProfile | null;
  onOpenProfileModal?: () => void;
  onOpenAuthModal?: (mode: 'login' | 'signup') => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  onNavigate, 
  checkedCount,
  currentUser,
  onOpenProfileModal,
  onOpenAuthModal,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: Array<{ id: NavView; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: 'Home', icon: <HomeIcon className="w-4 h-4" /> },
    { id: 'seven-cs', label: '7 Cs', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'check', label: 'Check Message', icon: <Send className="w-4 h-4" /> },
    { id: 'draft-email', label: 'Draft Email', icon: <PenLine className="w-4 h-4" /> },
    { id: 'mock-calls', label: 'AI Mock Calls', icon: <PhoneCall className="w-4 h-4" /> },
    { id: 'pronunciation', label: 'Pronunciation', icon: <Headphones className="w-4 h-4" /> },
    { id: 'flashcards', label: 'Flashcards', icon: <Layers className="w-4 h-4" /> },
    { id: 'practice', label: 'Practice', icon: <Target className="w-4 h-4" /> },
    { id: 'progress', label: 'Dashboard', icon: <Award className="w-4 h-4" /> },
    { id: 'about', label: 'About', icon: <Info className="w-4 h-4" /> },
  ];

  const handleNavClick = (view: NavView) => {
    onNavigate(view);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Brand Logo */}
          <button
            id="nav-logo-btn"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 group text-left cursor-pointer focus:outline-none shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-[#14362b] text-white flex items-center justify-center font-bold tracking-tight shadow-sm group-hover:bg-[#1f5242] transition-colors">
              <span className="text-base font-serif font-bold">CC</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900 font-serif">ClearCue</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium">Communication Coach</p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#14362b] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Medium Screen Navigation Links */}
          <nav className="hidden lg:flex xl:hidden items-center gap-1">
            {navItems.slice(0, 6).map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-md-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#14362b] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-full cursor-pointer"
            >
              More...
            </button>
          </nav>

          {/* Right Action CTAs & Auth Controls */}
          <div className="hidden sm:flex items-center gap-2">
            {currentUser ? (
              <div className="relative">
                <button
                  id="nav-user-profile-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all cursor-pointer whitespace-nowrap"
                  title={`${currentUser.name} (${currentUser.role})`}
                >
                  <div className="w-5 h-5 rounded-full bg-[#14362b] text-white flex items-center justify-center text-[10px] font-bold font-serif">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{currentUser.name.split(' ')[0]}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Database Connected" />
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Profile Dropdown Menu */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.role}</p>
                      {currentUser.agency && (
                        <p className="text-[10px] text-emerald-800 font-medium truncate mt-0.5">{currentUser.agency}</p>
                      )}
                    </div>

                    <div className="py-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleNavClick('progress');
                        }}
                        className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer font-medium"
                      >
                        <Award className="w-4 h-4 text-emerald-700" />
                        <span>My Progress Dashboard</span>
                      </button>

                      {onOpenProfileModal && (
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onOpenProfileModal();
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 cursor-pointer font-medium"
                        >
                          <Settings className="w-4 h-4 text-slate-500" />
                          <span>Account Settings & Database</span>
                        </button>
                      )}
                    </div>

                    {onLogout && (
                      <div className="pt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setUserDropdownOpen(false);
                            onLogout();
                          }}
                          className="w-full px-4 py-2 text-left text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 cursor-pointer font-bold"
                        >
                          <LogOut className="w-4 h-4 text-rose-600" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  id="nav-login-btn"
                  onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-500" />
                  <span>Log In</span>
                </button>
                <button
                  id="nav-signup-btn"
                  onClick={() => onOpenAuthModal && onOpenAuthModal('signup')}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#14362b] hover:bg-[#0e271f] text-white shadow-xs transition-all cursor-pointer whitespace-nowrap"
                >
                  <UserPlus className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}

            <button
              id="nav-check-message-cta"
              onClick={() => handleNavClick('check')}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-950 border border-emerald-300 transition-all cursor-pointer whitespace-nowrap"
            >
              <Send className="w-3.5 h-3.5 text-emerald-700" />
              <span>Check Message</span>
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center gap-2">
            {currentUser ? (
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="w-8 h-8 rounded-full bg-[#14362b] text-white flex items-center justify-center text-xs font-bold font-serif"
                aria-label="User profile"
              >
                {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
              </button>
            ) : (
              <button
                onClick={() => onOpenAuthModal && onOpenAuthModal('login')}
                className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-800 rounded-lg"
              >
                Sign In
              </button>
            )}

            <button
              id="nav-mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 space-y-3 shadow-lg animate-fade-in">
          {currentUser ? (
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-[#14362b] text-white flex items-center justify-center text-xs font-bold font-serif">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                    <div className="text-[10px] text-slate-500">{currentUser.role}</div>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Database className="w-2.5 h-2.5 text-emerald-600" /> Active
                </span>
              </div>
              <div className="flex gap-2 pt-2 border-t border-slate-200">
                {onOpenProfileModal && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenProfileModal();
                    }}
                    className="flex-1 py-1.5 text-center text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100"
                  >
                    Profile Settings
                  </button>
                )}
                {onLogout && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="flex-1 py-1.5 text-center text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 rounded-lg hover:bg-rose-100"
                  >
                    Log Out
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal && onOpenAuthModal('login');
                }}
                className="w-full py-2.5 text-center rounded-xl text-xs font-bold border border-slate-300 text-slate-800 bg-white shadow-xs"
              >
                Log In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthModal && onOpenAuthModal('signup');
                }}
                className="w-full py-2.5 text-center rounded-xl text-xs font-bold text-white bg-[#14362b] shadow-xs"
              >
                Sign Up
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map((item) => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-link-${item.id}`}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-left transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#14362b] text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => handleNavClick('mock-calls')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs"
            >
              <PhoneCall className="w-4 h-4 text-emerald-700" />
              <span>Start AI Mock Call</span>
            </button>
            <button
              onClick={() => handleNavClick('check')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#14362b] text-white shadow-xs"
            >
              <Send className="w-4 h-4 text-emerald-200" />
              <span>Check a Message</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
