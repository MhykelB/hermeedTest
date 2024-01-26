import { RequestHandler } from "express";
// import createHttpError from "http-errors";
import { IInvoice, INVOICESTYLES } from "../interfaces/IInvoice";
import { generatePDF } from "../services/invoiceGenerator";
import createHttpError from "http-errors";

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
    
    if (!chosenStyle) {
      throw createHttpError(400, "No valid style selected");
    }

     const pdfContent = await generatePDF(
       chosenStyle,
       req.body,
       true,
       body?.notes
     );

     // Set response headers
     res.setHeader("Content-Type", "application/pdf");
     res.setHeader("Content-Disposition", "attachment; filename=invoice.pdf");

     // Send the PDF content as response
     res.send(Buffer.from(pdfContent, "base64"));

    res
      .status(200)
      .json({ message: "Invoice created successfully" });
  } catch (error) {
    next(error);
  }
};

