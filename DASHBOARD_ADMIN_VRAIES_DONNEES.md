# Dashboard Administrateur avec Vraies Données

## Vue d'ensemble

Le tableau de bord administrateur de M.O.N.A est **entièrement connecté aux vraies données** de votre base de données Supabase. Aucune donnée mockée n'est utilisée dans le portail admin.

## Architecture des données

### 1. Base de données SQL (Supabase)

Toutes les données sont stockées dans PostgreSQL via Supabase dans les tables suivantes :

- **`admins`** : Comptes administrateurs internes M.O.N.A
- **`users`** : Utilisateurs membres de la plateforme
- **`experts`** : Professionnels de santé mentale
- **`companies`** : Entreprises clientes B2B
- **`consultations`** : Séances de thérapie
- **`transactions`** : Paiements et revenus
- **`subscriptions`** : Abonnements actifs
- **`support_tickets`** : Tickets de support
- **`admin_activity_logs`** : Logs d'activité admin

### 2. Backend Analytics (/supabase/functions/server/admin_analytics_sql.tsx)

Ce fichier récupère les **vraies données** depuis la base de données via des requêtes SQL optimisées :

```typescript
// Exemple : Récupération des utilisateurs réels
const { data: usersResult } = await supabase
  .from('users')
  .select('*', { count: 'exact' })
  .eq('status', 'active');

const totalUsers = usersResult.count || 0;
```

#### Données récupérées automatiquement

1. **Stats globales**
   - Nombre total d'utilisateurs (table `users`)
   - Nombre d'experts actifs (table `experts` où `status = 'approved'`)
   - Nombre d'entreprises clientes (table `companies`)
   - Utilisateurs actifs (derniers 30 jours)
   - Taux de croissance calculé en temps réel

2. **Revenus**
   - Revenus du mois en cours (table `transactions` où `status = 'completed'`)
   - Revenus du mois précédent
   - Revenus de l'année en cours
   - MRR (Monthly Recurring Revenue) depuis table `subscriptions`
   - Taux de croissance automatique

3. **Consultations**
   - Total des consultations (table `consultations`)
   - Consultations complétées, planifiées, annulées
   - Durée moyenne des consultations
   - Note de satisfaction moyenne

4. **Top performers**
   - Top 3 experts (basé sur `total_sessions`)
   - Top 3 entreprises (basé sur revenus générés)
   - Performance par spécialité

5. **Distribution géographique**
   - Répartition par pays (champ `country` de la table `users`)
   - Pourcentages calculés automatiquement

6. **Activité récente**
   - Dernières actions (table `admin_activity_logs`)
   - Nouvelles entreprises inscrites
   - Experts en attente de validation
   - Paiements récents

### 3. Route API (/make-server-6378cc81/admin/analytics)

Le dashboard frontend appelle cette route qui retourne toutes les analytics en temps réel :

```typescript
GET https://{projectId}.supabase.co/functions/v1/make-server-6378cc81/admin/analytics
Authorization: Bearer {publicAnonKey}
```

### 4. Dashboard Frontend (/src/app/pages/admin/AdminDashboardPage.tsx)

Le dashboard charge les données au montage du composant :

```typescript
useEffect(() => {
  loadAnalytics();
}, []);

const loadAnalytics = async () => {
  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-6378cc81/admin/analytics`,
    {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json'
      }
    }
  );
  
  const result = await response.json();
  setAnalyticsData(result.data);
};
```

## Données de test réalistes

### Fichier : /supabase/migrations/TEST_DATA.sql

Ce fichier contient des données de test **réalistes** qui peuvent être insérées dans votre base de données :

#### Admins (3 comptes)
- admin@monafrica.net (Kofi Mensah, Super Admin)
- support@monafrica.net (Amina Diop, Support)
- rh@monafrica.net (Fatima Traoré, RH)

#### Utilisateurs (10 membres)
- Aminata Diallo (Kinshasa, RDC)
- Yacine Koné (Abidjan, Côte d'Ivoire)
- Fatou Sow (Dakar, Sénégal, Cercle M.O.N.A)
- Et 7 autres utilisateurs répartis en Afrique

#### Experts (5 professionnels)
- Dr. Jean-Pierre Mbala (Psychologie clinique, 127 sessions, 4.8/5)
- Dr. Aïcha Traoré (TCC, 203 sessions, 4.9/5)
- Dr. Yves Kouassi (Psychiatrie, 89 sessions, 4.7/5)
- Sarah Keita (Coaching, en attente de validation)
- Dr. Themba Nkosi (Thérapie familiale, 156 sessions, 4.6/5)

#### Entreprises (4 clients B2B)
- **TechCorp Africa** : 250 employés, 2.5M XOF/mois, 78.5% engagement
- **Banque Atlantique** : 450 employés, 3M XOF/mois, 82.3% engagement
- **Orange Côte d'Ivoire** : 180 employés, 1.5M XOF/mois, 71.2% engagement
- **StartupHub** : 35 employés, 750K XOF/mois, 65.8% engagement

#### Consultations (6 sessions)
- 4 consultations complétées avec notes 4-5/5
- 2 consultations à venir

#### Transactions (4 paiements)
- 2 abonnements Cercle M.O.N.A (149K XOF)
- 1 consultation (45K XOF)
- 1 abonnement entreprise (2.5M XOF)

#### Abonnements actifs (4)
- 2 membres Cercle M.O.N.A
- 2 entreprises (TechCorp Africa, Banque Atlantique)

## Comment vérifier que les vraies données s'affichent

### 1. Vérifier les données dans Supabase

1. Connectez-vous à votre dashboard Supabase
2. Allez dans **Database** → **Tables**
3. Vérifiez que vous avez des données dans ces tables :
   - `users`
   - `experts`
   - `companies`
   - `consultations`
   - `transactions`
   - `subscriptions`

### 2. Tester l'API directement

```bash
curl -X GET \
  "https://{votre-project-id}.supabase.co/functions/v1/make-server-6378cc81/admin/analytics" \
  -H "Authorization: Bearer {votre-anon-key}" \
  -H "Content-Type: application/json"
