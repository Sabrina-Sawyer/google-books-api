import { Request, Response, NextFunction } from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        user?: JwtPayload;
    }
}
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
    _id: string;
    username: string;
    email: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];
        const secretKey = process.env.JWT_SECRET_KEY || '';

        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }

            req.user = user as JwtPayload; // Type assertion
            return next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};

export const signToken = (username: string, email: string, _id: string): string => {
    const payload: JwtPayload = { username, email, _id };
    const secretKey = process.env.JWT_SECRET_KEY || '';

    return jwt.sign(payload, secretKey, { expiresIn: '1h' });
};
