export default class Logger {
    log(event, data) {
        console.log(`[${new Date().toISOString()}] [${event}] ${data}`)
    }
}