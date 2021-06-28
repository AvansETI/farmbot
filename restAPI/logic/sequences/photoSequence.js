import axios from "axios";

import { savePlant } from "./../../database/database.js";

/* PhotoSequence

*/
export default class PhotoSequence {
  constructor(farmbot, cameraClient, farmbotInformation) {
    this.farmbot = farmbot;
    this.cameraClient = cameraClient;
    this.farmbotInformation = farmbotInformation;
  }

  /*  performSequence()
      fetch the locations of the plant,
      read out the pi if the camera is connected or not,
      then perform the data collection action.
  */
  async performSequence() {
    await this.fetchPlantsLocations();

    if (!(await this.readStatus()).pins[10].value) {
      await this.farmbot.togglePin({ pin_number: 10 });
      setTimeout(async () => {
        return this.performAction();
      }, 120000);
    } else {
      return this.performAction();
    }
  }

  /*  readStatus()
      reads out the status of the camera.
  */
  async readStatus() {
    return new Promise(async (resolve, reject) => {
      try {
        await this.farmbot.readStatus({ pin_number: 10 });
        this.farmbot.on(
          "status",
          (data, eventname) => {
            return resolve(data);
          },
          true
        );
      } catch (err) {
        return reject(err);
      }
    });
  }

  /*  fetchPlantLocations()
      save all the planted plants in a list, sorted by their coordinates.
  */
  async fetchPlantsLocations() {
    try {
      const response = await axios.get("https://my.farm.bot/api" + "/points", {
        headers: {
          Authorization: this.farmbotInformation.authToken,
        },
      });

      this.points = response.data.filter((point) => {
        return (
          point.pointer_type === "Plant" && point.plant_stage === "planted"
        );
      });

      this.points.sort((a, b) => {
        if (a.x === b.x) {
          return a.y - b.y;
        }
        return a.x - b.x;
      });
    } catch (err) {
      console.log(err);
      console.log(`No plant points found`);
    }
  }

  /*  performAction()
      Move the Farmbot over all the plants, taking a photo of it and saving all the data in the database.
      After being done, move the Farmbot to home.
  */
  performAction() {
    return new Promise(async (resolve, reject) => {
      for (const pointIndex in this.points) {
        try {
          await this.farmbot.moveAbsolute({
            x: this.points[pointIndex].x,
            y: this.points[pointIndex].y,
            z: 0,
            speed: 100,
          });
        } catch (err) {
          console.log(err);
        }

        let responseMeasurement = {};
        try {
          responseMeasurement = await this.cameraClient.receiveMeasurements();
          console.log(responseMeasurement.toString());
        } catch (err) {
          console.log(err);
        }

        let responseCamera = {};
        try {
          responseCamera = await this.cameraClient.takePicture();
          console.log(responseCamera.toString());
        } catch (err) {
          console.log(err);
        }

        try {
          savePlant(
            this.points[pointIndex],
            responseCamera,
            responseMeasurement
          );
        } catch (err) {
          console.log(err);
        }
      }
      await this.farmbot.moveAbsolute({ x: 0, y: 0, z: 0, speed: 100 });
      return resolve();
    });
  }
}
