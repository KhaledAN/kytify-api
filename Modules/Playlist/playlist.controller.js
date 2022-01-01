import PlayListServices from "./playlist.services.js";

const findAll = async (req, res) => {
  const { genre } = req.query;
  const playlists = await PlayListServices.findAll({ genre });
  res.send({ playlists });
};
const findUserPlaylists = async (req, res) => {
  const playlists = await PlayListServices.findAll({ owner: req.user._id });
  res.send({ playlists });
};
const findOne = async (req, res) => {
  const { playlistId } = req.params;
  const playlist = await PlayListServices.findOne(playlistId, req.user._id);
  res.send({ playlist });
};

const PlaylistController = { findAll, findUserPlaylists, findOne };
export default PlaylistController;
