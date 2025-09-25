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

const apiRoute = process.env.API_ROUTE
const apiSyncroRoute = process.env.API_SYNCRO_ROUTE
const terminalId = process.env.TERMINAL_ID
const customWeight = process.env.CUSTOM_WEIGHT
const registerLogs = process.env.REGISTER_LOGS
const keyboard = process.env.KEYBOARD

const url = `https://operations.abianchini.es:4043?API_ROUTE=${apiRoute}&API_SYNCRO_ROUTE=${apiSyncroRoute}&TERMINAL_ID=${terminalId}&CUSTOM_WEIGHT=${customWeight}&REGISTER_LOGS=${registerLogs}&KEYBOARD=${keyboard}`

function createSplash() {
  const splash = new BrowserWindow({
      fullscreen: true,
      frame: false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  const html = `
    <html>
        <body>
        <h2>Carregant...</h2>
            <p><b>API_ROUTE:</b> ${apiRoute}</p>
            <p><b>API_SYNCRO_ROUTE:</b> ${apiSyncroRoute}</p>
            <p><b>TERMINAL_ID:</b> ${terminalId}</p>
            <p><b>TERMINALS_URL:</b> ${url}</p>
            <p><b>CUSTOM_WEIGHT:</b> ${customWeight}</p>
            <p><b>REGISTER_LOGS:</b> ${registerLogs}</p>
            <p><b>KEYBOARD:</b> ${keyboard}</p>
        </body>
    </html>
  `

  splash.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`)
  return splash
}

function createMainWindow() {
  const win = new BrowserWindow({
    fullscreen: true,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  win.loadURL(url)
}

app.whenReady().then(() => {

  // Mostra splash
  const splash = createSplash(apiRoute, apiSyncroRoute, terminalId, url)

  // Espera 3 segons abans d’obrir finestra principal
  setTimeout(() => {
    splash.close()
    createMainWindow(url)
  }, 5000)
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
