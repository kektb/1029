-- ============================================================================
-- AI 윤리 딜레마 시뮬레이션 - Supabase SQL Schema (schema.sql)
-- 실행 위치: Supabase Dashboard -> SQL Editor -> New Query
-- ============================================================================

-- 1. UUID 생성을 위한 확장 활성화 (기본 활성화되어 있으나 안전을 위해 포함)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. dilemma_responses 테이블 생성
CREATE TABLE IF NOT EXISTS public.dilemma_responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  gender TEXT NOT NULL CHECK (char_length(gender) <= 30),
  age_group TEXT NOT NULL CHECK (char_length(age_group) <= 30),
  q1_choice TEXT NOT NULL CHECK (q1_choice IN ('A', 'B')),
  q1_reason TEXT DEFAULT '' CHECK (char_length(q1_reason) <= 1000),
  q2_choice TEXT NOT NULL CHECK (q2_choice IN ('A', 'B')),
  q2_reason TEXT DEFAULT '' CHECK (char_length(q2_reason) <= 1000),
  q3_choice TEXT NOT NULL CHECK (q3_choice IN ('A', 'B')),
  q3_reason TEXT DEFAULT '' CHECK (char_length(q3_reason) <= 1000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. 조회 성능 최적화를 위한 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_dilemma_responses_created_at
  ON public.dilemma_responses (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_dilemma_responses_demographics
  ON public.dilemma_responses (gender, age_group);

-- 4. Row Level Security (RLS) 활성화
ALTER TABLE public.dilemma_responses ENABLE ROW LEVEL SECURITY;

-- 기존 정책이 있을 경우 충돌 방지를 위해 삭제 후 재생성
DROP POLICY IF EXISTS "Allow anonymous insert on dilemma_responses" ON public.dilemma_responses;
DROP POLICY IF EXISTS "Allow anonymous select on dilemma_responses" ON public.dilemma_responses;

-- 5. 익명 사용자(anon) 및 인증 사용자(authenticated)의 데이터 INSERT 허용 정책
CREATE POLICY "Allow anonymous insert on dilemma_responses"
  ON public.dilemma_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    gender IS NOT NULL AND
    age_group IS NOT NULL AND
    q1_choice IN ('A', 'B') AND
    q2_choice IN ('A', 'B') AND
    q3_choice IN ('A', 'B')
  );

-- 6. 익명 사용자(anon) 및 인증 사용자(authenticated)의 전체 데이터 SELECT 허용 정책
CREATE POLICY "Allow anonymous select on dilemma_responses"
  ON public.dilemma_responses
  FOR SELECT
  TO anon, authenticated
  USING (true);
