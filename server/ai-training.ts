import { groqClient } from "./openai";

// Medical knowledge base for training validation
interface MedicalRule {
  symptoms: string[];
  mandatorySpecialist: string;
  urgencyLevel: "low" | "medium" | "high" | "urgent";
  differentialDiagnosis: string[];
  redFlags: string[];
}

// Comprehensive medical training rules
const medicalTrainingRules: MedicalRule[] = [
  {
    symptoms: ["fourmillements", "engourdissements", "paresthésies", "picotements", "dysesthésies"],
    mandatorySpecialist: "Neurologue",
    urgencyLevel: "medium",
    differentialDiagnosis: ["Neuropathie périphérique", "Syndrome du canal carpien", "Radiculopathie", "Sclérose en plaques"],
    redFlags: ["déficit moteur", "troubles sphinctériens", "céphalées brutales"]
  },
  {
    symptoms: ["faiblesse musculaire", "paralysie", "déficit moteur", "troubles de la marche"],
    mandatorySpecialist: "Neurologue",
    urgencyLevel: "high",
    differentialDiagnosis: ["AVC", "Myasthénie", "Syndrome de Guillain-Barré", "Myopathie"],
    redFlags: ["installation brutale", "troubles de la déglutition", "troubles respiratoires"]
  },
  {
    symptoms: ["douleur thoracique", "oppression thoracique", "serrement"],
    mandatorySpecialist: "Cardiologue",
    urgencyLevel: "urgent",
    differentialDiagnosis: ["Infarctus du myocarde", "Angor", "Péricardite", "Embolie pulmonaire"],
    redFlags: ["irradiation bras gauche", "sueurs", "dyspnée", "syncope"]
  },
  {
    symptoms: ["dyspnée", "essoufflement", "difficulté respiratoire"],
    mandatorySpecialist: "Pneumologue",
    urgencyLevel: "high",
    differentialDiagnosis: ["Asthme", "BPCO", "Pneumonie", "Embolie pulmonaire"],
    redFlags: ["cyanose", "tirage", "orthopnée", "hémoptysie"]
  },
  {
    symptoms: ["céphalées", "maux de tête"],
    mandatorySpecialist: "Neurologue",
    urgencyLevel: "medium",
    differentialDiagnosis: ["Migraine", "Céphalée de tension", "Hypertension intracrânienne", "Méningite"],
    redFlags: ["céphalée brutale", "fièvre", "raideur nucale", "troubles visuels"]
  },
  {
    symptoms: ["vertiges", "étourdissements", "instabilité"],
    mandatorySpecialist: "Neurologue",
    urgencyLevel: "medium",
    differentialDiagnosis: ["Vertige positionnel", "Névrite vestibulaire", "Ménière", "Vertiges centraux"],
    redFlags: ["déficit neurologique", "troubles de la parole", "diplopie"]
  },
  {
    symptoms: ["douleur abdominale", "mal de ventre"],
    mandatorySpecialist: "Gastro-entérologue",
    urgencyLevel: "medium",
    differentialDiagnosis: ["Gastrite", "Ulcère", "Appendicite", "Colique hépatique"],
    redFlags: ["défense abdominale", "vomissements bilieux", "arrêt des matières"]
  },
  {
    symptoms: ["palpitations", "tachycardie", "arythmie"],
    mandatorySpecialist: "Cardiologue",
    urgencyLevel: "medium",
    differentialDiagnosis: ["Fibrillation auriculaire", "Tachycardie supraventriculaire", "Extrasystoles"],
    redFlags: ["syncope", "douleur thoracique", "dyspnée"]
  },
  {
    symptoms: ["fatigue chronique", "asthénie"],
    mandatorySpecialist: "Médecin généraliste",
    urgencyLevel: "low",
    differentialDiagnosis: ["Anémie", "Hypothyroïdie", "Dépression", "Syndrome de fatigue chronique"],
    redFlags: ["amaigrissement", "fièvre", "adénopathies"]
  },
  {
    symptoms: ["dépression", "tristesse", "anxiété", "troubles de l'humeur"],
    mandatorySpecialist: "Psychiatre ou Psychologue",
    urgencyLevel: "medium",
    differentialDiagnosis: ["Épisode dépressif majeur", "Trouble anxieux", "Trouble bipolaire"],
    redFlags: ["idées suicidaires", "hallucinations", "délire"]
  }
];

