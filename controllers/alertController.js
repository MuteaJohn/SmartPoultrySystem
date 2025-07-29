const alert = require('../models/alert');

exports.createAlert = async(req,res) =>{
    try{
        const alert = Alert(req.body);
        await alert.save();
        res.status(201).json(alert);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};
exports.getAlert = async(req,res) =>{
    try{
        const alert = await Alert.find();
        res.status(200).json(alert);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};
