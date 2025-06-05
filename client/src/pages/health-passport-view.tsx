import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Heart, User, Phone, Shield, Calendar, Pill, FileText, AlertTriangle } from "lucide-react";

export default function HealthPassportView() {
  const [match, params] = useRoute("/health-passport/:userId");
  const userId = params?.userId;

  const { data: healthPassport, isLoading } = useQuery({
    queryKey: ["/api/health-passport/public", userId],
    enabled: !!userId,
  });

  const { data: medicalRecords } = useQuery({
    queryKey: ["/api/medical-records/public", userId],
    enabled: !!userId,
  });

  const { data: medications } = useQuery({
    queryKey: ["/api/medications/public", userId],
    enabled: !!userId,
  });

  const { data: userInfo } = useQuery({
    queryKey: ["/api/user/public", userId],
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Chargement du passeport santé...</p>
        </div>
      </div>
    );
  }

  if (!healthPassport || !userInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-6">
            <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Passeport non trouvé</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Ce passeport santé n'existe pas ou n'est pas accessible.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "critical": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "high": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      default: return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-white/80 backdrop-blur-sm border-green-200 dark:bg-gray-800/80 dark:border-gray-700">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                <Heart className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <CardTitle className="text-2xl text-green-800 dark:text-green-400">
              Passeport Santé Sehha+
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-300">
              Informations médicales d'urgence
            </p>
          </CardHeader>
        </Card>

        {/* Patient Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Informations du Patient
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nom complet</p>
                <p className="font-semibold">{userInfo.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Âge</p>
                <p className="font-semibold">{userInfo.age || "Non spécifié"} ans</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Genre</p>
                <p className="font-semibold">{userInfo.gender || "Non spécifié"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Groupe sanguin</p>
                <p className="font-semibold">{healthPassport.bloodType || "Non spécifié"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Emergency Contacts */}
        {healthPassport.emergencyContacts && healthPassport.emergencyContacts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contacts d'Urgence
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {healthPassport.emergencyContacts.map((contact: any, index: number) => (
                  <div key={index} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{contact.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{contact.relationship}</p>
                      </div>
                      <p className="font-mono text-sm">{contact.phone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Critical Allergies */}
        {healthPassport.criticalAllergies && (
          <Card className="border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertTriangle className="h-5 w-5" />
                Allergies Critiques
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                <p className="text-red-800 dark:text-red-300 font-semibold">
                  ⚠️ {healthPassport.criticalAllergies}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Medications */}
        {medications && medications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Médicaments Actuels
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medications.map((medication: any) => (
                  <div key={medication.id} className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{medication.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {medication.dosage} - {medication.frequency}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {medication.isActive ? "Actif" : "Inactif"}
                      </Badge>
                    </div>
                    {medication.notes && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {medication.notes}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Medical Records */}
        {medicalRecords && medicalRecords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Dossiers Médicaux Récents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {medicalRecords.slice(0, 5).map((record: any) => (
                  <div key={record.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold">{record.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {record.recordType}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-mono">
                          {new Date(record.date).toLocaleDateString('fr-FR')}
                        </p>
                        {record.urgencyLevel && (
                          <Badge className={getUrgencyColor(record.urgencyLevel)}>
                            {record.urgencyLevel}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {record.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        {record.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Insurance Information */}
        {healthPassport.insuranceProvider && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Assurance Maladie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Assureur</p>
                  <p className="font-semibold">{healthPassport.insuranceProvider}</p>
                </div>
                {healthPassport.insuranceNumber && (
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Numéro</p>
                    <p className="font-mono">{healthPassport.insuranceNumber}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <Card className="bg-gray-50 dark:bg-gray-800">
          <CardContent className="text-center p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Ce passeport santé a été généré par Sehha+ • Plateforme de pré-diagnostic médical IA
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Dernière mise à jour: {new Date().toLocaleDateString('fr-FR')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}