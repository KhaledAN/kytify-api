import Joi from "joi";

const loginDto = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});
export default loginDto;
