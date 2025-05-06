// electron/preload.js
import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods for IPC communication
contextBridge.exposeInMainWorld('electronAPI', {
  startTask: () => ipcRenderer.send('task:start'),
  stopTask: () => ipcRenderer.send('task:stop'),
  onScreenshot: (callback) => {
    ipcRenderer.on('screenshot:captured', (event, data) => callback(data));
  },
});

// Log that preload script has been executed
console.log('Preload script executed');
