import express, { NextFunction, Request, Response } from "express";
import invoiceRoutes from "./src/routes/invoice";
import morgan from "morgan";
import cors from "cors";
import createHttpError, { isHttpError } from "http-errors";
const app = express();

// Middleware logger
app.use(morgan("dev"));

// Specify what kind of filetype to use on our database
app.use(express.json());
app.use(cors({ origin: "*" }));

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
