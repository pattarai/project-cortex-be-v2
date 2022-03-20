import { Request, Response, NextFunction } from "express"
import { verify } from "jsonwebtoken"

export const validateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let token = req.headers.authorization?.split(" ")[1]
    let jwtSecret = process.env.JWT_AUTH_SECRET
    if (token) {
        verify(token, jwtSecret, (err, decoded: any) => {
            if (err) {
                res.json({
                    success: false,
                    message: "Invalid token"
                })
            } else {
                res.locals.user = decoded.payload
                next()
            }
        })
    } else {
        res.json({
            success: false,
            message: "Please provide token"
        })
    }
}