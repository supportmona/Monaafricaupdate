-- ============================================
-- DONNÉES DE PRODUCTION RÉALISTES POUR M.O.N.A
-- ============================================
-- Ce script génère des données volumineuses réalistes
-- pour que le dashboard admin affiche des chiffres crédibles
-- ============================================

-- ==================== ADMINS (3 comptes internes) ====================

INSERT INTO admins (email, name, role, department, phone, last_login) VALUES
('admin@monafrica.net', 'Kofi Mensah', 'super_admin', 'operations', '+243 900 100 001', NOW() - INTERVAL '2 hours'),
('support@monafrica.net', 'Amina Diop', 'support', 'support', '+221 770 200 002', NOW() - INTERVAL '1 day'),
('rh@monafrica.net', 'Fatima Traoré', 'admin', 'rh', '+225 070 300 003', NOW() - INTERVAL '3 days')
ON CONFLICT (email) DO NOTHING;

-- ==================== UTILISATEURS (12,458) ====================
-- Génération de 12,458 utilisateurs réalistes répartis sur 7 mois

DO $$
DECLARE
  i INTEGER;
  month_offset INTEGER;
  users_per_batch INTEGER;
  country_name TEXT;
  city_name TEXT;
  membership TEXT;
  user_email TEXT;
  user_name TEXT;
  first_names TEXT[] := ARRAY['Aminata', 'Fatou', 'Yacine', 'Moussa', 'Olivier', 'Ibrahim', 'Aya', 'Sophie', 'Grace', 'Zara', 'Kofi', 'Amina', 'Amadou', 'Fatoumata', 'Mamadou', 'Aïcha', 'Cheikh', 'Mariama', 'Boubacar', 'Kadiatou'];
  last_names TEXT[] := ARRAY['Diallo', 'Koné', 'Sow', 'Camara', 'Kabongo', 'Touré', 'Mensah', 'Ba', 'Mutombo', 'Ndiaye', 'Traoré', 'Diouf', 'Mbala', 'Keita', 'Sankara', 'Ouattara', 'Fofana', 'Cissé', 'Bamba', 'Kante'];
  countries TEXT[] := ARRAY['RDC', 'Sénégal', 'Côte d''Ivoire', 'Mali', 'Ghana'];
  cities_rdc TEXT[] := ARRAY['Kinshasa', 'Lubumbashi', 'Goma', 'Kisangani'];
  cities_senegal TEXT[] := ARRAY['Dakar', 'Thiès', 'Saint-Louis', 'Kaolack'];
  cities_ci TEXT[] := ARRAY['Abidjan', 'Bouaké', 'Yamoussoukro', 'San-Pedro'];
  cities_mali TEXT[] := ARRAY['Bamako', 'Sikasso', 'Mopti', 'Kayes'];
  cities_ghana TEXT[] := ARRAY['Accra', 'Kumasi', 'Tamale', 'Takoradi'];
  batch_distribution INTEGER[] := ARRAY[1245, 344, 423, 555, 678, 878, 767]; -- Août à Février (total ~4890 pour les 7 derniers mois)
  total_earlier INTEGER := 7568; -- Utilisateurs créés avant août (pour atteindre 12,458)
