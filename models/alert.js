const mongoose = require ('mongoose');

const alertSchema = new mongoose.Schema({
    message:String,
    created:{type:Date,default:Date.now}
});

module.exports = mongoose.model('alert',alertSchema);
