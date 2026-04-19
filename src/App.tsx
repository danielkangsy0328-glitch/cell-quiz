import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Share2, 
  ChevronRight, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  Microscope, 
  BookOpen, 
  ClipboardList, 
  RefreshCw, 
  Play, 
  LogOut, 
  Users, 
  Award,
  LogIn,
  Key,
  User,
  School,
  Trash2
} from 'lucide-react';
import { cn } from './lib/utils';
import { Question, QuizResult, ActiveTab, AppMode, UserProfile } from './types';
import { QUIZ_QUESTIONS, ACHIEVEMENTS } from './constants';
import { db } from './lib/firebase';
import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  increment,
  getDocs,
  getDocFromServer,
  deleteDoc,
  writeBatch
} from 'firebase/firestore';

// --- Utils ---

const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// --- Shared Components ---

const TopAppBar = ({ title, onBack, rightElement, onShare }: { title: string; onBack?: () => void; rightElement?: React.ReactNode, onShare?: () => void }) => (
  <header className="glass-header flex items-center justify-between px-6 py-4">
    <div className="flex items-center gap-4">
      {onBack && (
        <button onClick={onBack} className="p-2 hover:bg-surface-low rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-primary" />
        </button>
      )}
      <h1 className="font-headline font-bold text-xl text-primary truncate max-w-[200px]">{title}</h1>
    </div>
    {rightElement || (
      <button onClick={onShare} className="p-2 hover:bg-surface-low rounded-full transition-colors">
        <Share2 className="w-5 h-5 text-primary" />
      </button>
    )}
  </header>
);

const ScoreSummaryCard = ({ score, total }: { score: number; total: number }) => {
  const percentage = (score / total) * 100;
  
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-container rounded-[40px] p-8 text-on-primary-container shadow-xl shadow-primary/20">
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="text-[10px] font-headline font-bold tracking-widest uppercase mb-2 opacity-80">SCORE SUMMARY</span>
        <div className="flex items-baseline gap-1">
          <span className="text-6xl font-headline font-black text-white">{score}</span>
          <span className="text-2xl font-headline font-bold opacity-60">/ {total}</span>
        </div>
        <p className="mt-4 font-medium text-white/90">
          {score === total ? "완벽합니다! 중1 과학의 달인이시군요!" : 
           score >= total * 0.8 ? "훌륭합니다! 세포 구조에 대해 잘 이해하고 있네요." :
           "조금 더 복습하면 완벽해질 거예요!"}
        </p>
        
        <div className="w-full mt-6 bg-white/20 h-3 rounded-full overflow-hidden relative">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-secondary to-secondary-dim rounded-full"
          >
            <div className="discovery-progress-glow" />
          </motion.div>
        </div>
      </div>
      <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl opacity-50" />
    </section>
  );
};

