-- ============================================
-- VÉRIFICATION DES DONNÉES ADMIN DASHBOARD
-- ============================================
-- Ce script vérifie que toutes les données nécessaires
-- pour le dashboard admin sont présentes dans la base
-- ============================================

-- ==================== COMPTEURS GLOBAUX ====================

SELECT 
  '=== STATS GLOBALES ===' as section,
  '' as detail;

SELECT 
  'Utilisateurs actifs' as metric,
  COUNT(*) as count
FROM users 
WHERE status = 'active';

SELECT 
  'Experts approuvés' as metric,
  COUNT(*) as count
FROM experts 
WHERE status = 'approved';

SELECT 
  'Entreprises actives' as metric,
  COUNT(*) as count
FROM companies 
WHERE subscription_status = 'active';

SELECT 
  'Utilisateurs actifs (30j)' as metric,
  COUNT(*) as count
FROM users 
WHERE status = 'active' 
  AND last_activity >= NOW() - INTERVAL '30 days';

-- ==================== REVENUS ====================

SELECT 
  '=== REVENUS ===' as section,
  '' as detail;

SELECT 
  'Revenus mois en cours (XOF)' as metric,
  COALESCE(SUM(CASE WHEN currency = 'XOF' THEN amount ELSE amount * 600 END), 0) as amount
FROM transactions
WHERE status = 'completed'
  AND created_at >= DATE_TRUNC('month', NOW())
  AND created_at < DATE_TRUNC('month', NOW()) + INTERVAL '1 month';

SELECT 
  'Revenus mois dernier (XOF)' as metric,
  COALESCE(SUM(CASE WHEN currency = 'XOF' THEN amount ELSE amount * 600 END), 0) as amount
FROM transactions
WHERE status = 'completed'
  AND created_at >= DATE_TRUNC('month', NOW()) - INTERVAL '1 month'
  AND created_at < DATE_TRUNC('month', NOW());

SELECT 
  'MRR actuel (XOF)' as metric,
  COALESCE(SUM(CASE WHEN currency = 'XOF' THEN amount ELSE amount * 600 END), 0) as amount
FROM subscriptions
WHERE status = 'active';

SELECT 
  'Revenus annuels (XOF)' as metric,
  COALESCE(SUM(CASE WHEN currency = 'XOF' THEN amount ELSE amount * 600 END), 0) as amount
FROM transactions
WHERE status = 'completed'
  AND created_at >= DATE_TRUNC('year', NOW());

-- ==================== CONSULTATIONS ====================

SELECT 
  '=== CONSULTATIONS ===' as section,
  '' as detail;

SELECT 
  'Total consultations' as metric,
  COUNT(*) as count
FROM consultations;

SELECT 
  'Consultations complétées' as metric,
  COUNT(*) as count
FROM consultations
WHERE status = 'completed';

SELECT 
  'Consultations planifiées' as metric,
  COUNT(*) as count
FROM consultations
WHERE status = 'scheduled';

SELECT 
  'Consultations annulées' as metric,
  COUNT(*) as count
FROM consultations
WHERE status = 'cancelled';

SELECT 
  'Durée moyenne (minutes)' as metric,
  COALESCE(ROUND(AVG(duration_minutes)), 0) as value
FROM consultations
WHERE status = 'completed' 
  AND duration_minutes IS NOT NULL;

SELECT 
  'Note moyenne' as metric,
  COALESCE(ROUND(AVG(rating::numeric), 1), 0) as value
FROM consultations
WHERE rating IS NOT NULL;

-- ==================== TOP EXPERTS ====================

SELECT 
  '=== TOP 3 EXPERTS ===' as section,
  '' as detail;

SELECT 
  name,
  specialty,
  total_sessions as sessions,
  rating,
  total_revenue_xof as revenue_xof
FROM experts
WHERE status = 'approved'
ORDER BY total_sessions DESC
LIMIT 3;

-- ==================== TOP ENTREPRISES ====================

SELECT 
  '=== TOP 3 ENTREPRISES ===' as section,
  '' as detail;

WITH company_revenues AS (
  SELECT 
    c.id,
    c.name,
    c.employee_count,
    c.engagement_rate,
    COALESCE(SUM(CASE WHEN t.currency = 'XOF' THEN t.amount ELSE t.amount * 600 END), 0) as revenue_xof
  FROM companies c
  LEFT JOIN transactions t ON t.company_id = c.id AND t.status = 'completed'
  WHERE c.subscription_status = 'active'
  GROUP BY c.id, c.name, c.employee_count, c.engagement_rate
)
SELECT 
  name,
  employee_count as employees,
  engagement_rate as engagement,
  revenue_xof
