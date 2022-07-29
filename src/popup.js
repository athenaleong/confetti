'use strict';

import './popup.css';
import { createPicker } from 'picmo';

(function () {

  let selectedEmoji = 0;
  const actionButton = document.getElementById('action-button');
  let tab;
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    tab = tabs[0];
  });

  // Create the picker
  const rootElement = document.querySelector('#picker-container');
  const picker = createPicker({ rootElement });

  // The picker emits an event when an emoji is selected. 
  picker.addEventListener('emoji:select', event => {
    console.log('Emoji selected:', event.emoji);
    emojiArray[selectedEmoji].innerHTML = event.emoji;
    togglePicker();
  });

  // Set up Array of Emojis Divs
  const emojiArray = [];
  let emoji;
  for (let i = 1; i < 4; i++) {
    emoji = document.querySelector(`#emoji-${i}`);
    emojiArray.push(emoji);
    emoji.addEventListener('click', () => {
      selectedEmoji = i - 1;
      console.log(selectedEmoji, 'selected');
      togglePicker();
    })
  }

  // Add event for button
  actionButton.addEventListener('click', () => {
      fireCannon();
  })

  // Helper functions
  function fireCannon() {
    chrome.tabs.sendMessage(
      tab.id,
      {
        type: 'fire-up',
      },
      (response) => {
        console.log('cannon fired')
      }
    )
  }
  

  function togglePicker() {
    console.log('togglePicker', rootElement.style.display);
    if (rootElement.style.display == 'none') {
      rootElement.style.display = 'flex';
      actionButton.style.display = 'none';
    } else {
      rootElement.style.display = 'none';
      actionButton.style.display = 'flex';
    }
  }

})();
