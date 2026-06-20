import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { connectDB } from "./config/db";
import { Admin } from "./models/Admin";
import authRoutes from "./routes/auth";
import expenseRoutes from "./routes/expenses";
import incomeRoutes from "./routes/income";
import dashboardRoutes from "./routes/dashboard";
import savingsRoutes from "./routes/savings";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const clientOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || clientOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/auth", authRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/income", incomeRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/savings", savingsRoutes);

const seedAdmin = async (): Promise<void> => {
  const existing = await Admin.findOne();
  if (existing) return;

  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.warn("ADMIN_PASSWORD not set — admin account will not be created");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await Admin.create({ passwordHash });
  console.log("Admin account created from ADMIN_PASSWORD");
};

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    await seedAdmin();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
