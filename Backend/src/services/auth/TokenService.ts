
import jwt from 'jsonwebtoken';
import './passport';

const { JWT_SECRET } = process.env;

export interface Claims {
    id: string;
    email: string;
}

export class TokenService {

    constructor() {}

    generateToken(id: string, email: string, role?: string): string {
        const secret = JWT_SECRET || "";
        return jwt.sign({
            id,
            email,
        }, secret, { expiresIn: '1h' });
    }
}