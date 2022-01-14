import fs from "fs";
import path from "path";

import express from "express";
import axios from "axios";

import config from "./../config.js";

const router = express.Router();

/*
    returns the image of an image with a specified id.
*/
router.get("/:imageId", (req, res) => {
  // const photoId = req.params.imageId;

  // if (photoId) {
  //   res.sendFile(path.resolve(`images/${photoId}.jpg`));
  // }

  res.send(410).send("Function not implemented")
});

/*
    creates an image within the image folder of the photo that has been taken.
*/
router.post("/", (req, res) => {
  // const photoId = req.query.messageId;

  // fs.writeFile(`images/${photoId}.jpg`, req.body, (err) => {
  //   if (err) {
  //     console.log(err);
  //     res.status(500).send(err);
  //   }
  //   res.status(200).send();
  // });

  axios
    .post(
      `${config.labelingContainer.endpoint}/image?messageId=${req.query.messageId}`,
      req.body
    )
    .then((response) => {
      res.status(200).send(response);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

export default router;
