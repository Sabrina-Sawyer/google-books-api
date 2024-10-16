// import jwt from 'jsonwebtoken';
// import dotenv from 'dotenv';

// dotenv.config();

// interface JwtPayload {
//   _id: string;
//   username: string;
//   email: string;
// }

// /**
//  * Function to sign a JWT token with user information.
//  * @param {string} username - The username of the user.
//  * @param {string} email - The email of the user.
//  * @param {string} _id - The user's unique identifier.
//  * @returns {string} - A signed JWT token.
//  */
// export const signToken = (username: string, email: string, _id: string) => {
//   const payload: JwtPayload = { username, email, _id };
//   const secretKey = process.env.JWT_SECRET_KEY || '';

//   return jwt.sign(payload, secretKey, { expiresIn: '1h' });
// };

// /**
//  * Function to authenticate a token and attach user data to the context.
//  * @param {string} token - The JWT token from the request.
//  * @returns {JwtPayload | null} - The user data or null if token is invalid.
//  */
// export const authenticateToken = (token: string): JwtPayload | null => {
//   if (!token) return null;

//   const secretKey = process.env.JWT_SECRET_KEY || '';

//   try {
//     const user = jwt.verify(token, secretKey) as JwtPayload;
//     return user;
//   } catch (err) {
//     console.error('Invalid token:', err);
//     return null; 
//   }
// };

import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware for adding the authenticated user to the GraphQL context.
 * @param req - Express request object.
 * @param res - Express response object.
 * @returns The context for GraphQL resolvers.
 */
export const authMiddleware = ({ req }: { req: Request, res: Response }) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract token

  if (!token) {
    throw new Error('No token provided');
  }

  const user = authenticateToken(token); // Authenticate and get user data

  return { user }; // Return user data in context
};

/**
 * Function to authenticate the token and return user data.
 * @param token - JWT token.
 * @returns The authenticated user data.
 */
const authenticateToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
};
