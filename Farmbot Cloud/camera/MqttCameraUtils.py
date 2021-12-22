project_id = "farmbot-avans-cloud"
project_path = f"projects/{project_id}"

subscription_id_camera = "sensor-device_10816-camera"
subscription_id_logs = "sensor-device_10816-logs"
subscription_id_measurements = "sensor-device_10816-measurement"


def checkTopicsExists(publisher):
    topics_exist = False
    for topic in publisher.list_topics(request={"project": project_path}):
        # if topic name ends with name
        if topic.name.endswith(subscription_id_camera):
            print(f"Found topic {topic.name}")
            topics_exist = True
            break
    return topics_exist

def createTopics(publisher, subscriber):
    if not checkTopicsExists(publisher):
        topic_path_logs = publisher.topic_path(project_id, subscription_id_logs)
        subscription_path_logs = subscriber.subscription_path(project_id, subscription_id_logs)

        topic_path_camera = publisher.topic_path(project_id, subscription_id_camera)
        subscription_path_camera = subscriber.subscription_path(project_id, subscription_id_camera)

        topic_path_measurement = publisher.topic_path(project_id, subscription_id_measurements)
        subscription_path_measurement = subscriber.subscription_path(project_id, subscription_id_measurements)

        topic_logs = publisher.create_topic(request={"name": topic_path_logs})
        topic_camera = publisher.create_topic(request={"name": topic_path_camera})
        topic_measurement = publisher.create_topic(request={"name": topic_path_measurement})

        print(f"Created topic: {topic_logs.name}")
        print(f"Created topic: {topic_camera.name}")
        print(f"Created topic: {topic_measurement.name}")

        with subscriber:
            subscription_logs = subscriber.create_subscription(
                request={"name": subscription_path_logs, "topic": topic_path_logs}
            )
            subscription_camera = subscriber.create_subscription(
                request={"name": subscription_path_camera, "topic": topic_path_camera}
            )
            subscription_measurement = subscriber.create_subscription(
                request={"name": subscription_path_measurement, "topic": topic_path_measurement}
            )

        print(f"Subscription created: {subscription_logs}")
        print(f"Subscription created: {subscription_camera}")
        print(f"Subscription created: {subscription_measurement}")