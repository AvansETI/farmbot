const express 		= require('express');
const router  		= express.Router();
const mqtt    		= require('mqtt');

const config  		= require('../config.json');

const mqttClient 	= mqtt.connect(config.mqttCamera.broker, {
        username: config.mqttCamera.username,
        password: config.mqttCamera.password })

var Module = module.exports;
Module.publishEvent = publishEvent;

mqttClient.on('connect', () => {
	console.log('Connected to MQTT!');

	mqttClient.subscribe("farmbot/0/logs", function (err) {
		if (err) {
		  console.log("MQTT Error: " + err.message);
		}
	});
});

mqttClient.on('message', function (topic, message) {
	message = JSON.parse(message.toString());
	topic   = topic.toString();
    console.log(message)
    
	if ( topic == "") {
    }
});


function publishEvent(event) {
    mqttClient.publish("farmbot/0/camera", "")
};