import React from 'react';
import { AppView, Participant } from '../types';
import { Sparkles, LayoutDashboard, Users, RotateCcw } from 'lucide-react';

interface NavbarProps {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  participants: Participant[];
  onStartNewQuiz: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  participants,
  onStartNewQuiz,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div 
          onClick={() => {
            onStartNewQuiz();
            setCurrentView('quiz');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 via-purple-600 to-blue-500 flex items-center justify-center text-white font-black text-xl shadow-md group-hover:scale-105 transition-transform">
            6
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                BẢN SẮC MAC
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                Mac Six
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">
              Hệ thống trắc nghiệm & chia đội tự động
            </p>
          </div>
        </div>

        {/* View Switcher Navigation */}
        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => {
              setCurrentView('quiz');
            }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'quiz'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Trắc Nghiệm</span>
          </button>

          <button
            onClick={() => setCurrentView('teams_overview')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              currentView === 'teams_overview'
                ? 'bg-purple-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">6 Bản Sắc</span>
            <span className="sm:hidden">Đội</span>
          </button>

          <button
            onClick={() => setCurrentView('dashboard')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 relative ${
              currentView === 'dashboard'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Quản Trị</span>
            <span className="ml-1 px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-slate-200 text-slate-800">
              {participants.length}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};
