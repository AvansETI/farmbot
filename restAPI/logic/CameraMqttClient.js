import mqtt from "mqtt";

import config from "./../config.js";

export default class CameraClient {
  client = undefined;
  responseFunction = undefined;

  waitingForResponse = false;

  constructor(farmbotId) {
    this.farmbotId = farmbotId;

    this.client = mqtt.connect(config.mqttCamera.broker, {
      username: config.mqttCamera.username,
      password: config.mqttCamera.password,
    });

    this.client.on("connect", () => {
      this.onConnect();
    });
  }

  onConnect() {
    this.client.subscribe(`farmbot/${this.farmbotId}/logs`, (err) => {
      if (err) {
        console.log("error subscribing");
      }

      this.client.on("message", (topic, message) => {
        this.onCameraMessage(topic, message);
      });
    });
  }

  async onCameraMessage(topic, message) {
    console.log(this.responseFunction);
    console.log(this.waitingForResponse);
    if (this.waitingForResponse && this.responseFunction) {
      await this.responseFunction();
    }
  }

  async takePicture() {
    console.log(this.farmbotId);
    await this.client.publish(`farmbot/${this.farmbotId}/camera`, "");

    this.waitingForResponse = true;
  }

  addResponseFunction(responseFunction) {
    console.log(responseFunction);
    if (!this.responseFunction) {
      this.responseFunction = responseFunction;
      console.log(responseFunction)
    }
  }

  removeResponseFunction() {
    this.responseFunction = undefined;
  }
}
