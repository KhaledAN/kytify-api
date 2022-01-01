import { JWT_SECRET } from "../Modules/User/user.services.js";
import jwt from "jsonwebtoken";
import User from "../Modules/User/schema/user.schema.js";
import ResponseCodes from "../constants/ResponseCodes.js";
const IsLoggedInMiddleware =
  (roles = []) =>
  async (req, res, next) => {
    let token = req.headers["authorization"];
    try {
      if (!req.user) {
        if (!token) throw new Error("Missing token");
        token = token.replace("Bearer ", "");
        const { _id: userId } = await new Promise((res, rej) =>
          jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) rej(err);
            res(decoded);
          })
        );
        const userEntity = await User.findById(userId).lean();
        if (!userEntity) {
          throw new Error("User not found");
        }
        req.user = userEntity;
      }

      if (roles.length > 0 && !roles.includes(req.user.role)) {
        console.log(roles);
        throw new Error("Not privileged");
      }
      next();
    } catch (err) {
      console.log(err);
      return res.status(ResponseCodes.UNAUTHORIZED).send({ error: "Not Auhtorized" });
    }
  };

export default IsLoggedInMiddleware;
