import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { loginSchema, insertFavoriteSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      // For MVP, accept any valid email/password combination
      // TODO: Implement proper webhook validation with purchase email
      if (email && password) {
        const user = await storage.getUserByEmail(email) || await storage.createUser({ email, password });
        res.json({ user: { id: user.id, email: user.email } });
      } else {
        res.status(401).json({ message: "Invalid credentials" });
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Anime routes
  app.get("/api/animes", async (req, res) => {
    try {
      const animes = await storage.getAnimes();
      res.json(animes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch animes" });
    }
  });

  app.get("/api/animes/:id", async (req, res) => {
    try {
      const anime = await storage.getAnime(req.params.id);
      if (!anime) {
        return res.status(404).json({ message: "Anime not found" });
      }
      res.json(anime);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch anime" });
    }
  });

  // Character routes
  app.get("/api/animes/:animeId/characters", async (req, res) => {
    try {
      const characters = await storage.getCharactersByAnime(req.params.animeId);
      res.json(characters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch characters" });
    }
  });

  app.get("/api/characters/:id", async (req, res) => {
    try {
      const character = await storage.getCharacter(req.params.id);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      res.json(character);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch character" });
    }
  });

  // PDF download route
  app.get("/api/characters/:id/download", async (req, res) => {
    try {
      const character = await storage.getCharacter(req.params.id);
      if (!character) {
        return res.status(404).json({ message: "Character not found" });
      }
      
      // Generate a simple PDF content for demonstration
      const pdfContent = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT
/F1 12 Tf
72 720 Td
(${character.name} Modelo) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000204 00000 n 
trailer
<< /Size 5 /Root 1 0 R >>
startxref
297
%%EOF`;

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${character.name.replace(/\s+/g, '_')}_modelo.pdf"`);
      res.send(Buffer.from(pdfContent));
    } catch (error) {
      res.status(500).json({ message: "Failed to download PDF" });
    }
  });

  // Favorites routes
  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const favorites = await storage.getFavorites(userId);
      const characterIds = favorites.map(fav => fav.characterId);
      const characters = await storage.getCharactersByIds(characterIds);
      res.json(characters);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const favoriteData = insertFavoriteSchema.parse(req.body);
      const favorite = await storage.addFavorite(favoriteData);
      res.json(favorite);
    } catch (error) {
      res.status(400).json({ message: "Invalid favorite data" });
    }
  });

  app.delete("/api/favorites/:userId/:characterId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const characterId = req.params.characterId;
      await storage.removeFavorite(userId, characterId);
      res.json({ message: "Favorite removed" });
    } catch (error) {
      res.status(500).json({ message: "Failed to remove favorite" });
    }
  });

  app.get("/api/favorites/:userId/check/:characterId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const characterId = req.params.characterId;
      const favorites = await storage.getFavorites(userId);
      const isFavorite = favorites.some(fav => fav.characterId === characterId);
      res.json({ isFavorite });
    } catch (error) {
      res.status(500).json({ message: "Failed to check favorite" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
