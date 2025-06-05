import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export default function LanguageSelector({ value = "fr", onValueChange, className = "" }: LanguageSelectorProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={`w-36 text-sm border-slate-200 hover:border-slate-300 transition-colors bg-white/80 backdrop-blur-sm [&>svg]:hidden ${className}`}>
        <div className="flex items-center space-x-2">
          <Globe className="w-3.5 h-3.5 text-slate-500" />
          <SelectValue />
        </div>
      </SelectTrigger>
      <SelectContent className="bg-white/95 backdrop-blur-sm border border-slate-200 shadow-lg">
        <SelectItem value="fr" className="hover:bg-sky-50 cursor-pointer">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🇫🇷</span>
            <span>Français</span>
          </div>
        </SelectItem>
        <SelectItem value="en" className="hover:bg-sky-50 cursor-pointer">
          <div className="flex items-center space-x-2">
            <span className="text-lg">🇺🇸</span>
            <span>English</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}
