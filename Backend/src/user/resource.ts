import * as express from 'express';
import '../../../src/app/services/auth/passport';
import { userLogin, userRegister } from './controller';
//const tokenService = new TokenService();

export const configure = (app: express.Router) => {
    const group = express.Router();
    group.post('/register', userRegister);
    group.post('/login', userLogin);
    
    app.use("/user", group);
};