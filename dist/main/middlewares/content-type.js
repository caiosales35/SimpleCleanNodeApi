"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configContentType = void 0;
const configContentType = (req, res, next) => {
    res.header("content-type", "application/json");
    next();
};
exports.configContentType = configContentType;
