import { Card } from "@/components/ui/card";
import { Eye, Heart } from "lucide-react";
import { useState } from "react";
import type { Character } from "@shared/schema";

interface CharacterCardProps {
  character: Character;
  isFavorite?: boolean;
  onToggleFavorite?: (characterId: string) => void;
  onClick: () => void;
}

export function CharacterCard({ character, isFavorite = false, onToggleFavorite, onClick }: CharacterCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(character.id);
  };

  return (
    <Card 
      className="character-card bg-card border-border rounded-xl overflow-hidden shadow-lg cursor-pointer relative group"
      onClick={onClick}
    >
      <div className="relative aspect-[5/7]">
        <img 
          src={character.imageUrl} 
          alt={character.name} 
          className="w-full h-full object-cover"
        />
        
        {/* Character name - bottom left */}
        <div className="absolute bottom-2 left-2">
          <span className="text-xs text-white/80 bg-black/50 px-2 py-1 rounded">
            {character.name}
          </span>
        </div>

        {/* Action buttons - bottom right */}
        <div className="absolute bottom-2 right-2 flex space-x-1 z-10">
          {onToggleFavorite && (
            <button
              onClick={handleFavoriteClick}
              className={`p-2 rounded-full transition-all duration-200 cursor-pointer transform hover:scale-110 bg-black/70 hover:bg-black/80 ${
                isFavorite 
                  ? "text-red-500 scale-105" 
                  : "text-white hover:text-red-400"
              }`}
              style={{ zIndex: 20 }}
            >
              <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
            </button>
          )}
        </div>

        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </Card>
  );
}
