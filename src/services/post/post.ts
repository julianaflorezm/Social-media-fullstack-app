export enum PostType {
  TEXT = 'text',
  IMAGE = 'image',
}

export type UpdatePostPayload = {
  id?: number;
  authorId: number;
  type: "image" | "text";
  textContent?: string;
  caption?: string;
  source?: File | null;
};


export type CreatePostPayload = {
  authorId: number;
  type: "image" | "text";
  textContent?: string;
  caption?: string;
  source?: File | null;
};
