import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default class RanksController {
  public getAllRanks = async (req: Request, res: Response): Promise<any> => {
    try {
      const currentPhase = await prisma.factors.aggregate({
        _max: {
          phase: true,
        },
      });

      const sum = await prisma.ranking.groupBy({
        by: ["userId"],
        where: {
          factors: {
            phase: currentPhase._max.phase,
          },
        },
        _sum: {
          score: true,
        },
      });

      const totalMaxscore = await prisma.factors.groupBy({
        by: ["phase"],
        where: {
          phase: currentPhase._max.phase,
        },
        _sum: {
          maxScore: true,
        },
      });

      const ranks = await prisma.ranking.findMany({
        select: {
          userId: true,
          users: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      //FORMULA : (sum(score) / sum(maxScore)) * 10
      const totalScore = sum.map((item) => {
        const total = parseFloat(
          Math.abs(
            (item._sum.score / totalMaxscore[0]._sum.maxScore) * 10
          ).toPrecision(3)
        );
        return {
          ...item,
          total,
        };
      });

      // 7.5 >="DIAMOND", 6.5 >="GOLD", 5.5 >="SILVER", 4.5 >="BRONZE", 0 >"COPPER"
      const rankDetails = totalScore.map((item) => {
        if (item.total >= 7.5) {
          return {
            ...item,
            ...ranks.find((user) => user.userId === item.userId),
            league: "DIAMOND",
          };
        } else if (item.total >= 6.5) {
          return {
            ...item,
            ...ranks.find((user) => user.userId === item.userId),
            league: "GOLD",
          };
        } else if (item.total >= 5.5) {
          return {
            ...item,
            ...ranks.find((user) => user.userId === item.userId),
            league: "SILVER",
          };
        } else if (item.total >= 4.5) {
          return {
            ...item,
            ...ranks.find((user) => user.userId === item.userId),
            league: "BRONZE",
          };
        } else {
          return {
            ...item,
            ...ranks.find((user) => user.userId === item.userId),
            league: "COPPER",
          };
        }
      });

      return res.status(200).json({
        message: "Success",
        data: rankDetails,
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
          factors: { phase },
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
