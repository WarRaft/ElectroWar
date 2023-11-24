const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electron', {
    showOpenDialogSync: options => ipcRenderer.invoke('showOpenDialogSync', options),
})

contextBridge.exposeInMainWorld('reader', {
    getDirectoryFilesList: dirpath => ipcRenderer.invoke('getDirectoryFilesList', dirpath),
    getModelTextures: file => ipcRenderer.invoke('getModelTextures', file),
    setModelTextures: (file, textures) => ipcRenderer.invoke('setModelTextures', file, textures),
})

contextBridge.exposeInMainWorld('fs', {
    readFileSync: (path, options) => ipcRenderer.invoke('readFileSync', path, options),
    writeFileSync: (path, data, options) => ipcRenderer.invoke('writeFileSync', path, data, options),
})

contextBridge.exposeInMainWorld('path', {
    parse: path => ipcRenderer.invoke('path-parse', path),
    join: (...paths) => ipcRenderer.invoke('path-join', ...paths),
})
