/**
 * Master YouTube Audio Library Background Music Catalog
 * All tracks are hosted in production AWS S3 and mirrored in public/assets/reusable/music.
 */

export interface BgmTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  mood: 'chill' | 'mystery' | 'dynamic' | 'upbeat' | 'tech' | 'acoustic';
  tags: string[];
  recommendedVolume: number;
  fileName: string;
  localPath: string;
  s3Key: string;
  s3Url: string;
}

export const YOUTUBE_BGM_TRACKS: BgmTrack[] = [
  {
    id: '19th-floor-bobby-richards',
    title: '19th Floor',
    artist: 'Bobby Richards',
    genre: 'R&B / Soul / Jazz',
    mood: 'chill',
    tags: ['chill', 'smooth', 'evening', 'relaxed', 'lofi'],
    recommendedVolume: 0.15,
    fileName: '19th-floor-bobby-richards.mp3',
    localPath: '/assets/reusable/music/19th-floor-bobby-richards.mp3',
    s3Key: 'assets/reusable/music/19th-floor-bobby-richards.mp3',
    s3Url: 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/music/19th-floor-bobby-richards.mp3',
  },
  {
    id: 'illusions-anno-domini-beats',
    title: 'Illusions',
    artist: 'Anno Domini Beats',
    genre: 'Hip Hop / Trap',
    mood: 'mystery',
    tags: ['mystery', 'suspense', 'dark', 'tension', 'investigation'],
    recommendedVolume: 0.14,
    fileName: 'illusions-anno-domini-beats.mp3',
    localPath: '/assets/reusable/music/illusions-anno-domini-beats.mp3',
    s3Key: 'assets/reusable/music/illusions-anno-domini-beats.mp3',
    s3Url: 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/music/illusions-anno-domini-beats.mp3',
  },
  {
    id: 'true-messiah-dj-freedem',
    title: 'True Messiah',
    artist: 'DJ Freedem',
    genre: 'Hip Hop / Beats',
    mood: 'dynamic',
    tags: ['dynamic', 'rhythm', 'modern', 'hustle', 'viral'],
    recommendedVolume: 0.15,
    fileName: 'true-messiah-dj-freedem.mp3',
    localPath: '/assets/reusable/music/true-messiah-dj-freedem.mp3',
    s3Key: 'assets/reusable/music/true-messiah-dj-freedem.mp3',
    s3Url: 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/music/true-messiah-dj-freedem.mp3',
  },
  {
    id: 'not-for-nothing-otis-mcdonald',
    title: 'Not For Nothing',
    artist: 'Otis McDonald',
    genre: 'Funk / Hip Hop',
    mood: 'upbeat',
    tags: ['upbeat', 'creator', 'positive', 'classic', 'groove'],
    recommendedVolume: 0.16,
    fileName: 'not-for-nothing-otis-mcdonald.mp3',
    localPath: '/assets/reusable/music/not-for-nothing-otis-mcdonald.mp3',
    s3Key: 'assets/reusable/music/not-for-nothing-otis-mcdonald.mp3',
    s3Url: 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/music/not-for-nothing-otis-mcdonald.mp3',
  },
  {
    id: 'book-the-rental-wit-it-rage',
    title: 'Book The Rental Wit It',
    artist: 'RAGE',
    genre: 'Hip Hop / Trap',
    mood: 'tech',
    tags: ['tech', 'energy', 'hustle', 'modern', 'fast'],
    recommendedVolume: 0.14,
    fileName: 'book-the-rental-wit-it-rage.mp3',
    localPath: '/assets/reusable/music/book-the-rental-wit-it-rage.mp3',
    s3Key: 'assets/reusable/music/book-the-rental-wit-it-rage.mp3',
    s3Url: 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/music/book-the-rental-wit-it-rage.mp3',
  },
  {
    id: 'something-is-going-on-godmode',
    title: 'Something is Going On',
    artist: 'Godmode',
    genre: 'Cinematic / Suspense',
    mood: 'mystery',
    tags: ['mystery', 'thriller', 'tension', 'cinematic', 'deep'],
    recommendedVolume: 0.15,
    fileName: 'something-is-going-on-godmode.mp3',
    localPath: '/assets/reusable/music/something-is-going-on-godmode.mp3',
    s3Key: 'assets/reusable/music/something-is-going-on-godmode.mp3',
    s3Url: 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/music/something-is-going-on-godmode.mp3',
  },
  {
    id: 'that-one-bar-scene-rkvc',
    title: 'That One Bar Scene',
    artist: 'RKVC',
    genre: 'Rock / Acoustic',
    mood: 'acoustic',
    tags: ['acoustic', 'story', 'chill', 'bar', 'warm'],
    recommendedVolume: 0.15,
    fileName: 'that-one-bar-scene-rkvc.mp3',
    localPath: '/assets/reusable/music/that-one-bar-scene-rkvc.mp3',
    s3Key: 'assets/reusable/music/that-one-bar-scene-rkvc.mp3',
    s3Url: 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/music/that-one-bar-scene-rkvc.mp3',
  },
  {
    id: 'crock-pot-diamond-ortiz',
    title: 'Crock Pot',
    artist: 'Diamond Ortiz',
    genre: 'Funk / Retro',
    mood: 'upbeat',
    tags: ['upbeat', 'retro', 'funky', 'bright', 'creator'],
    recommendedVolume: 0.16,
    fileName: 'crock-pot-diamond-ortiz.mp3',
    localPath: '/assets/reusable/music/crock-pot-diamond-ortiz.mp3',
    s3Key: 'assets/reusable/music/crock-pot-diamond-ortiz.mp3',
    s3Url: 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/music/crock-pot-diamond-ortiz.mp3',
  },
  {
    id: 'parasail-silent-partner',
    title: 'Parasail',
    artist: 'Silent Partner',
    genre: 'Acoustic / Folk',
    mood: 'acoustic',
    tags: ['acoustic', 'inspiring', 'hopeful', 'travel', 'calm'],
    recommendedVolume: 0.16,
    fileName: 'parasail-silent-partner.mp3',
    localPath: '/assets/reusable/music/parasail-silent-partner.mp3',
    s3Key: 'assets/reusable/music/parasail-silent-partner.mp3',
    s3Url: 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/music/parasail-silent-partner.mp3',
  },
  {
    id: 'crimson-fly-huma-huma',
    title: 'Crimson Fly',
    artist: 'Huma-Huma',
    genre: 'Pop / Dance',
    mood: 'upbeat',
    tags: ['upbeat', 'happy', 'bright', 'positive', 'energetic'],
    recommendedVolume: 0.16,
    fileName: 'crimson-fly-huma-huma.mp3',
    localPath: '/assets/reusable/music/crimson-fly-huma-huma.mp3',
    s3Key: 'assets/reusable/music/crimson-fly-huma-huma.mp3',
    s3Url: 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/music/crimson-fly-huma-huma.mp3',
  },
  {
    id: 'what-it-is-silent-partner',
    title: 'What It Is',
    artist: 'Silent Partner',
    genre: 'R&B / Soul',
    mood: 'chill',
    tags: ['chill', 'smooth', 'modern', 'clean', 'lofi'],
    recommendedVolume: 0.15,
    fileName: 'what-it-is-silent-partner.mp3',
    localPath: '/assets/reusable/music/what-it-is-silent-partner.mp3',
    s3Key: 'assets/reusable/music/what-it-is-silent-partner.mp3',
    s3Url: 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/music/what-it-is-silent-partner.mp3',
  },
  {
    id: 'vishnu-patrick-patrikios',
    title: 'Vishnu',
    artist: 'Patrick Patrikios',
    genre: 'Ambient / Cinematic',
    mood: 'tech',
    tags: ['tech', 'ambient', 'focus', 'deep', 'modern'],
    recommendedVolume: 0.14,
    fileName: 'vishnu-patrick-patrikios.mp3',
    localPath: '/assets/reusable/music/vishnu-patrick-patrikios.mp3',
    s3Key: 'assets/reusable/music/vishnu-patrick-patrikios.mp3',
    s3Url: 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/music/vishnu-patrick-patrikios.mp3',
  },
  {
    id: 'dutty-vibe-tracks',
    title: 'Dutty',
    artist: 'Vibe Tracks',
    genre: 'Reggae / Pop',
    mood: 'chill',
    tags: ['chill', 'reggae', 'vibe', 'relaxing', 'summer'],
    recommendedVolume: 0.15,
    fileName: 'dutty-vibe-tracks.mp3',
    localPath: '/assets/reusable/music/dutty-vibe-tracks.mp3',
    s3Key: 'assets/reusable/music/dutty-vibe-tracks.mp3',
    s3Url: 'https://remotionlambda-useast1-2zq6twaok1.s3.us-east-1.amazonaws.com/assets/reusable/music/dutty-vibe-tracks.mp3',
  },
];

export function getBgmTrackById(id: string): BgmTrack | undefined {
  return YOUTUBE_BGM_TRACKS.find((t) => t.id === id);
}

export function getBgmTracksByMood(mood: string): BgmTrack[] {
  return YOUTUBE_BGM_TRACKS.filter((t) => t.mood === mood);
}
