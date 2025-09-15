// src/app.ts
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";
import cors from "cors";
var app = express();
app.set("trust proxy", true);
app.use(cookieParser());
app.use(express.json());
app.use(cors());
app.get("/", async (req, res) => {
  res.json({
    success: true,
    message: "Server running on port 4600",
    publicIP: req.ip
  });
});
var handler = serverless(app);
export {
  handler
};
//# sourceMappingURL=app.js.map
