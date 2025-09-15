import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer } from "http";
import cookieParser from "cookie-parser";
import { connectDB } from "@/config/db.config";
import serverless from "serverless-http";
const app = express();
const server = createServer(app);
app.set("trust proxy", true);
app.use(cookieParser());
app.use(express.json());
app.use("/api", (await import("@/routes/vendor.route")).default);

connectDB();

app.get("/", async (req, res) => {
  res.json({
    success: true,
    message: "Server running on port 4600",
    publicIP: req.ip,
  });
});

// server.listen(process.env.PORT, () =>
//   console.log(`Server running on port ${process.env.PORT}`)
// );

export const handler = serverless(app);
