/*


 */

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.storage.local.get('enabled', function (result) {
    enabled = typeof result.enabled != 'undefined' ? !result.enabled : true;
    chrome.storage.local.set({enabled: enabled});
    chrome.browserAction.setIcon({path: enabled ? "32.png" : "faded.png"});
  });

});

