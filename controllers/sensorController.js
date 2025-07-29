const sensor = require('../models/sensor');

const getSensorData = async (req, res) => {
  try {
    const data = await sensor.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching data', error });
  }
};

const addSensorData = async (req, res) => {
  try {
    const { temperature, humidity } = req.body;

    if (!temperature || !humidity) {
      return res.status(400).json({ message: 'Missing fields' });
    }

    const newSensor = new sensor({ temperature, humidity });
    await newSensor.save();

    res.status(201).json(newSensor);
  } catch (error) {
    res.status(500).json({ message: 'Error creating data', error });
  }
};

module.exports = {
  addSensorData,
  getSensorData,
};
