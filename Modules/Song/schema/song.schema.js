import mongoose from "mongoose";
import { SongGenre, SongStatus } from "../constants/song.enums.js";

const songSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    artist: { type: mongoose.Types.ObjectId, ref: "User" },
    genre: { type: String, enum: Object.values(SongGenre) },
    downlaodsNumber: { type: Number, default: 0 },
    length: { type: Number, required: true },
    status: { type: String, enum: Object.values(SongStatus) },
    filePath: { type: String },
  },
  { timestamps: true }
);

const Song = mongoose.model("Song", songSchema);

export default Song;
