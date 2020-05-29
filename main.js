const { app, BrowserWindow, Menu, ipcMain, screen } = require('electron')

const isMac = process.platform === 'darwin' 
const isDev = false 
let win

function createWindow() {
   // Get Screen size
   const mainScreen = screen.getPrimaryDisplay()
   const width = mainScreen.size.width

   // Create Window
   win = new BrowserWindow({
      width: 500,
      height: 300,
      x: width - 500,
      y: 0,
      titleBarStyle: "hidden",
      alwaysOnTop: true,
      webPreferences: {
         nodeIntegration: true
      }
   })

   // and load the index.html of the app.
   win.loadFile('index.html')

   // Build Menu
   const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
   Menu.setApplicationMenu(mainMenu)

}

// Create Menu
const mainMenuTemplate = [
   ...(isMac ? [{
      label: app.name,
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services' },
        { role: 'quit' }
      ]
   }] : []),
   {
      label: 'Shortcuts', 
      submenu: [
         { 
            label: 'Go to Initial Page', 
            accelerator: 'CmdOrCtrl+I',
            click() { win.loadFile('index.html') } 
         },
         { type: 'separator' },
         { role: 'hide' },
         { role: 'minimize' },
         { 
            label: 'Restore', 
            accelerator: 'CmdOrCtrl+W',
            click() { 
               win.restore()
            } 
         },
         { 
            label: 'Initial Size', 
            accelerator: 'CmdOrCtrl+E',
            click() { 
               const mainScreen = screen.getPrimaryDisplay()
               const width = mainScreen.size.width

               win.setBounds({ width: 500, height: 300, x: width - 500 })
            } 
         },
         { 
            label: 'Toggle Corner', 
            accelerator: 'CmdOrCtrl+T',
            click() { 
               const mainScreen = screen.getPrimaryDisplay()
               const height = mainScreen.size.height

               const currentBounds = win.getBounds()
               
               currentBounds.y < 100 
               ? win.setBounds({ y: height - currentBounds.height })
               : win.setBounds({ y: 0 })
               
            } 
         },
         { type: 'separator' },
         { role: 'reload' },
         { role: 'zoomin' },
         { role: 'zoomout' },
      ],
   },
   {
      label: 'Edit',
      submenu: [
         { role: 'undo' },
         { role: 'redo' },
         { type: 'separator' },
         { role: 'cut' },
         { role: 'copy' },
         { role: 'paste' },
         ...(isMac ? [
            { role: 'pasteAndMatchStyle' },
            { role: 'delete' },
            { role: 'selectAll' },
            { type: 'separator' },
            {
            label: 'Speech',
            submenu: [
               { role: 'startspeaking' },
               { role: 'stopspeaking' }
            ]
            }
         ] : [
            { role: 'delete' },
            { type: 'separator' },
            { role: 'selectAll' }
         ])
      ]
   },
   {
      role: 'help',
      submenu: [
         {
            label: 'Learn More',
            click: async () => {
            const { shell } = require('electron')
               await shell.openExternal('https://electronjs.org')
            }
         },
         ...(isDev ? [
            {
               label: 'DevTools',
               click(item, focusedWindow) {
                  focusedWindow.toggleDevTools()
               }
            }
         ] : [])
      ]
   }
]

app.whenReady().then(createWindow)


// Catch link:url from index and redirect
ipcMain.on('link:url', (e, link) => {
   win.loadURL(link)
})


// Quit when all windows are closed.
app.on('window-all-closed', () => {
   if (process.platform !== 'darwin') {
      app.quit()
   }
})

app.on('activate', () => {
   if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
   }
})
