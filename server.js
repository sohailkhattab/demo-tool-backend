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

// const connString = 
// mongoose.connect(connString, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });


// const db = mongoose.connection; // Get the connection instance
// db.on('error', console.error.bind(console, 'connection error:')); // Log connection errors to the console
// db.once('open', () => {
//   console.log('Connected to MongoDB Atlas'); // Log a message when connected to MongoDB Atlas
// });

const exportRoutes = require('./routes/export');
const imageRoutes = require('./routes/imageRoutes');
const giftRoutes = require('./routes/giftRoutes'); // Import gift routes
const { catchAsyncError } = require('./Utilites/catchAsyncError');

app.use('/api', exportRoutes); // Use the export routes for paths starting with /api
app.use('/api', imageRoutes);
app.use('/api', giftRoutes); // Use gift routes

// New route to run PowerShell script
// app.get('/api/run-script/:type/:name', catchAsyncError(async (req, res, next) => {
//   const { type, name } = req.params; // Extract the parameters from the URL

//   console.log("Executing PowerShell Script with params:", type, name);
//   // Define the PowerShell command with the parameters
//   const powershellCommand = `powershell -ExecutionPolicy Bypass -File "D:/testbackend.ps1" -type ${type} -name ${name}`;

//   // Execute the PowerShell script
//   exec(powershellCommand, (error, stdout, stderr) => {
//       if (error) {
//           console.error(`Error executing script: ${error.message}`);
//           return res.status(500).json({ error: 'Error executing PowerShell script' });
//       }

//       if (stderr) {
//           console.error(`PowerShell Error: ${stderr}`);
//           return res.status(500).json({ error: stderr });
//       }

//       console.log(`PowerShell Output: ${stdout}`);
      
//       // Send a success response after the script completes successfully
//       res.json({ message: 'Script executed successfully', output: stdout });
//   });
// }));

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

// const { spawn } = require('child_process');

// app.get('/api/run-script/:type/:name', catchAsyncError(async (req, res, next) => {
//   const { type, name } = req.params;

//   console.log("Executing PowerShell Script with params:", type, name);

//   const powershellProcess = spawn('powershell', [
//     '-ExecutionPolicy', 'Bypass',
//     '-File', 'D:/testbackend.ps1',
//     '-type', type,
//     '-name', name
//   ]);

//   let output = '';
//   let isResponseSent = false; // Flag to prevent multiple responses

//   // Capture stdout
//   powershellProcess.stdout.on('data', (data) => {
//     output += data.toString();
//   });

//   // Capture stderr
//   powershellProcess.stderr.on('data', (data) => {
//     console.error(`PowerShell Error: ${data}`);
//     if (!isResponseSent) {
//       isResponseSent = true; // Mark response as sent
//       return res.status(500).json({ error: data.toString() });
//     }
//   });

//   // Handle process exit
//   powershellProcess.on('exit', (code) => {
//     if (code === 0) {
//       console.log(`PowerShell Output: ${output}`);
//       if (!isResponseSent) { // Send response only if not sent already
//         isResponseSent = true;
//         res.json({ message: 'Script executed successfully', output });
//       }
//     } else {
//       console.error(`PowerShell Process exited with code: ${code}`);
//       if (!isResponseSent) { // Send response only if not sent already
//         isResponseSent = true;
//         res.status(500).json({ error: `Process exited with code: ${code}` });
//       }
//     }
//   });
// }));


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