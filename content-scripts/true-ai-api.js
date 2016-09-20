/*
 * All interactions with the TrueAI server are abstracted here
 */

var TRUE_AI_API_URL_SUGGESTION = 'https://15fe6747.ngrok.io/suggestions';
var TRUE_AI_API_URL_RESPONSE = 'https://15fe6747.ngrok.io/responses';

function getConversationID() {
  var path = window.location.pathname.split('/');
  return path[path.length - 1];
}

function getSuggestion(context, company, cb) {
  var conversationID = getConversationID();

  if (checkCache(conversationID)) {
    // TODO: defend against possibility that cache context and page context
    // is not properly synchronised.

    cb(getFromCache(conversationID).suggestion);

  } else {

    url = new URL(TRUE_AI_API_URL_SUGGESTION);
    url.searchParams.append('context', JSON.stringify(context));
    url.searchParams.append('company', company);

    fetch(url, {method: 'get'})
    .then(function (response) {
      return response.json();
    })
    .then(function (json) {
      storeInCache(context, json.suggestion, json.suggestionID, conversationID);
      cb(json.suggestion)
    })
    .catch(function (error) {
      throw error
    });
  }
}

function postResult(context, suggestionID, result) {
  url = new URL(TRUE_AI_API_URL_RESPONSE);
  url.searchParams.append('context', JSON.stringify(context));
  url.searchParams.append('suggestionID', suggestionID);
  url.searchParams.append('result', result);

  fetch(url, {method: 'get'})
  .then(function (response) {
    // Success
  })
  .catch(function (error) {
    throw error
  });
}
