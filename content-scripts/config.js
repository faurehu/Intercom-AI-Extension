/*
 * Functions in this file interact with the browser storage. User settings
 * are stored here. We use the sync Storage Area to make these settings
 * available no matter the machine.
 *
 * The True AI config has the following schema:
 * {
 *  "suggestionEnabled": bool
 * }
 */

function getConfig(cb) {
  chrome.storage.local.get('true_ai_config', function(items) {
    config = items['true_ai_config'];
    if ('suggestionEnabled' in config) {
      cb(config);
    } else {
      cb({ suggestionEnabled: true });
    }
  });
}

function storeConfig(config) {
  chrome.storage.local.set({'true_ai_config': config});
}
