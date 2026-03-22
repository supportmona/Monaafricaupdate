-- ============================================
-- DONNÉES DE TEST POUR M.O.N.A
-- ============================================
-- Ce fichier contient des données de test pour valider
-- que le schéma SQL fonctionne correctement
-- ============================================

-- ==================== ADMINS ====================

INSERT INTO admins (email, name, role, department, phone) VALUES
('admin@monafrica.net', 'Kofi Mensah', 'super_admin', 'operations', '+243 900 100 001'),
('support@monafrica.net', 'Amina Diop', 'support', 'support', '+221 770 200 002'),
('rh@monafrica.net', 'Fatima Traoré', 'admin', 'rh', '+225 070 300 003')
ON CONFLICT (email) DO NOTHING;

-- ==================== UTILISATEURS ====================

INSERT INTO users (email, name, phone, country, city, membership_type, profile_completed, status) VALUES
('aminata.diallo@gmail.com', 'Aminata Diallo', '+243 900 123 456', 'RDC', 'Kinshasa', 'free', true, 'active'),
('yacine.kone@gmail.com', 'Yacine Koné', '+225 070 234 567', 'Côte d''Ivoire', 'Abidjan', 'free', true, 'active'),
('fatou.sow@gmail.com', 'Fatou Sow', '+221 770 345 678', 'Sénégal', 'Dakar', 'cercle', true, 'active'),
('moussa.camara@gmail.com', 'Moussa Camara', '+223 760 456 789', 'Mali', 'Bamako', 'free', false, 'active'),
('zara.ndiaye@gmail.com', 'Zara Ndiaye', '+221 770 567 890', 'Sénégal', 'Dakar', 'cercle', true, 'active'),
('olivier.kabongo@gmail.com', 'Olivier Kabongo', '+243 900 678 901', 'RDC', 'Lubumbashi', 'free', true, 'active'),
('aya.mensah@gmail.com', 'Aya Mensah', '+233 240 789 012', 'Ghana', 'Accra', 'free', true, 'active'),
('ibrahim.toure@gmail.com', 'Ibrahim Touré', '+225 070 890 123', 'Côte d''Ivoire', 'Abidjan', 'cercle', true, 'active'),
('grace.mutombo@gmail.com', 'Grace Mutombo', '+243 900 901 234', 'RDC', 'Kinshasa', 'free', false, 'active'),
('sophie.ba@gmail.com', 'Sophie Ba', '+221 770 012 345', 'Sénégal', 'Thiès', 'free', true, 'active')
ON CONFLICT (email) DO NOTHING;

-- ==================== EXPERTS ====================

INSERT INTO experts (email, name, phone, specialty, bio, languages, hourly_rate_xof, hourly_rate_usd, status, rating, total_sessions) VALUES
(
  'dr.mbala@monafrica.net',
  'Dr. Jean-Pierre Mbala',
  '+243 900 111 222',
  'Psychologie clinique',
  'Psychologue clinicien avec 15 ans d''expérience en santé mentale. Spécialisé dans la gestion du stress et l''anxiété.',
  ARRAY['Français', 'Lingala', 'Anglais'],
  45000,
  75,
  'approved',
  4.8,
  127
),
(
  'dr.traore@monafrica.net',
  'Dr. Aïcha Traoré',
  '+221 770 222 333',
  'Thérapie cognitive comportementale',
  'Experte en TCC avec une approche centrée sur les solutions. Accompagnement des troubles anxieux et dépressifs.',
  ARRAY['Français', 'Wolof'],
  50000,
  83,
  'approved',
  4.9,
  203
),
(
  'dr.kouassi@monafrica.net',
  'Dr. Yves Kouassi',
  '+225 070 333 444',
  'Psychiatrie',
  'Psychiatre spécialisé dans les troubles de l''humeur et la gestion des émotions.',
  ARRAY['Français', 'Baoulé', 'Anglais'],
  60000,
  100,
  'approved',
  4.7,
  89
),
(
  'sarah.keita@monafrica.net',
  'Sarah Keita',
  '+223 760 444 555',
  'Coaching de vie',
  'Coach certifiée en développement personnel et bien-être mental.',
  ARRAY['Français', 'Bambara'],
  35000,
  58,
  'pending',
  0,
  0
),
(
  'dr.nkosi@monafrica.net',
  'Dr. Themba Nkosi',
  '+27 820 555 666',
  'Thérapie familiale',
  'Thérapeute familial et de couple avec une approche systémique.',
  ARRAY['Anglais', 'Zoulou', 'Français'],
  55000,
  92,
  'approved',
  4.6,
  156
)
ON CONFLICT (email) DO NOTHING;

-- ==================== ENTREPRISES ====================

