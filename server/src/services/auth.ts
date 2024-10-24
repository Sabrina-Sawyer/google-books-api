import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
    _id: string;
    username: string;
    email: string;
}

declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload;
    }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers?.authorization;

    if (!authHeader) {
        console.error('Authorization header is missing');
        next(); // Proceed without user (public access)
        return; // Ensure the function exits here
    }

    const token = authHeader.split(' ')[1];
    const secretKey = process.env.JWT_SECRET_KEY || '';

    jwt.verify(token, secretKey, (err, user) => {
        if (err) {
            console.error('Invalid token:', err);
            res.status(403).json({ message: 'Invalid token' }); // Forbidden
            return; // Exit to avoid calling `next()` again
        }

        req.user = user as JwtPayload; // Attach user to request
        next(); // Proceed to the next middleware
    });
};

export const signToken = (username: string, email: string, _id: string): string => {
    const payload: JwtPayload = { username, email, _id };
    const secretKey = process.env.JWT_SECRET_KEY || '';

    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
