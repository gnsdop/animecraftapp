import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Origami, LogIn, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { auth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      await auth.login({ email, password });
      setLocation("/");
    } catch (error) {
      toast({
        title: "Erro",
        description: "Email ou senha inválidos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center gradient-bg">
      <div className="max-w-md w-full mx-4">
        <Card className="bg-card border-border rounded-2xl shadow-2xl overflow-hidden">
          <CardContent className="px-8 py-12">
            <div className="text-center mb-8">
              <div className="flex flex-col items-center justify-center mb-4">
                <img 
                  src="https://i.imgur.com/miRWpec.png" 
                  alt="AnimeCraft Logo" 
                  className="h-16 w-auto object-contain"
                />
              </div>
              <p className="text-muted-foreground">Papercraft de Animes Premium</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-muted-foreground">
                  E-mail
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="seu@email.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-muted-foreground">
                  Senha
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-input border border-border text-foreground rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full gradient-button text-white py-3 rounded-lg font-medium hover:shadow-lg transition-all transform hover:scale-105"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <LogIn className="mr-2 h-4 w-4" />
                )}
                Entrar
              </Button>
            </form>
            
            <div className="mt-6 text-center text-sm text-muted-foreground">
              Acesso restrito a compradores autorizados
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
