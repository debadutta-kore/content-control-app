import { app, shell, BrowserWindow, screen } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import initSocketServer from './websocketServer'
import logger from 'electron-log/main'
import { getPort } from 'get-port-please'

logger.initialize()

/**
 * @type {import('http').Server}
 */
let server = null

function createWindow() {
  // get device primary display
  const primaryDisplay = screen.getPrimaryDisplay()
  // get device default height and width of primary display
  const { width, height } = primaryDisplay.workAreaSize
  // initialize a socket server only once at any random port
  if (!server && BrowserWindow.getAllWindows().length === 0) {
    getPort()
      .then((port) => {
        server = initSocketServer(port)
      })
      .catch((err) => {
        logger.error("can't find any port to run", err)
      })
  }
  // Create a window that fills the screen's available work area.
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width,
    height,
    icon,
    show: false,
    title: '',
    autoHideMenuBar: true,
    fullscreen: true,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('closed', () => {
    // if All window closed then close the server
    if (server && BrowserWindow.getAllWindows().length === 0) {
      server.close((err) => {
        if (!err) {
          logger.log('Server closed successfully')
        } else {
          logger.error('on close server error', err)
        }
      })
      server = null
    }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//open the app on start up
app.setLoginItemSettings({
  openAtLogin: true
})
