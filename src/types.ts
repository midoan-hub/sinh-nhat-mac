export type TeamId = 'sangtao' | 'ketnoi' | 'chienluoc' | 'hanhdong' | 'ganket' | 'tantam';

export interface Team {
  id: TeamId;
  name: string;
  tagline: string;
  desc: string;
  color: string;
  accentBg: string;
  borderClass: string;
  iconName: string;
  keywords: string[];
  strengths: string[];
  motto: string;
}

export interface AnswerOption {
  id: string;
  label: string;
  text: string;
  teamScores: Partial<Record<TeamId, number>>;
  subtext?: string;
}

export interface Question {
  id: number;
  title: string;
  scenario: string;
  options: AnswerOption[];
}

export interface Participant {
  id: string;
  name: string;
  department?: string;
  assignedTeamId: TeamId;
  assignedAt: number;
  primaryMatchId: TeamId;
  wasRedirectedDueToQuota: boolean;
  scoreBreakdown: Record<TeamId, number>;
}

export type AppView = 'quiz' | 'dashboard' | 'teams_overview';
