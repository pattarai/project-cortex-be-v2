//import * as bcrypt from 'bcrypt';
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      const postFactors = await prisma.factors.create({
        data: {
          factorName,
          phase,
          maxScore,
        },
      });
      return res.status(200).json({
        success: true,
        postFactors,
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
      const deleteFactors = await prisma.factors.delete({
        where: { factorId },
        select: {
          factorId: true,
          factorName: true,
          phase: true,
          maxScore: true,
        },
      });
      return res.status(200).json({
        success: true,
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
