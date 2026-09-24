import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getOptimizedCloudinaryUrl(url: string, width = 800): string {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) return url;
  if (url.includes('/image/upload/f_auto') || url.includes('/image/upload/c_') || url.includes('/image/upload/w_')) return url;
  return url.replace('/image/upload/', `/image/upload/f_auto,q_auto,w_${width}/`);
}

export function getOptimizedAvatarUrl(url: string, size = 96): string {
  if (!url || typeof url !== 'string' || !url.includes('res.cloudinary.com')) return url;
  if (url.includes('/image/upload/f_auto') || url.includes('/image/upload/c_')) return url;
  return url.replace('/image/upload/', `/image/upload/c_thumb,w_${size},h_${size},g_face,f_auto,q_auto/`);
}

