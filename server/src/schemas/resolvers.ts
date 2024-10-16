import User from '../models/User.js';
import { signToken } from '../services/auth.js';
import { AuthenticationError, UserInputError } from 'apollo-server-express';

const resolvers = {
    Query: {
        // Get a single user by ID or username
        me: async (_: any, args: { id?: string; username?: string }, context: { user?: { _id: string } }) => {
            const foundUser = await User.findOne({
                $or: [
                    { _id: context.user ? context.user._id : args.id },
                    { username: args.username },
                ],
            });

            if (!foundUser) {
                throw new UserInputError('Cannot find a user with this id!');
            }

            return foundUser;
        },
    },

    Mutation: {
        // Create a new user, sign a token, and return it
        addUser: async (_: any, { username, email, password }: { username: string; email: string; password: string }) => {
            const user = await User.create({ username, email, password });

            if (!user) {
                throw new UserInputError('Something went wrong while creating the user!');
            }

            const token = signToken(user);
            return { token, user };
        },

        // Log in a user and return a token and user data
        login: async (_: any, { email, password }: { email: string; password: string }) => {
            const user = await User.findOne({
                $or: [{ email }, { username: email }],
            });

            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Wrong password!');
            }

            const token = signToken(user);
            return { token, user };
        },

        // Save a book to the user's savedBooks field
        saveBook: async (_: any, { bookData }: { bookData: any }, context: { user?: { _id: string } }) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $addToSet: { savedBooks: bookData } },
                    { new: true, runValidators: true }
                );

                if (!updatedUser) {
                    throw new UserInputError('Failed to save the book.');
                }

                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },

        // Remove a book from the user's savedBooks field
        removeBook: async (_: any, { bookId }: { bookId: string }, context: { user?: { _id: string } }) => {
            if (context.user) {
                const updatedUser = await User.findByIdAndUpdate(
                    context.user._id,
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );

                if (!updatedUser) {
                    throw new UserInputError("Couldn't find user with this id!");
                }

                return updatedUser;
            }
            throw new AuthenticationError('You need to be logged in!');
        },
    },
};

export default resolvers;
