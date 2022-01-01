import Joi from "joi";

const createPLaylistDto = Joi.object({
  name: Joi.string().required(),
  public: Joi.boolean().required(),
});
export default createPLaylistDto;
