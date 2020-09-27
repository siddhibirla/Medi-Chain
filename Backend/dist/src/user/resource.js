"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
require("../../../src/app/services/auth/passport");
const controller_1 = require("./controller");
exports.configure = (app) => {
    const group = express.Router();
    group.post('/register', controller_1.userRegister);
    group.post('/login', controller_1.userLogin);
    app.use("/user", group);
};
//# sourceMappingURL=resource.js.map