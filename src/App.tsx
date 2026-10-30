import React, { useState, useEffect, useMemo } from 'react';
import {
  Scale,
  Car,
  Palette,
  Cpu,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  BarChart3,
  MessageSquareQuote,
  CheckCircle2,
  Users,
  SlidersHorizontal,
  Sun,
  Flower2,
} from 'lucide-react';
import {
  ChoiceOption,
  DilemmaResponseRecord,
  insertDilemmaResponse,
  fetchDilemmaResponses,
} from './lib/supabase';

interface DilemmaOptionDetail {
  code: ChoiceOption;
  title: string;
  subtitle: string;
  principle: string;
  description: string;
  consequence: string;
}

interface DilemmaQuestion {
  id: 'q1' | 'q2' | 'q3';
  number: string;
  category: string;
  title: string;
  scenario: string;
  coreQuestion: string;
  optionA: DilemmaOptionDetail;
  optionB: DilemmaOptionDetail;
}

const DILEMMA_QUESTIONS: DilemmaQuestion[] = [
  {
    id: 'q1',
    number: '01',
    category: '자율주행과 생명 윤리',
    title: '자율주행 씽씽카 사고 책임과 보호 우선순위',
    scenario:
      '햇살 가득한 프렌즈 마을 도로에서 시속 60km로 달리는 자율주행 자동차 앞에 갑자기 산책하던 친구 2명이 도로로 뛰어들었습니다! 멈추기엔 거리가 너무 짧아서 그대로 직진하면 보행자 친구들과 부딪히고, 급하게 핸들을 꺾으면 하얀 울타리와 부딪혀 차 안에 탄 탑승자 친구 1명이 크게 다치게 됩니다.',
    coreQuestion: '자율주행 제어 알고리즘은 위기 상황에서 누구를 먼저 보호하도록 만들어져야 할까요?',
    optionA: {
      code: 'A',
      title: '보행자 보호 우선 알고리즘',
      subtitle: '핸들을 꺾어 길 위의 보행자 친구들 피해를 최소화',
      principle: '공리주의적 피해 최소화 · 교통 약자 보호 원칙',
      description:
        '전체 다치는 사람의 수를 줄이고, 차라는 보호 장치가 없는 길 위의 보행자를 최우선으로 지키도록 설계합니다.',
      consequence: '마을 전체 사상자 수는 줄어들지만, 탑승자가 위험해질 수 있어 자율주행차 이용을 망설일 수 있어요.',
    },
    optionB: {
      code: 'B',
      title: '탑승자 보호 우선 알고리즘',
      subtitle: '차선을 유지하며 급제동해 차 안의 탑승자 안전 최우선',
      principle: '의무론적 신의성실 · 탑승자 안전 보장 원칙',
      description:
        '자동차를 믿고 탑승한 승객을 고의적인 위험으로 몰아넣지 않으며, 정해진 주행 차선 안에서 최대 제동만 수행합니다.',
      consequence: '탑승자의 신뢰와 안심도는 높아지지만, 길 위 보행자 친구들의 피해 위험이 커집니다.',
    },
  },
  {
    id: 'q2',
    number: '02',
    category: '생성형 AI와 창작 생태계',
    title: 'AI 그림 생성기와 예술가 데이터 학습 저작권',
    scenario:
      '프렌즈 마을의 IT 회사가 마을 화가들이 정성껏 그린 수백만 점의 해바라기·풍경 일러스트를 사전 허락 없이 학습해 초고속 그림 생성 AI를 출시했습니다. 이제 누구나 화가들의 그림체와 똑같은 상업용 포스터를 단 몇 초 만에 무료에 가깝게 찍어내고 있습니다.',
    coreQuestion: '인간 예술가의 작품을 학습한 AI 생성물의 상업적 이용을 어디까지 허용해야 할까요?',
    optionA: {
      code: 'A',
      title: '자유로운 학습 및 상업적 이용 허용',
      subtitle: '기계 학습을 공정 이용(Fair Use) 및 창작 도구 혁신으로 인정',
      principle: '기술 혁신 촉진 · 누구나 창작할 수 있는 접근성 확장',
      description:
        '사람이 기존 그림을 보고 배우는 것처럼 AI의 스타일 학습을 인정하고, 만들어진 결과물의 상업적 활용을 폭넓게 허용합니다.',
      consequence: '누구나 쉽게 멋진 디자인을 만들 수 있지만, 원작 화가들의 경제적 기반이 흔들릴 수 있어요.',
    },
    optionB: {
      code: 'B',
      title: '사전 동의(Opt-in) 및 저작권 보상 의무화',
      subtitle: '원작자 허락 및 수익 배분 없는 상업적 이용 제한',
      principle: '지적재산권 보호 · 창작 노력에 대한 정당한 보상 원칙',
      description:
        '학습 데이터에 포함된 원작 화가의 명시적 동의와 정당한 저작권료 지급이 이루어진 경우에만 상업적 AI 운영을 허용합니다.',
      consequence: '창작자의 권리와 예술 생태계는 든든히 보호되지만, AI 개발 비용이 크게 높아집니다.',
    },
  },
  {
    id: 'q3',
    number: '03',
    category: '알고리즘 공정성과 투명성',
    title: '우리 마을 중요 심사에서의 AI 알고리즘 자동 판정',
    scenario:
      '프렌즈 마을 은행과 채용 센터가 매년 수십만 건의 장학금·대출·채용 서류를 심사하기 위해 딥러닝 자동 심사 로봇을 도입했습니다. 심사 속도는 10배 빨라졌지만, 탈락한 지원자들은 도대체 어떤 항목 때문에 떨어졌는지 설명을 듣지 못해 답답해하고 있습니다.',
    coreQuestion: '개인의 기회에 큰 영향을 미치는 심사에서 AI 자동화를 어떻게 적용해야 할까요?',
    optionA: {
      code: 'A',
      title: '데이터 기반 AI 자동 심사 전면 적용',
      subtitle: '객관적 통계 지표와 빠른 처리 효율성을 우선한 자동 판정',
      principle: '절차적 일관성 · 행정 및 심사 효율성 극대화',
      description:
        '사람 심사관의 피로도와 주관적 편견을 없애고, 검증된 대규모 데이터 모델을 통해 빠르고 일관된 심사 결과를 도출합니다.',
      consequence: '심사 대기 시간이 줄고 동일한 잣대가 적용되지만, 개인의 특별한 사정이나 알고리즘 편향을 놓칠 수 있어요.',
    },
    optionB: {
      code: 'B',
      title: '인간 개입(Human-in-the-Loop) 및 설명 가능성 의무화',
      subtitle: '최종 결정에 사람의 검토와 판단 이유 공개를 필수 보장',
      principle: '알고리즘 투명성 · 설명 요구권 및 재심 청구권 보장',
      description:
        'AI는 보조 참고 자료로만 활용하며, 모든 중요 결정에는 사람 담당자의 최종 확인과 납득 가능한 이유 설명을 의무화합니다.',
      consequence: '공정한 소명 기회와 권리가 두텁게 보장되지만, 심사 기간과 운영 비용이 늘어납니다.',
    },
  },
];

const GENDER_OPTIONS = ['남성', '여성', '기타/선택안함'];
const AGE_GROUP_OPTIONS = ['10대', '20대', '30대', '40대', '50대 이상'];

/**
 * 귀여운 파스텔 동화풍 화이트 피켓 펜스 장식 컴포넌트
 */
