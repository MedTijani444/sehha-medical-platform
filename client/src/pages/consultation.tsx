import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth";
import { consultationApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import { MessageSquare, ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "wouter";

function Consultation() {
  const [formData, setFormData] = useState({
    symptoms: "",
    duration: "",
    medicalHistory: ""
  });
  const [loading, setLoading] = useState(false);
  const [, setLocation] = useLocation();
  const [isMentalHealth, setIsMentalHealth] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  // Check if this is a mental health consultation
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type');
    setIsMentalHealth(type === 'mental');
  }, []);

  // Handle authentication redirect
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      // Store current location to return after login
      const currentUrl = window.location.pathname + window.location.search;
      localStorage.setItem('redirectAfterLogin', currentUrl);
      setLocation('/auth');
    }
  }, [authLoading, isAuthenticated, setLocation]);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.symptoms.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez décrire vos symptômes",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const result = await consultationApi.start(formData);
      
      toast({
        title: "Consultation créée",
        description: "Votre consultation a été initialisée avec succès",
      });

      // Redirect to chat page for this consultation
      setLocation(`/consultation/${result.consultation.id}/chat`);
      
    } catch (error: any) {
      console.error("Consultation start error:", error);
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la création de la consultation",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 text-slate-600 hover:text-slate-800">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </Link>

        <Card className="sehha-card">
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">
                  {isMentalHealth ? "Évaluation en Santé Mentale" : "Nouvelle consultation"}
                </CardTitle>
                <CardDescription>
                  {isMentalHealth 
                    ? "Décrivez votre état émotionnel et mental pour une évaluation confidentielle"
                    : "Décrivez vos symptômes pour commencer l'analyse avec notre IA médicale"
                  }
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Symptoms */}
              <div className="space-y-2">
                <Label htmlFor="symptoms" className="text-base font-semibold">
                  {isMentalHealth 
                    ? "Décrivez votre état émotionnel et mental actuel *"
                    : "Décrivez vos symptômes actuels *"
                  }
                </Label>
                <Textarea
                  id="symptoms"
                  value={formData.symptoms}
                  onChange={(e) => handleInputChange("symptoms", e.target.value)}
                  placeholder={isMentalHealth 
                    ? "Ex: Je me sens anxieux depuis quelques semaines, j'ai des difficultés à dormir, je ressens de la tristesse persistante..."
                    : "Ex: J'ai des maux de tête depuis 3 jours, accompagnés de nausées et de sensibilité à la lumière..."
                  }
                  className="min-h-32 w-full"
                  required
                />
                <p className="text-sm text-slate-600">
                  {isMentalHealth 
                    ? "Exprimez librement vos sentiments et préoccupations. Cette information reste strictement confidentielle."
                    : "Soyez aussi précis que possible. Plus vous donnez de détails, plus l'analyse sera pertinente."
                  }
                </p>
              </div>

              {/* Duration */}
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-base font-semibold">
                  {isMentalHealth 
                    ? "Depuis quand ressentez-vous ces difficultés ?"
                    : "Depuis quand avez-vous ces symptômes ?"
                  }
                </Label>
                <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner la durée" />
                  </SelectTrigger>
                  <SelectContent>
                    {isMentalHealth ? (
                      <>
                        <SelectItem value="quelques-jours">Quelques jours</SelectItem>
                        <SelectItem value="1-2-semaines">1 à 2 semaines</SelectItem>
                        <SelectItem value="1-mois">Environ 1 mois</SelectItem>
                        <SelectItem value="2-3-mois">2 à 3 mois</SelectItem>
                        <SelectItem value="plus-6-mois">Plus de 6 mois</SelectItem>
                        <SelectItem value="longue-duree">Difficultés de longue durée</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="moins-24h">Moins de 24 heures</SelectItem>
                        <SelectItem value="1-3-jours">1 à 3 jours</SelectItem>
                        <SelectItem value="4-7-jours">4 à 7 jours</SelectItem>
                        <SelectItem value="1-2-semaines">1 à 2 semaines</SelectItem>
                        <SelectItem value="2-4-semaines">2 à 4 semaines</SelectItem>
                        <SelectItem value="plus-1-mois">Plus d'un mois</SelectItem>
                        <SelectItem value="chronique">Symptômes chroniques/récurrents</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Medical History */}
              <div className="space-y-2">
                <Label htmlFor="medicalHistory" className="text-base font-semibold">
                  {isMentalHealth 
                    ? "Contexte et informations supplémentaires (optionnel)"
                    : "Informations complémentaires (optionnel)"
                  }
                </Label>
                <Textarea
                  id="medicalHistory"
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                  placeholder={isMentalHealth 
                    ? "Ex: Événements récents, changements dans votre vie, traitements en cours, soutien familial..."
                    : "Ex: Contexte particulier, facteurs déclenchants, évolution des symptômes, traitements déjà essayés..."
                  }
                  className="min-h-24 w-full"
                />
                <p className="text-sm text-slate-600">
                  {isMentalHealth 
                    ? "Partagez tout contexte qui pourrait être pertinent pour mieux vous comprendre et vous accompagner."
                    : "Tout contexte supplémentaire qui pourrait aider l'IA à mieux comprendre votre situation."
                  }
                </p>
              </div>

              {/* Important Notice */}
              <div className={`border rounded-lg p-4 ${
                isMentalHealth 
                  ? "bg-blue-50 border-blue-200" 
                  : "bg-amber-50 border-amber-200"
              }`}>
                <div className="flex items-start space-x-3">
                  <div className={`w-5 h-5 mt-0.5 ${
                    isMentalHealth ? "text-blue-600" : "text-amber-600"
                  }`}>
                    {isMentalHealth ? "🛡️" : "⚠️"}
                  </div>
                  <div className="text-sm">
                    <p className={`font-semibold mb-1 ${
                      isMentalHealth ? "text-blue-800" : "text-amber-800"
                    }`}>
                      {isMentalHealth ? "Confidentialité et sécurité" : "Important"}
                    </p>
                    <p className={isMentalHealth ? "text-blue-700" : "text-amber-700"}>
                      {isMentalHealth 
                        ? "Votre conversation est strictement confidentielle et anonyme. Cet outil d'évaluation complète un accompagnement professionnel mais ne le remplace pas. En cas de crise, contactez le 141 (SOS Amitié Maroc) ou les urgences."
                        : "Cette consultation IA est un outil d'aide à la préparation de votre rendez-vous médical. Elle ne remplace en aucun cas l'avis d'un professionnel de santé qualifié. En cas d'urgence, contactez immédiatement les services de secours."
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={loading || !formData.symptoms.trim()}
                  className="sehha-button-primary min-w-48"
                  size="lg"
                >
                  {loading ? (
                    "Initialisation..."
                  ) : (
                    <>
                      Commencer l'analyse
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 mt-8">
          <Card className="border-sky-200 bg-sky-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Analyse intelligente</h3>
              <p className="text-sm text-slate-600">
                L'IA analyse vos symptômes et pose des questions pertinentes
              </p>
            </CardContent>
          </Card>

          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Pré-diagnostic</h3>
              <p className="text-sm text-slate-600">
                Recevez une analyse structurée avec recommandations
              </p>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">Rapport PDF</h3>
              <p className="text-sm text-slate-600">
                Téléchargez un rapport professionnel pour votre médecin
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Consultation;
