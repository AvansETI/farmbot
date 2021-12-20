export default function log(event, data) {
    console.log(`[${new Date().toISOString()}] [${event}] ${data}`)
}