import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type { Anime } from "@shared/schema";

interface AnimeCardProps {
  anime: Anime;
  actualModelCount: number;
  onClick: () => void;
}

export function AnimeCard({ anime, actualModelCount, onClick }: AnimeCardProps) {
  return (
    <Card 
      className="anime-card bg-card border-border rounded-xl overflow-hidden shadow-lg cursor-pointer relative group"
      onClick={onClick}
    >
      <div className="relative aspect-[5/7]">
        <img 
          src={anime.imageUrl} 
          alt={`${anime.name} Papercraft Collection`} 
          className="w-full h-full object-cover"
        />
        
        {/* Model count - bottom left */}
        <div className="absolute bottom-2 left-2">
          <span className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded">
            {actualModelCount}
          </span>
        </div>

        {/* Arrow - bottom right */}
        <div className="absolute bottom-2 right-2">
          <ArrowRight className="h-4 w-4 text-white/80" />
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </Card>
  );
}
