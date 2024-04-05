import Joi from 'joi'
import { createValidator } from 'express-joi-validation'

const validator = createValidator({
    passError: true
});

export const validatorMiddleware = (err: any, req: any, res: any, next: any) => {
    if (err && err.error && err.error.isJoi) {
        res.status(400).json({
            type: err.type,
            message: err.error.toString(),
            error: true
        });
    } else {
        next(err);
    }
}

export default validator;