import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { CharacterCard } from "@/components/character-card";
import { auth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import type { Character, Anime } from "@shared/schema";

export default function SubCatalog() {
  const { animeId } = useParams();
  const [, setLocation] = useLocation();
  const user = auth.getUser();
  const queryClient = useQueryClient();

  const { data: anime } = useQuery<Anime>({
    queryKey: ["/api/animes", animeId],
  });

  const { data: characters = [], isLoading } = useQuery<Character[]>({
    queryKey: ["/api/animes", animeId, "characters"],
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ['/api/favorites', user?.id || 1],
    enabled: true, // Always enable to ensure favorites load
  });

  const addFavoriteMutation = useMutation({
    mutationFn: async (characterId: string) => {
      const userId = user?.id || 1; // Use fallback ID
      return apiRequest('POST', '/api/favorites', { userId, characterId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/favorites', user?.id || 1] });
    },
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

  const isFavorite = (characterId: string) => {
    return favorites.some((fav: Character) => fav.id === characterId);
  };

  const handleToggleFavorite = (characterId: string) => {
    if (isFavorite(characterId)) {
      removeFavoriteMutation.mutate(characterId);
    } else {
      addFavoriteMutation.mutate(characterId);
    }
  };

  const handleCharacterClick = (characterId: string) => {
    setLocation(`/character/${characterId}`);
  };

  const handleBack = () => {
    setLocation("/catalog");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header showBack onBack={handleBack} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBack onBack={handleBack} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2 font-japanese">
            {anime?.name}
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base">Escolha seu personagem favorito para fazer o download</p>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              isFavorite={isFavorite(character.id)}
              onToggleFavorite={handleToggleFavorite}
              onClick={() => handleCharacterClick(character.id)}
            />
          ))}
        </div>

        {characters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum modelo disponível ainda</p>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
