// Main function, runs everytime a conversation page is loaded
function loadExtension() {


  // getConfig makes an async call, so the value is exposed in the callback
  // function
  getConfig(function (config) {
    // We listen for sent messages
    addReplyListener();

    suggestionEnabled = config.suggestionEnabled

    // We append the on/off switch in the editor box
    appendSwitch(suggestionEnabled);

    if (suggestionEnabled) {
      makeSuggestion();
    }
  });
}

// This is the function that does all the work after everything's set up
function makeSuggestion() {
      // Scrape the conversation and return the context.
      context = getContext();

      company = getCompany();

      // We get a suggestion for this conversation, showSuggestion
      // is a callback that will append the suggestion into the editor
      suggestion = getSuggestion(context, company, showSuggestion);
}

// Determine if the message from Background.js is relevant
function handleBackgroundMessage(request, _, __) {

  // This regular expression matches URL for pages with conversations
  var REGEX = /https:\/\/app.intercom.io\/a\/apps\/\w*\/inbox\/.*\/conversations\/\d*/g

  if (REGEX.test(request.tab.url) && request.tab.status == 'complete') {
    // Since this page is a conversation, we can load extension
    loadExtension()
  }
}

function main() {

  // Listen for tab changes
  try {
    chrome.extension.onMessage.addListener(handleBackgroundMessage);
    loadTrueAI();
  } catch (err) {
    console.log('TrueAI extension error: ' + err);
  }
}


function checkEmberApp() {
  // Make sure Ember app has finished loading
  var emberAppChecker = setInterval(_checkEmberApp, 100);

  function _checkEmberApp() {
    // Checking for the last thing we will need
    if (document.querySelector('.conversation__bubble')) {
      clearInterval(emberAppChecker);
      main();
    }
  }
}

window.addEventListener('load', checkEmberApp, false);
