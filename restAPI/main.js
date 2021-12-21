import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import mongoose from 'mongoose';
import cron from "node-cron";

import imageEndpoint from "./endpoints/imageEndpoint.js";
import plantEndpoint from "./endpoints/plantEndpoint.js";

import FarmbotManager from "./logic/farmbotManager.js";
import config from "./config.js";
import log from "./utils/logger.js"

const app = express();
const logSource = "Main"

log(logSource, "Startup", `Trying to connect to mongoDB at adress: ${config.database.address}, with ${config.database.username}, ${config.database.password}`)

await mongoose.connect(config.database.address, {
    user: config.database.username,
    pass: config.database.password,
    authSource: "admin",
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    log(logSource, "Startup", "Established connection with MongoDB")
}).catch((err) => {
    log(logSource, "Startup Failed", "Connection with MongoDB Failed")
    log(logSource, "Startup Failed", err)
})



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

cron.schedule(process.env.DATASEQUENCE_SCHEDULE || "0 0 10-23/4 * * *", async() => {
    log(logSource, "CronJob", "Starting Data Sequence")
    await farmbotManager.performDataSequence();
    log(logSource, "CronJob", "Stopping Data Sequence")
});

cron.schedule(process.env.WATERSEQUENCE_SCHEDULE || "0 0 8 * * *", async() => {
    log(logSource, "CronJob", "Starting Water Sequence")
    await farmbotManager.performWaterSequence();
    log(logSource, "CronJob", "Stopping Water Sequence")
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
    log("Main", "Startup", `Server started at port: ${config.http.port} `)
});

// farmbotManager.performDataSequence();