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
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const userDao_1 = __importDefault(require("../user/userDao"));
dotenv_1.default.config();
passport_1.default.use('user-jwt', new passport_jwt_1.Strategy({
    secretOrKey: process.env.JWT_SECRET,
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
}, ((jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    const customer = yield userDao_1.default.findOne({
        id: jwt_payload._id,
        email: jwt_payload.email,
    });
    try {
        if (customer) {
            return done(null, jwt_payload);
        }
        done(null, false);
    }
    catch (error) {
        done(error, null);
    }
}))));
//# sourceMappingURL=passport.js.map