INSERT INTO companies (name, industry, employee_count, contact_email, contact_phone, country, city, plan_type, plan_price_xof, plan_price_usd, subscription_status, engagement_rate) VALUES
(
  'TechCorp Africa',
  'Technologie',
  250,
  'rh@techcorp-africa.com',
  '+243 900 777 888',
  'RDC',
  'Kinshasa',
  'entreprise',
  2500000,
  4167,
  'active',
  78.5
),
(
  'Banque Atlantique',
  'Finance',
  450,
  'wellbeing@banque-atlantique.sn',
  '+221 770 888 999',
  'Sénégal',
  'Dakar',
  'entreprise',
  3000000,
  5000,
  'active',
  82.3
),
(
  'Orange Côte d''Ivoire',
  'Télécommunications',
  180,
  'hr@orange.ci',
  '+225 070 999 000',
  'Côte d''Ivoire',
  'Abidjan',
  'croissance',
  1500000,
  2500,
  'active',
  71.2
),
(
  'StartupHub',
  'Incubateur',
  35,
  'team@startuphub.cd',
  '+243 900 000 111',
  'RDC',
  'Kinshasa',
  'essentiel',
  750000,
  1250,
  'active',
  65.8
)
ON CONFLICT DO NOTHING;

-- ==================== CONSULTATIONS ====================

-- Récupérer les IDs pour créer des consultations
DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
  user3_id UUID;
  expert1_id UUID;
  expert2_id UUID;
  expert3_id UUID;
  company1_id UUID;
BEGIN
  -- Récupérer les IDs
  SELECT id INTO user1_id FROM users WHERE email = 'fatou.sow@gmail.com' LIMIT 1;
  SELECT id INTO user2_id FROM users WHERE email = 'zara.ndiaye@gmail.com' LIMIT 1;
  SELECT id INTO user3_id FROM users WHERE email = 'ibrahim.toure@gmail.com' LIMIT 1;
  SELECT id INTO expert1_id FROM experts WHERE email = 'dr.mbala@monafrica.net' LIMIT 1;
  SELECT id INTO expert2_id FROM experts WHERE email = 'dr.traore@monafrica.net' LIMIT 1;
  SELECT id INTO expert3_id FROM experts WHERE email = 'dr.kouassi@monafrica.net' LIMIT 1;
  SELECT id INTO company1_id FROM companies WHERE name = 'TechCorp Africa' LIMIT 1;

  -- Consultations complétées
  INSERT INTO consultations (member_id, expert_id, scheduled_at, duration_minutes, status, price_xof, price_usd, currency, rating, feedback) VALUES
  (user1_id, expert1_id, NOW() - INTERVAL '7 days', 60, 'completed', 45000, 75, 'XOF', 5, 'Excellente séance, très à l''écoute'),
  (user2_id, expert2_id, NOW() - INTERVAL '5 days', 60, 'completed', 50000, 83, 'XOF', 5, 'Approche très professionnelle'),
  (user3_id, expert1_id, NOW() - INTERVAL '3 days', 60, 'completed', 45000, 75, 'XOF', 4, 'Très bonne expérience'),
  (user1_id, expert3_id, NOW() - INTERVAL '2 days', 90, 'completed', 90000, 150, 'XOF', 5, 'Session approfondie et enrichissante');

  -- Consultations à venir
  INSERT INTO consultations (member_id, expert_id, company_id, scheduled_at, duration_minutes, status, price_xof, price_usd, currency) VALUES
  (user2_id, expert2_id, NULL, NOW() + INTERVAL '2 days', 60, 'scheduled', 50000, 83, 'XOF'),
  (user3_id, expert1_id, company1_id, NOW() + INTERVAL '4 days', 60, 'scheduled', 45000, 75, 'XOF');
END $$;

-- ==================== TRANSACTIONS ====================

DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
  company1_id UUID;
  consult1_id UUID;
BEGIN
  SELECT id INTO user1_id FROM users WHERE email = 'fatou.sow@gmail.com' LIMIT 1;
  SELECT id INTO user2_id FROM users WHERE email = 'zara.ndiaye@gmail.com' LIMIT 1;
  SELECT id INTO company1_id FROM companies WHERE name = 'TechCorp Africa' LIMIT 1;
  SELECT id INTO consult1_id FROM consultations ORDER BY created_at DESC LIMIT 1;

  INSERT INTO transactions (user_id, type, amount, currency, status, payment_method, payment_provider) VALUES
  (user1_id, 'subscription', 149000, 'XOF', 'completed', 'mobile_money', 'orange_money'),
  (user2_id, 'subscription', 149000, 'XOF', 'completed', 'mobile_money', 'mtn_momo'),
  (user1_id, 'consultation', 45000, 'XOF', 'completed', 'mobile_money', 'orange_money');

  INSERT INTO transactions (company_id, type, amount, currency, status, payment_method, payment_provider) VALUES
  (company1_id, 'subscription', 2500000, 'XOF', 'completed', 'bank_transfer', 'bank');
