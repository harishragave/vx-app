// electron/main.js
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import { fileURLToPath } from 'url';
import screenshot from 'screenshot-desktop';
import axios from 'axios';
import fs from 'fs';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 350,
    height: 650,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const devServerURL = 'http://localhost:3000';
  const entryPath = path.join(__dirname, '../dist/index.html');
  
  if (isDev) {
    // In development, load from the Vite dev server
    win.loadURL(devServerURL).catch(err => {
      console.error('Failed to load dev server:', err);
    });
    
    // Open dev tools in development
    win.webContents.openDevTools();
  } else {
    // In production, load the built files
    win.loadFile(entryPath).catch(err => {
      console.error('Failed to load production build:', err);
    });
  }
}

function startScreenshotLoop() {
  const screenshotsFolder = path.join(os.homedir(), 'Desktop', 'BugAppScreenshots');

  if (!fs.existsSync(screenshotsFolder)) {
    fs.mkdirSync(screenshotsFolder);
  }

  const takeScreenshot = async () => {
    const filename = `screenshot_${Date.now()}.png`;
    const filepath = path.join(screenshotsFolder, filename);

    try {
      const img = await screenshot({ format: 'png' });

      // Save locally
      fs.writeFileSync(filepath, img);

      // Send to local server as base64
      const base64Image = `data:image/png;base64,${img.toString('base64')}`;

      await axios.post('http://localhost:3030/save-screenshot', {
        base64Image,
        filename,
      });

      console.log('Screenshot captured and saved:', filename);
    } catch (err) {
      console.error('Screenshot failed:', err);
    }
  };

  const scheduleNext = () => {
    const randomDelay = Math.floor(Math.random() * 10 * 60 * 1000); // up to 10 minutes
    console.log(`Next screenshot in ${Math.floor(randomDelay / 1000)} seconds`);
    setTimeout(async () => {
      await takeScreenshot();
      setTimeout(scheduleNext, 10 * 60 * 1000); // wait full 10 minutes before scheduling next
    }, randomDelay);
  };

  scheduleNext();
}

app.whenReady().then(() => {
  createWindow();
  startScreenshotLoop();
});

// IPC handlers
ipcMain.on('task:start', () => {
  console.log('Task started');
  // Add your task start logic here
});

ipcMain.on('task:stop', () => {
  console.log('Task stopped');
  // Add your task stop logic here
});

// Handle screenshot capture
ipcMain.on('screenshot:captured', (event, data) => {
  console.log('Screenshot captured', data);
  // Handle the screenshot data here
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

