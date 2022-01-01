import mongoose from "mongoose";
import { UserRoles } from "../constants/user.enum.js";

const UserSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true, minlength: 10 },
    preOrderedSongs: [{ type: mongoose.Types.ObjectId, ref: "Song" }],
    likes: { type: mongoose.Types.ObjectId, ref: "Playlist" },
    followedPlaylists: [{ type: mongoose.Types.ObjectId, ref: "Playlist" }],
    role: { type: String, enum: Object.values(UserRoles), default: UserRoles.USER },
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);

export default User;
