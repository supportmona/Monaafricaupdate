-- ============================================
-- SCRIPT DE VÉRIFICATION RAPIDE
-- ============================================
-- Exécutez ce script dans Supabase SQL Editor
-- pour vérifier que tout est correctement configuré
-- ============================================

-- 1. Vérifier que toutes les tables existent
SELECT 
  'Tables créées' as verification,
  COUNT(*) as total,
  STRING_AGG(table_name, ', ') as tables
FROM information_schema.tables 
WHERE table_schema = 'public'
  AND table_name IN (
    'admins', 
    'admin_activity_logs', 
    'users', 
    'experts', 
    'companies', 
    'consultations', 
    'transactions', 
    'subscriptions', 
    'support_tickets', 
    'platform_settings'
  );

-- 2. Vérifier les indexes
SELECT 
  'Indexes créés' as verification,
  COUNT(*) as total
FROM pg_indexes 
WHERE schemaname = 'public';

-- 3. Vérifier les vues
SELECT 
  'Vues créées' as verification,
  COUNT(*) as total,
  STRING_AGG(table_name, ', ') as vues
FROM information_schema.views 
WHERE table_schema = 'public'
  AND table_name LIKE 'v_%';

-- 4. Vérifier les triggers
SELECT 
  'Triggers créés' as verification,
  COUNT(*) as total
FROM pg_trigger
WHERE tgname LIKE '%updated_at%';

-- 5. Vérifier les policies RLS
SELECT 
  'Policies RLS' as verification,
  COUNT(*) as total
FROM pg_policies;

-- 6. Compter les enregistrements dans chaque table
SELECT 'admins' as table_name, COUNT(*) as count FROM admins
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
SELECT 'admin_activity_logs', COUNT(*) FROM admin_activity_logs
UNION ALL
SELECT 'platform_settings', COUNT(*) FROM platform_settings
ORDER BY table_name;

-- 7. Vérifier la structure de la table users
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;

-- 8. Tester une vue d'analytics
SELECT * FROM v_user_growth
ORDER BY month DESC
LIMIT 6;

-- 9. Vérifier les foreign keys
SELECT
  tc.table_name, 
  kcu.column_name, 
  ccu.table_name AS foreign_table_name,
  ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
ORDER BY tc.table_name, kcu.column_name;

-- ============================================
-- RÉSULTAT ATTENDU
-- ============================================
-- Si tout est OK, vous devriez voir :
-- ✅ 10 tables créées
-- ✅ ~30 indexes
-- ✅ 4 vues (v_monthly_revenue, v_expert_performance, v_user_growth, v_admin_activity_summary)
-- ✅ ~10 triggers
-- ✅ ~10 policies RLS
-- ✅ Structure de la table users complète
-- ============================================
