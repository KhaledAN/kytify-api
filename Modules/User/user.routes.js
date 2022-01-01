import express from "express";
import IsLoggedInMiddleware from "../../Middlewares/IsLoggedIn.middleware.js";
import joiMiddleware from "../../Middlewares/Joi.middleware.js";
import addSongsToPlaylist from "../Playlist/dtos/addSongs.dto.js";
import createPLaylistDto from "../Playlist/dtos/createPlaylist.dto.js";
import PlaylistController from "../Playlist/playlist.controller.js";
import { UserRoles } from "./constants/user.enum.js";
import loginDto from "./dtos/login.dto.js";
import registerDto from "./dtos/register.dto.js";
import UserController from "./user.controller.js";

const UsersRoutes = express.Router();

UsersRoutes.post("/login", joiMiddleware(loginDto), UserController.login);
UsersRoutes.post("/register", joiMiddleware(registerDto), UserController.register);
UsersRoutes.use(IsLoggedInMiddleware());
UsersRoutes.route("/personalInfo").get(UserController.getPersonalInfo).put(UserController.updateUser);
UsersRoutes.route("/playlists").get(PlaylistController.findUserPlaylists).post(joiMiddleware(createPLaylistDto), UserController.createPlaylist);
UsersRoutes.route("/playlists/:playlistId").get(PlaylistController.findOne).put(UserController.updatePlaylist).delete(UserController.removePlaylist);
UsersRoutes.route("/playlists/:playlistId/songs")
  .all(joiMiddleware(addSongsToPlaylist))
  .post(UserController.addSongsToPlaylist)
  .put(UserController.removeSongsFromPlaylist);

UsersRoutes.route("/songs").get(IsLoggedInMiddleware([UserRoles.ARTIST, UserRoles.ADMIN]), UserController.getArtistSongs);

UsersRoutes.use(IsLoggedInMiddleware([UserRoles.ADMIN]));
UsersRoutes.route("/:userId").get(UserController.findOne).put(UserController.adminUpdateUser);
UsersRoutes.route("/").get(UserController.findAll);

export default UsersRoutes;
