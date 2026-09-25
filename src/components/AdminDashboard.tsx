import React, { useState } from 'react';
import { Participant, Team, TeamId } from '../types';
import { TEAMS, INITIAL_PARTICIPANTS } from '../data/quizData';
import { 
  calculateTeamCounts, 
  exportParticipantsToCsv, 
  saveStoredParticipants, 
  saveStoredMaxPerTeam, 
  determineTeamAssignment 
} from '../utils/storage';
import { 
  Users, 
  Download, 
  Trash2, 
  RotateCcw, 
  Plus, 
  Minus, 
  Search, 
  Filter, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Radio, 
  ArrowRightLeft 
} from 'lucide-react';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  participants: Participant[];
  setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
  maxPerTeam: number;
  setMaxPerTeam: React.Dispatch<React.SetStateAction<number>>;
  onGoToQuiz: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  participants,
  setParticipants,
  maxPerTeam,
  setMaxPerTeam,
  onGoToQuiz,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeamFilter, setSelectedTeamFilter] = useState<string>('all');
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const teamCounts = calculateTeamCounts(participants);
  const totalSlots = maxPerTeam * TEAMS.length;
  const occupancyRate = totalSlots > 0 ? Math.round((participants.length / totalSlots) * 100) : 0;

  // Filtered participants
  const filteredParticipants = participants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.department && p.department.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTeam = selectedTeamFilter === 'all' || p.assignedTeamId === selectedTeamFilter;
    return matchesSearch && matchesTeam;
  });

  const handleUpdateMax = (newMax: number) => {
    if (newMax < 1) return;
    setMaxPerTeam(newMax);
    saveStoredMaxPerTeam(newMax);
  };

  const handleRemoveParticipant = (id: string) => {
    const updated = participants.filter((p) => p.id !== id);
    setParticipants(updated);
    saveStoredParticipants(updated);
  };

  const handleResetToDemo = () => {
    setParticipants(INITIAL_PARTICIPANTS);
    saveStoredParticipants(INITIAL_PARTICIPANTS);
    setIsResetConfirmOpen(false);
  };

  const handleClearAll = () => {
    setParticipants([]);
    saveStoredParticipants([]);
    setIsResetConfirmOpen(false);
  };

  // Quick simulate 1 random participant to test the algorithm & quota limit
  const handleSimulateRandom = () => {
    const sampleNames = [
      'Đỗ Quốc Bảo', 'Lê Quỳnh Anh', 'Nguyễn Thanh Tùng', 'Hoàng Minh Châu',
      'Phan Đăng Khoa', 'Bùi Diệu Linh', 'Võ Trọng Nghĩa', 'Dương Thúy Hằng',
      'Đinh Quang Huy', 'Phùng Yến Nhi', 'Ngô Gia Khánh', 'Hồ Bích Ngọc'
    ];
    const sampleDepts = ['Creative', 'Media', 'Marketing', 'Planning', 'Production', 'Account', 'HR'];

    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)] + ` #${Math.floor(Math.random() * 900 + 100)}`;
    const randomDept = sampleDepts[Math.floor(Math.random() * sampleDepts.length)];

    // Generate random scores
    const randomScores: Record<TeamId, number> = {
      sangtao: Math.floor(Math.random() * 15),
      ketnoi: Math.floor(Math.random() * 15),
      chienluoc: Math.floor(Math.random() * 15),
      hanhdong: Math.floor(Math.random() * 15),
      ganket: Math.floor(Math.random() * 15),
      tantam: Math.floor(Math.random() * 15),
    };

    const assignment = determineTeamAssignment(randomScores, participants, maxPerTeam);
    if (!assignment) {
      alert(`Tất cả 6 đội đã đạt giới hạn tối đa (${maxPerTeam} người/đội)! Hãy tăng giới hạn Quota để thêm thành viên.`);
      return;
    }

    const newParticipant: Participant = {
      id: 'p-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      name: randomName,
      department: randomDept,
      assignedTeamId: assignment.assignedTeamId,
      assignedAt: Date.now(),
      primaryMatchId: assignment.primaryMatchId,
      wasRedirectedDueToQuota: assignment.wasRedirected,
      scoreBreakdown: randomScores,
    };

    const updated = [newParticipant, ...participants];
    setParticipants(updated);
    saveStoredParticipants(updated);
  };

  return (
    <div className="max-w-6xl mx-auto py-6 px-4">
      {/* Top Banner & Control */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-rose-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3">
              <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
              <span>Real-time Sync Hoạt Động (Tự Động Đồng Bộ Giữa Các Tab)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white mb-2">
              ⚙️ Dashboard Quản Trị Đội Hình Mac Six
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              Theo dõi phân bổ nhân sự, giám sát trần quân số (Quota), tự động chuyển hướng khi đội đầy và xuất danh sách chia đội cho sự kiện.
            </p>
          </div>

          {/* Quick Metrics & Quota Setting */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 flex flex-wrap items-center gap-6">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                Tổng Nhân Sự
              </div>
              <div className="text-2xl font-black text-white mt-0.5">
                {participants.length} <span className="text-sm text-slate-400 font-normal">/ {totalSlots}</span>
              </div>
              <div className="text-xs text-emerald-400 font-medium">
                {occupancyRate}% công suất
              </div>
            </div>

            <div className="h-10 w-px bg-white/20 hidden sm:block" />

            {/* Quota Setting */}
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                Trần Quota Mỗi Đội
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleUpdateMax(maxPerTeam - 1)}
                  disabled={maxPerTeam <= 1}
                  className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white disabled:opacity-40 cursor-pointer"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-xl font-black text-amber-300 min-w-[28px] text-center">
                  {maxPerTeam}
                </span>
                <button
                  onClick={() => handleUpdateMax(maxPerTeam + 1)}
                  className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-[11px] text-slate-400">người / đội</span>
            </div>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="mt-6 pt-6 border-t border-white/15 flex flex-wrap items-center justify-between gap-3 relative z-10">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleSimulateRandom}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 hover:from-rose-600 hover:to-purple-700 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>+ Giả Lập 1 Người Tham Gia</span>
            </button>

            <button
              onClick={() => exportParticipantsToCsv(participants)}
              className="px-3.5 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Xuất CSV (Excel)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsResetConfirmOpen(true)}
              className="px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Đặt lại dữ liệu</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Teams Quota Live Status Grid */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Trạng Thái Quân Số 6 Đội Hình
            </h2>
            <p className="text-xs text-slate-500">
              Tự động khóa tuyển khi đạt đủ {maxPerTeam} người và kích hoạt cơ chế điều chuyển bản sắc phụ
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEAMS.map((team) => {
            const count = teamCounts[team.id];
            const isFull = count >= maxPerTeam;
            const percentage = Math.min(100, Math.round((count / maxPerTeam) * 100));

            return (
              <motion.div
                key={team.id}
                layout
                className={`bg-white rounded-2xl p-5 border-2 shadow-xs transition-all relative ${
                  isFull ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 hover:border-slate-300'
                }`}
                style={{ borderLeftWidth: '8px', borderLeftColor: team.color }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      {team.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {team.tagline}
                    </p>
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 ${
                      isFull
                        ? 'bg-rose-100 text-rose-700'
                        : count > maxPerTeam * 0.7
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {isFull ? (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        Đã đầy
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        Đang mở
                      </>
                    )}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="my-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Tiến độ</span>
                    <span className="font-black text-slate-900 text-sm">
                      {count} <span className="text-slate-400 font-normal">/ {maxPerTeam}</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: isFull ? '#EF4444' : team.color,
                      }}
                    />
                  </div>
                </div>

                {/* List of members in this team */}
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center justify-between">
                    <span>Thành viên ({count}):</span>
                  </div>
                  <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto pr-1">
                    {participants
                      .filter((p) => p.assignedTeamId === team.id)
                      .map((p) => (
                        <span
                          key={p.id}
                          className={`text-[11px] px-2 py-0.5 rounded-md border font-medium ${
                            p.wasRedirectedDueToQuota
                              ? 'bg-amber-50 border-amber-200 text-amber-800'
                              : 'bg-slate-50 border-slate-200 text-slate-700'
                          }`}
                          title={
                            p.wasRedirectedDueToQuota
                              ? `Đã được điều chuyển từ đội nguyện vọng 1 do đầy quota`
                              : ''
                          }
                        >
                          {p.name}
                          {p.wasRedirectedDueToQuota && ' ⚡'}
                        </span>
                      ))}
                    {count === 0 && (
                      <span className="text-xs text-slate-400 italic">Chưa có ai</span>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Participants Table Roster */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Danh Sách Thành Viên Đã Hoàn Thành ({filteredParticipants.length})
            </h2>
            <p className="text-xs text-slate-500">
              Tìm kiếm hoặc lọc danh sách theo đội hình
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm tên hoặc phòng ban..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 w-48 sm:w-56"
              />
            </div>

            {/* Filter by Team */}
            <select
              value={selectedTeamFilter}
              onChange={(e) => setSelectedTeamFilter(e.target.value)}
              className="text-xs rounded-xl border border-slate-200 py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-rose-500 bg-white"
            >
              <option value="all">Tất cả các đội ({participants.length})</option>
              {TEAMS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({teamCounts[t.id]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">#</th>
                <th className="py-3 px-3">Họ và tên</th>
                <th className="py-3 px-3">Phòng Ban</th>
                <th className="py-3 px-3">Đội Gia Nhập</th>
                <th className="py-3 px-3">Cơ Chế Phân Bổ</th>
                <th className="py-3 px-3">Thời Gian</th>
                <th className="py-3 px-3 text-right">Thao Tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParticipants.map((p, idx) => {
                const assignedTeam = TEAMS.find((t) => t.id === p.assignedTeamId);
                const primaryTeam = TEAMS.find((t) => t.id === p.primaryMatchId);

                return (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-3 px-3 font-bold text-slate-900">
                      {p.name}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {p.department || '—'}
                    </td>
                    <td className="py-3 px-3">
                      {assignedTeam ? (
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-white font-semibold text-[11px]"
                          style={{ backgroundColor: assignedTeam.color }}
                        >
                          {assignedTeam.name}
                        </span>
                      ) : (
                        p.assignedTeamId
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {p.wasRedirectedDueToQuota ? (
                        <span className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md font-medium text-[11px]">
                          <ArrowRightLeft className="w-3 h-3 text-amber-600" />
                          <span>Chuyển từ {primaryTeam?.name || 'đội đầy'}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Nguyện vọng 1</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(p.assignedAt).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <button
                        onClick={() => handleRemoveParticipant(p.id)}
                        className="p-1 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Xóa thành viên"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredParticipants.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                    Không tìm thấy thành viên nào phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200"
          >
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Xác Nhận Đặt Lại Dữ Liệu
            </h3>
            <p className="text-xs text-slate-600 mb-6 leading-relaxed">
              Bạn muốn khôi phục lại dữ liệu mẫu (6 người mặc định) hay xóa hoàn toàn danh sách người tham gia để bắt đầu sự kiện thực tế?
            </p>

            <div className="space-y-2">
              <button
                onClick={handleResetToDemo}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Khôi phục 6 thành viên mẫu ban đầu
              </button>
              <button
                onClick={handleClearAll}
                className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Xóa sạch toàn bộ (Bắt đầu sự kiện mới)
              </button>
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="w-full py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs transition-colors cursor-pointer"
              >
                Hủy bỏ
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};
