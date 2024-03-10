import mongoose from "mongoose";

mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("connected mongodb"))
  .catch((err) => console.log("Failed to connect mongodb", err));
