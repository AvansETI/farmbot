import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import database from "./database/database.js"
import cron from "node-cron";

import FarmbotManager from "./logic/farmbotManager.js";
import config from "./config.js";

const app = express();

const dataBase = new database(
  config.database.address,
  config.database.username,
  config.database.password
);

const farmbotManager = new FarmbotManager(
  config.user.email,
  config.user.password,
  dataBase
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

await dataBase.connect();

await dataBase.createSchema();

await farmbotManager.connect();

cron.schedule("*/60 10-22 * * *", async () => {
  await farmbotManager.performDataSequence();
});

cron.schedule("* 8 * * * ", async () => {
  await farmbotManager.performWaterSequence();
});

app.listen(config.http.port, function () {
  console.log(`Server started at port: ${config.http.port} `);
});

app.get('/database', (req, res) => {
      res.send(dataBase.availableIDs());
});

app.get('/plantData', (req, res) => {
    dataBase.getDataFromDatabase(req.query.id, req.query.offset);
    res.end
})

app.get('/dataSequence', (req, res) => {
  farmbotManager.performDataSequence();
  res.end("Data sequence has started!");
});

app.get('/waterSequence', (req, res) => {
  farmbotManager.performWaterSequence();
  res.end("Water sequence has started!");
});
