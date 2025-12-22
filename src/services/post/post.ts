export enum PostType {
  TEXT = 'text',
  IMAGE = 'image',
}

export type CreatePostPayload = {
  authorId: number;
  type: "image" | "text";
  textContent?: string;
  caption?: string;
  source?: File | null;
};
