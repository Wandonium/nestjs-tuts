export class CreatePostDto {
  content: string;
  userId: number;
  published: boolean;
  timestamp: Date;
  category?: string;
}