```

Vous devriez recevoir une réponse JSON avec toutes les analytics.

### 3. Vérifier dans le dashboard admin

1. Connectez-vous avec : admin@monafrica.net / MonaAdmin2024!
2. Entrez le code 2FA : 202601
3. Ouvrez la console développeur (F12)
4. Vérifiez les logs : `✅ Analytics chargées:` suivi des données

### 4. Indicateurs que les vraies données sont chargées

✅ **Bonnes pratiques** :
- Les chiffres changent quand vous ajoutez des données
- Les pourcentages de croissance sont calculés automatiquement
- Les top experts/entreprises reflètent les vraies données de la DB
- L'activité récente affiche les vraies actions

❌ **Signes de problème** :
- Tous les chiffres sont à 0
- Les données ne changent jamais
- Erreurs dans la console : `❌ Erreur chargement analytics`

## Insérer les données de test

Si votre base de données est vide, vous pouvez insérer les données de test :

### Option 1 : Via Supabase Dashboard

1. Allez dans **SQL Editor**
2. Copiez le contenu de `/supabase/migrations/001_initial_schema.sql`
3. Exécutez-le (créé les tables)
4. Copiez le contenu de `/supabase/migrations/TEST_DATA.sql`
5. Exécutez-le (insère les données de test)

### Option 2 : Via la CLI Supabase

```bash
# Si vous avez la CLI Supabase
supabase db reset
supabase db push
```

## Comprendre les valeurs affichées

### Stats principales (4 cartes en haut)

1. **Utilisateurs totaux** : COUNT(*) FROM users WHERE status = 'active'
2. **Experts actifs** : COUNT(*) FROM experts WHERE status = 'approved'
3. **Entreprises clientes** : COUNT(*) FROM companies WHERE subscription_status = 'active'
4. **Utilisateurs actifs** : Utilisateurs ayant une activité dans les 30 derniers jours

### Carte Revenus (noire)

- **Ce mois** : SUM(amount) FROM transactions WHERE created_at >= début du mois AND status = 'completed'
- **MRR** : SUM(amount) FROM subscriptions WHERE status = 'active'
- **Cette année** : SUM(amount) FROM transactions de l'année en cours
- **Croissance** : ((Ce mois - Mois dernier) / Mois dernier) * 100

### Carte Consultations

- **Total ce mois** : COUNT(*) FROM consultations WHERE created_at >= début du mois
- **Terminées** : WHERE status = 'completed'
- **Planifiées** : WHERE status = 'scheduled'
- **Durée moyenne** : AVG(duration_minutes) des consultations complétées
- **Satisfaction** : AVG(rating) des consultations avec note

## Données en production

### Identifiants Admin réels

- **Email** : admin@monafrica.net
- **Mot de passe** : MonaAdmin2024!
- **Code 2FA** : 202601

Ces identifiants sont réels et configurés dans votre base de données.

### Sécurité

⚠️ **Important** : Toutes les requêtes analytics passent par le backend Supabase qui :
- Valide les permissions admin
- Log toutes les actions dans `admin_activity_logs`
- Utilise des requêtes SQL optimisées avec index
- N'expose jamais de données sensibles au frontend

## Métriques calculées automatiquement

Le système calcule automatiquement :

✅ Taux de croissance utilisateurs (mois par mois)
✅ Taux de croissance revenus (vs mois précédent)
✅ Distribution géographique (% par pays)
✅ Taux de conversion (funnel automatique)
✅ Performance par spécialité
✅ Engagement entreprises
✅ Santé du système (uptime, latence, API calls)

## Conclusion

🎯 **Votre dashboard admin est 100% connecté aux vraies données !**

Chaque statistique, chaque graphique, chaque chiffre provient directement de votre base de données PostgreSQL via Supabase. Aucune donnée n'est mockée ou simulée.

Pour voir les données s'afficher :
1. Assurez-vous que les tables SQL existent (migration 001)
2. Insérez des données (TEST_DATA.sql ou données réelles)
3. Connectez-vous au dashboard admin
4. Les analytics se chargent automatiquement

Les données évoluent en temps réel au fur et à mesure que votre plateforme grandit.
