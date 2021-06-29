# Autonomous farming
This project is created for autonomous data collection on a Farmbot.

## Table of Contents
1. [General Info](#general-info)
2. [Technologies](#technologies)
3. [Installation](#installation)
4. [Configuration](#configuration)

## General Info
The following project is created to set a step into the right direction for autonomous data collections using a Farmbot.
This project allows the Farmbot to move autonomously (without human interference) and collect data from different kinds of crops within a field.
This data will then be stored in a MongoDB database, where the data is accessible through a simple web interface.
For this project, an external camera is being used for creating high-quality images.
At last, a Proof of Concept is created for labeling the images using Machine Learning. This Proof of Concept shows that labeling images with data that is being collected is possible.

NOTE: the project is still pretty plain, meaning that the application is open for further development.

## Technologies
Software: 
* [Node JS](https://nodejs.org/en/)
* [MQTT](https://mqtt.org/)
* [MongoDB](https://www.mongodb.com/)
* [YOLO]()
* [Platform IO](https://platformio.org/)
* [Flutter 2](https://flutter.dev/)

Hardware: 
* [Farmbot](https://farm.bot/)
* [DHT11 sensor](https://learn.adafruit.com/dht)
* [USB-endoscope](https://www.amazon.nl/USB-endoscoop-waterdichte-borescope-inspectiecamera-megapixels-micro-inspectiecamera/dp/B08ZMDPKWW/ref=sr_1_4?__mk_nl_NL=%C3%85M%C3%85%C5%BD%C3%95%C3%91&dchild=1&keywords=5mp+endoscoop+usb&qid=1619431155&sr=8-4)

## Installation
### REST API
Use node package manager [npm](https://docs.npmjs.com/cli/v7/commands/npm-install) to install dependencies for the REST API

```bash
npm install farmbot cors mongoose cron body-parser express axios mqtt
```

###  Camera Module
The following packages are used: 

* paho-mqtt
* opencv-python
* requests
* sshtunnel

It is also possible to install the package with the included requirements.txt 

## Configuration
### REST API
The configuration file for the rest API can be found in [config.js](restAPI/config.js)
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
        address: process.env.DB_URL || "mongodb://****",
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

### Camera Module

The configuration file for the camera module can be found in [Configuration.py](camera/Configuration.py)


The camera module is built to run on any linux distrobution that have systemd installed and configured. It is tested to run on a Raspberry Pi 4 or Jetson nano. Other Hardware could work aslong it has a usb possibilities. 
It is also possible to run this on your laptop / desktop aslong it has a camera attached to it. 


To configure the camera module, a few settings has to be configured.

```Python
    webhookUrl = "http://localhost:3000"
    farmbot_id = "0"
```
This is information is needed to sends the image to the api. Farmbot_id is the Id from the web application so the api knows to which farmbot to send a request. The webhookurl is the address of the api.

```Python
    mqtt_host = "****"
    mqtt_port = 11883
    mqtt_password = "****"
```
This is information is needed for the mqtt broker. So the api can communicate listen for request of the api and respond to it. 


```Python
    ssh_tunneling = True
    ssh_host = "*****"
    ssh_port = 0

    ssh_username = "****"
    ssh_password = "*****"
```

This is information is for the sshtunnel in case the api is not reachable from the internet. Set ssh_tunneling to true.

### Systemd service

In case you want to install the python script from the camera module as a service, you will have to follow the following instructions:

Service file:

`
$ sudo mv <path of project>/farmbot_camera_service.service /etc/systemd/system/
$ sudo chown root:root /etc/systemd/system/farmbot_camera_service.service
$ sudo chmod 644 /etc/systemd/system/farmbot_camera_service.service
`

Project files:

`
$ sudo mkdir /usr/local/lib/camera_service
$ sudo mv ~/path/to/your/python_demo_service.py <path of project>
$ sudo chown <root_user>:<root_user>  /usr/local/lib/camera_service/main.py
$ sudo chmod 644 /usr/local/lib/camera_service/main.py
`

Start service and enable:

`
$ sudo systemctl enable farmbot_camera_service
$ sudo systemctl start farmbot_camera_service
`

### Sensor Module
This configuration data can be found in [main.cpp](wemos_farmbot/Farmbot_wemos/src/main.cpp)
```CPP
char *dev_id = "****";
char *pwd = "****";
```
The dev_id and password are used to connect the WEMOS to the internet

```CPP
char *mqttAdress = "****";
char *mqttUserName = "*****";
char *mqttPassword = "*****";
```
This information is used for the MQTT data transition. A server is hosted on the broker, where the data is being send to from the sensor This data will then be accessible on a specific topic. For more information about MQTT, check out [MQTT.org](https://mqtt.org/) 

```CPP
char *farmbot_id = "device_0";
char *receiveTopic = "sensor/device_0/controls";
char *sendTopic = "sensor/device_0/measurement";
```
These are the topics that the data is being send and listened to. The Farmbot_id needs to correspond with the Farmbot id of where the rest API is connected to.

### Web application
This configuration data can be found in [endpoints.dart](ui/farmbot_ui/lib/values/endpoints.dart)
```dart
  static const String baseUrl = "http://127.0.0.1:3000";
  static const String baseUrlWithout = "127.0.0.1:3000";

  static const String dataSequence = baseUrl + "/datasequence";
  static const String waterSequence = baseUrl + "/watersequence";
  static const String getTypes = baseUrl + "/Plant/type";
  static const String getPlantByType = "/plant/plant_type";
  static const String getImage = baseUrl + "/image/";
```
The baseURL is used to connect to the server where the REST API is running on (in this case, it is port 3000 with the ipaddress of localhost, which is always 127.0.0.1)
The strings are based on the topics that the API is using (see [main.js](restAPI/main.js) and [plantEndpoint.js](restAPI/endpoints/plantEndpoint.js) for the topics and the corresponding functions). 
NOTE: this only needs to be changed when the endPoints in the REST API change.
