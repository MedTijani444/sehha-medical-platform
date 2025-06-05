import OpenAI from "openai";

// Configure for Groq (free tier available) as primary, DeepSeek as fallback
const groqClient = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
  apiKey: process.env.GROQ_API_KEY || "dummy_key"
});

const deepseekClient = new OpenAI({ 
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY || "dummy_key"
});

// Use Groq as primary (free tier), DeepSeek as secondary
const openai = groqClient;

// Comprehensive medical validation system for all symptom categories
function applyMedicalValidation(symptoms: string, aiResult: any): any {
  const normalizedSymptoms = symptoms.toLowerCase();
  
  // 1. CARDIAC SYMPTOMS (Highest Priority)
  const cardiacKeywords = [
    'douleur thoracique', 'mal poitrine', 'douleur poitrine', 'oppression thoracique',
    'palpitations', 'arythmie', 'tachycardie', 'bradycardie', 'dyspnee', 'dyspnée', 
    'essoufflement', 'difficulte respirer', 'difficulté à respirer', 'gêne respiratoire', 
    'souffle court', 'syncope', 'malaise cardiaque', 'œdèmes', 'fatigue cardiaque'
  ];
  
  if (cardiacKeywords.some(keyword => normalizedSymptoms.includes(keyword))) {
    return generateSpecialistRecommendation('Cardiologue', symptoms, 'high', [
      'ECG (électrocardiogramme)', 'échocardiographie', 'troponines', 'BNP/NT-proBNP', 
      'radiographie thoracique', 'test d\'effort si stable'
    ], 'cardiovasculaires');
  }
  
  // 2. NEUROLOGICAL SYMPTOMS
  const neurologicalKeywords = [
    'fourmillements', 'engourdissements', 'paresthésies', 'picotements', 'dysesthésies',
    'faiblesse musculaire', 'paralysie', 'déficit moteur', 'troubles marche', 'céphalées',
    'maux de tête', 'vertiges', 'étourdissements', 'troubles cognitifs', 'tremblements',
    'convulsions', 'épilepsie', 'troubles mémoire', 'troubles vision', 'diplopie'
  ];
  
  if (neurologicalKeywords.some(keyword => normalizedSymptoms.includes(keyword))) {
    return generateSpecialistRecommendation('Neurologue', symptoms, 'medium', [
      'IRM cérébrale', 'scanner cérébral', 'électromyographie (EMG)', 'électroencéphalogramme (EEG)',
      'ponction lombaire si nécessaire', 'doppler des vaisseaux du cou'
    ], 'neurologiques');
  }
  
  // 3. RESPIRATORY SYMPTOMS
  const respiratoryKeywords = [
    'toux chronique', 'toux persistante', 'expectorations', 'hémoptysie', 'sifflements',
    'wheezing', 'asthme', 'bronchite', 'pneumonie', 'pleurésie', 'douleur pleurale'
  ];
  
  if (respiratoryKeywords.some(keyword => normalizedSymptoms.includes(keyword))) {
    return generateSpecialistRecommendation('Pneumologue', symptoms, 'medium', [
      'radiographie thoracique', 'scanner thoracique', 'spirométrie', 'EFR (épreuves fonctionnelles respiratoires)',
      'gazométrie artérielle', 'test tuberculinique'
    ], 'respiratoires');
  }
  
  // 4. DIGESTIVE SYMPTOMS
  const digestiveKeywords = [
    'douleur abdominale', 'mal ventre', 'nausées', 'vomissements', 'diarrhée', 'constipation',
    'ballonnements', 'reflux gastrique', 'brûlures estomac', 'dysphagie', 'trouble transit',
    'sang dans selles', 'méléna', 'jaunisse', 'ictère'
  ];
  
  if (digestiveKeywords.some(keyword => normalizedSymptoms.includes(keyword))) {
    return generateSpecialistRecommendation('Gastro-entérologue', symptoms, 'medium', [
      'échographie abdominale', 'scanner abdominal', 'endoscopie digestive', 'coloscopie',
      'bilan hépatique complet', 'recherche H. pylori'
    ], 'digestifs');
  }
  
  // 5. PSYCHIATRIC/MENTAL HEALTH SYMPTOMS
  const psychiatricKeywords = [
    'dépression', 'anxiété', 'angoisse', 'stress', 'troubles humeur', 'tristesse',
    'idées noires', 'troubles sommeil', 'insomnie', 'cauchemars', 'troubles comportement',
    'panique', 'phobies', 'troubles alimentaires', 'burnout'
  ];
  
  if (psychiatricKeywords.some(keyword => normalizedSymptoms.includes(keyword))) {
    return generateSpecialistRecommendation('Psychiatre ou Psychologue', symptoms, 'medium', [
      'bilan psychologique', 'échelles d\'évaluation dépression/anxiété', 'bilan thyroïdien',
      'dosage vitamine B12', 'bilan nutritionnel si troubles alimentaires'
    ], 'psychiatriques');
  }
  
  // 6. RHEUMATOLOGICAL SYMPTOMS
  const rheumatologicalKeywords = [
    'douleurs articulaires', 'arthralgie', 'arthrite', 'raideur matinale', 'gonflements',
    'douleur dos', 'lombalgie', 'sciatique', 'rhumatismes', 'fibromyalgie'
  ];
  
  if (rheumatologicalKeywords.some(keyword => normalizedSymptoms.includes(keyword))) {
    return generateSpecialistRecommendation('Rhumatologue', symptoms, 'low', [
      'radiographies articulaires', 'échographie articulaire', 'IRM rachis/articulations',
      'bilan inflammatoire (VS, CRP)', 'facteur rhumatoïde', 'anti-CCP'
    ], 'rhumatologiques');
  }
  
  // 7. DERMATOLOGICAL SYMPTOMS (Enhanced for cancer detection)
  const dermatologicalKeywords = [
    'éruption cutanée', 'boutons', 'démangeaisons', 'prurit', 'eczéma', 'psoriasis',
    'urticaire', 'allergie cutanée', 'grain beauté', 'grain de beauté', 'lésion cutanée',
    'changé couleur', 'changé de couleur', 'changé taille', 'changé de taille',
    'bordures irrégulières', 'saignement', 'mélanome', 'tache brune', 'tache noire',
    'naevus', 'asymétrie', 'croissance rapide', 'texture changée', 'relief modifié'
  ];
  
  // Check for suspicious skin changes that require urgent attention
  const suspiciousKeywords = [
    'changé couleur', 'changé de couleur', 'changé taille', 'changé de taille',
    'bordures irrégulières', 'saignement grain', 'croissance rapide', 'asymétrie'
  ];
  
  const urgencyLevel = suspiciousKeywords.some(keyword => normalizedSymptoms.includes(keyword)) ? 'high' : 'medium';
  
  if (dermatologicalKeywords.some(keyword => normalizedSymptoms.includes(keyword))) {
    return generateSpecialistRecommendation('Dermatologue', symptoms, urgencyLevel, [
      'dermatoscopie numérique', 'biopsie cutanée si suspicion', 'cartographie des grains de beauté',
      'test allergologique si eczéma/urticaire', 'cultures bactériennes/mycologiques si infection'
    ], 'dermatologiques');
  }
  
  // 8. ENDOCRINE SYMPTOMS
  const endocrineKeywords = [
    'fatigue extrême', 'prise poids inexpliquée', 'perte poids', 'soif excessive',
    'polyurie', 'troubles thyroïde', 'diabète', 'hypoglycémie', 'bouffées chaleur'
  ];
  
  if (endocrineKeywords.some(keyword => normalizedSymptoms.includes(keyword))) {
    return generateSpecialistRecommendation('Endocrinologue', symptoms, 'medium', [
      'bilan thyroïdien complet (TSH, T3, T4)', 'glycémie à jeun', 'HbA1c',
      'bilan lipidique', 'cortisol', 'bilan hormonal complet'
    ], 'endocriniens');
  }
  
  // 9. GYNECOLOGICAL SYMPTOMS
  const gynecologicalKeywords = [
    'troubles menstruels', 'règles douloureuses', 'dysménorrhée', 'aménorrhée',
    'métrorragies', 'pertes vaginales', 'douleurs pelviennes', 'kyste ovarien',
    'endométriose', 'ménopause', 'contraception'
  ];
  
  if (gynecologicalKeywords.some(keyword => normalizedSymptoms.includes(keyword))) {
    return generateSpecialistRecommendation('Gynécologue', symptoms, 'medium', [
      'échographie pelvienne', 'frottis cervical', 'bilan hormonal',
      'dosage HCG si retard règles', 'hystérosalpingographie si nécessaire'
    ], 'gynécologiques');
  }
  
  // 10. UROLOGICAL SYMPTOMS
  const urologicalKeywords = [
    'troubles mictionnels', 'dysurie', 'pollakiurie', 'hématurie', 'incontinence',
    'infection urinaire', 'cystite', 'pyélonéphrite', 'calculs rénaux', 'prostate'
  ];
  
  if (urologicalKeywords.some(keyword => normalizedSymptoms.includes(keyword))) {
    return generateSpecialistRecommendation('Urologue', symptoms, 'medium', [
      'ECBU (examen cytobactériologique urinaire)', 'échographie rénale et vésicale',
      'créatininémie', 'PSA si homme >50 ans', 'UIV si calculs suspectés'
    ], 'urologiques');
  }
  
  // 11. OPHTHALMOLOGICAL SYMPTOMS
  const ophthalmologicalKeywords = [
    'troubles vision', 'vision floue', 'diplopie', 'photophobie', 'douleur oculaire',
    'yeux rouges', 'larmoiement', 'sécheresse oculaire', 'mouches volantes', 'cataracte'
  ];
  
  if (ophthalmologicalKeywords.some(keyword => normalizedSymptoms.includes(keyword))) {
    return generateSpecialistRecommendation('Ophtalmologue', symptoms, 'medium', [
      'fond d\'œil', 'tonométrie', 'réfraction', 'angiographie rétinienne si nécessaire',
      'OCT (tomographie par cohérence optique)'
    ], 'ophtalmologiques');
  }
  
  // 12. ENT SYMPTOMS
  const entKeywords = [
    'mal gorge', 'angine', 'otite', 'sinusite', 'rhinite', 'acouphènes',
    'surdité', 'vertiges oreille', 'anosmie', 'dysphagie', 'enrouement'
  ];
  
  if (entKeywords.some(keyword => normalizedSymptoms.includes(keyword))) {
    return generateSpecialistRecommendation('ORL (Oto-Rhino-Laryngologue)', symptoms, 'medium', [
      'otoscopie', 'rhinoscopie', 'audiométrie', 'scanner des sinus',
      'fibroscopie nasale', 'tympanométrie'
    ], 'ORL');
  }
  
  return aiResult;
}

