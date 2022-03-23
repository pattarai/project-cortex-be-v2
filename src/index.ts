import * as dotenv from "dotenv";
dotenv.config();

import * as https from "https";
import * as fs from "fs";
import * as path from "path"

import server from "./api";

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const httpServer = https.createServer({
  key: fs.readFileSync(path.join(__dirname, "..", "selfsigned.key")),
  cert: fs.readFileSync(path.join(__dirname, "..", "selfsigned.crt"))
}, server);

httpServer.listen(process.env.API_PORT || "5000", () => {
  console.log(
    `The API server has successfully started. \nListening at ${process.env.APP_BASE_URL || "http://localhost:5000"
    }`
  );
});

process.on("SIGINT", function () {
  prisma.$disconnect(); // Disconnect from Prisma
  console.log("Prisma Disconnected.");
  process.exit(0);
});
