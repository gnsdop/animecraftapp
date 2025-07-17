import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Package, Gift } from "lucide-react";

export function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Loja
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Produtos adicionais e acessórios para papercraft
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <Package className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Kit Completo</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Todas as ferramentas necessárias para papercraft
              </p>
              <p className="text-primary font-bold">Em breve</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <Gift className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Papel Premium</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Papel especial para melhores resultados
              </p>
              <p className="text-primary font-bold">Em breve</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <ShoppingCart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Acessórios</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Cola, réguas e outras ferramentas
              </p>
              <p className="text-primary font-bold">Em breve</p>
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}