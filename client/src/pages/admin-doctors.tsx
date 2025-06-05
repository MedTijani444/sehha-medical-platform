import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Users, BarChart3, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import type { Doctor, InsertDoctor } from "@shared/schema";

const SPECIALTIES = [
  "Cardiologie",
  "Neurologie", 
  "Pédiatrie",
  "Dermatologie",
  "Orthopédie",
  "Gynécologie",
  "Psychiatrie",
  "Ophtalmologie",
  "ORL",
  "Gastroentérologie",
  "Endocrinologie",
  "Pneumologie"
];

const MOROCCAN_CITIES = [
  "Casablanca",
  "Rabat",
  "Marrakech",
  "Fès",
  "Tanger",
  "Agadir",
  "Meknès",
  "Oujda",
  "Kénitra",
  "Tétouan",
  "Safi",
  "El Jadida",
  "Nador",
  "Settat",
  "Mohammedia",
  "Salé"
];

const AVAILABLE_TAGS = ["Urgence", "Disponible", "Top Avis"];

interface DoctorFormData extends Omit<InsertDoctor, 'tags'> {
  tags: string[];
}

export default function AdminDoctors() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Simple authentication check using token
  const token = localStorage.getItem('authToken');
  const isAuthenticated = !!token;
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState<DoctorFormData>({
    fullName: "",
    specialty: "",
    city: "",
    phoneNumber: "",
    address: "",
    yearsExperience: 0,
    tags: []
  });

  // Redirect if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">Accès restreint</h2>
            <p className="text-gray-600">Vous devez être connecté pour accéder à cette page.</p>
            <Button 
              className="mt-4" 
              onClick={() => window.location.href = '/auth'}
            >
              Se connecter
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Fetch doctors
  const { data: doctorsData, isLoading } = useQuery({
    queryKey: ["/api/doctors", { limit: 100 }],
    queryFn: () => apiRequest("/api/doctors?limit=100")
  });

  // Fetch stats
  const { data: statsData } = useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: () => apiRequest("/api/admin/stats")
  });

  // Create doctor mutation
  const createMutation = useMutation({
    mutationFn: (data: DoctorFormData) => 
      apiRequest("POST", "/api/admin/doctors", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/doctors"] });
      setIsDialogOpen(false);
      resetForm();
      toast({
        title: "Succès",
        description: "Médecin ajouté avec succès"
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de l'ajout du médecin",
        variant: "destructive"
      });
    }
  });

  // Update doctor mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<DoctorFormData> }) =>
      apiRequest("PUT", `/api/admin/doctors/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/doctors"] });
      setIsDialogOpen(false);
      setEditingDoctor(null);
      resetForm();
      toast({
        title: "Succès",
        description: "Médecin mis à jour avec succès"
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la mise à jour du médecin",
        variant: "destructive"
      });
    }
  });

  // Delete doctor mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      apiRequest("DELETE", `/api/admin/doctors/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/doctors"] });
      toast({
        title: "Succès",
        description: "Médecin supprimé avec succès"
      });
    },
    onError: () => {
      toast({
        title: "Erreur",
        description: "Erreur lors de la suppression du médecin",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      fullName: "",
      specialty: "",
      city: "",
      phoneNumber: "",
      address: "",
      yearsExperience: 0,
      tags: []
    });
    setEditingDoctor(null);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      fullName: doctor.fullName,
      specialty: doctor.specialty,
      city: doctor.city,
      phoneNumber: doctor.phoneNumber,
      address: doctor.address,
      yearsExperience: doctor.yearsExperience,
      tags: Array.isArray(doctor.tags) ? doctor.tags : []
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDoctor) {
      updateMutation.mutate({ id: editingDoctor.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Administration - Médecins
            </h1>
            <p className="text-xl text-gray-600">
              Gérez les médecins et consultez les statistiques
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un médecin
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingDoctor ? "Modifier le médecin" : "Ajouter un nouveau médecin"}
                </DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Nom complet *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="specialty">Spécialité *</Label>
                    <Select value={formData.specialty} onValueChange={(value) => setFormData(prev => ({ ...prev, specialty: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une spécialité" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPECIALTIES.map(specialty => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="city">Ville *</Label>
                    <Select value={formData.city} onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner une ville" />
                      </SelectTrigger>
                      <SelectContent>
                        {MOROCCAN_CITIES.map(city => (
                          <SelectItem key={city} value={city}>
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="phoneNumber">Numéro de téléphone *</Label>
                    <Input
                      id="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="+212 ..."
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="yearsExperience">Années d'expérience *</Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.yearsExperience}
                      onChange={(e) => setFormData(prev => ({ ...prev, yearsExperience: parseInt(e.target.value) || 0 }))}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="address">Adresse *</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    required
                  />
                </div>
                
                <div>
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {AVAILABLE_TAGS.map(tag => (
                      <Badge
                        key={tag}
                        variant={formData.tags.includes(tag) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    {editingDoctor ? "Modifier" : "Ajouter"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Médecins</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{doctorsData?.total || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recherches Populaires</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsData?.searchStats?.length || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Différentes recherches
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Médecins Actifs</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {doctorsData?.doctors?.filter((d: Doctor) => d.isActive).length || 0}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Stats */}
        {statsData?.searchStats && statsData.searchStats.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Statistiques de recherche</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {statsData.searchStats.slice(0, 10).map((stat: any, index: number) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-sm">
                      {stat.specialty} - {stat.city}
                    </span>
                    <Badge variant="outline">
                      {stat.searchCount} recherche(s)
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Doctors Table */}
        <Card>
          <CardHeader>
            <CardTitle>Liste des médecins</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {doctorsData?.doctors?.map((doctor: Doctor) => (
                  <div key={doctor.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold">{doctor.fullName}</h3>
                      <p className="text-sm text-gray-600">
                        {doctor.specialty} • {doctor.city} • {doctor.yearsExperience} ans
                      </p>
                      <p className="text-sm text-gray-500">{doctor.phoneNumber}</p>
                      {doctor.tags && Array.isArray(doctor.tags) && doctor.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {doctor.tags.map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant={doctor.isActive ? "default" : "secondary"}>
                        {doctor.isActive ? "Actif" : "Inactif"}
                      </Badge>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(doctor)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteMutation.mutate(doctor.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}