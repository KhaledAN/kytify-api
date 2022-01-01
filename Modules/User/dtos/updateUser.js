import Joi from "joi";
import { UserRoles } from "../constants/user.enum";

const loginDto = Joi.object({
  role: Joi.string().valid(...Object.values(UserRoles)),
  phone: Joi.string(),
});
export default loginDto;
