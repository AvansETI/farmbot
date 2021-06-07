export default {
  user: {
    email: "t.vandervelden5@student.avans.nl",
    password: "Farmbot1!",
    ip: "192.168.0.4",
  },
  http: {
    port: 3000,
  },
  api: {
    URL: "https://my.farmbot.io/api",
  },
  mqttServo: {
    broker: "mqtt://test.mosquitto.org",
    topic_log: "test_farmbot",
    topic_event: "test_farmbot_event",
  },
  mqttCamera: {
    broker: "mqtt://85.215.87.215",
    username: "farmbot",
    password: "Farmb0t_1!",
  },
};
