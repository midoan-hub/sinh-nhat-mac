/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppView, Participant, TeamId, AnswerOption } from './types';
import { QUESTIONS, TEAMS } from './data/quizData';
import { 
  getStoredParticipants, 
  getStoredMaxPerTeam, 
  saveStoredParticipants, 
  subscribeToStoreUpdates, 
  determineTeamAssignment 
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { QuizWelcome } from './components/QuizWelcome';
import { QuizQuestion } from './components/QuizQuestion';
import { QuizResult } from './components/QuizResult';
import { AdminDashboard } from './components/AdminDashboard';
import { TeamsOverview } from './components/TeamsOverview';

type QuizStep = 'welcome' | 'answering' | 'result';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('quiz');
  const [quizStep, setQuizStep] = useState<QuizStep>('welcome');
  
  // Quiz progress state
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState<number>(0);
  const [participantName, setParticipantName] = useState<string>('');
  const [participantDept, setParticipantDept] = useState<string>('');
  const [scores, setScores] = useState<Record<TeamId, number>>({
    sangtao: 0,
    ketnoi: 0,
    chienluoc: 0,
    hanhdong: 0,
    ganket: 0,
    tantam: 0,
  });

  // Track answer history for "Go Back" support
  const [answerHistory, setAnswerHistory] = useState<AnswerOption[]>([]);
  const [currentResultParticipant, setCurrentResultParticipant] = useState<Participant | null>(null);

  // Persistence and synchronisation
  const [participants, setParticipants] = useState<Participant[]>(() => getStoredParticipants());
  const [maxPerTeam, setMaxPerTeam] = useState<number>(() => getStoredMaxPerTeam());

  // Subscribe to cross-tab updates (storage / BroadcastChannel)
  useEffect(() => {
    const unsubscribe = subscribeToStoreUpdates(() => {
      setParticipants(getStoredParticipants());
      setMaxPerTeam(getStoredMaxPerTeam());
    });
    return unsubscribe;
  }, []);

  const handleStartQuiz = (name: string, dept: string) => {
    setParticipantName(name);
    setParticipantDept(dept);
    setScores({
      sangtao: 0,
      ketnoi: 0,
      chienluoc: 0,
      hanhdong: 0,
      ganket: 0,
      tantam: 0,
    });
    setAnswerHistory([]);
    setCurrentQuestionIdx(0);
    setQuizStep('answering');
  };

  const handleSelectOption = (option: AnswerOption) => {
    // Accumulate scores for this option
    const newScores = { ...scores };
    Object.entries(option.teamScores).forEach(([tId, pts]) => {
      const teamId = tId as TeamId;
      newScores[teamId] = (newScores[teamId] || 0) + (pts || 0);
    });

    const newHistory = [...answerHistory, option];
    setScores(newScores);
    setAnswerHistory(newHistory);

    if (currentQuestionIdx + 1 < QUESTIONS.length) {
      // Advance to next question
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      // Quiz completed! Run intelligent team assignment
      finalizeQuiz(newScores);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIdx > 0 && answerHistory.length > 0) {
      const lastOption = answerHistory[answerHistory.length - 1];
      const revertedScores = { ...scores };
      Object.entries(lastOption.teamScores).forEach(([tId, pts]) => {
        const teamId = tId as TeamId;
        revertedScores[teamId] = Math.max(0, (revertedScores[teamId] || 0) - (pts || 0));
      });

      setScores(revertedScores);
      setAnswerHistory((prev) => prev.slice(0, -1));
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  const finalizeQuiz = (finalScores: Record<TeamId, number>) => {
    const currentList = getStoredParticipants();
    const currentMax = getStoredMaxPerTeam();

    const assignment = determineTeamAssignment(finalScores, currentList, currentMax);

    if (!assignment) {
      alert(
        `Thông báo: Tất cả 6 đội hình Mac Six hiện đã đầy quân số (${currentMax} người/đội)! Vui lòng liên hệ ban tổ chức để mở thêm suất hoặc xem Dashboard.`
      );
      setCurrentView('dashboard');
      return;
    }

    const newParticipant: Participant = {
      id: 'p-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      name: participantName,
      department: participantDept,
      assignedTeamId: assignment.assignedTeamId,
      assignedAt: Date.now(),
      primaryMatchId: assignment.primaryMatchId,
      wasRedirectedDueToQuota: assignment.wasRedirected,
      scoreBreakdown: finalScores,
    };

    const updatedList = [newParticipant, ...currentList];
    setParticipants(updatedList);
    saveStoredParticipants(updatedList);

    setCurrentResultParticipant(newParticipant);
    setQuizStep('result');
  };

  const handleStartNextQuiz = () => {
    setParticipantName('');
    setParticipantDept('');
    setCurrentResultParticipant(null);
    setCurrentQuestionIdx(0);
    setAnswerHistory([]);
    setQuizStep('welcome');
    setCurrentView('quiz');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        participants={participants}
        onStartNewQuiz={handleStartNextQuiz}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentView === 'quiz' && (
          <>
            {quizStep === 'welcome' && (
              <QuizWelcome
                onStartQuiz={handleStartQuiz}
                totalParticipants={participants.length}
              />
            )}

            {quizStep === 'answering' && (
              <QuizQuestion
                question={QUESTIONS[currentQuestionIdx]}
                questionIndex={currentQuestionIdx}
                totalQuestions={QUESTIONS.length}
                participantName={participantName}
                onSelectOption={handleSelectOption}
                onPreviousQuestion={handlePreviousQuestion}
              />
            )}

            {quizStep === 'result' && currentResultParticipant && (
              <QuizResult
                participant={currentResultParticipant}
                allParticipants={participants}
                onStartNextQuiz={handleStartNextQuiz}
                onGoToDashboard={() => setCurrentView('dashboard')}
              />
            )}
          </>
        )}

        {currentView === 'teams_overview' && (
          <TeamsOverview
            participants={participants}
            maxPerTeam={maxPerTeam}
            onJoinQuiz={() => {
              handleStartNextQuiz();
              setCurrentView('quiz');
            }}
          />
        )}

        {currentView === 'dashboard' && (
          <AdminDashboard
            participants={participants}
            setParticipants={setParticipants}
            maxPerTeam={maxPerTeam}
            setMaxPerTeam={setMaxPerTeam}
            onGoToQuiz={() => {
              handleStartNextQuiz();
              setCurrentView('quiz');
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 bg-white text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong>MAC Media</strong> &copy; {new Date().getFullYear()} &mdash; Bản Sắc MAC Six
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>6 Bản Sắc: Sáng Tạo • Kết Nối • Chiến Lược • Hành Động • Gắn Kết • Tận Tâm</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
