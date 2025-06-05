import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Header from "@/components/header";
import { 
  Heart, 
  Target, 
  Users, 
  Shield, 
  Brain, 
  Stethoscope,
  Globe,
  Award,
  CheckCircle
} from "lucide-react";
import { Link } from "wouter";
import logoPath from "@assets/Health Care_1749135916464.png";

export default function About() {
  const objectives = [
    {
      icon: Target,
      title: "Améliorer la qualité des consultations",
      description: "Aider les patients à structurer leurs symptômes et leur historique médical avant de consulter un professionnel de santé."
    },
    {
      icon: Brain,
      title: "Intelligence artificielle médicale",
      description: "Utiliser l'IA pour fournir des pré-diagnostics éducatifs et des recommandations personnalisées basées sur les symptômes."
    },
    {
      icon: Users,
      title: "Accessibilité pour tous",
      description: "Rendre l'assistance médicale accessible en français, spécialement conçue pour les utilisateurs francophones au Maroc."
    },
    {
      icon: Shield,
      title: "Confidentialité et sécurité",
      description: "Garantir la protection absolue des données médicales avec un cryptage de niveau hospitalier."
    }
  ];

  const features = [
    "Analyse intelligente des symptômes par IA",
    "Génération de rapports PDF professionnels",
    "Interface entièrement en français",
    "Historique médical sécurisé",
    "Recommandations de spécialistes",
    "Évaluation du niveau d'urgence"
  ];

  const values = [
    {
      title: "Précision",
      description: "Analyses basées sur les dernières connaissances médicales"
    },
    {
      title: "Transparence",
      description: "Communication claire sur les limites de l'IA médicale"
    },
    {
      title: "Éthique",
      description: "Respect des normes déontologiques et de la relation médecin-patient"
    },
    {
      title: "Innovation",
      description: "Intégration des dernières avancées en intelligence artificielle"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="sehha-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <img 
                src={logoPath} 
                alt="Sehha+ Logo" 
                className="w-28 h-28 object-contain"
              />
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-800">Sehha+</h1>
            </div>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              L'intelligence artificielle au service de votre santé. Notre mission est de révolutionner 
              la préparation des consultations médicales grâce à une technologie de pointe et une approche 
              centrée sur le patient.
            </p>
          </div>
        </div>
      </section>

      {/* Objectives Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Nos Objectifs
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Transformer l'expérience médicale en rendant les consultations plus efficaces et accessibles
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {objectives.map((objective, index) => {
              const Icon = objective.icon;
              return (
                <Card key={index} className="sehha-card p-8 group hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">{objective.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{objective.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="py-20 sehha-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-6">
                Notre Mission
              </h2>
              <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
                <p>
                  <strong>Sehha+</strong> est né d'une vision simple mais ambitieuse : utiliser l'intelligence 
                  artificielle pour améliorer l'accès aux soins de santé et la qualité des consultations médicales.
                </p>
                <p>
                  Dans un contexte où les systèmes de santé font face à des défis croissants, nous croyons 
                  que la technologie peut jouer un rôle crucial pour aider les patients à mieux comprendre 
                  leurs symptômes et préparer leurs rendez-vous médicaux.
                </p>
                <p>
                  Notre plateforme ne remplace jamais l'expertise médicale, mais la complète en fournissant 
                  des outils intelligents pour structurer l'information et faciliter le dialogue 
                  patient-médecin.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Nos Valeurs
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Les principes qui guident notre développement et notre engagement envers la santé
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="sehha-card text-center p-6">
                <CardContent className="p-0">
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{value.title}</h3>
                  <p className="text-slate-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 sehha-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Une Équipe Engagée
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Développeurs, médecins et experts en IA unis pour révolutionner la santé digitale
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="sehha-card text-center p-8">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Experts IA</h3>
                <p className="text-slate-600">
                  Spécialistes en intelligence artificielle et apprentissage automatique appliqués à la santé
                </p>
              </CardContent>
            </Card>

            <Card className="sehha-card text-center p-8">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Professionnels de Santé</h3>
                <p className="text-slate-600">
                  Médecins et infirmiers qui valident nos algorithmes et garantissent la qualité médicale
                </p>
              </CardContent>
            </Card>

            <Card className="sehha-card text-center p-8">
              <CardContent className="p-0">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Équipe Internationale</h3>
                <p className="text-slate-600">
                  Développeurs et designers du Maroc, de France et d'autres pays pour une vision globale
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-sky-500 to-emerald-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Rejoignez la Révolution de la Santé Digitale
          </h2>
          <p className="text-xl text-sky-100 mb-10 leading-relaxed">
            Découvrez comment Sehha+ peut transformer votre expérience médicale et vous aider à prendre 
            soin de votre santé de manière plus intelligente et proactive.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?mode=register">
              <Button size="lg" className="bg-white text-sky-600 hover:bg-gray-50 px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Commencer Maintenant
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-sky-600 px-10 py-4 text-lg font-semibold transition-all duration-300">
                Nous Contacter
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}