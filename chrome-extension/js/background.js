const setIcon = (value) => {
  if (value == true) {
    chrome.browserAction.setIcon({path:"chrome-extension/img/icon-on.png"});
  } else {
    chrome.browserAction.setIcon({path:"chrome-extension/img/icon-off.png"});
  }
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace == 'local') {
    if (changes.deltaDirectory) {

    }

    if (changes.deltaOverwrite) {
      setIcon(changes.deltaOverwrite.newValue);
    }
  }
});

chrome.storage.local.get('deltaOverwrite', (values) => {
  setIcon(values.deltaOverwrite);
});
