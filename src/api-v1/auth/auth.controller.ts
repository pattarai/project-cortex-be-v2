//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcryptjs"
import { sign } from "jsonwebtoken"

const prisma = new PrismaClient();

export default class AuthController {

    public login = async (req: Request, res: Response): Promise<any> => {
        try {
            const { email, password } = req.body
            if (email && password) {
                const user = await prisma.users.findFirst({
                    where: {
                        email
                    }
                })
                if (user) {
                    let isMatch = await compare(password, user.password)
                    if (isMatch) {
                        let currentPhase = await prisma.events.aggregate({
                            _max: {
                                phase: true
                            }
                        })
                        let payload = { userId: user.userId, roleId: user.roleId, currentPhase: currentPhase._max.phase }
                        let token = await sign({ payload }, process.env.JWT_AUTH_SECRET, { expiresIn: "1h" })
                        res.json({
                            success: true,
                            token
                        })
                    }
                    else {
                        res.json({
                            success: false,
                            message: "Invalid password"
                        })
                    }
                } else {
                    res.json({
                        success: false,
                        message: "User not found"
                    })
                }
            } else {
                res.json({
                    success: false,
                    message: "Please provide all the required fields"
                })
            }
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString(),
            });
        }
    }

    public checkUser = async (req: Request, res: Response): Promise<any> => {
        try {
            let userId = res.locals.user.userId
            let roleId = res.locals.user.roleId
            let isCompleted = await prisma.users.findFirst({
                where: {
                    userId
                },
                select: {
                    isCompleted: true
                }
            })
            let isAdmin = await prisma.office_bearers.findFirst({
                where: {
                    roleId
                }
            })
            res.json({
                success: true,
                isCompleted: isCompleted.isCompleted,
                isAdmin: isAdmin ? true : false,
                user: res.locals.user
            })
        }
        catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString(),
            });
        }
    }

}
