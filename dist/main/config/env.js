"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
exports.env = {
    mongoUrl: process.env.MONGO_URL || "mongodb://localhost:27017/cleanNodeApi",
};
