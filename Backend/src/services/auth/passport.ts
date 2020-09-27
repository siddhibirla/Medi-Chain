import dotenv from 'dotenv';
import passport from 'passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import UserDao from '../user/userDao';

dotenv.config();

passport.use('user-jwt', new Strategy({
        secretOrKey: process.env.JWT_SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    (async(jwt_payload, done) => {
        const customer = await UserDao.findOne({
            id: jwt_payload._id,
            email: jwt_payload.email,
        });
        try {
            if (customer) {
                //const data = {...jwt_payload, role: Roles.CUSTOMER}
                return done(null, jwt_payload);
            }
            done(null, false);
        } catch (error) {
            done(error, null);
        }
 })));
