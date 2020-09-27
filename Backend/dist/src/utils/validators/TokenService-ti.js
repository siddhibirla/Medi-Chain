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
exports.Claims = t.iface([], {
    "id": "string",
    "email": "string",
});
const exportedTypeSuite = {
    Claims: exports.Claims,
};
exports.default = exportedTypeSuite;
//# sourceMappingURL=TokenService-ti.js.map