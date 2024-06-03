import express from "express";
import {
  createMessage,
  getMessagesByChannel,
  editMessage,
  deleteMessage,
  searchMessages,
  reactToMessage,
  replyToMessage,
} from "../controllers/messageController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createmessage", protect, createMessage);
router.get("/getmessages", protect, getMessagesByChannel);
router.put("/editmessage/:messageId", protect, editMessage);
router.delete("/deletemessage/:messageId", protect, deleteMessage);
router.get("/search", protect, searchMessages);
router.post("/:messageId/react", protect, reactToMessage);
router.post("/:messageId/reply", protect, replyToMessage);

export default router;
