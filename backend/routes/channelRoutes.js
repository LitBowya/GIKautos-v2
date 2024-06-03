import express from "express";
import {
  createChannel,
  getChannels,
  joinChannel,
  leaveChannel,
  updateChannel,
  deleteChannel,
  listChannelMembers,
} from "../controllers/channelController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createchannel", protect, createChannel);
router.get("/getchannels", protect, getChannels);
router.post("/:channelId/join", protect, joinChannel);
router.post("/:channelId/leave", protect, leaveChannel);
router.put("/:channelId", protect, updateChannel);
router.delete("/:channelId", protect, deleteChannel);
router.get("/:channelId/members", protect, listChannelMembers);

export default router;
