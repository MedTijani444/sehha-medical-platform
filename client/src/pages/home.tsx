import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/header";
import MentalHealthBanner from "@/components/mental-health-banner";
import { Brain, FileText, Shield, Star, Check, Heart, Users, Clock, MapPin, Phone, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Doctor } from "@shared/schema";

export default function Home() {
  // Fetch top-rated doctors for the homepage
  const { data: topDoctors } = useQuery({
    queryKey: ["/api/doctors/top-rated/6"],
    queryFn: () => apiRequest("/api/doctors/top-rated/6"),
    retry: false
  });

  const testimonials = [
    {
      name: "Fatima Z.",
      location: "Casablanca",
      rating: 5,
      comment: "Sehha+ m'a aidée à mieux préparer ma consultation. Le rapport était très détaillé et mon médecin a apprécié la structuration des informations.",
      initials: "FZ"
    },
    {
      name: "Ahmed M.",
      location: "Rabat", 
      rating: 5,
      comment: "L'IA pose les bonnes questions et m'a permis de réaliser l'urgence de mes symptômes. Interface très simple à utiliser.",
      initials: "AM"
    },
    {
      name: "Sarah L.",
      location: "Marrakech",
      rating: 5,
      comment: "Parfait pour les parents inquiets comme moi. L'analyse m'a rassurée et guidée vers le bon spécialiste pour mon enfant.",
      initials: "SL"
    }
  ];

  const steps = [
    {
      number: 1,
      title: "Décrivez vos symptômes",
      description: "Renseignez vos symptômes actuels et votre historique médical en quelques clics",
      color: "bg-sky-500"
    },
    {
      number: 2,
      title: "Dialogue avec l'IA",
      description: "L'intelligence artificielle vous pose des questions pertinentes pour affiner l'analyse",
      color: "bg-emerald-500"
    },
    {
      number: 3,
      title: "Recevez votre analyse",
      description: "Obtenez un pré-diagnostic avec recommandations et niveau d'urgence",
      color: "bg-sky-500"
    },
    {
      number: 4,
      title: "Téléchargez votre rapport",
      description: "Imprimez ou partagez votre rapport PDF avec votre professionnel de santé",
      color: "bg-emerald-500"
    }
  ];

  const features = [
    {
      icon: Brain,
      title: "Analyse intelligente",
      description: "L'IA analyse vos symptômes, votre historique médical et pose les bonnes questions pour établir un pré-diagnostic précis",
      gradient: "from-sky-50 to-white"
    },
    {
      icon: FileText,
      title: "Rapport structuré",
      description: "Générez un rapport PDF professionnel avec vos symptômes, historique et recommandations à présenter à votre médecin",
      gradient: "from-slate-50 to-white"
    },
    {
      icon: Shield,
      title: "Sécurité garantie",
      description: "Vos données médicales sont cryptées et sécurisées. Confidentialité absolue avec conformité aux normes de protection des données",
      gradient: "from-sky-50 to-white"
    }
  ];

  const benefits = [
    "Interface entièrement en français",
    "Optimisé mobile et desktop", 
    "Historique complet de vos consultations"
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Mental Health Support Banner */}
      <MentalHealthBanner />

      {/* Hero Section */}
      <section className="relative sehha-gradient py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 to-emerald-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl lg:text-6xl font-bold text-slate-800 leading-tight mb-6">
                L'IA au service de 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-emerald-500"> votre santé</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Préparez vos consultations médicales avec l'intelligence artificielle. 
                Obtenez un pré-diagnostic structuré et un rapport détaillé pour votre médecin.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/auth?mode=register">
                  <Button size="lg" className="sehha-button-primary text-lg px-8 py-4">
                    Commencer ma consultation
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className="sehha-button-secondary text-lg px-8 py-4">
                    En savoir plus
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600" 
                alt="Professional medical consultation with healthcare provider" 
                className="rounded-2xl shadow-2xl w-full h-auto transform rotate-2 hover:rotate-0 transition-transform duration-500" 
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-lg p-4 border border-gray-100">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-700">IA en cours d'analyse...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Propositions */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Comment Sehha+ améliore vos consultations
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Notre intelligence artificielle vous guide pour structurer vos symptômes et préparer efficacement votre rendez-vous médical
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className={`sehha-card bg-gradient-to-br ${feature.gradient} p-8 group`}>
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                    <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sehha-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Simple, rapide et efficace
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              En quelques étapes, obtenez une analyse complète de vos symptômes
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, index) => (
              <div key={index} className="text-center group">
                <div className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <span className="text-white font-bold text-2xl">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-3">{step.title}</h3>
                <p className="text-slate-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Demo */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-6">
                Une interface pensée pour vous
              </h2>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Sehha+ combine la puissance de l'intelligence artificielle avec une interface intuitive. 
                Accessible en français, arabe et anglais pour servir toutes les communautés.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1559757175-0eb30cd8c063?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Modern medical interface design" 
                className="rounded-2xl shadow-xl w-full h-auto" 
              />
              
              <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 border border-gray-100">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  <span className="text-xs font-medium text-slate-700">Consultation active</span>
                </div>
              </div>
              
              <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 border border-gray-100">
                <div className="text-xs text-slate-600 mb-1">Dernière analyse</div>
                <div className="text-sm font-semibold text-slate-800">Maux de tête récurrents</div>
                <div className="text-xs text-emerald-500 mt-1">Rapport généré</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sehha-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Ils nous font confiance
            </h2>
            <p className="text-xl text-slate-600">
              Découvrez comment Sehha+ aide déjà des milliers de patients
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="sehha-card p-8">
                <CardContent className="p-0">
                  <div className="flex items-center mb-4">
                    <div className="flex text-yellow-400">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-slate-600 mb-6 italic">
                    "{testimonial.comment}"
                  </p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-semibold text-sm">{testimonial.initials}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-slate-800">{testimonial.name}</div>
                      <div className="text-sm text-slate-600">{testimonial.location}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
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
            Rejoignez des milliers d'utilisateurs qui préparent déjà leurs rendez-vous médicaux avec l'intelligence artificielle
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?mode=register">
              <Button size="lg" className="bg-white text-sky-600 hover:bg-gray-50 px-10 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Créer mon compte gratuit
              </Button>
            </Link>
            <Link href="#features">
              <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-sky-600 px-10 py-4 text-lg font-semibold transition-all duration-300 bg-transparent backdrop-blur-sm">
                Voir la démo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-bold">Sehha+</span>
              </div>
              <p className="text-slate-300 mb-6 leading-relaxed max-w-md">
                L'intelligence artificielle au service de votre santé. Préparez vos consultations médicales avec confiance et sérénité.
              </p>
              <div className="text-lg text-sky-200 font-medium italic">
                Chez Sehha+, votre santé est notre priorité. Chaque consultation compte.
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Navigation</h3>
              <ul className="space-y-2 text-slate-300">
                <li><Link to="/how-it-works" className="hover:text-white transition-colors">Comment ça marche</Link></li>
                <li><Link to="/doctors" className="hover:text-white transition-colors">Trouver un médecin</Link></li>
                <li><Link to="/anonymous-chat" className="hover:text-white transition-colors">Chat anonyme</Link></li>
                <li><Link to="/consultation" className="hover:text-white transition-colors">Consultation IA</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg mb-4">Support</h3>
              <ul className="space-y-2 text-slate-300">
                <li><Link to="/about" className="hover:text-white transition-colors">À propos</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><a href="mailto:contact@sehhaplus.com" className="hover:text-white transition-colors">Email direct</a></li>
                <li><a href="tel:+212522xxxxxx" className="hover:text-white transition-colors">Téléphone</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-slate-400 text-sm">
              © 2024 Sehha+. Tous droits réservés.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="mailto:contact@sehhaplus.com" className="text-slate-400 hover:text-white transition-colors" title="Email">
                <Mail className="w-5 h-5" />
              </a>
              <a href="tel:+212522xxxxxx" className="text-slate-400 hover:text-white transition-colors" title="Téléphone">
                <Phone className="w-5 h-5" />
              </a>
              <Link to="/about" className="text-slate-400 hover:text-white transition-colors" title="À propos">
                <Heart className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
