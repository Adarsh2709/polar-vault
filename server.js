import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import dbConnect from "./Database/db.js";
import Survey from "./Database/survey.js";

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dbConnect();
const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// // Serve static files from the current directory
// app.use(express.static(__dirname));

// // JSON file-based storage for better deployment compatibility
// const DATA_FILE = path.join(__dirname, 'survey_data.json');

// // Initialize data file
// async function initializeDataFile() {
//   try {
//     await fs.access(DATA_FILE);
//     console.log('Survey data file exists');
//   } catch (error) {
//     // File doesn't exist, create it with empty array
//     await fs.writeFile(DATA_FILE, JSON.stringify([], null, 2));
//     console.log('Created new survey data file');
//   }
// }

// // Read data from JSON file
// async function readData() {
//   try {
//     const data = await fs.readFile(DATA_FILE, 'utf8');
//     return JSON.parse(data);
//   } catch (error) {
//     console.error('Error reading data file:', error);
//     return [];
//   }
// }

// // Write data to JSON file
// async function writeData(data) {
//   try {
//     await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
//     return true;
//   } catch (error) {
//     console.error('Error writing data file:', error);
//     return false;
//   }
// }

// // Initialize the data file on startup
// initializeDataFile();

// API Routes
app.get('/', (req, res) => {
  res.render('index');
});
// Submit survey form
// app.post('/api/survey', async (req, res) => {
//   const { name, phone, use_case, capacity, email, feedback } = req.body;
  
//   // Basic validation
//   if (!name || !phone || !use_case || !capacity) {
//     return res.status(400).json({ 
//       error: 'Missing required fields: name, phone, use_case, capacity' 
//     });
//   }

//   try {
//     const data = await readData();
//     const newId = data.length > 0 ? Math.max(...data.map(item => item.id)) + 1 : 1;
    
//     const newSubmission = {
//       id: newId,
//       name,
//       phone,
//       use_case,
//       capacity,
//       email: email || null,
//       feedback: feedback || null,
//       submitted_at: new Date().toISOString()
//     };
    
//     data.push(newSubmission);
//     const success = await writeData(data);
    
//     if (!success) {
//       return res.status(500).json({ error: 'Failed to save submission' });
//     }
    
//     console.log(`New survey submission saved with ID: ${newId}`);
//     res.json({ 
//       success: true, 
//       message: 'Survey submitted successfully',
//       id: newId 
//     });
//   } catch (error) {
//     console.error('Error processing submission:', error);
//     res.status(500).json({ error: 'Failed to save submission' });
//   }
// });

// // Get all survey submissions (for admin purposes)
// app.get('/api/survey', async (req, res) => {
//   try {
//     const data = await readData();
//     // Sort by submitted_at in descending order (newest first)
//     const sortedData = data.sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at));
//     res.json(sortedData);
//   } catch (error) {
//     console.error('Error fetching submissions:', error);
//     res.status(500).json({ error: 'Failed to fetch submissions' });
//   }
// });

// // Get survey submission by ID
// app.get('/api/survey/:id', async (req, res) => {
//   const { id } = req.params;
  
//   try {
//     const data = await readData();
//     const submission = data.find(item => item.id === parseInt(id));
    
//     if (!submission) {
//       return res.status(404).json({ error: 'Submission not found' });
//     }
    
//     res.json(submission);
//   } catch (error) {
//     console.error('Error fetching submission:', error);
//     res.status(500).json({ error: 'Failed to fetch submission' });
//   }
// });

// // Get survey statistics
// app.get('/api/survey/stats', async (req, res) => {
//   try {
//     const data = await readData();
    
//     const stats = {
//       total_submissions: data.length,
//       picnic_count: data.filter(item => item.use_case === 'picnic').length,
//       commute_count: data.filter(item => item.use_case === 'commute').length,
//       trek_count: data.filter(item => item.use_case === 'trek').length,
//       capacity_1l: data.filter(item => item.capacity === '1l').length,
//       capacity_2l: data.filter(item => item.capacity === '2l').length,
//       capacity_3l: data.filter(item => item.capacity === '3l').length
//     };
    
//     res.json(stats);
//   } catch (error) {
//     console.error('Error fetching statistics:', error);
//     res.status(500).json({ error: 'Failed to fetch statistics' });
//   }
// });

// // Serve the main HTML file
// // app.get('/', (req, res) => {
// //   res.sendFile(path.join(__dirname, 'index.html'));
// // });

// // app.get('/', (req, res) => {
// //   res.sendFile("D:\Dabba\index.html");
// // });

app.post('/api/survey', async (req, res) => {
  const { name, phone, use_case, capacity, email, feedback } = req.body;
  const newSurvey = new Survey({ name, phone, use_case, capacity, email, feedback });
  await newSurvey.save();
  res.json({ message: 'Survey submitted successfully' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Survey API available at http://localhost:${PORT}/api/survey`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  console.log('Server closed.');
  process.exit(0);
});
