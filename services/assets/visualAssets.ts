export type VisualAssetType = 'video' | 'image' | 'graphic';

export type VisualAssetSource = 'local' | 'cloudinary' | 'drive';

export type VisualAsset = {
  id: string;
  type: VisualAssetType;
  title?: string;
  previewUrl?: string;
  thumbnailUrl?: string;
  source: VisualAssetSource;
  query: string;
  category: string;
  driveFileId?: string;
  mimeType?: string;
  sizeBytes?: number;
};