// Helper function to generate standardized specialist recommendations
function generateSpecialistRecommendation(specialist: string, symptoms: string, urgencyLevel: string, examens: string[], symptomType: string): any {
  const urgencyText = urgencyLevel === 'urgent' ? 'URGENT' : urgencyLevel === 'high' ? 'PRIORITAIRE' : urgencyLevel === 'medium' ? 'À PRÉVOIR' : 'RECOMMANDÉ';
  
  // Create clean, professional medical analysis
  const cleanSymptoms = symptoms.substring(0, 150).trim();
  
  return {
    preDiagnosis: `Analyse médicale des symptômes ${symptomType}

Symptômes rapportés: ${cleanSymptoms}${symptoms.length > 150 ? '...' : ''}

Cette présentation clinique évoque des troubles ${symptomType} nécessitant une évaluation spécialisée. Les symptômes décrits correspondent à un tableau clinique qui justifie une consultation auprès d'un spécialiste pour établir un diagnostic précis et proposer une prise en charge adaptée.

L'analyse préliminaire oriente vers la nécessité d'examens complémentaires spécialisés pour confirmer ou infirmer les hypothèses diagnostiques et établir un plan thérapeutique approprié.

Cette évaluation constitue une aide à la préparation de votre consultation et ne remplace pas l'examen clinique médical.`,
    
    urgencyLevel,
    
    recommendations: `Consultation spécialisée recommandée

Spécialiste à consulter: ${specialist}
Délai de consultation: ${urgencyText}

Examens complémentaires suggérés:
${examens.map(examen => `• ${examen}`).join('\n')}

Plan de suivi:
• Préparation de la consultation avec ce rapport d'analyse
• Présentation des symptômes détaillés au spécialiste
• Suivi des recommandations médicales
• Surveillance de l'évolution des symptômes

Important: Cette analyse préliminaire facilite la préparation de votre consultation médicale. Seul un professionnel de santé peut établir un diagnostic définitif et prescrire un traitement adapté.`
  };
}

