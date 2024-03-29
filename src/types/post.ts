export interface Post {
  id: string;
  name: string;
  starred: boolean | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string;
}
