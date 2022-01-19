import { NextFunction, Request, RequestHandler, Response } from 'express';
import Joi, { ValidationError } from 'joi';

function validationMiddleware(schema: Joi.Schema): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
        const validationOptions = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };

        try {
            req.body = await schema.validateAsync(req.body, validationOptions);
            next();
        } catch (e: unknown) {
            const { details } = e as ValidationError;
            const errors = details.map((error) => error.message);
            res.status(400).send({ errors: errors });
        }
    };
}

export default validationMiddleware;