BEGIN
  
  -- Générer 7,568 utilisateurs créés avant août 2025
  FOR i IN 1..total_earlier LOOP
    -- Sélection aléatoire des attributs
    country_name := countries[1 + floor(random() * 5)::int];
    
    CASE country_name
      WHEN 'RDC' THEN city_name := cities_rdc[1 + floor(random() * 4)::int];
      WHEN 'Sénégal' THEN city_name := cities_senegal[1 + floor(random() * 4)::int];
      WHEN 'Côte d''Ivoire' THEN city_name := cities_ci[1 + floor(random() * 4)::int];
      WHEN 'Mali' THEN city_name := cities_mali[1 + floor(random() * 4)::int];
      WHEN 'Ghana' THEN city_name := cities_ghana[1 + floor(random() * 4)::int];
    END CASE;
    
    -- 15% membres Cercle, 85% gratuit
    IF random() < 0.15 THEN
      membership := 'cercle';
    ELSE
      membership := 'free';
    END IF;
    
    user_name := first_names[1 + floor(random() * 20)::int] || ' ' || last_names[1 + floor(random() * 20)::int];
    user_email := lower(replace(user_name, ' ', '.')) || '.' || i || '@gmail.com';
    
    INSERT INTO users (
      email, 
      name, 
      phone,
      country, 
      city, 
      membership_type,
      profile_completed,
      status,
      last_activity,
      created_at
    ) VALUES (
      user_email,
      user_name,
      '+' || (220 + floor(random() * 30)::int)::text || ' ' || (floor(random() * 900000000) + 100000000)::text,
      country_name,
      city_name,
      membership,
      random() < 0.75, -- 75% ont complété leur profil
      'active',
      NOW() - (floor(random() * 90)::int || ' days')::interval, -- Activité sur les 90 derniers jours
      NOW() - (floor(random() * 365)::int || ' days')::interval - INTERVAL '7 months' -- Créés avant août
    );
  END LOOP;
  
  -- Générer les utilisateurs des 7 derniers mois avec distribution réaliste
  -- Août: 1245, Sept: 344, Oct: 423, Nov: 555, Déc: 678, Jan: 878, Fév: 767
  FOR month_offset IN 0..6 LOOP
    users_per_batch := batch_distribution[month_offset + 1];
    
    FOR i IN 1..users_per_batch LOOP
      country_name := countries[1 + floor(random() * 5)::int];
      
      CASE country_name
        WHEN 'RDC' THEN city_name := cities_rdc[1 + floor(random() * 4)::int];
        WHEN 'Sénégal' THEN city_name := cities_senegal[1 + floor(random() * 4)::int];
        WHEN 'Côte d''Ivoire' THEN city_name := cities_ci[1 + floor(random() * 4)::int];
        WHEN 'Mali' THEN city_name := cities_mali[1 + floor(random() * 4)::int];
        WHEN 'Ghana' THEN city_name := cities_ghana[1 + floor(random() * 4)::int];
      END CASE;
      
      IF random() < 0.15 THEN
        membership := 'cercle';
      ELSE
        membership := 'free';
      END IF;
      
      user_name := first_names[1 + floor(random() * 20)::int] || ' ' || last_names[1 + floor(random() * 20)::int];
      user_email := lower(replace(user_name, ' ', '.')) || '.' || (total_earlier + month_offset * 1000 + i)::text || '@gmail.com';
      
      INSERT INTO users (
        email, 
        name,
        phone,
        country, 
        city, 
        membership_type,
        profile_completed,
        status,
        last_activity,
        created_at
      ) VALUES (
        user_email,
        user_name,
        '+' || (220 + floor(random() * 30)::int)::text || ' ' || (floor(random() * 900000000) + 100000000)::text,
        country_name,
        city_name,
        membership,
        random() < 0.75,
        'active',
        NOW() - (floor(random() * 30)::int || ' days')::interval,
        NOW() - (6 - month_offset) || ' months'::interval + (floor(random() * 28)::int || ' days')::interval
      );
    END LOOP;
  END LOOP;
  
END $$;

-- ==================== EXPERTS (67 experts) ====================

INSERT INTO experts (email, name, phone, specialty, bio, languages, hourly_rate_xof, hourly_rate_usd, status, rating, total_sessions, total_revenue_xof, total_revenue_usd) VALUES
-- Top Performers
('dr.mbala@monafrica.net', 'Dr. Jean-Pierre Mbala', '+243 900 111 222', 'Psychologie clinique', 'Psychologue clinicien avec 15 ans d''expérience', ARRAY['Français', 'Lingala', 'Anglais'], 45000, 75, 'approved', 4.8, 312, 14040000, 23400),
('dr.traore@monafrica.net', 'Dr. Aïcha Traoré', '+221 770 222 333', 'Thérapie cognitive comportementale', 'Experte en TCC', ARRAY['Français', 'Wolof'], 50000, 83, 'approved', 4.9, 289, 14450000, 24089),
('dr.kouassi@monafrica.net', 'Dr. Yves Kouassi', '+225 070 333 444', 'Psychiatrie', 'Psychiatre spécialisé', ARRAY['Français', 'Baoulé', 'Anglais'], 60000, 100, 'approved', 4.7, 245, 14700000, 24500),
('dr.nkosi@monafrica.net', 'Dr. Themba Nkosi', '+27 820 555 666', 'Thérapie familiale', 'Thérapeute familial', ARRAY['Anglais', 'Zoulou', 'Français'], 55000, 92, 'approved', 4.6, 198, 10890000, 18216),
('dr.diop@monafrica.net', 'Dr. Awa Diop', '+221 770 777 888', 'Psychologie clinique', 'Spécialiste des troubles anxieux', ARRAY['Français', 'Wolof'], 48000, 80, 'approved', 4.8, 267, 12816000, 21360);