// Generate personalized reassurance message based on symptoms and anxiety level
function generateMessageSoutien(
  symptoms: string, 
  urgencyLevel: string,
  niveauAnxiete: "léger" | "modéré" | "élevé"
): string {
  const normalizedSymptoms = symptoms.toLowerCase();
  
  // Detect mental health symptoms for specialized reassurance
  const mentalHealthKeywords = ['anxiété', 'stress', 'dépression', 'tristesse', 'angoisse', 'panique', 'insomnie', 'fatigue mentale'];
  const isMentalHealth = mentalHealthKeywords.some(keyword => normalizedSymptoms.includes(keyword));
  
  // Detect pain/physical symptoms
  const physicalPainKeywords = ['douleur', 'mal', 'souffrance', 'gêne', 'inconfort'];
  const hasPhysicalPain = physicalPainKeywords.some(keyword => normalizedSymptoms.includes(keyword));
  
  if (urgencyLevel === 'urgent') {
    return `Votre santé est notre priorité. Je comprends que vos symptômes puissent être inquiétants en ce moment. Il est tout à fait normal de ressentir de l'anxiété face à une situation médicale urgente. Vous faites le bon choix en cherchant une aide médicale rapidement. Votre démarche proactive montre que vous prenez soin de votre santé. Les professionnels de santé sont là pour vous accompagner et vous aider à aller mieux. En cas d'urgence immédiate, n'hésitez pas à contacter le 141 ou à vous rendre aux urgences.`;
  }
  
  if (isMentalHealth) {
    switch (niveauAnxiete) {
      case 'élevé':
        return `💙 **Un pas courageux vers le mieux-être**

Je tiens à vous féliciter pour avoir pris le temps de parler de ce que vous ressentez. Exprimer ses difficultés émotionnelles demande du courage, et vous l'avez fait.

**Ce que vous vivez est réel et important.** Beaucoup de personnes traversent des moments similaires, et il existe des solutions et des accompagnements adaptés à votre situation.

**Vous méritez d'aller mieux.** Prendre soin de sa santé mentale est un acte de bienveillance envers soi-même. Les professionnels de la santé mentale sont formés pour vous écouter sans jugement et vous proposer des stratégies personnalisées.

*Rappel important : En cas de pensées suicidaires, contactez immédiatement SOS Amitié Maroc au 141 ou rendez-vous aux urgences psychiatriques.*`;
        
      case 'modéré':
        return `🌱 **Prendre soin de soi, c'est important**

Vous avez fait un excellent choix en prenant le temps d'analyser ce que vous ressentez. Reconnaître ses difficultés est déjà un grand pas vers l'amélioration.

**Vos sentiments sont légitimes.** Il est normal de traverser des périodes plus difficiles, et chercher de l'aide montre votre force, pas votre faiblesse.

**Des solutions existent.** Qu'il s'agisse de techniques de gestion du stress, d'un accompagnement psychologique ou simplement d'une oreille attentive, vous pouvez retrouver un équilibre.

Prenez le temps qu'il vous faut, et n'hésitez pas à vous entourer de personnes bienveillantes.`;
        
      default:
        return `☀️ **Félicitations pour cette démarche de bien-être**

Prendre un moment pour faire le point sur son état émotionnel est une excellente habitude. Cela montre que vous vous écoutez et que vous prenez soin de vous.

**Vous êtes sur la bonne voie.** Même les petites gênes méritent attention, et il est sage de ne pas les ignorer.

**Continuez à vous écouter** et n'hésitez pas à chercher du soutien si vous en ressentez le besoin. Prendre soin de sa santé mentale, c'est prendre soin de sa santé globale.`;
    }
  }
  
  if (hasPhysicalPain) {
    switch (niveauAnxiete) {
      case 'élevé':
        return `🤗 **Vous n'êtes pas seul(e) face à la douleur**

Je comprends que vivre avec des douleurs puisse être épuisant et anxiogène. Votre démarche pour comprendre vos symptômes montre votre détermination à aller mieux.

**Votre douleur est réelle et mérite attention.** Il est normal de se sentir inquiet(e) quand notre corps nous envoie des signaux, et vous avez raison de les prendre au sérieux.

**Des solutions existent pour vous soulager.** Les professionnels de santé disposent de nombreux outils pour diagnostiquer et traiter efficacement la plupart des conditions douloureuses.

**Gardez espoir** - beaucoup de personnes dans votre situation ont trouvé des solutions adaptées et retrouvé leur qualité de vie.`;
        
      case 'modéré':
        return `💚 **Prendre soin de son corps, c'est essentiel**

Vous faites preuve de sagesse en écoutant votre corps et en cherchant à comprendre vos symptômes. Cette attention que vous vous portez est précieuse.

**Vos symptômes méritent d'être pris au sérieux.** Il est important de ne pas minimiser ce que vous ressentez, même si cela peut paraître bénin.

**Vous êtes entre de bonnes mains.** Les professionnels de santé sont là pour vous accompagner et trouver les meilleures solutions pour votre situation.

Continuez à prendre soin de vous avec cette même attention bienveillante.`;
        
      default:
        return `🌟 **Excellente initiative de prévention**

Félicitations pour votre approche proactive de votre santé ! Prendre le temps d'analyser ses symptômes et chercher des conseils adaptés est une démarche très responsable.

**Vous prenez les bonnes décisions.** Même pour des symptômes qui semblent mineurs, il est intelligent de s'informer et de consulter si nécessaire.

**Votre bien-être compte.** Continuer à être à l'écoute de votre corps vous aidera à maintenir une bonne santé sur le long terme.

Vous êtes sur la bonne voie pour prendre soin de vous de manière optimale.`;
    }
  }
  
  // General reassurance for other symptoms
  switch (niveauAnxiete) {
    case 'élevé':
      return `🌈 **Vous avez fait le bon choix en cherchant des réponses**

Je comprends que l'incertitude face à des symptômes puisse générer beaucoup d'anxiété. Votre démarche pour obtenir des informations fiables est très sage.

**Vos préoccupations sont légitimes.** Il est tout à fait normal de vouloir comprendre ce qui se passe dans son corps et de chercher des réponses professionnelles.

**Vous n'êtes pas seul(e) dans cette démarche.** De nombreuses personnes vivent des situations similaires, et les professionnels de santé sont formés pour vous accompagner avec bienveillance.

**Gardez confiance** - la plupart des conditions médicales ont des solutions, et vous prenez déjà les bonnes mesures pour aller mieux.`;
      
    case 'modéré':
      return `✨ **Bravo pour cette démarche de santé responsable**

Vous montrez une excellente conscience de votre bien-être en prenant le temps d'analyser vos symptômes et de chercher des conseils appropriés.

**Votre approche est exemplaire.** Être attentif(ve) à son corps et ne pas ignorer les signaux qu'il nous envoie est une forme de respect envers soi-même.

**Vous êtes sur la bonne voie.** Les professionnels de santé apprécient toujours les patients qui arrivent préparés et informés.

Continuez à prendre soin de vous avec cette même attention bienveillante.`;
      
    default:
      return `🌺 **Félicitations pour votre approche préventive**

Votre démarche de prendre soin de votre santé de manière proactive est admirable. Cela montre votre maturité et votre responsabilité envers votre bien-être.

**Vous faites les bons choix.** Même pour des symptômes qui semblent bénins, il est intelligent de s'informer et de rester vigilant(e).

**Votre santé vous remercie.** Cette attention que vous portez à votre corps vous aidera à maintenir une excellente qualité de vie.

Continuez sur cette voie positive de prévention et de bienveillance envers vous-même.`;
  }
}

