// screenshot-server.js
import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3030;
const screenshotsFolder = path.join(os.homedir(), 'Desktop', 'BugAppScreenshots');

// Store screenshots in memory with base64 data
let latestScreenshot = {
  data: null,
  timestamp: null,
  filename: null
};

// Enable CORS and JSON parsing
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Ensure screenshots folder exists
async function ensureScreenshotsFolder() {
  try {
    await fs.mkdir(screenshotsFolder, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      console.error('Error creating screenshots folder:', error);
      throw error;
    }
  }
}

// Endpoint to store base64 screenshot
app.post('/save-screenshot', async (req, res) => {
  try {
    const { base64Image } = req.body;
    
    if (!base64Image) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    // Generate filename with timestamp
    const timestamp = Date.now();
    const filename = `screenshot_${timestamp}.png`;
    const filePath = path.join(screenshotsFolder, filename);
    
    // Extract base64 data (remove data URL prefix if present)
    const base64Data = base64Image.includes('base64,') 
      ? base64Image.split('base64,')[1] 
      : base64Image;

    try {
      // Ensure screenshots folder exists
      await ensureScreenshotsFolder();
      
      // Save to file
      await fs.writeFile(filePath, base64Data, 'base64');
      
      // Store in memory
      latestScreenshot = {
        data: base64Image,
        timestamp: new Date().toISOString(),
        filename: filename
      };

      res.json({ 
        success: true,
        message: 'Screenshot saved successfully',
        timestamp: latestScreenshot.timestamp,
        filename: filename,
        filePath: filePath
      });
    } catch (fileError) {
      console.error('Error saving screenshot to file:', fileError);
      // Still store in memory even if file save fails
      latestScreenshot = {
        data: base64Image,
        timestamp: new Date().toISOString(),
        filename: null
      };
      
      res.status(207).json({ 
        success: true,
        message: 'Screenshot saved to memory but file save failed',
        error: fileError.message,
        timestamp: latestScreenshot.timestamp
      });
    }
  } catch (error) {
    console.error('Error processing screenshot:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to process screenshot',
      details: error.message 
    });
  }
});

// Endpoint to get the latest screenshot
app.get("/latest-screenshot", (req, res) => {
  try {
    if (!latestScreenshot.data) {
      return res.status(404).json({ 
        success: false,
        error: "No screenshots found in memory" 
      });
    }

    res.json({
      success: true,
      data: latestScreenshot.data,
      timestamp: latestScreenshot.timestamp,
      filename: latestScreenshot.filename,
      filePath: latestScreenshot.filename 
        ? path.join(screenshotsFolder, latestScreenshot.filename)
        : null
    });
  } catch (error) {
    console.error('Error getting latest screenshot:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to get latest screenshot',
      details: error.message 
    });
  }
});

// Serve static files from the screenshots folder
app.use('/screenshots', express.static(screenshotsFolder));

// Initialize server
async function startServer() {
  try {
    await ensureScreenshotsFolder();
    
    app.listen(port, () => {
      console.log(`Screenshot server running at http://localhost:${port}`);
      console.log('Screenshots will be saved to:', screenshotsFolder);
      console.log('\nAvailable endpoints:');
      console.log(`  POST http://localhost:${port}/save-screenshot`);
      console.log(`  GET  http://localhost:${port}/latest-screenshot`);
      console.log(`  GET  http://localhost:${port}/screenshots/{filename}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
