import Boom from 'boom';
import { NextFunction, Request, Response } from 'express';
import httpCode from 'http-status-codes';
import { messages } from '../constants/messages';
import { allServices } from '../services';
import { RegisterForm } from "../services/user/UserService";
import isEmpty from '../utils/checkProperty';
import { ResponseFormat } from '../utils/responseFormat';
import logger from "../utils/winston";

const responseFormat = new ResponseFormat();


export const userRegister = async (request: Request, res: Response, next: NextFunction) => {
    const form = request.body as RegisterForm;
    if (isEmpty(form)) {
        const { output } = Boom.expectationFailed(messages.ALL_REQUIRED);
        return responseFormat.handleError(res, output);
    }
    try {
        CustomerRegisterForm.check(form);
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