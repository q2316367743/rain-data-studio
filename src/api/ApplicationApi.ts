const {ipcRenderer} = window.require('electron');

export function toMin() {
    ipcRenderer.send('application:toMin')
}

export function toMax() {
    ipcRenderer.send('application:toMax')
}

export function doClose() {
    ipcRenderer.send('application:doClose')
}

export function openDevTools() {
    ipcRenderer.send('application:openDevTools')
}