const QuestionNavGrid = ({ results, onSelect, activeId }: { results: QuizResult[], onSelect: (id: number) => void, activeId: number }) => (
  <section className="grid grid-cols-4 gap-3">
    {results.map((res) => (
      <button
        key={res.questionId}
        onClick={() => onSelect(res.questionId)}
        className={cn(
          "aspect-square flex flex-col items-center justify-center rounded-2xl font-headline font-bold shadow-sm transition-all",
          res.isCorrect 
            ? "bg-secondary-container text-on-secondary-container" 
            : "bg-error-container text-on-error-container ring-2 ring-error",
          activeId === res.questionId && "ring-4 ring-primary ring-offset-2"
        )}
      >
        <div className="flex items-center gap-0.5">
          {res.isCorrect ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          <span>{res.questionId}</span>
        </div>
      </button>
    ))}
  </section>
);

const DetailExplanation = ({ question, result }: { question: Question; result?: QuizResult }) => (
  <section className="space-y-4">
    <div className="flex items-center justify-between px-2">
      <h2 className="font-headline font-bold text-lg">상세 해설</h2>
      <span className="text-sm font-body text-outline">Question {question.id}</span>
    </div>

    <div className="bg-surface-lowest rounded-[40px] p-8 shadow-sm ring-1 ring-outline-variant/15">
      <div className="flex items-start gap-4 mb-6">
        <span className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 mt-1",
          result?.isCorrect ? "bg-secondary text-white" : "bg-error text-white"
        )}>
          {question.id}
        </span>
        <p className="font-headline font-bold text-on-surface leading-relaxed text-lg">
          {question.text}
        </p>
      </div>

      <div className="space-y-3">
        {question.options?.map((opt) => {
          const isUserChoice = result ? opt === result.userAnswer : false;
          const isCorrect = opt === question.correctAnswer;
          
          return (
            <div 
              key={opt}
              className={cn(
                "p-5 rounded-3xl transition-all duration-300 flex items-center justify-between",
                isCorrect 
                  ? "bg-secondary-container text-on-secondary-container font-black ring-2 ring-secondary/30 scale-[1.02]" 
                  : isUserChoice && !isCorrect
                    ? "bg-error-container text-on-error-container font-bold ring-1 ring-error/20"
                    : "bg-surface-low text-on-surface-variant font-medium"
              )}
            >
              <span>{opt}</span>
              <div className="flex items-center gap-1">
                {isCorrect ? <CheckCircle2 className="w-5 h-5" /> : isUserChoice ? <XCircle className="w-5 h-5" /> : null}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-outline-variant/10">
        <div className="bg-surface-low rounded-[32px] p-6 border-l-4 border-secondary">
          <p className="text-on-surface leading-relaxed font-body">
            {question.explanation}
          </p>
          <div className="mt-4 flex gap-2 flex-wrap">
            {question.tags?.map(tag => (
              <span key={tag} className="px-3 py-1 bg-surface-variant rounded-full text-[10px] font-bold text-outline uppercase tracking-tight">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

const BottomNavBar = ({ active, onNav }: { active: ActiveTab, onNav: (tab: ActiveTab) => void }) => (
  <nav className="glass-nav flex justify-around items-center px-4 pt-3 pb-6 shadow-[0_-4px_24px_rgba(0,0,0,0.04)]">
    <button onClick={() => onNav('quizzes')} className={cn(
      "flex flex-col items-center justify-center px-4 py-2 transition-all",
      active === 'quizzes' ? "text-primary scale-110 font-bold" : "text-outline hover:text-primary"
    )}>
      <Play className="w-6 h-6 mb-1" />
      <span className="font-headline font-semibold text-[10px]">Play Quiz</span>
    </button>
    
    <button onClick={() => onNav('leaderboard')} className={cn(
      "flex flex-col items-center justify-center px-4 py-2 transition-all",
      active === 'leaderboard' ? "text-primary scale-110 font-bold" : "text-outline hover:text-primary"
    )}>
      <Users className="w-6 h-6 mb-1" />
      <span className="font-headline font-semibold text-[10px]">Leaderboard</span>
    </button>

    <button onClick={() => onNav('incorrect-notes')} className={cn(
      "flex flex-col items-center justify-center rounded-2xl px-6 py-2 transition-all",
      active === 'incorrect-notes'
        ? "bg-gradient-to-br from-primary to-primary-container text-white shadow-lg scale-105" 
        : "text-outline"
    )}>
      <ClipboardList className="w-6 h-6 mb-1" />
      <span className="font-headline font-semibold text-[10px]">오답 노트</span>
    </button>
    
    <button onClick={() => onNav('achievements')} className={cn(
      "flex flex-col items-center justify-center px-4 py-2 transition-all",
      active === 'achievements' ? "text-primary scale-110 font-bold" : "text-outline hover:text-primary"
    )}>
      <Trophy className="w-6 h-6 mb-1" />
      <span className="font-headline font-semibold text-[10px]">Awards</span>
    </button>
  </nav>
);

// --- Sub-Views ---

const LoginView = ({ onLogin }: { onLogin: (name: string, pw: string) => void }) => {
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && password) {
      onLogin(name, password);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-6">
      <div className="w-20 h-20 bg-primary/10 rounded-[40px] flex items-center justify-center text-primary mb-6">
        <Microscope className="w-12 h-12" />
      </div>
      <h1 className="font-headline font-black text-3xl text-primary mb-2">Cell Explorer</h1>
      <p className="text-outline font-medium text-lg mb-10 text-center">1학년 4반 친구들과<br/>함께하는 세포 퀴즈!</p>
      
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-outline-dim uppercase ml-4 tracking-widest">Full Name</label>
            <div className="relative group">
                <User className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="실명 입력 (예: 홍길동)"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-low border-none rounded-[32px] py-5 pl-14 pr-6 font-headline font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-outline-dim uppercase ml-4 tracking-widest">Password</label>
            <div className="relative group">
                <Key className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-outline group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" 
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-surface-low border-none rounded-[32px] py-5 pl-14 pr-6 font-headline font-bold focus:ring-2 focus:ring-primary outline-none transition-all"
                  required
                />
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full py-6 bg-primary text-white rounded-[40px] font-headline font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all mt-6"
        >
          학습 시작하기
        </button>
      </form>
      
      <p className="mt-8 text-xs text-outline opacity-60 text-center">처음 오셨다면 이름과 비밀번호를 만들고,<br/>이미 계정이 있다면 쓰던 정보를 입력하세요.</p>
    </div>
  );
};

const QuizPlayView = ({ questions, onComplete }: { questions: Question[]; onComplete: (results: QuizResult[]) => void }) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [results, setResults] = React.useState<QuizResult[]>([]);
  const currentQuestion = questions[currentIndex];
  const [shuffledOptions, setShuffledOptions] = React.useState<string[]>([]);

  React.useEffect(() => {
    if (currentQuestion.options) {
      setShuffledOptions(shuffleArray(currentQuestion.options));
    }
  }, [currentIndex, currentQuestion]);

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === currentQuestion.correctAnswer;
    const newResult = { questionId: currentQuestion.id, userAnswer: answer, isCorrect };
    const newResults = [...results, newResult];
    
    setResults(newResults);
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete(newResults);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-primary tracking-widest">QUESTION</span>
          <span className="text-xl font-headline font-black">{currentIndex + 1} <span className="text-outline opacity-40">/ {questions.length}</span></span>
        </div>
        <div className="w-32 bg-surface-variant/30 h-1.5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <motion.div 
        key={currentIndex}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        className="bg-surface-lowest p-8 rounded-[40px] shadow-sm ring-1 ring-outline-variant/10 min-h-[300px] flex flex-col justify-center text-center"
      >
        <h2 className="font-headline font-bold text-2xl text-on-surface leading-snug">
          {currentQuestion.text}
        </h2>
      </motion.div>

      <div className="grid gap-3">
        {shuffledOptions.map((opt, i) => (
          <motion.button
            key={opt}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleAnswer(opt)}
            className="w-full bg-surface-lowest p-5 rounded-3xl flex items-center justify-between group hover:bg-primary hover:text-white transition-all shadow-sm ring-1 ring-outline-variant/10"
          >
            <div className="flex items-center gap-4">
              <span className="w-8 h-8 rounded-xl bg-surface-low text-primary flex items-center justify-center font-bold font-headline group-hover:bg-white/20 group-hover:text-white transition-colors">
                {i + 1}
              </span>
              <span className="font-bold text-lg">{opt}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-outline group-hover:text-white" />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

const LeaderboardView = ({ classId, currentUserId, isAdmin }: { classId: string; currentUserId?: string; isAdmin?: boolean }) => {
  const [leaders, setLeaders] = React.useState<any[]>([]);

  React.useEffect(() => {
    const q = query(
      collection(db, 'leaderboards', classId, 'students'),
      orderBy('score', 'desc'),
      limit(20)
    );
    return onSnapshot(q, (snapshot) => {
      setLeaders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  }, [classId]);

  const handleResetLeaderboard = async () => {
    if (!isAdmin) {
      alert("선생님만 초기화할 수 있습니다.");
      return;
    }
    if (!window.confirm("정말로 전체 랭킹을 초기화하시겠습니까? 학생들의 모든 점수가 삭제됩니다.")) return;
    
    try {
      const snap = await getDocs(collection(db, 'leaderboards', classId, 'students'));
      const batch = writeBatch(db);
      snap.docs.forEach((d) => {
        batch.delete(d.ref);
      });
      await batch.commit();
      alert("랭킹이 초기화되었습니다.");
    } catch (err) {
      console.error(err);
      alert("초기화 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-primary/20">
        {isAdmin && (
          <button 
            onClick={handleResetLeaderboard}
            className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white/40 rounded-full transition-all z-20"
            title="랭킹 초기화"
          >
            <Trash2 className="w-5 h-5 text-white" />
          </button>
        )}
        <div className="relative z-10 flex flex-col items-center">
          <Award className="w-12 h-12 mb-4 text-tertiary shadow-glow" />
          <h2 className="font-headline font-black text-2xl">{classId}</h2>
          <p className="text-on-primary-container font-medium opacity-80">학급 실시간 랭킹</p>
        </div>
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="space-y-3">
        {leaders.map((leader, i) => (
          <div key={leader.id} className={cn(
            "p-4 rounded-3xl flex items-center justify-between shadow-sm ring-1 ring-outline-variant/5",
            leader.id === currentUserId ? "bg-primary-container/10 ring-primary/20" : "bg-surface-lowest"
          )}>
            <div className="flex items-center gap-4">
              <span className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center font-black",
                i === 0 ? "bg-tertiary-container text-tertiary" : 
                i === 1 ? "bg-surface-variant text-outline" : 
                i === 2 ? "bg-tertiary-container/30 text-tertiary" : "bg-surface-low text-outline"
              )}>{i + 1}</span>
              <div>
                <p className="font-headline font-bold text-on-surface">{leader.displayName}</p>
                <p className="text-[10px] text-outline font-bold uppercase tracking-wider">{leader.accuracy}% Accuracy</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xl font-headline font-black text-primary">{leader.score}</span>
              <span className="text-[10px] font-bold text-outline ml-1">pts</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const AchievementsView = ({ profile }: { profile: UserProfile }) => {
  const earnedIds = profile.achievements || [];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-tertiary to-tertiary-dim rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-tertiary/20">
        <div className="relative z-10">
          <Trophy className="w-12 h-12 mb-4 text-white shadow-glow" />
          <h2 className="font-headline font-black text-2xl">나의 업적</h2>
          <p className="text-white/80 font-medium">{earnedIds.length} / {ACHIEVEMENTS.length} 달성 완료</p>
        </div>
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="grid gap-4">
        {ACHIEVEMENTS.map((ach) => {
          const isEarned = earnedIds.includes(ach.id);
          return (
            <motion.div 
              key={ach.id}
              whileHover={isEarned ? { scale: 1.02 } : {}}
              className={cn(
                "p-5 rounded-[32px] flex items-center gap-5 transition-all",
                isEarned 
                  ? "bg-surface-lowest shadow-sm ring-1 ring-outline-variant/10" 
                  : "bg-surface-lowest/40 opacity-50 grayscale"
              )}
            >
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-inner",
                ach.color
              )}>
                {ach.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-headline font-bold text-on-surface">{ach.title}</h3>
                <p className="text-sm text-outline font-medium leading-tight mt-0.5">{ach.description}</p>
              </div>
              {isEarned && <CheckCircle2 className="w-6 h-6 text-secondary" />}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [mode, setMode] = React.useState<AppMode>('login');
  const [userProfile, setUserProfile] = React.useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = React.useState<ActiveTab>('quizzes');
  const [activeQuestionId, setActiveQuestionId] = React.useState(1);
  const [results, setResults] = React.useState<QuizResult[]>([]);
  const [currentQuestions, setCurrentQuestions] = React.useState<Question[]>([]);
  const [incorrectIds, setIncorrectIds] = React.useState<number[]>([]);
  const [solvingId, setSolvingId] = React.useState<number | null>(null);

  const startQuiz = () => {
    const pool = shuffleArray(QUIZ_QUESTIONS);
    // Pick 7 questions for each session to keep it fresh
    setCurrentQuestions(pool.slice(0, 7));
    setResults([]);
    setMode('quiz');
  };

  // Connection & Initial Session check
  React.useEffect(() => {
    const init = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (e) {}

      const savedUid = localStorage.getItem('cell_explorer_uid');
      if (savedUid) {
        const userRef = doc(db, 'users', savedUid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const profile = userDoc.data() as UserProfile;
          
          // Force admin sync for existing sessions
          const isAdmin = (profile.displayName === '강시윤' && profile.password === '130328');
          if (isAdmin && !profile.isAdmin) {
             await updateDoc(userRef, { isAdmin: true });
             profile.isAdmin = true;
          }

          setUserProfile(profile);
          setMode('main');
          const incSnap = await getDocs(collection(db, 'users', savedUid, 'incorrect_answers'));
          setIncorrectIds(incSnap.docs.map(d => Number(d.id)));
        } else {
          localStorage.removeItem('cell_explorer_uid');
        }
      }
    };
    init();
  }, []);

  const handleLogin = async (rawName: string, rawPw: string) => {
    const name = rawName.trim();
    const pw = rawPw.trim();
    if (!name || !pw) {
      alert('이름과 비밀번호를 모두 입력해주세요.');
      return;
    }
    const classId = '1학년 4반';
    const uid = `${name}_${classId}`.replace(/\s+/g, '_');
    const userRef = doc(db, 'users', uid);
    const isAdmin = (name === '강시윤' && pw === '130328');
    
    try {
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const profile = userDoc.data() as UserProfile;
        if (profile.password === pw) {
          // Update admin status if it has changed
          if (profile.isAdmin !== isAdmin) {
            await updateDoc(userRef, { isAdmin });
            profile.isAdmin = isAdmin;
          }
          setUserProfile(profile);
          localStorage.setItem('cell_explorer_uid', uid);
          setMode('main');
          const incSnap = await getDocs(collection(db, 'users', uid, 'incorrect_answers'));
          setIncorrectIds(incSnap.docs.map(d => Number(d.id)));
        } else {
          alert('비밀번호가 틀렸습니다!');
        }
      } else {
        // Create new profile
        const newProfile: UserProfile = {
          uid,
          displayName: name,
          classId,
          password: pw,
          isAdmin,
          totalScore: 0,
          accuracy: 0,
          createdAt: new Date().toISOString()
        };
        await setDoc(userRef, newProfile);
        // Leaderboard entry
        await setDoc(doc(db, 'leaderboards', classId, 'students', uid), {
          displayName: name,
          score: 0,
          accuracy: 0,
          updatedAt: new Date().toISOString(),
          isAdmin
        });
        setUserProfile(newProfile);
        localStorage.setItem('cell_explorer_uid', uid);
        setMode('main');
      }
    } catch (err) {
      console.error(err);
      alert(`로그인 처리 중 오류 발생: ${err instanceof Error ? err.message : 'Unknown'}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('cell_explorer_uid');
    setUserProfile(null);
    setMode('login');
    setActiveTab('quizzes');
  };

  const handleQuizComplete = async (quizResults: QuizResult[]) => {
    setResults(quizResults);
    setMode('result');
    if (quizResults.length > 0) {
      setActiveQuestionId(quizResults[0].questionId);
    }
    if (userProfile) {
      const score = quizResults.filter(r => r.isCorrect).length;
      const accuracy = Math.round((score / currentQuestions.length) * 100);
      
      const userRef = doc(db, 'users', userProfile.uid);
      const leadRef = doc(db, 'leaderboards', userProfile.classId, 'students', userProfile.uid);
      const currentIncorrect = quizResults.filter(r => !r.isCorrect);
      
      try {
        const earnedNow: string[] = userProfile.achievements || [];
        
        // Check achievements
        if (!earnedNow.includes('first_quiz')) earnedNow.push('first_quiz');
        if (score === currentQuestions.length && !earnedNow.includes('perfect_score')) earnedNow.push('perfect_score');
        if ((userProfile.totalScore + score) >= 50 && !earnedNow.includes('score_50')) earnedNow.push('score_50');
        if (accuracy === 100 && !earnedNow.includes('accuracy_master')) earnedNow.push('accuracy_master');
        if (incorrectIds.length >= 3 && !earnedNow.includes('reviewer_silver')) earnedNow.push('reviewer_silver');

        await Promise.all([
          updateDoc(userRef, { 
            totalScore: increment(score), 
            accuracy: accuracy,
            achievements: earnedNow
          }),
          updateDoc(leadRef, {
            score: increment(score), 
            accuracy: accuracy, 
            updatedAt: new Date().toISOString()
          }),
          ...currentIncorrect.map(inc => 
            setDoc(doc(db, 'users', userProfile.uid, 'incorrect_answers', inc.questionId.toString()), {
              questionId: inc.questionId, 
              userAnswer: inc.userAnswer, 
              timestamp: new Date().toISOString()
            })
          )
        ]);

        const freshDoc = await getDoc(userRef);
        if (freshDoc.exists()) setUserProfile(freshDoc.data() as UserProfile);

        setIncorrectIds(Array.from(new Set([...incorrectIds, ...currentIncorrect.map(i => i.questionId)])));
      } catch (err) {
        console.error("Score registration error:", err);
      }
    }
  };

  const handleShare = async () => {
    const title = "Cell Explorer - 1학년 4반 세포 퀴즈";
    const text = "세포 구조와 생물의 구성 단계를 퀴즈로 재미있게 공부해요!";
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
      } catch (err) {
        console.error("Share failed:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert("링크가 복사되었습니다! 친구들에게 공유해 보세요.");
      } catch (err) {
        alert("링크 복사에 실패했습니다. 주소창의 URL을 직접 복사해 주세요.");
      }
    }
  };

  const renderContent = () => {
    if (mode === 'login') return <LoginView onLogin={handleLogin} />;
    if (mode === 'quiz') return <QuizPlayView questions={currentQuestions} onComplete={handleQuizComplete} />;

    if (solvingId !== null) {
      const q = QUIZ_QUESTIONS.find(item => item.id === solvingId);
      if (!q) {
        setSolvingId(null);
        return null;
      }
      return (
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-primary font-bold">
            <RefreshCw className="w-5 h-5 animate-spin-slow" />
            <span>오답 다시 풀기</span>
          </div>
          <DetailExplanation question={q} />
          <button onClick={() => setSolvingId(null)} className="w-full py-5 bg-primary text-white rounded-[40px] font-headline font-bold shadow-lg shadow-primary/20">오답 노트로 돌아가기</button>
        </div>
      );
    }

    if (mode === 'result') {
      const activeQuestion = currentQuestions.find(q => q.id === activeQuestionId) || currentQuestions[0];
      return (
        <div className="space-y-8 pb-32">
          <ScoreSummaryCard score={results.filter(r => r.isCorrect).length} total={currentQuestions.length} />
          <div className="flex gap-3">
             <button onClick={() => startQuiz()} className="flex-1 py-4 bg-primary text-white rounded-3xl font-headline font-bold flex items-center justify-center gap-2"><RefreshCw className="w-5 h-5" /> 다시 풀기</button>
             <button onClick={() => { setMode('main'); setActiveTab('quizzes'); }} className="flex-1 py-4 bg-surface-lowest text-primary rounded-3xl font-headline font-bold ring-1 ring-primary/20">홈으로</button>
          </div>
          <QuestionNavGrid results={results} onSelect={setActiveQuestionId} activeId={activeQuestionId} />
          {activeQuestion && (
            <DetailExplanation question={activeQuestion} result={results.find(r => r.questionId === activeQuestion.id)} />
          )}
        </div>
      );
    }

    switch (activeTab) {
      case 'quizzes':
        return (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center space-y-8">
            <div className="relative">
               <div className="w-32 h-32 bg-primary/5 rounded-[48px] rotate-12 absolute inset-0" />
               <div className="w-32 h-32 bg-primary/10 rounded-[48px] -rotate-6 absolute inset-0" />
               <div className="w-32 h-32 bg-white rounded-[40px] shadow-sm ring-1 ring-outline-variant/10 flex items-center justify-center relative z-10 text-primary"><Play className="w-16 h-16 fill-current" /></div>
            </div>
            <div>
              <h2 className="font-headline font-black text-3xl text-primary mb-2">Quiz Battle</h2>
              <p className="text-outline font-medium">세포 속 여행을 시작할 준비가 되었나요?<br/>최고의 랭킹에 도전해 보세요!</p>
            </div>
            <button onClick={() => startQuiz()} className="w-full max-w-xs py-5 bg-primary text-white rounded-[40px] font-headline font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all">퀴즈 시작하기</button>
          </div>
        );
      case 'incorrect-notes':
        return (
          <div className="space-y-6">
            <div className="bg-secondary-container/30 rounded-[40px] p-8 flex items-center justify-between">
              <div>
                <h2 className="font-headline font-bold text-2xl text-on-secondary-container">나의 오답 노트</h2>
                <p className="text-sm text-on-secondary-container/70 mt-1">실시간으로 저장된 {incorrectIds.length}개의 오답</p>
              </div>
              <ClipboardList className="w-12 h-12 text-secondary opacity-50" />
            </div>
            <div className="grid gap-3">
               {QUIZ_QUESTIONS.filter(q => incorrectIds.includes(q.id)).map(q => (
                 <motion.div key={q.id} layout className="bg-surface-lowest p-6 rounded-[32px] shadow-sm ring-1 ring-outline-variant/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-error-container text-error flex items-center justify-center font-black">{q.id}</div>
                      <p className="font-bold text-on-surface line-clamp-1 max-w-[180px]">{q.text}</p>
                    </div>
                    <button onClick={() => setSolvingId(q.id)} className="p-3 bg-surface-low rounded-2xl text-primary"><RefreshCw className="w-5 h-5"/></button>
                 </motion.div>
               ))}
               {incorrectIds.length === 0 && (
                 <div className="py-20 text-center text-outline">
                    <CheckCircle2 className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>축하합니다!<br/>틀린 문제가 하나도 없어요!</p>
                 </div>
               )}
            </div>
          </div>
        );
      case 'leaderboard':
        return userProfile ? <LeaderboardView classId={userProfile.classId} currentUserId={userProfile.uid} isAdmin={userProfile.isAdmin} /> : null;
      case 'achievements':
        return userProfile ? <AchievementsView profile={userProfile} /> : null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <TopAppBar 
        title={
          mode === 'login' ? "Welcome" : 
          mode === 'quiz' ? "Solving Quiz" : 
          mode === 'result' ? "Quiz Analysis" : 
          activeTab === 'leaderboard' ? "Hall of Fame" : 
          activeTab === 'incorrect-notes' ? "Review Notes" : "Cell Explorer"
        }
        onBack={solvingId ? () => setSolvingId(null) : (mode === 'main' && activeTab !== 'quizzes' ? () => setActiveTab('quizzes') : undefined)}
        onShare={handleShare}
        rightElement={mode === 'main' ? (
          <button onClick={handleLogout} className="p-2 hover:bg-error-container hover:text-error rounded-full transition-all"><LogOut className="w-5 h-5" /></button>
        ) : undefined}
      />
      
      <main className={cn("flex-1 px-4 py-6 max-w-2xl mx-auto w-full", (mode === 'main' || mode === 'result') ? "pb-28" : "")}>
        {renderContent()}
      </main>

      {mode === 'main' && !solvingId && (
        <BottomNavBar active={activeTab} onNav={setActiveTab} />
      )}
    </div>
  );
}
