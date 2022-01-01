import Joi from "joi";
import { SongGenre, SongStatus } from "../constants/song.enums.js";

const addSongDto = Joi.object({
  name: Joi.string().required(),
  genre: Joi.string()
    .valid(...Object.values(SongGenre))
    .required(),
  length: Joi.number().required(),
  status: Joi.string()
    .valid(...Object.values(SongStatus))
    .required(),
});

export default addSongDto;