END $$;

-- ==================== ABONNEMENTS ====================

DO $$
DECLARE
  user1_id UUID;
  user2_id UUID;
  company1_id UUID;
  company2_id UUID;
BEGIN
  SELECT id INTO user1_id FROM users WHERE email = 'fatou.sow@gmail.com' LIMIT 1;
  SELECT id INTO user2_id FROM users WHERE email = 'zara.ndiaye@gmail.com' LIMIT 1;
  SELECT id INTO company1_id FROM companies WHERE name = 'TechCorp Africa' LIMIT 1;
  SELECT id INTO company2_id FROM companies WHERE name = 'Banque Atlantique' LIMIT 1;

  INSERT INTO subscriptions (user_id, plan_type, amount, currency, billing_period, status, current_period_start, current_period_end) VALUES
  (user1_id, 'Cercle M.O.N.A', 149000, 'XOF', 'monthly', 'active', NOW(), NOW() + INTERVAL '30 days'),
  (user2_id, 'Cercle M.O.N.A', 149000, 'XOF', 'monthly', 'active', NOW(), NOW() + INTERVAL '30 days');

  INSERT INTO subscriptions (company_id, plan_type, amount, currency, billing_period, status, current_period_start, current_period_end) VALUES
  (company1_id, 'Entreprise', 2500000, 'XOF', 'monthly', 'active', NOW(), NOW() + INTERVAL '30 days'),
  (company2_id, 'Entreprise', 3000000, 'XOF', 'monthly', 'active', NOW(), NOW() + INTERVAL '30 days');
END $$;

-- ==================== SUPPORT TICKETS ====================

DO $$
DECLARE
  user1_id UUID;
  expert1_id UUID;
  admin1_id UUID;
BEGIN
  SELECT id INTO user1_id FROM users WHERE email = 'aminata.diallo@gmail.com' LIMIT 1;
  SELECT id INTO expert1_id FROM experts WHERE email = 'dr.mbala@monafrica.net' LIMIT 1;
  SELECT id INTO admin1_id FROM admins WHERE email = 'support@monafrica.net' LIMIT 1;

  INSERT INTO support_tickets (user_id, subject, description, category, priority, status, assigned_to) VALUES
  (user1_id, 'Problème de connexion', 'Je n''arrive pas à me connecter depuis ce matin', 'technical', 'high', 'in_progress', admin1_id),
  (user1_id, 'Question sur l''abonnement', 'Je souhaite upgrader mon compte', 'billing', 'medium', 'open', admin1_id);

  INSERT INTO support_tickets (expert_id, subject, description, category, priority, status, assigned_to) VALUES
  (expert1_id, 'Modification des disponibilités', 'Je voudrais changer mes horaires de disponibilité', 'account', 'low', 'resolved', admin1_id);
END $$;

-- ==================== LOGS D'ACTIVITÉ ADMIN ====================

DO $$
DECLARE
  admin1_id UUID;
  expert1_id UUID;
  user1_id UUID;
BEGIN
  SELECT id INTO admin1_id FROM admins WHERE email = 'admin@monafrica.net' LIMIT 1;
  SELECT id INTO expert1_id FROM experts WHERE email = 'dr.mbala@monafrica.net' LIMIT 1;
  SELECT id INTO user1_id FROM users WHERE email = 'aminata.diallo@gmail.com' LIMIT 1;

  INSERT INTO admin_activity_logs (admin_id, action_type, entity_type, entity_id, details) VALUES
  (admin1_id, 'expert_approved', 'expert', expert1_id, '{"reason": "Qualifications validées"}'),
  (admin1_id, 'user_updated', 'user', user1_id, '{"field": "membership_type", "old": "free", "new": "cercle"}'),
  (admin1_id, 'login', 'system', admin1_id, '{"ip": "41.202.207.45"}');
END $$;

-- ==================== VÉRIFICATION ====================

-- Compter les enregistrements créés
SELECT 
  'admins' as table_name, COUNT(*) as count FROM admins
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'experts', COUNT(*) FROM experts
UNION ALL
SELECT 'companies', COUNT(*) FROM companies
UNION ALL
SELECT 'consultations', COUNT(*) FROM consultations
UNION ALL
SELECT 'transactions', COUNT(*) FROM transactions
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM subscriptions
UNION ALL
SELECT 'support_tickets', COUNT(*) FROM support_tickets
UNION ALL
SELECT 'admin_activity_logs', COUNT(*) FROM admin_activity_logs;

-- ==================== FIN ====================
