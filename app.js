import bodyParser from "body-parser";
import express from "express";
import http from "http";

import client from "./routes/client.js";
import auth from "./routes/auth.js";

const app = express();

// bodyParser
app.use(bodyParser.json({ limit: "20480KB" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "20480KB" }));

app.use(express.static("public"));
app.use("/", client);
app.use("/auth", auth);

// change the 404 message modifing the middleware
app.use((req, res, next) => {
  return res
    .status(404)
    .send("Sorry, that route doesn't exist. Have a nice day :)");
});

// start the server
const server = http.createServer(app);
const port = 8000;
server.listen(port, "0.0.0.0");

server.on("listening", async () => {
  console.log(`Oauth client listening on port: ${port}`);
});

server.on("error", (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
    default:
      throw error;
  }
});
