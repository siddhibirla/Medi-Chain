"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const winston_1 = __importDefault(require("./winston"));
dotenv_1.default.config();
const MONGO_URL = process.env.MONGO_URL || "";
mongoose_1.default.Promise = global.Promise;
mongoose_1.default.connect(MONGO_URL, {
    keepAlive: true,
    socketTimeoutMS: 0,
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
})
    .then(() => {
    winston_1.default.debug('MongoDB is connected');
})
    .catch((err) => {
    winston_1.default.error(err);
    winston_1.default.debug('MongoDB connection unsuccessful.');
});
//# sourceMappingURL=database.js.map