import express from "express";
import { getMechanics } from "../controllers/mechanicController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/", protect, getMechanics)

export default router;
