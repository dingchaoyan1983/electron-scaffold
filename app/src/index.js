const electron = require('electron');
const path = require('path');
const log = require('electron-log');
const { autoUpdater } = require('electron-updater');
const electronWindow = require('electron-window');

// log.transports.file.file = __dirname + '/log.txt';
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

const { app, Menu, shell, globalShortcut, ipcMain } = electron;
const debug = process.env.NODE_ENV === 'development';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

function createWindow() {
  globalShortcut.register('CommandOrControl+Alt+I', () => mainWindow.webContents.openDevTools());
  const { width, height } = electron.screen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  mainWindow = electronWindow.createWindow({
    show: true,
    width: 1000,
    height: 400,
    title: 'Betalpha BAR',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegrationInWorker: true,
    }
  });

  if (debug) {
    mainWindow.showUrl('http://localhost:1212/renderer'); 
  } else {
    mainWindow.showUrl(path.resolve(__dirname, '..', 'renderer', 'index.html'));    
  }

  mainWindow.maximize();

  // Open the DevTools.
  // Launch fullscreen with DevTools open, usage: npm run debug
  if (debug) {
    mainWindow.webContents.openDevTools();
    // eslint-disable-next-line global-require
    require('devtron').install();
  }  // Emitted when the window is closed.
  mainWindow.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);
// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

app.on('will-quit', () => globalShortcut.unregisterAll());

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    // Verification logic.
    event.preventDefault();
    callback(true);
});

//-------------------------------------------------------------------
// Auto updates
//
// For details about these events, see the Wiki:
// https://github.com/electron-userland/electron-builder/wiki/Auto-Update#events
//
// The app doesn't need to listen to any events except `update-downloaded`
//
// Uncomment any of the below events to listen for them.  Also,
// look in the previous section to see them being used.
//-------------------------------------------------------------------
// autoUpdater.on('checking-for-update', () => {
// })
// autoUpdater.on('update-available', (ev, info) => {
// })
// autoUpdater.on('update-not-available', (ev, info) => {
// })
// autoUpdater.on('error', (ev, err) => {
// })
// autoUpdater.on('download-progress', (ev, progressObj) => {
// })
function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
});

autoUpdater.on('update-available', () => {
  sendStatusToWindow('Update available.');
});

autoUpdater.on('update-not-available', () => {
  sendStatusToWindow('Update not available.');
});

autoUpdater.on('error', (error) => {
  console.log(error.toString());
  sendStatusToWindow('Error in auto-updater.', error.toString());
});

autoUpdater.on('download-progress', () => {
  sendStatusToWindow('Download progress...');
});

autoUpdater.on('update-downloaded', () => {
  sendStatusToWindow('Update downloaded; will install in 5 seconds');
});

autoUpdater.on('update-downloaded', () => {
  // Wait 5 seconds, then quit and install
  // In your application, you don't need to wait 5 seconds.
  // You could call autoUpdater.quitAndInstall(); immediately
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 5000);
});

app.on('ready', () => {
  autoUpdater.checkForUpdates();
});
