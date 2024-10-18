import { UserInputError, AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper function to sign JWT tokens
const signToken = (userId: string, email: string): string => {
    const payload = { userId, email };
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

const resolvers = {
    Query: {
        me: async (_: any, __: any, context: { user: { _id: string } }) => {
            if (!context.user) {
                throw new AuthenticationError('You must be logged in');
            }

            const user = await User.findById(context.user._id).populate('savedBooks');
            if (!user) {
                throw new UserInputError('User not found');
            }

            return user;
        },

        // Updated resolver for searching books using Fetch API
        searchBooks: async (_: any, { query }: { query: string }) => {
            try {
                const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch books from Google API');
                }
                
                const data = await response.json();
                
                return data.items.map((item: any) => ({
                    bookId: item.id,
                    authors: item.volumeInfo.authors || [],
                    description: item.volumeInfo.description || '',
                    title: item.volumeInfo.title || '',
                    image: item.volumeInfo.imageLinks?.thumbnail || '',
                    link: item.volumeInfo.infoLink,
                }));
            } catch (error) {
                if (error instanceof Error) {
                    throw new UserInputError('Error fetching books: ' + error.message);
                } else {
                    throw new UserInputError('Error fetching books');
                }
            }
        },
    },

    Mutation: {
        addUser: async (
            _: any,
            { username, email, password }: { username: string; email: string; password: string }
        ) => {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new UserInputError('Email already in use');
            }

            const user = await User.create({ username, email, password });
            if (!user) {
                throw new UserInputError('Error creating user');
            }

            const token = signToken((user._id as string).toString(), user.email);
            return { token, user };
        },

        login: async (
            _: any,
            { email, password }: { email: string; password: string }
        ) => {
            const user = await User.findOne({ $or: [{ email }, { username: email }] }) as { _id: string, email: string, isCorrectPassword: (password: string) => Promise<boolean> };
            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }

            const isCorrectPassword = await user.isCorrectPassword(password);
            if (!isCorrectPassword) {
                throw new AuthenticationError('Incorrect password');
            }

            const token = signToken(user._id.toString(), user.email);
            return { token, user };
        },

        saveBook: async (
            _: any,
            { bookData }: { bookData: { bookId: string; authors: string[]; description: string; title: string; image: string; link: string } },
            context: { user: { _id: string } }
        ) => {
            if (!context.user) {
                throw new AuthenticationError('You must be logged in');
            }

            const updatedUser = await User.findByIdAndUpdate(
                context.user._id,
                { $addToSet: { savedBooks: bookData } },
                { new: true }
            ).populate('savedBooks');

            if (!updatedUser) {
                throw new UserInputError('Error saving book');
            }

            return updatedUser;
        },

        removeBook: async (
            _: any,
            { bookId }: { bookId: string },
            context: { user: { _id: string } }
        ) => {
            if (!context.user) {
                throw new AuthenticationError('You must be logged in');
            }

            const updatedUser = await User.findByIdAndUpdate(
                context.user._id,
                { $pull: { savedBooks: { bookId } } },
                { new: true }
            ).populate('savedBooks');

            if (!updatedUser) {
                throw new UserInputError('Error removing book');
            }

            return updatedUser;
        },
    },
};

export default resolvers;
