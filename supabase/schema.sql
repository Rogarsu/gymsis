-- ═══════════════════════════════════════════════════════════
-- SistemaVida — Supabase Schema
-- Ejecuta este SQL en el SQL Editor de tu proyecto Supabase
-- ═══════════════════════════════════════════════════════════

-- Habilitar RLS (Row Level Security) en todas las tablas
-- Cada usuario solo puede ver y modificar sus propios datos

-- ── Training Plans ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS training_plans (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_data  JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own plan" ON training_plans
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Session Logs ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS session_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id   TEXT NOT NULL,
  log_data     JSONB NOT NULL,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, session_id)
);
ALTER TABLE session_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own session logs" ON session_logs
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_session_logs_user ON session_logs(user_id);

-- ── Exercise Logs ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS exercise_logs (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  ex_id        TEXT NOT NULL,
  session_id   TEXT NOT NULL,
  log_data     JSONB NOT NULL,
  completed_at TIMESTAMPTZ,
  UNIQUE(user_id, ex_id, session_id)
);
ALTER TABLE exercise_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own exercise logs" ON exercise_logs
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_exercise_logs_user ON exercise_logs(user_id);
CREATE INDEX idx_exercise_logs_user_ex ON exercise_logs(user_id, ex_id);

-- ── Body Metrics ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS body_metrics (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  metric_data JSONB NOT NULL,
  UNIQUE(user_id, date)
);
ALTER TABLE body_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own body metrics" ON body_metrics
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_body_metrics_user ON body_metrics(user_id, date);

-- ── User Preferences ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_preferences (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  prefs_data JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id)
);
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own preferences" ON user_preferences
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── Nutrition Logs ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS nutrition_logs (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date       DATE NOT NULL,
  meals_data JSONB NOT NULL DEFAULT '[]',
  UNIQUE(user_id, date)
);
ALTER TABLE nutrition_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own nutrition logs" ON nutrition_logs
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_nutrition_logs_user ON nutrition_logs(user_id, date);
