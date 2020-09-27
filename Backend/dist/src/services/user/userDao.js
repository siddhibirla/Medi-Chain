"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __importStar(require("mongoose"));
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    hospitalName: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
userSchema.index({
    email: 1,
    userId: 1,
});
const UserDao = mongoose.model('User', userSchema);
exports.default = UserDao;
//# sourceMappingURL=userDao.js.map