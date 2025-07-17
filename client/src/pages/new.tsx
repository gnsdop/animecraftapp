import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Calendar, Star } from "lucide-react";

export function NewPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Novidades
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Últimos lançamentos e atualizações
          </p>
        </div>
        
        <div className="space-y-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Star className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Sistema de Favoritos</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Agora você pode marcar seus modelos favoritos para encontrá-los facilmente depois!
                  </p>
                  <p className="text-xs text-muted-foreground">Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Sparkles className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Interface Renovada</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Design mais limpo e intuitivo para uma melhor experiência de navegação.
                  </p>
                  <p className="text-xs text-muted-foreground">Hoje</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Calendar className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-lg font-semibold mb-2">Novos Modelos em Breve</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    Estamos trabalhando em novos modelos incríveis de diversos animes populares.
                  </p>
                  <p className="text-xs text-muted-foreground">Em breve</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}