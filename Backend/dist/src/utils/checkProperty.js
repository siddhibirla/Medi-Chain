"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isEmpty = (obj) => {
    for (const key in obj) {
        if (obj[key] == null || obj[key] === "")
            return true;
    }
    return false;
};
exports.default = isEmpty;
//# sourceMappingURL=checkProperty.js.map