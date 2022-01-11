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

  disconnect(){
    this.client.close()
  }
  /*  subscribteToTopics()
      subscribe to the MQTT broker for the camera and the measurements.
  */
  subscribteToTopics() {
    log("CameraClient", "Connection", "Connected");

    const messageHandler = (message) => {
      let bufferOriginal = Buffer.from(JSON.parse(JSON.stringify(message.data)).data);
      let json = JSON.parse(bufferOriginal.toString('utf8'));
      this.onHandleTopics(json.topic, JSON.stringify(json));
      message.ack();
    }

    this.client.subscription(`sensor-${this.farmbotId}-logs`).on('message', messageHandler).on('error', (error) => {log("CameraClient", "Subscription", "Error Subscribing")});
    this.client.subscription(`sensor-${this.farmbotId}-measurement`).on('message', messageHandler).on('error', (error) => {log("CameraClient", "Subscription", "Error Subscribing")});
  }

  /*  onHandleTopics(topic, message)
      Handle the right message based on the incoming topic.
  */
  onHandleTopics(topic, message) {
    if (this.responseFunction) {
      this.responseFunction(message);
    }
  }

  /*  takePicture()
      Publishes a message on the right MQTT topic, triggering the camera to take a picture.
      If the camera does not respond within 20 seconds, move to the next plant.
  */
  takePicture() {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        this._removeResponseFunction();
        reject("Camera did not respond within 20 seconds");
      }, 20000);

      this._addResponseFunction((data) => {
        this._removeResponseFunction();
        resolve(data);
      });

      this.client.topic(`sensor-${this.farmbotId}-camera`).publish(Buffer.from("Take Picture"));
    });
  }

  /*  receiveMeasurements()
      Publishes a message on the right MQTT topic, triggering the sensors to collect data.
      If the sensor does not respond within 20 seconds, move to the next plant.
  */
  receiveMeasurements() {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        this._removeResponseFunction();
        reject("Sensor did not respond within 20 seconds");
      }, 20000);

      this._addResponseFunction((data) => {
        this._removeResponseFunction();
        console.log(data);
        resolve(data);
      });

      this.client.topic(`sensor-${this.farmbotId}-measurement`).publish(Buffer.from("Measurements"));
    });
  }

  _addResponseFunction(responseFunction) {
    if (!this.responseFunction) {
      this.responseFunction = responseFunction;
    }
  }

  _removeResponseFunction() {
    this.responseFunction = undefined;
  }
}
