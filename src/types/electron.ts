
// This is a mock of Electron APIs for the web simulation

export interface ElectronAPI {
  // Process APIs
  quit: () => void;
  
  // System APIs
  getPath: (path: string) => string;
  
  // Screenshot APIs
  captureScreenshot: () => Promise<string>;
  
  // Activity monitoring APIs
  getKeyboardActivity: () => number;
  getMouseActivity: () => number;
  startActivityMonitoring: () => void;
  stopActivityMonitoring: () => void;
  
  // Storage APIs
  saveData: (key: string, data: unknown) => void;
  loadData: <T>(key: string) => T | null;
}

// Mock implementation of the Electron API
export const mockElectronAPI: ElectronAPI = {
  quit: () => console.log("Application quit requested"),
  
  getPath: (path: string) => {
    switch (path) {
      case "desktop":
        return "/Users/username/Desktop";
      case "documents":
        return "/Users/username/Documents";
      default:
        return "/";
    }
  },
  
  captureScreenshot: async () => {
    console.log("Screenshot captured");
    return "/lovable-uploads/ca32ae85-501a-4e6f-ad98-13b62093f6a6.png";
  },
  
  getKeyboardActivity: () => Math.floor(Math.random() * 100),
  
  getMouseActivity: () => Math.floor(Math.random() * 50),
  
  startActivityMonitoring: () => console.log("Activity monitoring started"),
  
  stopActivityMonitoring: () => console.log("Activity monitoring stopped"),
  
  saveData: (key: string, data: unknown) => {
    localStorage.setItem(key, JSON.stringify(data));
  },
  
  loadData: <T>(key: string): T | null => {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) as T : null;
  }
};

// Expose the API as if it were available through window.electron in a real Electron app
declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

// Initialize the mock API in the browser environment
if (typeof window !== "undefined") {
  window.electron = mockElectronAPI;
}
