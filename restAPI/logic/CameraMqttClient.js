import mqtt from "mqtt";

import config from "./../config.js";

export default class CameraClient {
  client = undefined;
  responseFunction = undefined;

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
    this.client.subscribe([`farmbot/${this.farmbotId}/logs`, `sensor/${this.farmbotId}/measurement`], (err) => {
      if (err) {
        console.log("error subscribing");
      }

      this.client.on("message", (topic, message) => {
        this.onHandleTopics(topic, message);
      });

    });
  }

  onHandleTopics(topic, message) {
    if (topic === `farmbot/${this.farmbotId}/logs`)
        this.onCameraMessage(message);
    if (topic === `sensor/${this.farmbotId}/measurement`)
        this.onMeasurementMessage(message);
  }

  onCameraMessage(message) {
    if (this.responseFunction) {
      this.responseFunction(message);
    }
  }

  onMeasurementMessage(message) {
    if (this.responseFunction) {
      this.responseFunction(message);
    }
  }

  takePicture() {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        return reject("Camera did not respond within 20 seconds");
      }, 20000);

      this._addResponseFunction((data) => {
        this._removeResponseFunction();
        return resolve(data);
      });

      this.client.publish(`farmbot/${this.farmbotId}/camera`, "");
    });
  }

  receiveMeasurements() {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        return reject("Sensor did not respond within 20 seconds");
      }, 20000);

      this._addResponseFunction((data) => {
        this._removeResponseFunction();
        return resolve(data);
      });

      this.client.publish(`sensor/${this.farmbotId}/controls`, "");
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
