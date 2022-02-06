//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class RanksController {
  public getAllRanks = async (req: Request, res: Response): Promise<any> => {
    try {
      const users = await prisma.users.findMany({
        select: {
          userId: true,
          firstName: true,
          lastName: true,
          bitmojiUrl: true,
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

  public getUserRanks = async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId, phase } = req.body;
      const ranks = await prisma.ranking.findMany({
        where: {
          userId,
        },
        select: {
          score: true,
        },
      });
      return res.status(200).json({
        message: "Success",
        ranks,
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
