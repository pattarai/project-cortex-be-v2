//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { hash, compare } from "bcryptjs"
import { sign, verify } from "jsonwebtoken"
import prisma from "../../helpers/prismaClient";
import { sendMagicLink } from "../../helpers/sendPassword";

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

    public forgotPassword = async (req: Request, res: Response): Promise<any> => {
        try {
            let { email } = req.body
            if (email) {
                let user = await prisma.users.findFirst({
                    where: {
                        email
                    }
                })
                if (user) {
                    let token = await sign({ userId: user.userId }, process.env.JWT_AUTH_SECRET, { expiresIn: "1m" })
                    let link = ` ${process.env.FE_URL}/forgot-password?token=${token}`
                    await sendMagicLink(user.email, link)
                    res.json({
                        success: true,
                        message: "An email has bee sent to you."
                    })
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
        } catch (err) {
            return res.status(500).json({
                success: false,
                message: err.toString(),
            });
        }
    }

    public updatePassword = async (req: Request, res: Response): Promise<any> => {
        try {
            let { password, token } = req.body
            if (password && token) {
                let user = await verify(token, process.env.JWT_AUTH_SECRET)
                try {
                    if (user) {
                        let hashedPassword = await hash(password, 10)
                        await prisma.users.update({
                            where: {
                                userId: user.userId
                            },
                            data: {
                                password: hashedPassword
                            }
                        })
                        res.json({
                            success: true,
                            message: "Password updated successfully"
                        })
                    }
                } catch {
                    res.json({
                        success: false,
                        message: "Invalid token"
                    })
                }
            } else {
                res.json({
                    success: false,
                    message: "Please provide all the required fields"
                })
            }
        } catch (err) {
            // console.log(err.toString())
            return res.status(500).json({
                success: false,
                message: err.toString(),
            });
        }
    }

}
