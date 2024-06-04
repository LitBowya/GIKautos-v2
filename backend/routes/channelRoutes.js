import express from "express";
import {
  createChannel,
  getChannels,
  joinChannel,
  leaveChannel,
  updateChannel,
  deleteChannel,
  listChannelMembers,
  searchMembers
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
router.get('/members/search', protect, searchMembers);

export default router;
