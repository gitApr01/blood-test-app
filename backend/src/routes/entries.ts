import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth";
import { requireRole } from "../middlewares/role";
import {
  createEntry,
  listEntries,
  updateEntry,
  updateDeliveryStatus,
  adminOverrideCommission,
  adminUpdateCommissionPaid
} from "../controllers/entries.controller";
import { createEntryValidator } from "../utils/validators";
import { validationResult } from "express-validator";

const router = Router();

router.post("/", authenticateJWT, createEntryValidator, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try { await createEntry(req, res); } catch (e) { next(e); }
});

router.get("/", authenticateJWT, async (req, res, next) => {
  try { await listEntries(req, res); } catch (e) { next(e); }
});

// update entry (user for own, admin any)
router.put("/:id", authenticateJWT, async (req, res, next) => {
  try { await updateEntry(req, res); } catch (e) { next(e); }
});

// update status
router.put("/:id/status", authenticateJWT, async (req, res, next) => {
  try { await updateDeliveryStatus(req, res); } catch (e) { next(e); }
});

// admin override commission due
router.put("/:id/commission", authenticateJWT, requireRole("ADMIN"), async (req, res, next) => {
  try { await adminOverrideCommission(req, res); } catch (e) { next(e); }
});

// admin update commissionPaid
router.put("/:id/commission-paid", authenticateJWT, requireRole("ADMIN"), async (req, res, next) => {
  try { await adminUpdateCommissionPaid(req, res); } catch (e) { next(e); }
});

export default router;
