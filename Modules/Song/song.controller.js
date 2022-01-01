import ResponseCodes from "../../constants/ResponseCodes.js";
import Song from "./schema/song.schema.js";
import SongServices from "./song.services.js";
import fs from "fs";
const findAll = async (req, res) => {
  const songs = await SongServices.findAll(req.query);
  res.send({ songs });
};

const findOne = async (req, res) => {
  const song = await SongServices.findOne(req.query);
  res.send({ song });
};

const addSong = async (req, res) => {
  const song = await SongServices.add({ ...req.body, artist: req.user._id });
  res.send({ message: "Added successfully", song });
};

const updateSong = async (req, res) => {
  try {
    const { status } = req.body;
    const { songId } = req.params;
    const song = await SongServices.update(songId, status, req.user);
    res.send({ message: "Updated successfully", song });
  } catch (err) {
    res.status(err.errCode).send(err);
  }
};
const updateSongFile = async (req, res) => {
  const { songId } = req.params;
  const song = await SongServices.update(songId, { filePath: req.file.path }, req.user);
  res.send({ message: "uplaoded", song });
};
const getSong = async (req, res) => {
  const songEntity = await Song.findById(req.params.songId);
  if (fs.existsSync(songEntity.filePath)) {
    res.download(songEntity.filePath, `${songEntity.name}.${songEntity.filePath.split(".")[1]}`);
  } else {
    res.status(ResponseCodes.NOT_FOUND).send({ error: "Not found" });
  }
};
const SongController = { findAll, findOne, addSong, updateSong, updateSongFile, getSong };

export default SongController;
