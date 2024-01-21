import express from "express"
import { createInvoice } from "../controllers/invoice";

const router = express.Router();

// Route setup
router.post("/invoice", createInvoice);

export default router;