// Determine anxiety level based on symptoms and context
function determineNiveauAnxiete(symptoms: string, urgencyLevel: string): "léger" | "modéré" | "élevé" {
  const normalizedSymptoms = symptoms.toLowerCase();
  
  // High anxiety indicators
  const highAnxietyKeywords = ['angoisse', 'panique', 'terrifiant', 'très inquiet', 'très anxieux', 'insupportable', 'horrible'];
  
  // Mental health symptoms that often correlate with higher anxiety
  const mentalHealthKeywords = ['dépression', 'stress intense', 'burnout', 'pensées noires', 'insomnie sévère'];
  
  // Pain and severe symptoms that increase anxiety
  const severeSymptoms = ['douleur intense', 'très douloureux', 'atroce', 'insupportable', 'paralysant'];
  
  if (urgencyLevel === 'urgent' || 
      highAnxietyKeywords.some(keyword => normalizedSymptoms.includes(keyword)) ||
      severeSymptoms.some(keyword => normalizedSymptoms.includes(keyword))) {
    return 'élevé';
  }
  
  if (urgencyLevel === 'high' || 
      mentalHealthKeywords.some(keyword => normalizedSymptoms.includes(keyword)) ||
      normalizedSymptoms.includes('inquiet') || 
      normalizedSymptoms.includes('anxieux') ||
      normalizedSymptoms.includes('stressé')) {
    return 'modéré';
  }
  
  return 'léger';
}

export interface MedicalAnalysis {
  preDiagnosis: string;
  urgencyLevel: "low" | "medium" | "high" | "urgent";
  recommendations: string;
  niveauAnxiete: "léger" | "modéré" | "élevé";
  messageSoutien: string;
  followUpQuestions?: string[];
}

// Check if any API key is available
function isAPIAvailable(): boolean {
  const groqKey = process.env.GROQ_API_KEY;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY || process.env.OPENAI_KEY;
  
  return !!(
    (groqKey && groqKey !== "dummy_key" && groqKey.length > 10) ||
    (deepseekKey && deepseekKey !== "dummy_key" && deepseekKey.length > 10) ||
    (openaiKey && openaiKey !== "dummy_key" && openaiKey.length > 10)
  );
}

