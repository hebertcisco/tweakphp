import { autoUpdater } from 'electron-updater'
import { UpdateInfo } from 'builder-util-runtime'
import { ipcMain } from 'electron'
import { window } from '../main'

let update: UpdateInfo

export const init = async () => {
  autoUpdater.autoDownload = false
  if (process.env.DEV) {
    autoUpdater.forceDevUpdateConfig = true
  }
  autoUpdater.on('update-available', (info: UpdateInfo) => {
    update = info
    window.webContents.send('update.available', info)
  })
  autoUpdater.on('update-not-available', (info: UpdateInfo) => {
    window.webContents.send('update.not-available', info)
  })
  autoUpdater.on('update-downloaded', () => {
    autoUpdater.quitAndInstall()
  })
  ipcMain.on('update.check', () => {
    checkForUpdates()
  })
  ipcMain.on('update.download', async (): Promise<void> => {
    window.webContents.send('update.available', update)
    await autoUpdater.downloadUpdate()
  })
}

export const checkForUpdates = async () => {
  window.webContents.send('update.checking')
  await autoUpdater.checkForUpdates()
}
