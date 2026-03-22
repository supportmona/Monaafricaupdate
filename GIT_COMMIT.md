# Commandes Git pour la Migration SQL

## Fichiers à commit

### ✅ Nouveaux fichiers créés

**Backend:**
- `/supabase/functions/server/db.tsx`
- `/supabase/functions/server/admin_analytics_sql.tsx`
- `/supabase/functions/server/admin_users_sql.tsx`

**Migrations SQL:**
- `/supabase/migrations/001_initial_schema.sql`
- `/supabase/migrations/TEST_DATA.sql`
- `/supabase/migrations/README.md`

**Documentation:**
- `/MIGRATION_GUIDE.md`
- `/GIT_COMMIT.md` (ce fichier)

### 📝 Fichiers modifiés

**Backend:**
- `/supabase/functions/server/index.tsx`

**Frontend:**
- `/src/app/pages/admin/AdminUsersPage.tsx`

---

## Commandes Git

### 1. Vérifier l'état actuel

```bash
git status
```

### 2. Ajouter les fichiers backend

```bash
git add supabase/functions/server/db.tsx
git add supabase/functions/server/admin_analytics_sql.tsx
git add supabase/functions/server/admin_users_sql.tsx
git add supabase/functions/server/index.tsx
```

### 3. Ajouter les migrations SQL

```bash
git add supabase/migrations/001_initial_schema.sql
git add supabase/migrations/TEST_DATA.sql
git add supabase/migrations/README.md
```

### 4. Ajouter le frontend

```bash
git add src/app/pages/admin/AdminUsersPage.tsx
```

### 5. Ajouter la documentation

```bash
git add MIGRATION_GUIDE.md
git add GIT_COMMIT.md
```

### 6. Commit avec message descriptif

```bash
git commit -m "feat: Migration KV Store vers Postgres SQL

✨ Nouveautés:
- Schéma SQL complet (10 tables + 4 vues optimisées)
- Backend SQL avec client Supabase (SERVICE_ROLE_KEY)
- Module analytics SQL (admin_analytics_sql.tsx)
- Module gestion utilisateurs SQL (admin_users_sql.tsx)
- 8 routes API pour CRUD utilisateurs
- Logs d'activité admin (traçabilité complète)

📝 Modifications:
- AdminUsersPage connecté aux vraies données SQL
- Route /admin/analytics utilise Postgres au lieu de KV Store

📦 Migrations:
- 001_initial_schema.sql (schéma complet)
- TEST_DATA.sql (données de démonstration)
- Documentation complète dans /MIGRATION_GUIDE.md

🔧 Architecture:
Frontend (React) → Backend (Hono) → Postgres (Supabase)

Tables créées:
- admins (équipe M.O.N.A)
- admin_activity_logs
- users (membres)
- experts
- companies
- consultations
- transactions
- subscriptions
- support_tickets
- platform_settings

Vues créées:
- v_monthly_revenue
- v_expert_performance
- v_user_growth
- v_admin_activity_summary

Routes API:
- GET  /admin/analytics (analytics temps réel)
- GET  /admin/users-sql (liste utilisateurs)
- GET  /admin/users-sql/stats
- GET  /admin/users-sql/:userId
- PUT  /admin/users-sql/:userId
- POST /admin/users-sql/:userId/suspend
- POST /admin/users-sql/:userId/reactivate
- DELETE /admin/users-sql/:userId

Performance:
✅ Requêtes SQL optimisées avec indexes
✅ Agrégations côté base (GROUP BY, SUM, AVG)
✅ Pagination pour grandes quantités
✅ Relations structurées (foreign keys)
✅ Row Level Security activé

Migration KV → SQL terminée pour:
✅ Analytics admin
✅ Gestion utilisateurs

À venir:
- Gestion experts (approval/rejection)
- Gestion entreprises
- Consultations avec Daily.co"
```

### 7. Push vers remote

```bash
git push origin main
```

---

## Vérification post-push

Après avoir pushé, vérifiez sur GitHub/GitLab que tous les fichiers sont présents :

- [ ] `/supabase/functions/server/db.tsx`
- [ ] `/supabase/functions/server/admin_analytics_sql.tsx`
- [ ] `/supabase/functions/server/admin_users_sql.tsx`
- [ ] `/supabase/functions/server/index.tsx`
- [ ] `/supabase/migrations/001_initial_schema.sql`
- [ ] `/supabase/migrations/TEST_DATA.sql`
- [ ] `/supabase/migrations/README.md`
- [ ] `/src/app/pages/admin/AdminUsersPage.tsx`
- [ ] `/MIGRATION_GUIDE.md`
- [ ] `/GIT_COMMIT.md`

---

## Alternative : Tout ajouter en une fois

Si vous préférez tout ajouter d'un coup :

```bash
git add .
git status  # Vérifier que seuls les bons fichiers sont ajoutés
git commit -m "feat: Migration KV Store vers Postgres SQL avec schéma complet"
git push origin main
```

---

## Notes importantes

⚠️ **Les tables Postgres NE SONT PAS dans Git**

Les tables SQL créées via Supabase UI sont dans votre base de données Supabase, pas dans Git.

**Ce qui est versionné dans Git :**
- ✅ Le **code** qui utilise les tables (backend)
- ✅ Le **schéma SQL** dans `/supabase/migrations/`
- ✅ La **documentation**

**Ce qui n'est PAS dans Git :**
- ❌ Les **tables Postgres** elles-mêmes
- ❌ Les **données** dans les tables

Pour recréer l'environnement sur une nouvelle base Supabase, il faudra :
1. Exécuter `/supabase/migrations/001_initial_schema.sql`
2. (Optionnel) Exécuter `/supabase/migrations/TEST_DATA.sql`

---

## En cas de problème

Si vous voyez des fichiers non désirés dans `git status` :

```bash
# Retirer un fichier du staging
git reset HEAD <fichier>

# Ignorer des fichiers
echo "node_modules/" >> .gitignore
echo ".env" >> .gitignore
```

---

## Commandes utiles

```bash
# Voir les modifications ligne par ligne
git diff

# Voir l'historique
git log --oneline

# Annuler le dernier commit (garder les modifications)
git reset --soft HEAD~1

# Créer une branche pour la migration
git checkout -b feat/sql-migration
git push origin feat/sql-migration
```

---

**Prêt à commit !** 🚀

Exécutez les commandes ci-dessus dans l'ordre pour sauvegarder votre travail.
