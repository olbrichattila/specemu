const { app, BrowserWindow, Menu, dialog } = require("electron");
const path = require("path");

let mainWindow;
let zoom = 2;
let menuTemplate = [
  {
    label: "File",
    submenu: [
      {
        label: "Open",
        accelerator: "CmdOrCtrl+O",
        click: () => openFileDialog(),
      },
      { type: "separator" },
      {
        label: "Exit",
        role: "quit",
      },
    ],
  },
  {
    label: "Zoom",
    submenu: [
      {
        label: "Zoom +",
        click: () => zoomIn(),
      },
      {
        label: "Zoom -",
        click: () => zoomOut(),
      },
      { type: "separator" },
      {
        label: "Zoom",
        submenu: [
          {
            label: "Zoom 1x",
            click: () => zoomX(1),
          },
          {
            label: "Zoom 2x",
            click: () => zoomX(2),
          },
          {
            label: "Zoom 3x",
            click: () => zoomX(3),
          },
          {
            label: "Zoom 4x",
            click: () => zoomX(4),
          },
          {
            label: "Full screen",
            click: () =>
              mainWindow.webContents.send("main-menu", { menu: "fullScreen" }),
          },
        ],
      },
    ],
  },
  {
    label: "Set machine",
    submenu: [
      {
        label: "48K Spectrum",
        click: () => mainWindow.webContents.send("main-menu", { menu: "48k" }),
      },
      {
        label: "128K Spectrum",
        click: () => mainWindow.webContents.send("main-menu", { menu: "128k" }),
      },
      {
        label: "Pentagon 128",
        click: () => mainWindow.webContents.send("main-menu", { menu: "5" }),
      },
    ],
  },
];

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../public/index.html"));

  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);

  // Open the DevTools in development mode
  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

function zoomIn() {
  zoom++;
  setMenuEnabledDisabledState();
  mainWindow.webContents.send("main-menu", { menu: "zoom", zoom });
}

function zoomOut() {
  zoom--;
  setMenuEnabledDisabledState();
  mainWindow.webContents.send("main-menu", { menu: "zoom", zoom });
}

function zoomX(zoomValue) {
  zoom = zoomValue;
  setMenuEnabledDisabledState();
  mainWindow.webContents.send("main-menu", { menu: "zoom", zoom });
}

function setMenuEnabledDisabledState() {
  menuTemplate[1].submenu[0].enabled = true;
  menuTemplate[1].submenu[1].enabled = true;

  if (zoom >= 4) {
    menuTemplate[1].submenu[0].enabled = false;
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
  }

  if (zoom <= 1) {
    menuTemplate[1].submenu[1].enabled = false;
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
  }
}

async function openFileDialog() {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    title: "Select a file",
    buttonLabel: "Open",
    filters: [
      { name: "All Files", extensions: ["*"] },
      { name: "Spectrum files", extensions: ["tap", "tzx"] },
    ],
  });

  if (!result.canceled && result.filePaths.length > 0) {
    const params = {
      menu: "open",
      filePath: result.filePaths[0],
    };
    mainWindow.webContents.send("main-menu", params);
  }
}
