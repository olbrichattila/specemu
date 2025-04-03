const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  onMessage: (callback) => ipcRenderer.on("main-menu", callback),
});
