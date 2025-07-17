import { Home, ShoppingCart, Sparkles, Heart } from "lucide-react";
import { useLocation } from "wouter";

export function BottomNav() {
  const [location, setLocation] = useLocation();

  const navItems = [
    { icon: Home, label: "Início", path: "/catalog" },
    { icon: ShoppingCart, label: "Loja", path: "/shop" },
    { icon: Sparkles, label: "Novidades", path: "/new" },
    { icon: Heart, label: "Favoritos", path: "/favorites" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = location === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.path}
                onClick={() => setLocation(item.path)}
                className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-colors ${
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-primary"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}