import { Request, Response } from "express";
import prisma from "../prismaClient";

/**
 * Create a new test (ADMIN)
 */
export const createTest = async (req: Request, res: Response) => {
  const { name, rate } = req.body;
  if (!name || typeof rate !== "number") return res.status(400).json({ message: "Invalid input" });

  const test = await prisma.test.create({ data: { name, rate } });
  res.json(test);
};

/**
 * List tests (all roles)
 */
export const listTests = async (req: Request, res: Response) => {
  const tests = await prisma.test.findMany({ orderBy: { name: "asc" } });
  res.json(tests);
};

/**
 * Update test (ADMIN)
 */
export const updateTest = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, rate, isActive } = req.body;
  const updated = await prisma.test.update({
    where: { id },
    data: { name, rate, isActive }
  });
  res.json(updated);
};
