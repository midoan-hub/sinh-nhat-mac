import { Participant, TeamId } from '../types';
import { DEFAULT_MAX_PER_TEAM, INITIAL_PARTICIPANTS, TEAMS } from '../data/quizData';

const STORAGE_KEY_PARTICIPANTS = 'mac_six_participants_v1';
const STORAGE_KEY_MAX_PER_TEAM = 'mac_six_max_per_team_v1';

const syncChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window 
  ? new BroadcastChannel('mac_six_sync_channel')
  : null;

export function getStoredMaxPerTeam(): number {
  try {
    const val = localStorage.getItem(STORAGE_KEY_MAX_PER_TEAM);
    if (val) {
      const parsed = parseInt(val, 10);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  } catch (e) {
    console.error('Error reading maxPerTeam from localStorage', e);
  }
  return DEFAULT_MAX_PER_TEAM;
}

export function saveStoredMaxPerTeam(max: number): void {
  try {
    localStorage.setItem(STORAGE_KEY_MAX_PER_TEAM, max.toString());
    syncChannel?.postMessage({ type: 'UPDATE_MAX', max });
  } catch (e) {
    console.error('Error saving maxPerTeam', e);
  }
}

export function getStoredParticipants(): Participant[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PARTICIPANTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Error reading participants from localStorage', e);
  }
  // Initialize with default demo members if empty
  saveStoredParticipants(INITIAL_PARTICIPANTS);
  return INITIAL_PARTICIPANTS;
}

export function saveStoredParticipants(list: Participant[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PARTICIPANTS, JSON.stringify(list));
    syncChannel?.postMessage({ type: 'UPDATE_PARTICIPANTS', list });
  } catch (e) {
    console.error('Error saving participants to localStorage', e);
  }
}

export function subscribeToStoreUpdates(callback: () => void): () => void {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY_PARTICIPANTS || event.key === STORAGE_KEY_MAX_PER_TEAM) {
      callback();
    }
  };

  const handleChannel = () => {
    callback();
  };

  window.addEventListener('storage', handleStorage);
  syncChannel?.addEventListener('message', handleChannel);

  return () => {
    window.removeEventListener('storage', handleStorage);
    syncChannel?.removeEventListener('message', handleChannel);
  };
}

export function calculateTeamCounts(participants: Participant[]): Record<TeamId, number> {
  const counts: Record<TeamId, number> = {
    sangtao: 0,
    ketnoi: 0,
    chienluoc: 0,
    hanhdong: 0,
    ganket: 0,
    tantam: 0,
  };

  for (const p of participants) {
    if (counts[p.assignedTeamId] !== undefined) {
      counts[p.assignedTeamId]++;
    }
  }

  return counts;
}

/**
 * Intelligent assignment algorithm:
 * 1. Takes score breakdown
 * 2. Sorts teams descending by score
 * 3. Chooses the highest scored team with available vacancy (< maxPerTeam)
 * 4. Records whether the participant had to be redirected to a secondary affinity
 */
export function determineTeamAssignment(
  scores: Record<TeamId, number>,
  currentParticipants: Participant[],
  maxPerTeam: number
): {
  assignedTeamId: TeamId;
  primaryMatchId: TeamId;
  wasRedirected: boolean;
} | null {
  const teamCounts = calculateTeamCounts(currentParticipants);

  // Sort teams by highest score
  const sortedTeams = (Object.keys(scores) as TeamId[]).sort((a, b) => {
    const diff = scores[b] - scores[a];
    if (diff !== 0) return diff;
    // Tie-breaker: choose team with fewer members currently
    return teamCounts[a] - teamCounts[b];
  });

  const primaryMatchId = sortedTeams[0];

  // Find the first team in preference order that still has slots
  const availableTeamId = sortedTeams.find((teamId) => teamCounts[teamId] < maxPerTeam);

  if (!availableTeamId) {
    // All teams are fully saturated
    return null;
  }

  const wasRedirected = availableTeamId !== primaryMatchId;

  return {
    assignedTeamId: availableTeamId,
    primaryMatchId,
    wasRedirected,
  };
}

export function exportParticipantsToCsv(participants: Participant[]): void {
  const teamNames: Partial<Record<TeamId, string>> = {};
  for (const t of TEAMS) {
    teamNames[t.id] = t.name;
  }

  const headers = ['STT', 'Họ và Tên', 'Phòng Ban / Vị Trí', 'Đội Gia Nhập', 'Thời Gian Ghi Nhận', 'Chuyển Đổi Quota?'];
  const rows = participants.map((p, idx) => [
    idx + 1,
    `"${p.name.replace(/"/g, '""')}"`,
    `"${(p.department || 'Chưa cập nhật').replace(/"/g, '""')}"`,
    `"${teamNames[p.assignedTeamId] || p.assignedTeamId}"`,
    `"${new Date(p.assignedAt).toLocaleString('vi-VN')}"`,
    p.wasRedirectedDueToQuota ? 'Có (Chuyển sang bản sắc phụ)' : 'Không (Đúng nguyện vọng 1)',
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `danh_sach_chia_doi_mac_six_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