// Professional fallback analysis when API is not available
function generateFallbackAnalysis(
  symptoms: string,
  medicalHistory: string,
  age?: number,
  gender?: string,
  medications?: string,
  allergies?: string
): MedicalAnalysis {
  // Use the same comprehensive validation system
  const dummyResult = { urgencyLevel: "medium", preDiagnosis: "", recommendations: "" };
  const validatedResult = applyMedicalValidation(symptoms, dummyResult);
  
  // If validation found a specific specialty, use it
  if (validatedResult.preDiagnosis && validatedResult.recommendations) {
    const niveauAnxiete = determineNiveauAnxiete(symptoms, validatedResult.urgencyLevel);
    const messageSoutien = generateMessageSoutien(symptoms, validatedResult.urgencyLevel, niveauAnxiete);
    
    return {
      preDiagnosis: validatedResult.preDiagnosis,
      urgencyLevel: validatedResult.urgencyLevel,
      niveauAnxiete,
      messageSoutien,
      recommendations: validatedResult.recommendations,
      followUpQuestions: [
        "Depuis quand ressentez-vous ces symptômes exactement ?",
        "Avez-vous remarqué des facteurs qui aggravent ou améliorent vos symptômes ?",
        "Avez-vous des antécédents familiaux de conditions similaires ?"
      ]
    };
  }
  
  // Generic fallback for unrecognized symptoms
  const symptomsLower = symptoms.toLowerCase();
  let urgencyLevel: "low" | "medium" | "high" | "urgent" = "medium";
  let specialistRecommendation = "Médecin généraliste";
  
  // Urgency assessment
  const urgentKeywords = ["douleur thoracique", "difficulté respirer", "perte conscience", "saignement important", "convulsion"];
  const highKeywords = ["fièvre élevée", "douleur intense", "vomissement persistant", "vertiges sévères"];
  
  if (urgentKeywords.some(keyword => symptomsLower.includes(keyword))) {
    urgencyLevel = "urgent";
  } else if (highKeywords.some(keyword => symptomsLower.includes(keyword))) {
    urgencyLevel = "high";
  }

  // Determine urgency description
  let urgencyDescription = 'des symptômes à surveiller et à discuter avec votre médecin';
  if (urgencyLevel === 'urgent') {
    urgencyDescription = 'une situation qui requiert une attention médicale immédiate';
  } else if (urgencyLevel === 'high') {
    urgencyDescription = 'des symptômes qui méritent une consultation rapide';
  } else if (urgencyLevel === 'medium') {
    urgencyDescription = 'des symptômes qui justifient une consultation médicale';
  }

  // Determine consultation timing based on specialist recommendation
  let consultationTiming = "Surveillance et consultation si aggravation - Surveillez l'évolution et consultez si les symptômes persistent ou s'aggravent";
  const iseMentalHealth = specialistRecommendation.includes("Psychiatre") || specialistRecommendation.includes("Psychologue");
  
  if (urgencyLevel === 'urgent') {
    consultationTiming = iseMentalHealth ? 
      "Consultation urgente requise - Contactez immédiatement un service d'urgence psychiatrique ou appelez SOS Amitié Maroc (141)" :
      "Consultation urgente requise - Contactez immédiatement votre médecin ou rendez-vous aux urgences";
  } else if (urgencyLevel === 'high') {
    consultationTiming = iseMentalHealth ?
      "Consultation recommandée sous 24-48h - Prenez rendez-vous avec un psychiatre ou psychologue rapidement" :
      "Consultation recommandée sous 24-48h - Prenez rendez-vous avec votre médecin généraliste rapidement";
  } else if (urgencyLevel === 'medium') {
    consultationTiming = iseMentalHealth ?
      "Consultation dans les prochains jours - Planifiez un rendez-vous avec un psychiatre ou psychologue" :
      "Consultation dans les prochains jours - Planifiez un rendez-vous avec votre médecin généraliste";
  } else {
    consultationTiming = iseMentalHealth ?
      "Surveillance et consultation si aggravation - Consultez un psychiatre ou psychologue si les symptômes persistent" :
      consultationTiming;
  }

  // Determine anxiety level and generate personalized support message
  const niveauAnxiete = determineNiveauAnxiete(symptoms, urgencyLevel);
  const messageSoutien = generateMessageSoutien(symptoms, urgencyLevel, niveauAnxiete);

  return {
    preDiagnosis: `Analyse des symptômes rapportés : ${symptoms.substring(0, 100)}${symptoms.length > 100 ? '...' : ''}

Pré-diagnostic basé sur l'analyse structurée :
Vos symptômes nécessitent une évaluation médicale professionnelle pour établir un diagnostic précis. Les informations que vous avez fournies indiquent ${urgencyDescription}.

Important : Cette analyse est générée automatiquement et ne remplace en aucun cas l'avis d'un professionnel de santé qualifié. Consultez toujours un médecin pour un diagnostic et un traitement appropriés.`,

    urgencyLevel,
    niveauAnxiete,
    messageSoutien,

    recommendations: `Recommandations personnalisées :

${consultationTiming}

Spécialiste suggéré : ${specialistRecommendation}

Ce rapport vous aidera à :
- Structurer la présentation de vos symptômes à votre médecin
- Préparer les questions pertinentes pour votre consultation
- Documenter l'évolution de votre état de santé`,

    followUpQuestions: [
      "Depuis quand ressentez-vous ces symptômes exactement ?",
      "Avez-vous remarqué des facteurs qui aggravent ou améliorent vos symptômes ?",
      "Avez-vous déjà eu des symptômes similaires par le passé ?",
      "Prenez-vous actuellement des médicaments qui pourraient être liés ?",
      "Y a-t-il des antécédents familiaux de conditions similaires ?"
    ]
  };
}

