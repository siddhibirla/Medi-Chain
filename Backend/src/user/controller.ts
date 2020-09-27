import Boom from 'boom';
import { NextFunction, Request, Response } from 'express';
import httpCode from 'http-status-codes';
import { createCheckers } from 'ts-interface-checker';
import { messages } from '../constants/messages';
import { allServices } from '../services';
import { LoginForm, RegisterForm } from '../services/user/UserService';
import isEmpty from '../utils/checkProperty';
import { ResponseFormat } from '../utils/responseFormat';
import userValidation from '../utils/validators/UserService-ti';
import logger from "../utils/winston";

const responseFormat = new ResponseFormat();
const {
    RegisterForm,
    LoginForm
 } = createCheckers(userValidation);


export const userRegister = async (request: Request, res: Response, next: NextFunction) => {
    const form = request.body as RegisterForm;
    if (isEmpty(form)) {
        const { output } = Boom.expectationFailed(messages.ALL_REQUIRED);
        return responseFormat.handleError(res, output);
    }
    try {
        RegisterForm.check(form);
        return allServices.userService.register(form).then(() => {
            responseFormat.handleSuccess(res, {
                status: messages.SUCCESS,
                statusCode: httpCode.OK,
                data: {
                    message: messages.OPERATION_SUCCESS
                }
            });
        }).catch((err) => {
            logger.error('User Register: %o', err);
            const { output } = Boom.badRequest(err);
            return responseFormat.handleError(res, output);
        });
    }
    catch(err) {
        logger.error('Validation Error: %o', err);
        const { output } = Boom.badRequest(err);
        return responseFormat.handleError(res, output);
    }
}

export const userLogin =  async (request: Request, res: Response, next: NextFunction) => {
    const form = request.body as LoginForm;
    if (isEmpty(form)) {
        const { output } = Boom.expectationFailed(messages.ALL_REQUIRED);
        return responseFormat.handleError(res, output);
    }
    try {
        LoginForm.check(form);
        return allServices.userService.login(form).then((token: string) => {
            responseFormat.handleSuccess(res, {
                status: messages.SUCCESS,
                statusCode: httpCode.OK,
                data: {
                    message: messages.OPERATION_SUCCESS,
                    token,
                },
            });
        }).catch((err) => {
            logger.error('customerLogin: %o', err);
            const { output } = Boom.badRequest(err);
            return responseFormat.handleError(res, output);
        });
    }
    catch(err) {
        logger.error('Validation Error: %o', err);
        const { output } = Boom.badRequest(err);
        return responseFormat.handleError(res, output);
    }
}