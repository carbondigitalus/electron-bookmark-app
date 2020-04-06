// Node Modules
const fs = require('fs');
const { shell } = require('electron');

// DOM elements
const items = document.querySelector('#items');

// get readerJS window
let readerJS;
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
  readerJS = data.toString();
});

// track items in storage
exports.storage = JSON.parse(localStorage.getItem('readit-items')) || [];

// listen for done message from reader window
window.addEventListener('message', (e) => {
  // check for correct message
  if (e.data.action === 'delete-reader-item') {
    // delete item at a given index
    this.delete(e.data.itemIndex);

    // close the reader window
    e.source.close();
  }
});

// delete item
exports.delete = (itemIndex) => {
  // remove item from dom
  items.removeChild(items.childNodes[itemIndex]);
  // remove from storage
  this.storage.splice(itemIndex, 1);
  // persist and save changes
  this.save();
  // select previous item or new first item
  if (this.storage.length) {
    // get new selected item
    const newSelectedItemIndex = itemIndex === 0 ? 0 : itemIndex - 1;

    // select item at new index
    document
      .getElementsByClassName('read-item')
      [newSelectedItemIndex].classList.add('selected');
  }
};

// get selected item index
exports.getSelectedItem = () => {
  // get selected element
  const currentItem = document.getElementsByClassName('read-item selected')[0];

  // get item index
  let itemIndex = 0;
  let child = currentItem;
  while ((child = child.previousSibling) != null) itemIndex++;

  // return selected item and it's index
  return { node: currentItem, index: itemIndex };
};

// retain storage
exports.save = () => {
  localStorage.setItem('readit-items', JSON.stringify(this.storage));
};

// set item as selected
exports.select = (e) => {
  // remove currently selected item
  this.getSelectedItem().node.classList.remove('selected');

  // add to clicked item
  e.currentTarget.classList.add('selected');
};

// move to newly selected item via keyboard
exports.changeSelection = (direction) => {
  // get currently selected item
  const currentItem = this.getSelectedItem();

  // handle up/down arrow keys
  if (direction === 'ArrowUp' && currentItem.previousSibling) {
    currentItem.node.classList.remove('selected');
    currentItem.node.previousSibling.classList.add('selected');
  } else if (direction === 'ArrowDown' && currentItem.nextSibling) {
    currentItem.node.classList.remove('selected');
    currentItem.node.nextSibling.classList.add('selected');
  }
};

// open item in native (default) browser
exports.openItemNative = () => {
  // if there are no items listed, do nothing
  if (!this.storage.length) return;

  // otherwise, get selected item
  const selectedItem = this.getSelectedItem();

  // open default browser using shell module
  shell.openExternal(selectedItem.node.dataset.url);
};

// open selected item
exports.open = () => {
  // if we don't have any items, stop
  if (!this.storage.length) return;

  // otherwise, get selected item
  const selectedItem = this.getSelectedItem();
  // get item's url
  const contentURL = selectedItem.node.dataset.url;

  // open selected item in new browser window via proxy
  const readerWin = window.open(
    contentURL,
    '',
    `
    maxWidth=2000,
    maxHeight=2000,
    width=1200,
    height=800,
    backgroundColor=#DEDEDE,
    nodeIntegration=0,
    contextIsolation=1
  `
  );
  // inject javscript
  readerWin.eval(readerJS.replace('{{index}}', selectedItem.index));
};

// add new item
exports.addItem = (item, isNew = false) => {
  // create new DOM elements
  const itemNode = document.createElement('div');
  // assign class 'read-item'
  itemNode.setAttribute('class', 'read-item');
  // set item url as data attribute
  itemNode.setAttribute('data-url', item.url);
  // add inner html
  itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`;
  // append new elements to items div
  items.appendChild(itemNode);

  // add click handler to select
  itemNode.addEventListener('click', this.select);

  // trigger the selected item to open via doubleclick
  itemNode.addEventListener('dblclick', this.open);

  // if this is the first item select it
  if (document.getElementsByClassName('read-item').length === 1) {
    itemNode.classList.add('selected');
  }

  // add item to store and retain
  if (isNew) {
    this.storage.push(item);
    this.save();
  }
};

// add items from storage when app loads
this.storage.forEach((item) => {
  this.addItem(item);
});
