"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config();
const api_1 = require("./api");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
api_1.default.listen(process.env.API_PORT || "5000", () => {
    console.log(`The API server has successfully started. \nListening at ${process.env.APP_BASE_URL || "http://localhost:5000"}`);
});
process.on("SIGINT", function () {
    prisma.$disconnect(); // Disconnect from Prisma
    console.log("Prisma Disconnected.");
    process.exit(0);
});
//# sourceMappingURL=index.js.map