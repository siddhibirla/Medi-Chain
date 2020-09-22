
import jwt from 'jsonwebtoken';
import { ResponseFormat } from '../../utils/responseFormat';
import './passport';

const responseFormat =  new ResponseFormat();
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