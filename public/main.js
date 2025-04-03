const jsSpeccy = document.getElementById("jsspeccy");
const emu = JSSpeccy(jsSpeccy, {
  zoom: 2,
  sandbox: false,
  autoStart: true,
  uiEnabled: false,
});

emu.onReady(function () {
  console.log("initialized");
});

function reSizeWindow(zoom) {
  jsSpeccy.style.width = `${zoom * 320}px`;
  jsSpeccy.style.left = `calc(50vw - ${zoom * 160}px)`;
}

reSizeWindow(2);

window.electronAPI.onMessage((event, message) => {
  if (!message.menu) {
    return;
  }

  if (message.menu === "open") {
    emu.openUrl(message.filePath);
  }

  if (message.menu === "48k") {
    emu.setMachine(48);
  }

  if (message.menu === "128k") {
    emu.setMachine(128);
  }

  if (message.menu === "5") {
    emu.setMachine(5);
  }

  if (message.menu === "fullScreen") {
    emu.enterFullscreen();
  }

  if (message.menu === "zoom") {
    reSizeWindow(message.zoom);
    emu.setZoom(message.zoom);
  }
});
