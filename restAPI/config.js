export default {
    user: {
        email: process.env.MFB_USER || "******",
        password: process.env.MFB_PASSWORD || "******",
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
        broker: process.env.BROKER_URL || "mqtt://*****",
        username: process.env.BROKER_USER || "****",
        password: process.env.BROKER_PASSWORD || "*****",
    },
};