import threading
import uuid
import json

import paho.mqtt.client as mqtt

class MqttManager:

    def __init__(self, camera, config, imageHandler):
        self.config = config
        self.camera = camera
        self.imageHandler = imageHandler

        self.client = mqtt.Client()
        self._connect()

    def _connect(self):
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message

        self.client.username_pw_set(self.config.mqtt_username, self.config.mqtt_password)
        self.client.connect(host=self.config.mqtt_host, port=self.config.mqtt_port)
        self.client.loop_forever()

    def on_connect(self, client, userdata, flags, rc):
        if rc == 0:
            print("Connection complete")
            self.client.subscribe(f"sensor/{self.config.farmbot_id}/camera")
        else:
            print('Error code: ' + str(rc))

    def on_message(self, client, userdata, msg):
        success, image = self.camera.take_picture()
        random_id = str(uuid.uuid4())

        if success is True:
            mqtt_message = {
                "status": "success",
                "messageId": random_id,
            }
        else:
            mqtt_message = {
                "status": "failed",
                "error": "Camera error"
            }

        client.publish(f"sensor/{self.config.farmbot_id}/logs", json.dumps(mqtt_message))

        if success is True:
            self.imageHandler.addImage((random_id, image))

        # threading.Thread(target=handle_image, args=(client, self.camera, self.config)).start()
