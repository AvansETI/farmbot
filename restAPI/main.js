const {createToken, generatePoints, connectFarmbot} = require('./logic/farmbotCom/setup')
const {moveFarmbot, takePhoto} = require('./logic/farmbotCom/movement')
const askParameters = require('./inputParameters')
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const { sequencePhoto, sequenceWater } = require('./logic/farmbotCom/sequences');
const config = require('./config.json');
const mqttCamera = require('./mqtt/mqttCamera')
const route = require('./api/route')

const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json({ type: 'application/json'}));
app.use(cors());

app.all('*', function(req, res, next) {
    console.log(`[${new Date().toISOString()}] [${req.method}] ${req.url} has been invoked!`)
});

app.get('/', express.static('public'));

app.use('/api/route', route);

app.listen(config.http.port, function() {
    console.log(`Server started at port: 8080 `)
});


async function main() {
    const inlog = await askParameters("E-mailaddress: ", false)
    const password = await askParameters("Password: ", true)

    await createToken(inlog, password) 

   while (true) {
        const subscribeTopic = await askParameters("Get data from topic: ", false)

        if (subscribeTopic == "move") {
            moveFarmbot(100, 100, 100, 100);
        }
        if (subscribeTopic == "exit") {
             break;
         }
        if (subscribeTopic == "connect") {
            connectFarmbot();
            generatePoints();
        }
        if (subscribeTopic == "sequence") {
            sequencePhoto();
        }
        if (subscribeTopic == "photo") {
            takePhoto();
        }
        if (subscribeTopic == "water") {
            sequenceWater();
        }
        
   }

}
main()