const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const { errorHandler } = require('./middlewares/errorHandler');
const authRoutes = require('./routes/authRoutes');
const movieRoutes = require('./routes/movieRoutes');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow these headers
}));


app.use(express.json());
app.use('/uploads', express.static('uploads'));

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


// file:///C:/Users/ayush/movie-database-backend/uploads/1722442200324.png