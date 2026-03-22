import { generateGuidePDF } from "@/app/utils/pdfGenerator";

export default function ResourceDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDownloading, setIsDownloading] = useState(false);

  const resources = [
    {
      id: "comprendre-anxiete",
      category: "articles",
      title: "Comprendre l'anxiété : guide complet",
      description: "Un guide approfondi pour comprendre les mécanismes de l'anxiété et les stratégies pour la gérer au quotidien.",
      duration: "15 min de lecture",
      image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800",
      tags: ["Anxiété", "Gestion du stress", "Bien-être"],
      author: "M.O.N.A",
      isFree: true,
      downloadable: true,
      content: `
        <h2>Introduction à l'anxiété</h2>
        <p>L'anxiété est une émotion naturelle que nous ressentons tous. Elle fait partie intégrante de notre système d'alarme interne, conçu pour nous protéger des dangers. Cependant, lorsque l'anxiété devient excessive ou chronique, elle peut significativement impacter notre qualité de vie.</p>

        <h2>Les mécanismes de l'anxiété</h2>
        <p>Sur le plan neurobiologique, l'anxiété active notre système nerveux sympathique, déclenchant une cascade de réactions physiologiques. L'amygdale, une structure cérébrale clé, joue un rôle central dans la détection des menaces et l'activation de la réponse anxieuse.</p>

        <h3>Les symptômes physiques</h3>
        <ul>
          <li>Accélération du rythme cardiaque</li>
          <li>Tension musculaire</li>
          <li>Difficultés respiratoires</li>
          <li>Troubles digestifs</li>
          <li>Fatigue chronique</li>
        </ul>

        <h3>Les symptômes psychologiques</h3>
        <ul>
          <li>Inquiétudes persistantes</li>
          <li>Difficultés de concentration</li>
          <li>Irritabilité</li>
          <li>Troubles du sommeil</li>
          <li>Évitement de situations anxiogènes</li>
        </ul>

        <h2>Stratégies de gestion au quotidien</h2>
        
        <h3>1. La respiration contrôlée</h3>
        <p>La technique de respiration 4-7-8 est particulièrement efficace : inspirez pendant 4 secondes, retenez votre souffle pendant 7 secondes, expirez pendant 8 secondes. Répétez ce cycle 4 fois.</p>

        <h3>2. L'ancrage dans le présent</h3>
        <p>La technique des 5 sens permet de ramener votre attention au moment présent : identifiez 5 choses que vous voyez, 4 que vous touchez, 3 que vous entendez, 2 que vous sentez, 1 que vous goûtez.</p>

        <h3>3. L'activité physique régulière</h3>
        <p>L'exercice physique libère des endorphines et réduit les hormones du stress. Même 20 minutes de marche quotidienne peuvent faire une différence significative.</p>

        <h3>4. La restructuration cognitive</h3>
        <p>Apprenez à identifier et remettre en question vos pensées anxieuses. Demandez-vous : "Cette inquiétude est-elle réaliste ? Quelle est la probabilité que cela arrive vraiment ?"</p>

        <h2>Quand consulter un professionnel</h2>
        <p>Si l'anxiété interfère significativement avec votre vie quotidienne, il est important de consulter un professionnel de santé mentale. Les thérapies cognitivo-comportementales (TCC) ont démontré une grande efficacité dans le traitement des troubles anxieux.</p>

        <h2>Conclusion</h2>
        <p>Comprendre l'anxiété est la première étape pour mieux la gérer. Avec les bonnes stratégies et un accompagnement approprié, il est possible de retrouver un équilibre et une qualité de vie satisfaisante.</p>
      `
    },
    {
      id: "meditation-debutants",
      category: "videos",
      title: "Méditation guidée pour débutants",
      description: "Initiez-vous à la méditation avec cette session guidée de 10 minutes, parfaite pour les débutants.",
      duration: "10 min",
      image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800",
      tags: ["Méditation", "Relaxation", "Mindfulness"],
      author: "M.O.N.A",
      isFree: true,
      downloadable: false,
      videoUrl: "https://www.youtube.com/embed/demo",
      content: `
        <h2>Introduction à la méditation</h2>
        <p>Cette session de méditation guidée est conçue spécialement pour les débutants. Nous allons explorer ensemble les bases de la pleine conscience et vous initier aux techniques fondamentales de méditation.</p>

        <h2>Préparation</h2>
        <p>Avant de commencer, trouvez un endroit calme où vous ne serez pas dérangé pendant les 10 prochaines minutes. Asseyez-vous confortablement, soit sur une chaise avec les pieds à plat au sol, soit en position assise au sol si vous le préférez.</p>

        <h2>Les étapes de cette méditation</h2>
        <ul>
          <li><strong>Minutes 0-2 :</strong> Installation et prise de conscience du corps</li>
          <li><strong>Minutes 2-5 :</strong> Focus sur la respiration</li>
          <li><strong>Minutes 5-8 :</strong> Observation des pensées sans jugement</li>
          <li><strong>Minutes 8-10 :</strong> Retour progressif et ancrage</li>
        </ul>

        <h2>Conseils pour débutants</h2>
        <p>Il est normal que votre esprit vagabonde. La méditation n'est pas de faire le vide, mais d'observer vos pensées avec bienveillance et de ramener doucement votre attention à la respiration chaque fois que vous remarquez que votre esprit s'est égaré.</p>

        <h2>Pratiquer régulièrement</h2>
        <p>Pour bénéficier pleinement des bienfaits de la méditation, nous recommandons une pratique quotidienne, même courte. 10 minutes par jour peuvent transformer votre rapport au stress et à vos émotions.</p>
      `
    },
    {
      id: "equilibre-vie-pro-perso",
      category: "podcasts",
      title: "Équilibre vie pro/perso : trouver son harmonie",
      description: "Discussion avec des experts sur les stratégies pour maintenir un équilibre sain entre travail et vie personnelle.",
      duration: "35 min",
      image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800",
      tags: ["Work-life balance", "Burnout", "Productivité"],
      author: "M.O.N.A",
      isFree: false,
      downloadable: false,
      audioUrl: "https://www.soundcloud.com/demo",
      content: `
        <h2>Contenu réservé aux membres</h2>
        <p>Ce podcast exclusif est réservé aux membres du Cercle M.O.N.A. Dans cet épisode de 35 minutes, nous explorons en profondeur les défis de l'équilibre entre vie professionnelle et vie personnelle.</p>

        <h2>Ce que vous découvrirez</h2>
        <ul>
          <li>Les signes d'un déséquilibre vie pro/perso</li>
          <li>Stratégies pour établir des limites saines</li>
          <li>Témoignages de professionnels ayant retrouvé l'équilibre</li>
          <li>Outils pratiques pour gérer son temps efficacement</li>
          <li>L'importance de dire non et de protéger son énergie</li>
        </ul>

        <h2>Devenez membre pour accéder à ce contenu</h2>
        <p>En rejoignant le Cercle M.O.N.A, vous aurez accès à plus de 100 heures de contenu exclusif, incluant podcasts, vidéos et articles premium.</p>
      `
    },
    {
      id: "sommeil-sante-mentale",
      category: "articles",
      title: "Les bienfaits du sommeil sur la santé mentale",
      description: "Découvrez comment un sommeil de qualité peut transformer votre bien-être mental et émotionnel.",
      duration: "8 min de lecture",
      image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800",
      tags: ["Sommeil", "Santé mentale", "Routines"],
      author: "M.O.N.A",
      isFree: true,
      downloadable: true,
      content: `
        <h2>Le sommeil : pilier de la santé mentale</h2>
        <p>Le sommeil joue un rôle crucial dans notre santé mentale et notre bien-être émotionnel. Pendant que nous dormons, notre cerveau effectue des processus essentiels de réparation, de consolidation de la mémoire et de régulation émotionnelle.</p>

        <h2>L'impact du manque de sommeil</h2>
        <p>Un sommeil insuffisant ou de mauvaise qualité peut avoir des conséquences significatives sur notre santé mentale. Les études montrent que le manque de sommeil est associé à une augmentation des risques de dépression, d'anxiété et de troubles de l'humeur.</p>

        <h3>Effets à court terme</h3>
        <ul>
          <li>Irritabilité et sautes d'humeur</li>
          <li>Difficultés de concentration</li>
          <li>Augmentation du stress</li>
          <li>Diminution de la capacité de régulation émotionnelle</li>
        </ul>

        <h3>Effets à long terme</h3>
        <ul>
          <li>Risque accru de dépression</li>
          <li>Troubles anxieux</li>
          <li>Altération des fonctions cognitives</li>
          <li>Affaiblissement du système immunitaire</li>
        </ul>

        <h2>Les bienfaits d'un sommeil de qualité</h2>
        
        <h3>Régulation émotionnelle</h3>
        <p>Un sommeil suffisant améliore notre capacité à réguler nos émotions et à faire face aux situations stressantes avec plus de résilience.</p>

        <h3>Consolidation de la mémoire</h3>
        <p>Pendant le sommeil, particulièrement durant la phase REM, notre cerveau traite et consolide les informations et les expériences vécues durant la journée.</p>

        <h3>Détoxification cérébrale</h3>
        <p>Le système glymphatique, actif principalement durant le sommeil, élimine les déchets métaboliques du cerveau, incluant les protéines associées à la maladie d'Alzheimer.</p>

        <h2>Stratégies pour améliorer votre sommeil</h2>
        
        <h3>1. Établir une routine régulière</h3>
        <p>Couchez-vous et levez-vous à des heures régulières, même les week-ends, pour synchroniser votre horloge biologique.</p>

        <h3>2. Créer un environnement propice</h3>
        <p>Chambre sombre, fraîche (18-20°C), silencieuse. Investissez dans une literie confortable.</p>

        <h3>3. Limiter les écrans</h3>
        <p>Évitez les écrans au moins 1 heure avant le coucher. La lumière bleue inhibe la production de mélatonine, l'hormone du sommeil.</p>

        <h3>4. Rituels de relaxation</h3>
        <p>Lecture, méditation, étirements légers, tisane relaxante : trouvez ce qui vous apaise.</p>

        <h2>Conclusion</h2>
        <p>Investir dans la qualité de votre sommeil est l'une des meilleures décisions que vous puissiez prendre pour votre santé mentale. Commencez par de petits changements et observez l'impact positif sur votre bien-être général.</p>
      `
    },
    {
      id: "respiration-anti-stress",
      category: "videos",
      title: "Exercices de respiration anti-stress",
      description: "Apprenez 5 techniques de respiration simples et efficaces pour réduire le stress instantanément.",
      duration: "7 min",
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800",
      tags: ["Respiration", "Stress", "Techniques"],
      author: "M.O.N.A",
      isFree: false,
      downloadable: false,
      videoUrl: "https://www.youtube.com/embed/demo",
      content: `
        <h2>Contenu réservé aux membres</h2>
        <p>Cette vidéo exclusive est réservée aux membres du Cercle M.O.N.A. Apprenez 5 techniques de respiration scientifiquement validées pour gérer votre stress au quotidien.</p>

        <h2>Techniques présentées</h2>
        <ul>
          <li><strong>Respiration 4-7-8 :</strong> Pour l'apaisement instantané</li>
          <li><strong>Respiration carrée :</strong> Pour la concentration</li>
          <li><strong>Respiration alternée :</strong> Pour l'équilibre émotionnel</li>
          <li><strong>Respiration abdominale :</strong> Pour la détente profonde</li>
          <li><strong>Respiration énergisante :</strong> Pour retrouver sa vitalité</li>
        </ul>

        <h2>Devenez membre pour accéder à ce contenu</h2>
        <p>Rejoignez le Cercle M.O.N.A et bénéficiez de notre bibliothèque complète de vidéos guidées.</p>
      `
    },
    {
      id: "parentalite-consciente",
      category: "podcasts",
      title: "Parentalité consciente et bien-être",
      description: "Comment élever ses enfants tout en préservant sa santé mentale ? Conseils et témoignages.",
      duration: "42 min",
      image: "https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=800",
      tags: ["Parentalité", "Famille", "Bien-être"],
      author: "M.O.N.A",
      isFree: false,
      downloadable: false,
      audioUrl: "https://www.soundcloud.com/demo",
      content: `
        <h2>Contenu réservé aux membres</h2>
        <p>Ce podcast exclusif de 42 minutes explore les défis de la parentalité moderne et propose des stratégies concrètes pour préserver votre santé mentale tout en étant un parent présent et bienveillant.</p>

        <h2>Thèmes abordés</h2>
        <ul>
          <li>Gérer la culpabilité parentale</li>
          <li>Établir des limites saines</li>
          <li>Prendre soin de soi sans négliger ses enfants</li>
          <li>Communication non-violente en famille</li>
          <li>Témoignages inspirants de parents</li>
        </ul>

        <h2>Accédez à ce contenu premium</h2>
        <p>Rejoignez notre communauté de parents bienveillants dans le Cercle M.O.N.A.</p>
      `
    },
    {
      id: "prevenir-burnout",
      category: "articles",
      title: "Reconnaître et prévenir le burnout",
      description: "Les signes avant-coureurs du burnout professionnel et les stratégies de prévention efficaces.",
      duration: "12 min de lecture",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800",
      tags: ["Burnout", "Travail", "Prévention"],
      author: "M.O.N.A",
      isFree: true,
      downloadable: true,
      content: `
        <h2>Comprendre le burnout</h2>
        <p>Le burnout, ou syndrome d'épuisement professionnel, est reconnu par l'OMS comme un phénomène lié au travail. Il résulte d'un stress chronique au travail qui n'a pas été géré avec succès.</p>

        <h2>Les trois dimensions du burnout</h2>
        
        <h3>1. Épuisement émotionnel</h3>
        <p>Sentiment d'être vidé de ses ressources émotionnelles, fatigue chronique qui ne disparaît pas avec le repos.</p>

        <h3>2. Dépersonnalisation</h3>
        <p>Attitude cynique ou détachée envers son travail, perte d'empathie, relations impersonnelles avec collègues et clients.</p>

        <h3>3. Diminution de l'accomplissement personnel</h3>
        <p>Sentiment d'inefficacité, doute sur ses compétences, impression de ne plus rien accomplir de valable.</p>

        <h2>Les signes avant-coureurs</h2>
        
        <h3>Signes physiques</h3>
        <ul>
          <li>Fatigue persistante et troubles du sommeil</li>
          <li>Maux de tête fréquents</li>
          <li>Tensions musculaires, douleurs dorsales</li>
          <li>Troubles digestifs</li>
          <li>Affaiblissement du système immunitaire</li>
        </ul>

        <h3>Signes émotionnels</h3>
        <ul>
          <li>Irritabilité et sautes d'humeur</li>
          <li>Anxiété et inquiétudes excessives</li>
          <li>Sentiment de désespoir</li>
          <li>Perte de motivation</li>
          <li>Détachement émotionnel</li>
        </ul>

        <h3>Signes comportementaux</h3>
        <ul>
          <li>Procrastination et difficultés à se concentrer</li>
          <li>Isolement social</li>
          <li>Augmentation de la consommation de substances (café, alcool, tabac)</li>
          <li>Absentéisme ou présentéisme</li>
          <li>Diminution de la performance</li>
        </ul>

        <h2>Stratégies de prévention</h2>
        
        <h3>Au niveau individuel</h3>
        <p><strong>Établir des limites claires :</strong> Apprenez à dire non, fixez des horaires de travail raisonnables, déconnectez en dehors des heures de travail.</p>
        
        <p><strong>Pratiquer l'auto-soin :</strong> Activité physique régulière, sommeil suffisant, alimentation équilibrée, activités plaisantes.</p>
        
        <p><strong>Développer la résilience :</strong> Méditation, exercices de respiration, tenue d'un journal, thérapie si nécessaire.</p>

        <h3>Au niveau organisationnel</h3>
        <p>Communiquez avec votre hiérarchie sur votre charge de travail, clarifiez vos rôles et responsabilités, recherchez du soutien social au travail.</p>

        <h2>Quand demander de l'aide</h2>
        <p>Si vous reconnaissez plusieurs de ces signes chez vous, il est important de consulter un professionnel de santé mentale. Le burnout nécessite souvent un arrêt de travail et un accompagnement thérapeutique pour une récupération complète.</p>

        <h2>Conclusion</h2>
        <p>La prévention du burnout est essentielle. Soyez attentif aux signaux d'alerte et n'hésitez pas à demander de l'aide. Votre santé mentale est votre bien le plus précieux.</p>
      `
    },
    {
      id: "yoga-apaisement",
      category: "videos",
      title: "Yoga pour l'apaisement mental",
      description: "Séance de yoga douce spécialement conçue pour calmer l'esprit et réduire l'anxiété.",
      duration: "20 min",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800",
      tags: ["Yoga", "Apaisement", "Corps-esprit"],
      author: "M.O.N.A",
      isFree: false,
      downloadable: false,
      videoUrl: "https://www.youtube.com/embed/demo",
      content: `
        <h2>Contenu réservé aux membres</h2>
        <p>Cette session de yoga de 20 minutes est spécialement conçue pour apaiser votre esprit et réduire l'anxiété. Accessible à tous les niveaux.</p>

        <h2>Postures incluses</h2>
        <ul>
          <li>Posture de l'enfant (Balasana)</li>
          <li>Torsion douce allongée</li>
          <li>Posture du chat-vache</li>
          <li>Chien tête en bas (Adho Mukha Svanasana)</li>
          <li>Posture du cadavre (Savasana)</li>
        </ul>

        <h2>Bienfaits de cette pratique</h2>
        <ul>
          <li>Réduction du stress et de l'anxiété</li>
          <li>Amélioration de la qualité du sommeil</li>
          <li>Renforcement de la connexion corps-esprit</li>
          <li>Augmentation de la flexibilité</li>
          <li>Apaisement du système nerveux</li>
        </ul>

        <h2>Rejoignez le Cercle M.O.N.A</h2>
        <p>Accédez à plus de 50 vidéos de yoga et méditation guidées.</p>
      `
    },
    {
      id: "neuroscience-gratitude",
      category: "articles",
      title: "La neuroscience de la gratitude",
      description: "Comment la pratique de la gratitude transforme votre cerveau et améliore votre bien-être.",
      duration: "10 min de lecture",
      image: "https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800",
      tags: ["Neuroscience", "Gratitude", "Bonheur"],
      author: "M.O.N.A",
      isFree: false,
      downloadable: false,
      content: `
        <h2>Contenu réservé aux membres</h2>
        <p>Découvrez dans cet article exclusif comment la pratique régulière de la gratitude modifie littéralement la structure et le fonctionnement de votre cerveau.</p>

        <h2>Ce que vous apprendrez</h2>
        <ul>
          <li>Les changements neurobiologiques induits par la gratitude</li>
          <li>L'impact sur les neurotransmetteurs (dopamine, sérotonine)</li>
          <li>Les études scientifiques majeures</li>
          <li>Comment établir une pratique quotidienne de gratitude</li>
          <li>Les bénéfices à long terme sur la santé mentale</li>
        </ul>

        <h2>Accédez au contenu complet</h2>
        <p>Devenez membre du Cercle M.O.N.A pour lire l'article en entier et télécharger le guide pratique de la gratitude.</p>
      `
    }
  ];

  const resource = resources.find(r => r.id === id);

  if (!resource) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif text-anthracite mb-4">Ressource introuvable</h1>
          <Link to="/bibliotheque" className="text-terracotta hover:underline font-sans">
            Retour à la bibliothèque
          </Link>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    if (!resource.downloadable || !resource.isFree) return;
    
    setIsDownloading(true);
    
    // Générer un PDF réel avec jsPDF
    try {
      generateGuidePDF(resource.id, resource.title);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      // Fallback vers le téléchargement texte si PDF échoue
      const element = document.createElement('a');
      const content = `M.O.N.A - ${resource.title}\n\n${resource.description}\n\nCe document a été téléchargé depuis monafrica.net`;
      const file = new Blob([content], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${resource.id}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    
    setIsDownloading(false);
  };

  const isAccessible = resource.isFree;

  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 bg-gradient-to-b from-beige/20 to-background">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Back Button */}
            <Link
              to="/bibliotheque"
              className="inline-flex items-center gap-2 text-anthracite hover:text-terracotta transition-colors mb-8 font-sans"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour à la bibliothèque
            </Link>

            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="px-4 py-2 bg-beige/50 text-anthracite text-sm font-sans font-medium rounded-full uppercase tracking-wide">
                {resource.category === "articles" ? "Article" : resource.category === "videos" ? "Vidéo" : "Podcast"}
              </span>
              <div className={`px-4 py-2 text-sm font-sans font-bold rounded-full uppercase tracking-wide ${
                resource.isFree 
                  ? 'bg-gold text-white' 
                  : 'bg-anthracite text-white flex items-center gap-2'
              }`}>
                {resource.isFree ? 'GRATUIT' : (
                  <>
                    <Lock className="w-4 h-4" />
                    MEMBRES
                  </>
                )}
              </div>
              {resource.downloadable && resource.isFree && (
                <span className="px-4 py-2 bg-terracotta/10 text-terracotta text-sm font-sans font-medium rounded-full flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Téléchargeable
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-anthracite mb-4 leading-tight">
              {resource.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground font-sans mb-8">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{resource.duration}</span>
              </div>
              <span>Par {resource.author}</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {resource.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-beige/30 text-anthracite text-sm font-sans rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              {resource.downloadable && resource.isFree && (
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-2 px-6 py-3 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Download className="w-5 h-5" />
                  {isDownloading ? "Téléchargement..." : "Télécharger PDF"}
                </button>
              )}
              <button className="flex items-center gap-2 px-6 py-3 bg-beige/30 text-anthracite rounded-full hover:bg-beige/50 transition-all duration-200 font-sans font-semibold">
                <BookmarkPlus className="w-5 h-5" />
                Sauvegarder
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-beige/30 text-anthracite rounded-full hover:bg-beige/50 transition-all duration-200 font-sans font-semibold">
                <Share2 className="w-5 h-5" />
                Partager
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden shadow-xl"
          >
            <img
              src={resource.image}
              alt={resource.title}
              className="w-full h-[400px] object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isAccessible ? (
            // Locked Content
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-gradient-to-br from-anthracite to-anthracite/90 text-white rounded-2xl p-12 text-center"
            >
              <Lock className="w-16 h-16 mx-auto mb-6 text-gold" />
              <h2 className="text-3xl font-serif mb-4">Contenu réservé aux membres</h2>
              <p className="text-lg text-white/80 font-sans mb-8 leading-relaxed">
                Ce contenu exclusif est réservé aux membres du Cercle M.O.N.A. 
                Rejoignez notre communauté pour accéder à l'intégralité de notre bibliothèque premium.
              </p>
              <div className="prose prose-invert prose-lg mx-auto mb-8 text-left">
                <div dangerouslySetInnerHTML={{ __html: resource.content }} />
              </div>
              <Link
                to="/cercle"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gold text-anthracite rounded-full hover:bg-gold/90 transition-all duration-200 font-sans font-bold"
              >
                Devenir membre
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            </motion.div>
          ) : (
            // Accessible Content
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {/* Video Player for Videos */}
              {resource.category === "videos" && (
                <div className="mb-12 rounded-2xl overflow-hidden shadow-xl bg-anthracite aspect-video flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <Play className="w-16 h-16 mx-auto mb-4" />
                    <p className="font-sans">Lecteur vidéo (à implémenter avec votre système vidéo)</p>
                  </div>
                </div>
              )}

              {/* Audio Player for Podcasts */}
              {resource.category === "podcasts" && (
                <div className="mb-12 bg-beige/30 rounded-2xl p-8">
                  <div className="text-center">
                    <Headphones className="w-12 h-12 text-terracotta mx-auto mb-4" />
                    <p className="font-sans text-anthracite">Lecteur audio (à implémenter avec votre système audio)</p>
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <div 
                  dangerouslySetInnerHTML={{ __html: resource.content }}
                  className="font-sans text-anthracite leading-relaxed"
                  style={{
                    fontSize: '1.125rem',
                    lineHeight: '1.75rem'
                  }}
                />
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {isAccessible && (
        <section className="py-20 bg-gradient-to-b from-beige/20 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl sm:text-4xl font-serif text-anthracite mb-4">
                Vous avez aimé cette ressource ?
              </h2>
              <p className="text-lg text-muted-foreground font-sans mb-8">
                Découvrez des centaines d'autres contenus exclusifs en rejoignant le Cercle M.O.N.A
              </p>
              <Link
                to="/cercle"
                className="inline-flex items-center gap-2 px-8 py-4 bg-terracotta text-white rounded-full hover:bg-terracotta/90 transition-all duration-200 font-sans font-semibold shadow-lg"
              >
                Découvrir les avantages membres
                <ArrowLeft className="w-5 h-5 rotate-180" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      <FooterSection />
    </div>
  );
}