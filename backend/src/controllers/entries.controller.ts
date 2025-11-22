import { Request, Response } from "express";
import prisma from "../prismaClient";
import { AuthRequest } from "../middlewares/auth";

/**
 * Helper: calculate total from test ids (must be active)
 */
async function calculateTotalFromTests(testIds: string[]) {
  const tests = await prisma.test.findMany({ where: { id: { in: testIds }, isActive: true } });
  if (tests.length !== testIds.length) {
    throw { status: 400, message: "One or more tests are invalid or inactive" };
  }
  const total = tests.reduce((s, t) => s + t.rate, 0);
  return { total, tests };
}

/**
 * Create entry (USER or ADMIN)
 */
export const createEntry = async (req: AuthRequest, res: Response) => {
  const { patientName, age, sex, testIds, advance = 0, paid = 0, testBy } = req.body;
  if (!patientName || !Array.isArray(testIds) || testIds.length === 0) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const { total, tests } = await calculateTotalFromTests(testIds);
  const due = Number((total - Number(advance || 0)).toFixed(2));
  const commissionDueDefault = Number((total * 0.4).toFixed(2));

  const entry = await prisma.entry.create({
    data: {
      patientName,
      age: age ?? null,
      sex: sex ?? null,
      total,
      advance: Number(advance),
      paid: Number(paid),
      due,
      commissionDue: commissionDueDefault,
      collectedById: req.user!.id,
      testBy: testBy ?? null,
      entryTests: { create: tests.map(t => ({ testId: t.id, rate: t.rate })) }
    },
    include: { entryTests: true }
  });

  res.json(entry);
};

/**
 * List entries with optional filters (admin can see all, user only own)
 * Query params:
 *  - userId (admin only)
 *  - status
 *  - paidStatus: 'PAID'|'DUE'|'PARTIAL'
 *  - dateFrom, dateTo (ISO)
 *  - page, pageSize
 */
export const listEntries = async (req: AuthRequest, res: Response) => {
  const { status, paidStatus, dateFrom, dateTo, page = "1", pageSize = "20", userId } = req.query;
  const pageNum = Math.max(1, Number(page));
  const take = Math.min(100, Number(pageSize) || 20);
  const skip = (pageNum - 1) * take;

  const where: any = {};
  if (status) where.status = status;
  if (dateFrom || dateTo) where.createdAt = {};
  if (dateFrom) where.createdAt.gte = new Date(String(dateFrom));
  if (dateTo) where.createdAt.lte = new Date(String(dateTo));

  if (paidStatus === "PAID") where.due = 0;
  if (paidStatus === "DUE") where.due = { gt: 0 };
  if (paidStatus === "PARTIAL") where.paid = { gt: 0, lt: prisma.entry.fields ? 0 : undefined }; // placeholder (we'll handle below)

  // admin filter by userId
  if (userId && req.user!.role === "ADMIN") {
    where.collectedById = String(userId);
  }

  // non-admin: limit to own entries
  if (req.user!.role !== "ADMIN") where.collectedById = req.user!.id;

  // Because express + prisma types, we construct query differently for partial
  const entries = await prisma.entry.findMany({
    where,
    include: { entryTests: true, collectedBy: true },
    orderBy: { createdAt: "desc" },
    skip,
    take
  });

  // handle paidStatus PARTIAL manually (paid>0 && due>0)
  let final = entries;
  if (paidStatus === "PARTIAL") {
    final = entries.filter(e => e.paid > 0 && e.due > 0);
  }

  res.json({ data: final, page: pageNum });
};

/**
 * Update own entry (users) or any entry (admin).
 * Users cannot change commissionPaid or commissionDue
 */
export const updateEntry = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { patientName, age, sex, testIds, advance, paid, testBy } = req.body;

  const entry = await prisma.entry.findUnique({ where: { id }, include: { entryTests: true } });
  if (!entry) return res.status(404).json({ message: "Entry not found" });

  if (req.user!.role !== "ADMIN" && entry.collectedById !== req.user!.id) {
    return res.status(403).json({ message: "You can only edit your own entries" });
  }

  // If tests changed, recalc totals
  let total = entry.total;
  let newEntryTests = undefined;
  if (Array.isArray(testIds) && testIds.length > 0) {
    const { total: calcTotal, tests } = await calculateTotalFromTests(testIds);
    total = calcTotal;
    newEntryTests = {
      // delete old and create new
      deleteMany: {},
      create: tests.map(t => ({ testId: t.id, rate: t.rate }))
    };
  }

  const newAdvance = advance !== undefined ? Number(advance) : entry.advance;
  const newPaid = paid !== undefined ? Number(paid) : entry.paid;
  const newDue = Number((total - newAdvance).toFixed(2));

  const updated = await prisma.entry.update({
    where: { id },
    data: {
      patientName: patientName ?? entry.patientName,
      age: age ?? entry.age,
      sex: sex ?? entry.sex,
      total,
      advance: newAdvance,
      paid: newPaid,
      due: newDue,
      testBy: testBy ?? entry.testBy,
      entryTests: newEntryTests
    },
    include: { entryTests: true }
  });

  res.json(updated);
};

/**
 * Update delivery status (user for own entries, admin for any)
 */
export const updateDeliveryStatus = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!["DELIVERED", "NOT_DELIVERED", "PARTIAL"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const entry = await prisma.entry.findUnique({ where: { id } });
  if (!entry) return res.status(404).json({ message: "Entry not found" });

  if (req.user!.role !== "ADMIN" && entry.collectedById !== req.user!.id) {
    return res.status(403).json({ message: "You can only update your own entries" });
  }

  const updated = await prisma.entry.update({ where: { id }, data: { status } });
  res.json(updated);
};

/**
 * Admin override commissionDue (logs change)
 */
export const adminOverrideCommission = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { commissionDue, reason } = req.body;
  if (typeof commissionDue !== "number") return res.status(400).json({ message: "commissionDue must be a number" });

  const entry = await prisma.entry.findUnique({ where: { id } });
  if (!entry) return res.status(404).json({ message: "Entry not found" });

  const oldValue = entry.commissionDue;
  const updated = await prisma.entry.update({ where: { id }, data: { commissionDue } });

  await prisma.commissionLog.create({
    data: { entryId: id, changedBy: req.user!.id, oldValue, newValue: commissionDue, reason: reason ?? "Admin override" }
  });

  res.json(updated);
};

/**
 * Admin update commissionPaid (admin-only) — logs change
 */
export const adminUpdateCommissionPaid = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { commissionPaid } = req.body;
  if (typeof commissionPaid !== "number") return res.status(400).json({ message: "commissionPaid must be a number" });

  const entry = await prisma.entry.findUnique({ where: { id } });
  if (!entry) return res.status(404).json({ message: "Entry not found" });

  const updated = await prisma.entry.update({ where: { id }, data: { commissionPaid } });
  await prisma.commissionLog.create({
    data: { entryId: id, changedBy: req.user!.id, oldValue: entry.commissionPaid, newValue: commissionPaid, reason: "Admin commission paid update" }
  });

  res.json(updated);
};
