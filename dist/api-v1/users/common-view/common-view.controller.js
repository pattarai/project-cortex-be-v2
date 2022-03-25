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
const prismaClient_1 = require("../../../helpers/prismaClient");
class CommonViewController {
    constructor() {
        this.getUsers = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield prismaClient_1.default.users.findMany({
                    select: {
                        userId: true,
                        firstName: true,
                        lastName: true,
                        description: true,
                        project: true,
                        committee: true,
                    },
                });
                return res.status(200).json({
                    message: "Success",
                    users,
                });
            }
            catch (e) {
                console.error(e);
                res.status(500).send({
                    success: false,
                    message: e.toString(),
                });
            }
        });
    }
}
exports.default = CommonViewController;
//# sourceMappingURL=common-view.controller.js.map