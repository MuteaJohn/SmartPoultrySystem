const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    temperature:Number,
    humidity:Number,
    waterLevel:Number,
    feedLevel:Number,
    timestamp:{type:Date,default:Date.now}

});

module.exports =mongoose.model('sensor',sensorSchema);