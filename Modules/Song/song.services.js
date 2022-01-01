import ResponseCodes from "../../constants/ResponseCodes.js";
import { UserRoles } from "../User/constants/user.enum.js";
import { SongStatus } from "./constants/song.enums.js";
import Song from "./schema/song.schema.js";

const add = async songData => {
  const songEntity = new Song(songData);
  await songEntity.save();
  return songEntity;
};

const findAll = async ({ genre, artist, page = 0, limit = 100, sortByDate, sortAlpa }) => {
  const queryConditions = [{ filePath: { $exists: true } }];
  const sortingParameters = {};
  queryConditions.push({ status: SongStatus.ACTIVE });
  if (genre) {
    queryConditions.push({ genre });
  }
  if (artist) {
    queryConditions.push({ artist });
  }
  if (sortByDate) {
    sortingParameters.createdAt = sortByDate;
  }
  if (sortAlpa) {
    sortingParameters.name = sortAlpa;
  }
  const songs = await Song.find(queryConditions.length > 0 ? { $and: queryConditions } : {})
    .skip(page * limit)
    .limit(limit)
    .sort(sortingParameters)
    .lean();

  return songs;
};
const findOne = async songId => {
  const song = await Song.findOne({ _id: songId, status: SongStatus.ACTIVE });
  return song;
};

const updateStatus = async (songId, { status, filePath }, operator) => {
  const songEntity = await Song.findById(songId);
  if (!songEntity) {
    throw { errCode: ResponseCodes.NOT_FOUND, error: "Song not found" };
  }

  if (songEntity.artist.toString() != operator._id.toString() && operator.role != UserRoles.ADMIN) {
    throw { errCode: ResponseCodes.UNAUTHORIZED, error: "Not Song artist" };
  }
  if (status) songEntity.status = status;
  if (filePath) songEntity.filePath = filePath;
  await songEntity.save();
  return songEntity;
};
const SongServices = { add, findAll, findOne, update: updateStatus };

export default SongServices;
