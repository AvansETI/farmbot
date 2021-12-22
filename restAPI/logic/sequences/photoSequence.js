import axios from "axios";

import { savePlant } from "./../../database/database.js";
import log from "./../../utils/logger.js"
import DocumentStorage from "./../../database/documentstorage.js";

/* PhotoSequence

*/
export default class PhotoSequence {
  constructor(farmbot, cameraClient, farmbotInformation, pointCallback) {
    this.farmbot = farmbot;
    this.cameraClient = cameraClient;
    this.farmbotInformation = farmbotInformation;
    this.pointCallback = pointCallback
    this.documentStorage = new DocumentStorage("./../../credentials/farmbot-avans-cloud-b127ccec038b.json")
    // this.documentStorage = new DocumentStorage("./credentials/farmbot-avans-cloud-b127ccec038b.json")
  }

  /*  performSequence()
      fetch the locations of the plant,
      read out the pi if the camera is connected or not,
      then perform the data collection action.
  */
  async performSequence() {
    await this.fetchPlantsLocations();

    if (!(await this.readStatus()).pins[10].value) {
      console.log("Turn on the Pi peripheral")
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
  performAction() {
    return new Promise(async (resolve, reject) => {
      for (const pointIndex in this.points) {
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

          // const movePromise = new Promise((resolve, reject) => {
            
            
          //   resolve()
          // })
          

          // const timeoutPromise = new Promise((resolve, reject) => {
          //   // Check if two minutes go by, if so
          //   setTimeout(() => {
          //     log("PhotoSequence", "Moving Timeout", "Moving took more then 2 minutes, something probably went wrong...")
          //     reject()
          //   }, 120000)
          // })

          // Promise.race([movePromise, timeoutPromise]).catch(err => {
          //   log("PhotoSequence", "Move Error Catch", err)
          // })
        } catch (err) {
          log("PhotoSequence", "Move Error", err)
        }

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
          // console.log(responseCamera);

          // savePlant(
          //   this.points[pointIndex],
          //   responseCamera,
          //   responseMeasurement
          // );
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

      try {
        await this.farmbot.moveAbsolute({ x: 0, y: 100, z: 0, speed: 100 });
      } catch (err) {
        console.log("Moved to home location with usual error");
      }

      resolve();
    });
  }
}