// Mental health chat function for conversational therapy
export async function generateMentalHealthResponse(
  message: string,
  conversationHistory: { content: string; isUser: boolean }[] = [],
  mood?: string
): Promise<string> {
  console.log("Mental health API call starting...");

  if (!isAPIAvailable()) {
    console.log("No API available for mental health chat");
    return "";
  }

  try {
    const systemPrompt = `Tu es un psychologue bienveillant et empathique qui mène une conversation de soutien en français. Tu dois:
- Avoir une conversation naturelle et chaleureuse
- Écouter activement et valider les émotions
- Poser des questions ouvertes pour encourager l'expression
- Utiliser des techniques de thérapie conversationnelle
- Offrir de la compréhension et de l'empathie
- Aider la personne à explorer ses sentiments
- Éviter de donner des diagnostics ou recommandations médicales
- Garder un ton conversationnel et humain
- Répondre comme si tu étais en séance avec un patient

IMPORTANT: Ne donne jamais de recommandations médicales, d'examens ou de traitements. Reste dans le rôle d'un psychologue qui écoute et soutient émotionnellement.

Humeur actuelle du patient: ${mood || 'non spécifiée'}`;

    const messages: any[] = [
      { role: "system", content: systemPrompt }
    ];

    // Add conversation history
    conversationHistory.slice(-4).forEach(msg => {
      messages.push({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content
      });
    });

    // Add current message
    messages.push({
      role: "user",
      content: message
    });

    console.log("Making mental health API call to GROQ...");
    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      max_tokens: 200,
      temperature: 0.8,
    });

    const aiResponse = response.choices[0]?.message?.content || "";
    console.log("Mental health API response received:", aiResponse.substring(0, 100));
    return aiResponse;

  } catch (error) {
    console.error("Mental health API error:", error);
    return "";
  }
}

