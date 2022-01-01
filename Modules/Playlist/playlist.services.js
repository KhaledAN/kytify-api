import ResponseCodes from "../../constants/ResponseCodes.js";
import Song from "../Song/schema/song.schema.js";
import Playlist from "./schema/playlist.schema.js";

const findAll = async ({ owner, genre }) => {
  const queryConditions = [];
  if (owner) {
    queryConditions.push({ owner });
  } else {
    queryConditions.push({ public: true });
  }
  if (genre) {
    queryConditions.push({ genre });
  }
  const playlists = await Playlist.find({ $and: queryConditions });
  return playlists;
};
const findOne = async (playlistId, userId) => {
  const playlist = await Playlist.findOne({ $and: [{ _id: playlistId }, { $or: [{ public: true }, { owner: userId }] }] })
    .populate([{ path: "songs", populate: { path: "artist", select: "firstName lastName" } }])
    .lean();
  return playlist;
};

const create = async ({ name, public: isPublic, owner }) => {
  const playlist = new Playlist({ name, public: isPublic, owner });
  await playlist.save();
  return playlist;
};
const update = async (playlistId, data) => {
  const { name, public: isPublic } = data;
  const playlist = await Playlist.findById(playlistId);
  if (name) playlist.name = name;
  if (isPublic != null) playlist.public = isPublic;
  await playlist.save();
  return playlist;
};
const remove = async playlistId => {
  await Playlist.deleteOne({ _id: playlistId });
};
const addSongs = async (playlistId, { songsIds }) => {
  const playlist = await Playlist.findById(playlistId);
  const songsMatchesCount = await Song.countDocuments({ _id: { $in: songsIds } });
  if (songsMatchesCount != songsIds.length) throw { errCode: ResponseCodes.BAD_REQUEST, error: "Some songs doesn't exist" };
  const matchingSongs = playlist.songs.filter(
    existingSongId => !songsIds.some(songIdToRemove => songIdToRemove.toString() == existingSongId.toString())
  );
  if (matchingSongs.length > 0) throw { errCode: ResponseCodes.BAD_REQUEST, error: "Some songs already in playlist" };
  playlist.songs.push(...songsIds);
  await playlist.save();
};

const removeSongs = async (playlistId, { songsIds }) => {
  const playlist = await Playlist.findById(playlistId);
  playlist.songs = playlist.songs.filter(existingSongId => !songsIds.some(songIdToRemove => songIdToRemove.toString() == existingSongId.toString()));
  await playlist.save();
};

const PlayListServices = { create, update, remove, addSongs, removeSongs: removeSongs, findAll, findOne };

export default PlayListServices;
