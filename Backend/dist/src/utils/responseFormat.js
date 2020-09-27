"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class ResponseFormat {
    constructor() { }
    handleSuccess(res, obj) {
        const { status, statusCode, data, } = obj;
        return res.status(statusCode).json({
            statusCode,
            status,
            data,
        });
    }
    handleError(res, obj) {
        res.status(obj.statusCode).json(obj);
    }
    handleErrorCustom(obj) {
        const res = express_1.default.response;
        res.status(obj.statusCode).json(obj);
    }
}
exports.ResponseFormat = ResponseFormat;
//# sourceMappingURL=responseFormat.js.map