export async function analyzeSymptoms(
  symptoms: string,
  medicalHistory: string,
  age?: number,
  gender?: string,
  medications?: string,
  allergies?: string
): Promise<MedicalAnalysis> {
  
  // FIRST: Apply comprehensive medical validation to ensure correct routing
  console.log("Analyzing current symptoms:", symptoms.substring(0, 100));
  
  // Apply medical validation FIRST to ensure proper specialist routing
  const dummyResult = { urgencyLevel: "medium", preDiagnosis: "", recommendations: "" };
  const validatedResult = applyMedicalValidation(symptoms, dummyResult);
  
  // If validation found a specific specialty, return immediately with correct routing
  if (validatedResult.preDiagnosis && validatedResult.recommendations) {
    console.log("Medical validation detected specialty routing");
    const niveauAnxiete = determineNiveauAnxiete(symptoms, validatedResult.urgencyLevel);
    const messageSoutien = generateMessageSoutien(symptoms, validatedResult.urgencyLevel, niveauAnxiete);
    
    return {
      preDiagnosis: validatedResult.preDiagnosis,
      urgencyLevel: validatedResult.urgencyLevel,
      niveauAnxiete,
      messageSoutien,
      recommendations: validatedResult.recommendations,
      followUpQuestions: [
        "Depuis quand ressentez-vous ces symptômes exactement ?",
        "Avez-vous remarqué des facteurs qui aggravent ou améliorent vos symptômes ?",
        "Avez-vous des antécédents familiaux de conditions similaires ?"
      ]
    };
  }

  const userProfile = `
    Age: ${age || "Non spécifié"}
    Genre: ${gender || "Non spécifié"}
    Médicaments actuels: ${medications || "Aucun"}
    Allergies: ${allergies || "Aucune"}
    Historique médical: ${medicalHistory || "Aucun"}
  `;

  // Enhanced prompt that focuses ONLY on current symptoms
  const prompt = `ANALYSE MÉDICALE IMMÉDIATE - SYMPTÔMES ACTUELS UNIQUEMENT

PATIENT:
${userProfile}

SYMPTÔMES À ANALYSER MAINTENANT:
"${symptoms}"

RÈGLES D'ORIENTATION MÉDICALE STRICTES:

1. CARDIOLOGIE (URGENT):
- Douleur thoracique + essoufflement + sueurs
- Palpitations + douleur poitrine
- Oppression thoracique + irradiation bras

2. DERMATOLOGIE (MEDIUM/HIGH):
- Grain de beauté changé couleur/taille
- Lésion cutanée évolutive
- Éruption avec saignement

3. GASTROENTÉROLOGIE (MEDIUM/HIGH):
- Sang dans selles + douleur abdominale
- Changement transit + perte poids

4. PNEUMOLOGIE (MEDIUM/HIGH):
- Toux persistante + sang
- Essoufflement + douleur pleurale

5. ONCOLOGIE/MÉDECINE INTERNE (HIGH):
- Perte poids inexpliquée + fatigue + ganglions
- Symptômes multiples évocateurs

ANALYSE REQUISE:
1. Analyser UNIQUEMENT les symptômes actuels: "${symptoms}"
2. Identifier le système organique principal concerné
3. Déterminer l'urgence selon la gravité
4. Recommander le spécialiste approprié

FORMAT RÉPONSE:
- Système concerné: [identifier d'après les symptômes actuels]
- Spécialiste: [cardiologue/dermatologue/gastro-entérologue/etc.]
- Urgence: [low/medium/high/urgent]
- Diagnostic probable: [basé sur symptômes actuels]

IMPORTANT: Analyser SEULEMENT "${symptoms}" - ignorer tout autre historique.

ORIENTATION SPÉCIALISÉE EXPERTE - RÈGLES STRICTES:
- Symptômes cardiovasculaires PRIORITAIRES (douleur thoracique, mal poitrine, oppression thoracique, tachycardie, palpitations, arythmie, dyspnée avec douleur thoracique, œdèmes, syncope) → "Cardiologue" (URGENT)
- Syndrome cardiaque (douleur poitrine + tachycardie + dyspnée) → "Cardiologue" (URGENT ABSOLU)
- Symptômes neurologiques (fourmillements, engourdissements, paresthésies, céphalées, vertiges, déficits moteurs, troubles cognitifs, faiblesse musculaire, tremblements, troubles de la coordination, troubles de la marche, dysesthésies, neuropathies) → "Neurologue" 
- Symptômes respiratoires ISOLÉS (toux chronique, dyspnée SANS douleur thoracique, douleur thoracique pleurale, hémoptysie) → "Pneumologue"
- Symptômes digestifs (douleurs abdominales, troubles transit, nausées persistantes, vomissements, dysphagie) → "Gastro-entérologue"
- Symptômes endocriniens (fatigue chronique avec troubles métaboliques, troubles poids, soif excessive, polyurie) → "Endocrinologue"
- Symptômes psychiatriques (troubles humeur, anxiété, dépression, troubles sommeil, troubles comportementaux) → "Psychiatre ou Psychologue"
- Symptômes rhumatologiques (douleurs articulaires, raideurs matinales, gonflements articulaires) → "Rhumatologue"
- Symptômes dermatologiques (lésions cutanées, éruptions, prurit généralisé) → "Dermatologue"
- Symptômes gynécologiques (troubles menstruels, douleurs pelviennes) → "Gynécologue"
- Symptômes urologiques (troubles mictionnels, douleurs lombaires) → "Urologue"
- Pathologie générale sans orientation spécifique → "Médecin généraliste"

PRIORITÉ ABSOLUE: 
- Tout symptôme de douleur thoracique, tachycardie, palpitations, dyspnée doit OBLIGATOIREMENT orienter vers "Cardiologue"
- Syndrome cardiaque (douleur poitrine + tachycardie + dyspnée) = "Cardiologue" URGENCE ABSOLUE
- Tout symptôme de fourmillements, engourdissements, paresthésies, dysesthésies, faiblesse musculaire doit OBLIGATOIREMENT orienter vers "Neurologue"

INTERDICTION ABSOLUE: Ne JAMAIS recommander "Neurologue" pour des symptômes cardiaques (douleur thoracique, tachycardie, dyspnée)

RÉPONDRE EN FRANÇAIS MÉDICAL PROFESSIONNEL - FORMAT TEXTE LISIBLE:

ANALYSE MÉDICALE STRUCTURÉE:

1. HYPOTHÈSES DIAGNOSTIQUES:
- Diagnostic principal probable avec justification clinique
- Diagnostics différentiels à considérer  
- Arguments pour et contre chaque hypothèse

2. ÉVALUATION DE L'URGENCE:
- Niveau: [urgent/high/medium/low]
- Justification clinique
- Signes d'alarme présents ou absents

3. ORIENTATION SPÉCIALISÉE:
- Spécialiste recommandé: [selon symptômes actuels]
- Justification de l'orientation
- Délai de consultation suggéré

4. PLAN DE SOINS:
- Examens complémentaires prioritaires
- Mesures symptomatiques immédiates
- Surveillance recommandée

IMPORTANT: Analyse préliminaire d'aide à la consultation - diagnostic médical requis.`;

  // Check if API is available, otherwise use fallback
  const apiAvailable = isAPIAvailable();
  console.log("API availability check:", apiAvailable);
  console.log("GROQ_API_KEY exists:", !!process.env.GROQ_API_KEY);
  console.log("GROQ_API_KEY length:", process.env.GROQ_API_KEY?.length || 0);
  
  if (!apiAvailable) {
    console.log("API not available, using structured fallback analysis");
    return generateFallbackAnalysis(symptoms, medicalHistory, age, gender, medications, allergies);
  }

  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "Tu es un médecin expert spécialisé en médecine interne et diagnostic différentiel avec expertise particulière en neurologie. Tu DOIS respecter strictement les règles d'orientation spécialisée. RÈGLE ABSOLUE: Fourmillements, engourdissements, paresthésies = NEUROLOGUE obligatoirement. Réponds UNIQUEMENT en JSON valide français avec orientations précises."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 1500
    });

    const aiResponse = response.choices[0].message.content || "";
    
    // Parse the structured response to extract key information
    const lines = aiResponse.split('\n').filter(line => line.trim());
    
    let specialist = "Médecin généraliste";
    let urgencyLevel: "low" | "medium" | "high" | "urgent" = "medium";
    let diagnosis = aiResponse;
    
    // Extract specialist recommendation
    for (const line of lines) {
      const lower = line.toLowerCase();
      if (lower.includes('cardiologue')) specialist = "Cardiologue";
      else if (lower.includes('neurologue')) specialist = "Neurologue";
      else if (lower.includes('gynécologue')) specialist = "Gynécologue";
      else if (lower.includes('dermatologue')) specialist = "Dermatologue";
      else if (lower.includes('gastro-entérologue')) specialist = "Gastro-entérologue";
      else if (lower.includes('pneumologue')) specialist = "Pneumologue";
      else if (lower.includes('endocrinologue')) specialist = "Endocrinologue";
      else if (lower.includes('psychiatre')) specialist = "Psychiatre";
      else if (lower.includes('rhumatologue')) specialist = "Rhumatologue";
      else if (lower.includes('urologue')) specialist = "Urologue";
      else if (lower.includes('orl')) specialist = "ORL";
      else if (lower.includes('ophtalmologue')) specialist = "Ophtalmologue";
      
      // Extract urgency level
      if (lower.includes('urgent')) urgencyLevel = "urgent" as const;
      else if (lower.includes('prioritaire') || lower.includes('high')) urgencyLevel = "high" as const;
      else if (lower.includes('modéré') || lower.includes('medium')) urgencyLevel = "medium" as const;
      else if (lower.includes('faible') || lower.includes('low')) urgencyLevel = "low" as const;
    }
    
    // Apply medical validation as final check
    const validatedResult = applyMedicalValidation(symptoms, { urgencyLevel, specialist });
    
    if (validatedResult.preDiagnosis && validatedResult.recommendations) {
      const niveauAnxiete = determineNiveauAnxiete(symptoms, validatedResult.urgencyLevel);
      const messageSoutien = generateMessageSoutien(symptoms, validatedResult.urgencyLevel, niveauAnxiete);
      
      return {
        preDiagnosis: validatedResult.preDiagnosis,
        urgencyLevel: validatedResult.urgencyLevel,
        niveauAnxiete,
        messageSoutien,
        recommendations: validatedResult.recommendations,
        followUpQuestions: [
          "Depuis quand ressentez-vous ces symptômes exactement ?",
          "Avez-vous remarqué des facteurs qui aggravent ou améliorent vos symptômes ?",
          "Avez-vous des antécédents familiaux de conditions similaires ?"
        ]
      };
    }
    
    // Format clean recommendations
    const formattedRecommendations = `Consultation spécialisée recommandée

Spécialiste à consulter: ${specialist}
Évaluation: Analyse des symptômes rapportés nécessitant une expertise médicale

Plan de consultation:
• Préparation avec historique détaillé des symptômes
• Examen clinique spécialisé
• Examens complémentaires selon indication médicale
• Plan de traitement adapté

Cette analyse préliminaire facilite votre préparation à la consultation médicale.`;
    
    const niveauAnxiete = determineNiveauAnxiete(symptoms, urgencyLevel);
    const messageSoutien = generateMessageSoutien(symptoms, urgencyLevel, niveauAnxiete);

    return {
      preDiagnosis: diagnosis,
      urgencyLevel,
      niveauAnxiete,
      messageSoutien,
      recommendations: formattedRecommendations,
      followUpQuestions: [
        "Depuis quand ressentez-vous ces symptômes exactement ?",
        "Avez-vous remarqué des facteurs qui aggravent ou améliorent vos symptômes ?",
        "Avez-vous des antécédents familiaux de conditions similaires ?"
      ]
    };
  } catch (error) {
    console.error("API Error:", error);
    // Fallback to structured analysis if API fails
    console.log("Falling back to structured analysis due to API error");
    return generateFallbackAnalysis(symptoms, medicalHistory, age, gender, medications, allergies);
  }
}

