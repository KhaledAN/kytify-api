import Joi from "joi";
import { SongStatus } from "../constants/song.enums.js";

const updateSongDto = Joi.object({
  status: Joi.string().valid(...Object.values(SongStatus)),
});

export default updateSongDto;
