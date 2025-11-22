import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth";
import { requireRole } from "../middlewares/role";
import { createTest, listTests, updateTest } from "../controllers/tests.controller";
import { createTestValidator } from "../utils/validators";
import { validationResult } from "express-validator";

const router = Router();

router.get("/", authenticateJWT, async (req, res, next) => {
  try { await listTests(req, res); } catch (e) { next(e); }
});

router.post("/", authenticateJWT, requireRole("ADMIN"), createTestValidator, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try { await createTest(req, res); } catch (e) { next(e); }
});

router.put("/:id", authenticateJWT, requireRole("ADMIN"), async (req, res, next) => {
  try { await updateTest(req, res); } catch (e) { next(e); }
});

export default router;
