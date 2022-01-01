import Joi from "joi";

const addSongsToPlaylist = Joi.object({
  songsIds: Joi.array().items(Joi.string()).required().min(1),
});
export default addSongsToPlaylist;
