import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Brain, Heart, Shield, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Navigation from "@/components/navigation";

interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

function AnonymousChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const moods = [
    { emoji: "😊", label: "Heureux", value: "happy" },
    { emoji: "😐", label: "Neutre", value: "neutral" },
    { emoji: "😢", label: "Triste", value: "sad" },
    { emoji: "😰", label: "Anxieux", value: "anxious" },
    { emoji: "😠", label: "En colère", value: "angry" },
    { emoji: "😴", label: "Fatigué", value: "tired" },
  ];

  const quickTopics = [
    "Je me sens anxieux",
    "J'ai des troubles du sommeil",
    "Je me sens déprimé",
    "Gestion du stress",
    "Relations interpersonnelles",
    "Confiance en soi",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const addMessage = (content: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      content,
      isUser,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || message;
    if (!textToSend.trim()) return;

    addMessage(textToSend, true);
    setMessage("");
    setIsTyping(true);

    try {
      const response = await fetch('/api/mental-health-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend,
          conversation: messages.map(m => ({ content: m.content, isUser: m.isUser })),
          mood: selectedMood
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      addMessage(data.response, false);
      setIsTyping(false);
    } catch (error) {
      setIsTyping(false);
      console.error('Mental health chat error:', error);
      
      // Fallback responses for when AI is not available
      const fallbackResponses = [
        "Je comprends que vous traversez une période difficile. Il est important de parler de vos sentiments.",
        "Vos émotions sont valides. Avez-vous quelqu'un de confiance à qui parler dans votre entourage ?",
        "Je vous encourage à contacter un professionnel de la santé mentale si vous ressentez le besoin d'un soutien supplémentaire.",
        "Prendre soin de sa santé mentale est essentiel. Considérez-vous faire des activités qui vous apportent du bien-être ?",
      ];
      
      const fallbackResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      addMessage(fallbackResponse, false);
      
      toast({
        title: "Mode hors ligne",
        description: "Utilisation des réponses de base. Pour une expérience complète, vérifiez votre connexion.",
        variant: "default",
      });
    }
  };

  const handleQuickTopic = (topic: string) => {
    handleSendMessage(topic);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />
      <Navigation title="Support Mental Anonyme" showBackButton backUrl="/" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mental Health Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-3">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Support Mental Anonyme
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Un espace sûr et confidentiel pour parler de votre bien-être mental. 
            Vos conversations sont anonymes et sécurisées.
          </p>
        </div>

        {/* Confidentiality Banner */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <Shield className="h-6 w-6 text-blue-600" />
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900">Confidentialité garantie</h3>
                <p className="text-sm text-blue-700">
                  Vos conversations sont anonymes et ne sont pas sauvegardées. 
                  En cas d'urgence, contactez SOS Amitié Maroc : 141
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-red-600" />
                <span className="font-bold text-red-600">Urgence: 141</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mood Selection */}
        {!selectedMood && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-red-500" />
                Comment vous sentez-vous aujourd'hui ?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {moods.map((mood) => (
                  <Button
                    key={mood.value}
                    variant="outline"
                    className="p-4 h-auto flex flex-col items-center space-y-2 hover:bg-blue-50"
                    onClick={() => {
                      setSelectedMood(mood.value);
                      handleSendMessage(`Je me sens ${mood.label.toLowerCase()} aujourd'hui`);
                    }}
                  >
                    <span className="text-2xl">{mood.emoji}</span>
                    <span className="text-sm">{mood.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Topics */}
        {messages.length === 0 && selectedMood && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Sujets fréquents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {quickTopics.map((topic, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left justify-start p-3 h-auto hover:bg-blue-50"
                    onClick={() => handleQuickTopic(topic)}
                  >
                    {topic}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Interface */}
        <Card className="h-96">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-blue-600" />
              Conversation confidentielle
              {selectedMood && (
                <Badge variant="outline" className="ml-2">
                  Humeur: {moods.find(m => m.value === selectedMood)?.label}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 h-full flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Bonjour ! Je suis ici pour vous écouter.</p>
                  <p className="text-sm mt-2">Partagez ce qui vous préoccupe en toute confidentialité.</p>
                </div>
              )}
              
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      msg.isUser
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {msg.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Écrivez votre message..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!message.trim() || isTyping}
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Support Resources - Positioned at bottom with maximum spacing */}
        <div className="mt-20 mb-24">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-3">
              <h3 className="font-medium text-green-900 mb-2 text-sm">Ressources d'aide</h3>
              <div className="space-y-2 text-xs text-green-700">
                <div>
                  <strong>SOS Amitié Maroc:</strong> 141 (gratuit, 24h/24)
                </div>
                <div>
                  <strong>Urgences psychiatriques:</strong> Contactez votre médecin
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AnonymousChat;