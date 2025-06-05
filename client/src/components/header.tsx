import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Heart, LogOut, User, FileText, MessageSquare, Menu, X } from "lucide-react";
import logoPath from "@assets/Health Care_1749135916464.png";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-2 hover:opacity-80 transition-opacity min-w-0 flex-shrink-0">
              <img 
                src={logoPath} 
                alt="Sehha+ Logo" 
                className="w-12 h-12 object-contain"
              />
              <span className="text-lg sm:text-xl font-bold text-slate-800 whitespace-nowrap">Sehha+</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/about">
              <span className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
                À propos
              </span>
            </Link>
            <Link href="/how-it-works">
              <span className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
                Comment ça marche
              </span>
            </Link>
            <Link href="/doctors">
              <span className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
                Trouver un Médecin
              </span>
            </Link>
            <Link href="/contact">
              <span className="text-slate-600 hover:text-slate-800 font-medium transition-colors">
                Contact
              </span>
            </Link>
          </nav>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Navigation & Actions */}
          <div className="hidden md:flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3">
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline text-sm font-medium truncate max-w-[120px]">{user?.fullName}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="flex items-center">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Tableau de bord
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/reports" className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Mes rapports
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Mon profil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/health-passport" className="flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Passeport Santé
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={logout}
                    className="flex items-center text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-1 sm:space-x-4">
                <Link href="/auth">
                  <Button variant="ghost" className="font-medium text-sm px-2 sm:px-4">
                    Connexion
                  </Button>
                </Link>
                <Link href="/auth?mode=register">
                  <Button className="sehha-button-primary text-sm px-2 sm:px-4">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-4 py-4 space-y-3">
              {/* Navigation Links */}
              <Link href="/about">
                <div 
                  className="block py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  À propos
                </div>
              </Link>
              <Link href="/how-it-works">
                <div 
                  className="block py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Comment ça marche
                </div>
              </Link>
              <Link href="/doctors">
                <div 
                  className="block py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Trouver un Médecin
                </div>
              </Link>
              <Link href="/contact">
                <div 
                  className="block py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </div>
              </Link>

              {/* Auth Actions */}
              <div className="pt-3 border-t border-slate-200">
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <Link href="/dashboard">
                      <div 
                        className="flex items-center py-2 text-slate-600 hover:text-slate-800 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Tableau de bord
                      </div>
                    </Link>
                    <Link href="/reports">
                      <div 
                        className="flex items-center py-2 text-slate-600 hover:text-slate-800 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Mes rapports
                      </div>
                    </Link>
                    <Link href="/profile">
                      <div 
                        className="flex items-center py-2 text-slate-600 hover:text-slate-800 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-2" />
                        Mon profil
                      </div>
                    </Link>
                    <Link href="/health-passport">
                      <div 
                        className="flex items-center py-2 text-slate-600 hover:text-slate-800 transition-colors"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Passeport Santé
                      </div>
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center py-2 text-red-600 hover:text-red-800 transition-colors w-full text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Déconnexion
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link href="/auth">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Connexion
                      </Button>
                    </Link>
                    <Link href="/auth?mode=register">
                      <Button 
                        className="w-full sehha-button-primary"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        S'inscrire
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}