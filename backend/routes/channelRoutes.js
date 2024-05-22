import express from "express";
import {
  createChannel,
  getChannels,
  joinChannel,
  leaveChannel,
  updateChannel,
  deleteChannel,
  archiveChannel,
  inviteToChannel,
  listChannelMembers,
  setChannelNotificationPreferences,
} from "../controllers/channelController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/createchannel", protect, createChannel);
router.get("/getchannels", protect, getChannels);
router.post("/:channelId/join", protect, joinChannel);
router.post("/:channelId/leave", protect, leaveChannel);
router.put("/:channelId", protect, updateChannel);
router.delete("/:channelId", protect, deleteChannel);
router.post("/:channelId/archive", protect, archiveChannel);
router.post("/:channelId/invite", protect, inviteToChannel);
router.get("/members", protect, listChannelMembers);
router.put(
  "/:channelId/notifications",
  protect,
  setChannelNotificationPreferences
);

export default router;
