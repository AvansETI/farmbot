const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlantsLogSchema = new Schema({
    topic: {
        type: String,
        minlength: [ 3, 'topic contains at least 3 characters'],
        maxlength: [ 20, 'topic contains at maximum 20 characters'],
        required: true
    },
    coordinates: {
        type: String,
        minlength: [ 3, 'thing contains at least 3 characters'],
        maxlength: [ 20, 'thing contains at maximum 20 characters'],
        required: true
    },
    looptiming: {
        type: Number,
        required: true
    }
});

const PlantsLog = mongoose.model('PlantsLog', PlantsLogSchema);
module.exports = PlantsLog;