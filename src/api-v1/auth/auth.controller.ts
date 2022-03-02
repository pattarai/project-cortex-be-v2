//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { hash, compare } from "bcryptjs"
import { sign } from "jsonwebtoken"

const prisma = new PrismaClient();

export default class AuthController {
    // public register = async (
    //     req: Request,
    //     res: Response
    // ): Promise<any> => {
    //     try {
    //         const { email, password, firstName, lastName, committee, project, startDate, roleId } = req.body;
    //         let user = await prisma.users.findFirst({
    //             where: {
    //                 email
    //             }
    //         })
    //         if (user) {
    //             return res.json({
    //                 success: false,
    //                 message: "User already exists"
    //             })
    //         } else {
    //             hash(password, 10, (err: string, hash: string) => {
    //                 if (err) {
    //                     return res.json({
    //                         success: false,
    //                         message: "Error hashing password"
    //                     })
    //                 } else {
    //                     let createdUser = prisma.users.create({
    //                         data: {
    //                             email,
    //                             password: hash,
    //                             firstName,
    //                             lastName,
    //                             committee,
    //                             project,
    //                             startDate,
    //                             roleId
    //                         }
    //                     })
    //                     return res.json({
    //                         success: true,
    //                         message: "User created",
    //                         user: createdUser
    //                     })
    //                 }
    //             })
    //         }
    //     } catch (err) {
    //         return res.status(500).json({
    //             success: false,
    //             message: err.toString(),
    //         });
    //     }
    // };

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
            res.json({
                success: true,
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
