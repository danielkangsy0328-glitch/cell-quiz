import { Question } from './types';

export const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    type: 'multiple',
    text: '생명체를 구성하는 가장 기본적인 단위는 무엇일까요?',
    options: ['기관', '세포', '조직', '개체'],
    correctAnswer: '세포',
    explanation: '모든 생명체는 세포라는 기본 단위로 이루어져 있습니다.',
    tags: ['BIOLOGY', 'CELL BASICS']
  },
  {
    id: 2,
    type: 'multiple',
    text: '세포의 가장 바깥쪽을 둘러싸고 있으며, 세포 안팎으로 물질이 드나드는 것을 조절하는 곳은?',
    options: ['핵', '세포막', '세포질', '세포벽'],
    correctAnswer: '세포막',
    explanation: '세포막은 세포를 보호하고 산소나 영양분 등의 물질 출입을 조절합니다.',
    tags: ['CELL STRUCTURE', 'MEMBRANE']
  },
  {
    id: 3,
    type: 'multiple',
    text: '식물 세포(검정말 등)의 핵을 염색할 때 사용하는 붉은색 용액은?',
    options: ['메틸렌 블루 용액', '아이오딘-아이오딘화 칼륨 용액', '에탄올 용액', '아세트올세인 용액'],
    correctAnswer: '아세트올세인 용액',
    explanation: '식물 세포의 핵을 뚜렷하게 관찰하기 위해서는 주로 붉은색을 띠는 아세트올세인 용액을 사용합니다.',
    tags: ['BIOLOGY', 'CELL STRUCTURE', 'STAINING'],
    imageUrl: 'https://picsum.photos/seed/microscope-cell/800/400',
    imageCaption: '현미경으로 관찰한 식물 세포(검정말)의 모습'
  },
  {
    id: 4,
    type: 'multiple',
    text: '세포에서 생명 활동의 중심이 되며 유전 물질이 들어 있는 곳은?',
    options: ['세포막', '세포질', '핵', '엽록체'],
    correctAnswer: '핵',
    explanation: '핵은 유전 물질인 DNA를 포함하고 있어 세포의 생명 활동을 조절합니다.',
    tags: ['CELL STRUCTURE', 'NUCLEUS']
  },
  {
    id: 5,
    type: 'multiple',
    text: '식물 세포에만 있고 동물 세포에는 없는 구조는 무엇인가요?',
    options: ['세포벽, 엽록체', '핵, 세포막', '세포질, 리보솜', '미토콘드리아, 핵'],
    correctAnswer: '세포벽, 엽록체',
    explanation: '세포벽과 엽록체는 식물 세포의 특징적인 구조입니다.',
    tags: ['PLANT CELL', 'ANIMAL CELL']
  },
  {
    id: 6,
    type: 'multiple',
    text: '식물 세포에서 세포막 바깥쪽에 있는 두껍고 단단한 단단한 벽으로, 세포 모양을 일정하게 유지해 주는 곳은?',
    options: ['세포막', '세포벽', '세포질', '핵'],
    correctAnswer: '세포벽',
    explanation: '세포벽은 식물 세포에만 있으며, 세포를 보호하고 그 모양을 단단히 유지해 줍니다.',
    tags: ['PLANT CELL', 'CELL WALL']
  },
  {
    id: 7,
    type: 'multiple',
    text: '입안 상피 세포(동물 세포)를 염색할 때 주로 사용하는 푸른색 용액은?',
    options: ['아세트올세인', '아이오딘 용액', '메틸렌 블루 용액', '증류수'],
    correctAnswer: '메틸렌 블루 용액',
    explanation: '동물 세포의 핵은 주로 푸른색의 메틸렌 블루 용액으로 염색하여 관찰합니다.',
    tags: ['ANIMAL CELL', 'STAINING']
  },
  {
    id: 8,
    type: 'multiple',
    text: '식물 세포의 엽록체에서 일어나는 중요한 생명 활동은 무엇인가요?',
    options: ['호흡', '광합성', '소화', '배설'],
    correctAnswer: '광합성',
    explanation: '식물 세포의 엽록체에서는 빛 에너지를 이용하여 유기물을 만드는 광합성이 일어납니다.',
    tags: ['PLANT CELL', 'PHOTOSYNTHESIS']
  },
  {
    id: 9,
    type: 'multiple',
    text: '세포 안을 채우고 있으며, 핵을 제외한 나머지 부분으로 여러 가지 세포 소기관이 들어 있는 곳은?',
    options: ['세포막', '세포벽', '세포질', '핵'],
    correctAnswer: '세포질',
    explanation: '세포질은 세포 안에서 핵을 제외한 나머지 부분을 말하며, 다양한 생명 활동이 일어나는 장소입니다.',
    tags: ['CELL STRUCTURE', 'CYTOPLASM']
  },
  {
    id: 10,
    type: 'multiple',
    text: '세포가 생명 활동을 하는 데 필요한 에너지를 만들어내는 세포 안의 공장과 같은 곳은?',
    options: ['핵', '세포막', '미토콘드리아', '세포벽'],
    correctAnswer: '미토콘드리아',
    explanation: '미토콘드리아는 영양소를 분해하여 세포가 활동하는 데 필요한 에너지를 생산합니다.',
    tags: ['CELL STRUCTURE', 'ENERGY']
  },
  {
    id: 11,
    type: 'multiple',
    text: '식물 세포가 동물 세포와 달리 일정한 모양을 유지할 수 있는 가장 큰 이유는?',
    options: ['핵이 크기 때문에', '세포벽이 있기 때문에', '엽록체가 많기 때문에', '세포질이 단단해서'],
    correctAnswer: '세포벽이 있기 때문에',
    explanation: '단단한 세포벽이 세포막 바깥쪽에서 세포의 전체적인 모양을 잡아줍니다.',
    tags: ['PLANT CELL', 'CELL WALL']
  },
  {
    id: 12,
    type: 'multiple',
    text: '동물의 몸을 구성하는 단계로 옳은 것은?',
    options: ['세포-조직-기관-기관계-개체', '세포-조직-조직계-기관-개체', '세포-조직-기관-개체', '세포-기관-조직-개체'],
    correctAnswer: '세포-조직-기관-기관계-개체',
    explanation: '동물은 세포-조직-기관-기관계-개체의 단계를 거치며, 식물과 달리 기관계가 있는 것이 특징입니다.',
    tags: ['BIOLOGY', 'ANIMAL HIERARCHY']
  },
  {
    id: 16,
    type: 'multiple',
    text: '식물의 몸을 구성하는 단계로 옳은 것은?',
    options: ['세포-조직-기관-기관계-개체', '세포-조직-조직계-기관-개체', '세포-조직-기관-개체', '세포-기관-조직-개체'],
    correctAnswer: '세포-조직-조직계-기관-개체',
    explanation: '식물은 세포-조직-조직계-기관-개체의 단계를 거치며, 동물과 달리 조직계가 있는 것이 특징입니다.',
    tags: ['BIOLOGY', 'PLANT HIERARCHY']
  },
  {
    id: 17,
    type: 'multiple',
    text: '식물의 몸 구성 단계에는 있지만, 동물의 몸 구성 단계에는 없는 단계는 무엇인가요?',
    options: ['조직', '기관', '조직계', '기관계'],
    correctAnswer: '조직계',
    explanation: '조직계는 식물에만 있는 구성 단계입니다.',
    tags: ['BIOLOGY', 'HIERARCHY']
  },
  {
    id: 18,
    type: 'multiple',
    text: '동물의 몸 구성 단계에는 있지만, 식물의 몸 구성 단계에는 없는 단계는 무엇인가요?',
    options: ['조직', '기관', '조직계', '기관계'],
    correctAnswer: '기관계',
    explanation: '기관계는 동물에만 있는 구성 단계입니다.',
    tags: ['BIOLOGY', 'HIERARCHY']
  }
];

export const ACHIEVEMENTS = [
  {
    id: 'first_quiz',
    title: '세포 탐험의 시작',
    description: '첫 번째 퀴즈를 완료했습니다.',
    icon: '🌱',
    color: 'bg-green-100 text-green-700'
  },
  {
    id: 'perfect_score',
    title: '세포 박사',
    description: '한 세션에서 모든 문제(7개)를 다 맞혔습니다.',
    icon: '🎓',
    color: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'score_50',
    title: '지식의 축적',
    description: '누적 점수 50점을 달성했습니다.',
    icon: '📚',
    color: 'bg-purple-100 text-purple-700'
  },
  {
    id: 'accuracy_master',
    title: '완벽주의자',
    description: '퀴즈 정확도가 100%입니다.',
    icon: '🎯',
    color: 'bg-red-100 text-red-700'
  },
  {
    id: 'reviewer_silver',
    title: '복습의 귀재',
    description: '오답을 3개 이상 확인했습니다.',
    icon: '🔍',
    color: 'bg-amber-100 text-amber-700'
  }
];
