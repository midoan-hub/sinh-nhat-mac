import React, { useState } from 'react';
import { Question, AnswerOption } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, CheckCircle2, HelpCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  participantName: string;
  onSelectOption: (option: AnswerOption) => void;
  onPreviousQuestion: () => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionIndex,
  totalQuestions,
  participantName,
  onSelectOption,
  onPreviousQuestion,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleChoose = (opt: AnswerOption) => {
    setSelectedId(opt.id);
    setTimeout(() => {
      onSelectOption(opt);
      setSelectedId(null);
    }, 280);
  };

  const progressPercent = ((questionIndex + 1) / totalQuestions) * 100;

  return (
    <div className="max-w-2xl mx-auto py-4 px-4">
      {/* Header bar with progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
          <div className="flex items-center gap-2">
            {questionIndex > 0 && (
              <button
                onClick={onPreviousQuestion}
                className="flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors p-1 -ml-1 rounded-md"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Câu trước</span>
              </button>
            )}
            <span className="font-semibold text-slate-700">
              Thành viên: <span className="text-rose-600">{participantName}</span>
            </span>
          </div>
          <span className="font-bold text-slate-700">
            Câu {questionIndex + 1} / {totalQuestions}
          </span>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-rose-500 to-purple-600 rounded-full"
            initial={{ width: `${((questionIndex) / totalQuestions) * 100}%` }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md"
        >
          {/* Question title & scenario */}
          <div className="mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs font-bold uppercase tracking-wider mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              Tình huống thực tế
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-3">
              {question.scenario}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3.5">
            {question.options.map((opt) => {
              const isSelected = selectedId === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => handleChoose(opt)}
                  disabled={selectedId !== null}
                  className={`w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all cursor-pointer flex items-start gap-4 relative ${
                    isSelected
                      ? 'border-rose-500 bg-rose-50/70 shadow-md scale-[1.01]'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/80 bg-white'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? <CheckCircle2 className="w-5 h-5" /> : opt.label}
                  </div>

                  <div className="flex-1 pr-2">
                    <p className="font-semibold text-slate-900 text-sm sm:text-base leading-snug mb-1">
                      {opt.text}
                    </p>
                    {opt.subtext && (
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {opt.subtext}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Chọn 1 phương án phản ánh đúng bản năng làm việc của bạn nhất</span>
            <span>💡 5/5 câu hỏi</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
