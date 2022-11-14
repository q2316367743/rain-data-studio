import MessageBoxOptions from "./entity/MessageBoxOptions";

const { ipcRenderer } = window.require('electron');

export function showMessageBox(options: MessageBoxOptions) {
    ipcRenderer.send('dialog:message', options);
}