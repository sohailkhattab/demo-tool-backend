require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

// console
const connString = "mongodb+srv://sohail:@demotoolbuilder.u6lgndo.mongodb.net/?retryWrites=true&w=majority&appName=DemoToolBuilder";
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
const giftRoutes = require('./routes/giftRoutes');
const customComponentRoutes = require('./routes/customComponentRoutes');
const { catchAsyncError } = require('./Utilites/catchAsyncError');

app.use('/api', exportRoutes); // Use the export routes for paths starting with /api
app.use('/api', imageRoutes);
app.use('/api', giftRoutes);
app.use('/api', customComponentRoutes);

// New route to run PowerShell script
app.get('/api/run-script/:type/:name', catchAsyncError(async (req, res, next) => {
  const { type, name } = req.params; // Extract the parameters from the URL

  console.log("Executing PowerShell Script with params:", type, name);
  // Define the PowerShell command with the parameters testbackend ttteeessstt "glpat-x1pSzsx38P2Z_-MnvLh2"
  const powershellCommand = `powershell -ExecutionPolicy Bypass -File "D:/testbackend.ps1" -type ${type} -name ${name}`;

  // Execute the PowerShell script
  exec(powershellCommand, (error, stdout, stderr) => {
      // Filter out unwanted stderr messages
      const filteredStderr = stderr.split('\n').filter(line => 
          !line.includes("Switched to a new branch") && 
          !line.includes("Authorized uses only.") &&
          !line.includes("remote:")
      ).join('/n');

      if (error) {
          console.error(`Error executing script: ${error.message}`);
          return res.status(500).json({ error: 'Error executing PowerShell script' });
      }

      if (filteredStderr) {
          console.error(`PowerShell Error: ${filteredStderr}`);
          // Instead of sending the filtered stderr back, you can choose to just log it
          // and still send a success message
      }

      console.log(`PowerShell Output: ${stdout}`);
      
      // Send a success response after the script completes successfully
      res.json({ message: 'Script executed successfully', output: stdout });
  });
}));


// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use((err , req , res , next)  => {
  err.statusCode = err?.statusCode || 500
  err.status = err?.status || 'faild'
  console.log(err.stack)

  res.status(err.statusCode).json({
    message : err?.message,
    status : err?.status
  })
})

process.on('unhandledRejection' , (err) => {
  console.log(err , err.message)
  process.exit(1)
})