-- Générer 62 experts supplémentaires
DO $$
DECLARE
  i INTEGER;
  expert_name TEXT;
  expert_email TEXT;
  specialties TEXT[] := ARRAY[
    'Psychologie clinique', 
    'Thérapie cognitive comportementale', 
    'Psychiatrie', 
    'Coaching de vie', 
    'Thérapie familiale',
    'Psychologie du travail',
    'Neuropsychologie',
    'Thérapie de couple',
    'Gestion du stress',
    'Psychologie de l''enfant'
  ];
  first_names TEXT[] := ARRAY['Dr. Aminata', 'Dr. Moussa', 'Dr. Fatima', 'Dr. Ibrahim', 'Dr. Mariam', 'Dr. Oumar', 'Dr. Aissatou', 'Dr. Mamadou', 'Dr. Kadiatou', 'Dr. Cheikh'];
  last_names TEXT[] := ARRAY['Sow', 'Kone', 'Diallo', 'Camara', 'Toure', 'Ba', 'Diouf', 'Ndiaye', 'Cisse', 'Fofana'];
  specialty TEXT;
  rate_xof INTEGER;
  sessions INTEGER;
BEGIN
  FOR i IN 1..62 LOOP
    expert_name := first_names[1 + floor(random() * 10)::int] || ' ' || last_names[1 + floor(random() * 10)::int];
    expert_email := lower(replace(expert_name, 'Dr. ', '')) || i || '@monafrica.net';
    specialty := specialties[1 + floor(random() * 10)::int];
    rate_xof := 35000 + floor(random() * 30000)::int; -- Entre 35K et 65K XOF
    sessions := 50 + floor(random() * 150)::int; -- Entre 50 et 200 sessions
    
    INSERT INTO experts (
      email, 
      name, 
      phone,
      specialty, 
      bio,
      languages,
      hourly_rate_xof, 
      hourly_rate_usd,
      status, 
      rating,
      total_sessions,
      total_revenue_xof,
      total_revenue_usd,
      created_at
    ) VALUES (
      expert_email,
      expert_name,
      '+' || (220 + floor(random() * 30)::int)::text || ' ' || (floor(random() * 900000000) + 100000000)::text,
      specialty,
      'Expert en ' || specialty || ' avec plusieurs années d''expérience',
      ARRAY['Français'],
      rate_xof,
      (rate_xof / 600)::int,
      CASE WHEN random() < 0.9 THEN 'approved' ELSE 'pending' END,
      4.3 + (random() * 0.7)::numeric(3,2),
      sessions,
      rate_xof * sessions,
      ((rate_xof / 600)::int) * sessions,
      NOW() - (floor(random() * 365)::int || ' days')::interval
    );
  END LOOP;
END $$;

-- ==================== ENTREPRISES (89 entreprises) ====================

INSERT INTO companies (name, industry, employee_count, contact_email, contact_phone, country, city, plan_type, plan_price_xof, plan_price_usd, subscription_status, engagement_rate) VALUES
('TechCorp Africa', 'Technologie', 250, 'rh@techcorp-africa.com', '+243 900 777 888', 'RDC', 'Kinshasa', 'entreprise', 2500000, 4167, 'active', 78.5),
('Banque Atlantique', 'Finance', 450, 'wellbeing@banque-atlantique.sn', '+221 770 888 999', 'Sénégal', 'Dakar', 'entreprise', 3000000, 5000, 'active', 82.3),
('Orange Côte d''Ivoire', 'Télécommunications', 180, 'hr@orange.ci', '+225 070 999 000', 'Côte d''Ivoire', 'Abidjan', 'croissance', 1500000, 2500, 'active', 71.2),
('StartupHub', 'Incubateur', 35, 'team@startuphub.cd', '+243 900 000 111', 'RDC', 'Kinshasa', 'essentiel', 750000, 1250, 'active', 65.8);

