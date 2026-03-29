import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: path.resolve(__dirname, "../.env")
});

import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import emailRoutes from "./routes/email.routes.js";

/* =====================
   APP SETUP
===================== */

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

/* =====================
   ROUTES
===================== */

app.use("/auth", authRoutes);
app.use("/api", emailRoutes);

/* =====================
   START SERVER
===================== */

app.listen(3000, () => {
  console.log("✅ Server running on http://localhost:3000");
});