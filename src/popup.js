'use strict';

import './popup.css';
import { createPicker, darkTheme } from 'picmo';
import {hashFunction} from './utils.js';
(function () {

  let selectedEmoji = 0;
  const actionButton = document.getElementById('action-button');
  const emojiContainer = document.getElementById('emoji-container');
  const emojiWrapper = document.getElementById('emoji-wrapper');
  let tab;

  //Set up Tab on start up
  chrome.tabs.query({active: true, currentWindow: true}, tabs => {
    tab = tabs[0];
    const url = hashFunction(tab.url);
    chrome.storage.sync.get(url, (data) => {
      //If there is no data for this url, make emoji container visible
      if (data[url] === undefined) {
        setEmojiWrapper(true);
      } else {
        setEmojiWrapper(false);
      }
    });
  });
  
  // Create the picker
  const pickerContainer = document.querySelector('#picker-container');
  // Set picker style to none to hide it
  pickerContainer.style.display = 'none';
  const picker = createPicker(
    { 
      rootElement: pickerContainer,
      theme: darkTheme,
      showPreview: false,
      visibleRows: 5,
    });

  // The picker emits an event when an emoji is selected. 
  picker.addEventListener('emoji:select', event => {
    console.log('Emoji selected:', event.emoji);
    emojiArray[selectedEmoji].innerHTML = event.emoji;
    togglePicker();
  });

  // Set up Array of Emojis Divs
  const emojiArray = [];
  let emojiDiv;
  for (let i = 1; i < 4; i++) {
    emojiDiv = document.querySelector(`#emoji-${i}`);
    emojiArray.push(emojiDiv);
    emojiDiv.addEventListener('click', () => {
      selectedEmoji = i - 1;
      console.log(selectedEmoji, 'selected');
      togglePicker();
    })
  }

  // Add event for button
  actionButton.addEventListener('click', () => {

    if (emojiWrapper.style.display == 'none') {
      // Cannon is currently loaded, so unload it 
      chrome.storage.sync.remove(hashFunction(tab.url), () => {
        setEmojiWrapper(true);
      });
    } else {
      // Cannon is currently unloaded, so load it
      const emoji = emojiArray.map(e => e.innerHTML);
      const data = {};
      data[hashFunction(tab.url)] = emoji;
      chrome.storage.sync.set(data, function() {
        fireCannon(emoji);
        setEmojiWrapper(false);
      })
    }
  })

  // Helper functions

  // Send message to content script to fire cannon
  function fireCannon(emoji) {
    chrome.tabs.sendMessage(
      tab.id,
      {
        type: 'fire-up',
        payload: { emoji }
      },
      (response) => {
        console.log('cannon fired')
      }
    )
  }
  
  function togglePicker() {
    console.log('togglePicker', pickerContainer.style.display);
    if (pickerContainer.style.display == 'none') {
      pickerContainer.style.display = 'flex';
      actionButton.style.display = 'none';
    } else {
      pickerContainer.style.display = 'none';
      actionButton.style.display = 'flex';
    }
  }
  /**
   * set visibility of emoji container based on param
   * @param {boolean} isVisible 
   */
  function setEmojiWrapper(isVisible) {
    if (isVisible) {
      emojiWrapper.style.display = 'flex';
      actionButton.innerHTML ='PRESS TO LOAD';
    } else {
      emojiWrapper.style.display = 'none';
      actionButton.innerHTML = 'PRESS TO UNLOAD';
    }
  }

  
})();
