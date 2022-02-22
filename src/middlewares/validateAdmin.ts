import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"

export const validateAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token = req.headers.authorization?.split(" ")[1]
    let jwtSecret = process.env.JWT_AUTH_SECRET
    if (token) {
        verify(token, jwtSecret, (err, decoded: any) => {
            if (err) {
                res.json({
                    status: false,
                    message: "Invalid token"
                })
            } else {
                if (decoded.payload.roleId === (2 || 3)) {
                    res.locals.user = decoded.payload
                    next()
                } else {
                    res.json({
                        status: false,
                        message: "You are not authorized to perform this action"
                    })
                }
            }
        })
    } else {
        res.json({
            status: false,
            message: "Please provide token"
        })
    }
}