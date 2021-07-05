"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appError = void 0;
class appError extends Error {
    constructor(message, status) {
        super();
        this.message = message;
        this.status = status;
    }
}
exports.appError = appError;
