//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import prisma from "../../../helpers/prismaClient";

export default class RanksController {
  public getRanks = async (req: Request, res: Response): Promise<any> => {
    try {
      const ranks = await prisma.ranking.findMany({
        select: {
          factors: true,
          userId: true,
          score: true,
          users: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
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

  public patchRanks = async (req: Request, res: Response): Promise<any> => {
    try {
      const { crewScore } = req.body;

      let crewScoreList: any = [];

      type User = {
        userId: number;
        factorId: number;
        score: number;
      };

      await prisma.$transaction(
        (crewScoreList = crewScore.map((user: User) =>
          prisma.ranking.updateMany({
            where: { factorId: user.factorId, userId: user.userId },
            data: { score: user.score },
          })
        ))
      );

      return res.status(200).json({
        success: true,
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
