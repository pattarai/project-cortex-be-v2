"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateAdmin = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const validateAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    let jwtSecret = process.env.JWT_AUTH_SECRET;
    if (token) {
        (0, jsonwebtoken_1.verify)(token, jwtSecret, (err, decoded) => {
            if (err) {
                res.json({
                    success: false,
                    message: "Invalid token"
                });
            }
            else {
                if (decoded.payload.roleId === 17 || decoded.payload.roleId === 3 || decoded.payload.roleId === 8 || decoded.payload.roleId === 12) {
                    res.locals.user = decoded.payload;
                    next();
                }
                else {
                    res.json({
                        success: false,
                        message: "You are not authorized to perform this action"
                    });
                }
            }
        });
    }
    else {
        res.json({
            success: false,
            message: "Please provide token"
        });
    }
});
exports.validateAdmin = validateAdmin;
//# sourceMappingURL=validateAdmin.js.map