// Custom Modules off screen
const { BrowserWindow } = require('electron');

// offscreen BrowserWindow
let offscreenWindow;

// exported readItem function
module.exports = (url, callback) => {
  // create offscreen window
  offscreenWindow = new BrowserWindow({
    width: 500,
    height: 500,
    show: false,
    webPreferences: {
      offscreen: true,
      nodeIntegration: false
    }
  });

  // load item url
  offscreenWindow.loadURL(url);

  // wait for content to finish loading
  offscreenWindow.webContents.on('did-finish-load', (e) => {
    // get page title
    const title = offscreenWindow.getTitle();
    // get screenshot thumbnail
    offscreenWindow.webContents.capturePage((image) => {
      // get image as dataURL
      const screenshot = image.toDataURL();
      // execute callback with item object
      callback({
        title,
        screenshot,
        url
      });
      // clean up offscreen window
      offscreenWindow.close();
      offscreenWindow = null;
    });
  });
};
