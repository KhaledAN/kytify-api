import express from "express";
import dotenv from "dotenv";
import UsersRoutes from "./Modules/User/user.routes.js";
import SongsRoutes from "./Modules/Song/song.routes.js";
import DBconnect from "./DB/connect.js";
import cors from "cors";
import ResponseCodes from "./constants/ResponseCodes.js";
const app = express();

dotenv.config({ path: process.env.NODE_ENV == "development" ? "./.env.development" : "./.env.production" });

const initApp = async () => {
  await DBconnect();
  app.use(cors());
  app.use(express.json());

  app.use("/users", UsersRoutes);
  app.use("/songs", SongsRoutes);
  app.use((req, res, next, err) => {
    console.log(err);
    if (err.errCode) res.status(err.errCode).send(err);
    else res.status(ResponseCodes.SERVER_ERROR).send({ error: "Server error" });
  });
  app.listen(5000, () => {
    console.log("Started ");
  });
};

initApp();
