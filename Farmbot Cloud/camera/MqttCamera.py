from concurrent.futures import TimeoutError
from google.cloud import pubsub_v1
import MqttCameraUtils
import uuid
import json

class MqttCamera:
    def __init__(self, camera, config, imageHandler):
        self.config = config
        self.camera = camera
        self.imageHandler = imageHandler

        self._connect()
        self._start()

    def on_message(self, message: pubsub_v1.subscriber.message.Message) -> None:
        print(f"Received {message}.")

        success, image = self.camera.take_picture()
        random_id = str(uuid.uuid4())
        if success is True:
            mqtt_message = {
                "topic": "logs",
                "status": "success",
                "messageId": random_id,
            }
        else:
            mqtt_message = {
                "topic": "logs",
                "status": "failed",
                "error": "Camera error"
            }

        self.publisher.publish(self.topic_path_logs, json.dumps(mqtt_message).encode("utf-8"))
        print("Published message.")
        message.ack()    

        if(success):
           self.imageHandler.addImage((random_id, image))
    
    def _connect(self):
        self.publisher = pubsub_v1.PublisherClient()
        self.subscriber = pubsub_v1.SubscriberClient()

        MqttCameraUtils.createTopics(self.publisher, self.subscriber)

        self.topic_path_logs = self.publisher.topic_path(MqttCameraUtils.project_id, MqttCameraUtils.subscription_id_logs)
        self.subscription_path_logs = self.subscriber.subscription_path(MqttCameraUtils.project_id, MqttCameraUtils.subscription_id_logs)

        self.topic_path_camera = self.publisher.topic_path(MqttCameraUtils.project_id, MqttCameraUtils.subscription_id_camera)
        self.subscription_path_camera = self.subscriber.subscription_path(MqttCameraUtils.project_id, MqttCameraUtils.subscription_id_camera)

        self.streaming_pull_future = self.subscriber.subscribe(self.subscription_path_camera, callback=self.on_message)

    def _start(self):
        # Wrap subscriber in a 'with' block to automatically call close() when done.
        # Wrap subscriber in a 'with' block to automatically call close() when done.
        with self.subscriber:
            try:
                # When `timeout` is not set, result() will block indefinitely,
                # unless an exception is encountered first.
                self.streaming_pull_future.result()
            except TimeoutError:
                self.streaming_pull_future.cancel()  # Trigger the shutdown.
                self.streaming_pull_future.result()  # Block until the shutdown is complete.

    