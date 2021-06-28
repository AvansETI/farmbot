# Autonomous farming
This project is created for autonomous data collection on a Farmbot.

## Table of Contents
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Installation](#installation)
4. [Configuration](#configuration)
5. [Communication](#communication)

## General Info
The following project is created to set a step into the right direction for autonomous data collections using a Farmbot.
This project allows the Farmbot to move autonomously (without human interference) and collect data from different kinds of crops within a field.
This data will then be stored in a MongoDB database, where the data is accessible through a simple web interface.
For this project, an external camera is being used for creating high-quality images.
At last, a Proof of Concept is created for labeling the images using Machine Learning. This Proof of Concept shows that labeling images with data that is being collected is possible.

NOTE: the project is still pretty plain, meaning that the application is open for further development.

## Technologies
* [Node JS](https://nodejs.org/en/): Version 16.3
* [MQTT](https://mqtt.org/)
* [MongoDB](https://www.mongodb.com/)
* [YOLO](): Version 14.4
* [Platform IO](https://platformio.org/)
* [Flutter](https://flutter.dev/)

* [DHT11 sensor](https://learn.adafruit.com/dht)
* [USB-endoscope](https://www.amazon.nl/USB-endoscoop-waterdichte-borescope-inspectiecamera-megapixels-micro-inspectiecamera/dp/B08ZMDPKWW/ref=sr_1_4?__mk_nl_NL=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=5mp+endoscoop+usb&qid=1619431155&sr=8-4)

## Installation

Use node package manager [npm](https://docs.npmjs.com/cli/v7/commands/npm-install) to install dependencies for the REST API

```bash
npm install farmbot cors mongoose cron body-parser express axios mqtt
```
## Configuration
To configure the REST API, a few things need to be filled in: 

```javascript
    user: {
        email: process.env.MFB_USER || "****", //My.farm.bot email
        password: process.env.MFB_PASSWORD || "****" //My.farm.bot password
    }
```
To create a connection with the Farmbot, an account needs to be created. After creating and linking the account to a Farmbot on [My.farm.bot](https://my.farmbot.io/), this account can be used within the application.

```javascript
    http: {
        port: process.env.PORT || 3000,
```
This is the HTTP port where the API server is hosted on.

```javascript
    api: {
        URL: process.env.API_URL || "https://my.farmbot.io/api",
```
This API URL is used to collect the field data about the plants within the field.

```javascript
    database: {
        address: process.env.DB_URL || "mongodb://127.0.0.1:27017/farmbot",
        username: process.env.DB_USER || "****",
        password: process.env.DB_PASSWORD || "****"
```
This is the database information. For more information about how a MongoDB database works, check out [MongoDB.com](https://www.mongodb.com/).


```javascript
    mqttCamera: {
        broker: process.env.BROKER_URL || "mqtt://****",
        username: process.env.BROKER_USER || "****",
        password: process.env.BROKER_PASSWORD || "****",
```
This information is used for the MQTT data transition. A server is hosted on the broker, where the data is being send to from the different sensors and camera data. This data will then be accessible on a specific topic. For more information about MQTT, check out [MQTT.org](https://mqtt.org/) 

## Communication