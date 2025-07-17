import { users, animes, characters, type User, type InsertUser, type Anime, type Character, type Favorite, type InsertFavorite } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAnimes(): Promise<Anime[]>;
  getAnime(id: string): Promise<Anime | undefined>;
  getCharactersByAnime(animeId: string): Promise<Character[]>;
  getCharacter(id: string): Promise<Character | undefined>;
  getFavorites(userId: number): Promise<Favorite[]>;
  addFavorite(favorite: InsertFavorite): Promise<Favorite>;
  removeFavorite(userId: number, characterId: string): Promise<void>;
  getCharactersByIds(characterIds: string[]): Promise<Character[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private animes: Map<string, Anime>;
  private characters: Map<string, Character>;
  private favorites: Map<number, Favorite>;
  private currentUserId: number;
  private currentFavoriteId: number;

  constructor() {
    this.users = new Map();
    this.animes = new Map();
    this.characters = new Map();
    this.favorites = new Map();
    this.currentUserId = 1;
    this.currentFavoriteId = 1;
    this.initializeData();
  }

  private initializeData() {
    // Initialize anime data
    const animeData = [
      { id: 'naruto', name: 'Naruto', modelCount: 12, imageUrl: 'https://i.imgur.com/W9a5MMf.png' },
      { id: 'dragonball', name: 'Dragon Ball', modelCount: 15, imageUrl: 'https://i.imgur.com/MFSQWcK.png' },
      { id: 'onepiece', name: 'One Piece', modelCount: 18, imageUrl: 'https://i.imgur.com/PChIxND.png' },
      { id: 'aot', name: 'Attack on Titan', modelCount: 8, imageUrl: 'https://i.imgur.com/11B84ZO.png' },
      { id: 'demonslayer', name: 'Demon Slayer', modelCount: 10, imageUrl: 'https://i.imgur.com/gMClWCT.png' },
      { id: 'mha', name: 'My Hero Academia', modelCount: 14, imageUrl: 'https://i.imgur.com/27mMfBr.png' }
    ];

    animeData.forEach(anime => this.animes.set(anime.id, anime));

    // Initialize character data
    const characterData = [
      // Naruto characters
      { id: 'naruto-uzumaki', animeId: 'naruto', name: 'Naruto Uzumaki', imageUrl: 'https://i.imgur.com/UytA6pp.png', pdfUrl: '/pdfs/naruto-uzumaki.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'sasuke-uchiha', animeId: 'naruto', name: 'Sasuke Uchiha', imageUrl: 'https://images.unsplash.com/photo-1613634735172-46c78e9f8f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300', pdfUrl: '/pdfs/sasuke-uchiha.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'sakura-haruno', animeId: 'naruto', name: 'Sakura Haruno', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300', pdfUrl: '/pdfs/sakura-haruno.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'kakashi-hatake', animeId: 'naruto', name: 'Kakashi Hatake', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300', pdfUrl: '/pdfs/kakashi-hatake.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },

      // Dragon Ball characters
      { id: 'goku', animeId: 'dragonball', name: 'Son Goku', imageUrl: 'https://i.imgur.com/94T9zkW.png', pdfUrl: '/pdfs/goku.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'vegeta', animeId: 'dragonball', name: 'Vegeta', imageUrl: 'https://images.unsplash.com/photo-1613634735172-46c78e9f8f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300', pdfUrl: '/pdfs/vegeta.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'gohan', animeId: 'dragonball', name: 'Son Gohan', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300', pdfUrl: '/pdfs/gohan.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'piccolo', animeId: 'dragonball', name: 'Piccolo', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300', pdfUrl: '/pdfs/piccolo.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },

      // One Piece characters
      { id: 'luffy', animeId: 'onepiece', name: 'Monkey D. Luffy', imageUrl: 'https://i.imgur.com/33MLsMQ.png', pdfUrl: '/pdfs/luffy.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'zoro', animeId: 'onepiece', name: 'Roronoa Zoro', imageUrl: 'https://images.unsplash.com/photo-1613634735172-46c78e9f8f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300', pdfUrl: '/pdfs/zoro.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'nami', animeId: 'onepiece', name: 'Nami', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300', pdfUrl: '/pdfs/nami.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'sanji', animeId: 'onepiece', name: 'Sanji', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300', pdfUrl: '/pdfs/sanji.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },

      // Attack on Titan characters
      { id: 'eren', animeId: 'aot', name: 'Eren Yeager', imageUrl: 'https://i.imgur.com/7tYmiSX.png', pdfUrl: '/pdfs/eren.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'mikasa', animeId: 'aot', name: 'Mikasa Ackerman', imageUrl: 'https://i.imgur.com/K01dt2G.png', pdfUrl: '/pdfs/mikasa.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'armin', animeId: 'aot', name: 'Armin Arlert', imageUrl: 'https://i.imgur.com/hPjaGcb.png', pdfUrl: '/pdfs/armin.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'levi', animeId: 'aot', name: 'Levi Ackerman', imageUrl: 'https://i.imgur.com/GXOJJAl.png', pdfUrl: '/pdfs/levi.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },

      // Demon Slayer characters
      { id: 'tanjiro', animeId: 'demonslayer', name: 'Tanjiro Kamado', imageUrl: 'https://i.imgur.com/1ooRLwt.png', pdfUrl: '/pdfs/tanjiro.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'nezuko', animeId: 'demonslayer', name: 'Nezuko Kamado', imageUrl: 'https://images.unsplash.com/photo-1613634735172-46c78e9f8f95?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300', pdfUrl: '/pdfs/nezuko.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'zenitsu', animeId: 'demonslayer', name: 'Zenitsu Agatsuma', imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300', pdfUrl: '/pdfs/zenitsu.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'inosuke', animeId: 'demonslayer', name: 'Inosuke Hashibira', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300', pdfUrl: '/pdfs/inosuke.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },

      // My Hero Academia characters
      { id: 'deku', animeId: 'mha', name: 'Izuku Midoriya', imageUrl: 'https://i.imgur.com/66LpbwK.png', pdfUrl: '/pdfs/deku.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'bakugo', animeId: 'mha', name: 'Katsuki Bakugo', imageUrl: 'https://i.imgur.com/sb087SA.png', pdfUrl: '/pdfs/bakugo.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'todoroki', animeId: 'mha', name: 'Shoto Todoroki', imageUrl: 'https://i.imgur.com/ykxx1fR.png', pdfUrl: '/pdfs/todoroki.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' },
      { id: 'allmight', animeId: 'mha', name: 'All Might', imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=300', pdfUrl: '/pdfs/allmight.pdf', videoUrl: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' }
    ];

    characterData.forEach(character => this.characters.set(character.id, character));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAnimes(): Promise<Anime[]> {
    return Array.from(this.animes.values());
  }

  async getAnime(id: string): Promise<Anime | undefined> {
    return this.animes.get(id);
  }

  async getCharactersByAnime(animeId: string): Promise<Character[]> {
    return Array.from(this.characters.values()).filter(character => character.animeId === animeId);
  }

  async getCharacter(id: string): Promise<Character | undefined> {
    return this.characters.get(id);
  }

  async getFavorites(userId: number): Promise<Favorite[]> {
    return Array.from(this.favorites.values()).filter(fav => fav.userId === userId);
  }

  async addFavorite(favorite: InsertFavorite): Promise<Favorite> {
    const id = this.currentFavoriteId++;
    const newFavorite: Favorite = { ...favorite, id };
    this.favorites.set(id, newFavorite);
    return newFavorite;
  }

  async removeFavorite(userId: number, characterId: string): Promise<void> {
    const favoriteToRemove = Array.from(this.favorites.entries()).find(
      ([_, fav]) => fav.userId === userId && fav.characterId === characterId
    );
    if (favoriteToRemove) {
      this.favorites.delete(favoriteToRemove[0]);
    }
  }

  async getCharactersByIds(characterIds: string[]): Promise<Character[]> {
    return characterIds.map(id => this.characters.get(id)).filter(Boolean) as Character[];
  }
}

export const storage = new MemStorage();
