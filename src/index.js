/*
In Electron, the process that runs package.json's main script is called the main process.The main process creates web pages by creating BrowserWindow instances. Each BrowserWindow instance runs the web page in its own renderer process. When a BrowserWindow instance is destroyed, the corresponding renderer process is also terminated.
In Electron, GUI-related modules (such as dialog, menu etc.) are only available in the main process, not in the renderer process. In order to use them from the renderer process, the ipc module is necessary to send inter-process messages to the main process.With the remote module, you can invoke methods of the main process object without explicitly sending inter-process messages, similar to Java's RMI. An example of creating a browser window from a renderer process:

const remote = require('electron').remote;
const BrowserWindow = remote.BrowserWindow;

var win = new BrowserWindow({ width: 800, height: 600 });
win.loadURL('https://github.com');
Basically the remote module makes it easy to do stuff normally restricted to the main process in a render process without lots of manual ipc messages back and forth.
*/
const {ipcRenderer} = require('electron')
const BrowserWindow = require('electron').remote.BrowserWindow
const path = require('path')
const axios = require('axios')

const notifyBtn = document.getElementById('notifyBtn')
var price = document.querySelector('h1')
var targetPrice = document.getElementById('targetPrice')
var targetPriceVal

const notification = {
    title: 'BTC Alert',
    body: 'BTC just beat your target price!',
    icon: path.join(__dirname, '../assets/images/btc.png')
}

/*
The Promise object represents the eventual completion (or failure) of an asynchronous operation, and its resulting value. 

Syntax:
promise.then(onFulfilled[, onRejected]);

p.then(function(value) {
  // fulfillment
}, function(reason) {
  // rejection
});

Rules:
onFulfilled:
A Function called if the Promise is fulfilled. This function has one argument, the fulfillment value. If it is not a function it is internally replaced with an "Identity" function(it returns received argument).

onRejected: (Optional)
A Function called if the Promise is rejected. This function has one argument, the rejection reason. If it is not a function it is internally replaced with "Thrower" function(it throws an error received as argument).
*/
function getBTC() {
    axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC&tsyms=USD')
    .then(res => {
        const cryptos = res.data.BTC.USD
        price.innerHTML = '$'+cryptos.toLocaleString('en')
    
        if (targetPrice.innerHTML != '' && targetPriceVal < res.data.BTC.USD) {
            const myNotification = new window.Notification(notification.title, notification)
        }
    })

}

getBTC();
setInterval(getBTC, 30000);

function createWindow () {
    win = new BrowserWindow({frame: false, transparent: true, alwaysOnTop: true, width: 400, height: 200})
    win.loadFile('src/add.html')

    win.on('closed', () => {
      win = null
    })
}

notifyBtn.addEventListener('click', createWindow)

ipcRenderer.on('targetPriceVal', (event, arg) => {
    targetPriceVal = Number(arg)
    targetPrice.innerHTML = '$'+targetPriceVal.toLocaleString('en') 
})