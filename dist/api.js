"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cors = require("cors");
const nocache = require("nocache");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const index_1 = require("./api-v1/index");
const errorHandler = require("./helpers/errorHandler");
const home_1 = require("./home");
class App {
    constructor() {
        this.express = express();
        this.setMiddlewares();
        this.setRoutes();
        this.catchErrors();
    }
    setMiddlewares() {
        this.express.use(cors());
        this.express.use(morgan("dev"));
        this.express.use(nocache());
        this.express.use(express.json());
        this.express.use(express.urlencoded({ extended: true }));
        this.express.use(helmet());
        this.express.use(express.static("public"));
    }
    setRoutes() {
        this.express.use("/", home_1.default);
        this.express.use("/api", index_1.default);
    }
    catchErrors() {
        this.express.use(errorHandler.notFound);
        this.express.use(errorHandler.internalServerError);
    }
}
exports.default = new App().express;
//# sourceMappingURL=api.js.map