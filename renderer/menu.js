// Modules
const { remote, shell } = require('electron');

// Menu template
const template = [
  {
    label: 'Items',
    submenu: [
      {
        label: 'Add New',
        accelerator: 'CmdOrCtrl+O',
        click: window.newItem
      },
      {
        label: 'Read Item',
        accelerator: 'CmdOrCtrl+Enter',
        click: window.readItem
      },
      {
        label: 'Delete Item',
        accelerator: 'CmdOrCtrl+Backspace',
        click: window.deleteItem
      },
      {
        label: 'Open in Browser',
        accelerator: 'CmdOrCtrl+Shift+O',
        click: window.openItemNative
      },
      {
        label: 'Search Items',
        accelerator: 'CmdOrCtrl+S',
        click: window.searchItems
      }
    ]
  },
  {
    role: 'editMenu'
  },
  {
    role: 'windowMenu'
  },
  {
    role: 'help',
    submenu: [
      {
        label: 'Contact Developer',
        click: () => {
          shell.openExternal('https://carbondigital.us/contact');
        }
      }
    ]
  }
];

// set mac-specific first menu item
if (process.platform === 'darwin') {
  template.unshift({
    label: remote.app.getName(),
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  });
}

// build menu
const menu = remote.Menu.buildFromTemplate(template);

// set as main app menu
remote.Menu.setApplicationMenu(menu);
