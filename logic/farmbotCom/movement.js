global.atob     = require("atob");

let axios       = require("axios").default;
let config      = require('../../config.json');
let setup       = require('./setup');
let mqtt        = require('../../mqtt/mqttCamera')



function moveFarmbot(xAxis, yAxis, zAxis, speedPercentage = 100, photoSequence = false, last = true) {
 setup.getFarmbot().moveAbsolute({x: xAxis, y: yAxis, z: zAxis, speed: speedPercentage})
 .then(function(resp) {
    //  if (photoSequence)
    //  {
    //      wait(1000)
    //      takePhoto();
    //  }
     if (last)
     {
        setup.getFarmbot().moveAbsolute({x: 0, y: 0, z: 0, speed: 100})
     }
     return resp;
 }).catch(function(err)
 {
     return err;
 })
}

function giveWater(milliseconds)
{
    setup.getFarmbot().togglePin({pin_number: 8})
    .then(function(resp) {
        wait(milliseconds)
        setup.getFarmbot().togglePin({pin_number: 8})
        return resp;
    }).catch(function(err)
    {
        return err;
    })
}

function mountTool(toolName)
{ 
    var tool;
    setup.getPointsList().forEach(function(point) {
        if (point.pointer_type == "ToolSlot" && point.name == toolName) tool = point;
    })
    if (tool == null) return;
    moveFarmbot(tool.x, tool.y, 0)
    moveFarmbot(tool.x, tool.y, tool.z)
    moveFarmbot(tool.x + 150, tool.y, tool.z)
    moveFarmbot(tool.x + 150, tool.y, 0)
}

function unmountTool(toolName)
{    
    var tool;
    setup.getPointsList().forEach(function(point) {
        if (point.pointer_type == "ToolSlot" && point.name == toolName) tool = point;
    })
    if (tool == null) return;
    moveFarmbot(tool.x + 150, tool.y, 0)
    moveFarmbot(tool.x + 150, tool.y, tool.z)
    moveFarmbot(tool.x, tool.y, tool.z)
    moveFarmbot(tool.x, tool.y, 0)
}

function wait(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}

function takePhoto(result) {
    mqtt.publishEvent();
    console.log(`Making a photo...`);
}
module.exports = {
    moveFarmbot,
    takePhoto,
    giveWater,
    mountTool,
    unmountTool,
    wait
}