export async function generateFollowUpResponse(
  question: string,
  patientResponse: string,
  context: {
    symptoms: string;
    medicalHistory: string;
    previousMessages: any[];
    userProfile: any;
  }
): Promise<{
  response: string;
  nextQuestions?: string[];
  readyForDiagnosis?: boolean;
}> {
  const conversationHistory = context.previousMessages
    .map(msg => `${msg.role}: ${msg.content}`)
    .join("\n");

  const prompt = `
    Vous continuez une consultation médicale IA. Voici le contexte:

    PROFIL DU PATIENT:
    ${JSON.stringify(context.userProfile, null, 2)}

    SYMPTÔMES INITIAUX:
    ${context.symptoms}

    HISTORIQUE DE LA CONVERSATION:
    ${conversationHistory}

    DERNIÈRE QUESTION POSÉE:
    ${question}

    RÉPONSE DU PATIENT:
    ${patientResponse}

    Fournissez une réponse JSON avec:
    - response: Votre réponse empathique et professionnelle à la réponse du patient, TOUJOURS terminer par une question de suivi pertinente
    - nextQuestions: Array de 2-3 questions de suivi spécifiques au contexte médical
    - readyForDiagnosis: boolean indiquant si vous avez assez d'informations pour un pré-diagnostic

    IMPORTANT: Vous devez TOUJOURS poser des questions de suivi pour approfondir les symptômes, leur évolution, les facteurs déclenchants, l'historique médical, etc. Soyez comme un médecin qui interroge son patient de manière méthodique.
  `;

  // Check if API is available, otherwise use structured response
  if (!isAPIAvailable()) {
    console.log("API not available, using structured follow-up response");
    return {
      response: `Merci pour votre réponse. Ces informations complémentaires nous aident à mieux comprendre votre situation médicale. 

Basé sur votre échange, il semble important de documenter ces éléments pour votre consultation médicale prochaine.`,
      nextQuestions: [
        "Y a-t-il d'autres symptômes associés que vous n'avez pas mentionnés ?",
        "Comment ces symptômes affectent-ils votre quotidien ?",
        "Avez-vous des questions spécifiques à poser à votre médecin ?"
      ],
      readyForDiagnosis: context.previousMessages.length >= 2
    };
  }

  try {
    const response = await openai.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "Vous êtes un assistant médical IA bienveillant qui mène des consultations structurées pour aider les patients."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      temperature: 0.4
    });

    const result = JSON.parse(response.choices[0].message.content || "{}");
    
    return {
      response: result.response || "Merci pour votre réponse.",
      nextQuestions: result.nextQuestions,
      readyForDiagnosis: result.readyForDiagnosis || false
    };
  } catch (error) {
    console.error("API Follow-up Error:", error);
    // Fallback to structured response
    console.log("Falling back to structured follow-up response due to API error");
    return {
      response: `Merci pour votre réponse. Ces informations complémentaires nous aident à mieux comprendre votre situation médicale. 

Basé sur votre échange, il semble important de documenter ces éléments pour votre consultation médicale prochaine.`,
      nextQuestions: [
        "Y a-t-il d'autres symptômes associés que vous n'avez pas mentionnés ?",
        "Comment ces symptômes affectent-ils votre quotidien ?",
        "Avez-vous des questions spécifiques à poser à votre médecin ?"
      ],
      readyForDiagnosis: context.previousMessages.length >= 2
    };
  }
}
