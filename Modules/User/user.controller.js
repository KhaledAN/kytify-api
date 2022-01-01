import PlayListServices from "../Playlist/playlist.services.js";
import SongServices from "../Song/song.services.js";
import UserServices from "./user.services.js";

const login = async (req, res) => {
  try {
    const token = await UserServices.loginUser(req.body);
    res.send({ token });
  } catch (err) {
    res.status(err.errCode).send(err);
  }
};

const register = async (req, res) => {
  await UserServices.registerUser(req.body);
  res.send({ message: "Registered successfully" });
};
const getPersonalInfo = async (req, res) => {
  res.send({ user: { ...req.user, likes: await PlayListServices.findOne(req.user.likes, req.user._id) } });
};
const updateUser = async (req, res) => {
  const { phone } = req.body;
  const user = await UserServices.updateUser(req.user._id, { phone });
  res.send({ message: "Updated successfully", user });
};

const getUserPlayLists = async (req, res) => {
  const playlists = await PlayListServices.findAll({ owner: req.user._id });
  res.send({ playlists });
};

const createPlaylist = async (req, res) => {
  const { name, public: isPublic } = req.body;
  const playlist = await PlayListServices.create({ name, public: isPublic, owner: req.user._id });
  res.send({ message: "Created successfully", playlist });
};

const updatePlaylist = async (req, res) => {
  const { name, public: isPublic } = req.body;
  const { playlistId } = req.params;
  const playlist = await PlayListServices.update(playlistId, { name, public: isPublic });
  res.send({ messsage: "Updated successfully", playlist });
};
const removePlaylist = async (req, res) => {
  const { playlistId } = req.params;
  await PlayListServices.remove(playlistId);
  res.send({ message: "Removed playlist" });
};
const addSongsToPlaylist = async (req, res) => {
  try {
    const { songsIds } = req.body;
    const { playlistId } = req.params;
    await PlayListServices.addSongs(playlistId, { songsIds });
    res.send({ message: "Added succesfully" });
  } catch (err) {
    res.status(err.errCode).send(err);
  }
};

const removeSongsFromPlaylist = async (req, res) => {
  const { songsIds } = req.body;
  const { playlistId } = req.params;
  await PlayListServices.removeSongs(playlistId, { songsIds });
  res.send({ message: "Removed succesfully" });
};

// Admin

const findAll = async (req, res) => {
  const users = await UserServices.findAll(req.query);
  res.send({ users });
};
const findOne = async (req, res) => {
  const user = await UserServices.findOne(req.params.userId);
  res.send({ user });
};

const adminUpdateUser = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await UserServices.updateUser(req.params.userId, { role }, req.user);
    res.send({ message: "Updated successfully", user });
  } catch (err) {
    res.status(err.errCode).send(err);
  }
};

const getArtistSongs = async (req, res) => {
  const songs = await SongServices.findAll({ artist: req.user._id });
  res.send({ songs });
};
const UserController = {
  login,
  register,
  getPersonalInfo,
  updateUser,
  findAll,
  findOne,
  adminUpdateUser,
  createPlaylist,
  updatePlaylist,
  removePlaylist,
  addSongsToPlaylist,
  removeSongsFromPlaylist,
  getUserPlayLists,
  getArtistSongs,
};
export default UserController;
