import * as mongoose from 'mongoose';
import { IUser } from './user.schema';

interface IUserModel extends IUser, mongoose.Document {}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
}, {
    // toJSON: true,
    timestamps: true,
    versionKey: false,
});

// define compound indexes in the schema
userSchema.index({
    email: 1,
});

const UserDao = mongoose.model<IUserModel>('User', userSchema);

export default UserDao;