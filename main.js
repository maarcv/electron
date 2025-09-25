const { app, BrowserWindow } = require('electron/main')
const path = require('node:path')
const dotenv = require('dotenv')

// Carrega .env segons si és dev o empaquetat
if (app.isPackaged) {
  // Quan està empaquetat, els recursos viuen a process.resourcesPath
  dotenv.config({ path: path.join(process.resourcesPath, '.env') })
} else {
  dotenv.config() // .env a l’arrel del repo en desenvolupament
}

function createWindow () {
    const terminalId = process.env.terminalId
    const personId = process.env.personId
  const win = new BrowserWindow({
      fullscreen: true,         // Obre directament en pantalla completa
      frame: false,             // Treu la barra de Windows (sense controls)
      autoHideMenuBar: true,    // Oculta la barra de menú si n’hi hagués
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
    const url = `https://operations.abianchini.es:4043?person=${personId}&terminal=${terminalId}`
    win.loadURL(url)
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
