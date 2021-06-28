import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import mongoose from 'mongoose';
import cron from "node-cron";

import imageEndpoint from "./endpoints/imageEndpoint.js";
import plantEndpoint from "./endpoints/plantEndpoint.js";

import FarmbotManager from "./logic/farmbotManager.js";
import config from "./config.js";

const app = express();

mongoose.connect(config.database.address, {
    // user: config.database.username,
    // pass: config.database.password,
    // authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const farmbotManager = new FarmbotManager(
    config.user.email,
    config.user.password,
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

app.all("*", function(req, res, next) {
    console.log(
        `[${new Date().toISOString()}] [${req.method}] ${req.url} has been invoked!`
    );
    next();
});

app.use("/image", imageEndpoint);
app.use("/plant", plantEndpoint);
app.use(express.static("public"));

await farmbotManager.connect();

cron.schedule(process.env.DATASEQUENCE_SCHEDULE || "*/60 10-22 * * *", async() => {
    await farmbotManager.performDataSequence();
});

cron.schedule(process.env.WATERSEQUENCE_SCHEDULE || "* 8 * * * ", async() => {
    await farmbotManager.performWaterSequence();
});

app.get("/dataSequence", (req, res) => {
    farmbotManager.performDataSequence();
    res.end("Data sequence has started!");
});

app.get("/waterSequence", (req, res) => {
    farmbotManager.performWaterSequence();
    res.end("Water sequence has started!");
});

app.listen(config.http.port, function() {
    console.log(`Server started at port: ${config.http.port} `);
});

farmbotManager.performDataSequence();