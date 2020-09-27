"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const boom_1 = __importDefault(require("boom"));
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const ts_interface_checker_1 = require("ts-interface-checker");
const messages_1 = require("../constants/messages");
const services_1 = require("../services");
const checkProperty_1 = __importDefault(require("../utils/checkProperty"));
const responseFormat_1 = require("../utils/responseFormat");
const UserService_ti_1 = __importDefault(require("../utils/validators/UserService-ti"));
const winston_1 = __importDefault(require("../utils/winston"));
const responseFormat = new responseFormat_1.ResponseFormat();
const { RegisterForm, LoginForm } = ts_interface_checker_1.createCheckers(UserService_ti_1.default);
exports.userRegister = (request, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const form = request.body;
    if (checkProperty_1.default(form)) {
        const { output } = boom_1.default.expectationFailed(messages_1.messages.ALL_REQUIRED);
        return responseFormat.handleError(res, output);
    }
    try {
        RegisterForm.check(form);
        return services_1.allServices.userService.register(form).then(() => {
            responseFormat.handleSuccess(res, {
                status: messages_1.messages.SUCCESS,
                statusCode: http_status_codes_1.default.OK,
                data: {
                    message: messages_1.messages.OPERATION_SUCCESS
                }
            });
        }).catch((err) => {
            winston_1.default.error('User Register: %o', err);
            const { output } = boom_1.default.badRequest(err);
            return responseFormat.handleError(res, output);
        });
    }
    catch (err) {
        winston_1.default.error('Validation Error: %o', err);
        const { output } = boom_1.default.badRequest(err);
        return responseFormat.handleError(res, output);
    }
});
exports.userLogin = (request, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const form = request.body;
    if (checkProperty_1.default(form)) {
        const { output } = boom_1.default.expectationFailed(messages_1.messages.ALL_REQUIRED);
        return responseFormat.handleError(res, output);
    }
    try {
        LoginForm.check(form);
        return services_1.allServices.userService.login(form).then((token) => {
            responseFormat.handleSuccess(res, {
                status: messages_1.messages.SUCCESS,
                statusCode: http_status_codes_1.default.OK,
                data: {
                    message: messages_1.messages.OPERATION_SUCCESS,
                    token,
                },
            });
        }).catch((err) => {
            winston_1.default.error('customerLogin: %o', err);
            const { output } = boom_1.default.badRequest(err);
            return responseFormat.handleError(res, output);
        });
    }
    catch (err) {
        winston_1.default.error('Validation Error: %o', err);
        const { output } = boom_1.default.badRequest(err);
        return responseFormat.handleError(res, output);
    }
});
//# sourceMappingURL=controller.js.map