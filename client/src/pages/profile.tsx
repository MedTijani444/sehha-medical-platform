import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { withAuth, useAuth } from "@/lib/auth";
import { userApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import { 
  User, 
  Save, 
  Edit, 
  Shield, 
  Activity,
  Calendar,
  Pill,
  AlertTriangle,
  Languages
} from "lucide-react";

function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || "",
    age: user?.age?.toString() || "",
    gender: user?.gender || "",
    chronicIllnesses: user?.chronicIllnesses || "",
    currentMedications: user?.currentMedications || "",
    allergies: user?.allergies || "",
    language: user?.language || "fr"
  });

  const updateProfileMutation = useMutation({
    mutationFn: (updates: any) => userApi.updateProfile(updates),
    onSuccess: (data) => {
      queryClient.setQueryData(["/api/user/profile"], data.user);
      setIsEditing(false);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été sauvegardées avec succès",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la mise à jour du profil",
        variant: "destructive",
      });
    },
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const updates = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined,
    };

    await updateProfileMutation.mutateAsync(updates);
  };

  const handleCancel = () => {
    setFormData({
      fullName: user?.fullName || "",
      age: user?.age?.toString() || "",
      gender: user?.gender || "",
      chronicIllnesses: user?.chronicIllnesses || "",
      currentMedications: user?.currentMedications || "",
      allergies: user?.allergies || "",
      language: user?.language || "fr"
    });
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            <Skeleton className="h-8 w-48" />
            <Card className="sehha-card">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-64" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mon profil</h1>
          <p className="text-slate-600">
            Gérez vos informations personnelles et médicales
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card className="sehha-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                      <User className="w-5 h-5 text-sky-600" />
                    </div>
                    <div>
                      <CardTitle>Informations personnelles</CardTitle>
                      <CardDescription>
                        Vos données de base pour personnaliser l'expérience
                      </CardDescription>
                    </div>
                  </div>
                  {!isEditing && (
                    <Button
                      onClick={() => setIsEditing(true)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Modifier
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nom complet</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                      disabled={!isEditing}
                      className={!isEditing ? "bg-slate-50" : ""}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="age">Âge</Label>
                    <Input
                      id="age"
                      type="number"
                      value={formData.age}
                      onChange={(e) => handleInputChange("age", e.target.value)}
                      disabled={!isEditing}
                      min="1"
                      max="120"
                      className={!isEditing ? "bg-slate-50" : ""}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Genre</Label>
                    <Select 
                      value={formData.gender} 
                      onValueChange={(value) => handleInputChange("gender", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={!isEditing ? "bg-slate-50" : ""}>
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

                  <div className="space-y-2">
                    <Label htmlFor="language">Langue préférée</Label>
                    <Select 
                      value={formData.language} 
                      onValueChange={(value) => handleInputChange("language", value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger className={!isEditing ? "bg-slate-50" : ""}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Email</Label>
                  <Input
                    value={user.email}
                    disabled
                    className="bg-slate-50 text-slate-600"
                  />
                  <p className="text-xs text-slate-500">
                    L'email ne peut pas être modifié pour des raisons de sécurité
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Medical Information */}
            <Card className="sehha-card">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Activity className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <CardTitle>Informations médicales</CardTitle>
                    <CardDescription>
                      Ces informations aident l'IA à fournir des analyses plus précises
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="chronicIllnesses" className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-slate-500" />
                    <span>Maladies chroniques</span>
                  </Label>
                  <Textarea
                    id="chronicIllnesses"
                    value={formData.chronicIllnesses}
                    onChange={(e) => handleInputChange("chronicIllnesses", e.target.value)}
                    placeholder="Ex: Diabète de type 2, Hypertension artérielle..."
                    disabled={!isEditing}
                    className={!isEditing ? "bg-slate-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currentMedications" className="flex items-center space-x-2">
                    <Pill className="w-4 h-4 text-slate-500" />
                    <span>Médicaments actuels</span>
                  </Label>
                  <Textarea
                    id="currentMedications"
                    value={formData.currentMedications}
                    onChange={(e) => handleInputChange("currentMedications", e.target.value)}
                    placeholder="Ex: Paracétamol 500mg (au besoin), Metformine 500mg (2x/jour)..."
                    disabled={!isEditing}
                    className={!isEditing ? "bg-slate-50" : ""}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allergies" className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-slate-500" />
                    <span>Allergies</span>
                  </Label>
                  <Textarea
                    id="allergies"
                    value={formData.allergies}
                    onChange={(e) => handleInputChange("allergies", e.target.value)}
                    placeholder="Ex: Pénicilline, Arachides, Latex..."
                    disabled={!isEditing}
                    className={!isEditing ? "bg-slate-50" : ""}
                  />
                </div>

                {isEditing && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 h-5 text-blue-600 mt-0.5">💡</div>
                      <div className="text-sm">
                        <p className="font-semibold text-blue-800 mb-1">Conseil</p>
                        <p className="text-blue-700">
                          Plus vos informations médicales sont complètes et précises, plus l'analyse de l'IA sera pertinente et personnalisée.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex space-x-3">
                <Button
                  onClick={handleSave}
                  disabled={updateProfileMutation.isPending}
                  className="sehha-button-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateProfileMutation.isPending ? "Sauvegarde..." : "Sauvegarder"}
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  disabled={updateProfileMutation.isPending}
                >
                  Annuler
                </Button>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Account Info */}
            <Card className="sehha-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-emerald-500" />
                  <span>Sécurité du compte</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Email vérifié</span>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Mot de passe</span>
                  <Button size="sm" variant="outline" disabled>
                    Modifier
                  </Button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">2FA</span>
                  <span className="text-xs text-slate-500">Bientôt</span>
                </div>
              </CardContent>
            </Card>

            {/* Data Privacy */}
            <Card className="sehha-card">
              <CardHeader>
                <CardTitle className="text-lg">Confidentialité</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Données cryptées</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Conforme RGPD</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    <span>Pas de partage tiers</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Language Support */}
            <Card className="sehha-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center space-x-2">
                  <Languages className="w-5 h-5 text-sky-500" />
                  <span>Langue de la plateforme</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-3">
                  Sehha+ est disponible uniquement en français, adapté aux utilisateurs francophones au Maroc.
                </p>
                <div className="flex items-center space-x-2 text-sm">
                  <span className="w-4 text-center">🇫🇷</span>
                  <span>Français</span>
                  <span className="ml-2 px-2 py-1 bg-sky-100 text-sky-700 rounded-full text-xs">Actuel</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(Profile);
