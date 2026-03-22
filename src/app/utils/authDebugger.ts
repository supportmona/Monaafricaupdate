/**
 * Système de debugging pour l'authentification expert
 * Affiche automatiquement des instructions en cas d'erreur
 */

export function logAuthError(error: string) {
  const isCredentialsError = error.includes("Invalid") || error.includes("credentials");
  
  if (!isCredentialsError) return;

  console.clear();
  
  // Styles
  const styles = {
    title: 'background: linear-gradient(90deg, #c77a5a, #d4c4b0); color: white; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 8px;',
    error: 'color: #ef4444; font-size: 18px; font-weight: bold;',
    success: 'color: #10b981; font-size: 16px; font-weight: bold;',
    info: 'color: #3b82f6; font-size: 14px;',
    warning: 'color: #f59e0b; font-size: 14px; font-weight: bold;',
    link: 'color: #c77a5a; font-size: 16px; font-weight: bold; text-decoration: underline;',
    code: 'background: #1e293b; color: #10b981; padding: 2px 8px; border-radius: 4px; font-family: monospace;'
  };

  console.log('%c🌟 M.O.N.A - Système de Réparation Automatique', styles.title);
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #d4c4b0;');
  console.log('');
  
  // Erreur détectée
  console.log('%c❌ ERREUR D\'AUTHENTIFICATION DÉTECTÉE', styles.error);
  console.log('%c   Type: Invalid login credentials', styles.info);
  console.log('%c   Cause: Le compte n\'existe pas dans la base de données', styles.info);
  console.log('');
  
  // Solution automatique
  console.log('%c✨ BONNE NOUVELLE: Redirection automatique activée !', styles.success);
  console.log('');
  console.log('%c📍 Vous allez voir un GROS COMPTE À REBOURS sur votre écran', styles.warning);
  console.log('%c   10... 9... 8... 7...');
  console.log('');
  console.log('%c⏱️  Dans 10 secondes, vous serez redirigé automatiquement vers:', styles.info);
  console.log('%c   /expert-auth-reset', styles.link);
  console.log('');
  
  // Processus
  console.log('%c🔄 PROCESSUS AUTOMATIQUE (36 secondes au total)', styles.success);
  console.log('');
  console.log('%c   Étape 1: /expert-auth-reset (6 secondes)', styles.info);
  console.log('   └─ Nettoyage localStorage ✓');
  console.log('   └─ Nettoyage sessionStorage ✓');
  console.log('   └─ Nettoyage cookies ✓');
  console.log('   └─ Compte à rebours: 3, 2, 1...');
  console.log('');
  console.log('%c   Étape 2: /quick-fix (30 secondes)', styles.info);
  console.log('   └─ Création d\'un compte avec email unique');
  console.log('   └─ Test de connexion automatique');
  console.log('   └─ Affichage de vos identifiants');
  console.log('   └─ Bouton "Se connecter maintenant"');
  console.log('');
  
  // Action manuelle
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #d4c4b0;');
  console.log('');
  console.log('%c🚀 VOUS VOULEZ Y ALLER MAINTENANT ?', styles.warning);
  console.log('');
  console.log('%c   Tapez cette commande:', styles.info);
  console.log('%c   window.location.href = "/expert-auth-reset"', styles.code);
  console.log('');
  console.log('%c   Ou cliquez sur le gros bouton sur votre écran !', styles.warning);
  console.log('');
  
  // Timeline visuelle
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #d4c4b0;');
  console.log('');
  console.log('%c📊 TIMELINE VISUELLE', styles.success);
  console.log('');
  console.log('   Maintenant → [Compte à rebours: 10s] → /expert-auth-reset');
  console.log('                                             ↓');
  console.log('                                       [Nettoyage: 6s]');
  console.log('                                             ↓');
  console.log('                                         /quick-fix');
  console.log('                                             ↓');
  console.log('                                    [Création compte: 30s]');
  console.log('                                             ↓');
  console.log('                                     ✅ Identifiants prêts !');
  console.log('                                             ↓');
  console.log('                                      Clic sur bouton');
  console.log('                                             ↓');
  console.log('                                       /expert-login');
  console.log('                                             ↓');
  console.log('                                     🎉 CONNEXION RÉUSSIE');
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #d4c4b0;');
  console.log('');
  
  // Note finale
  console.log('%c💡 CONSEIL:', styles.warning);
  console.log('%c   NE FAITES RIEN - Laissez le système automatique faire son travail !', styles.info);
  console.log('%c   Vous verrez un gros compte à rebours sur votre écran.', styles.info);
  console.log('');
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #d4c4b0;');
}

// Appeler automatiquement au chargement
if (typeof window !== 'undefined') {
  // Écouter les erreurs d'authentification
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const errorMessage = args.join(' ');
    if (errorMessage.includes('Invalid') && errorMessage.includes('credentials')) {
      logAuthError(errorMessage);
    }
    originalConsoleError.apply(console, args);
  };
}
