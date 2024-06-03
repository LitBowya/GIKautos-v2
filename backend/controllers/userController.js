import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import Channel from '../models/channelModel.js';
import generateToken from "../utils/generateToken.js";
import dotenv from "dotenv";

dotenv.config();

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);

    res.json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      isAdmin: user.isAdmin,
      isMechanic: user.isMechanic,
      mechanicDetails: user.isMechanic ? user.mechanicDetails : null,
      reviews: user.isMechanic ? user.reviews : null,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});


const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    username,
    email,
    password,
    profilePicture,
    isMechanic,
    mechanicDetails,
  } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const newUser = await User.create({
    name,
    username,
    email,
    password,
    isAdmin: false,
    profilePicture,
    isMechanic,
    mechanicDetails: isMechanic ? mechanicDetails : null,
    reviews: isMechanic ? [] : null,
  });

  if (newUser) {
    // Generate token for the new user
    generateToken(res, newUser._id);

    // Add the new user to the announcements channel
    const announcementsChannel = await Channel.findOne({
      name: 'announcements',
    });
    if (announcementsChannel) {
      announcementsChannel.members.push(newUser._id);
      await announcementsChannel.save();
    }

    res.status(201).json({
      _id: newUser._id,
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      profilePicture: newUser.profilePicture,
      isAdmin: newUser.isAdmin,
      isMechanic: newUser.isMechanic,
      mechanicDetails: newUser.isMechanic ? newUser.mechanicDetails : null,
      reviews: newUser.isMechanic ? newUser.reviews : null,
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});


const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Logged out successfully" });
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json({
      _id: user._id,
      username: user.username,
      name: user.name,
      email: user.email,
      profilePicture: user.profilePicture,
      isAdmin: user.isAdmin,
      isMechanic: user.isMechanic,
      mechanicDetails: user.isMechanic ? user.mechanicDetails : null,
      reviews: user.isMechanic ? user.reviews : null,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: user.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(200);
    throw new Error("User not found");
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    if (user.isAdmin) {
      res.status(400);
      throw new Error("Can not delete admin user");
    }
    await User.deleteOne({ _id: user._id });
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.isAdmin = Boolean(req.body.isAdmin);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      username: updatedUser.username,
      email: updatedUser.email,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export {
  loginUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getUserById,
  deleteUser,
  updateUser,
};
