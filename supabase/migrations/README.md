# Migrations Base de Données M.O.N.A

Ce dossier contient les migrations SQL pour la base de données Postgres de M.O.N.A.

## Structure

```
migrations/
├── 001_initial_schema.sql    # Schéma initial complet
└── README.md                  # Ce fichier
```

## Comment appliquer les migrations

### Via Supabase Dashboard (Recommandé)

1. Allez sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sélectionnez votre projet M.O.N.A
3. Cliquez sur "SQL Editor" dans le menu latéral
4. Cliquez sur "+ New query"
5. Copiez-collez le contenu de `001_initial_schema.sql`
6. Cliquez sur "Run" pour exécuter

### Via CLI Supabase (Alternative)

```bash
# Si vous avez Supabase CLI installé
supabase db push
```

## Migrations disponibles

### 001_initial_schema.sql

**Date:** 2025-02-12  
**Description:** Création du schéma initial complet

**Tables créées:**
- `admins` - Équipe administrative M.O.N.A
- `admin_activity_logs` - Logs d'activité des admins
- `users` - Membres de la plateforme
- `experts` - Professionnels de santé mentale
- `companies` - Entreprises clientes
- `consultations` - Sessions de consultation
- `transactions` - Historique des paiements
- `subscriptions` - Abonnements actifs
- `support_tickets` - Tickets de support
- `platform_settings` - Paramètres de la plateforme

**Vues créées:**
- `v_monthly_revenue` - Revenus mensuels agrégés
- `v_expert_performance` - Performance par expert
- `v_user_growth` - Croissance utilisateurs
- `v_admin_activity_summary` - Résumé activité admin

**Fonctionnalités:**
- Triggers automatiques pour `updated_at`
- Row Level Security (RLS) activé
- Policies pour le service role
- Indexes optimisés pour les requêtes

## Notes importantes

⚠️ **Les migrations sont idempotentes** - Vous pouvez les exécuter plusieurs fois sans problème grâce aux clauses `IF NOT EXISTS`.

⚠️ **RLS activé** - Assurez-vous d'utiliser le `SUPABASE_SERVICE_ROLE_KEY` dans votre backend pour avoir accès complet.

⚠️ **Données de test** - Les inserts de données initiales sont commentés par défaut. Décommentez-les si nécessaire.

## Vérifier l'état de la base

Après avoir appliqué les migrations, vérifiez que tout fonctionne :

```sql
-- Lister toutes les tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Vérifier les indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public';

-- Vérifier les policies RLS
SELECT tablename, policyname 
FROM pg_policies;
```

## Rollback (si nécessaire)

Pour supprimer toutes les tables (⚠️ ATTENTION : perte de données) :

```sql
DROP TABLE IF EXISTS support_tickets CASCADE;
DROP TABLE IF EXISTS platform_settings CASCADE;
DROP TABLE IF EXISTS subscriptions CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS consultations CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS experts CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS admin_activity_logs CASCADE;
DROP TABLE IF EXISTS admins CASCADE;

DROP VIEW IF EXISTS v_monthly_revenue;
DROP VIEW IF EXISTS v_expert_performance;
DROP VIEW IF EXISTS v_user_growth;
DROP VIEW IF EXISTS v_admin_activity_summary;

DROP FUNCTION IF EXISTS update_updated_at_column();
```

## Support

Pour toute question sur les migrations :
- 📧 Email: tech@monafrica.net
- 📚 Documentation: [Supabase Docs](https://supabase.com/docs)
