import type { Book } from './Book';

export interface User {
  username: string | null;
  email: string | null;
  password: string | null;
  savedBooks: Book[];
}

export interface UserDocument {
  userId: string;
  username: string;
  email: string;
  password: string;
  savedBooks: Book[];
  isCorrectPassword(password: string): Promise<boolean>;
  bookCount: number;
}
