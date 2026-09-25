import React, { useState } from 'react';
import { TEAMS } from '../data/quizData';
import { Sparkles, ArrowRight, User, Briefcase, ShieldCheck, HeartHandshake, Compass, Zap, Share2 } from 'lucide-react';
import { motion } from 'motion/react';

interface QuizWelcomeProps {
  onStartQuiz: (name: string, department: string) => void;
  totalParticipants: number;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-5 h-5" />,
  Share2: <Share2 className="w-5 h-5" />,
  Compass: <Compass className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  HeartHandshake: <HeartHandshake className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
};

const SUGGESTED_DEPTS = [
  'Creative & Design',
  'Content & Media',
  'Account & PR',
  'Production & Video',
  'Planning & Strategy',
  'HR & Admin',
  'Finance & Accounting',
  'Tech & Operation',
];

export const QuizWelcome: React.FC<QuizWelcomeProps> = ({ onStartQuiz, totalParticipants }) => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Vui lòng nhập họ và tên của bạn để tiếp tục!');
      return;
    }
    setError('');
    onStartQuiz(name.trim(), department.trim());
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      {/* Hero Welcome Card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-500 via-purple-600 to-indigo-700 p-8 sm:p-12 text-white shadow-xl mb-10 text-center"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-rose-400/20 blur-2xl pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs sm:text-sm font-semibold tracking-wide uppercase mb-4">
          <Sparkles className="w-4 h-4 text-amber-300" />
          Sự kiện sinh nhật & gắn kết MAC Media
        </div>

        <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
          🌈 BẢN SẮC MAC
        </h1>
        <p className="text-lg sm:text-xl text-rose-100 font-medium max-w-2xl mx-auto mb-6">
          Khám phá <span className="text-amber-300 font-bold">Mắc Six</span> của riêng bạn &mdash; Gia nhập đội hình độc bản trong tiệc sinh nhật công ty!
        </p>

        <p className="text-sm sm:text-base text-white/90 max-w-xl mx-auto leading-relaxed">
          Bạn là mảnh ghép nào trong bức tranh đa sắc của MAC? Hãy hoàn thành 5 câu trắc nghiệm thú vị để hệ thống tự động giải mã bản sắc và xếp bạn vào đúng đội hình.
        </p>

        {totalParticipants > 0 && (
          <div className="mt-6 inline-flex items-center gap-2 text-xs bg-black/20 px-3.5 py-1.5 rounded-full text-white/80">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Đã có <strong className="text-white">{totalParticipants}</strong> thành viên tham gia hoàn thành bài test
          </div>
        )}
      </motion.div>

      {/* Input Form for Participant Name */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="max-w-md mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-md mb-12"
      >
        <h2 className="text-xl font-bold text-slate-900 mb-1 text-center">
          Thông Tin Người Tham Gia
        </h2>
        <p className="text-xs text-slate-500 text-center mb-6">
          Tên và phòng ban sẽ xuất hiện trên Thẻ Thành Viên Bản Sắc của bạn
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Họ và Tên <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Ví dụ: Nguyễn Minh Thư"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-xs text-rose-500 font-medium mt-1.5">{error}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              Phòng Ban / Vị Trí
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Ví dụ: Creative, Account, Media..."
                list="dept-list"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
              />
              <datalist id="dept-list">
                {SUGGESTED_DEPTS.map((dept) => (
                  <option key={dept} value={dept} />
                ))}
              </datalist>
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 px-6 bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group cursor-pointer"
          >
            <span>Bắt Đầu Khám Phá Bản Sắc</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>
      </motion.div>

      {/* 6 Archetypes Preview Grid */}
      <div className="mt-8">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">
            Khám phá 6 Bản Sắc Mắc Six của đại gia đình MAC
          </h3>
          <p className="text-xs text-slate-500">
            Mỗi đội hình mang một màu sắc và sứ mệnh riêng biệt
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEAMS.map((team, idx) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
              className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden"
              style={{ borderTop: `4px solid ${team.color}` }}
            >
              <div className="flex items-center gap-3 mb-2.5">
                <div 
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-xs"
                  style={{ backgroundColor: team.color }}
                >
                  {ICON_MAP[team.iconName] || <Sparkles className="w-5 h-5" />}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm leading-tight">
                    {team.name}
                  </h4>
                  <span className="text-[11px] font-medium text-slate-500">
                    {team.tagline}
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {team.desc}
              </p>
              <div className="flex flex-wrap gap-1">
                {team.keywords.map((kw, kidx) => (
                  <span
                    key={kidx}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
