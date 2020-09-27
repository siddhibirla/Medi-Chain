import bcrypt from 'bcrypt';
import { messages } from "../../constants/messages";
import logger from '../../utils/winston';
import { TokenService } from "../auth/TokenService";
//import { IUser } from "./user.schema";
import UserDao from "./userDao";
export const saltRounds = bcrypt.genSaltSync(10);
export interface RegisterForm {
    userId: string,
    hospitalName: string,
    password: string,
    email: string,
    confirm_password: string,
}
export interface LoginForm {
    userId: string;
    password: string;
}

export class UserService {
    
    constructor() {}

    async login (form: LoginForm): Promise<string> {
        const user = await UserDao.findOne({ userId: form.userId }).lean();
        if (!user) {
            logger.error('Error: %o', messages.INCORRECT_EMAIL_PASS);
            throw new Error(messages.INCORRECT_EMAIL_PASS);
        }
        const match = await bcrypt.compare(form.password, user.password);
        if (!match) {
            logger.error('Error: %o', messages.INCORRECT_EMAIL_PASS);
            throw new Error(messages.INCORRECT_EMAIL_PASS);
        }
        const token = new TokenService().generateToken(user._id, user.email);
        return token;
    }

    // getUserInfo(): Promise<IUser> {

    // }

    async register(form: RegisterForm): Promise<string> {
        const EmailExists = await UserDao.exists({userId: form.userId});
        const UserExists = await UserDao.exists({userId: form.userId});
        if (EmailExists) {
            throw new Error(messages.EMAIL_EXIST)
        }
        if (UserExists) {
            throw new Error(messages.USERNAME_EXISTS)
        }
        if(form.password !== form.confirm_password) {
            throw new Error(messages.PASSWORD_MISMATCH);
        }
        const hash = await bcrypt.hash(form.password, saltRounds);
        await UserDao.create({
            userId: form.userId,
            email: form.email,
           hospitalName: form.hospitalName,
           password: hash,
        });
        return "ok";
    }
}