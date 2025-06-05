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
import Navigation from "@/components/navigation";
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

  // Mutations
  const addMedicalRecord = useMutation({
    mutationFn: (data: InsertMedicalRecord) => apiRequest("POST", "/api/medical-records", { body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medical-records"] });
      toast({ title: "Dossier médical ajouté", description: "Le dossier a été enregistré avec succès" });
    },
  });

  const addMedication = useMutation({
    mutationFn: (data: InsertMedication) => apiRequest("POST", "/api/medications", { body: JSON.stringify(data) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/medications"] });
      toast({ title: "Médicament ajouté", description: "Le médicament a été enregistré avec succès" });
    },
  });

  const generateQRCode = useMutation({
    mutationFn: () => apiRequest("POST", "/api/health-passport/qr-code"),
    onSuccess: async (response) => {
      const data = await response.json();
      console.log("QR Code response:", data);
      setQrCodeUrl(data.qrCodeUrl);
      setShowQRDialog(true);
      queryClient.invalidateQueries({ queryKey: ["/api/health-passport"] });
      toast({ title: "QR Code généré", description: "Votre code QR est prêt" });
    },
  });

  const getRecordTypeIcon = (type: string) => {
    switch (type) {
      case "vaccination": return <Shield className="h-4 w-4" />;
      case "allergy": return <AlertTriangle className="h-4 w-4" />;
      case "surgery": return <Heart className="h-4 w-4" />;
      case "prescription": return <Pill className="h-4 w-4" />;
      case "lab_result": return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "vaccination": return "bg-green-100 text-green-800";
      case "allergy": return "bg-red-100 text-red-800";
      case "surgery": return "bg-blue-100 text-blue-800";
      case "prescription": return "bg-purple-100 text-purple-800";
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
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dossiers Médicaux</p>
                  <p className="text-2xl font-bold">{medicalRecords?.filter((r: any) => r.recordType === "vaccination").length || 0}</p>
                </div>
                <Shield className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Allergies</p>
                  <p className="text-2xl font-bold">{medicalRecords?.filter((r: any) => r.recordType === "allergy").length || 0}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Chirurgies</p>
                  <p className="text-2xl font-bold">{medicalRecords?.filter((r: any) => r.recordType === "surgery").length || 0}</p>
                </div>
                <Heart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Médicaments Actifs</p>
                  <p className="text-2xl font-bold">{medicalRecords?.filter((r: any) => r.recordType === "prescription").length || 0}</p>
                </div>
                <Pill className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Medical Records */}
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
              {medicalRecords && medicalRecords.length > 0 ? (
                medicalRecords.map((record: any) => (
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
                ))
              ) : (
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
            <CardContent>
              {healthPassport?.emergencyContacts && healthPassport.emergencyContacts.length > 0 ? (
                <div className="space-y-3">
                  {healthPassport.emergencyContacts.map((contact: any, index: number) => (
                    <div key={index} className="p-3 bg-red-50 rounded-lg border border-red-200">
                      <div className="font-medium text-red-900">{contact.name}</div>
                      <div className="text-sm text-red-700">{contact.relationship}</div>
                      <div className="text-sm font-mono text-red-800">{contact.phone}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Aucun contact d'urgence configuré</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm text-gray-500">Groupe Sanguin</Label>
                <p className="font-medium">{healthPassport?.bloodType || "Non renseigné"}</p>
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm text-gray-500">Allergies Critiques</Label>
                {healthPassport?.criticalAllergies ? (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
                    {healthPassport.criticalAllergies}
                  </div>
                ) : (
                  <p className="text-gray-500">Aucune allergie critique</p>
                )}
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm text-gray-500">Assurance</Label>
                <p className="font-medium">{healthPassport?.insuranceProvider || "Non renseigné"}</p>
                {healthPassport?.insuranceNumber && (
                  <p className="text-sm text-gray-600">N° {healthPassport.insuranceNumber}</p>
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
  const [formData, setFormData] = useState({
    title: "",
    recordType: "vaccination" as const,
    date: new Date().toISOString().split('T')[0],
    description: "",
    doctor: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.recordType) return;
    
    onAdd({
      ...formData,
      date: new Date(formData.date)
    } as InsertMedicalRecord);
    
    setOpen(false);
    setFormData({
      title: "",
      recordType: "vaccination",
      date: new Date().toISOString().split('T')[0],
      description: "",
      doctor: ""
    });
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
            <Label htmlFor="title">Titre *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Vaccin COVID-19"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="recordType">Type *</Label>
            <Select
              value={formData.recordType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, recordType: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="vaccination">Vaccination</SelectItem>
                <SelectItem value="allergy">Allergie</SelectItem>
                <SelectItem value="surgery">Chirurgie</SelectItem>
                <SelectItem value="prescription">Prescription</SelectItem>
                <SelectItem value="condition">Condition médicale</SelectItem>
                <SelectItem value="lab_result">Résultat de laboratoire</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
            />
          </div>
          
          <div>
            <Label htmlFor="doctor">Médecin</Label>
            <Input
              id="doctor"
              value={formData.doctor}
              onChange={(e) => setFormData(prev => ({ ...prev, doctor: e.target.value }))}
              placeholder="Dr. Martin Dubois"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Notes additionnelles..."
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
  const [formData, setFormData] = useState({
    name: "",
    dosage: "",
    frequency: "daily" as const,
    startDate: new Date().toISOString().split('T')[0],
    prescribedBy: "",
    instructions: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.dosage) return;
    
    onAdd({
      ...formData,
      startDate: new Date(formData.startDate),
      isActive: true
    } as InsertMedication);
    
    setOpen(false);
    setFormData({
      name: "",
      dosage: "",
      frequency: "daily",
      startDate: new Date().toISOString().split('T')[0],
      prescribedBy: "",
      instructions: ""
    });
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
            <Label htmlFor="name">Nom du médicament *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Ex: Doliprane"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="dosage">Dosage *</Label>
            <Input
              id="dosage"
              value={formData.dosage}
              onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
              placeholder="Ex: 500mg"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="frequency">Fréquence</Label>
            <Select
              value={formData.frequency}
              onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value as any }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Quotidien</SelectItem>
                <SelectItem value="twice_daily">2x par jour</SelectItem>
                <SelectItem value="three_times_daily">3x par jour</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="as_needed">Au besoin</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="prescribedBy">Prescrit par</Label>
            <Input
              id="prescribedBy"
              value={formData.prescribedBy}
              onChange={(e) => setFormData(prev => ({ ...prev, prescribedBy: e.target.value }))}
              placeholder="Dr. Martin Dubois"
            />
          </div>
          
          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
              placeholder="À prendre avec de la nourriture..."
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