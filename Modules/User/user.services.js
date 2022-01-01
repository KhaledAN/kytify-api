import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ResponseCodes from "../../constants/ResponseCodes.js";
import PlayListServices from "../Playlist/playlist.services.js";
import User from "./schema/user.schema.js";

const SALT = 10;
export const JWT_SECRET = "Secure";
const loginUser = async ({ email, password }) => {
  try {
    const userEntity = await User.findOne({ email: email.toLowerCase() }).lean();
    if (!userEntity) throw new Error("User not found");
    const passwordValid = await bcrypt.compare(password, userEntity.password);
    if (!passwordValid) throw new Error("Password invalid");
    return jwt.sign({ _id: userEntity._id }, JWT_SECRET);
  } catch (err) {
    console.error(err);
    throw {
      errCode: ResponseCodes.UNAUTHORIZED,
      error: "Invalid credintianls",
    };
  }
};

const registerUser = async ({ firstName, lastName, email, password, phone }) => {
  const userEntity = new User({ email, password: await bcrypt.hash(password, SALT), phone, firstName, lastName, playlists: [] });
  await PlayListServices.create({ name: "Likes", owner: userEntity._id, public: true });
  await userEntity.save();
};

const updateUser = async (userId, updatedData) => {
  const userEntity = await User.findById(userId);
  if (!userEntity) {
    throw { errCode: 404, error: "User not found" };
  }
  for (let key in updatedData) {
    switch (key) {
      case "password":
        userEntity.password = await bcrypt.hash(updatedData.password, SALT);
        break;
      default:
        userEntity[key] = updatedData[key];
    }
  }
  await userEntity.save();
};

const findAll = async ({ searchKeyword }) => {
  const queryConditions = [];
  if (searchKeyword) {
    queryConditions.push({
      $or: [
        { firstName: { $regex: `.*${searchKeyword}*.` } },
        { lastName: { $regex: `.*${searchKeyword}*.` } },
        { email: { $regex: `.*${searchKeyword}*.` } },
        { phone: { $regex: `.*${searchKeyword}*.` } },
      ],
    });
  }
  const users = await User.find(queryConditions.length ? { $and: queryConditions } : {}).lean();
  return users;
};
const findOne = async userId => {
  const user = await User.findById(userId);
  return user;
};

export default { loginUser, registerUser, updateUser, findAll, findOne };
