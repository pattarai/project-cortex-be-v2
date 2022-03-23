//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import prisma from "../../../helpers/prismaClient";


export default class CommonViewController {
  public getUsers = async (req: Request, res: Response): Promise<any> => {
    try {
      const users = await prisma.users.findMany({
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
    } catch (e) {
      console.error(e);
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  };
}
