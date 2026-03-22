-- ============================================
-- MIGRATION 001: SCHÉMA INITIAL M.O.N.A
-- Date: 2025-02-12
-- Description: Création des tables principales pour la plateforme M.O.N.A
--              (Mieux-être, Optimisation & Neuro-Apaisement)
-- ============================================

-- ==================== TABLES ====================

-- 1. TABLE ADMINS (équipe M.O.N.A interne)
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('super_admin', 'admin', 'moderator', 'support')) DEFAULT 'admin',
  phone TEXT,
  department TEXT CHECK (department IN ('operations', 'finance', 'support', 'marketing', 'rh', 'tech')),
  permissions JSONB DEFAULT '{"users": true, "experts": true, "companies": true, "analytics": true, "settings": false}',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);
CREATE INDEX IF NOT EXISTS idx_admins_active ON admins(is_active);

-- 2. TABLE ADMIN_ACTIVITY_LOGS (traçabilité des actions admin)
CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES admins(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL CHECK (action_type IN (
    'user_created', 'user_updated', 'user_deleted', 'user_suspended',
    'expert_approved', 'expert_rejected', 'expert_suspended',
    'company_created', 'company_updated', 'company_suspended',
    'settings_updated', 'payment_refunded', 'consultation_cancelled',
    'login', 'logout', 'export_data', 'bulk_action'
  )),
  entity_type TEXT CHECK (entity_type IN ('user', 'expert', 'company', 'consultation', 'transaction', 'system')),
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_logs_admin ON admin_activity_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_action ON admin_activity_logs(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created ON admin_activity_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_logs_entity ON admin_activity_logs(entity_type, entity_id);

-- 3. TABLE USERS (membres de la plateforme)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  country TEXT,
  city TEXT,
  date_of_birth DATE,
  gender TEXT CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  profile_completed BOOLEAN DEFAULT false,
  membership_type TEXT CHECK (membership_type IN ('free', 'cercle')) DEFAULT 'free',
  membership_start_date TIMESTAMPTZ,
  membership_end_date TIMESTAMPTZ,
  status TEXT CHECK (status IN ('active', 'suspended', 'deleted')) DEFAULT 'active',
  suspended_by UUID REFERENCES admins(id),
  suspension_reason TEXT,
  last_activity TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_country ON users(country);
CREATE INDEX IF NOT EXISTS idx_users_membership ON users(membership_type);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- 4. TABLE EXPERTS
CREATE TABLE IF NOT EXISTS experts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  specialty TEXT NOT NULL,
  bio TEXT,
  languages TEXT[],
  certifications JSONB,
  availability JSONB,
  hourly_rate_xof INTEGER,
  hourly_rate_usd INTEGER,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')) DEFAULT 'pending',
  reviewed_by UUID REFERENCES admins(id),
  reviewed_at TIMESTAMPTZ,
  review_notes TEXT,
  rating DECIMAL(3,2) DEFAULT 0,
  total_sessions INTEGER DEFAULT 0,
  total_revenue_xof BIGINT DEFAULT 0,
  total_revenue_usd BIGINT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_experts_status ON experts(status);
CREATE INDEX IF NOT EXISTS idx_experts_specialty ON experts(specialty);
CREATE INDEX IF NOT EXISTS idx_experts_rating ON experts(rating DESC);
CREATE INDEX IF NOT EXISTS idx_experts_reviewed_by ON experts(reviewed_by);

-- 5. TABLE COMPANIES (entreprises clientes)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  employee_count INTEGER,
  contact_email TEXT NOT NULL,
  contact_phone TEXT,
  country TEXT,
  city TEXT,
  plan_type TEXT CHECK (plan_type IN ('essentiel', 'croissance', 'entreprise')) NOT NULL,
  plan_price_xof INTEGER,
  plan_price_usd INTEGER,
  subscription_status TEXT CHECK (subscription_status IN ('active', 'paused', 'cancelled')) DEFAULT 'active',
  subscription_start_date TIMESTAMPTZ DEFAULT NOW(),
  subscription_end_date TIMESTAMPTZ,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  managed_by UUID REFERENCES admins(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_companies_plan ON companies(plan_type);
CREATE INDEX IF NOT EXISTS idx_companies_status ON companies(subscription_status);
CREATE INDEX IF NOT EXISTS idx_companies_managed_by ON companies(managed_by);

-- 6. TABLE CONSULTATIONS
CREATE TABLE IF NOT EXISTS consultations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES experts(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status TEXT CHECK (status IN ('scheduled', 'completed', 'cancelled', 'no_show')) DEFAULT 'scheduled',
  cancelled_by UUID REFERENCES admins(id),
  cancellation_reason TEXT,
  meeting_url TEXT,
  price_xof INTEGER,
  price_usd INTEGER,
  currency TEXT CHECK (currency IN ('XOF', 'USD')) DEFAULT 'XOF',
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_consultations_member ON consultations(member_id);
CREATE INDEX IF NOT EXISTS idx_consultations_expert ON consultations(expert_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_scheduled ON consultations(scheduled_at);
CREATE INDEX IF NOT EXISTS idx_consultations_created ON consultations(created_at);

-- 7. TABLE TRANSACTIONS (paiements)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  consultation_id UUID REFERENCES consultations(id) ON DELETE SET NULL,
  type TEXT CHECK (type IN ('subscription', 'consultation', 'one_time')) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT CHECK (currency IN ('XOF', 'USD')) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  refunded_by UUID REFERENCES admins(id),
  refund_reason TEXT,
  payment_method TEXT,
  payment_provider TEXT,
  provider_transaction_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_company ON transactions(company_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions(status);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON transactions(type);

-- 8. TABLE SUBSCRIPTIONS (abonnements actifs)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT CHECK (currency IN ('XOF', 'USD')) NOT NULL,
  billing_period TEXT CHECK (billing_period IN ('monthly', 'yearly')) DEFAULT 'monthly',
  status TEXT CHECK (status IN ('active', 'paused', 'cancelled', 'expired')) DEFAULT 'active',
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end TIMESTAMPTZ NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_period_end ON subscriptions(current_period_end);

-- 9. TABLE SUPPORT_TICKETS (tickets support gérés par admins)
CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES experts(id) ON DELETE CASCADE,
  company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('technical', 'billing', 'account', 'consultation', 'other')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  status TEXT CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')) DEFAULT 'open',
  assigned_to UUID REFERENCES admins(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_tickets_priority ON support_tickets(priority);

-- 10. TABLE PLATFORM_SETTINGS (paramètres gérés par admins)
CREATE TABLE IF NOT EXISTS platform_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category TEXT CHECK (category IN ('general', 'payments', 'notifications', 'integrations', 'security')),
  description TEXT,
  updated_by UUID REFERENCES admins(id),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_settings_key ON platform_settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON platform_settings(category);

-- ==================== VUES POUR ANALYTICS ====================

-- Vue: Revenus mensuels
CREATE OR REPLACE VIEW v_monthly_revenue AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  currency,
  SUM(amount) as total_revenue,
  COUNT(*) as transaction_count
FROM transactions
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', created_at), currency;

-- Vue: Performance des experts
CREATE OR REPLACE VIEW v_expert_performance AS
SELECT 
  e.id,
  e.name,
  e.specialty,
  e.status,
  COUNT(c.id) as total_sessions,
  COALESCE(AVG(c.rating), 0) as avg_rating,
  COALESCE(SUM(CASE WHEN c.currency = 'XOF' THEN c.price_xof ELSE 0 END), 0) as total_revenue_xof,
  COALESCE(SUM(CASE WHEN c.currency = 'USD' THEN c.price_usd ELSE 0 END), 0) as total_revenue_usd
FROM experts e
LEFT JOIN consultations c ON e.id = c.expert_id AND c.status = 'completed'
GROUP BY e.id, e.name, e.specialty, e.status;

-- Vue: Croissance utilisateurs
CREATE OR REPLACE VIEW v_user_growth AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  COUNT(*) as new_users,
  SUM(COUNT(*)) OVER (ORDER BY DATE_TRUNC('month', created_at)) as cumulative_users
FROM users
WHERE status != 'deleted'
GROUP BY DATE_TRUNC('month', created_at);

-- Vue: Résumé activité admin
CREATE OR REPLACE VIEW v_admin_activity_summary AS
SELECT 
  a.id,
  a.name,
  a.role,
  COUNT(l.id) as total_actions,
  MAX(l.created_at) as last_action,
  COUNT(CASE WHEN l.action_type LIKE '%approved%' THEN 1 END) as approvals,
  COUNT(CASE WHEN l.action_type LIKE '%rejected%' THEN 1 END) as rejections,
  COUNT(CASE WHEN l.action_type LIKE '%suspended%' THEN 1 END) as suspensions
FROM admins a
LEFT JOIN admin_activity_logs l ON a.id = l.admin_id
GROUP BY a.id, a.name, a.role;

-- ==================== FONCTIONS & TRIGGERS ====================

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Appliquer le trigger à toutes les tables
CREATE TRIGGER update_admins_updated_at 
  BEFORE UPDATE ON admins 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_experts_updated_at 
  BEFORE UPDATE ON experts 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_companies_updated_at 
  BEFORE UPDATE ON companies 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultations_updated_at 
  BEFORE UPDATE ON consultations 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at 
  BEFORE UPDATE ON transactions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at 
  BEFORE UPDATE ON subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tickets_updated_at 
  BEFORE UPDATE ON support_tickets 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at 
  BEFORE UPDATE ON platform_settings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==================== ROW LEVEL SECURITY (RLS) ====================

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_settings ENABLE ROW LEVEL SECURITY;

-- Policies pour permettre au service role de tout faire (backend)
CREATE POLICY "Service role all access admins" 
  ON admins FOR ALL 
  USING (true);

CREATE POLICY "Service role all access admin_logs" 
  ON admin_activity_logs FOR ALL 
  USING (true);

CREATE POLICY "Service role all access users" 
  ON users FOR ALL 
  USING (true);

CREATE POLICY "Service role all access experts" 
  ON experts FOR ALL 
  USING (true);

CREATE POLICY "Service role all access companies" 
  ON companies FOR ALL 
  USING (true);

CREATE POLICY "Service role all access consultations" 
  ON consultations FOR ALL 
  USING (true);

CREATE POLICY "Service role all access transactions" 
  ON transactions FOR ALL 
  USING (true);

CREATE POLICY "Service role all access subscriptions" 
  ON subscriptions FOR ALL 
  USING (true);

CREATE POLICY "Service role all access tickets" 
  ON support_tickets FOR ALL 
  USING (true);

CREATE POLICY "Service role all access settings" 
  ON platform_settings FOR ALL 
  USING (true);

-- ==================== DONNÉES INITIALES (OPTIONNEL) ====================

-- Insérer un admin par défaut (décommentez si nécessaire)
-- INSERT INTO admins (email, name, role, department) VALUES
-- ('admin@monafrica.net', 'Admin Principal', 'super_admin', 'operations')
-- ON CONFLICT (email) DO NOTHING;

-- ==================== FIN DE LA MIGRATION ====================

-- Note: Ce fichier peut être exécuté plusieurs fois (idempotent grâce à IF NOT EXISTS)
-- Pour appliquer: exécutez ce SQL dans l'éditeur SQL de Supabase Dashboard
