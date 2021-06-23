import fs from "fs";
import path from "path";

import express from "express";

const router = express.Router();

router.get("/:imageId", (req, res) => {
  const photoId = req.params.imageId;

  if (photoId) {
    res.sendFile(path.resolve(`images/${photoId}.jpg`))
  }
});

router.post("/", (req, res) => {
  const photoId = req.query.messageId;

  fs.writeFile(`images/${photoId}.jpg`, req.body, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send(err);
    }
    res.status(200).send();
  });
});

export default router;