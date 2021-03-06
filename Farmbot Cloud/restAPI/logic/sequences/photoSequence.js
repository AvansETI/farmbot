import axios from "axios";

import { savePlant } from "./../../database/database.js";
import log from "./../../utils/logger.js"
import DocumentStorage from "./../../database/documentstorage.js"

/* PhotoSequence

*/
export default class PhotoSequence {
  constructor(farmbot, cameraClient, farmbotInformation, pointCallback) {
    this.farmbot = farmbot;
    this.cameraClient = cameraClient;
    this.farmbotInformation = farmbotInformation;
    this.pointCallback = pointCallback
    this.documentStorage = new DocumentStorage()
  }

  /*  performSequence()
      fetch the locations of the plant,
      read out the pi if the camera is connected or not,
      then perform the data collection action.
  */
  async performSequence(lastPoint) {
    await this.fetchPlantsLocations();

    if (!(await this.readStatus()).pins[10].value) {
      console.log("Turn on the Pi peripheral")
      await this.farmbot.togglePin({ pin_number: 10 });
      await setTimeout(async () => {
        return this.performAction(lastPoint);
      }, 120000);
    } else {
      return this.performAction(lastPoint);
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
            resolve(data);
          },
          true
        );
      } catch (err) {
        reject(err);
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
  performAction(lastPoint) {
    return new Promise(async (resolve, reject) => {
      for (const pointIndex in this.points) {
        if (pointIndex >= lastPoint || lastPoint == null) {
          try {
            log("PhotoSequence", "Move Request", `Requesting to move to (${this.points[pointIndex].x},${this.points[pointIndex].y})`)
            await this.farmbot.moveAbsolute({
              x: this.points[pointIndex].x,
              y: this.points[pointIndex].y,
              z: 0,
              speed: 100,
            })
              .then(value => {
                log("PhotoSequence", "Moving Action", `Done moving to (${this.points[pointIndex].x},${this.points[pointIndex].y})`)
              })
              .catch(err => {
                log("PhotoSequence", "Moving Action Error Catch", "moveAbsolute Rejected...")
              })

          } catch (err) {
            log("PhotoSequence", "Move Error", err)
          }

          //TODO Enable this when sensor network is operational again
          let responseMeasurement = {};
          // try {
          //   responseMeasurement = JSON.parse(
          //     (await this.cameraClient.receiveMeasurements()).toString()
          //   );
          //   console.log(responseMeasurement);
          // } catch (err) {
          //   console.log(err);
          // }

          let responseCamera = {};
          try {
            responseCamera = JSON.parse(
              (await this.cameraClient.takePicture()).toString()
            );
            log("PhotoSequence", "Camera Response Status", responseCamera.status)

            this.documentStorage.writePlant(
              this.points[pointIndex],
              responseCamera,
              responseMeasurement
            )
          } catch (err) {
            console.log(err);
          }

          this.pointCallback(pointIndex)
        }
      }

      try {
        await this.farmbot.moveAbsolute({ x: 0, y: 100, z: 0, speed: 100 });
      } catch (err) {
        log("PhotoSequence", "Moving Home Error", JSON.stringify(err))
      }

      resolve();
    });
  }
}
