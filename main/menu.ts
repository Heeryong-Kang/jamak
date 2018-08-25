import Electron, { Menu } from 'electron';
import {
  openSubtitleDialog,
  openVideoDialog,
  saveAsSubtitleDialog,
} from './fileDialogs';

const ipcSender = (channel: string, ...args: any[]) => (
  menuItem: Electron.MenuItem,
  browserWindow: Electron.BrowserWindow,
  event: Event,
) => {
  browserWindow.webContents.send(channel, ...args);
};

const template: Electron.MenuItemConstructorOptions[] = [
  {
    label: 'File',
    submenu: [
      {
        label: 'New Subtitle File',
        accelerator: 'CmdOrCtrl+N',
        click: ipcSender('new-subtitle'),
      },
      { type: 'separator' },
      {
        label: 'Open Subtitle File',
        accelerator: 'CmdOrCtrl+O',
        click: (menuItem, browserWindow) =>
          openSubtitleDialog(browserWindow.webContents),
      },
      {
        label: 'Open Video',
        accelerator: 'CmdOrCtrl+Shift+O',
        click: (menuItem, browserWindow) =>
          openVideoDialog(browserWindow.webContents),
      },
      { type: 'separator' },
      {
        label: 'Open Recent',
        submenu: [{}],
      },
      { type: 'separator' },
      {
        label: 'Save',
        accelerator: 'CmdOrCtrl+S',
        click: ipcSender('save-or-save-as'),
      },
      {
        label: 'Save As',
        accelerator: 'CmdOrCtrl+Shift+S',
        click: (menuItem, browerWindow) =>
          saveAsSubtitleDialog(browerWindow.webContents),
      },
      { type: 'separator' },
      { label: 'Settings' },
      { type: 'separator' },
      { label: 'Quit', role: 'quit' },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Undo' },
      { label: 'Redo' },
      { type: 'separator' },
      { label: 'Cut' },
      { label: 'Copy' },
      { label: 'Paste' },
    ],
  },
  {
    label: 'Player',
    submenu: [
      {
        label: 'Play / Pause',
        accelerator: 'CmdOrCtrl+Space',
        click: ipcSender('play-or-pause'),
      },
      {
        label: 'Mute / Unmute',
        accelerator: 'CmdOrCtrl+Shift+M',
        click: ipcSender('mute-or-unmute'),
      },
      {
        label: 'Volume Up',
        accelerator: 'CmdOrCtrl+]',
        click: ipcSender('volume-up'),
      },
      {
        label: 'Volume Down',
        accelerator: 'CmdOrCtrl+[',
        click: ipcSender('volume-down'),
      },
      {
        label: 'Play Speed Up',
        accelerator: 'CmdOrCtrl+Shift+.',
        click: ipcSender('speed-up'),
      },
      {
        label: 'Play Speed Down',
        accelerator: 'CmdOrCtrl+Shift+,',
        click: ipcSender('speed-down'),
      },
    ],
  },
  {
    label: 'View',
    submenu: [
      { label: 'Reload', role: 'reload' },
      { label: 'Force Reload', role: 'forceReload' },
      { type: 'separator' },
      { label: 'Actual Size', role: 'resetZoom' },
      { label: 'Zoom In', role: 'zoomIn' },
      { label: 'Zoom Out', role: 'zoomOut' },
      { type: 'separator' },
      { label: 'Toggle Full Screen', role: 'toggleFullScreen' },
    ],
  },
  {
    label: 'Window',
    submenu: [
      { label: 'Minimize', role: 'minimize' },
      { label: 'Close', role: 'close' },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Info',
      },
      {
        label: 'Official Website',
        click: () => {
          Electron.shell.openExternal('https://github.com/drakang4/jamak');
        },
      },
      { label: 'License' },
      {
        label: 'Toggle Developer Tools',
        role: 'toggleDevTools',
        visible: process.env.NODE_ENV === 'development',
      },
    ],
  },
];

export async function createMenu() {
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}