import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { AnimeCard } from "@/components/anime-card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { Anime, Character } from "@shared/schema";

export default function Catalog() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: animes = [], isLoading } = useQuery<Anime[]>({
    queryKey: ["/api/animes"],
  });

  // Query to get all characters for model counting
  const { data: allCharacters = [] } = useQuery<Character[]>({
    queryKey: ["/api/characters"],
    queryFn: async () => {
      // Get characters for each anime and flatten the array
      const characterPromises = animes.map(anime => 
        fetch(`/api/animes/${anime.id}/characters`).then(res => res.json())
      );
      const characterArrays = await Promise.all(characterPromises);
      return characterArrays.flat();
    },
    enabled: animes.length > 0,
  });

  // Calculate actual model count for each anime
  const getActualModelCount = (animeId: string) => {
    return allCharacters.filter(char => char.animeId === animeId).length;
  };

  const filteredAnimes = animes.filter(anime =>
    anime.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAnimeClick = (animeId: string) => {
    setLocation(`/anime/${animeId}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-2">Modelos Disponíveis</h2>
          <p className="text-muted-foreground text-sm sm:text-base">Escolha seu anime favorito e descubra modelos incríveis para montar!</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Input
              type="text"
              placeholder="Buscar anime..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>

        {/* Anime Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {filteredAnimes.map((anime) => (
            <AnimeCard
              key={anime.id}
              anime={anime}
              actualModelCount={getActualModelCount(anime.id)}
              onClick={() => handleAnimeClick(anime.id)}
            />
          ))}
        </div>

        {filteredAnimes.length === 0 && searchTerm && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Nenhum anime encontrado para "{searchTerm}"</p>
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
