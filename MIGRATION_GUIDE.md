# Guide de Migration KV Store vers Postgres SQL

## Contexte

M.O.N.A utilisait initialement un système de **KV Store** (clé-valeur) basique pour stocker les données. Cette approche présentait des limitations majeures :

- ❌ Pas de relations entre entités
- ❌ Filtrage lent (en JavaScript, pas en base)
- ❌ Pas d'agrégations optimisées
- ❌ Difficile à scaler
- ❌ Pas de transactions ACID

Nous avons migré vers **Postgres SQL** pour bénéficier de :

- ✅ Relations structurées (foreign keys)
- ✅ Requêtes SQL optimisées avec indexes
- ✅ Agrégations performantes (GROUP BY, SUM, AVG)
- ✅ Transactions ACID
- ✅ Row Level Security (RLS)
- ✅ Vues matérialisées pour analytics

---

## Architecture Finale

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                              │
│  (React + TypeScript)                                        │
│  - AdminDashboardPage.tsx                                    │
│  - AdminUsersPage.tsx                                        │
│  - AdminAnalyticsPage.tsx                                    │
│  - AdminSettingsPage.tsx                                     │
└─────────────────┬───────────────────────────────────────────┘
                  │ HTTPS Fetch
                  │ Authorization: Bearer {publicAnonKey}
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Hono Server)                     │
│  /supabase/functions/server/index.tsx                        │
│                                                              │
│  Routes:                                                     │
│  - GET  /admin/analytics                                     │
│  - GET  /admin/users-sql                                     │
│  - GET  /admin/users-sql/stats                               │
│  - GET  /admin/users-sql/:userId                             │
│  - PUT  /admin/users-sql/:userId                             │
│  - POST /admin/users-sql/:userId/suspend                     │
│  - POST /admin/users-sql/:userId/reactivate                  │
│  - DELETE /admin/users-sql/:userId                           │
│                                                              │
│  Modules:                                                    │
│  - db.tsx (Supabase client)                                  │
│  - admin_analytics_sql.tsx                                   │
│  - admin_users_sql.tsx                                       │
└─────────────────┬───────────────────────────────────────────┘
                  │ Supabase Client
                  │ Authorization: Bearer {SERVICE_ROLE_KEY}
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                  POSTGRES DATABASE                           │
│  (Supabase Postgres)                                         │
│                                                              │
│  Tables:                                                     │
│  - admins (équipe M.O.N.A)                                   │
│  - admin_activity_logs                                       │
│  - users (membres)                                           │
│  - experts                                                   │
│  - companies                                                 │
│  - consultations                                             │
│  - transactions                                              │
│  - subscriptions                                             │
│  - support_tickets                                           │
│  - platform_settings                                         │
│                                                              │
│  Vues:                                                       │
│  - v_monthly_revenue                                         │
│  - v_expert_performance                                      │
│  - v_user_growth                                             │
│  - v_admin_activity_summary                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## Fichiers Modifiés/Créés

### Backend

| Fichier | Type | Description |
|---------|------|-------------|
| `/supabase/functions/server/db.tsx` | ✅ Nouveau | Client Supabase configuré avec SERVICE_ROLE_KEY |
| `/supabase/functions/server/admin_analytics_sql.tsx` | ✅ Nouveau | Analytics SQL optimisées |
| `/supabase/functions/server/admin_users_sql.tsx` | ✅ Nouveau | CRUD utilisateurs avec SQL |
| `/supabase/functions/server/index.tsx` | 📝 Modifié | Ajout de 8 nouvelles routes API |

### Frontend

| Fichier | Type | Description |
|---------|------|-------------|
| `/src/app/pages/admin/AdminUsersPage.tsx` | 📝 Modifié | Connexion aux routes SQL |
| `/src/app/pages/admin/AdminDashboardPage.tsx` | ✅ Déjà fait | Utilise déjà `/admin/analytics` |

### Migrations SQL

| Fichier | Type | Description |
|---------|------|-------------|
| `/supabase/migrations/001_initial_schema.sql` | ✅ Nouveau | Schéma SQL complet versionné |
| `/supabase/migrations/README.md` | ✅ Nouveau | Documentation migrations |

---

## Schéma des Tables

### Relations Principales

```
admins (équipe M.O.N.A)
  ├─> admin_activity_logs (traçabilité)
  ├─> users.suspended_by
  ├─> experts.reviewed_by
  ├─> companies.managed_by
  └─> consultations.cancelled_by

users (membres)
  ├─> consultations
  ├─> transactions
  └─> subscriptions

experts
  └─> consultations

companies
  ├─> consultations
  ├─> transactions
  └─> subscriptions
```

### Détails des Tables

#### admins
```sql
- id (UUID, PK)
- email (UNIQUE)
- name
- role (super_admin, admin, moderator, support)
- department (operations, finance, support, marketing, rh, tech)
- permissions (JSONB)
- is_active (BOOLEAN)
```

#### users
```sql
- id (UUID, PK)
- email (UNIQUE)
- name
- phone, country, city
- membership_type (free, cercle)
- status (active, suspended, deleted)
- suspended_by (FK -> admins.id)
- last_activity
```

#### experts
```sql
- id (UUID, PK)
- email (UNIQUE)
- specialty
- status (pending, approved, rejected, suspended)
- reviewed_by (FK -> admins.id)
- rating (DECIMAL)
- total_sessions (INTEGER)
- total_revenue_xof, total_revenue_usd
```

