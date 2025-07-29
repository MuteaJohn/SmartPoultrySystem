const express = require('express');
const cors = require('cors');
const dotenv = require ('dotenv');
const connectDB = require('./config/db');
const sensorRoutes = require('./routes/sensorRoutes');
const alertRoutes = require('./routes/alertRoutes');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/sensor',sensorRoutes);
app.use('/api/alert',alertRoutes);
app.use('/api/user',userRoutes);

const PORT = process.env.PORT;
app.listen(PORT,() => console.log(`server running on port ${PORT}`));