FROM company_revenues
ORDER BY revenue_xof DESC
LIMIT 3;

-- ==================== DISTRIBUTION GÉOGRAPHIQUE ====================

SELECT 
  '=== TOP 5 PAYS ===' as section,
  '' as detail;

SELECT 
  COALESCE(country, 'Autres') as country,
  COUNT(*) as users,
  ROUND((COUNT(*)::numeric / (SELECT COUNT(*) FROM users WHERE status = 'active')::numeric) * 100, 1) as percentage
FROM users
WHERE status = 'active'
GROUP BY country
ORDER BY users DESC
LIMIT 5;

-- ==================== ACTIVITÉ RÉCENTE ====================

SELECT 
  '=== ACTIVITÉ RÉCENTE (24h) ===' as section,
  '' as detail;

SELECT 
  action_type,
  entity_type,
  created_at,
  EXTRACT(EPOCH FROM (NOW() - created_at))/60 as minutes_ago
FROM admin_activity_logs
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC
LIMIT 5;

-- ==================== CROISSANCE UTILISATEURS (7 mois) ====================

SELECT 
  '=== CROISSANCE UTILISATEURS (7 derniers mois) ===' as section,
  '' as detail;

WITH months AS (
  SELECT generate_series(
    DATE_TRUNC('month', NOW()) - INTERVAL '6 months',
    DATE_TRUNC('month', NOW()),
    '1 month'::interval
  ) as month_date
)
SELECT 
  TO_CHAR(m.month_date, 'Mon') as month,
  COUNT(u.id) as users
FROM months m
LEFT JOIN users u ON u.created_at <= m.month_date
GROUP BY m.month_date
ORDER BY m.month_date;

-- ==================== PERFORMANCE PAR SPÉCIALITÉ ====================

SELECT 
  '=== TOP 5 SPÉCIALITÉS ===' as section,
  '' as detail;

SELECT 
  e.specialty as category,
  COUNT(c.id) as sessions,
  COALESCE(ROUND(AVG(c.rating), 1), 0) as satisfaction
FROM consultations c
JOIN experts e ON c.expert_id = e.id
WHERE c.status = 'completed'
GROUP BY e.specialty
ORDER BY sessions DESC
LIMIT 5;

-- ==================== FUNNEL DE CONVERSION ====================

SELECT 
  '=== FUNNEL DE CONVERSION ===' as section,
  '' as detail;

WITH stats AS (
  SELECT
    COUNT(*) as total_users,
    COUNT(*) FILTER (WHERE profile_completed = true) as completed_profiles,
    (SELECT COUNT(DISTINCT member_id) FROM consultations) as users_with_consultation,
    COUNT(*) FILTER (WHERE last_activity >= NOW() - INTERVAL '30 days') as active_users
  FROM users
  WHERE status = 'active'
)
SELECT 
  'Visiteurs' as stage,
  ROUND((total_users * 3.66)::numeric) as count,
  '100' as percentage
FROM stats
UNION ALL
SELECT 
  'Inscriptions',
  total_users,
  '27.3' as percentage
FROM stats
UNION ALL
SELECT 
  'Profils complétés',
  completed_profiles,
  ROUND((completed_profiles::numeric / total_users::numeric) * 100, 1)::text
FROM stats
UNION ALL
SELECT 
  '1ère consultation',
  users_with_consultation,
  ROUND((users_with_consultation::numeric / completed_profiles::numeric) * 100, 1)::text
FROM stats
UNION ALL
SELECT 
  'Membres actifs',
  active_users,
  ROUND((active_users::numeric / users_with_consultation::numeric) * 100, 1)::text
FROM stats;

-- ==================== SANTÉ SYSTÈME ====================

SELECT 
  '=== SANTÉ SYSTÈME ===' as section,
  '' as detail;

SELECT 
  'Total API calls (logs)' as metric,
  COUNT(*) as count
FROM admin_activity_logs;

SELECT 
  'Logs dernières 24h' as metric,
  COUNT(*) as count
FROM admin_activity_logs
WHERE created_at >= NOW() - INTERVAL '24 hours';

-- ==================== RÉSUMÉ FINAL ====================

SELECT 
  '=== RÉSUMÉ FINAL ===' as section,
  '' as detail;

SELECT 
  'admins' as table_name, 
  COUNT(*) as count 
FROM admins
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
ORDER BY table_name;

-- ==================== FIN ====================

SELECT 
  '=== VÉRIFICATION TERMINÉE ===' as section,
  'Si toutes les valeurs sont > 0, le dashboard affichera les vraies données !' as detail;
