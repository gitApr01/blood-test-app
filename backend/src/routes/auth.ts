import { Router } from "express";
import { login } from "../controllers/auth.controller";
import { loginValidator } from "../utils/validators";
import { validationResult } from "express-validator";

const router = Router();

router.post("/login", loginValidator, async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try { await login(req, res); } catch (e) { next(e); }
});

export default router;
