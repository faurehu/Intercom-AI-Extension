/*
 * The cache stores context and suggestions to not make the same request
 * multiple times
 */

cache = {}

function storeInCache(context, suggestion, suggestionID, conversationID) {
  cache[conversationID] = {
    'context': context,
    'suggestion': suggestion,
    'suggestionID': suggestionID
  }
}

function removeFromCache(conversationID) {
  if (conversationID in cache) {
    delete cache[conversationID];
  }
}

function getFromCache(conversationID) {
  return cache[conversationID];
}

function checkCache(conversationID) {
  return conversationID in cache;
}
