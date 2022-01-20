import atob from "atob";
global.atob = atob;

import axios from "axios";
import { Farmbot } from "farmbot";

import PhotoSequence from "./sequences/photoSequence.js";
import WaterSequence from "./sequences/waterSequence.js"
import CameraClient from "./CameraMqttClient.js";
import log from "./../utils/logger.js"

import config from "../config.js";

import { SecretManagerServiceClient } from "@google-cloud/secret-manager";

/* FarmbotManager


*/
export default class FarmbotManager {
  farmbot = undefined;
  farmbotInformation = {};

  cameraMqttClient = undefined;

  isExecuting = false;

  runningSequence = null;
  lastPoint = null;

  logSource = "FarmbotManager"

  asyncMessageCount = 0

  constructor() {
    this.secretClient = new SecretManagerServiceClient();
    this.secretClient.initialize()
  }

  async connect() {
    log(this.logSource, "Connection", "Trying to connect to Farmbot")
    await this.getCredentialsFromSecrets()
    if (await this.getAuthToken()) {
      this.farmbot = new Farmbot({
        token: this.farmbotInformation.authToken,
        secure: true,
      });

      await this.farmbot.connect();

      this.farmbot.on("online", (data, eventName) => {
        log(this.logSource, "Connection", "Connected to Farmbot")
      })

      this.farmbot.on("offline", function (data, eventName) {
        log(this.logSource, "Connection", "Connection to Farmbot lost")
      })

      // this.farmbot.on("status", function(data, eventName) {
      //   log(this.logSource, "Farmbot Status", data)
      // })

      this.farmbot.on("logs", (data, eventName) => {
        let incomingMessage = JSON.stringify(data.message)

        if (incomingMessage === "Auto sync complete") {
          log(this.logSource, "Incoming Log Message", "Found a sync complete message")
          if (this.isExecuting) {
            log(this.logSource, "Incoming Log Message", "Something was executing, there was a loss of connection")
            log(this.logSource, "Sequence Restart", "Attempting to restart a sequence")
            log(this.logSource, "Sequence Restart", `Previous executing sequence:${this.runningSequence}`)
            log(this.logSource, "Sequence Restart", `Last executing point:${this.lastPoint}`)

            switch (this.runningSequence) {
              case "data":
                this.performDataSequence()
              case "water":
                this.performWaterSequence()
            }
          }
        }
      })
      this.connectToCameraMqtt();
    }
  }

  disconnect() {
    this.farmbot.client.end()
    this.cameraMqttClient.disconnect()
    this.farmbot = null
  }

  async getCredentialsFromSecrets() {
    log(this.logSource, "Credentials", "Trying to get the secrets")

    let [emailResponse] = await this.secretClient.accessSecretVersion({
      name: config.googleSecrets.email
    })

    this.farmbotInformation.email = emailResponse.payload.data.toString('utf8')

    let [passwordResponse] = await this.secretClient.accessSecretVersion({
      name: config.googleSecrets.password
    })

    this.farmbotInformation.password = passwordResponse.payload.data.toString('utf8')

    // log(this.logSource, "Credentails email", this.farmbotInformation.email)
    // log(this.logSource, "Credentails password", this.farmbotInformation.password)
    log(this.logSource, "Credentails", "Secrets gathered")
  }

  /*  pointCallback
      Function to pass to a sequence which uses a callback to call this function when it is done 
      with a plant
  */
  pointCallback(point) {
    log("FarmbotManager Callback", "Point Callback", point)
    this.lastPoint = point
  }

  /*  getAuthToken
      Returns the Farmbot_id and Farmbot token by posting a request on my.farm.bot/api/tokens 
      The Farmbot token is used for communicating with the Farmbot
  */
  async getAuthToken() {
    try {
      let body = {
        user: {
          email: this.farmbotInformation.email,
          password: this.farmbotInformation.password,
        },
      }
      log(this.logSource, "AuthToken", JSON.stringify(body))
      const reponse = await axios.post("https://my.farm.bot/api" + "/tokens", body);

      this.farmbotInformation.id = reponse.data.token.unencoded.bot;
      this.farmbotInformation.authToken = reponse.data.token.encoded;

      return true;
    } catch (err) {
      log(this.logSource, "AuthToken", err)
      return false;
    }
  }

  connectToCameraMqtt() {
    this.cameraMqttClient = new CameraClient(this.farmbotInformation.id);
  }

  /*  performDataSequence()
      Starts the sequence of collecting the data out of the field
  */
  async performDataSequence() {
    log(this.logSource, "Data Sequence", "Requested")
    return new Promise(async (resolve, reject) => {
      log(this.logSource, "Data Sequence", `Currently executing something: ${this.isExecuting}`)
      if (!this.isExecuting) {
        log(this.logSource, "Data Sequence", "Starting Sequence")
        this.isExecuting = true;
        this.runningSequence = "data"

        const sequence = new PhotoSequence(
          this.farmbot,
          this.cameraMqttClient,
          this.farmbotInformation,
          this.pointCallback
        );

        try {
          await sequence.performSequence(this.lastPoint);
        }
        catch (err) {
          log(this.logSource, "Data Sequence", err)
        }

        this.isExecuting = false;
        this.runningSequence = null;
      }
      resolve();
    });
  }

  /*  performWaterSequence()
      Starts the sequence of watering all the plants within the field
  */
  async performWaterSequence() {
    log(this.logSource, "Water Sequence", "Requested")
    return new Promise(async (resolve, reject) => {
      log(this.logSource, "Water Sequence", `Currently executing something: ${this.isExecuting}`)
      if (!this.isExecuting) {
        log(this.logSource, "Water Sequence", "Starting Sequence")
        this.isExecuting = true;
        this.runningSequence = "water"

        const sequence = new WaterSequence(
          this.farmbot,
          this.farmbotInformation,
          this.pointCallback
        );

        try {
          await sequence.performWateringSequence(this.lastPoint);
        } catch (err) {
          log(this.logSource, "Water Sequence", err)
          reject();
        }

        this.isExecuting = false;
      }

      resolve();
    });
  }
}
