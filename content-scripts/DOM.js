/*
 * This file contains all interactions with the DOM.
 */

function appendSwitch(suggestionEnabled) {

  function getSVGPath(suggestionEnabled) {
    svgSource = suggestionEnabled ? 'robot_on.svg' : 'robot_off.svg';
    return chrome.extension.getURL('./assets/' + svgSource);
  }

  function getDataContent(suggestionEnabled) {
    return 'Switch TrueAI suggestions ' + (suggestionEnabled ? 'off' : 'on');
  }

  function toggleSwitch(event) {
    storeConfig({
      'suggestionEnabled': !suggestionEnabled
    });

    controlsBox = findControlsBox();
    switchElement = controlsBox.lastElementChild;
    controlsBox.removeChild(switchElement);
    appendSwitch(!suggestionEnabled);

    editor = document.querySelector('.composer-inbox').getElementsByTagName('p')[0];

    if (suggestionEnabled) {
      // Switch off
      suggestedMessage = getFromCache(getConversationID()).suggestion;

      if (suggestedMessage == editor.innerHTML) {
        editor.innerHTML = '';
      }
    } else {
      // Switch on
      makeSuggestion();
    }
  }

  // Create the icon element
  switchElement = document.createElement('object');
  switchElement.setAttribute('type', 'image/svg+xml');
  switchElement.setAttribute('data', getSVGPath(suggestionEnabled));
  switchElement.style.pointerEvents = 'none';

  // Use the same wrapper as the rest of elements in the controls
  div = document.createElement('div');
  div.setAttribute('data-content', getDataContent(suggestionEnabled));
  div.className = 'quick-action o__overflow-hidden u__left u__relative test__quick-action';

  controlsBox = findControlsBox();

  // Insert the new elements
  div.appendChild(switchElement)
  controlsBox.appendChild(div);

  // Add the click listener
  div.addEventListener('click', toggleSwitch);
}

function findControlsBox() {
  var controlsBoxWrapper = document.getElementsByClassName('js__conversation-controls-action-icons')[0]

  if (typeof controlsBoxWrapper === 'undefined') {
    throw 'extension running in wrong page';
  }

  var controlsBox = null;

  for (var i = 0; i < controlsBoxWrapper.childNodes.length; i++) {
    element = controlsBoxWrapper.childNodes[i];
    if (element.className === 'ember-view') {
      controlsBox = element;
      break;
    }
  }

  if (controlsBox == null) {
    // If we couldn't find the control box, we're in the wrong page
    throw 'running in wrong page';
  }

  return controlsBox;
}

function showSuggestion(suggestion) {
  var editor = document.querySelector('.composer-inbox').getElementsByTagName('p')[0];
  editor.innerHTML = suggestion;
}

// The context is a list of objects each with keys sender and text
function getContext() {
  messages = []

  // All the messages can be extracted by selecting these specific classnames
  message_bubbles = document.getElementsByClassName('conversation__bubble__inner o__has-tools');

  for (var i = 0; i < message_bubbles.length; i++) {
    bubble = message_bubbles[i];

    // They can be classified using the classnames of their parent nodes
    isUser = bubble.parentNode.className.indexOf('user-comment') > -1;
    sender = isUser ? 'customer' : 'operator';

    // The text is stored in a p element
    text = bubble.getElementsByTagName('p')[0].innerHTML;

    messages.push({
      sender: sender,
      text: text
    });
  }

  return messages;
}

function getCompany() {
  return document.querySelector('.team__inbox-selector__name').innerHTML;
}

function addReplyListener() {
  function handleSentMessage() {
    context = getContext();
    conversationID = getConversationID();
    store = getFromCache(conversationID);
    suggestionID = null;
    if (store) {
      suggestionID = store.suggestionID;
    }
    result = editor.innerHTML;

    postResult(context, suggestionID, result);
    removeFromCache(conversationID);
  }

  // Find the reply button and listen to clicks when enabled
  var button = document.querySelector('.btn.o__primary.o__in-right-list.tooltip__original-object.inbox__conversation-controls__button');
  button.addEventListener('click', handleSentMessage);

  window.onkeydown = function (e) {
    editor = document.querySelector('.composer-inbox').getElementsByTagName('p')[0];

    // Determining if the editor is empty is tricky. Getting the innerHTML from
    // the DOM element is inaccurate. I will get the outerHTML then parse the string.
    editorHTML = editor.outerHTML;

    // If this string finishes with html params, it's empty
    HTMLSubstring = editorHTML.substring(editorHTML.length - 23, editorHTML.length);

    for ( var i = 0; i < HTMLSubstring.length; i++ ) {
      if (HTMLSubstring.charCodeAt(i) === 8203) {
        HTMLSubstring = HTMLSubstring.slice(0, i) + HTMLSubstring.slice(i + 1);
      }
    }

    editorIsEmpty = HTMLSubstring === 'data-align="left"></p>';

    if (e.which == 13 && e.metaKey && !editorIsEmpty) {
      handleSentMessage();
    }
  }
}
