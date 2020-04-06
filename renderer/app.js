// Electron Modules
const { ipcRenderer } = require('electron');
const items = require('./items');

// DOM elements
const showModal = document.querySelector('#show-modal');
const closeModal = document.querySelector('#close-modal');
const modal = document.querySelector('#modal');
const addItem = document.querySelector('#add-item');
const itemUrl = document.querySelector('#url');
const search = document.querySelector('#search');

// open new item modal
window.newItem = () => {
  showModal.click();
};
// Reference to items.open globally
window.readItem = items.open;

// Reference to items.delete globally
window.deleteItem = () => {
  const selectedItem = items.getSelectedItem();
  items.delete(selectedItem.index);
};

// read item in default browser
window.openItemNative = items.openItemNative;

// focus into search field
window.searchItems = () => {
  search.focus();
};

// filter items by search bar
search.addEventListener('keyup', (e) => {
  // loop items
  Array.from(document.getElementsByClassName('read-item')).forEach((item) => {
    // hide items that do not match search value
    const matchingEntries = item.innerText.toLowerCase().includes(search.value);
    item.style.display = matchingEntries ? 'flex' : 'none';
  });
});

// navigate item selection with up/down arrows
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
    items.changeSelection(e.key);
  }
});

// disable and enable modal buttons
const toggleModalButtons = () => {
  // check state of button
  if (addItem.disabled === true) {
    addItem.disabled = false;
    addItem.style.opacity = 1;
    addItem.innerText = 'Add Item';
    closeModal.style.display = 'inline';
  } else {
    addItem.disabled = true;
    addItem.style.opacity = 0.5;
    addItem.innerText = 'Adding...';
    closeModal.style.display = 'none';
  }
};

// Show modal
showModal.addEventListener('click', () => {
  modal.style.display = 'flex';
  itemUrl.focus();
});

// Hide modal
closeModal.addEventListener('click', () => {
  modal.style.display = 'none';
});

// Add new urls
addItem.addEventListener('click', () => {
  // does url exist in field
  if (itemUrl.value) {
    // send new url to main process
    ipcRenderer.send('new-item', itemUrl.value);
    // disable buttons
    toggleModalButtons();
  }
});

// listed for new item on from main process
ipcRenderer.on('new-item-success', (e, newItem) => {
  // add new items to page DOM under '#items'
  items.addItem(newItem, true);

  //enable buttons
  toggleModalButtons();

  modal.style.display = 'none';
  itemUrl.value = '';
});

// listen for keyboard submit
itemUrl.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') addItem.click();
});
