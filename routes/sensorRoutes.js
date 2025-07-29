const express = require('express');
const router = express.Router();
const axios = require('axios');
const { addSensorData, getSensorData } = require('../controllers/sensorController');

router.post('/', async (req, res) => {
  const { temperature, humidity, water_Level, feed_Level } = req.body;

  try {
    const savedData = await addSensorData(req.body); 

    const response = await axios.post('http://localhost:5000/predict', {
      temperature,
      humidity,
      water_level,
      feed_level
    });

    const prediction = response.data.prediction;
    res.status(201).json({
      message: 'Sensor data saved and analyzed',
      data: savedData,
      prediction: prediction
    });

  } catch (error) {
    console.error('Error saving or predicting:', error.message);
    res.status(500).json({ error: 'Failed to save or analyze sensor data' });
  }
});

router.get('/', getSensorData);

module.exports = router;
