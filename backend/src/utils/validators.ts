import { body } from "express-validator";

export const loginValidator = [
  body("email").isEmail(),
  body("password").isString().isLength({ min: 6 })
];

export const createTestValidator = [
  body("name").isString().notEmpty(),
  body("rate").isFloat({ gt: 0 })
];

export const createEntryValidator = [
  body("patientName").isString().notEmpty(),
  body("testIds").isArray({ min: 1 }),
  body("advance").optional().isFloat({ min: 0 }),
  body("paid").optional().isFloat({ min: 0 })
];
