import { UserInputError, AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

const signToken = (userId: string, email: string, password: string): string => {
    const payload = { userId, email };
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });
};

const resolvers = {
    Mutation: {
        // Create a new user, sign a token, and return it
        addUser: async (_: any, { username, email, password }: { username: string; email: string; password: string }) => {
            const user = await User.create({ username, email, password }) as { _id: string; email: string; password: string };

            if (!user) {
                throw new UserInputError('Something went wrong while creating the user!');
            }

            const token = signToken(user._id.toString(), user.email, user.password);
            return { token, user };
        },

        // Log in a user and return a token and user data
        login: async (_: any, { email, password }: { email: string; password: string }) => {
            const user = await User.findOne({
                $or: [{ email }, { username: email }],
            }) as { _id: string; email: string; password: string; isCorrectPassword: (password: string) => Promise<boolean> };

            if (!user) {
                throw new AuthenticationError("Can't find this user");
            }

            const correctPw = await user.isCorrectPassword(password);
            if (!correctPw) {
                throw new AuthenticationError('Incorrect password');
            }

            const token = signToken(user._id.toString(), user.email, user.password);
            return { token, user };
        },
    },
};

export default resolvers;