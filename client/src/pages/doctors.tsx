import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Phone, Star, Clock, Filter, Heart, Users, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Header from "@/components/header";
import Navigation from "@/components/navigation";
import { apiRequest } from "@/lib/queryClient";
import type { Doctor } from "@shared/schema";

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

const TAGS = ["Urgence", "Disponible", "Top Avis"];

export default function Doctors() {
  const [filters, setFilters] = useState({
    specialty: "",
    city: "",
    tags: [] as string[],
    page: 1
  });

  const { data, isLoading } = useQuery({
    queryKey: ["/api/doctors", { ...filters, limit: 100 }],
  }) as { data: any, isLoading: boolean };

  const handleTagToggle = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
      page: 1
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value === "all" ? "" : value,
      page: 1
    }));
  };

  const clearFilters = () => {
    setFilters({
      specialty: "",
      city: "",
      tags: [],
      page: 1
    });
  };

  const generateGoogleMapsLink = (address: string, doctorName: string) => {
    const query = encodeURIComponent(`${doctorName} ${address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-white">
      <Header />
      <Navigation title="Trouver un Médecin" />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500/10 via-emerald-500/5 to-transparent"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 bg-sky-100 text-sky-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            <span>{data?.total || 57} médecins disponibles</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-slate-900 via-sky-800 to-emerald-800 bg-clip-text text-transparent mb-8 leading-tight">
            Trouver un Médecin
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 max-w-4xl mx-auto mb-12 leading-relaxed">
            Recherchez et trouvez des médecins qualifiés dans votre région. 
            Consultez leurs spécialités, avis et coordonnées pour prendre rendez-vous.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-xl mb-4">
                <Users className="w-8 h-8 text-sky-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">57+</div>
              <div className="text-slate-600">Médecins qualifiés</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-xl mb-4">
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">45</div>
              <div className="text-slate-600">Spécialités médicales</div>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-xl mb-4">
                <MapPin className="w-8 h-8 text-sky-600" />
              </div>
              <div className="text-3xl font-bold text-slate-900 mb-2">14</div>
              <div className="text-slate-600">Villes couvertes</div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">

        {/* Filters */}
        <Card className="mb-12 border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-800">
              <Filter className="h-5 w-5 text-sky-600" />
              Filtres de recherche
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Specialty Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spécialité
                </label>
                <Select value={filters.specialty} onValueChange={(value) => handleFilterChange("specialty", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les spécialités" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les spécialités</SelectItem>
                    {SPECIALTIES.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ville
                </label>
                <Select value={filters.city} onValueChange={(value) => handleFilterChange("city", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Toutes les villes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Toutes les villes</SelectItem>
                    {MOROCCAN_CITIES.map(city => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtres supplémentaires
                </label>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(tag => (
                    <Badge
                      key={tag}
                      variant={filters.tags.includes(tag) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Clear Filters */}
            <div className="mt-4 flex justify-between items-center">
              <Button variant="outline" onClick={clearFilters}>
                Effacer les filtres
              </Button>
              <p className="text-sm text-gray-600">
                {data?.total || 0} médecin(s) trouvé(s)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}



        {/* Doctors Grid */}
        {!isLoading && data?.doctors && data.doctors.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.doctors.map((doctor: any) => (
              <Card key={doctor.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-105">
                <CardContent className="p-8">
                  {/* Doctor Header */}
                  <div className="mb-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-emerald-500 rounded-full flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                          {doctor.fullName}
                        </h3>
                        <p className="text-sky-600 font-semibold">
                          {doctor.specialty}
                        </p>
                      </div>
                    </div>
                    <p className="text-slate-600 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      {doctor.city}
                    </p>
                  </div>

                  {/* Experience and Rating */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        {doctor.yearsExperience} ans d'expérience
                      </span>
                    </div>
                    {doctor.rating && doctor.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">
                          {doctor.rating}/5
                        </span>
                        <span className="text-xs text-gray-500">
                          ({doctor.reviewCount} avis)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  {doctor.tags && Array.isArray(doctor.tags) && doctor.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {doctor.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <a href={`tel:${doctor.phoneNumber}`} className="hover:text-blue-600">
                        {doctor.phoneNumber}
                      </a>
                    </p>
                    <p className="text-sm text-gray-600">
                      {doctor.address}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(generateGoogleMapsLink(doctor.address, doctor.fullName), '_blank')}
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      Voir sur la carte
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(`tel:${doctor.phoneNumber}`, '_self')}
                    >
                      <Phone className="h-4 w-4 mr-1" />
                      Appeler
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && data?.doctors && data.doctors.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun médecin trouvé
              </h3>
              <p className="text-gray-600 mb-4">
                Essayez de modifier vos critères de recherche
              </p>
              <Button onClick={clearFilters}>
                Effacer les filtres
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Pagination */}
        {data && data.total > 12 && (
          <div className="flex justify-center mt-8">
            <div className="flex gap-2">
              <Button
                variant="outline"
                disabled={filters.page === 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
              >
                Précédent
              </Button>
              <span className="flex items-center px-4 text-sm text-gray-600">
                Page {filters.page}
              </span>
              <Button
                variant="outline"
                disabled={filters.page * 12 >= data.total}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
              >
                Suivant
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}