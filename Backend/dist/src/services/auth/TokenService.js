"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("./passport");
const { JWT_SECRET } = process.env;
class TokenService {
    constructor() { }
    generateToken(id, email, role) {
        const secret = JWT_SECRET || "";
        return jsonwebtoken_1.default.sign({
            id,
            email,
        }, secret, { expiresIn: '1h' });
    }
}
exports.TokenService = TokenService;
//# sourceMappingURL=TokenService.js.map