import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const mechanicDetailsSchema = new mongoose.Schema({
  specialty: { type: String, required: true },
  experience: { type: Number, required: true },
  shopAddress: { type: String, required: true },
  shopName: { type: String, required: true },
  workingHours: { type: String, required: true },
  mechanicProfilePicture: { type: String, default: "", required: true },
});

const reviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          required: true,
        },
      },
    ],
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    profilePicture: {
      type: String,
      default: "",
      required: true,
    },
    isMechanic: { type: Boolean, default: false },
    mechanicDetails: { type: mechanicDetailsSchema, default: null },
    reviews: { type: [reviewSchema], default: [] },
    notificationPreferences: {
      mobilePush: {
        type: Boolean,
        default: true,
      }
    },
    bio: {
      type: String,
      default: "",
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
