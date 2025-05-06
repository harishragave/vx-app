// electron/main.js
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import isDev from 'electron-is-dev';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  const devServerURL = 'http://localhost:8080';
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

app.whenReady().then(createWindow);

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

