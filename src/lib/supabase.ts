import { createClient, SupabaseClient } from '@supabase/supabase-js';

export type ChoiceOption = 'A' | 'B';

export interface DilemmaResponseRecord {
  id?: string;
  gender: string;
  age_group: string;
  q1_choice: ChoiceOption;
  q1_reason: string;
  q2_choice: ChoiceOption;
  q2_reason: string;
  q3_choice: ChoiceOption;
  q3_reason: string;
  created_at?: string;
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const isConfigured =
  Boolean(supabaseUrl) &&
  Boolean(supabaseAnonKey) &&
  !supabaseUrl?.includes('your-project-id') &&
  !supabaseAnonKey?.includes('your-supabase-anon-public-key');

export const supabase: SupabaseClient | null = isConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

const LOCAL_STORAGE_KEY = 'ai_ethics_dilemma_responses_v1';

const INITIAL_SEED_RESPONSES: DilemmaResponseRecord[] = [
  {
    id: 'seed-1',
    gender: '여성',
    age_group: '20대',
    q1_choice: 'A',
    q1_reason: '도로 위 보행자는 차량이라는 물리적 보호 장치가 없으므로 최우선으로 보호받아야 합니다.',
    q2_choice: 'B',
    q2_reason: '원작자의 창작물 학습에는 사전 동의와 정당한 저작권 보상 체계가 필수적입니다.',
    q3_choice: 'B',
    q3_reason: '채용과 대출 같은 중대한 결정은 알고리즘의 편향성을 검증할 인간 검토가 반드시 동반되어야 합니다.',
    created_at: '2026-10-28T09:15:00Z',
  },
  {
    id: 'seed-2',
    gender: '남성',
    age_group: '30대',
    q1_choice: 'B',
    q1_reason: '탑승자를 희생시키도록 설계된 자율주행차는 소비자가 신뢰하고 구매하기 어렵습니다.',
    q2_choice: 'A',
    q2_reason: '인간 예술가도 기존 작품을 보고 배우듯, AI 학습 자체를 과도하게 제한하면 기술 혁신이 정체됩니다.',
    q3_choice: 'B',
    q3_reason: '결과의 이유를 설명할 수 없는 블랙박스 심사는 절차적 공정성을 해칩니다.',
    created_at: '2026-10-28T11:40:00Z',
  },
  {
    id: 'seed-3',
    gender: '여성',
    age_group: '30대',
    q1_choice: 'A',
    q1_reason: '사망 및 중상해 피해를 최소화하는 공리주의적 기준이 공공 도로 안전에 부합합니다.',
    q2_choice: 'B',
    q2_reason: '개별 작가의 화풍을 그대로 복제해 상업적으로 유통하는 것은 생태계를 파괴합니다.',
    q3_choice: 'A',
    q3_reason: '인간 심사관의 주관적 편견보다 고도화된 AI 모델이 오히려 일관된 기준을 적용할 수 있습니다.',
    created_at: '2026-10-28T14:22:00Z',
  },
  {
    id: 'seed-4',
    gender: '남성',
    age_group: '20대',
    q1_choice: 'A',
    q1_reason: '운전 주체인 시스템이 외부 약자인 보행자에 대해 더 높은 주의 의무를 져야 합니다.',
    q2_choice: 'B',
    q2_reason: '상업적 목적의 생성형 모델은 학습 데이터 기여도에 따른 수익 배분 구조가 필요합니다.',
    q3_choice: 'B',
    q3_reason: '최종 소명 기회와 인간의 재심사 권리가 법적으로 보장되어야 합니다.',
    created_at: '2026-10-28T18:05:00Z',
  },
  {
    id: 'seed-5',
    gender: '남성',
    age_group: '40대',
    q1_choice: 'B',
    q1_reason: '차량 소유자와의 계약 관계상 탑승자 안전 보장이 기본 전제가 되어야 합니다.',
    q2_choice: 'B',
    q2_reason: '지적재산권 보호 없이는 고품질 원본 데이터 생산 자체가 줄어들 것입니다.',
    q3_choice: 'A',
    q3_reason: '대규모 공공 행정과 금융 심사에서 신속성과 객관성 확보는 큰 사회적 편익을 줍니다.',
    created_at: '2026-10-29T02:10:00Z',
  },
  {
    id: 'seed-6',
    gender: '여성',
    age_group: '10대',
    q1_choice: 'A',
    q1_reason: '누구든 길을 걷는 보행자가 될 수 있으므로 보행자 우선 원칙이 사회적 신뢰를 높입니다.',
    q2_choice: 'A',
    q2_reason: '누구나 창작 도구를 활용해 아이디어를 시각화할 수 있다는 점에서 긍정적입니다.',
    q3_choice: 'B',
    q3_reason: '점수 산정 기준이 투명하게 공개되어야 지원자 입장에서 결과를 납득할 수 있습니다.',
    created_at: '2026-10-29T06:45:00Z',
  },
  {
    id: 'seed-7',
    gender: '기타/선택안함',
    age_group: '50대 이상',
    q1_choice: 'A',
    q1_reason: '생명 피해의 총량을 줄이는 방향이 공공 교통 시스템의 핵심 윤리입니다.',
    q2_choice: 'B',
    q2_reason: '창작자의 오랜 숙련과 노동을 존중하는 제도적 장치가 먼저 마련되어야 합니다.',
    q3_choice: 'B',
    q3_reason: '기계적 효율성보다 인간의 존엄성과 맥락적 판단이 우선되어야 합니다.',
    created_at: '2026-10-29T08:30:00Z',
  },
];

function getLocalResponses(): DilemmaResponseRecord[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_RESPONSES));
      return INITIAL_SEED_RESPONSES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_SEED_RESPONSES;
  } catch {
    return INITIAL_SEED_RESPONSES;
  }
}

function saveLocalResponse(record: DilemmaResponseRecord): DilemmaResponseRecord {
  const newItem: DilemmaResponseRecord = {
    ...record,
    id: `local-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  try {
    const existing = getLocalResponses();
    const updated = [newItem, ...existing];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage quota errors
  }
  return newItem;
}

/**
 * 사용자의 딜레마 응답을 Supabase `dilemma_responses` 테이블에 INSERT 합니다.
 */
export async function insertDilemmaResponse(
  payload: Omit<DilemmaResponseRecord, 'id' | 'created_at'>
): Promise<DilemmaResponseRecord> {
  if (supabase) {
    const { data, error } = await supabase
      .from('dilemma_responses')
      .insert([
        {
          gender: payload.gender,
          age_group: payload.age_group,
          q1_choice: payload.q1_choice,
          q1_reason: payload.q1_reason.trim(),
          q2_choice: payload.q2_choice,
          q2_reason: payload.q2_reason.trim(),
          q3_choice: payload.q3_choice,
          q3_reason: payload.q3_reason.trim(),
        },
      ])
      .select()
      .single();

    if (!error && data) {
      return data as DilemmaResponseRecord;
    }
  }

  return saveLocalResponse(payload);
}

/**
 * 전체 응답 데이터를 최신순으로 SELECT 합니다.
 */
export async function fetchDilemmaResponses(): Promise<DilemmaResponseRecord[]> {
  if (supabase) {
    const { data, error } = await supabase
      .from('dilemma_responses')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data as DilemmaResponseRecord[];
    }
  }

  return getLocalResponses();
}
