// create button in remore content to mark item as "done"
const readitClose = document.createElement('div');
readitClose.innerText = 'Archive';

// style button
readitClose.style.position = 'fixed';
readitClose.style.bottom = '15px';
readitClose.style.right = '15px';
readitClose.style.padding = '5px 10px';
readitClose.style.fontSize = '20px';
readitClose.style.fontWeight = 'bold';
readitClose.style.background = 'dodgerblue';
readitClose.style.color = 'white';
readitClose.style.borderRadius = '5px';
readitClose.style.cursor = 'pointer';
readitClose.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.25)';
readitClose.style.zIndex = '9999';

// add click handler
readitClose.onclick = (e) => {
  // message parent window (mainWindow)
  window.opener.postMessage({
    action: 'delete-reader-item',
    itemIndex: {{index}}
  }, '*');
};

// append button to body
document.getElementsByTagName('body')[0].appendChild(readitClose);
