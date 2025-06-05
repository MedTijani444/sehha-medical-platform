import { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { consultationApi } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Navigation from "@/components/navigation";

import { 
  MessageSquare, 
  ArrowLeft, 
  Send, 
  Bot, 
  User, 
  FileText,
  Download,
  AlertCircle,
  CheckCircle,
  Heart,
  Clock,
  Brain
} from "lucide-react";
import { Link } from "wouter";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";

function Chat() {
  const { id } = useParams<{ id: string }>();
  const consultationId = parseInt(id || "0");
  const [message, setMessage] = useState("");
  const [analyzing, setAnalyzing] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [isMentalHealthMode, setIsMentalHealthMode] = useState(false);
  const [selectedMood, setSelectedMood] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if this is mental health mode
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');
    setIsMentalHealthMode(mode === 'mental');
  }, [consultationId]);

  const { data: consultation, isLoading, error } = useQuery({
    queryKey: [`/api/consultation/${consultationId}`],
    enabled: !!consultationId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: ({ message, isQuestion }: { message: string; isQuestion?: boolean }) =>
      consultationApi.sendMessage(consultationId, message, isQuestion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/consultation/${consultationId}`] });
      setMessage("");
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: () => consultationApi.analyze(consultationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/consultation/${consultationId}`] });
      toast({
        title: "Analyse terminée",
        description: "Votre pré-diagnostic est maintenant disponible",
      });
    },
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Erreur",
        description: "Consultation non trouvée",
        variant: "destructive",
      });
      setLocation("/dashboard");
    }
  }, [error, setLocation, toast]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [consultation?.chatMessages]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <Navigation title="Consultation" showBackButton backUrl="/dashboard" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-48 mb-6" />
          <Card className="sehha-card">
            <CardHeader>
              <Skeleton className="h-6 w-64" />
              <Skeleton className="h-4 w-96" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex space-x-3">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="h-16 flex-1 rounded-lg" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessageMutation.mutateAsync({ message });
      setMessage("");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'envoi du message",
        variant: "destructive",
      });
    }
  };

  const handleAnalyze = async () => {
    setAnalyzing(true);
    try {
      await analyzeMutation.mutateAsync();
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de l'analyse",
        variant: "destructive",
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGeneratePdf = async () => {
    setGeneratingPdf(true);
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
        title: "PDF généré",
        description: "Votre rapport a été téléchargé avec succès",
      });

      // Refresh consultation data
      queryClient.invalidateQueries({ queryKey: [`/api/consultation/${consultationId}`] });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Erreur lors de la génération du PDF",
        variant: "destructive",
      });
    } finally {
      setGeneratingPdf(false);
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

  const getUrgencyIcon = (level: string) => {
    switch (level) {
      case "urgent": return <AlertCircle className="w-4 h-4" />;
      case "high": return <AlertCircle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  const chatMessages = Array.isArray(consultation?.chatMessages) ? consultation.chatMessages : [];

  // Mental health mood options
  const moodOptions = [
    { emoji: "😊", label: "Bien", value: "good" },
    { emoji: "😐", label: "Neutre", value: "neutral" },
    { emoji: "😔", label: "Triste", value: "sad" },
    { emoji: "😰", label: "Anxieux", value: "anxious" },
    { emoji: "😡", label: "En colère", value: "angry" },
    { emoji: "😴", label: "Fatigué", value: "tired" },
  ];

  // Mental health quick topics
  const quickTopics = [
    "Stress au travail",
    "Troubles du sommeil",
    "Anxiété",
    "Relations personnelles",
    "Estime de soi",
    "Gestion des émotions",
  ];

  const handleMoodSelection = (mood: string) => {
    setSelectedMood(mood);
    const moodOption = moodOptions.find(m => m.value === mood);
    if (moodOption) {
      setMessage(`Je me sens ${moodOption.label.toLowerCase()} aujourd'hui.`);
    }
  };

  const handleQuickTopic = (topic: string) => {
    setMessage(`J'aimerais parler de ${topic.toLowerCase()}.`);
  };

  if (isMentalHealthMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-sky-50">
        <Header />
        <Navigation title="Soutien Mental" showBackButton backUrl="/" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

          {/* Mental Health Header */}
          <Card className="bg-white/80 backdrop-blur-sm border-sky-200 shadow-lg mb-6">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                  <Brain className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-slate-800">Soutien en Santé Mentale</CardTitle>
                  <p className="text-slate-600 mt-1">
                    Un espace sécurisé et confidentiel pour parler de vos préoccupations
                  </p>
                </div>
              </div>
              
              {/* Privacy Badge */}
              <div className="inline-flex items-center px-4 py-2 bg-green-50 border border-green-200 rounded-full text-sm text-green-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Conversation anonyme et confidentielle
              </div>
            </CardHeader>
          </Card>

          {/* Mood Selection */}
          <Card className="bg-white/80 backdrop-blur-sm border-sky-200 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Comment vous sentez-vous aujourd'hui ?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                {moodOptions.map((mood) => (
                  <Button
                    key={mood.value}
                    variant={selectedMood === mood.value ? "default" : "outline"}
                    className={`h-16 flex-col space-y-1 ${
                      selectedMood === mood.value 
                        ? "bg-sky-600 border-sky-600 text-white" 
                        : "hover:bg-sky-50 border-sky-200"
                    }`}
                    onClick={() => handleMoodSelection(mood.value)}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-xs">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Topics */}
          <Card className="bg-white/80 backdrop-blur-sm border-sky-200 shadow-lg mb-6">
            <CardHeader>
              <CardTitle className="text-lg text-slate-800">Sujets fréquents</CardTitle>
              <p className="text-sm text-slate-600">Cliquez sur un sujet pour commencer la conversation</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickTopics.map((topic) => (
                  <Button
                    key={topic}
                    variant="outline"
                    className="h-12 text-left justify-start hover:bg-sky-50 border-sky-200"
                    onClick={() => handleQuickTopic(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <Card className="bg-white/80 backdrop-blur-sm border-sky-200 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Assistant Sehha+</CardTitle>
                  <p className="text-sm text-slate-600">Votre accompagnateur en santé mentale</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Initial Welcome Message */}
              {chatMessages.length === 0 && (
                <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 mb-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-sky-600" />
                    </div>
                    <div className="text-slate-700">
                      <p className="mb-2">Bonjour ! Je suis votre assistant en santé mentale.</p>
                      <p className="mb-2">Je suis là pour vous écouter et vous accompagner dans un cadre totalement confidentiel.</p>
                      <p>N'hésitez pas à partager ce que vous ressentez ou ce qui vous préoccupe.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Chat Messages */}
              <div className="space-y-4 mb-4 max-h-96 overflow-y-auto">
                {chatMessages.map((msg: any, index: number) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl ${
                      msg.role === 'user' 
                        ? 'bg-sky-600 text-white' 
                        : 'bg-slate-100 text-slate-800'
                    }`}>
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>



              {/* Message Input */}
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isMentalHealthMode ? "Écrivez votre message ici..." : "Décrivez vos symptômes..."}
                  className="flex-1 border-sky-200 focus:border-sky-400"
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!message.trim() || analyzing}
                  className="bg-sky-600 hover:bg-sky-700"
                >
                  {analyzing ? (
                    <Clock className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>

              {/* Mental Health Resources */}
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                <h4 className="text-sm font-semibold text-amber-800 mb-2">Ressources d'urgence</h4>
                <p className="text-xs text-amber-700">
                  Si vous ressentez des pensées suicidaires ou êtes en détresse immédiate, 
                  contactez immédiatement le <strong>141</strong> (SOS Amitié Maroc) ou rendez-vous aux urgences.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Regular medical consultation interface
  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <Navigation title="Consultation" showBackButton backUrl="/dashboard" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Consultation Header */}
        <Card className="sehha-card mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-sky-600" />
                </div>
                <div>
                  <CardTitle className="text-xl">Consultation IA</CardTitle>
                  <p className="text-sm text-slate-600">
                    Créée {formatDistanceToNow(new Date(consultation?.createdAt || new Date()), { locale: fr, addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                {consultation?.urgencyLevel && (
                  <Badge className={`${getUrgencyColor(consultation.urgencyLevel)} border`}>
                    {getUrgencyIcon(consultation.urgencyLevel)}
                    <span className="ml-1">{getUrgencyLabel(consultation.urgencyLevel)}</span>
                  </Badge>
                )}
                {consultation?.preDiagnosis && (
                  <Button
                    onClick={handleGeneratePdf}
                    disabled={generatingPdf}
                    size="sm"
                    className="sehha-button-primary"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    {generatingPdf ? "Génération..." : "PDF"}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Symptoms Summary */}
        <Card className="sehha-card mb-6">
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2 text-sky-500" />
              Symptômes rapportés
            </h3>
            <p className="text-slate-700 leading-relaxed">{consultation?.symptoms}</p>
            {consultation?.duration && (
              <p className="text-sm text-slate-600 mt-2">
                <strong>Durée:</strong> {consultation.duration}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Chat Interface */}
        <Card className="sehha-card mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-emerald-500" />
              <span>Conversation avec l'IA</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto mb-4">
              {chatMessages.length === 0 ? (
                <div className="text-center py-8">
                  <Brain className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <p className="text-slate-600">
                    {!consultation?.preDiagnosis 
                      ? "Commencez l'analyse pour débuter la conversation avec l'IA"
                      : "Aucune conversation pour le moment"
                    }
                  </p>
                </div>
              ) : (
                chatMessages.map((msg: any, index: number) => (
                  <div key={index} className={`flex space-x-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-emerald-600" />
                      </div>
                    )}
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-sky-500 text-white' 
                        : 'bg-slate-100 text-slate-900'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      {msg.timestamp && (
                        <p className={`text-xs mt-1 ${
                          msg.role === 'user' ? 'text-sky-100' : 'text-slate-500'
                        }`}>
                          {formatDistanceToNow(new Date(msg.timestamp), { locale: fr, addSuffix: true })}
                        </p>
                      )}
                    </div>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 bg-sky-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-sky-600" />
                      </div>
                    )}
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Guidance Section */}
            {chatMessages.length > 4 && !consultation?.preDiagnosis && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center space-x-3">
                  <Brain className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-800 mb-3">
                      Nous avons suffisamment d'informations pour procéder à l'analyse de vos symptômes.
                    </p>
                    <Button
                      onClick={handleAnalyze}
                      disabled={analyzing}
                      size="sm"
                      className="sehha-button-primary"
                    >
                      {analyzing ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Analyse en cours...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Analyser mes symptômes
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}




            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex space-x-3">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Décrivez vos symptômes..."
                disabled={sendMessageMutation.isPending}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={!message.trim() || sendMessageMutation.isPending}
                size="icon"
                className="sehha-button-primary"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Analysis Section */}
        {!consultation?.preDiagnosis ? (
          <Card className="sehha-card">
            <CardContent className="p-6 text-center">
              <Brain className="w-12 h-12 text-sky-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                Prêt pour l'analyse IA ?
              </h3>
              <p className="text-slate-600 mb-6">
                L'intelligence artificielle va analyser vos symptômes et vous fournir un pré-diagnostic avec des recommandations.
              </p>
              <Button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="sehha-button-primary"
                size="lg"
              >
                {analyzing ? (
                  <>
                    <Clock className="w-4 h-4 mr-2 animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Commencer l'analyse
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card className="sehha-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
                <span>Pré-diagnostic IA</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Pre-diagnosis */}
              <div>
                <h4 className="font-semibold text-slate-900 mb-3">Analyse des symptômes</h4>
                <div className="bg-slate-50 rounded-lg p-4">
                  <p className="text-slate-700 leading-relaxed">
                    {typeof consultation.preDiagnosis === 'string' 
                      ? consultation.preDiagnosis 
                      : typeof consultation.preDiagnosis === 'object' && consultation.preDiagnosis?.text
                        ? consultation.preDiagnosis.text
                        : JSON.stringify(consultation.preDiagnosis)
                    }
                  </p>
                </div>
              </div>

              {/* Personalized Support Message */}
              {consultation.messageSoutien && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                    <Heart className="w-4 h-4 mr-2 text-pink-500" />
                    Message de soutien personnalisé
                  </h4>
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4 border border-pink-200">
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                          <Heart className="w-4 h-4 text-pink-600" />
                        </div>
                      </div>
                      <div className="flex-1">
                        {consultation.niveauAnxiete && (
                          <div className="mb-3">
                            <span className="text-sm font-medium text-slate-700">
                              Niveau d'anxiété évalué : 
                            </span>
                            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                              consultation.niveauAnxiete === 'élevé' ? 'bg-red-100 text-red-700' :
                              consultation.niveauAnxiete === 'modéré' ? 'bg-yellow-100 text-yellow-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                              {consultation.niveauAnxiete}
                            </span>
                          </div>
                        )}
                        <div className="text-slate-700 leading-relaxed space-y-2">
                          {typeof consultation.messageSoutien === 'string' 
                            ? consultation.messageSoutien.split('\n\n').map((paragraph, index) => (
                                <p key={index} className="leading-relaxed">
                                  {paragraph.split('**').map((part, partIndex) => 
                                    partIndex % 2 === 1 ? (
                                      <strong key={partIndex} className="font-semibold text-slate-800">{part}</strong>
                                    ) : (
                                      part
                                    )
                                  )}
                                </p>
                              ))
                            : JSON.stringify(consultation.messageSoutien)
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {consultation.recommendations && (
                <div>
                  <h4 className="font-semibold text-slate-900 mb-3">Recommandations</h4>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <p className="text-slate-700 leading-relaxed">
                      {typeof consultation.recommendations === 'string' 
                        ? consultation.recommendations 
                        : JSON.stringify(consultation.recommendations)
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Medical Disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-amber-600 mt-0.5">⚠️</div>
                  <div className="text-sm">
                    <p className="font-semibold text-amber-800 mb-1">Avertissement médical</p>
                    <p className="text-amber-700">
                      Cette analyse est générée par une intelligence artificielle à des fins éducatives et ne remplace en aucun cas l'avis d'un professionnel de santé qualifié. 
                      Consultez toujours un médecin pour un diagnostic et un traitement appropriés. En cas d'urgence, contactez immédiatement les services de secours.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  onClick={handleGeneratePdf}
                  disabled={generatingPdf}
                  className="sehha-button-primary flex-1"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {generatingPdf ? "Génération du PDF..." : "Télécharger le rapport PDF"}
                </Button>
                <Link href="/consultation/new" className="flex-1">
                  <Button variant="outline" className="w-full">
                    Nouvelle consultation
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Chat;
