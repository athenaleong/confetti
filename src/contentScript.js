'use strict';

import EmojiConfettiGenerator from './confetti.js';
import { hashFunction } from './utils.js';

//Check if cannon is set for current url, if it is set, fire cannon
//The key is set as the hash of the url
const url = hashFunction(document.location.href);
chrome.storage.sync.get(url, (data) => {
  if (data[url] !== undefined) {
    fireUp(data[url]);
  } 
})

// Fire cannon
function fireUp(emojis) {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'confetti-holder');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';

    document.body.appendChild(canvas);
    const cannon = new EmojiConfettiGenerator({
      target:'confetti-holder',
      emojis,
      startVelocity: 1,
      gravity:1
    })
    cannon.render();
}

// Listen for message
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  
  if (request.type === 'fire-up') {
    fireUp(request.payload.emoji);
  }

  sendResponse({});
  return true;
});

