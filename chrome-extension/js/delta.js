const checkForCSS = () => {
  const linkEl = document.querySelector();
};

const update = () => {
  chrome.storage.local.get(['deltaDirectory', 'deltaOverwrite'], (settings) => {
    const overwrite = document.querySelector('.js-toggle-overwrite');

    if (settings.deltaOverwrite == true) {
      overwrite.classList.add('overwrite-on');
    } else {
      overwrite.classList.remove('overwrite-on');
    }
  })
};

document.addEventListener('DOMContentLoaded', () => {
  const toggleOverwrite = document.querySelector('.js-toggle-overwrite');
  const reloadButton = document.querySelector('.js-reload');

  update()

  reloadButton.addEventListener('click', () => {
    chrome.runtime.reload();
  }, false);

  toggleOverwrite.addEventListener('click', () => {
    chrome.storage.local.get('deltaOverwrite', (values) => {
      console.log(values)
      chrome.storage.local.set({
        deltaOverwrite: !values.deltaOverwrite
      }, update);
    });
  }, false);
}, false);
