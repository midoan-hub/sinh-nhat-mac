import React, { useEffect, useState } from 'react';
import { Participant, Team } from '../types';
import { TEAMS } from '../data/quizData';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Share2, 
  Compass, 
  Zap, 
  HeartHandshake, 
  ShieldCheck, 
  RotateCcw, 
  LayoutDashboard, 
  Copy, 
  Check, 
  Info,
  Users,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';

interface QuizResultProps {
  participant: Participant;
  allParticipants: Participant[];
  onStartNextQuiz: () => void;
  onGoToDashboard: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-8 h-8" />,
  Share2: <Share2 className="w-8 h-8" />,
  Compass: <Compass className="w-8 h-8" />,
  Zap: <Zap className="w-8 h-8" />,
  HeartHandshake: <HeartHandshake className="w-8 h-8" />,
  ShieldCheck: <ShieldCheck className="w-8 h-8" />,
};

export const QuizResult: React.FC<QuizResultProps> = ({
  participant,
  allParticipants,
  onStartNextQuiz,
  onGoToDashboard,
}) => {
  const [copied, setCopied] = useState(false);

  const team: Team = TEAMS.find((t) => t.id === participant.assignedTeamId) || TEAMS[0];
  const primaryTeam: Team | undefined = participant.wasRedirectedDueToQuota
    ? TEAMS.find((t) => t.id === participant.primaryMatchId)
    : undefined;

  // Filter teammates in the same assigned team
  const teammates = allParticipants.filter(
    (p) => p.assignedTeamId === participant.assignedTeamId && p.id !== participant.id
  );

  useEffect(() => {
    // Fire festive celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: [team.color, '#FFD700', '#E91E63', '#00E676'],
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 350);
      return () => clearTimeout(timer);
    } catch (e) {
      console.warn('Confetti error', e);
    }
  }, [team.color]);

  const handleCopyResult = () => {
    const text = `🎉 [BẢN SẮC MAC] Tôi là thành viên của: ${team.name}!\n"${team.motto}"\nSứ mệnh: ${team.desc}\nCùng tham gia tiệc sinh nhật MAC Media rực rỡ nhé! ✨`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="bg-white rounded-3xl border-2 shadow-xl overflow-hidden"
        style={{ borderColor: team.color }}
      >
        {/* Top Header Banner */}
        <div
          className="p-6 sm:p-8 text-white relative text-center"
          style={{ backgroundColor: team.color }}
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            Chứng Nhận Bản Sắc MAC Six
          </div>

          <h3 className="text-sm uppercase tracking-widest text-white/80 font-semibold">
            Xin chúc mừng
          </h3>
          <h1 className="text-2xl sm:text-3xl font-black mt-1 text-white">
            {participant.name}
          </h1>
          {participant.department && (
            <p className="text-xs text-white/90 mt-1 font-medium">
              Bộ phận: {participant.department}
            </p>
          )}

          <div className="mt-5 inline-flex items-center justify-center p-3.5 rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner">
            {ICON_MAP[team.iconName] || <Sparkles className="w-8 h-8" />}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8">
          <div className="text-center mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Đội hình chính thức của bạn
            </span>
            <h2
              className="text-2xl sm:text-4xl font-black mt-1 mb-2"
              style={{ color: team.color }}
            >
              {team.name}
            </h2>
            <p className="text-base sm:text-lg font-medium text-slate-700 italic">
              "{team.motto}"
            </p>
          </div>

          {/* Quota Redirection notice if applicable */}
          {participant.wasRedirectedDueToQuota && primaryTeam && (
            <div className="mb-6 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block mb-1">
                  ⚡ Điều phối viên sự kiện cân bằng đội hình:
                </strong>
                Điểm số trắc nghiệm cho thấy bạn rất xuất sắc ở cả <span className="font-semibold">{primaryTeam.name}</span> và <span className="font-semibold">{team.name}</span>. Do đội {primaryTeam.name} đã đủ quân số tiêu chuẩn (10 người), hệ thống đã ưu tiên phân bổ bạn sang <strong className="underline">{team.name}</strong> để tối ưu hóa sức mạnh tập thể!
              </div>
            </div>
          )}

          {/* Persona Description */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 mb-6">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Đặc điểm nổi bật & phong cách làm việc
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed">
              {team.desc}
            </p>

            <div className="mt-4 pt-3 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                Thế mạnh trong đội hình
              </span>
              <div className="flex flex-wrap gap-2">
                {team.strengths.map((str, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-white border border-slate-200 text-slate-800 shadow-2xs"
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: team.color }}
                    />
                    {str}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Teammates List */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
                <Users className="w-4 h-4 text-slate-400" />
                <span>Đồng đội trong {team.name} ({teammates.length + 1})</span>
              </div>
              <span className="text-xs font-semibold text-slate-500">
                {teammates.length + 1} / 10 thành viên
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Current user badge */}
              <span 
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs flex items-center gap-1.5"
                style={{ backgroundColor: team.color }}
              >
                <span>⭐ Bạn ({participant.name})</span>
              </span>

              {/* Other teammates */}
              {teammates.map((tm) => (
                <span
                  key={tm.id}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {tm.name} {tm.department ? `(${tm.department})` : ''}
                </span>
              ))}

              {teammates.length === 0 && (
                <span className="text-xs text-slate-400 italic py-1">
                  Bạn là người đầu tiên gia nhập đội hình này! Hãy rủ thêm đồng nghiệp nhé.
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={onStartNextQuiz}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-purple-600 to-indigo-600 text-white font-bold text-sm sm:text-base shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tiếp Tục Lượt Của Người Sau</span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopyResult}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-xs text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Đã sao chép!' : 'Sao chép kết quả'}</span>
              </button>

              <button
                onClick={onGoToDashboard}
                className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-xs text-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LayoutDashboard className="w-4 h-4 text-slate-500" />
                <span>Bảng Quản Trị</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
