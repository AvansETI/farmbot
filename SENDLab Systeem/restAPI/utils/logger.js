export default function log(source, event, data) {
    console.log(`[${new Date().toISOString()}] [${source}] [${event}] ${data}`)
}