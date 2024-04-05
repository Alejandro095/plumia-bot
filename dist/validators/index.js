"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorMiddleware = void 0;
const express_joi_validation_1 = require("express-joi-validation");
const validator = (0, express_joi_validation_1.createValidator)({
    passError: true
});
const validatorMiddleware = (err, req, res, next) => {
    if (err && err.error && err.error.isJoi) {
        res.status(400).json({
            type: err.type,
            message: err.error.toString(),
            error: true
        });
    }
    else {
        next(err);
    }
};
exports.validatorMiddleware = validatorMiddleware;
exports.default = validator;