-- Générer 85 entreprises supplémentaires
DO $$
DECLARE
  i INTEGER;
  company_name TEXT;
  company_email TEXT;
  industries TEXT[] := ARRAY['Technologie', 'Finance', 'Télécommunications', 'Banque', 'Assurance', 'Consulting', 'E-commerce', 'Santé', 'Éducation', 'Manufacturing'];
  prefixes TEXT[] := ARRAY['Groupe', 'Société', 'Entreprise', 'Cabinet', 'Solutions', 'Industries', 'Services', 'Technologies', 'Ventures', 'Corp'];
  suffixes TEXT[] := ARRAY['Afrique', 'International', 'Consulting', 'Group', 'Partners', 'Services', 'Solutions', 'Industries', 'Holdings', 'Ventures'];
  plan TEXT;
  employee_count INTEGER;
  plan_price_xof INTEGER;
  engagement DECIMAL;
BEGIN
  FOR i IN 1..85 LOOP
    company_name := prefixes[1 + floor(random() * 10)::int] || ' ' || suffixes[1 + floor(random() * 10)::int] || ' ' || i;
    company_email := 'hr@' || lower(replace(company_name, ' ', '')) || '.com';
    
    -- Distribution: 30% essentiel, 50% croissance, 20% entreprise
    IF random() < 0.3 THEN
      plan := 'essentiel';
      employee_count := 20 + floor(random() * 50)::int; -- 20-70 employés
      plan_price_xof := 750000;
      engagement := 55 + (random() * 15)::numeric(5,2);
    ELSIF random() < 0.8 THEN
      plan := 'croissance';
      employee_count := 70 + floor(random() * 130)::int; -- 70-200 employés
      plan_price_xof := 1500000;
      engagement := 65 + (random() * 15)::numeric(5,2);
    ELSE
      plan := 'entreprise';
      employee_count := 200 + floor(random() * 300)::int; -- 200-500 employés
      plan_price_xof := 2500000 + floor(random() * 1000000)::int; -- 2.5M-3.5M
      engagement := 70 + (random() * 15)::numeric(5,2);
    END IF;
    
    INSERT INTO companies (
      name,
      industry,
      employee_count,
      contact_email,
      contact_phone,
      country,
      city,
      plan_type,
      plan_price_xof,
      plan_price_usd,
      subscription_status,
      engagement_rate,
      created_at
    ) VALUES (
      company_name,
      industries[1 + floor(random() * 10)::int],
      employee_count,
      company_email,
      '+' || (220 + floor(random() * 30)::int)::text || ' ' || (floor(random() * 900000000) + 100000000)::text,
      CASE floor(random() * 5)::int
        WHEN 0 THEN 'RDC'
        WHEN 1 THEN 'Sénégal'
        WHEN 2 THEN 'Côte d''Ivoire'
        WHEN 3 THEN 'Mali'
        ELSE 'Ghana'
      END,
      'Capital',
      plan,
      plan_price_xof,
      (plan_price_xof / 600)::int,
      CASE WHEN random() < 0.85 THEN 'active' ELSE 'paused' END,
      engagement,
      NOW() - (floor(random() * 365)::int || ' days')::interval
    );
  END LOOP;
END $$;

-- ==================== CONSULTATIONS (3,456 consultations) ====================

DO $$
DECLARE
  i INTEGER;
  member_id UUID;
  expert_id UUID;
  status_val TEXT;
  price INTEGER;
  created_date TIMESTAMPTZ;
  member_ids UUID[];
  expert_ids UUID[];
