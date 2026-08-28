import { create } from 'zustand';

export type QuestionStatus = 'unseen' | 'answered' | 'notAnswered' | 'review' | 'answeredReview';

export interface CbtQuestion {
  id: string;
  question_latex: string;
  options: string[];
  correct_index: number;
  explanation_latex?: string;
  subject: string;
  chapter: string;
  difficulty: string;
}

interface CbtState {
  questions: CbtQuestion[];
  answers: Record<string, number>;
  statuses: Record<string, QuestionStatus>;
  timeSpentMs: Record<string, number>;
  currentQuestionId: string | null;
  currentIndex: number;
  isTestActive: boolean;
  isTestSubmitted: boolean;
  testStartTime: number | null;
  lastTickTime: number | null;
  
  // Actions
  hydrateQuestions: (qs: CbtQuestion[]) => void;
  startTest: () => void;
  tickTimer: () => void;
  selectOption: (qId: string, optionIndex: number) => void;
  markReview: (qId: string) => void;
  clearResponse: (qId: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  jumpToQuestion: (index: number) => void;
  submitTest: () => void;
  endSession: () => void;
}

export const useCbtStore = create<CbtState>((set, get) => ({
  questions: [],
  answers: {},
  statuses: {},
  timeSpentMs: {},
  currentQuestionId: null,
  currentIndex: 0,
  isTestActive: false,
  isTestSubmitted: false,
  testStartTime: null,
  lastTickTime: null,

  hydrateQuestions: (qs) => set({
    questions: qs,
    answers: {},
    statuses: qs.reduce((acc, q, idx) => ({ ...acc, [q.id]: idx === 0 ? 'notAnswered' : 'unseen' }), {}),
    timeSpentMs: qs.reduce((acc, q) => ({ ...acc, [q.id]: 0 }), {}),
    currentQuestionId: qs[0]?.id || null,
    currentIndex: 0,
    isTestActive: false,
    isTestSubmitted: false,
  }),

  startTest: () => set({
    isTestActive: true,
    testStartTime: Date.now(),
    lastTickTime: Date.now(),
  }),

  tickTimer: () => {
    const state = get();
    if (!state.isTestActive || !state.currentQuestionId || !state.lastTickTime) return;
    
    const now = Date.now();
    const delta = now - state.lastTickTime;
    
    set((s) => ({
      timeSpentMs: {
        ...s.timeSpentMs,
        [s.currentQuestionId!]: (s.timeSpentMs[s.currentQuestionId!] || 0) + delta
      },
      lastTickTime: now
    }));
  },

  selectOption: (qId, optionIndex) => set((state) => {
    const isReview = state.statuses[qId] === 'review' || state.statuses[qId] === 'answeredReview';
    return {
      answers: { ...state.answers, [qId]: optionIndex },
      statuses: { ...state.statuses, [qId]: isReview ? 'answeredReview' : 'answered' }
    };
  }),

  markReview: (qId) => set((state) => {
    const hasAnswer = state.answers[qId] !== undefined;
    return {
      statuses: { ...state.statuses, [qId]: hasAnswer ? 'answeredReview' : 'review' }
    };
  }),

  clearResponse: (qId) => set((state) => {
    const newAnswers = { ...state.answers };
    delete newAnswers[qId];
    return {
      answers: newAnswers,
      statuses: { ...state.statuses, [qId]: 'notAnswered' }
    };
  }),

  nextQuestion: () => {
    const { currentIndex, questions, currentQuestionId, statuses } = get();
    if (currentIndex < questions.length - 1) {
      const nextId = questions[currentIndex + 1].id;
      set({ 
        currentIndex: currentIndex + 1, 
        currentQuestionId: nextId,
        statuses: { 
          ...statuses, 
          [nextId]: statuses[nextId] === 'unseen' ? 'notAnswered' : statuses[nextId] 
        }
      });
    }
  },

  prevQuestion: () => {
    const { currentIndex, questions, currentQuestionId, statuses } = get();
    if (currentIndex > 0) {
      const prevId = questions[currentIndex - 1].id;
      set({ 
        currentIndex: currentIndex - 1, 
        currentQuestionId: prevId,
        statuses: { 
          ...statuses, 
          [prevId]: statuses[prevId] === 'unseen' ? 'notAnswered' : statuses[prevId] 
        }
      });
    }
  },

  jumpToQuestion: (index) => {
    const { questions, statuses } = get();
    if (index >= 0 && index < questions.length) {
      const targetId = questions[index].id;
      set({ 
        currentIndex: index, 
        currentQuestionId: targetId,
        statuses: { 
          ...statuses, 
          [targetId]: statuses[targetId] === 'unseen' ? 'notAnswered' : statuses[targetId] 
        }
      });
    }
  },

  submitTest: () => set({ isTestActive: false, isTestSubmitted: true, lastTickTime: null }),

  endSession: () => set({ isTestActive: false, isTestSubmitted: false, questions: [], currentQuestionId: null }),

}));
