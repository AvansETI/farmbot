const express 		= require('express');
const router  		= express.Router();
const mqtt    		= require('mqtt');

const config  		= require('../config.json');

const mqttClient 	= mqtt.connect(config.mqtt.broker);

var Module = module.exports;
Module.publishEvent = publishEvent;

mqttClient.on('connect', () => {
	console.log('Connected to MQTT!');

	mqttClient.subscribe("plantslog", function (err) {
		if (err) {
		  console.log("MQTT Error: " + err.message);
		}
	});

	mqttClient.subscribe("plantsscheme", function (err) {
		if (err) {
			console.log("MQTT Error: " + err.message);
		}
	});
});

mqttClient.on('message', function (topic, message) {
	message = JSON.parse(message.toString());
	topic   = topic.toString();

	if ( topic == "" && message.looptiming ) {
    }

	if ( topic == "" && message.state ) {
    }
});

function publishEvent(event) {
    mqttClient.publish("", JSON.stringify({event: event}))
};