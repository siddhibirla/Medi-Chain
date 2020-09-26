import dotenv from 'dotenv';
import mongoose from 'mongoose';
import logger from './winston';
dotenv.config();
const MONGO_URL = process.env.MONGO_URL || "";

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URL, {
        keepAlive: true,
        socketTimeoutMS: 0,
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
    .then(() => {
        logger.debug('MongoDB is connected');
    })
    .catch((err) => {
        logger.error(err);
        logger.debug('MongoDB connection unsuccessful.');
    });