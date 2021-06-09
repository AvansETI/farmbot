import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import mongoose from 'mongoose';
import cron from "node-cron";

import FarmbotManager from "./logic/farmbotManager.js";
import config from "./config.js";

// const { createToken, generatePoints, connectFarmbot } = require("./logic/farmbotCom/setup");
// const { moveFarmbot, takePhoto } = require("./logic/farmbotCom/movement");
// const { sequencePhoto, sequenceWater } = require("./logic/farmbotCom/sequences");

// import route from "./api/route"
import imageEndpoint from "./api/imageEndpoint.js";

mongoose.connect("mongodb://localhost:27017/", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();
const farmbotManager = new FarmbotManager(
  config.user.email,
  config.user.password
);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));
app.use(
  bodyParser.raw({
    inflate: true,
    limit: "15mb",
    type: "image/*",
  })
);

app.all("*", function (req, res, next) {
  console.log(
    `[${new Date().toISOString()}] [${req.method}] ${req.url} has been invoked!`
  );
  next();
});

app.use(express.static("public"));
// app.use("/api/route", route);
app.use(imageEndpoint);

await farmbotManager.connect();

cron.schedule("*/60 10-22 * * *", async () => {
  await farmbotManager.performDataSequence();
});

cron.schedule("* 8 * * * ", async () => {
  await farmbotManager.performWaterSequence();
});

app.listen(config.http.port, function () {
  console.log(`Server started at port: 8080 `);
});

