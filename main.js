const {app, BrowserWindow, Menu, ipcMain, dialog} = require('electron') //import modules from the 'electron' library
const {shell} = require('electron')

/* const {BrowserWindow} = require('electron')
Above syntax uses ES6.If you have object defined as:-

const obj={
    email: "hello@gmail.com",
    title: "Hello world"
}
Now if we want to assign or use email and title field of obj then we don't have to write the whole syntax like

const email = obj.email;
const title = obj.title;
This is old school now.

We can use ES6 destructing assignment i.e., if our object contains 20 fields in obj object then we just have to write names of those fields which we want to use like this:-

const { email,title } = obj;
This is ES6 syntax-simpler one It will automatically assign email and title from obj, just name has to be correctly stated for required field. */

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  win.loadFile('src/index.html')

  // Open the DevTools.
  //win.webContents.openDevTools()

  // Emitted when the window is closed.
  win.on('closed', () => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  })

  var menu = Menu.buildFromTemplate([
    {
      label: 'Menu',
      submenu: [
        {
          label: 'Open CoinMarketCap',
          click() {
            shell.openExternal('http://coinmarketcap.com')
          }
        },
        {type: 'separator'},
        {
          label: 'Exit',
          click() {
            app.quit()
          }
        }
      ]
    },

    {
      label: 'Toggle Developer Tools',
      accelerator: () => {
        if (process.platform === 'darwin') {
          return 'Alt+Command+I'
        } else {
          return 'Ctrl+Shift+I'
        }
      },
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      }
    },

    {
      label: 'About',
      click: function (item, focusedWindow) {
        if (focusedWindow) {
          const name = app.getName()
          const options = {
            type: 'info',
            title: `About ${name}`,
            buttons: ['Ok'],
            message: `${name} is a Bitcoin app that uses native desktop notifications to alert the user when the price of Bitcoin exceeds a user-specified threshold.`
          }
          dialog.showMessageBox(focusedWindow, options, function () {})
        }
      }
    }
])

  Menu.setApplicationMenu(menu)

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
/* It is not possible to send messages between renderer processes directly because Chromium designed so for security.

If you really want to get away from the main process you have to write IPC code from scratch, with either's Node's net module or Chromium's ipc component. */

//webContents Module: Render and control the contents of a BrowserWindow instance.

ipcMain.on('update-notify-value', (event, arg) => {
  win.webContents.send('targetPriceVal', arg)
})