import { AuthenticationError, UserInputError } from 'apollo-server-express';
import { Request } from 'express';
import User, { UserDocument } from '../models/User.js';
import Book, { BookDocument } from '../models/Book.js';
import { signToken } from '../services/auth.js'; // Import the signToken function

// Define the custom type for the context
interface Context {
    req: Request;
}

// Updated Auth Payload type
interface AuthPayload {
    token: string;
    user: UserDocument;
}

interface BookArgs {
    searchInput: string;
}

// Resolvers
const resolvers = {
    Query: {
        me: async (_: unknown, __: unknown, context: Context): Promise<UserDocument | null> => {
            const user = context.req.user;

            if (!user) {
                throw new AuthenticationError('You must be logged in');
            }

            const foundUser = await User.findById(user._id).populate('savedBooks');
            if (!foundUser) {
                throw new UserInputError('User not found');
            }

            return foundUser;
        },

        users: async (): Promise<UserDocument[]> => {
            return User.find({});
        },

        singleUser: async (
            _: unknown,
            { _id }: { _id: string } // Changed userId to _id
        ): Promise<UserDocument | null> => {
            return User.findById(_id); // Changed userId to _id
        },
        searchBooks: async (_parent: any, { searchInput }: BookArgs) => {
            const books = await Book.find({
                $or: [
                    { title: { $regex: searchInput, $options: 'i' } },
                    { authors: { $regex: searchInput, $options: 'i' } },
                    { description: { $regex: searchInput, $options: 'i' } },
                ],
            });

            if (!books) {
                throw new Error('Cannot find any books');
            }
            return books;
        },
    },

    Mutation: {
        addUser: async (
            _: unknown,
            { username, email, password }: { username: string; email: string; password: string }
        ): Promise<AuthPayload> => {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new UserInputError('Email already in use');
            }

            const newUser = await User.create({ username, email, password });
            const token = signToken(newUser.username, newUser.email, newUser._id.toString()); // Ensure _id is string
            return { token, user: newUser };
        },

        login: async (
            _: unknown,
            { email, password }: { email: string; password: string }
        ): Promise<AuthPayload> => {
            const user = await User.findOne({ email }) as UserDocument;
            if (!user || !(await user.isCorrectPassword(password))) {
                throw new AuthenticationError('Invalid email or password');
            }

            const token = signToken(user.username, user.email, user._id.toString()); // Ensure _id is string
            return { token, user };
        },

        saveBook: async (
            _: unknown,
            { bookData }: { bookData: BookDocument },
            context: Context
        ): Promise<UserDocument> => {
            const user = context.req.user;

            if (!user) {
                throw new AuthenticationError('You must be logged in');
            }

            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { $addToSet: { savedBooks: bookData } },
                { new: true }
            ).populate('savedBooks');

            if (!updatedUser) {
                throw new UserInputError('Error saving book');
            }

            return updatedUser;
        },

        removeBook: async (
            _: unknown,
            { bookId }: { bookId: string },
            context: Context
        ): Promise<UserDocument> => {
            const user = context.req.user;

            if (!user) {
                throw new AuthenticationError('You must be logged in');
            }

            const updatedUser = await User.findByIdAndUpdate(
                user._id,
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
