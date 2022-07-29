'use strict';

import EmojiConfettiGenerator from './confetti.js'

const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
  `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);

// Communicate with background file by sending a message
chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: 'Hello, my name is Con. I am from ContentScript.',
    },
  },
  (response) => {
    console.log(response.message);
  }
);

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('received message');

  if (request.type === 'COUNT') {
    console.log(`Current count is ${request.payload.count}`);
  }

  // Send an empty response
  // See https://github.com/mozilla/webextension-polyfill/issues/130#issuecomment-531531890
  
  if (request.type === 'fire-up') {
    console.log('firing')

    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'confetti-holder');
    canvas.style.zIndex = '9999';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';

    document.body.appendChild(canvas);
    const cannon = new EmojiConfettiGenerator({
      target:'confetti-holder',
      emojis: ['🪐', "🌚"],
      startVelocity: 1,
      gravity:1
    })
    cannon.render()
  }

  sendResponse({});
  return true;
});

