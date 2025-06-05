import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { 
  MessageSquare, 
  Brain, 
  FileText, 
  Stethoscope,
  ArrowRight,
  CheckCircle,
  Users,
  Shield,
  Clock,
  Star
} from "lucide-react";
import { Link } from "wouter";

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Inscription et profil médical",
      description: "Créez votre compte sécurisé et renseignez vos informations médicales de base",
      details: [
        "Inscription rapide avec email et mot de passe",
        "Renseignement de votre historique médical",
        "Configuration des préférences linguistiques",
        "Validation de la sécurité de vos données"
      ],
      color: "bg-sky-500",
      bgColor: "bg-sky-50"
    },
    {
      number: 2,
      title: "Description des symptômes",
      description: "Décrivez précisément vos symptômes actuels et leur évolution",
      details: [
        "Interface guidée pour décrire vos symptômes",
        "Questions sur la durée et l'intensité",
        "Contexte médical et facteurs déclenchants",
        "Médications actuelles et allergies"
      ],
      color: "bg-emerald-500",
      bgColor: "bg-emerald-50"
    },
    {
      number: 3,
      title: "Analyse par intelligence artificielle",
      description: "L'IA médicale analyse vos informations et pose des questions complémentaires",
      details: [
        "Analyse contextuelle des symptômes",
        "Questions de suivi personnalisées",
        "Évaluation du niveau d'urgence",
        "Cross-référencement avec votre historique"
      ],
      color: "bg-purple-500",
      bgColor: "bg-purple-50"
    },
    {
      number: 4,
      title: "Pré-diagnostic et recommandations",
      description: "Recevez une analyse structurée avec des recommandations de spécialistes",
      details: [
        "Pré-diagnostic basé sur l'analyse IA",
        "Niveau d'urgence clairement défini",
        "Recommandations de spécialistes",
        "Conseils de prise en charge immédiate"
      ],
      color: "bg-orange-500",
      bgColor: "bg-orange-50"
    },
    {
      number: 5,
      title: "Rapport PDF professionnel",
      description: "Téléchargez un rapport complet à présenter à votre médecin",
      details: [
        "Rapport PDF structuré et professionnel",
        "Synthèse complète de la consultation",
        "Historique des échanges avec l'IA",
        "Recommandations pour le suivi médical"
      ],
      color: "bg-red-500",
      bgColor: "bg-red-50"
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Gain de temps",
      description: "Préparez votre consultation en 10-15 minutes"
    },
    {
      icon: Stethoscope,
      title: "Meilleure communication",
      description: "Structurez vos symptômes pour une consultation plus efficace"
    },
    {
      icon: Brain,
      title: "Analyse approfondie",
      description: "Bénéficiez d'une pré-analyse basée sur l'IA médicale"
    },
    {
      icon: FileText,
      title: "Rapport professionnel",
      description: "Obtenez un document de référence pour votre médecin"
    }
  ];

  const safetyFeatures = [
    "Chiffrement de bout en bout des données médicales",
    "Conformité RGPD et réglementations locales",
    "Pas de stockage sur serveurs tiers",
    "Accès limité aux seules personnes autorisées",
    "Sauvegarde sécurisée avec redondance",
    "Audit de sécurité régulier par des experts"
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="sehha-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
              Comment fonctionne Sehha+
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Découvrez étape par étape comment notre intelligence artificielle 
              vous aide à préparer vos consultations médicales et améliorer 
              votre suivi de santé.
            </p>
            <Link href="/auth?mode=register">
              <Button size="lg" className="sehha-button-primary text-lg px-8 py-4">
                Essayer maintenant
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Le processus en 5 étapes
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Un parcours simple et guidé pour une consultation médicale optimisée
            </p>
          </div>
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className={`relative ${index % 2 === 0 ? '' : 'lg:flex-row-reverse'} flex flex-col lg:flex-row items-center gap-12`}>
                <div className="lg:w-1/2">
                  <Card className={`sehha-card ${step.bgColor} border-2 border-opacity-20`}>
                    <CardContent className="p-8">
                      <div className="flex items-center space-x-4 mb-6">
                        <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg`}>
                          {step.number}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-slate-800">{step.title}</h3>
                          <p className="text-slate-600 mt-1">{step.description}</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {step.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center space-x-3">
                            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            <span className="text-slate-700">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="lg:w-1/2">
                  <div className="relative">
                    {/* Medical Process Illustrations */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-xl p-8 aspect-[3/2] flex items-center justify-center">
                      {index === 0 && (
                        <div className="text-center">
                          <div className="w-32 h-32 mx-auto mb-4 relative">
                            <svg viewBox="0 0 200 200" className="w-full h-full">
                              {/* User profile icon */}
                              <circle cx="100" cy="70" r="25" fill="#0ea5e9" />
                              <path d="M100 105 C85 105, 70 115, 70 130 L130 130 C130 115, 115 105, 100 105 Z" fill="#0ea5e9" />
                              {/* Medical cross */}
                              <rect x="95" y="140" width="10" height="30" fill="#10b981" />
                              <rect x="85" y="150" width="30" height="10" fill="#10b981" />
                              {/* Security shield */}
                              <path d="M160 50 L160 80 C160 95, 150 105, 135 105 C120 105, 110 95, 110 80 L110 50 L135 45 Z" fill="#f59e0b" />
                              <rect x="125" y="65" width="20" height="15" fill="#fff" />
                            </svg>
                          </div>
                          <p className="text-slate-600 font-medium">Profil médical sécurisé</p>
                        </div>
                      )}
                      
                      {index === 1 && (
                        <div className="text-center">
                          <div className="w-32 h-32 mx-auto mb-4 relative">
                            <svg viewBox="0 0 200 200" className="w-full h-full">
                              {/* Body outline */}
                              <ellipse cx="100" cy="60" rx="15" ry="20" fill="#0ea5e9" />
                              <rect x="85" y="80" width="30" height="60" rx="15" fill="#0ea5e9" />
                              <rect x="75" y="90" width="15" height="40" rx="7" fill="#0ea5e9" />
                              <rect x="110" y="90" width="15" height="40" rx="7" fill="#0ea5e9" />
                              <rect x="90" y="140" width="8" height="30" rx="4" fill="#0ea5e9" />
                              <rect x="102" y="140" width="8" height="30" rx="4" fill="#0ea5e9" />
                              {/* Symptom indicators */}
                              <circle cx="80" cy="70" r="4" fill="#ef4444" />
                              <circle cx="120" cy="100" r="4" fill="#ef4444" />
                              <circle cx="95" cy="120" r="4" fill="#ef4444" />
                            </svg>
                          </div>
                          <p className="text-slate-600 font-medium">Localisation des symptômes</p>
                        </div>
                      )}
                      
                      {index === 2 && (
                        <div className="text-center">
                          <div className="w-32 h-32 mx-auto mb-4 relative">
                            <svg viewBox="0 0 200 200" className="w-full h-full">
                              {/* AI Brain */}
                              <path d="M100 40 C130 40, 150 60, 150 90 C150 120, 130 140, 100 140 C70 140, 50 120, 50 90 C50 60, 70 40, 100 40 Z" fill="#8b5cf6" />
                              {/* Neural network lines */}
                              <circle cx="80" cy="75" r="3" fill="#fff" />
                              <circle cx="100" cy="65" r="3" fill="#fff" />
                              <circle cx="120" cy="75" r="3" fill="#fff" />
                              <circle cx="90" cy="95" r="3" fill="#fff" />
                              <circle cx="110" cy="95" r="3" fill="#fff" />
                              <circle cx="100" cy="115" r="3" fill="#fff" />
                              {/* Connection lines */}
                              <line x1="80" y1="75" x2="100" y2="65" stroke="#fff" strokeWidth="1" />
                              <line x1="100" y1="65" x2="120" y2="75" stroke="#fff" strokeWidth="1" />
                              <line x1="80" y1="75" x2="90" y2="95" stroke="#fff" strokeWidth="1" />
                              <line x1="120" y1="75" x2="110" y2="95" stroke="#fff" strokeWidth="1" />
                              <line x1="90" y1="95" x2="100" y2="115" stroke="#fff" strokeWidth="1" />
                              <line x1="110" y1="95" x2="100" y2="115" stroke="#fff" strokeWidth="1" />
                              {/* Analysis waves */}
                              <path d="M30 160 Q40 150, 50 160 T70 160 T90 160 T110 160 T130 160 T150 160 T170 160" stroke="#10b981" strokeWidth="2" fill="none" />
                            </svg>
                          </div>
                          <p className="text-slate-600 font-medium">Analyse par IA médicale</p>
                        </div>
                      )}
                      
                      {index === 3 && (
                        <div className="text-center">
                          <div className="w-32 h-32 mx-auto mb-4 relative">
                            <svg viewBox="0 0 200 200" className="w-full h-full">
                              {/* Chart/Report */}
                              <rect x="60" y="50" width="80" height="100" rx="5" fill="#f97316" />
                              <rect x="70" y="60" width="60" height="4" fill="#fff" />
                              <rect x="70" y="70" width="60" height="4" fill="#fff" />
                              <rect x="70" y="80" width="40" height="4" fill="#fff" />
                              {/* Priority indicator */}
                              <circle cx="120" cy="90" r="8" fill="#ef4444" />
                              <text x="120" y="95" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="bold">!</text>
                              {/* Recommendation boxes */}
                              <rect x="70" y="100" width="25" height="15" rx="2" fill="#10b981" />
                              <rect x="105" y="100" width="25" height="15" rx="2" fill="#0ea5e9" />
                              <rect x="70" y="125" width="60" height="15" rx="2" fill="#8b5cf6" />
                            </svg>
                          </div>
                          <p className="text-slate-600 font-medium">Recommandations ciblées</p>
                        </div>
                      )}
                      
                      {index === 4 && (
                        <div className="text-center">
                          <div className="w-32 h-32 mx-auto mb-4 relative">
                            <svg viewBox="0 0 200 200" className="w-full h-full">
                              {/* PDF Document */}
                              <rect x="70" y="40" width="60" height="80" rx="3" fill="#dc2626" />
                              <rect x="75" y="50" width="50" height="3" fill="#fff" />
                              <rect x="75" y="60" width="50" height="3" fill="#fff" />
                              <rect x="75" y="70" width="35" height="3" fill="#fff" />
                              <rect x="75" y="80" width="45" height="3" fill="#fff" />
                              <rect x="75" y="90" width="40" height="3" fill="#fff" />
                              <rect x="75" y="100" width="50" height="3" fill="#fff" />
                              {/* Download arrow */}
                              <circle cx="100" cy="150" r="20" fill="#10b981" />
                              <path d="M100 135 L100 155 M90 150 L100 160 L110 150" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <p className="text-slate-600 font-medium">Rapport PDF téléchargeable</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="absolute -top-4 -left-4 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center border-2 border-slate-100">
                      <div className={`w-8 h-8 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm`}>
                        {step.number}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Arrow connector for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 -bottom-6">
                    <ArrowRight className="w-8 h-8 text-slate-300 rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 sehha-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Pourquoi utiliser Sehha+
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Des avantages concrets pour votre santé et vos consultations médicales
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <Card key={index} className="sehha-card text-center p-6 group hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{benefit.title}</h3>
                    <p className="text-slate-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Safety & Privacy */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-6">
                Sécurité et confidentialité
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Vos données médicales sont précieuses et sensibles. Nous utilisons 
                les meilleures technologies de sécurité pour garantir leur protection 
                absolue et leur confidentialité.
              </p>
              <div className="space-y-4">
                {safetyFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-slate-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=500" 
                alt="Sécurité des données médicales" 
                className="rounded-2xl shadow-xl w-full h-auto" 
              />
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span className="text-sm font-medium text-slate-700">Données sécurisées</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Preview */}
      <section className="py-20 sehha-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Réponses aux questions les plus posées sur Sehha+
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="sehha-card p-6">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Sehha+ remplace-t-il une consultation médicale ?
                </h3>
                <p className="text-slate-600">
                  Non, absolument pas. Sehha+ est un outil de préparation qui vous aide à structurer 
                  vos symptômes avant de consulter un professionnel de santé. Il ne remplace jamais 
                  l'avis d'un médecin qualifié.
                </p>
              </CardContent>
            </Card>

            <Card className="sehha-card p-6">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Mes données sont-elles vraiment sécurisées ?
                </h3>
                <p className="text-slate-600">
                  Oui, nous utilisons un chiffrement de niveau hospitalier et nous nous conformons 
                  à toutes les réglementations en vigueur (RGPD). Vos données ne sont jamais partagées 
                  avec des tiers sans votre consentement explicite.
                </p>
              </CardContent>
            </Card>

            <Card className="sehha-card p-6">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Comment l'IA analyse-t-elle mes symptômes ?
                </h3>
                <p className="text-slate-600">
                  Notre IA utilise les dernières avancées en traitement du langage naturel et 
                  s'appuie sur des bases de données médicales validées pour analyser vos symptômes 
                  et proposer des pistes de réflexion.
                </p>
              </CardContent>
            </Card>

            <Card className="sehha-card p-6">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Le service est-il gratuit ?
                </h3>
                <p className="text-slate-600">
                  Sehha+ propose une version gratuite avec les fonctionnalités essentielles. 
                  Des options premium sont également disponibles pour des analyses plus 
                  approfondies et des fonctionnalités avancées.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Link href="/contact">
              <Button size="lg" variant="outline" className="sehha-button-secondary text-lg px-8 py-4">
                Voir toutes les questions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-500 to-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Prêt à améliorer vos consultations médicales ?
          </h2>
          <p className="text-xl text-sky-100 mb-10 leading-relaxed">
            Rejoignez des milliers d'utilisateurs qui préparent déjà leurs rendez-vous 
            médicaux avec l'intelligence artificielle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?mode=register">
              <Button size="lg" className="bg-white text-sky-600 hover:bg-gray-50 px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Créer mon compte gratuit
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-sky-600 px-10 py-4 text-lg font-semibold transition-all duration-300">
                En savoir plus
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}