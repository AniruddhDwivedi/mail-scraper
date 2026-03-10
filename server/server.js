import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import emailRoutes from "./routes/email.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/api", emailRoutes);

export default app;