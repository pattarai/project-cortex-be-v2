//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import prisma from "../../../helpers/prismaClient";

export default class FactorsController {
  public getFactors = async (req: Request, res: Response): Promise<any> => {
    try {
      const getFactors = await prisma.factors.findMany({
        select: {
          factorId: true,
          factorName: true,
          maxScore: true,
          phase: true,
        },
      });
      return res.status(200).json({
        message: "Success",
        getFactors,
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  };

  public postFactors = async (req: Request, res: Response): Promise<any> => {
    try {
      const { factorName, maxScore, phase } = req.body;

      let userIdList: any = [];

      type User = {
        userId: number;
        factorId: number;
        score: number;
      };

      const postFactors = await prisma.factors.create({
        data: {
          factorName,
          phase,
          maxScore,
        },
      });
      console.log(postFactors);
      const getUsers = await prisma.users.findMany({
        select: {
          userId: true,
        },
      });
      const postRanks = await prisma.$transaction(
        (userIdList = getUsers.map((user: User) =>
          prisma.ranking.create({
            data: {
              factorId: postFactors.factorId,
              score: 0,
              userId: user.userId,
            },
          })
        ))
      );

      return res.status(200).json({
        success: true,
        postFactors,
        postRanks,
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  };

  public patchFactors = async (req: Request, res: Response): Promise<any> => {
    try {
      const { factorId, factorName, phase, maxScore } = req.body;
      const patchFactors = await prisma.factors.update({
        where: { factorId: Number(factorId) },
        data: {
          factorId,
          factorName,
          phase,
          maxScore,
        },
      });
      return res.json({
        success: true,
        data: patchFactors,
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({
        success: false,
        message: e.toString(),
      });
    }
  };

  public deleteFactors = async (req: Request, res: Response): Promise<any> => {
    try {
      const { factorId } = req.body;
      const deleteRanks = await prisma.ranking.deleteMany({
        where: { factorId },
      });
      const deleteFactors = await prisma.factors.delete({
        where: { factorId },
      });
      return res.status(200).json({
        success: true,
        deleteRanks,
        deleteFactors,
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
