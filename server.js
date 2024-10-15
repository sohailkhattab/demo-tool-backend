require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const connString = "mongodb+srv://sohail:TrZn33dRUiOT3u0b@demotoolbuilder.u6lgndo.mongodb.net/?retryWrites=true&w=majority&appName=DemoToolBuilder";
mongoose.connect(connString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const db = mongoose.connection; // Get the connection instance
db.on('error', console.error.bind(console, 'connection error:')); // Log connection errors to the console
db.once('open', () => {
  console.log('Connected to MongoDB Atlas'); // Log a message when connected to MongoDB Atlas
});

const exportRoutes = require('./routes/export');
const imageRoutes = require('./routes/imageRoutes');
const giftRoutes = require('./routes/giftRoutes'); // Import gift routes

app.use('/api', exportRoutes); // Use the export routes for paths starting with /api
app.use('/api', imageRoutes);
app.use('/api', giftRoutes); // Use gift routes

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
