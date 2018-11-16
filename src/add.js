const {remote, ipcRenderer} = require('electron')

var closeBtn = document.getElementById('closeBtn')
var updateBtn = document.getElementById('updateBtn')

function closeWindow() {
    var window = remote.getCurrentWindow();
    window.close();
}

closeBtn.addEventListener('click', closeWindow)

/*
Resource: https://rowanmanning.com/posts/javascript-for-beginners-async/

Synchronous implies each statement in your code is executed one after the other. This means each statement has to wait for the previous one to finish executing.

console.log('First');
console.log('Second');
console.log('Third');
The statements above will execute in order, outputting “First”, “Second”, “Third” to the console. That’s because it’s written synchronously.

Asynchronous code takes statements outside of the main program flow, allowing the code after the asynchronous call to be executed immediately without waiting. You’ve probably used asynchronous programming before with jQuery.ajax or similar:

console.log('First');
jQuery.get('page.html', function (data) {
    console.log("Second");
});
console.log('Third');
In the example above, the output will be different: “First”, “Third”, “Second”. This is because the function passed into jQuery.get is not called immediately – it has to wait for jQuery to fetch the page you asked for before it can execute.
*/
updateBtn.addEventListener('click', () => {
    ipcRenderer.send('update-notify-value', document.getElementById('notifyVal').value)
    closeWindow()
})