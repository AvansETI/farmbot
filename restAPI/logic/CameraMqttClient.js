import mqtt from "mqtt";

import config from "./../config.js";
import log from "./../utils/logger.js"

/*  CameraClient

*/
export default class CameraClient {
  client = undefined;
  responseFunction = undefined;

  constructor(farmbotId) {
    this.farmbotId = farmbotId;

    log("CameraClient", "Connection", "Trying to connect to MQTT")

    this.client = mqtt.connect(config.mqttCamera.broker, {
      username: config.mqttCamera.username,
      password: config.mqttCamera.password,
    });


    this.client.on("connect", () => {
      log("CameraClient", "Connection", "Connection established")
      this.onConnect();
    });

    this.client.on("error", (error) => {
      log("CameraClient", "Connection", "Connection Error")
      console.log(error)
    })
  }

  /*  onConnect()
      reads out the messages on the MQTT broker for the camera and the measurements.
  */
  onConnect() {
    this.client.subscribe([`sensor/${this.farmbotId}/logs`, `sensor/${this.farmbotId}/measurement`], (err) => {
      if (err) {
        log("CameraClient", "Subscription", "Error Subscribing")
      }

      this.client.on("message", (topic, message) => {
        this.onHandleTopics(topic, message);
      });
    });
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

      this.client.publish(`sensor/${this.farmbotId}/camera`, "");
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
        resolve(data);
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
