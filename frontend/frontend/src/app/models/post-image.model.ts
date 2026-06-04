export interface PostImage {
  id: number;
  url: string;
  altText: string | null;
  orderIndex: number;
  createdAt: string;
}

export interface UpdatePostImageRequest {
  altText: string | null;
}

export interface ReorderPostImagesRequest {
  imageIds: number[];
}
