import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { Header } from "@/components/header";
import { BottomNav } from "@/components/bottom-nav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Play, CheckCircle } from "lucide-react";
import { useState } from "react";
import type { Character } from "@shared/schema";

export default function Product() {
  const { characterId } = useParams();
  const [, setLocation] = useLocation();
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadComplete, setDownloadComplete] = useState(false);

  const { data: character, isLoading } = useQuery<Character>({
    queryKey: ["/api/characters", characterId],
  });

  const handleBack = () => {
    if (character) {
      setLocation(`/anime/${character.animeId}`);
    }
  };

  const handleDownload = async () => {
    if (!character) return;

    setIsDownloading(true);

    try {
      const response = await fetch(`/api/characters/${character.id}/download`);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${character.name.replace(/\s+/g, '_')}_modelo.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setDownloadComplete(true);
      setTimeout(() => setDownloadComplete(false), 3000);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header showBack onBack={handleBack} />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen">
        <Header showBack onBack={handleBack} />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-500">Personagem não encontrado</p>
          </div>
        </main>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header showBack onBack={handleBack} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {/* Character Name */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground font-japanese">
            {character.name}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Video Block */}
          <Card className="bg-card border-border rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-video bg-gray-900 relative">
              <iframe 
                width="100%" 
                height="100%" 
                src="https://www.youtube.com/embed/rGbWyBuC9GQ?si=olTecm3mWMaKjhS-" 
                title="YouTube video player" 
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                referrerPolicy="strict-origin-when-cross-origin" 
                allowFullScreen
                className="w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-base font-semibold text-card-foreground mb-1">Tutorial em Vídeo</h3>
              <p className="text-muted-foreground text-xs">
                Assista ao tutorial completo de montagem com instruções passo a passo.
              </p>
            </CardContent>
          </Card>

          {/* PDF Block */}
          <Card className="bg-card border-border rounded-2xl shadow-lg overflow-hidden">
            <div className="aspect-video bg-gray-100 relative">
              <iframe 
                src="https://drive.google.com/file/d/1K8kmXIuVSrl857ndB4yQRIuD2_ZhdCPf/preview" 
                width="100%" 
                height="100%" 
                allow="autoplay"
                className="w-full h-full"
              />
            </div>
            <CardContent className="p-4">
              <h3 className="text-base font-semibold text-card-foreground mb-2">Arquivo do Modelo</h3>
              <p className="text-muted-foreground text-xs mb-4">
                Moldes em alta qualidade prontos para impressão em formato A4.
              </p>

              {/* Download Button */}
              <Button
                onClick={handleDownload}
                disabled={isDownloading}
                className={`w-full gradient-button text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all transform hover:scale-105 ${
                  downloadComplete ? 'bg-green-500' : ''
                }`}
              >
                {downloadComplete ? (
                  <>
                    <CheckCircle className="mr-2 h-5 w-5" />
                    Download Concluído!
                  </>
                ) : isDownloading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                    Baixando...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-5 w-5" />
                    Baixar Modelo
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}