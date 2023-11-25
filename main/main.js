const {
    app,
    BrowserWindow,
    ipcMain,
    dialog
} = require('electron')

const path = require('path')
const fs = require('fs')
const reader = require('./utils/reader')

if (!app.isPackaged) {
    require('electron-reloader')(module, {
        ignore: ['./render/renderer.js']
    })
}

const createWindow = () => {
    const debug = !app.isPackaged

    const win = new BrowserWindow({
        width: 800,
        height: 600,
        x: debug ? 1740 : null,
        y: debug ? 120 : null,
        roundedCorners: true,
        titleBarStyle: 'hidden',
        titleBarOverlay: true,
        alwaysOnTop: debug,
        acceptFirstMouse: false,
        darkTheme: true,
        frame: false,
        show: !debug,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            nodeIntegrationInWorker: false,
            contextIsolation: true,
            //devTools: !app.isPackaged,
        }
    })

    if (debug) {
        win.showInactive()
        win.webContents.openDevTools()
    }
    win.loadFile('render/index.html')

}

app.whenReady().then(() => {
    // reader
    ipcMain.handle('getDirectoryFilesList', (event, dirpath) => reader.getDirectoryFilesList(dirpath))
    ipcMain.handle('getModelTextures', (event, file) => reader.getModelTextures(file))
    ipcMain.handle('setModelTextures', (event, file, textures) => reader.setModelTextures(file, textures))

    // dialog
    ipcMain.handle('showOpenDialogSync', (event, options) => dialog.showOpenDialogSync(options))

    // fs
    ipcMain.handle('readdirSync', (event, path, options) => fs.readdirSync(path, options))
    ipcMain.handle('readFileSync', (event, path, options) => fs.readFileSync(path, options))
    ipcMain.handle('writeFileSync', (event, path, data, options) => fs.writeFileSync(path, data, options))

    // reader
    ipcMain.handle('getFileList', (event, path) => reader.getDirectoryFilesList(path))

    // path
    ipcMain.handle('path-parse', (event, filepath) => path.parse(filepath))
    ipcMain.handle('path-join', (event, ...paths) => path.join(...paths))

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', () => {
    //if (process.platform !== 'darwin') {}
    app.quit()
})
