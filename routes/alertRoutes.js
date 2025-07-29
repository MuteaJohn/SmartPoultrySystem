const express = require('express');
const{createAlert,getAlert} = require('../controllers/alertController');
const auth = require('../middleware/authMiddleware');
const { addSensorData } = require('../controllers/sensorController');
const router = express.Router();

router.post('/',auth,createAlert);
router.get('/',auth,getAlert);

module.exports = router;