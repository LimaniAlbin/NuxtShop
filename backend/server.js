const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const connectDB = require("./config/db");

const productRoutes = require('./routes/ProductRoutes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(express.json())
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// routes
app.use('/api/', productRoutes);

connectDB()
    .then(() => {
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    })

