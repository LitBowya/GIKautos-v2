import Message from '../models/messageModel.js';
import Channel from '../models/channelModel.js';
import User from '../models/userModel.js';
import DirectMessage from '../models/directMessageModel.js';
import asyncHandler from '../middleware/asyncHandler.js';

const createMessage = asyncHandler(async (req, res) => {
  const { channelId, content } = req.body;
  const userId = req.user._id;

  const user = await User.findById(userId);
  const userName = user.username;
  const channel = await Channel.findById(channelId);

  if (!userName) {
    return res.status(404).json({ error: 'Username not found' });
  }

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  if (!channel) {
    res.status(404);
    throw new Error('Channel not found');
  }

  const message = await Message.create({
    user: userId,
    channel: channelId,
    content,
  });

  channel.messages.push(message._id);
  await channel.save();

  res.status(201).json({
    usernmame: user.username,
    profilePicture: user.profilePicture,
    message,
  });
});

const getMessagesByChannel = asyncHandler(async (req, res) => {
  const { channelId } = req.query;
  const userId = req.user._id;

  if (!channelId) {
    res.status(400).json({ error: 'Missing channelId in request body' });
    return;
  }

  // Check if the user is a member of the specified channel
  const channel = await Channel.findOne({ _id: channelId, members: userId });
  if (!channel) {
    res.status(404);
    throw new Error('You are not a member of this channel');
  }

  // Retrieve messages for the specified channel and populate the 'user' field to get the username and profile picture
  const messages = await Message.find({ channel: channelId })
    .populate({
      path: 'user',
      select: ['username', 'profilePicture'], // Select username and profilePicture fields
    })
    .populate({
      path: 'replies',
      populate: { path: 'user', select: ['username', 'profilePicture'] }, // Populate user field in replies
    })
    .populate({
      path: 'reactions',
      populate: { path: 'user', select: ['username', 'profilePicture'] }, // Populate user field in reactions
    });

  // Format the response
  const formattedMessages = messages.map((message) => ({
    _id: message._id,
    user: {
      _id: message.user._id,
      username: message.user.username,
      profilePicture: message.user.profilePicture, // Include profilePicture field
    },
    channel: message.channel,
    content: message.content,
    read: message.unread,
    replies: message.replies.map((reply) => ({
      _id: reply._id,
      user: {
        _id: reply.user._id,
        username: reply.user.username,
        profilePicture: reply.user.profilePicture, // Include profilePicture field
      },
      content: reply.content,
      read: reply.unread,
      createdAt: reply.createdAt,
      updatedAt: reply.updatedAt,
    })),
    reactions: message.reactions.map((reaction) => ({
      user: {
        _id: reaction.user._id,
        username: reaction.user.username,
        profilePicture: reaction.user.profilePicture, // Include profilePicture field
      },
      emoji: reaction.emoji,
    })),
    createdAt: message.createdAt,
    updatedAt: message.updatedAt,
    __v: message.__v,
  }));

  res.status(200).json(formattedMessages);
});

const createDirectMessage = asyncHandler(async (req, res) => {
  const { recipientId, content } = req.body;

  const recipientFound = await User.exists({ _id: recipientId });

  if (!recipientFound) {
    return res.status(404).json({ error: 'Recipient not found' });
  }

  const directMessage = await DirectMessage.create({
    sender: req.user._id,
    recipient: recipientId,
    content,
  });

  res.status(201).json({
    message: 'Direct message created successfully',
    directMessage: directMessage,
  });
});

const getDirectMessages = asyncHandler(async (req, res) => {
  const directMessages = await DirectMessage.find({
    $or: [{ sender: req.user._id }, { recipient: req.user._id }],
  });

  res.status(200).json(directMessages);
});

const replyToMessage = asyncHandler(async (req, res) => {
  const { messageId, content } = req.body;

  // Find the message to reply to
  const message = await Message.findById(messageId);
  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }

  // Create the reply object
  const reply = {
    user: req.user._id,
    content,
    createdAt: new Date(),
  };

  // Push the reply to the message's replies array
  message.replies.push(reply);
  await message.save();

  res.status(201).json({ message: 'Reply added successfully', reply });
});

const reactToMessage = asyncHandler(async (req, res) => {
  const { messageId, emoji } = req.body;

  // Find the message to react to
  const message = await Message.findById(messageId);
  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }

  // Create the reaction object
  const reaction = {
    user: req.user._id,
    emoji,
  };

  // Push the reaction to the message's reactions array
  message.reactions.push(reaction);
  await message.save();

  res.status(201).json({ message: 'Reaction added successfully', reaction });
});

const deleteMessage = asyncHandler(async (req, res) => {
  const { messageId } = req.body;

  // Find the message to delete
  const message = await Message.findById(messageId);
  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }

  // Check if the user is the owner of the message
  if (message.user.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ error: 'You are not authorized to delete this message' });
  }

  // Alternatively, delete the message from the database
  await Message.findByIdAndDelete(messageId);

  res.status(200).json({ message: 'Message deleted successfully' });
});

const editMessage = asyncHandler(async (req, res) => {
  const { messageId, content } = req.body;

  // Find the message to edit
  const message = await Message.findById(messageId);
  if (!message) {
    return res.status(404).json({ error: 'Message not found' });
  }

  // Check if the user is the owner of the message
  if (message.user.toString() !== req.user._id.toString()) {
    return res
      .status(403)
      .json({ error: 'You are not authorized to edit this message' });
  }

  // Update the message content
  message.content = content;
  await message.save();

  res
    .status(200)
    .json({ message: 'Message edited successfully', editedMessage: message });
});

const searchMessages = asyncHandler(async (req, res) => {
  const { keyword } = req.query;

  // Search messages based on the keyword
  const messages = await Message.find({
    content: { $regex: keyword, $options: 'i' },
  });

  res.status(200).json(messages);
});

export {
  createMessage,
  getMessagesByChannel,
  createDirectMessage,
  getDirectMessages,
  replyToMessage,
  reactToMessage,
  deleteMessage,
  editMessage,
  searchMessages,
};
