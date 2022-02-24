import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export default class RankController {
  public getAllRanks = async (req: Request, res: Response): Promise<any> => {
    try {
      // get current phase
      const currentPhase = await prisma.factors.aggregate({
        _max: {
          phase: true,
        },
      });

      // total score calculation for each user
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

      // current phase total threshold score calculation
      const totalMaxscore = await prisma.factors.groupBy({
        by: ["phase"],
        where: {
          phase: currentPhase._max.phase,
        },
        _sum: {
          maxScore: true,
        },
      });

      // get user details
      const userDetails = await prisma.ranking.findMany({
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

      // FORMULA : (sum(score) / sum(maxScore)) * 10
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

      // sort by total score in descending order
      totalScore.sort((a, b) => b.total - a.total);

      // 7.5 >="DIAMOND", 6.5 >="GOLD", 5.5 >="SILVER", 4.5 >="BRONZE", 0 >"COPPER"
      const rankDetails = totalScore.map((item) => {
        if (item.total >= 7.5) {
          return {
            ...item,
            ...userDetails.find((user) => user.userId === item.userId),
            league: "DIAMOND",
          };
        } else if (item.total >= 6.5) {
          return {
            ...item,
            ...userDetails.find((user) => user.userId === item.userId),
            league: "GOLD",
          };
        } else if (item.total >= 5.5) {
          return {
            ...item,
            ...userDetails.find((user) => user.userId === item.userId),
            league: "SILVER",
          };
        } else if (item.total >= 4.5) {
          return {
            ...item,
            ...userDetails.find((user) => user.userId === item.userId),
            league: "BRONZE",
          };
        } else {
          return {
            ...item,
            ...userDetails.find((user) => user.userId === item.userId),
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
      const { userId } = req.body;

      // get all distinct phases
      const phase = await prisma.factors.findMany({
        distinct: ["phase"],
        select: {
          phase: true,
        },
      });

      // get totalsum of scores for each phase
      const totalSum = await Promise.all(
        phase.map(async (item) => {
          const total = await prisma.ranking.aggregate({
            where: {
              userId,
              factors: {
                phase: item.phase,
              },
            },
            _sum: {
              score: true,
            },
          });
          return total;
        })
      );

      //threshold score calculation for each phase
      const maxScore = await Promise.all(
        phase.map(async (item) => {
          const total = await prisma.factors.aggregate({
            where: {
              phase: item.phase,
            },
            _sum: { maxScore: true },
          });
          return total;
        })
      );

      // FORMULA : (sum(score) / sum(maxScore)) * 10
      const totalScoreByPhase = totalSum.map((item: any, index: number) => {
        let total = 0;
        maxScore.forEach((max: any, keyy: number) => {
          if (index === keyy) {
            total = parseFloat(
              Math.abs((item._sum.score / max._sum.maxScore) * 10).toPrecision(
                3
              )
            );
          }
        });
        return total;
      });

      const userDetails = await prisma.ranking.findMany({
        where: {
          userId,
        },
        select: {
          score: true,
          factors: {
            select: {
              phase: true,
              factorName: true,
              maxScore: true,
            },
          },
        },
      });

      userDetails.sort((a, b) => b.factors.phase - a.factors.phase);

      return res.status(200).json({
        message: "Success",
        data: { userDetails, totalScoreByPhase },
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
