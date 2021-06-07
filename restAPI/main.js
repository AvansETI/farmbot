import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import cron from "node-cron";

import FarmbotManager from "./logic/DataSequence.js";
import config from "./config.js";

// const { createToken, generatePoints, connectFarmbot } = require("./logic/farmbotCom/setup");
// const { moveFarmbot, takePhoto } = require("./logic/farmbotCom/movement");
// const { sequencePhoto, sequenceWater } = require("./logic/farmbotCom/sequences");

// import route from "./api/route"
import imageEndpoint from "./api/imageEndpoint.js"

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ type: "application/json" }));
app.use(
  bodyParser.raw({
    inflate: true,
    limit: "15mb",
    type: "*/*",
  })
);

app.all("*", function (req, res, next) {
  console.log(
    `[${new Date().toISOString()}] [${req.method}] ${req.url} has been invoked!`
  );
  next()
});

// app.use(express.static("public"));
// app.use("/api/route", route);
app.use(imageEndpoint);

const farmbotManager = new FarmbotManager(
  config.user.email,
  config.user.password
);
await farmbotManager.connect();

// cron.schedule("* * * * *", async () => {

// });

await farmbotManager.performDataSequence();

app.listen(config.http.port, function () {
  console.log(`Server started at port: 8080 `);
});

// async function main() {
//   const inlog = await askParameters("E-mailaddress: ", false);
//   const password = await askParameters("Password: ", true);

//   await createToken(inlog, password);

//   while (true) {
//     const subscribeTopic = await askParameters("Get data from topic: ", false);

//     if (subscribeTopic == "move") {
//       moveFarmbot(100, 100, 100, 100);
//     }

//     if (subscribeTopic == "exit") {
//       break;
//     }

//     if (subscribeTopic == "connect") {
//       connectFarmbot();
//       generatePoints();
//     }

//     if (subscribeTopic == "sequence") {
//       sequencePhoto();
//     }

//     if (subscribeTopic == "photo") {
//       takePhoto();
//     }

//     if (subscribeTopic == "water") {
//       sequenceWater();
//     }
//   }
// }

// main();
