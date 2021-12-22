import mqtt from "mqtt";

import config from "./../config.js";
import log from "./../utils/logger.js"

import PS from "@google-cloud/pubsub";

/*  CameraClient */
export default class CameraClient {
  client = undefined;
  responseFunction = undefined;

  constructor(farmbotId) {
    this.farmbotId = farmbotId;

    log("CameraClient", "Connection", "Trying to connect to MQTT")

    this.client = new PS.PubSub();
    this.subscribteToTopics();
  }
  

  /*  subscribteToTopics()
      subscribe to the MQTT broker for the camera and the measurements.
  */
  subscribteToTopics() {
    log("CameraClient", "Connection", "Connected");

    // Create an event handler to handle messages
    let messageCount = 0;
    const messageHandler = message => {
      console.log(`Received message ${message.id}:`);
      console.log(`\tData: ${message.data}`);
      console.log(`\tAttributes: ${message.attributes}`);
      messageCount += 1;
  
      // "Ack" (acknowledge receipt of) the message
      message.ack();
    };

    pubSubClient.subscription(`sensor-${this.farmbotId}-camera`).on('message', takePicture);
    pubSubClient.subscription(`sensor-${this.farmbotId}-measurements`).on('message', receiveMeasurements);
  }

  /*  takePicture()
      Publishes a message on the right MQTT topic, triggering the camera to take a picture.
      If the camera does not respond within 20 seconds, move to the next plant.
  */
  takePicture() {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        reject("Camera did not respond within 20 seconds");
      }, 20000);

      this._addResponseFunction((data) => {
        resolve(data);
      });

      pubSubClient.topic(`sensor-${this.farmbotId}-camera`).publish("");
    });
  }

  /*  receiveMeasurements()
      Publishes a message on the right MQTT topic, triggering the sensors to collect data.
      If the sensor does not respond within 20 seconds, move to the next plant.
  */
  receiveMeasurements() {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        reject("Sensor did not respond within 20 seconds");
      }, 20000);

      this._addResponseFunction((data) => {
        resolve(data);
      });

      pubSubClient.topic(`sensor-${this.farmbotId}-measurements`).publish("");
    });
  }
}
