import React from 'react';
import { Participant, Team } from '../types';
import { TEAMS } from '../data/quizData';
import { 
  Sparkles, 
  Share2, 
  Compass, 
  Zap, 
  HeartHandshake, 
  ShieldCheck, 
  Users, 
  CheckCircle2, 
  Flame 
} from 'lucide-react';
import { motion } from 'motion/react';

interface TeamsOverviewProps {
  participants: Participant[];
  maxPerTeam: number;
  onJoinQuiz: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-6 h-6" />,
  Share2: <Share2 className="w-6 h-6" />,
  Compass: <Compass className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  HeartHandshake: <HeartHandshake className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
};

export const TeamsOverview: React.FC<TeamsOverviewProps> = ({
  participants,
  maxPerTeam,
  onJoinQuiz,
}) => {
  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider mb-3">
          <Flame className="w-3.5 h-3.5 text-purple-600" />
          Hệ Thống 6 Bản Sắc Mac Six
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-3">
          Khám Phá Sức Mạnh 6 Đội Hình
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Mỗi đội hình đại diện cho một giá trị cốt lõi kiến tạo nên thành công của MAC Media. Hãy cùng tìm hiểu năng lượng đặc trưng và danh sách thành viên hiện tại của từng đội!
        </p>
      </div>

      {/* Grid of Teams */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {TEAMS.map((team, idx) => {
          const teamMembers = participants.filter((p) => p.assignedTeamId === team.id);
          const isFull = teamMembers.length >= maxPerTeam;

          return (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between"
            >
              {/* Header */}
              <div
                className="p-6 text-white relative"
                style={{ backgroundColor: team.color }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                    {ICON_MAP[team.iconName] || <Sparkles className="w-6 h-6" />}
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      isFull
                        ? 'bg-rose-900/40 text-rose-100'
                        : 'bg-white/20 text-white backdrop-blur-md'
                    }`}
                  >
                    {teamMembers.length} / {maxPerTeam} thành viên
                  </span>
                </div>

                <h3 className="text-xl font-black text-white">{team.name}</h3>
                <p className="text-xs text-white/90 font-medium mt-0.5">
                  {team.tagline}
                </p>
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs italic text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                    "{team.motto}"
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed mb-4">
                    {team.desc}
                  </p>

                  <div className="mb-4">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
                      Thế mạnh then chốt:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {team.strengths.map((str, sidx) => (
                        <li key={sidx} className="flex items-center gap-2">
                          <CheckCircle2
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: team.color }}
                          />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Member Roster Preview */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" /> Thành viên ({teamMembers.length})
                    </span>
                    {isFull && <span className="text-rose-500 font-bold">Đã đủ quân số</span>}
                  </div>

                  <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto">
                    {teamMembers.map((m) => (
                      <span
                        key={m.id}
                        className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-medium"
                      >
                        {m.name}
                      </span>
                    ))}
                    {teamMembers.length === 0 && (
                      <span className="text-xs text-slate-400 italic">
                        Đang chờ các thành viên đầu tiên...
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Floating CTA */}
      <div className="text-center">
        <button
          onClick={onJoinQuiz}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 hover:from-rose-600 hover:to-purple-700 text-white font-black text-base shadow-lg hover:shadow-xl transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>Làm Bài Trắc Nghiệm Ngay</span>
        </button>
      </div>
    </div>
  );
};