// Training validation system
export class AITrainingValidator {
  static validateResponse(symptoms: string, specialist: string, urgencyLevel: string): {
    isCorrect: boolean;
    expectedSpecialist: string;
    expectedUrgency: string;
    reasoning: string;
  } {
    const normalizedSymptoms = symptoms.toLowerCase();
    
    for (const rule of medicalTrainingRules) {
      const matchesSymptom = rule.symptoms.some(symptom => 
        normalizedSymptoms.includes(symptom.toLowerCase())
      );
      
      if (matchesSymptom) {
        const isSpecialistCorrect = specialist.toLowerCase().includes(rule.mandatorySpecialist.toLowerCase());
        const isUrgencyCorrect = urgencyLevel === rule.urgencyLevel;
        
        return {
          isCorrect: isSpecialistCorrect && isUrgencyCorrect,
          expectedSpecialist: rule.mandatorySpecialist,
          expectedUrgency: rule.urgencyLevel,
          reasoning: `Symptômes neurologiques détectés: ${rule.symptoms.join(", ")} → ${rule.mandatorySpecialist} obligatoire`
        };
      }
    }
    
    return {
      isCorrect: true,
      expectedSpecialist: specialist,
      expectedUrgency: urgencyLevel,
      reasoning: "Aucune règle spécifique trouvée"
    };
  }
}

// Enhanced prompt with medical training
export function generateEnhancedMedicalPrompt(
  symptoms: string,
  userProfile: string
): string {
  return `Tu es un médecin expert senior avec 25 ans d'expérience en diagnostic différentiel. Tu as été formé sur des milliers de cas cliniques et tu dois appliquer rigoureusement les règles diagnostiques.

PROFIL PATIENT:
${userProfile}

SYMPTÔMES RAPPORTÉS:
${symptoms}

RÈGLES DIAGNOSTIQUES STRICTES À APPLIQUER:
${medicalTrainingRules.map(rule => 
  `• ${rule.symptoms.join(", ")} → ${rule.mandatorySpecialist} (${rule.urgencyLevel})`
).join("\n")}

MÉTHODOLOGIE DIAGNOSTIQUE EXPERTE:
1. ANALYSE SYMPTOMATIQUE: Identifier chaque symptôme et le classer par système
2. RECONNAISSANCE DE PATTERNS: Appliquer les règles diagnostiques validées
3. DIAGNOSTIC DIFFÉRENTIEL: Hiérarchiser 3-4 hypothèses avec probabilités
4. ORIENTATION SPÉCIALISÉE: Respecter OBLIGATOIREMENT les règles d'orientation
5. ÉVALUATION DE GRAVITÉ: Identifier les drapeaux rouges
6. PLAN THÉRAPEUTIQUE: Investigations et conduite à tenir

VALIDATION DIAGNOSTIQUE:
- Vérifier que l'orientation spécialisée correspond aux symptômes
- S'assurer que l'urgence est correctement évaluée
- Confirmer que les hypothèses diagnostiques sont pertinentes

Réponds UNIQUEMENT en JSON avec diagnostic précis et orientation correcte.`;
}

// Training feedback system
export class AITrainingFeedback {
  private static trainingLog: Array<{
    symptoms: string;
    expectedSpecialist: string;
    actualSpecialist: string;
    isCorrect: boolean;
    timestamp: Date;
  }> = [];

  static logPrediction(
    symptoms: string,
    expectedSpecialist: string,
    actualSpecialist: string,
    isCorrect: boolean
  ) {
    this.trainingLog.push({
      symptoms,
      expectedSpecialist,
      actualSpecialist,
      isCorrect,
      timestamp: new Date()
    });
  }

  static getAccuracyStats() {
    const total = this.trainingLog.length;
    const correct = this.trainingLog.filter(log => log.isCorrect).length;
    return {
      total,
      correct,
      accuracy: total > 0 ? (correct / total) * 100 : 0,
      recentErrors: this.trainingLog
        .filter(log => !log.isCorrect)
        .slice(-10)
    };
  }
}