import { RequestHandler } from "express";
// import createHttpError from "http-errors";
import { IInvoice, INVOICESTYLES } from "../interfaces/IInvoice";
import { generatePDF } from "../services/invoiceGenerator";

// TODO: Populate with HandleBarstyle
const handleBarStyle = {
  MINIMALIST: "minimalist",
  MODERN: "modern",
  SIMPLE: "simple",
};

export const createInvoice: RequestHandler<
  unknown,
  unknown,
  IInvoice,
  unknown
> = async (req, res, next) => {
  try {
    const body = req.body;

    // Use this to get invoice style
    const chosenStyle =
      handleBarStyle[body?.invoiceStyle as keyof typeof INVOICESTYLES];

    const fileName = await generatePDF(chosenStyle, req.body, true, false);

    res
      .status(200)
      .json({ message: "Notes fetched successfully", data: { fileName } });
  } catch (error) {
    next(error);
  }
};
