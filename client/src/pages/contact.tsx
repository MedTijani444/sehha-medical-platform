import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/header";
import { useToast } from "@/hooks/use-toast";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send,
  Heart,
  Users,
  MessageSquare,
  Shield
} from "lucide-react";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message envoyé",
          description: "Merci pour votre message. Nous vous répondrons dans les plus brefs délais.",
        });
        setFormData({
          name: "",
          email: "",
          subject: "",
          category: "",
          message: ""
        });
      } else {
        throw new Error('Erreur lors de l\'envoi du message');
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'envoi du message. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "contact@sehhaplus.com",
      description: "Réponse sous 24h"
    },
    {
      icon: Phone,
      title: "Téléphone",
      content: "+212 5 22 25 15 45",
      description: "Support technique"
    }
  ];

  const supportTopics = [
    {
      icon: Users,
      title: "Support utilisateur",
      description: "Aide à l'utilisation de la plateforme"
    },
    {
      icon: Shield,
      title: "Sécurité & Confidentialité",
      description: "Questions sur la protection des données"
    },
    {
      icon: MessageSquare,
      title: "Partenariats",
      description: "Collaborations et intégrations"
    },
    {
      icon: Heart,
      title: "Feedback",
      description: "Suggestions d'amélioration"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <section className="sehha-gradient py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
              Contactez-nous
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Notre équipe est là pour vous aider. Que vous ayez des questions sur Sehha+, 
              besoin d'assistance technique ou souhaitiez explorer des partenariats, 
              nous sommes à votre écoute.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="sehha-card">
                <CardHeader>
                  <CardTitle className="text-2xl">Envoyez-nous un message</CardTitle>
                  <CardDescription>
                    Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nom complet *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                          placeholder="Votre nom"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                          placeholder="votre@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Catégorie</Label>
                        <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisir une catégorie" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="support">Support technique</SelectItem>
                            <SelectItem value="feedback">Feedback</SelectItem>
                            <SelectItem value="partnership">Partenariat</SelectItem>
                            <SelectItem value="privacy">Confidentialité</SelectItem>
                            <SelectItem value="other">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Sujet *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          required
                          placeholder="Sujet de votre message"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        required
                        placeholder="Décrivez votre demande en détail..."
                        className="min-h-32"
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full sehha-button-primary"
                      size="lg"
                    >
                      {loading ? (
                        "Envoi en cours..."
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="sehha-card">
                <CardHeader>
                  <CardTitle>Informations de contact</CardTitle>
                  <CardDescription>
                    Plusieurs moyens de nous joindre
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contactInfo.map((info, index) => {
                    const Icon = info.icon;
                    return (
                      <div key={index} className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-sky-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900">{info.title}</h3>
                          <p className="text-slate-700">{info.content}</p>
                          <p className="text-sm text-slate-500">{info.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              <Card className="sehha-card">
                <CardHeader>
                  <CardTitle>Horaires de support en ligne</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Lundi - Vendredi</span>
                    <span className="font-medium">9h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Samedi</span>
                    <span className="font-medium">9h00 - 13h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Dimanche</span>
                    <span className="font-medium">Fermé</span>
                  </div>
                  <div className="mt-4 p-3 bg-sky-50 rounded-lg">
                    <p className="text-sm text-sky-700">
                      <strong>Support technique:</strong> Disponible 24h/7j via notre système de tickets
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Support Topics */}
      <section className="py-20 sehha-gradient">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Comment pouvons-nous vous aider ?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Découvrez les différents types de support que nous proposons
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportTopics.map((topic, index) => {
              const Icon = topic.icon;
              return (
                <Card key={index} className="sehha-card text-center p-6 group hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-3">{topic.title}</h3>
                    <p className="text-slate-600">{topic.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Questions fréquentes
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Trouvez rapidement des réponses aux questions les plus posées
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <Card className="sehha-card p-6">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Comment créer un compte sur Sehha+ ?
                </h3>
                <p className="text-slate-600">
                  Cliquez sur "S'inscrire" en haut de la page, remplissez vos informations 
                  de base et votre historique médical optionnel. L'inscription est gratuite 
                  et prend moins de 5 minutes.
                </p>
              </CardContent>
            </Card>

            <Card className="sehha-card p-6">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Puis-je utiliser Sehha+ sans parler français ?
                </h3>
                <p className="text-slate-600">
                  Actuellement, Sehha+ est disponible uniquement en français. 
                  Notre plateforme est conçue spécifiquement pour les utilisateurs 
                  francophones au Maroc et s'adapte aux spécificités du système de santé marocain.
                </p>
              </CardContent>
            </Card>

            <Card className="sehha-card p-6">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Que faire en cas d'urgence médicale ?
                </h3>
                <p className="text-slate-600">
                  Sehha+ n'est pas conçu pour les urgences. En cas d'urgence médicale, 
                  contactez immédiatement les services de secours (15, 112) ou 
                  rendez-vous aux urgences de l'hôpital le plus proche.
                </p>
              </CardContent>
            </Card>

            <Card className="sehha-card p-6">
              <CardContent className="p-0">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">
                  Comment supprimer mon compte ?
                </h3>
                <p className="text-slate-600">
                  Vous pouvez supprimer votre compte à tout moment depuis vos paramètres 
                  de profil ou en nous contactant directement. Toutes vos données seront 
                  supprimées définitivement selon les réglementations RGPD.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Emergency Notice */}
      <section className="py-16 bg-red-50 border-t border-red-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-red-800">Urgence Médicale</h2>
          </div>
          <p className="text-lg text-red-700 mb-6">
            En cas d'urgence médicale, ne perdez pas de temps avec Sehha+. 
            Contactez immédiatement les services de secours ou rendez-vous aux urgences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-white rounded-lg p-4 shadow-sm border border-red-200">
              <p className="font-bold text-red-800">SAMU - 15</p>
              <p className="text-sm text-red-600">Urgences médicales</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border border-red-200">
              <p className="font-bold text-red-800">Urgences Européennes - 112</p>
              <p className="text-sm text-red-600">Numéro d'urgence universel</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}