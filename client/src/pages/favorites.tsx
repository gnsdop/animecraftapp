import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { CharacterCard } from "@/components/character-card";
import { useLocation } from "wouter";
import { auth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import type { Character } from "@shared/schema";

export function FavoritesPage() {
  const [, setLocation] = useLocation();
  const user = auth.getUser();
  const queryClient = useQueryClient();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['/api/favorites', user?.id || 1],
    enabled: true, // Always enable to ensure favorites load
  });

  const removeFavoriteMutation = useMutation({
    mutationFn: async (characterId: string) => {
      const userId = user?.id || 1; // Use fallback ID
      return apiRequest('DELETE', `/api/favorites/${userId}/${characterId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites', user?.id || 1] });
    },
  });

  const handleToggleFavorite = (characterId: string) => {
    removeFavoriteMutation.mutate(characterId);
  };

  const handleCharacterClick = (characterId: string) => {
    setLocation(`/character/${characterId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-6 pb-20">
          <div className="text-center">Carregando favoritos...</div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-6 pb-20">
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Seus Favoritos
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Modelos que você marcou como favoritos
          </p>
        </div>
        
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">Nenhum favorito ainda</p>
            <button
              onClick={() => setLocation("/catalog")}
              className="text-primary hover:underline"
            >
              Explorar modelos
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {favorites.map((character: Character) => (
              <CharacterCard
                key={character.id}
                character={character}
                isFavorite={true}
                onToggleFavorite={handleToggleFavorite}
                onClick={() => handleCharacterClick(character.id)}
              />
            ))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}