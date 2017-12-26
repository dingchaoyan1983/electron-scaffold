import { app, globalShortcut } from 'electron';
import path from 'path';
import log from 'electron-log';
import { autoUpdater } from 'electron-updater';
import electronWindow from 'electron-window';

log.transports.file.maxSize = 5 * 1024 * 1024;

// Write to this file, must be set before first logging
log.transports.file.file = `${app.getPath('appData')}/log.txt`;
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

const debug = process.env.NODE_ENV === 'development';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow = null;

const createWindow = () => {
  log.info('ready to create main window');
  globalShortcut.register('CommandOrControl+Alt+I', () => mainWindow.webContents.openDevTools());

  // Create the browser window.
  mainWindow = electronWindow.createWindow({
    show: true,
    width: 1000,
    height: 400,
    title: 'Betalpha BAR',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegrationInWorker: true,
    },
  });

  if (debug) {
    mainWindow.showUrl('http://localhost:1212/renderer');
  } else {
    mainWindow.showUrl(path.resolve(__dirname, '..', 'renderer', 'index.html'));
  }

  mainWindow.maximize();

  if (debug) {
    mainWindow.webContents.openDevTools();
    global.require('devtron').install();
  }

  mainWindow.on('closed', () => {
    log.info('main window is closed');
    mainWindow = null;
  });

  log.info('crate window done');
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
  log.info('all windows closed, app will quit...');
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
app.on('activate', () => {
  log.info('main window will be activated');
  if (mainWindow === null) {
    createWindow();
  }
});
app.on('will-quit', () => globalShortcut.unregisterAll());
app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
  log.info('certificate-error');
  event.preventDefault();
  callback(true);
});

const sendStatusToWindow = (text) => {
  log.info(text);
  mainWindow.webContents.send('message', text);
};

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
  log.error(`Error in auto-updater. Error details is: ${error.toString()}`);
  sendStatusToWindow('Error in auto-updater.', error.toString());
});

autoUpdater.on('download-progress', () => {
  sendStatusToWindow('Download progress...');
});

autoUpdater.on('update-downloaded', () => {
  sendStatusToWindow('Update downloaded; will install in 5 seconds');
});

autoUpdater.on('update-downloaded', () => {
  log.info('update-downloaded; will quit and install');
  setTimeout(() => {
    autoUpdater.quitAndInstall();
  }, 5000);
});

app.on('ready', () => {
  log.info('ready check for updates...');
  autoUpdater.checkForUpdates();
});
