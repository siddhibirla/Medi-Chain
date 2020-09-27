"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const messages_1 = require("../../constants/messages");
const winston_1 = __importDefault(require("../../utils/winston"));
const TokenService_1 = require("../auth/TokenService");
const userDao_1 = __importDefault(require("./userDao"));
exports.saltRounds = bcrypt_1.default.genSaltSync(10);
class UserService {
    constructor() { }
    login(form) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield userDao_1.default.findOne({ userId: form.userId }).lean();
            if (!user) {
                winston_1.default.error('Error: %o', messages_1.messages.INCORRECT_EMAIL_PASS);
                throw new Error(messages_1.messages.INCORRECT_EMAIL_PASS);
            }
            const match = yield bcrypt_1.default.compare(form.password, user.password);
            if (!match) {
                winston_1.default.error('Error: %o', messages_1.messages.INCORRECT_EMAIL_PASS);
                throw new Error(messages_1.messages.INCORRECT_EMAIL_PASS);
            }
            const token = new TokenService_1.TokenService().generateToken(user._id, user.email);
            return token;
        });
    }
    register(form) {
        return __awaiter(this, void 0, void 0, function* () {
            const EmailExists = yield userDao_1.default.exists({ userId: form.userId });
            const UserExists = yield userDao_1.default.exists({ userId: form.userId });
            if (!EmailExists) {
                throw new Error(messages_1.messages.EMAIL_EXIST);
            }
            if (!UserExists) {
                throw new Error(messages_1.messages.USERNAME_EXISTS);
            }
            if (form.password !== form.confirm_password) {
                throw new Error(messages_1.messages.PASSWORD_MISMATCH);
            }
            const hash = yield bcrypt_1.default.hash(form.password, exports.saltRounds);
            yield userDao_1.default.create({
                userId: form.userId,
                email: form.email,
                hospitalName: form.hospitalName,
                password: hash,
            });
            return "ok";
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map