BEGIN
  -- Récupérer des échantillons d'IDs
  SELECT ARRAY_AGG(id) INTO member_ids FROM (SELECT id FROM users ORDER BY RANDOM() LIMIT 2000) sub;
  SELECT ARRAY_AGG(id) INTO expert_ids FROM (SELECT id FROM experts WHERE status = 'approved' ORDER BY RANDOM() LIMIT 60) sub;
  
  FOR i IN 1..3456 LOOP
    member_id := member_ids[1 + floor(random() * 2000)::int];
    expert_id := expert_ids[1 + floor(random() * 60)::int];
    
    -- 75% completed, 20% scheduled, 5% cancelled
    IF random() < 0.75 THEN
      status_val := 'completed';
    ELSIF random() < 0.95 THEN
      status_val := 'scheduled';
    ELSE
      status_val := 'cancelled';
    END IF;
    
    price := 35000 + floor(random() * 30000)::int;
    created_date := NOW() - (floor(random() * 180)::int || ' days')::interval;
    
    INSERT INTO consultations (
      member_id,
      expert_id,
      scheduled_at,
      duration_minutes,
      status,
      price_xof,
      price_usd,
      currency,
      rating,
      feedback,
      created_at
    ) VALUES (
      member_id,
      expert_id,
      CASE 
        WHEN status_val = 'scheduled' THEN NOW() + (floor(random() * 30)::int || ' days')::interval
        ELSE created_date + INTERVAL '1 hour'
      END,
      60,
      status_val,
      price,
      (price / 600)::int,
      'XOF',
      CASE WHEN status_val = 'completed' THEN (4 + random())::int ELSE NULL END,
      CASE WHEN status_val = 'completed' THEN 'Très bonne séance' ELSE NULL END,
      created_date
    );
  END LOOP;
END $$;

-- ==================== TRANSACTIONS (Revenus 45.7M XOF) ====================

DO $$
DECLARE
  i INTEGER;
  user_id UUID;
  company_id UUID;
  amount_val INTEGER;
  created_date TIMESTAMPTZ;
  user_ids UUID[];
  company_ids UUID[];
  month_offset INTEGER;
  monthly_target INTEGER;
  transactions_this_month INTEGER;
BEGIN
  SELECT ARRAY_AGG(id) INTO user_ids FROM (SELECT id FROM users ORDER BY RANDOM() LIMIT 2000) sub;
  SELECT ARRAY_AGG(id) INTO company_ids FROM (SELECT id FROM companies WHERE subscription_status = 'active' ORDER BY RANDOM() LIMIT 75) sub;
  
  -- Générer des transactions pour atteindre ~45.7M XOF ce mois
  -- Ce mois: 45.7M XOF
  -- Distribuer sur le mois en cours
  transactions_this_month := 850;
  
  FOR i IN 1..transactions_this_month LOOP
    -- 60% consultations (35-65K), 30% abonnements membres (149K), 10% abonnements entreprises (750K-3M)
    IF random() < 0.6 THEN
      -- Consultation
      user_id := user_ids[1 + floor(random() * 2000)::int];
      company_id := NULL;
      amount_val := 35000 + floor(random() * 30000)::int;
    ELSIF random() < 0.9 THEN
      -- Abonnement membre
      user_id := user_ids[1 + floor(random() * 2000)::int];
      company_id := NULL;
      amount_val := 149000;
    ELSE
      -- Abonnement entreprise
      user_id := NULL;
      company_id := company_ids[1 + floor(random() * 75)::int];
      amount_val := 750000 + floor(random() * 2250000)::int;
    END IF;
    
    created_date := NOW() - (floor(random() * 30)::int || ' days')::interval;
    
    INSERT INTO transactions (
      user_id,
      company_id,
      type,
      amount,
      currency,
      status,
      payment_method,
      payment_provider,
      created_at
    ) VALUES (
      user_id,
      company_id,
      CASE 
        WHEN amount_val < 100000 THEN 'consultation'
        ELSE 'subscription'
      END,
      amount_val,
      'XOF',
      'completed',
      CASE floor(random() * 3)::int
        WHEN 0 THEN 'mobile_money'
        WHEN 1 THEN 'bank_transfer'
        ELSE 'card'
      END,
      CASE floor(random() * 3)::int
        WHEN 0 THEN 'orange_money'
        WHEN 1 THEN 'mtn_momo'
        ELSE 'wave'
      END,
      created_date
    );
  END LOOP;
  
  -- Générer transactions des mois précédents (pour historique)
  FOR i IN 1..2500 LOOP
    IF random() < 0.6 THEN
      user_id := user_ids[1 + floor(random() * 2000)::int];
      company_id := NULL;
      amount_val := 35000 + floor(random() * 30000)::int;
    ELSIF random() < 0.9 THEN
      user_id := user_ids[1 + floor(random() * 2000)::int];
      company_id := NULL;
      amount_val := 149000;
    ELSE
      user_id := NULL;
      company_id := company_ids[1 + floor(random() * 75)::int];
      amount_val := 750000 + floor(random() * 2250000)::int;
    END IF;
    
    created_date := NOW() - ((30 + floor(random() * 150)::int) || ' days')::interval;
    
    INSERT INTO transactions (
      user_id,
      company_id,
      type,
      amount,
      currency,
      status,
      payment_method,
      payment_provider,
      created_at
    ) VALUES (
      user_id,
      company_id,
      CASE 
        WHEN amount_val < 100000 THEN 'consultation'
        ELSE 'subscription'
      END,
      amount_val,
      'XOF',
      'completed',
      'mobile_money',
      CASE floor(random() * 3)::int
        WHEN 0 THEN 'orange_money'
        WHEN 1 THEN 'mtn_momo'
        ELSE 'wave'
      END,
      created_date
    );
  END LOOP;
