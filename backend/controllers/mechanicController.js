import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

const getMechanics = asyncHandler(async (req, res) => {
    const mechanics = await User.find({ isMechanic: true }).select(
      "name username email profilePicture isMechanic mechanicDetails reviews"
    );


    if (mechanics) {
        res.status(200).json(mechanics)
    } else {
        res.status(404);
        throw new Error('Mechanic not found')
    }
})

export { getMechanics };