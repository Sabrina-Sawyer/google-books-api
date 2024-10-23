import type { Book } from './Book';

export interface User {
  _id: string | null; // Changed from username to _id
  username: string | null;
  email: string | null;
  password: string | null;
  savedBooks: Book[];
}

export interface RegisterUserInput {
  username: string;
  email: string;
  password: string;
}

export interface UserDocument {
  _id: string; // Change userId to _id
  username: string;
  email: string;
  password: string;
  savedBooks: Book[];
  isCorrectPassword(password: string): Promise<boolean>;
  bookCount: number;
}
