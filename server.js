import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import chalk from "chalk";
import api from "./routes/index.js";
import jwtStrategy from "./config/jwt.js";

dotenv.config();

const PORT = 3000;
const DB = process.env.DB_URL;

const app = express();
app.use(express.json());
app.use(cors());

jwtStrategy();

app.use("/api", api);

app.listen(PORT, async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(DB);
    console.log(chalk.magenta(`MongoDB connected, port: ${PORT}`));
  } catch (error) {
    console.log(chalk.red("MongoDB connection failed: ", error));
    process.exit(1);
  }
});