END $$;

-- ==================== ABONNEMENTS ACTIFS (2,156 abonnements) ====================

DO $$
DECLARE
  i INTEGER;
  user_id UUID;
  company_id UUID;
  user_ids UUID[];
  company_ids UUID[];
BEGIN
  SELECT ARRAY_AGG(id) INTO user_ids FROM (SELECT id FROM users WHERE membership_type = 'cercle' ORDER BY RANDOM() LIMIT 1800) sub;
  SELECT ARRAY_AGG(id) INTO company_ids FROM (SELECT id FROM companies WHERE subscription_status = 'active' ORDER BY RANDOM() LIMIT 89) sub;
  
  -- Abonnements membres (environ 1,867)
  FOR i IN 1..1867 LOOP
    user_id := user_ids[1 + floor(random() * 1800)::int];
    
    INSERT INTO subscriptions (
      user_id,
      plan_type,
      amount,
      currency,
      billing_period,
      status,
      current_period_start,
      current_period_end
    ) VALUES (
      user_id,
      'Cercle M.O.N.A',
      149000,
      'XOF',
      'monthly',
      'active',
      NOW() - INTERVAL '15 days',
      NOW() + INTERVAL '15 days'
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
  
  -- Abonnements entreprises (89)
  FOR i IN 1..89 LOOP
    company_id := company_ids[i];
    
    INSERT INTO subscriptions (
      company_id,
      plan_type,
      amount,
      currency,
      billing_period,
      status,
      current_period_start,
      current_period_end
    ) VALUES (
      company_id,
      'Entreprise',
      750000 + floor(random() * 2250000)::int,
      'XOF',
      'monthly',
      'active',
      NOW() - INTERVAL '10 days',
      NOW() + INTERVAL '20 days'
    )
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- ==================== LOGS D'ACTIVITÉ (Activité récente) ====================

DO $$
DECLARE
  admin_id UUID;
  i INTEGER;
BEGIN
  SELECT id INTO admin_id FROM admins WHERE email = 'admin@monafrica.net' LIMIT 1;
  
  FOR i IN 1..50 LOOP
    INSERT INTO admin_activity_logs (
      admin_id,
      action_type,
      entity_type,
      details,
      created_at
    ) VALUES (
      admin_id,
      CASE floor(random() * 4)::int
        WHEN 0 THEN 'expert_approved'
        WHEN 1 THEN 'user_updated'
        WHEN 2 THEN 'company_created'
        ELSE 'login'
      END,
      CASE floor(random() * 4)::int
        WHEN 0 THEN 'expert'
        WHEN 1 THEN 'user'
        WHEN 2 THEN 'company'
        ELSE 'system'
      END,
      '{"action": "Activity log"}',
      NOW() - (floor(random() * 48)::int || ' hours')::interval
    );
  END LOOP;
END $$;

-- ==================== VÉRIFICATION FINALE ====================

SELECT 
  'users' as table_name, COUNT(*) as count FROM users
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
SELECT 'admin_activity_logs', COUNT(*) FROM admin_activity_logs;

-- Vérifier les revenus ce mois
SELECT 
  'Revenus ce mois (XOF)' as metric,
  SUM(amount)::BIGINT as value
FROM transactions
WHERE status = 'completed'
  AND created_at >= DATE_TRUNC('month', NOW());

SELECT 
  'MRR (XOF)' as metric,
  SUM(amount)::BIGINT as value
FROM subscriptions
WHERE status = 'active';

-- ==================== FIN ====================
SELECT '✅ Données de production réalistes insérées avec succès !' as status;
