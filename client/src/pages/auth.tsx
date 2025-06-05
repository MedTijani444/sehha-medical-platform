import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import { Link } from "wouter";
import { Heart, ArrowLeft } from "lucide-react";
import logoPath from "@assets/Health Care_1749135916464.png";

export default function Auth() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    age: "",
    gender: "",
    chronicIllnesses: "",
    currentMedications: "",
    allergies: "",
    language: "fr"
  });
  const [loading, setLoading] = useState(false);
  
  const { login, register, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [location, setLocation] = useLocation();

  // Check URL params for mode
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlMode = params.get("mode");
    if (urlMode === "register") {
      setMode("register");
    }
  }, []);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // Check for stored redirect URL
      const redirectUrl = localStorage.getItem('redirectAfterLogin');
      if (redirectUrl) {
        localStorage.removeItem('redirectAfterLogin');
        setLocation(redirectUrl);
      } else {
        setLocation("/dashboard");
      }
    }
  }, [isAuthenticated, setLocation]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue sur Sehha+ !",
        });
      } else {
        const registerData = {
          ...formData,
          age: formData.age ? parseInt(formData.age) : undefined,
        };
        await register(registerData);
        toast({
          title: "Compte créé avec succès",
          description: "Bienvenue sur Sehha+ !",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur s'est produite",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen sehha-gradient">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Back to home link */}
          <Link href="/">
            <Button variant="ghost" className="mb-6 text-slate-600 hover:text-slate-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </Link>

          <Card className="sehha-card">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <img 
                  src={logoPath} 
                  alt="Sehha+ Logo" 
                  className="w-16 h-16 object-contain"
                />
                <span className="text-2xl font-bold text-slate-800">Sehha+</span>
              </div>
              <CardTitle className="text-2xl">
                {mode === "login" ? "Connexion" : "Créer un compte"}
              </CardTitle>
              <CardDescription>
                {mode === "login" 
                  ? "Connectez-vous pour accéder à votre tableau de bord médical"
                  : "Créez votre compte pour commencer à utiliser Sehha+"
                }
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label htmlFor="password">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    minLength={6}
                    className="w-full"
                  />
                </div>

                {/* Registration fields */}
                {mode === "register" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Nom complet</Label>
                      <Input
                        id="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Âge</Label>
                        <Input
                          id="age"
                          type="number"
                          value={formData.age}
                          onChange={(e) => handleInputChange("age", e.target.value)}
                          min="1"
                          max="120"
                          className="w-full"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="gender">Genre</Label>
                        <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="homme">Homme</SelectItem>
                            <SelectItem value="femme">Femme</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                            <SelectItem value="non-specifie">Préfère ne pas dire</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chronicIllnesses">Maladies chroniques (optionnel)</Label>
                      <Textarea
                        id="chronicIllnesses"
                        value={formData.chronicIllnesses}
                        onChange={(e) => handleInputChange("chronicIllnesses", e.target.value)}
                        placeholder="Ex: Diabète, Hypertension..."
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="currentMedications">Médicaments actuels (optionnel)</Label>
                      <Textarea
                        id="currentMedications"
                        value={formData.currentMedications}
                        onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                        placeholder="Ex: Paracétamol 500mg..."
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="allergies">Allergies (optionnel)</Label>
                      <Textarea
                        id="allergies"
                        value={formData.allergies}
                        onChange={(e) => handleInputChange("allergies", e.target.value)}
                        placeholder="Ex: Pénicilline, Arachides..."
                        className="w-full"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">Langue préférée</Label>
                      <Select value={formData.language} onValueChange={(value) => handleInputChange("language", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="ar">العربية</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full sehha-button-primary"
                  size="lg"
                >
                  {loading ? "Chargement..." : mode === "login" ? "Se connecter" : "Créer mon compte"}
                </Button>

                {/* Mode toggle */}
                <div className="text-center pt-4">
                  <p className="text-slate-600">
                    {mode === "login" ? "Pas encore de compte ?" : "Déjà un compte ?"}
                    <button
                      type="button"
                      onClick={() => setMode(mode === "login" ? "register" : "login")}
                      className="ml-2 text-sky-600 hover:text-sky-700 font-medium"
                    >
                      {mode === "login" ? "S'inscrire" : "Se connecter"}
                    </button>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