function WhitePicketFence() {
  return (
    <div className="w-full overflow-hidden select-none" aria-hidden="true">
      <svg viewBox="0 0 1200 44" className="w-full h-8 sm:h-10 preserve-3d" preserveAspectRatio="none">
        {/* Horizontal rails */}
        <rect x="0" y="16" width="1200" height="6" fill="#FFFFFF" stroke="#8C6D4F" strokeWidth="2" />
        <rect x="0" y="30" width="1200" height="6" fill="#FFFFFF" stroke="#8C6D4F" strokeWidth="2" />
        {/* Vertical pickets */}
        {Array.from({ length: 40 }).map((_, i) => {
          const x = i * 30 + 6;
          return (
            <path
              key={i}
              d={`M ${x} 42 L ${x} 12 L ${x + 9} 3 L ${x + 18} 12 L ${x + 18} 42 Z`}
              fill="#FFFFFF"
              stroke="#8C6D4F"
              strokeWidth="2"
              strokeLinejoin="round"
            />
          );
        })}
      </svg>
    </div>
  );
}

/**
 * 동화 일러스트 스타일의 딜레마 시뮬레이션 캔버스
 */
function DilemmaStorybookVisualizer({
  questionId,
  selectedChoice,
}: {
  questionId: 'q1' | 'q2' | 'q3';
  selectedChoice?: ChoiceOption;
}) {
  if (questionId === 'q1') {
    const isA = selectedChoice === 'A';
    const isB = selectedChoice === 'B';
    return (
      <div className="relative w-full rounded-2xl border-2 border-[#6B4F35] bg-[#88C9E8] p-4 text-[#4A3520] overflow-hidden">
        <div className="flex items-center justify-between text-xs font-bold text-[#3B2A18] mb-2 bg-[#FFFDF5]/90 px-3 py-1.5 rounded-xl border border-[#6B4F35]">
          <span>SCENE 01 · 프렌즈 마을 산책로 자율주행 딜레마</span>
          <span className="font-mono tabular-nums">
            {selectedChoice ? `선택 경로: 옵션 ${selectedChoice}` : '경로를 선택해 주세요'}
          </span>
        </div>

        <svg viewBox="0 0 680 210" className="w-full h-44 rounded-xl border-2 border-[#6B4F35] bg-[#FDF2C5]">
          {/* Sky strip & trees */}
          <rect x="0" y="0" width="680" height="52" fill="#88C9E8" />
          <circle cx="80" cy="24" r="14" fill="#94D82D" stroke="#5C940D" strokeWidth="2" />
          <rect x="77" y="34" width="6" height="12" fill="#8C6D4F" />
          <circle cx="240" cy="22" r="16" fill="#74B816" stroke="#5C940D" strokeWidth="2" />
          <rect x="237" y="34" width="6" height="12" fill="#8C6D4F" />
          <circle cx="590" cy="24" r="14" fill="#94D82D" stroke="#5C940D" strokeWidth="2" />
          <rect x="587" y="34" width="6" height="12" fill="#8C6D4F" />

          {/* White Fence along top */}
          <rect x="0" y="42" width="680" height="12" fill="#FFFFFF" stroke="#8C6D4F" strokeWidth="1.5" />

          {/* Warm Sand Road */}
          <rect x="0" y="54" width="680" height="156" fill="#F8E3A3" />
          <line
            x1="20"
            y1="132"
            x2="660"
            y2="132"
            stroke="#FFFFFF"
            strokeWidth="4"
            strokeDasharray="16 12"
          />

          {/* Crosswalk */}
          <g fill="#FFFFFF" stroke="#8C6D4F" strokeWidth="1.5">
            <rect x="470" y="64" width="32" height="18" rx="4" />
            <rect x="470" y="92" width="32" height="18" rx="4" />
            <rect x="470" y="120" width="32" height="18" rx="4" />
            <rect x="470" y="148" width="32" height="18" rx="4" />
            <rect x="470" y="176" width="32" height="18" rx="4" />
          </g>

          {/* Guard Fence Danger Zone */}
          <rect x="340" y="36" width="180" height="18" rx="6" fill="#FF9EBB" stroke="#6B4F35" strokeWidth="2" />
          <text x="430" y="49" textAnchor="middle" fill="#4A3520" fontSize="10" fontWeight="700">
            울타리 충돌 구간 (탑승자 부상 위험)
          </text>

          {/* Path A: Swerve up */}
          <path
            d="M 155 150 Q 290 148 415 58"
            fill="none"
            stroke={isA ? '#2B8A3E' : '#8C6D4F'}
            strokeWidth={isA ? '5' : '2.5'}
            strokeDasharray={isA ? 'none' : '8 6'}
          />
          <circle cx="415" cy="58" r="7" fill={isA ? '#2B8A3E' : '#8C6D4F'} />
          <rect x="210" y="70" width="165" height="24" rx="8" fill="#FFFDF5" stroke="#6B4F35" strokeWidth="1.5" />
          <text x="292" y="86" textAnchor="middle" fill="#2B8A3E" fontSize="11" fontWeight="700">
            선택 A: 방향 전환 (보행자 보호)
          </text>

          {/* Path B: Straight */}
          <path
            d="M 155 150 L 458 150"
            fill="none"
            stroke={isB ? '#E67700' : '#8C6D4F'}
            strokeWidth={isB ? '5' : '2.5'}
            strokeDasharray={isB ? 'none' : '8 6'}
          />
          <circle cx="458" cy="150" r="7" fill={isB ? '#E67700' : '#8C6D4F'} />
          <rect x="210" y="168" width="165" height="24" rx="8" fill="#FFFDF5" stroke="#6B4F35" strokeWidth="1.5" />
          <text x="292" y="184" textAnchor="middle" fill="#D9480F" fontSize="11" fontWeight="700">
            선택 B: 직진 급제동 (탑승자 보호)
          </text>

          {/* Cute Autonomous Car */}
          <g transform="translate(55, 118)">
            <rect x="0" y="14" width="96" height="38" rx="14" fill="#4DABF7" stroke="#4A3520" strokeWidth="2.5" />
            <path d="M 18 14 Q 48 -8 78 14 Z" fill="#FFFDF5" stroke="#4A3520" strokeWidth="2.5" />
            {/* Cute Bear Driver Head */}
            <circle cx="48" cy="10" r="10" fill="#F59F00" stroke="#4A3520" strokeWidth="2" />
            <circle cx="18" cy="52" r="9" fill="#4A3520" />
            <circle cx="78" cy="52" r="9" fill="#4A3520" />
            <text x="48" y="38" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontWeight="700">
              AI 붕붕카
            </text>
          </g>

          {/* Cute Pedestrians on Crosswalk */}
          <g transform="translate(530, 112)">
            {/* Pink Peach Character */}
            <circle cx="20" cy="22" r="16" fill="#FF9EBB" stroke="#4A3520" strokeWidth="2.5" />
            <circle cx="15" cy="20" r="2" fill="#4A3520" />
            <circle cx="25" cy="20" r="2" fill="#4A3520" />
            {/* Yellow Rabbit Suit Character */}
            <circle cx="62" cy="22" r="16" fill="#FFD43B" stroke="#4A3520" strokeWidth="2.5" />
            <circle cx="57" cy="20" r="2" fill="#4A3520" />
            <circle cx="67" cy="20" r="2" fill="#4A3520" />
            <rect x="2" y="46" width="80" height="22" rx="8" fill="#FFFDF5" stroke="#4A3520" strokeWidth="1.5" />
            <text x="42" y="61" textAnchor="middle" fill="#4A3520" fontSize="11" fontWeight="700">
              산책 친구 2명
            </text>
          </g>
        </svg>
      </div>
    );
  }

  if (questionId === 'q2') {
    const isA = selectedChoice === 'A';
    const isB = selectedChoice === 'B';
    return (
      <div className="relative w-full rounded-2xl border-2 border-[#6B4F35] bg-[#88C9E8] p-4 text-[#4A3520] overflow-hidden">
        <div className="flex items-center justify-between text-xs font-bold text-[#3B2A18] mb-2 bg-[#FFFDF5]/90 px-3 py-1.5 rounded-xl border border-[#6B4F35]">
          <span>SCENE 02 · 해바라기 화실과 AI 그림 생성기</span>
          <span className="font-mono tabular-nums">
            {selectedChoice ? `선택 정책: 옵션 ${selectedChoice}` : '정책을 선택해 주세요'}
          </span>
        </div>

        <svg viewBox="0 0 680 210" className="w-full h-44 rounded-xl border-2 border-[#6B4F35] bg-[#FDF2C5]">
          {/* Left Card: Village Artist */}
          <rect x="24" y="42" width="166" height="124" rx="16" fill="#FFFDF5" stroke="#6B4F35" strokeWidth="2.5" />
          <circle cx="107" cy="82" r="20" fill="#FFD43B" stroke="#6B4F35" strokeWidth="2.5" />
          <circle cx="107" cy="82" r="9" fill="#6B4F35" />
          <text x="107" y="126" textAnchor="middle" fill="#4A3520" fontSize="13" fontWeight="700">
            마을 화가의 원본 그림
          </text>
          <text x="107" y="146" textAnchor="middle" fill="#8C6D4F" fontSize="11">
            해바라기 수채화 · 고유 화풍
          </text>

          {/* Center Card: AI Engine */}
          <rect x="257" y="42" width="166" height="124" rx="16" fill="#E7F5FF" stroke="#6B4F35" strokeWidth="2.5" />
          <rect x="315" y="64" width="50" height="38" rx="10" fill="#4DABF7" stroke="#4A3520" strokeWidth="2" />
          <text x="340" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="700">
            AI 봇
          </text>
          <text x="340" y="126" textAnchor="middle" fill="#4A3520" fontSize="13" fontWeight="700">
            AI 스타일 학습 모델
          </text>
          <text x="340" y="146" textAnchor="middle" fill="#4A3520" fontSize="11">
            수백만 장 데이터 패턴 학습
          </text>

          {/* Right Card: Commercial Goods */}
          <rect x="490" y="42" width="166" height="124" rx="16" fill="#FFFDF5" stroke="#6B4F35" strokeWidth="2.5" />
          <rect x="548" y="64" width="50" height="38" rx="8" fill="#FF9EBB" stroke="#4A3520" strokeWidth="2" />
          <text x="573" y="88" textAnchor="middle" fill="#4A3520" fontSize="11" fontWeight="700">
            GOODS
          </text>
          <text x="573" y="126" textAnchor="middle" fill="#4A3520" fontSize="13" fontWeight="700">
            상업용 광고 · 굿즈 판매
          </text>
          <text x="573" y="146" textAnchor="middle" fill="#8C6D4F" fontSize="11">
            초고속 대량 이미지 생성
          </text>

          {/* Top Arrow: Option A */}
          <path
            d="M 192 84 L 254 84 M 425 84 L 487 84"
            stroke={isA ? '#2B8A3E' : '#8C6D4F'}
            strokeWidth={isA ? '5' : '2.5'}
          />
          <rect x="190" y="10" width="300" height="24" rx="10" fill="#FFFDF5" stroke="#6B4F35" strokeWidth="1.5" />
          <text x="340" y="26" textAnchor="middle" fill="#2B8A3E" fontSize="11" fontWeight="700">
            선택 A: 자유로운 학습 및 상업적 이용 허용 (창작 혁신)
          </text>

          {/* Bottom Loop: Option B */}
          <path
            d="M 573 168 Q 340 206 107 168"
            fill="none"
            stroke={isB ? '#D9480F' : '#8C6D4F'}
            strokeWidth={isB ? '5' : '2.5'}
            strokeDasharray={isB ? 'none' : '8 6'}
          />
          <rect x="175" y="178" width="330" height="24" rx="10" fill="#FFFDF5" stroke="#6B4F35" strokeWidth="1.5" />
          <text x="340" y="194" textAnchor="middle" fill="#D9480F" fontSize="11" fontWeight="700">
            선택 B: 화가 사전 동의(Opt-in) 및 저작권 수익 배분 의무화
          </text>
        </svg>
      </div>
    );
  }

  const isA = selectedChoice === 'A';
  const isB = selectedChoice === 'B';
  return (
    <div className="relative w-full rounded-2xl border-2 border-[#6B4F35] bg-[#88C9E8] p-4 text-[#4A3520] overflow-hidden">
      <div className="flex items-center justify-between text-xs font-bold text-[#3B2A18] mb-2 bg-[#FFFDF5]/90 px-3 py-1.5 rounded-xl border border-[#6B4F35]">
        <span>SCENE 03 · 돋보기 오리 심사관과 AI 자동 심사</span>
        <span className="font-mono tabular-nums">
          {selectedChoice ? `선택 방식: 옵션 ${selectedChoice}` : '심사 방식을 선택해 주세요'}
        </span>
      </div>

      <svg viewBox="0 0 680 210" className="w-full h-44 rounded-xl border-2 border-[#6B4F35] bg-[#FDF2C5]">
        {/* Left: Applicant */}
        <rect x="24" y="60" width="144" height="90" rx="16" fill="#FFFDF5" stroke="#6B4F35" strokeWidth="2.5" />
        <text x="96" y="98" textAnchor="middle" fill="#4A3520" fontSize="13" fontWeight="700">
          마을 주민 신청서
        </text>
        <text x="96" y="120" textAnchor="middle" fill="#8C6D4F" fontSize="11">
          채용 · 장학금 · 대출 서류
        </text>

        {/* Center: AI Magnifying Glass */}
        <rect x="220" y="60" width="154" height="90" rx="16" fill="#E7F5FF" stroke="#6B4F35" strokeWidth="2.5" />
        <circle cx="297" cy="90" r="14" fill="#FFFFFF" stroke="#4A3520" strokeWidth="3" />
        <line x1="307" y1="100" x2="318" y2="111" stroke="#4A3520" strokeWidth="4" strokeLinecap="round" />
        <text x="297" y="132" textAnchor="middle" fill="#4A3520" fontSize="13" fontWeight="700">
          AI 돋보기 심사 엔진
        </text>

        <line x1="168" y1="105" x2="220" y2="105" stroke="#6B4F35" strokeWidth="3" />

        {/* Top Branch A */}
        <path
          d="M 374 86 L 474 52"
          stroke={isA ? '#2B8A3E' : '#8C6D4F'}
          strokeWidth={isA ? '5' : '2.5'}
        />
        <rect
          x="474"
          y="20"
          width="182"
          height="68"
          rx="14"
          fill="#FFFDF5"
          stroke={isA ? '#2B8A3E' : '#6B4F35'}
          strokeWidth="2.5"
        />
        <text x="565" y="48" textAnchor="middle" fill="#2B8A3E" fontSize="13" fontWeight="700">
          선택 A: AI 완전 자동 판정
        </text>
        <text x="565" y="68" textAnchor="middle" fill="#6B4F35" fontSize="11">
          10배 빠른 속도 · 통계 일관성
        </text>

        {/* Bottom Branch B */}
        <path
          d="M 374 124 L 474 156"
          stroke={isB ? '#D9480F' : '#8C6D4F'}
          strokeWidth={isB ? '5' : '2.5'}
        />
        <rect
          x="474"
          y="122"
          width="182"
          height="68"
          rx="14"
          fill="#FFFDF5"
          stroke={isB ? '#D9480F' : '#6B4F35'}
          strokeWidth="2.5"
        />
        <text x="565" y="150" textAnchor="middle" fill="#D9480F" fontSize="13" fontWeight="700">
          선택 B: 사람 검토 + 이유 설명
        </text>
        <text x="565" y="170" textAnchor="middle" fill="#6B4F35" fontSize="11">
          투명한 근거 공개 · 재심사 보장
        </text>
      </svg>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulation' | 'results' | 'opinions'>('simulation');
  const [step, setStep] = useState<'intro' | 'q1' | 'q2' | 'q3'>('intro');

  const [gender, setGender] = useState<string>('');
  const [ageGroup, setAgeGroup] = useState<string>('');

  const [q1Choice, setQ1Choice] = useState<ChoiceOption | undefined>(undefined);
  const [q1Reason, setQ1Reason] = useState<string>('');
  const [q2Choice, setQ2Choice] = useState<ChoiceOption | undefined>(undefined);
  const [q2Reason, setQ2Reason] = useState<string>('');
  const [q3Choice, setQ3Choice] = useState<ChoiceOption | undefined>(undefined);
  const [q3Reason, setQ3Reason] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [allResponses, setAllResponses] = useState<DilemmaResponseRecord[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);

  const [filterGender, setFilterGender] = useState<string>('전체');
  const [filterAge, setFilterAge] = useState<string>('전체');

  const isDemographicsReady = gender.trim() !== '' && ageGroup.trim() !== '';

  useEffect(() => {
    let mounted = true;
    fetchDilemmaResponses()
      .then((records) => {
        if (mounted) {
          setAllResponses(records);
          setIsLoadingStats(false);
        }
      })
      .catch(() => {
        if (mounted) {
          setIsLoadingStats(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  const handleStartSimulation = () => {
    if (!isDemographicsReady) return;
    setStep('q1');
    setActiveTab('simulation');
  };

  const handleResetAll = () => {
    setGender('');
    setAgeGroup('');
    setQ1Choice(undefined);
    setQ1Reason('');
    setQ2Choice(undefined);
    setQ2Reason('');
    setQ3Choice(undefined);
    setQ3Reason('');
    setHasSubmitted(false);
    setStep('intro');
    setActiveTab('simulation');
  };

  const handleSubmitAll = async () => {
    if (!isDemographicsReady || !q1Choice || !q2Choice || !q3Choice) return;
    setIsSubmitting(true);
    try {
      await insertDilemmaResponse({
        gender,
        age_group: ageGroup,
        q1_choice: q1Choice,
        q1_reason: q1Reason,
        q2_choice: q2Choice,
        q2_reason: q2Reason,
        q3_choice: q3Choice,
        q3_reason: q3Reason,
      });
      const updated = await fetchDilemmaResponses();
      setAllResponses(updated);
      setHasSubmitted(true);
      setActiveTab('results');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredResponses = useMemo(() => {
    return allResponses.filter((item) => {
      const matchGender = filterGender === '전체' || item.gender === filterGender;
      const matchAge = filterAge === '전체' || item.age_group === filterAge;
      return matchGender && matchAge;
    });
  }, [allResponses, filterGender, filterAge]);

  const computeStats = (questionKey: 'q1_choice' | 'q2_choice' | 'q3_choice') => {
    const total = filteredResponses.length;
    if (total === 0) {
      return { countA: 0, countB: 0, pctA: 0, pctB: 0, total: 0 };
    }
    const countA = filteredResponses.filter((r) => r[questionKey] === 'A').length;
    const countB = total - countA;
    const pctA = Math.round((countA / total) * 1000) / 10;
    const pctB = Math.round((100 - pctA) * 10) / 10;
    return { countA, countB, pctA, pctB, total };
  };

  const currentQuestionIndex = step === 'q1' ? 0 : step === 'q2' ? 1 : 2;
  const activeQuestion = DILEMMA_QUESTIONS[currentQuestionIndex];

  const currentChoice =
    step === 'q1' ? q1Choice : step === 'q2' ? q2Choice : q3Choice;
  const currentReason =
    step === 'q1' ? q1Reason : step === 'q2' ? q2Reason : q3Reason;

  const setCurrentChoice = (choice: ChoiceOption) => {
    if (step === 'q1') setQ1Choice(choice);
    if (step === 'q2') setQ2Choice(choice);
    if (step === 'q3') setQ3Choice(choice);
  };

  const setCurrentReason = (reason: string) => {
    if (step === 'q1') setQ1Reason(reason);
    if (step === 'q2') setQ2Reason(reason);
    if (step === 'q3') setQ3Reason(reason);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDF3C7] text-[#4A3520]">
      {/* Pastel Sky Top Bar with White Picket Fence Border */}
      <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 lg:px-12 py-3.5 bg-[#82C8E5] border-b-3 border-[#6B4F35]">
        {/* Zone 1: Brand Title */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('simulation');
          }}
          className="font-display text-xl sm:text-2xl tracking-wide text-[#FFFDF5] drop-shadow-[0_2px_0_#4A3520] whitespace-nowrap shrink-0"
        >
          AI ETHICS EVERY DAY
        </a>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-bold text-[#3B2A18]">
          <button
            type="button"
            onClick={() => setActiveTab('simulation')}
            className={`hover:text-[#FFFDF5] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'simulation'
                ? 'text-[#FFFDF5] border-b-2 border-[#FFFDF5] drop-shadow-[0_1px_0_#4A3520]'
                : ''
            }`}
          >
            딜레마 마을 탐험
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('results')}
            className={`hover:text-[#FFFDF5] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'results'
                ? 'text-[#FFFDF5] border-b-2 border-[#FFFDF5] drop-shadow-[0_1px_0_#4A3520]'
                : ''
            }`}
          >
            우리 마을 통계
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('opinions')}
            className={`hover:text-[#FFFDF5] transition-colors whitespace-nowrap shrink-0 pb-0.5 ${
              activeTab === 'opinions'
                ? 'text-[#FFFDF5] border-b-2 border-[#FFFDF5] drop-shadow-[0_1px_0_#4A3520]'
                : ''
            }`}
          >
            친구들 생각 노트
          </button>
        </nav>

        {/* Zone 3: Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetAll}
            className="storybook-btn-secondary px-4 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap shrink-0 cursor-pointer"
          >
            처음부터 다시하기
          </button>
        </div>
      </header>

      {/* Mobile Navigation Bar */}
      <div className="flex md:hidden items-center justify-around border-b-2 border-[#6B4F35] bg-[#FFFDF5] px-2 py-2 text-xs font-bold text-[#4A3520]">
        <button
          type="button"
          onClick={() => setActiveTab('simulation')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap ${
            activeTab === 'simulation'
              ? 'bg-[#FFE066] border-2 border-[#6B4F35] text-[#4A3520]'
              : ''
          }`}
        >
          딜레마 탐험
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('results')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap ${
            activeTab === 'results'
              ? 'bg-[#FFE066] border-2 border-[#6B4F35] text-[#4A3520]'
              : ''
          }`}
        >
          마을 통계
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('opinions')}
          className={`px-3 py-1.5 rounded-xl whitespace-nowrap ${
            activeTab === 'opinions'
              ? 'bg-[#FFE066] border-2 border-[#6B4F35] text-[#4A3520]'
              : ''
          }`}
        >
          생각 노트
        </button>
      </div>

      {/* Decorative Sky & Picket Fence Strip */}
      <div className="bg-[#82C8E5] pt-2">
        <WhitePicketFence />
      </div>

      {/* Main Content Container */}
      <main className="flex-1 w-full max-w-[1360px] mx-auto px-6 lg:px-12 py-8 lg:py-10">
        {/* ================================================================= */}
        {/* TAB 1: SIMULATION FLOW (INTRO + 3 DILEMMA QUESTIONS)              */}
        {/* ================================================================= */}
        {activeTab === 'simulation' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Zone (Interactive Stage - 8 Cols) */}
            <div className="lg:col-span-8 storybook-card rounded-3xl p-6 lg:p-8">
              {step === 'intro' ? (
                <div>
                  {/* Hero Illustration Banner with User's Uploaded Image */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-8 pb-8 border-b-2 border-dashed border-[#D8C39E]">
                    <div className="md:col-span-7">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#785A3C] mb-2">
                        <Sun className="w-4 h-4 text-[#F59F00]" />
                        <span>프렌즈 마을 AI 윤리 탐험대</span>
                        <span aria-hidden="true">·</span>
                        <span>총 3개 이야기</span>
                      </div>

                      <h1
                        className="font-display text-3xl lg:text-4xl text-[#4A3520] leading-tight mb-3"
                        style={{ textWrap: 'balance' }}
                      >
                        <span className="text-[#4B963B]">ETHICS</span>{' '}
                        <span className="text-[#E8594F]">EVERY</span>{' '}
                        <span className="text-[#F59F00]">DAY!</span>
                        <br />
                        우리 마을 AI는 어떤 선택을 해야 할까요?
                      </h1>

                      <p className="text-sm sm:text-base text-[#6B4F35] font-semibold leading-relaxed">
                        자율주행 붕붕카의 위기일발 순간, 해바라기 화실의 AI 그림 저작권, 그리고 돋보기 심사관 로봇의 공정성까지! 귀여운 마을 친구들과 함께 3가지 AI 윤리 딜레마를 체험하고 서로의 생각을 비교해 보세요.
                      </p>
                    </div>

                    <div className="md:col-span-5">
                      <div className="rounded-2xl overflow-hidden border-3 border-[#6B4F35] shadow-[0_4px_0_#6B4F35] bg-[#FDF2C5]">
                        <img
                          src="/assets/aistudio/image_df372803.png"
                          alt="프렌즈 마을 여름날 일러스트"
                          referrerPolicy="no-referrer"
                          className="w-full h-48 sm:h-52 object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3 Story Preview Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="p-4 rounded-2xl bg-[#E7F5FF] border-2 border-[#6B4F35]">
                      <div className="flex items-center justify-between text-xs font-bold text-[#1971C2] mb-1.5">
                        <span>STORY 01</span>
                        <Car className="w-4 h-4" />
                      </div>
                      <h3 className="font-display text-base text-[#4A3520] mb-1">
                        자율주행차 사고 책임
                      </h3>
                      <p className="text-xs font-semibold text-[#6B4F35] leading-relaxed">
                        산책 중인 보행자 친구 보호 vs 차에 탄 승객 친구 안전, 누구를 먼저 지킬까요?
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#FFF0F6] border-2 border-[#6B4F35]">
                      <div className="flex items-center justify-between text-xs font-bold text-[#C2255C] mb-1.5">
                        <span>STORY 02</span>
                        <Palette className="w-4 h-4" />
                      </div>
                      <h3 className="font-display text-base text-[#4A3520] mb-1">
                        AI 생성 콘텐츠와 저작권
                      </h3>
                      <p className="text-xs font-semibold text-[#6B4F35] leading-relaxed">
                        화가의 그림을 학습한 AI의 상업적 이용, 자유로운 혁신일까요 저작권 침해일까요?
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-[#EBFBEE] border-2 border-[#6B4F35]">
                      <div className="flex items-center justify-between text-xs font-bold text-[#2B8A3E] mb-1.5">
                        <span>STORY 03</span>
                        <Cpu className="w-4 h-4" />
                      </div>
                      <h3 className="font-display text-base text-[#4A3520] mb-1">
                        AI 알고리즘 자동 심사
                      </h3>
                      <p className="text-xs font-semibold text-[#6B4F35] leading-relaxed">
                        빠르고 정확한 AI 자동 심사 vs 사람의 따뜻한 검토와 투명한 이유 설명!
                      </p>
                    </div>
                  </div>

                  {/* Demographic Input Form */}
                  <div className="p-6 rounded-2xl bg-[#FFF9E2] border-2 border-[#6B4F35]">
                    <div className="flex items-center gap-2 mb-1">
                      <Flower2 className="w-5 h-5 text-[#E8594F]" />
                      <h2 className="font-display text-lg text-[#4A3520]">
                        탐험가님의 성별과 연령대를 알려주세요 (필수)
                      </h2>
                    </div>
                    <p className="text-xs font-semibold text-[#785A3C] mb-5">
                      두 가지를 모두 선택하면 아래의 초록색 <strong>탐험 시작하기</strong> 버튼이 활짝 열립니다!
                    </p>

                    <div className="space-y-5">
                      {/* Gender Selection */}
                      <div>
                        <label className="block text-xs font-bold text-[#4A3520] mb-2">
                          1. 성별 선택 (Gender)
                        </label>
                        <div className="grid grid-cols-3 gap-3">
                          {GENDER_OPTIONS.map((item) => {
                            const selected = gender === item;
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => setGender(item)}
                                className={`py-2.5 px-4 rounded-2xl text-sm font-bold border-2 transition-all whitespace-nowrap cursor-pointer ${
                                  selected
                                    ? 'bg-[#FF9EBB] text-[#4A3520] border-[#4A3520] shadow-[0_3px_0_#4A3520] -translate-y-0.5'
                                    : 'bg-[#FFFDF5] text-[#6B4F35] border-[#8C6D4F] hover:bg-[#FFF3BF]'
                                }`}
                              >
                                {item}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Age Group Selection */}
                      <div>
                        <label className="block text-xs font-bold text-[#4A3520] mb-2">
                          2. 연령대 선택 (Age Group)
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                          {AGE_GROUP_OPTIONS.map((item) => {
                            const selected = ageGroup === item;
                            return (
                              <button
                                key={item}
                                type="button"
                                onClick={() => setAgeGroup(item)}
                                className={`py-2.5 px-3 rounded-2xl text-sm font-bold border-2 transition-all whitespace-nowrap cursor-pointer ${
                                  selected
                                    ? 'bg-[#FFE066] text-[#4A3520] border-[#4A3520] shadow-[0_3px_0_#4A3520] -translate-y-0.5'
                                    : 'bg-[#FFFDF5] text-[#6B4F35] border-[#8C6D4F] hover:bg-[#FFF3BF]'
                                }`}
                              >
                                {item}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Start Button */}
                    <div className="mt-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-5 border-t-2 border-dashed border-[#D8C39E]">
                      <div className="text-xs font-bold text-[#6B4F35]">
                        {isDemographicsReady ? (
                          <span className="text-[#2B8A3E]">
                            준비 완료! ({gender} · {ageGroup}) — 지금 딜레마 마을로 출발해 볼까요?
                          </span>
                        ) : (
                          <span>성별과 연령대를 모두 골라 주세요.</span>
                        )}
                      </div>

                      <button
                        type="button"
                        disabled={!isDemographicsReady}
                        onClick={handleStartSimulation}
                        className={`inline-flex items-center justify-center gap-2 px-7 py-3 rounded-2xl font-display text-base transition-all whitespace-nowrap ${
                          isDemographicsReady
                            ? 'storybook-btn-primary cursor-pointer'
                            : 'bg-[#E9DEC0] text-[#A69279] border-2 border-[#B8A48B] cursor-not-allowed'
                        }`}
                      >
                        <span>딜레마 탐험 시작하기</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* DILEMMA QUESTION STAGE (Q1, Q2, Q3) */
                <div>
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#2B8A3E]">
                      <span>STORY {activeQuestion.number} / 03</span>
                      <span aria-hidden="true">·</span>
                      <span>{activeQuestion.category}</span>
                    </div>
                    <div className="text-xs font-bold text-[#6B4F35]">
                      탐험가: {gender} · {ageGroup}
                    </div>
                  </div>

                  <h2
                    className="font-display text-2xl lg:text-3xl text-[#4A3520] mb-4"
                    style={{ textWrap: 'balance' }}
                  >
                    {activeQuestion.title}
                  </h2>

                  {/* Storybook Illustrated SVG Scene */}
                  <div className="mb-6">
                    <DilemmaStorybookVisualizer
                      questionId={activeQuestion.id}
                      selectedChoice={currentChoice}
                    />
                  </div>

                  {/* Scenario Box */}
                  <div className="p-5 rounded-2xl bg-[#FFF9E2] border-2 border-[#6B4F35] mb-6">
                    <div className="text-xs font-bold text-[#D9480F] mb-1">
                      프렌즈 마을에 일어난 일
                    </div>
                    <p className="text-sm lg:text-base font-semibold text-[#4A3520] leading-relaxed mb-3">
                      {activeQuestion.scenario}
                    </p>
                    <p className="font-display text-base text-[#2B8A3E]">
                      Q. {activeQuestion.coreQuestion}
                    </p>
                  </div>

                  {/* Choice A & B Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {[activeQuestion.optionA, activeQuestion.optionB].map((option) => {
                      const isSelected = currentChoice === option.code;
                      const isOptionA = option.code === 'A';
                      return (
                        <button
                          key={option.code}
                          type="button"
                          onClick={() => setCurrentChoice(option.code)}
                          className={`text-left p-5 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer ${
                            isSelected
                              ? isOptionA
                                ? 'border-[#4A3520] bg-[#EBFBEE] shadow-[0_4px_0_#4A3520] -translate-y-0.5'
                                : 'border-[#4A3520] bg-[#FFF4E6] shadow-[0_4px_0_#4A3520] -translate-y-0.5'
                              : 'border-[#8C6D4F] bg-[#FFFDF5] hover:bg-[#FFF9E2]'
                          }`}
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span
                                className={`font-display text-sm ${
                                  isOptionA ? 'text-[#2B8A3E]' : 'text-[#D9480F]'
                                }`}
                              >
                                선택지 {option.code}
                              </span>
                              {isSelected && (
                                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#4A3520]">
                                  <CheckCircle2 className="w-4 h-4 text-[#2B8A3E]" />
                                  선택 완료!
                                </span>
                              )}
                            </div>

                            <h3 className="font-display text-lg text-[#4A3520] mb-1">
                              {option.title}
                            </h3>
                            <p className="text-xs font-bold text-[#785A3C] mb-3">
                              {option.subtitle}
                            </p>
                            <p className="text-xs font-semibold text-[#4A3520] leading-relaxed mb-4">
                              {option.description}
                            </p>
                          </div>

                          <div className="pt-3 border-t-2 border-dashed border-[#D8C39E] text-xs font-semibold text-[#6B4F35] space-y-1">
                            <div>
                              <span className="font-bold text-[#4A3520]">윤리 원칙: </span>
                              {option.principle}
                            </div>
                            <div>
                              <span className="font-bold text-[#4A3520]">예상 결과: </span>
                              {option.consequence}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Optional Reason Textarea */}
                  <div className="mb-8">
                    <label
                      htmlFor={`reason-${activeQuestion.id}`}
                      className="block text-xs font-bold text-[#4A3520] mb-2"
                    >
                      왜 이 선택지를 골랐나요? 자유롭게 생각을 적어주세요 (선택사항 · 최대 500자)
                    </label>
                    <textarea
                      id={`reason-${activeQuestion.id}`}
                      rows={3}
                      maxLength={500}
                      value={currentReason}
                      onChange={(e) => setCurrentReason(e.target.value)}
                      placeholder="내 생각이나 마을을 위한 아이디어를 자유롭게 적어주세요!"
                      className="w-full rounded-2xl border-2 border-[#6B4F35] bg-[#FFFDF5] px-4 py-3 text-sm font-semibold text-[#4A3520] placeholder:text-[#A69279] focus:border-[#2B8A3E] focus:outline-none"
                    />
                    <div className="flex justify-end mt-1 text-xs font-bold text-[#8C6D4F] font-mono tabular-nums">
                      {currentReason.length} / 500자
                    </div>
                  </div>

                  {/* Step Navigation Footer */}
                  <div className="flex items-center justify-between gap-4 pt-6 border-t-2 border-dashed border-[#D8C39E]">
                    <button
                      type="button"
                      onClick={() => {
                        if (step === 'q1') setStep('intro');
                        if (step === 'q2') setStep('q1');
                        if (step === 'q3') setStep('q2');
                      }}
                      className="storybook-btn-secondary inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>이전 이야기</span>
                    </button>

                    {step !== 'q3' ? (
                      <button
                        type="button"
                        disabled={!currentChoice}
                        onClick={() => {
                          if (step === 'q1') setStep('q2');
                          if (step === 'q2') setStep('q3');
                        }}
                        className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl font-display text-sm transition-all whitespace-nowrap ${
                          currentChoice
                            ? 'storybook-btn-primary cursor-pointer'
                            : 'bg-[#E9DEC0] text-[#A69279] border-2 border-[#B8A48B] cursor-not-allowed'
                        }`}
                      >
                        <span>다음 딜레마 이야기</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!q1Choice || !q2Choice || !q3Choice || isSubmitting}
                        onClick={handleSubmitAll}
                        className={`inline-flex items-center gap-2 px-7 py-3 rounded-2xl font-display text-base transition-all whitespace-nowrap ${
                          q1Choice && q2Choice && q3Choice && !isSubmitting
                            ? 'storybook-btn-primary cursor-pointer'
                            : 'bg-[#E9DEC0] text-[#A69279] border-2 border-[#B8A48B] cursor-not-allowed'
                        }`}
                      >
                        <span>
                          {isSubmitting ? '마을 게시판에 기록 중...' : '응답 저장하고 마을 통계 보기!'}
                        </span>
                        <BarChart3 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Zone (Control & Concept Deck - 4 Cols) */}
            <aside className="lg:col-span-4 space-y-6">
              {/* Progress & Profile Summary Card */}
              <div className="storybook-card rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg text-[#4A3520]">우리 마을 탐험 스탬프</h3>
                  <span className="font-mono text-xs font-bold text-[#2B8A3E] tabular-nums">
                    {[q1Choice, q2Choice, q3Choice].filter(Boolean).length} / 3 완료
                  </span>
                </div>

                {/* Demographic Status */}
                <div className="p-3.5 rounded-2xl bg-[#FFF9E2] border-2 border-[#8C6D4F] mb-4 text-xs">
                  <div className="font-bold text-[#785A3C] mb-0.5">탐험가 이름표</div>
                  <div className="font-display text-sm text-[#4A3520]">
                    {isDemographicsReady
                      ? `${gender} · ${ageGroup}`
                      : '시작 화면에서 성별·연령대를 골라주세요'}
                  </div>
                </div>

                {/* Step Selector List */}
                <div className="space-y-2.5">
                  {DILEMMA_QUESTIONS.map((q) => {
                    const chosen =
                      q.id === 'q1' ? q1Choice : q.id === 'q2' ? q2Choice : q3Choice;
                    const isCurrent = step === q.id;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        disabled={!isDemographicsReady}
                        onClick={() => isDemographicsReady && setStep(q.id)}
                        className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 ${
                          isCurrent
                            ? 'border-[#4A3520] bg-[#FFE066] text-[#4A3520] shadow-[0_3px_0_#4A3520]'
                            : 'border-[#8C6D4F] bg-[#FFFDF5] text-[#4A3520] hover:bg-[#FFF9E2]'
                        } ${!isDemographicsReady ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[#785A3C]">
                            STORY {q.number}
                          </div>
                          <div className="text-xs font-bold truncate">{q.title}</div>
                        </div>
                        <span
                          className={`font-display text-xs shrink-0 ${
                            chosen ? 'text-[#2B8A3E]' : 'text-[#8C6D4F]'
                          }`}
                        >
                          {chosen ? `선택 ${chosen}` : '대기중'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ethical Lens Concept Card */}
              <div className="storybook-card rounded-3xl p-6 bg-[#FFF9E2]">
                <div className="flex items-center gap-2 text-xs font-bold text-[#D9480F] mb-2">
                  <Scale className="w-4 h-4" />
                  <span>탐험가를 위한 생각 길잡이</span>
                </div>
                <h3 className="font-display text-base text-[#4A3520] mb-3">
                  모두의 행복 vs 꼭 지켜야 할 약속
                </h3>
                <div className="space-y-3 text-xs font-semibold text-[#6B4F35] leading-relaxed">
                  <p>
                    <strong className="text-[#2B8A3E]">공리주의(결과 중심):</strong> 우리 마을 전체가 입을 피해를 가장 줄이고, 더 많은 친구들에게 도움이 되는 방향을 선택해요.
                  </p>
                  <p>
                    <strong className="text-[#D9480F]">의무론(권리·약속 중심):</strong> 아무리 편리하더라도 창작자의 권리, 탑승자와의 신의, 설명을 들을 권리처럼 꼭 지켜야 할 원칙을 먼저 생각해요.
                  </p>
                </div>
              </div>
            </aside>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: RESULTS & VISUAL STATISTICS BARS                           */}
        {/* ================================================================= */}
        {activeTab === 'results' && (
          <div className="space-y-8">
            <div className="storybook-card rounded-3xl p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b-2 border-dashed border-[#D8C39E]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#785A3C] mb-2">
                    <span>Supabase 실시간 데이터 집계</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono tabular-nums">
                      조회된 친구들: {filteredResponses.length}명 (전체 {allResponses.length}명)
                    </span>
                  </div>
                  <h1 className="font-display text-2xl lg:text-3xl text-[#4A3520]">
                    우리 마을 친구들의 선택 비율(%) 통계
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('opinions')}
                    className="storybook-btn-secondary inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer"
                  >
                    <MessageSquareQuote className="w-4 h-4" />
                    <span>친구들 생각 노트 보기</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="storybook-btn-primary inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>다시 참여하기</span>
                  </button>
                </div>
              </div>

              {/* Interactive Demographic Filters */}
              <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A3520] mb-2">
                    <Users className="w-3.5 h-3.5 text-[#2B8A3E]" />
                    <span>성별 모아보기</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#FFF9E2] border-2 border-[#8C6D4F] rounded-2xl">
                    {['전체', ...GENDER_OPTIONS].map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setFilterGender(g)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                          filterGender === g
                            ? 'bg-[#FF9EBB] text-[#4A3520] border-2 border-[#4A3520]'
                            : 'text-[#6B4F35] hover:text-[#4A3520]'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#4A3520] mb-2">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-[#D9480F]" />
                    <span>연령대별 모아보기</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#FFF9E2] border-2 border-[#8C6D4F] rounded-2xl">
                    {['전체', ...AGE_GROUP_OPTIONS].map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => setFilterAge(a)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                          filterAge === a
                            ? 'bg-[#FFE066] text-[#4A3520] border-2 border-[#4A3520]'
                            : 'text-[#6B4F35] hover:text-[#4A3520]'
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {hasSubmitted && (
                <div className="mt-6 p-4 rounded-2xl bg-[#EBFBEE] border-2 border-[#2B8A3E] text-xs font-semibold text-[#2B8A3E] flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="font-bold">탐험가님의 소중한 응답이 안전하게 저장되었습니다!</span> 다른 친구들의 생각과 비교해 보세요.
                  </div>
                  <span className="font-mono font-bold whitespace-nowrap">
                    내 선택: Q1({q1Choice}) · Q2({q2Choice}) · Q3({q3Choice})
                  </span>
                </div>
              )}
            </div>

            {/* 3 Question Statistics Bar Cards */}
            {isLoadingStats ? (
              <div className="storybook-card rounded-3xl p-12 text-center text-sm font-bold text-[#6B4F35]">
                우리 마을 통계 데이터를 불러오고 있어요...
              </div>
            ) : (
              <div className="space-y-6">
                {DILEMMA_QUESTIONS.map((q) => {
                  const statKey = `${q.id}_choice` as 'q1_choice' | 'q2_choice' | 'q3_choice';
                  const stats = computeStats(statKey);
                  const myChoice =
                    q.id === 'q1' ? q1Choice : q.id === 'q2' ? q2Choice : q3Choice;
                  const myReason =
                    q.id === 'q1' ? q1Reason : q.id === 'q2' ? q2Reason : q3Reason;

                  const recentReasons = filteredResponses
                    .filter((r) => {
                      const reasonField =
                        q.id === 'q1'
                          ? r.q1_reason
                          : q.id === 'q2'
                          ? r.q2_reason
                          : r.q3_reason;
                      return Boolean(reasonField && reasonField.trim().length > 0);
                    })
                    .slice(0, 3);

                  return (
                    <div
                      key={q.id}
                      className="storybook-card rounded-3xl p-6 lg:p-8"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#2B8A3E]">
                          <span>STORY {q.number}</span>
                          <span aria-hidden="true">·</span>
                          <span>{q.category}</span>
                        </div>
                        {myChoice && (
                          <div className="text-xs font-bold text-[#D9480F]">
                            나의 선택: 선택지 {myChoice} (
                            {myChoice === 'A' ? q.optionA.title : q.optionB.title})
                          </div>
                        )}
                      </div>

                      <h2 className="font-display text-xl lg:text-2xl text-[#4A3520] mb-6">
                        {q.title}
                      </h2>

                      {/* Visual Comparison Bar */}
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-4 mb-2.5 text-sm">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-display text-base text-[#2B8A3E]">선택 A</span>
                              <span className="font-bold text-[#4A3520]">{q.optionA.title}</span>
                            </div>
                            <div className="font-display text-2xl text-[#2B8A3E] tabular-nums mt-1">
                              {stats.pctA.toFixed(1)}%
                              <span className="text-xs font-bold text-[#785A3C] ml-2">
                                ({stats.countA}명)
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <span className="font-bold text-[#4A3520]">{q.optionB.title}</span>
                              <span className="font-display text-base text-[#D9480F]">선택 B</span>
                            </div>
                            <div className="font-display text-2xl text-[#D9480F] tabular-nums mt-1">
                              <span className="text-xs font-bold text-[#785A3C] mr-2">
                                ({stats.countB}명)
                              </span>
                              {stats.pctB.toFixed(1)}%
                            </div>
                          </div>
                        </div>

                        {/* Horizontal Split Percentage Bar */}
                        <div className="w-full h-9 rounded-2xl bg-[#FFF9E2] overflow-hidden flex border-2 border-[#6B4F35]">
                          {stats.total > 0 ? (
                            <>
                              <div
                                style={{ width: `${stats.pctA}%` }}
                                className="h-full bg-[#69DB7C] transition-all duration-300 flex items-center pl-3 text-xs font-bold text-[#2B4C1E] tabular-nums overflow-hidden border-r border-[#6B4F35]"
                              >
                                {stats.pctA >= 12 ? `A · ${stats.pctA.toFixed(1)}%` : ''}
                              </div>
                              <div
                                style={{ width: `${stats.pctB}%` }}
                                className="h-full bg-[#FFD43B] transition-all duration-300 flex items-center justify-end pr-3 text-xs font-bold text-[#4A3520] tabular-nums overflow-hidden"
                              >
                                {stats.pctB >= 12 ? `${stats.pctB.toFixed(1)}% · B` : ''}
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#8C6D4F]">
                              해당 조건의 응답 데이터가 아직 없어요
                            </div>
                          )}
                        </div>
                      </div>

                      {/* My Submitted Reason */}
                      {myReason && myReason.trim() !== '' && (
                        <div className="mb-5 p-4 rounded-2xl bg-[#EBFBEE] border-2 border-[#2B8A3E] text-xs font-semibold text-[#4A3520]">
                          <span className="font-bold text-[#2B8A3E] mr-2">내가 남긴 생각:</span>
                          {myReason}
                        </div>
                      )}

                      {/* Recent Participant Reasons Preview */}
                      <div className="pt-5 border-t-2 border-dashed border-[#D8C39E]">
                        <div className="text-xs font-bold text-[#785A3C] mb-3">
                          마을 친구들이 남겨준 선택 이유
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {recentReasons.map((item, idx) => {
                            const choiceVal =
                              q.id === 'q1'
                                ? item.q1_choice
                                : q.id === 'q2'
                                ? item.q2_choice
                                : item.q3_choice;
                            const reasonText =
                              q.id === 'q1'
                                ? item.q1_reason
                                : q.id === 'q2'
                                ? item.q2_reason
                                : item.q3_reason;
                            return (
                              <div
                                key={`${item.id || idx}-${q.id}`}
                                className="p-4 rounded-2xl bg-[#FFF9E2] border-2 border-[#8C6D4F] text-xs flex flex-col justify-between"
                              >
                                <p className="font-semibold text-[#4A3520] leading-relaxed mb-3">
                                  “{reasonText}”
                                </p>
                                <div className="flex items-center justify-between text-[#785A3C] font-bold pt-2 border-t border-[#D8C39E]">
                                  <span
                                    className={
                                      choiceVal === 'A' ? 'text-[#2B8A3E]' : 'text-[#D9480F]'
                                    }
                                  >
                                    선택 {choiceVal}
                                  </span>
                                  <span>
                                    {item.gender} · {item.age_group}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: PARTICIPANT OPINIONS ARCHIVE                               */}
        {/* ================================================================= */}
        {activeTab === 'opinions' && (
          <div className="storybook-card rounded-3xl p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-dashed border-[#D8C39E] mb-6">
              <div>
                <div className="text-xs font-bold text-[#785A3C] mb-1">
                  참여자 자유 응답 데이터베이스 (`dilemma_responses`)
                </div>
                <h1 className="font-display text-2xl text-[#4A3520]">
                  우리 마을 친구들의 생각 노트 모아보기
                </h1>
              </div>
              <div className="text-xs font-mono font-bold text-[#2B8A3E] tabular-nums">
                총 {allResponses.length}건의 이야기
              </div>
            </div>

            <div className="space-y-4">
              {allResponses.map((record, index) => (
                <div
                  key={record.id || index}
                  className="p-5 rounded-2xl border-2 border-[#8C6D4F] bg-[#FFF9E2]"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-[#D8C39E] text-xs font-bold text-[#785A3C]">
                    <div className="flex items-center gap-2 text-[#4A3520]">
                      <span>탐험가 #{allResponses.length - index}</span>
                      <span aria-hidden="true">·</span>
                      <span>{record.gender}</span>
                      <span aria-hidden="true">·</span>
                      <span>{record.age_group}</span>
                    </div>
                    <div className="font-mono tabular-nums">
                      {record.created_at
                        ? new Date(record.created_at).toLocaleString('ko-KR')
                        : '방금 전'}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="bg-[#FFFDF5] p-3.5 rounded-xl border-2 border-[#8C6D4F]">
                      <div className="font-display text-sm text-[#2B8A3E] mb-1">
                        문항 1 (자율주행): 선택 {record.q1_choice}
                      </div>
                      <p className="font-semibold text-[#4A3520] leading-relaxed">
                        {record.q1_reason || '작성된 추가 의견 없음'}
                      </p>
                    </div>
                    <div className="bg-[#FFFDF5] p-3.5 rounded-xl border-2 border-[#8C6D4F]">
                      <div className="font-display text-sm text-[#C2255C] mb-1">
                        문항 2 (AI 저작권): 선택 {record.q2_choice}
                      </div>
                      <p className="font-semibold text-[#4A3520] leading-relaxed">
                        {record.q2_reason || '작성된 추가 의견 없음'}
                      </p>
                    </div>
                    <div className="bg-[#FFFDF5] p-3.5 rounded-xl border-2 border-[#8C6D4F]">
                      <div className="font-display text-sm text-[#D9480F] mb-1">
                        문항 3 (알고리즘 심사): 선택 {record.q3_choice}
                      </div>
                      <p className="font-semibold text-[#4A3520] leading-relaxed">
                        {record.q3_reason || '작성된 추가 의견 없음'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Storybook Footer */}
      <footer className="border-t-3 border-[#6B4F35] bg-[#FFFDF5] py-5 px-6 lg:px-12 mt-12">
        <div className="max-w-[1360px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-[#785A3C]">
          <div>AI ETHICS EVERY DAY · 프렌즈 마을 AI 윤리 딜레마 시뮬레이션</div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActiveTab('simulation')}
              className="hover:text-[#4A3520] transition-colors cursor-pointer"
            >
              딜레마 탐험
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveTab('results')}
              className="hover:text-[#4A3520] transition-colors cursor-pointer"
            >
              우리 마을 통계
            </button>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setActiveTab('opinions')}
              className="hover:text-[#4A3520] transition-colors cursor-pointer"
            >
              친구들 생각 노트
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
