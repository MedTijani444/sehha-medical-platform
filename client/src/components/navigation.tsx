import { Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";

interface NavigationProps {
  showBackButton?: boolean;
  backUrl?: string;
  title?: string;
}

export default function Navigation({ showBackButton = false, backUrl, title }: NavigationProps) {
  const [, setLocation] = useLocation();

  const handleHomeClick = () => {
    setLocation("/");
  };

  const handleBackClick = () => {
    if (backUrl) {
      setLocation(backUrl);
    } else {
      window.history.back();
    }
  };

  return (
    <div className="flex items-center justify-between p-4 border-b bg-white">
      <div className="flex items-center space-x-4">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackClick}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Retour</span>
          </Button>
        )}
        {title && <h1 className="text-xl font-semibold">{title}</h1>}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleHomeClick}
        className="flex items-center space-x-2"
      >
        <Home className="h-4 w-4" />
        <span>Accueil</span>
      </Button>
    </div>
  );
}