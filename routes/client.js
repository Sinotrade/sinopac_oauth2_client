import express from "express";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

router.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/clientAuthenticate.html"))
);

router.get("/cb", (req, res) =>
  res.sendFile(path.join(__dirname, "../public/clientApp.html"))
);

export default router;
