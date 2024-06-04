import Channel from '../models/channelModel.js';
import User from '../models/userModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

// Create a new channel
const createChannel = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  // Check if a channel with the same name already exists
  const channelExists = await Channel.findOne({ name });

  if (channelExists) {
    res.status(400);
    throw new Error(
      'Channel name already exists. Please choose a different name.'
    );
  }

  // Create the channel if it doesn't exist
  const channel = await Channel.create({
    name,
    description,
    members: [req.user._id],
  });

  res.status(201).json({
    message: 'Channel created successfully',
    channel,
  });
});

// Retrieve channels where the user is a member
const getChannels = asyncHandler(async (req, res) => {
  const channels = await Channel.find({});
  res.status(200).json(channels);
});

// Join a channel
const joinChannel = asyncHandler(async (req, res) => {
  const channelId = req.params.channelId;
  const userId = req.user._id;

  // Check if the user is already a member of the channel
  const channel = await Channel.findById(channelId);
  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  if (channel.members.includes(userId)) {
    res.status(400);
    throw new Error('You are already a member of this channel');
  }

  // Add user to the channel members
  channel.members.push(userId);
  await channel.save();

  res.status(200).json({ message: 'Successfully joined the channel', channel });
});

// Leave a channel
const leaveChannel = asyncHandler(async (req, res) => {
  const channelId = req.params.channelId;
  const userId = req.user._id;

  // Check if the user is a member of the channel
  const channel = await Channel.findById(channelId);
  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  if (!channel.members.includes(userId)) {
    res.status(400);
    throw new Error('You are not a member of this channel');
  }

  // Remove user from the channel members
  channel.members = channel.members.filter(
    (memberId) => memberId.toString() !== userId.toString()
  );
  await channel.save();

  res.status(200).json({ message: 'Successfully left the channel' });
});

// Update a channel
const updateChannel = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const channelId = req.params.channelId;

  // Check if the channel exists
  const channel = await Channel.findById(channelId);
  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  // Update channel information
  channel.name = name || channel.name;

  await channel.save();

  res.status(200).json({ message: 'Channel updated successfully', channel });
});

// Delete a channel
const deleteChannel = asyncHandler(async (req, res) => {
  const channelId = req.params.channelId;

  // Check if the channel exists
  const channel = await Channel.findById(channelId);
  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  // Delete the channel
  await Channel.findByIdAndDelete(channelId);

  res.status(200).json({ message: 'Channel deleted successfully' });
});

// List members of a channel
const listChannelMembers = asyncHandler(async (req, res) => {
  const channelId = req.params.channelId;

  // Check if the channel exists
  const channel = await Channel.findById(channelId);
  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  // Get the list of members
  const members = await User.find({ _id: { $in: channel.members } });

  res.status(200).json({ members });
});


const searchMembers = asyncHandler(async (req, res) => {
  const { channelId, keyword } = req.query;

  if (!channelId || !keyword) {
    res
      .status(400)
      .json({ error: 'Missing channelId or keyword in request query' });
    return;
  }

  // Check if the user is a member of the specified channel
  const channel = await Channel.findOne({
    _id: channelId,
    members: req.user._id,
  });
  if (!channel) {
    res.status(404).json({ error: 'You are not a member of this channel' });
    return;
  }

  // Search for members in the specified channel based on the keyword
  const members = await User.find({
    _id: { $in: channel.members },
    username: { $regex: keyword, $options: 'i' }, // Case-insensitive search
  });

  res.status(200).json(members);
});

export {
  createChannel,
  getChannels,
  joinChannel,
  leaveChannel,
  updateChannel,
  deleteChannel,
  searchMembers,
  listChannelMembers,
};
