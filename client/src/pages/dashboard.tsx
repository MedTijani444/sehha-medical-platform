import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { withAuth, useAuth } from "@/lib/auth";
import Header from "@/components/header";
import { 
  MessageSquare, 
  Plus, 
  FileText, 
  User, 
  Clock, 
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Activity
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

function Dashboard() {
  const { user } = useAuth();
  
  const { data: consultations, isLoading } = useQuery({
    queryKey: ["/api/consultations"],
  });

  const recentConsultations = consultations?.slice(0, 3) || [];
  
  const getUrgencyColor = (level: string) => {
    switch (level) {
      case "low": return "bg-emerald-100 text-emerald-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-slate-100 text-slate-800";
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Bonjour, {user?.fullName} 👋
          </h1>
          <p className="text-slate-600">
            Bienvenue sur votre tableau de bord médical Sehha+
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Link href="/consultation/new">
            <Card className="sehha-card hover:border-sky-300 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                    <Plus className="w-6 h-6 text-sky-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Nouvelle consultation</h3>
                    <p className="text-sm text-slate-600">Commencer l'analyse</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/reports">
            <Card className="sehha-card hover:border-emerald-300 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <FileText className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Mes rapports</h3>
                    <p className="text-sm text-slate-600">{consultations?.length || 0} consultations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/profile">
            <Card className="sehha-card hover:border-slate-300 cursor-pointer group">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <User className="w-6 h-6 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">Mon profil</h3>
                    <p className="text-sm text-slate-600">Gérer mes informations</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Card className="sehha-card">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Suivi santé</h3>
                  <p className="text-sm text-slate-600">Bientôt disponible</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="sehha-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Total consultations</p>
                  <p className="text-2xl font-bold text-slate-900">{consultations?.length || 0}</p>
                </div>
                <Activity className="w-8 h-8 text-sky-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="sehha-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Rapports générés</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {consultations?.filter((c: any) => c.pdfGenerated).length || 0}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="sehha-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Dernière consultation</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {consultations?.length ? 
                      formatDistanceToNow(new Date(consultations[0].createdAt), { locale: fr, addSuffix: true })
                      : "Aucune"
                    }
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Consultations */}
        <Card className="sehha-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5 text-sky-500" />
                  <span>Consultations récentes</span>
                </CardTitle>
                <CardDescription>
                  Vos dernières analyses médicales avec l'IA
                </CardDescription>
              </div>
              <Link href="/reports">
                <Button variant="outline" size="sm">
                  Voir tout
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg">
                    <Skeleton className="w-12 h-12 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="w-20 h-6 rounded-full" />
                  </div>
                ))}
              </div>
            ) : recentConsultations.length > 0 ? (
              <div className="space-y-4">
                {recentConsultations.map((consultation: any) => (
                  <div key={consultation.id} className="flex items-center space-x-4 p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
                      {consultation.urgencyLevel === "urgent" ? (
                        <AlertCircle className="w-6 h-6 text-red-500" />
                      ) : consultation.preDiagnosis ? (
                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                      ) : (
                        <Clock className="w-6 h-6 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-slate-900 truncate">
                        {consultation.symptoms.length > 60 
                          ? consultation.symptoms.substring(0, 60) + "..."
                          : consultation.symptoms
                        }
                      </h4>
                      <p className="text-sm text-slate-600">
                        {formatDistanceToNow(new Date(consultation.createdAt), { locale: fr, addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {consultation.urgencyLevel && (
                        <Badge className={getUrgencyColor(consultation.urgencyLevel)}>
                          {getUrgencyLabel(consultation.urgencyLevel)}
                        </Badge>
                      )}
                      {consultation.preDiagnosis && (
                        <Link href={`/consultation/${consultation.id}/chat`}>
                          <Button size="sm" variant="outline">
                            Voir
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <MessageSquare className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">
                  Aucune consultation pour le moment
                </h3>
                <p className="text-slate-600 mb-6">
                  Commencez votre première consultation médicale avec notre IA
                </p>
                <Link href="/consultation/new">
                  <Button className="sehha-button-primary">
                    <Plus className="w-4 h-4 mr-2" />
                    Nouvelle consultation
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default withAuth(Dashboard);
