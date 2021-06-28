export default {
    user: {
        email: process.env.MFB_USER || "t.vandervelden5@student.avans.nl",
        password: process.env.MFB_PASSWORD || "Farmbot1!"
    },
    http: {
        port: process.env.PORT || 3000,
    },
    api: {
        URL: process.env.API_URL || "https://my.farmbot.io/api",
    },
    database: {
        address: process.env.DB_URL || "mongodb://127.0.0.1:27017/farmbot",
        username: process.env.DB_USER || "****",
        password: process.env.DB_PASSWORD || "****"
    },
    mqttCamera: {
        broker: process.env.BROKER_URL || "mqtt://sendlab.nl:11883",
        username: process.env.BROKER_USER || "farmbot_api",
        password: process.env.BROKER_PASSWORD || "F@rmB0t!@API",
    },
};