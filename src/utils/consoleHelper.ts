// Console helper pour guider les utilisateurs
export function showConsoleInstructions() {
  const styles = {
    title: 'color: #c77a5a; font-size: 24px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.1);',
    subtitle: 'color: #333333; font-size: 16px; font-weight: bold;',
    text: 'color: #666666; font-size: 14px;',
    success: 'color: #10b981; font-size: 14px; font-weight: bold;',
    error: 'color: #ef4444; font-size: 14px; font-weight: bold;',
    link: 'color: #c77a5a; font-size: 14px; font-weight: bold; text-decoration: underline;'
  };

  console.log('%c🌟 M.O.N.A - Portail Expert', styles.title);
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #d4c4b0;');
  console.log('');
  
  console.log('%c❌ ERREUR "Invalid login credentials" ?', styles.error);
  console.log('%cCette erreur signifie que le compte n\'existe pas dans le système.', styles.text);
  console.log('');
  
  console.log('%c🚀 SOLUTION AUTOMATIQUE (Recommandée)', styles.success);
  console.log('%cÉtape 1 : Aller sur /expert-auth-reset pour nettoyer', styles.link);
  console.log('%cÉtape 2 : Sera redirigé vers /quick-fix pour créer le compte', styles.link);
  console.log('%cOu tapez : window.location.href = "/expert-auth-reset"', styles.text);
  console.log('');
  
  console.log('%c📋 Ce qui va se passer :', styles.subtitle);
  console.log('%c  1. 🧹 Nettoyage complet des anciennes sessions (3 secondes)', styles.text);
  console.log('%c  2. 🔄 Redirection automatique vers création de compte', styles.text);
  console.log('%c  3. 👤 Création d\'un nouveau compte de test unique (10 secondes)', styles.text);
  console.log('%c  4. ✅ Test de connexion automatique (5 secondes)', styles.text);
  console.log('%c  5. 🔑 Affichage des identifiants prêts à utiliser', styles.text);
  console.log('%c  Durée totale : 30 secondes ⚡', styles.success);
  console.log('');
  
  console.log('%c📍 Autres pages utiles :', styles.subtitle);
  console.log('%c  • /expert-auth-reset - Nettoyage + création automatique', styles.text);
  console.log('%c  • /quick-fix - Création directe (si déjà nettoyé)', styles.text);
  console.log('%c  • /expert-login - Connexion (si vous avez déjà un compte)', styles.text);
  console.log('%c  • /demo-setup - Création manuelle d\'un compte démo', styles.text);
  console.log('%c  • /expert-auth-diagnostic - Diagnostic complet', styles.text);
  console.log('');
  
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #d4c4b0;');
  console.log('%c💡 Conseil : Pour résoudre maintenant, tapez:', styles.subtitle);
  console.log('%cwindow.location.href = "/expert-auth-reset"', styles.link);
  console.log('');
}

// Auto-détecter l'erreur et afficher l'aide
export function detectAuthErrors() {
  // Intercepter les erreurs de connexion
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    const response = await originalFetch(...args);
    
    // Cloner la réponse pour pouvoir la lire sans la consommer
    const clonedResponse = response.clone();
    
    try {
      const data = await clonedResponse.json();
      
      // Détecter les erreurs d'authentification
      if (data.error && (
        data.error.includes('Invalid') || 
        data.error.includes('credentials') ||
        data.error.includes('invalid_credentials')
      )) {
        console.clear();
        console.log('%c⚠️ ERREUR D\'AUTHENTIFICATION DÉTECTÉE', 'color: #ef4444; font-size: 18px; font-weight: bold;');
        console.log('');
        showConsoleInstructions();
      }
    } catch (e) {
      // Pas un JSON, ignorer
    }
    
    return response;
  };
}