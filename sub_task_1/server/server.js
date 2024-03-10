process.on("uncaughtException", (err) => {
  console.log(err);
  console.log("UNCAUGHT EXCEPTION!    Shutting Down...");
  process.exit(1);
});

import app from "./app.js";
const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log("Server is up on port " + PORT);
});
