import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    songs: [{ type: mongoose.Types.ObjectId, ref: "Song" }],
    public: { type: Boolean, default: true, required: true },
    owner: { type: mongoose.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Playlist = mongoose.model("Playlist", playlistSchema);

export default Playlist;
