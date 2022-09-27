"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configServer = void 0;
const express_1 = require("express");
const content_type_1 = require("../middlewares/content-type");
const cors_1 = require("../middlewares/cors");
const configServer = (app) => {
    app.disable("x-powered-by");
    app.use(cors_1.configCors);
    app.use(content_type_1.configContentType);
    app.use((0, express_1.json)());
    app.use((0, express_1.urlencoded)({ extended: true }));
};
exports.configServer = configServer;
