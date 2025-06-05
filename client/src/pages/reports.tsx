import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { withAuth } from "@/lib/auth";
import { consultationApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import { 
  FileText, 
  Download, 
  Search, 
  Calendar,
  Eye,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Filter,
  TrendingUp
} from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow, format } from "date-fns";
import { fr } from "date-fns/locale";

function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "pending">("all");
  const [generatingPdf, setGeneratingPdf] = useState<number | null>(null);
  const { toast } = useToast();

  const { data: consultations, isLoading } = useQuery({
    queryKey: ["/api/consultations"],
  });

  const handleGeneratePdf = async (consultationId: number) => {
    setGeneratingPdf(consultationId);
    try {
      const blob = await consultationApi.generatePDF(consultationId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `consultation-${consultationId}-${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "PDF téléchargé",
        description: "Votre rapport a été téléchargé avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la génération du PDF",
        variant: "destructive",
      });
    } finally {
      setGeneratingPdf(null);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "low": return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high": return "bg-orange-100 text-orange-800 border-orange-200";
      case "urgent": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  const getUrgencyLabel = (level: string) => {
    switch (level) {
      case "low": return "Faible";
      case "medium": return "Modérée";
      case "high": return "Élevée";
      case "urgent": return "Urgente";
      default: return "Non évalué";
    }
  };

  const getStatusIcon = (consultation: any) => {
    if (consultation.preDiagnosis) {
      return <CheckCircle className="w-4 h-4 text-emerald-500" />;
    } else {
      return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusLabel = (consultation: any) => {
    if (consultation.preDiagnosis) {
      return "Terminée";
    } else {
      return "En cours";
    }
  };

  const getStatusColor = (consultation: any) => {
    if (consultation.preDiagnosis) {
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    } else {
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  // Filter consultations
  const filteredConsultations = consultations?.filter((consultation: any) => {
    const matchesSearch = consultation.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterStatus === "all" ||
      (filterStatus === "completed" && consultation.preDiagnosis) ||
      (filterStatus === "pending" && !consultation.preDiagnosis);
    
    return matchesSearch && matchesFilter;
  }) || [];

  const completedConsultations = consultations?.filter((c: any) => c.preDiagnosis).length || 0;
  const pendingConsultations = consultations?.filter((c: any) => !c.preDiagnosis).length || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">Mes rapports</h1>
              <p className="text-slate-600">
                Consultez et téléchargez vos analyses médicales
              </p>
            </div>
            <Link href="/consultation/new">
              <Button className="sehha-button-primary">
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle consultation
              </Button>
            </Link>
          </div>

          {/* Statistics */}
          <div className="grid sm:grid-cols-3 gap-4 mb-6">
            <Card className="sehha-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Total</p>
                    <p className="text-2xl font-bold text-slate-900">{consultations?.length || 0}</p>
                  </div>
                  <FileText className="w-8 h-8 text-sky-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="sehha-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">Terminées</p>
                    <p className="text-2xl font-bold text-slate-900">{completedConsultations}</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-emerald-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="sehha-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-600">En cours</p>
                    <p className="text-2xl font-bold text-slate-900">{pendingConsultations}</p>
                  </div>
                  <Clock className="w-8 h-8 text-yellow-500" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Rechercher dans vos consultations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterStatus === "all" ? "default" : "outline"}
                onClick={() => setFilterStatus("all")}
                size="sm"
              >
                Toutes
              </Button>
              <Button
                variant={filterStatus === "completed" ? "default" : "outline"}
                onClick={() => setFilterStatus("completed")}
                size="sm"
              >
                Terminées
              </Button>
              <Button
                variant={filterStatus === "pending" ? "default" : "outline"}
                onClick={() => setFilterStatus("pending")}
                size="sm"
              >
                En cours
              </Button>
            </div>
          </div>
        </div>

        {/* Consultations List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="sehha-card">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <div className="flex space-x-2">
                      <Skeleton className="w-20 h-6 rounded-full" />
                      <Skeleton className="w-24 h-8 rounded-lg" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredConsultations.length > 0 ? (
          <div className="space-y-4">
            {filteredConsultations.map((consultation: any) => (
              <Card key={consultation.id} className="sehha-card hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    {/* Status Icon */}
                    <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                      {getStatusIcon(consultation)}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-900 mb-1">
                            {consultation.symptoms.length > 80 
                              ? consultation.symptoms.substring(0, 80) + "..."
                              : consultation.symptoms
                            }
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-600">
                            <span className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>{format(new Date(consultation.createdAt), "PPp", { locale: fr })}</span>
                            </span>
                            {consultation.duration && (
                              <span>Durée: {consultation.duration}</span>
                            )}
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex items-center space-x-3 ml-4">
                          <Badge className={`${getStatusColor(consultation)} border`}>
                            {getStatusIcon(consultation)}
                            <span className="ml-1">{getStatusLabel(consultation)}</span>
                          </Badge>

                          {consultation.urgencyLevel && (
                            <Badge className={`${getUrgencyColor(consultation.urgencyLevel)} border`}>
                              {consultation.urgencyLevel === "urgent" && <AlertCircle className="w-3 h-3 mr-1" />}
                              {getUrgencyLabel(consultation.urgencyLevel)}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Pre-diagnosis summary */}
                      {consultation.preDiagnosis && (
                        <div className="bg-slate-50 rounded-lg p-3 mb-3">
                          <p className="text-sm text-slate-700 line-clamp-2">
                            {consultation.preDiagnosis.length > 150 
                              ? consultation.preDiagnosis.substring(0, 150) + "..."
                              : consultation.preDiagnosis
                            }
                          </p>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div className="flex items-center space-x-3">
                        <Link href={`/consultation/${consultation.id}/chat`}>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-2" />
                            Voir détails
                          </Button>
                        </Link>

                        {consultation.preDiagnosis && (
                          <Button
                            size="sm"
                            onClick={() => handleGeneratePdf(consultation.id)}
                            disabled={generatingPdf === consultation.id}
                            className="sehha-button-primary"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            {generatingPdf === consultation.id ? "Génération..." : "PDF"}
                          </Button>
                        )}

                        {!consultation.preDiagnosis && (
                          <Link href={`/consultation/${consultation.id}/chat`}>
                            <Button size="sm" className="sehha-button-primary">
                              Continuer l'analyse
                            </Button>
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="sehha-card">
            <CardContent className="text-center py-12">
              {searchTerm || filterStatus !== "all" ? (
                <>
                  <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Aucun résultat trouvé
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Essayez de modifier vos critères de recherche ou de filtre
                  </p>
                  <Button
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                    }}
                    variant="outline"
                  >
                    Effacer les filtres
                  </Button>
                </>
              ) : (
                <>
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-900 mb-2">
                    Aucune consultation pour le moment
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Commencez votre première consultation médicale avec notre IA pour générer votre premier rapport
                  </p>
                  <Link href="/consultation/new">
                    <Button className="sehha-button-primary">
                      <Plus className="w-4 h-4 mr-2" />
                      Nouvelle consultation
                    </Button>
                  </Link>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Help Section */}
        <Card className="sehha-card mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-sky-500" />
              <span>Optimisez vos consultations</span>
            </CardTitle>
            <CardDescription>
              Conseils pour tirer le meilleur parti de Sehha+
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-sky-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Soyez précis</h4>
                <p className="text-sm text-slate-600">
                  Plus vous décrivez vos symptômes en détail, plus l'analyse sera pertinente
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Download className="w-6 h-6 text-emerald-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Partagez vos rapports</h4>
                <p className="text-sm text-slate-600">
                  Téléchargez vos PDF et apportez-les lors de vos consultations médicales
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <h4 className="font-semibold text-slate-900 mb-2">Suivez votre historique</h4>
                <p className="text-sm text-slate-600">
                  Gardez une trace de l'évolution de votre santé avec vos consultations passées
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAuth(Reports);
