import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";
const app = express();
app.set("trust proxy", true);
app.use(cookieParser());
app.use(express.json());
app.get("/", async (req, res) => {
  res.json({
    success: true,
    message: "Server running on port 4600",
    publicIP: req.ip,
  });
});

export const handler = serverless(app);
