import mongoose from "mongoose";
const DBconnect = async () => {
  await mongoose.connect(process.env.DATABASE_URI);
  console.log("Connected to DB");
};
export default DBconnect;
