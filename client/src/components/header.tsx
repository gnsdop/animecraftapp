import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut, Origami } from "lucide-react";
import { auth } from "@/lib/auth";
import { useLocation } from "wouter";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function Header({ title, showBack, onBack }: HeaderProps) {
  const [, setLocation] = useLocation();
  const user = auth.getUser();

  const handleLogout = () => {
    auth.logout();
    setLocation("/login");
  };

  return (
    <header className="bg-background border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            {showBack && onBack && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onBack}
                className="text-muted-foreground hover:text-primary"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <div className="flex items-center">
              <img 
                src="https://i.imgur.com/miRWpec.png" 
                alt="AnimeCraft Logo" 
                className="h-16 w-auto object-contain"
              />

            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-primary"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
