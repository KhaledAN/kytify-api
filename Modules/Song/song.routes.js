import express from "express";
import FileUploader from "../../Middlewares/FileUploader.middleware.js";
import IsLoggedInMiddleware from "../../Middlewares/IsLoggedIn.middleware.js";
import joiMiddleware from "../../Middlewares/Joi.middleware.js";
import { UserRoles } from "../User/constants/user.enum.js";
import addSongDto from "./dtos/addSong.dto.js";
import updateSongDto from "./dtos/updateSong.dto.js";
import SongController from "./song.controller.js";

const SongsRoutes = express.Router();

SongsRoutes.get("/:songId", SongController.findOne);
SongsRoutes.get("/", SongController.findAll);
SongsRoutes.get("/:songId/file", SongController.getSong);

SongsRoutes.use(IsLoggedInMiddleware([UserRoles.ARTIST, UserRoles.ADMIN]));

SongsRoutes.post("/", joiMiddleware(addSongDto), SongController.addSong);

SongsRoutes.put("/:songId/file", FileUploader.single("file"), joiMiddleware(updateSongDto), SongController.updateSongFile);
SongsRoutes.put("/:songId", joiMiddleware(updateSongDto), SongController.updateSong);

export default SongsRoutes;
