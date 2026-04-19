export type QuestionType = 'multiple' | 'short' | 'descriptive';
export type ActiveTab = 'explorer' | 'quizzes' | 'incorrect-notes' | 'achievements' | 'leaderboard';
export type AppMode = 'login' | 'quiz' | 'result' | 'main';

export interface UserProfile {
  uid: string;
  displayName: string;
  classId: string;
  password?: string;
  isAdmin?: boolean;
  totalScore: number;
  accuracy: number;
  achievements?: string[];
  createdAt: string;
}

export interface Question {
  id: number;
  type: QuestionType;
  text: string;
  options?: string[];
  correctAnswer: string;
  explanation: string;
  tags?: string[];
  imageUrl?: string;
  imageCaption?: string;
}

export interface QuizResult {
  questionId: number;
  userAnswer: string;
  isCorrect: boolean;
}
