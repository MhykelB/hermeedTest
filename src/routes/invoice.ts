import express from "express";
import { createInvoice } from "../controllers/invoice";

const router = express.Router();

// Route setup
router.post("/invoice", createInvoice);
router.get("/", (req, res) => {
  // console.log("got here");
  res.send("hit");
});

export default router;