#### consultations
```sql
- id (UUID, PK)
- member_id (FK -> users.id)
- expert_id (FK -> experts.id)
- company_id (FK -> companies.id, NULLABLE)
- scheduled_at
- status (scheduled, completed, cancelled, no_show)
- rating (1-5)
- price_xof, price_usd
```

---

## Routes API Disponibles

### Analytics

**GET** `/admin/analytics`

Retourne toutes les analytics de la plateforme :
- Stats globales (users, experts, companies)
- Revenus (XOF/USD, MRR, croissance)
- Consultations (total, avg duration, satisfaction)
- Top experts/companies
- Funnel de conversion
- Activité récente

**Exemple Réponse:**
```json
{
  "success": true,
  "data": {
    "platformStats": {
      "totalUsers": 1847,
      "totalExperts": 43,
      "totalCompanies": 12,
      "activeUsers": 982
    },
    "revenueStats": {
      "thisMonth": { "XOF": 45234000, "USD": 75390 },
      "mrr": { "XOF": 38900000, "USD": 64833 }
    },
    "userGrowth": [
      { "month": "Août", "users": 234 },
      { "month": "Sept", "users": 456 }
    ]
  }
}
```

### Users Management

**GET** `/admin/users-sql?search=&status=&membershipType=&limit=50&offset=0`

Liste les utilisateurs avec filtres et pagination.

**GET** `/admin/users-sql/stats`

Retourne les stats utilisateurs (total, active, suspended, cercle).

**GET** `/admin/users-sql/:userId`

Détails d'un utilisateur spécifique.

**PUT** `/admin/users-sql/:userId`

Met à jour un utilisateur.

**Headers requis:**
```
X-Admin-Id: {adminId}
```

**POST** `/admin/users-sql/:userId/suspend`

Suspend un utilisateur.

**Body:**
```json
{
  "reason": "Violation des conditions d'utilisation"
}
```

**POST** `/admin/users-sql/:userId/reactivate`

Réactive un utilisateur suspendu.

**DELETE** `/admin/users-sql/:userId`

Supprime un utilisateur (soft delete).

---

## Tests et Validation

### 1. Vérifier que les tables existent

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

Devrait retourner : admins, admin_activity_logs, companies, consultations, experts, subscriptions, support_tickets, transactions, users, platform_settings

### 2. Tester une route API

```bash
curl -X GET \
  "https://{projectId}.supabase.co/functions/v1/make-server-6378cc81/admin/users-sql/stats" \
  -H "Authorization: Bearer {publicAnonKey}"
```

### 3. Insérer des données de test

```sql
-- Créer un admin test
INSERT INTO admins (email, name, role, department) 
VALUES ('admin@monafrica.net', 'Admin Test', 'super_admin', 'operations');

-- Créer quelques utilisateurs test
INSERT INTO users (email, name, phone, country, city, membership_type) VALUES
('aminata@example.com', 'Aminata Diallo', '+243900123456', 'RDC', 'Kinshasa', 'free'),
('fatou@example.com', 'Fatou Sow', '+221770234567', 'Sénégal', 'Dakar', 'cercle'),
('yacine@example.com', 'Yacine Kone', '+225070345678', 'Côte d''Ivoire', 'Abidjan', 'free');

-- Créer quelques experts test
INSERT INTO experts (email, name, specialty, status, hourly_rate_xof, hourly_rate_usd) VALUES
('dr.mbala@monafrica.net', 'Dr. Mbala Nkosi', 'Psychologie clinique', 'approved', 45000, 75),
('dr.traore@monafrica.net', 'Dr. Aïcha Traoré', 'Thérapie cognitive', 'approved', 50000, 83);
```

---

## Prochaines Étapes

### Phase 2 : Experts Management
- [ ] Créer `admin_experts_sql.tsx`
- [ ] Routes pour approval/rejection
- [ ] Frontend pour gérer les candidatures

### Phase 3 : Companies Management
- [ ] Créer `admin_companies_sql.tsx`
- [ ] Dashboard entreprises
- [ ] Gestion des abonnements

### Phase 4 : Consultations
- [ ] Créer `consultations_sql.tsx`
- [ ] Intégration Daily.co
- [ ] Calendrier de réservations

### Phase 5 : Optimisations
- [ ] Vues matérialisées pour analytics
- [ ] Cache Redis pour données fréquentes
- [ ] Pagination côté serveur

---

## Commandes Git

```bash
# Vérifier les fichiers modifiés
git status

# Ajouter tous les fichiers
git add .

# Commit
git commit -m "feat: Migration KV Store vers Postgres SQL

- Créé schéma SQL complet (10 tables + 4 vues)
- Implémenté backend SQL (db.tsx, admin_analytics_sql.tsx, admin_users_sql.tsx)
- Ajouté 8 routes API pour gestion utilisateurs
- Connecté AdminUsersPage aux vraies données SQL
- Versionné migrations dans /supabase/migrations/"

# Push
git push origin main
```

---

## Support

Pour toute question :
- 📧 Email : tech@monafrica.net
- 📚 Docs Supabase : https://supabase.com/docs
- 🔗 Repo : https://github.com/votre-repo

**Date de migration:** 12 février 2025  
**Version:** 1.0.0
