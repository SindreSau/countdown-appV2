const { app, BrowserWindow } = require('electron');
const path = require('path');
if (require('electron-squirrel-startup')) app.quit();

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 350,
    height: 700,
    resizable: false,
    fullscreen: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false
    }
  })
  mainWindow.setMenu(null);
  mainWindow.loadFile('www/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {

    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})