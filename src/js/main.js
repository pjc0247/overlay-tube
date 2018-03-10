const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const url = require('url');
const fs = require('fs');

let mainWindow;

let configPath = path.join(app.getPath('userData'), 'data.json'); 
let config;

function loadConfig() {
  if (!fs.existsSync(configPath)) {
    config = {
      width: 560, height: 315
    };
  }
  else 
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
}
function getConfig(name, defaultValue) {
  if (name in config)
    return config[name];
  return defaultValue;
}

function createWindow () {
  loadConfig();

  const {width, height} = electron.screen.getPrimaryDisplay().workAreaSize;
  let windowWidth = getConfig("width", 560);
  let windowHeight = getConfig("height", 315);
  mainWindow = new BrowserWindow({
    x: getConfig("x", width - windowWidth),
    y: getConfig("y", height - windowHeight),
    width: windowWidth, height: windowHeight,
    
    transparent: true,
    alwaysOnTop: true,
    frame: false})

  mainWindow.webContents.openDevTools();
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }))

  mainWindow.on('close', function() {
    config.x = mainWindow.getPosition()[0];
    config.y = mainWindow.getPosition()[1];
    config.width = mainWindow.getSize()[0];
    config.height = mainWindow.getSize()[1];
    
    fs.writeFileSync(configPath, JSON.stringify(config));
  });
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

process.on('uncaughtException', function (err) {
  console.log(err);
})
