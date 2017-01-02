/*
 * Functions in this file interact with the browser storage. User settings
 * are stored here. We use the sync Storage Area to make these settings
 * available no matter the machine.
 *
 * The config has the following schema:
 * {
 *  "suggestionEnabled": bool
 * }
 */

function getConfig(cb) {
  chrome.storage.local.get('config', function(items) {
    config = 'config' in items ? items['config'] : {};
    if ('suggestionEnabled' in config) {
      cb(config);
    } else {
      cb({ suggestionEnabled: true });
    }
  });
}

function storeConfig(config) {
  chrome.storage.local.set({'config': config});
}
