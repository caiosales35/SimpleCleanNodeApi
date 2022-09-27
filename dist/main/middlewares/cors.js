"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configCors = void 0;
const configCors = (req, res, next) => {
    res.header("access-control-allow-origin", "*");
    res.header("access-control-allow-methods", "*");
    res.header("access-control-allow-headers", "*");
    next();
};
exports.configCors = configCors;
