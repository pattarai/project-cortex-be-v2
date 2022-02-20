//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      const { rankId, userId, factorId, score } = req.body;
      const maxScore = await prisma.factors.findMany({
        where: { factorId },
        select: {
          maxScore: true,
        },
      });
      if (score <= maxScore[0].maxScore) {
        const patchRanks = await prisma.ranking.updateMany({
          where: { rankId, userId, factorId },
          data: {
            score,
          },
        });
        return res.status(200).json({
          success: true,
          patchRanks,
        });
      } else {
        return res.status(200).json({
          success: false,
          message: "Score is greater than max score",
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  };
}
