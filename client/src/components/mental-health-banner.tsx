import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MessageCircle, FileText, Search, Brain } from "lucide-react";

export default function MentalHealthBanner() {
  return (
    <section className="relative bg-gradient-to-br from-sky-50 to-blue-100 overflow-hidden">
      {/* Background decorative brain icon */}
      <div className="absolute top-4 right-4 opacity-10">
        <Brain className="w-32 h-32 text-sky-600" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Title */}
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-sky-600 mr-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">
              Soutien en Santé Mentale
            </h2>
          </div>
          
          {/* Subtitle */}
          <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Besoin d'aide ou de parler à quelqu'un ? Notre service de soutien mental vous connecte 
            avec des psychologues certifiés et des outils anonymes d'auto-évaluation. 
            Disponible en Arabe et en Français.
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/anonymous-chat">
              <Button 
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 min-w-[200px]"
              >
                <MessageCircle className="w-5 h-5" />
                Accès anonyme au chat
              </Button>
            </Link>
            
            <Link href="/consultation?type=mental">
              <Button 
                variant="outline"
                className="border-sky-600 text-sky-700 hover:bg-sky-50 px-6 py-3 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 min-w-[200px]"
              >
                <FileText className="w-5 h-5" />
                Auto-évaluer ma santé mentale
              </Button>
            </Link>
            
            <Link href="/doctors?specialty=Psychiatrie">
              <Button 
                variant="outline"
                className="border-sky-600 text-sky-700 hover:bg-sky-50 px-6 py-3 rounded-xl shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 flex items-center gap-2 min-w-[200px]"
              >
                <Search className="w-5 h-5" />
                Trouver un spécialiste
              </Button>
            </Link>
          </div>
          
          {/* Trust indicator */}
          <div className="mt-8 text-sm text-slate-500">
            <p className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Service disponible 24h/24, 7j/7 - Confidentialité garantie
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}