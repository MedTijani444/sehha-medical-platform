import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  QrCode, 
  Plus, 
  Download, 
  Eye, 
  Calendar, 
  Pill, 
  AlertTriangle, 
  Heart,
  FileText,
  Phone,
  ArrowLeft,
  User,
  Shield
} from "lucide-react";
import Navigation from "@/components/navigation";
import type { 
  HealthPassport, 
  MedicalRecord, 
  Medication, 
  EmergencyContact,
  InsertMedicalRecord,
  InsertMedication
} from "@shared/schema";

export default function HealthPassportPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [showQRDialog, setShowQRDialog] = useState(false);

  // Fetch health passport data
  const { data: healthPassport, isLoading: passportLoading } = useQuery({
    queryKey: ["/api/health-passport"],
    enabled: !!user,
  });

  const { data: medicalRecords } = useQuery({
    queryKey: ["/api/medical-records"],
    enabled: !!user,
  });

  const { data: medications } = useQuery({
    queryKey: ["/api/medications"],
    enabled: !!user,
  });

  // Generate QR Code
  const generateQRCode = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("/api/health-passport/qr-code", "POST", {});
      return await response.json();
    },
    onSuccess: (data: any) => {
      console.log("QR Code response:", data);
      if (data.qrCodeUrl) {
        setQrCodeUrl(data.qrCodeUrl);
        setShowQRDialog(true);
        toast({
          title: "Succès",
          description: "Code QR généré avec succès",
        });
      } else {
        toast({
          title: "Erreur",
          description: "Données du QR code manquantes",
          variant: "destructive",
        });
      }
    },
    onError: (error: any) => {
      console.error("QR Code generation error:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le code QR",
        variant: "destructive",
      });
    },
  });

  // Create medical record
  const addMedicalRecord = useMutation({
    mutationFn: async (data: InsertMedicalRecord) => {
      return apiRequest("/api/medical-records", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medical-records"] });
      toast({
        title: "Succès",
        description: "Dossier médical ajouté avec succès",
      });
    },
  });

  // Create medication
  const addMedication = useMutation({
    mutationFn: async (data: InsertMedication) => {
      const response = await apiRequest("/api/medications", "POST", data);
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medications"] });
      toast({
        title: "Succès",
        description: "Médicament ajouté avec succès",
      });
    },
    onError: (error: any) => {
      console.error("Error adding medication:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter le médicament",
        variant: "destructive",
      });
    },
  });

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case "vaccination": return <Shield className="h-4 w-4" />;
      case "allergy": return <AlertTriangle className="h-4 w-4" />;
      case "medication": return <Pill className="h-4 w-4" />;
      case "condition": return <Heart className="h-4 w-4" />;
      case "lab_result": return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "vaccination": return "bg-green-100 text-green-800";
      case "allergy": return "bg-red-100 text-red-800";
      case "medication": return "bg-blue-100 text-blue-800";
      case "condition": return "bg-orange-100 text-orange-800";
      case "lab_result": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (passportLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-white">
      <Navigation title="Passeport Santé" />
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header with QR Code */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Passeport Santé</h1>
            <p className="text-gray-600">Votre dossier médical numérique sécurisé</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => generateQRCode.mutate()}
            disabled={generateQRCode.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <QrCode className="h-4 w-4 mr-2" />
            Générer QR Code
          </Button>
          
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Télécharger PDF
          </Button>
        </div>

      {/* QR Code Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Code QR - Passeport Santé</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            {qrCodeUrl ? (
              <img 
                src={qrCodeUrl} 
                alt="QR Code Passeport Santé" 
                className="w-64 h-64 border rounded-lg bg-white"
              />
            ) : (
              <div className="w-64 h-64 border rounded-lg bg-gray-100 flex items-center justify-center">
                <p className="text-gray-500">Génération du code QR...</p>
              </div>
            )}
            <div className="text-center text-sm text-gray-600">
              <p>Scannez ce code pour accéder aux informations d'urgence</p>
              <p className="font-medium mt-2">Contient toutes vos données médicales d'urgence</p>
            </div>
            <div className="flex gap-2 w-full">
              <Button 
                onClick={() => window.print()} 
                variant="outline" 
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Imprimer
              </Button>
              <Button 
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin + "/passport/" + healthPassport?.qrCode);
                  toast({ title: "Lien copié", description: "Lien du passeport copié" });
                }}
                className="flex-1"
              >
                Partager
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Vaccinations</p>
                <p className="text-2xl font-bold">
                  {medicalRecords?.filter((r: MedicalRecord) => r.recordType === 'vaccination').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Pill className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Médicaments actifs</p>
                <p className="text-2xl font-bold">
                  {medications?.filter((m: Medication) => m.isActive).length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Allergies</p>
                <p className="text-2xl font-bold">
                  {medicalRecords?.filter((r: MedicalRecord) => r.recordType === 'allergy').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center">
              <Heart className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Conditions</p>
                <p className="text-2xl font-bold">
                  {medicalRecords?.filter((r: MedicalRecord) => r.recordType === 'condition').length || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Medical Records */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Dossiers Médicaux
                </CardTitle>
                <AddMedicalRecordDialog onAdd={(data) => addMedicalRecord.mutate(data)} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {medicalRecords?.map((record: MedicalRecord) => (
                <div key={record.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                  <div className={`p-2 rounded-full ${getRecordTypeColor(record.recordType)}`}>
                    {getRecordTypeIcon(record.recordType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{record.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {new Date(record.date).toLocaleDateString('fr-FR')}
                      </Badge>
                    </div>
                    {record.description && (
                      <p className="text-sm text-gray-600 mt-1">{record.description}</p>
                    )}
                    {record.doctor && (
                      <p className="text-xs text-gray-500 mt-1">Dr. {record.doctor}</p>
                    )}
                  </div>
                </div>
              ))}
              
              {(!medicalRecords || medicalRecords.length === 0) && (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun dossier médical</p>
                  <p className="text-sm">Commencez par ajouter vos vaccinations et allergies</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Medications */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Pill className="h-5 w-5 mr-2" />
                  Médicaments
                </CardTitle>
                <AddMedicationDialog onAdd={(data) => addMedication.mutate(data)} />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {medications && medications.length > 0 ? (
                medications
                  .filter((m: any) => m.isActive !== false)
                  .map((medication: any) => (
                    <div key={medication.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-800">
                        <Pill className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">{medication.name}</h4>
                          <Badge variant="outline">{medication.frequency}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">{medication.dosage}</p>
                        {medication.prescribedBy && (
                          <p className="text-xs text-gray-500 mt-1">Prescrit par Dr. {medication.prescribedBy}</p>
                        )}
                        {medication.instructions && (
                          <p className="text-xs text-gray-600 mt-1">{medication.instructions}</p>
                        )}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Pill className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Aucun médicament actif</p>
                  <p className="text-sm">Ajoutez vos médicaments actuels</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Emergency Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-red-600">
                <Phone className="h-5 w-5 mr-2" />
                Contacts d'Urgence
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {healthPassport?.emergencyContacts?.map((contact: EmergencyContact, index: number) => (
                <div key={index} className="p-3 border rounded-lg">
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.relationship}</p>
                  <p className="text-sm font-mono">{contact.phone}</p>
                </div>
              ))}
              
              <Button variant="outline" size="sm" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter Contact
              </Button>
            </CardContent>
          </Card>

          {/* Critical Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-orange-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Informations Critiques
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Groupe Sanguin</Label>
                <p className="text-lg font-bold text-red-600">{healthPassport?.bloodType || "Non renseigné"}</p>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium">Allergies Critiques</Label>
                <div className="mt-2 space-y-1">
                  {healthPassport?.criticalAllergies?.map((allergy: string, index: number) => (
                    <Badge key={index} variant="destructive" className="mr-2">
                      {allergy}
                    </Badge>
                  ))}
                  {(!healthPassport?.criticalAllergies?.length) && (
                    <p className="text-sm text-gray-500">Aucune allergie critique</p>
                  )}
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">Assurance Maladie</Label>
                <p className="text-sm">{healthPassport?.insuranceProvider || "Non renseigné"}</p>
                {healthPassport?.insuranceNumber && (
                  <p className="text-xs font-mono text-gray-600">{healthPassport.insuranceNumber}</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Add Medical Record Dialog Component  
function AddMedicalRecordDialog({ onAdd }: { onAdd: (data: InsertMedicalRecord) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertMedicalRecord>>({
    recordType: "vaccination",
    date: new Date(),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.recordType) return;
    
    onAdd({
      ...formData,
      userId: 1, // Will be set by backend from auth
    } as InsertMedicalRecord);
    
    setOpen(false);
    setFormData({ recordType: "vaccination", date: new Date() });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un Dossier Médical</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Type</Label>
            <Select 
              value={formData.recordType} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, recordType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vaccination">Vaccination</SelectItem>
                <SelectItem value="allergy">Allergie</SelectItem>
                <SelectItem value="condition">Condition Médicale</SelectItem>
                <SelectItem value="lab_result">Résultat d'Analyse</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Titre</Label>
            <Input
              value={formData.title || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Vaccin COVID-19, Allergie aux arachides..."
              required
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={formData.description || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Détails supplémentaires..."
            />
          </div>

          <div>
            <Label>Date</Label>
            <Input
              type="date"
              value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ""}
              onChange={(e) => setFormData(prev => ({ ...prev, date: new Date(e.target.value) }))}
              required
            />
          </div>

          <div>
            <Label>Médecin</Label>
            <Input
              value={formData.doctor || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
              placeholder="Nom du médecin"
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Add Medication Dialog Component
function AddMedicationDialog({ onAdd }: { onAdd: (data: InsertMedication) => void }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<InsertMedication>>({
    frequency: "daily",
    startDate: new Date(),
    reminderEnabled: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) return;
    
    onAdd({
      ...formData,
      userId: 1, // Will be set by backend from auth
    } as InsertMedication);
    
    setOpen(false);
    setFormData({ frequency: "daily", startDate: new Date(), reminderEnabled: true });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Ajouter
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter un Médicament</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nom du médicament</Label>
            <Input
              value={formData.name || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Paracétamol, Doliprane..."
              required
            />
          </div>

          <div>
            <Label>Dosage</Label>
            <Input
              value={formData.dosage || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
              placeholder="Ex: 500mg, 1 comprimé..."
              required
            />
          </div>

          <div>
            <Label>Fréquence</Label>
            <Select 
              value={formData.frequency} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Quotidien</SelectItem>
                <SelectItem value="twice_daily">2 fois par jour</SelectItem>
                <SelectItem value="three_times_daily">3 fois par jour</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="as_needed">Au besoin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Prescrit par</Label>
            <Input
              value={formData.prescribedBy || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, prescribedBy: e.target.value }))}
              placeholder="Nom du médecin"
            />
          </div>

          <div>
            <Label>Instructions</Label>
            <Textarea
              value={formData.instructions || ""}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="Instructions spéciales..."
            />
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1">
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}