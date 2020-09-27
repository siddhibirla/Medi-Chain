"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const t = __importStar(require("ts-interface-checker"));
exports.RegisterForm = t.iface([], {
    "userId": "string",
    "hospitalName": "string",
    "password": "string",
    "email": "string",
    "confirm_password": "string",
});
exports.LoginForm = t.iface([], {
    "userId": "string",
    "password": "string",
});
const exportedTypeSuite = {
    RegisterForm: exports.RegisterForm,
    LoginForm: exports.LoginForm,
};
exports.default = exportedTypeSuite;
//# sourceMappingURL=UserService-ti.js.map