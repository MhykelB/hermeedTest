import express, { NextFunction, Request, Response } from "express";
import invoiceRoutes from "./src/routes/invoice";
import path from "path";
import morgan from "morgan";
import "dotenv/config";
import cors from "cors";
import env from "./src/utils/validateEnv";
import createHttpError, { isHttpError } from "http-errors";
const app = express();

export const PORT = env.PORT;
export const API_URL = env.API_URL;

app.listen(PORT, () => {
  console.log("Server running on " + 5000);
});

// Middleware logger
app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "./src/public")));

// Specify what kind of filetype to use on our database
app.use(express.json());
// app.use(cors({ origin: "*" }));
app.use(cors());
app.options("*", cors());

// Router middleware
app.use("/api", invoiceRoutes);

// Create error message for when API is unavailable
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

// Middleware setup
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An unknown error occured";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage });
});

export default app;
