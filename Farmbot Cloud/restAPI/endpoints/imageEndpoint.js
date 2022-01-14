import fs from "fs";
import path from "path";

import express from "express";
import axios from "axios";

import config from "./../config.js";
import log from "./../utils/logger.js";

const router = express.Router();

/*
    returns the image of an image with a specified id.
*/
router.get("/:imageId", (req, res) => {
  // const photoId = req.params.imageId;

  // if (photoId) {
  //   res.sendFile(path.resolve(`images/${photoId}.jpg`));
  // }

  res.send(410).send("Function not implemented");
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
      req.body,
      { headers: { "Content-type": "image/jpg" } }
    )
    .then((response) => {
      log("Image Endpoint", "Labeling Container Response", JSON.stringify(response.data))

      // Image has been uploaded via the labeling container
      // Now run the image through the classification model for plant recognition
      axios.post(
        `${config.classificationContainer.endpoint}/classify`,
        {filepath: response.data.filepath}
      )
      .then((res) => {
        log("Image Endpoint", "Classification Container Response", res)
      })
      .catch((error) => {
        log("Image Endpoint", "Classification Container Error", error)
        res.status(500).send(error);
      })

      res.status(200).send(response.data);
    })
    .catch((error) => {
      res.status(500).send(error);
    });
});

export default router;
