import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth";
import testsRoutes from "./routes/tests";
import entriesRoutes from "./routes/entries";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => res.json({ ok: true, service: "blood-test-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/tests", testsRoutes);
app.use("/api/entries", entriesRoutes);

// last
app.use(errorHandler);

export default app;
