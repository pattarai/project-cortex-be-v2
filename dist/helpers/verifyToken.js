"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwks = require("jwks-rsa");
const jwt = require("express-jwt");
var jwtAuthCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `${process.env.AUTH0_ISSUER_BASE_URL}.well-known/jwks.json`,
    }),
    audience: process.env.APP_BASE_URL,
    issuer: process.env.AUTH0_ISSUER_BASE_URL,
    algorithms: ["RS256"],
});
exports.default = jwtAuthCheck;
//# sourceMappingURL=verifyToken.js.map