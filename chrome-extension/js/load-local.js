const loadLocalCSS = () => {
  const links = document.querySelectorAll('link[href^="https://rawgit.com/chenrygit"]')
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    let remote = link.getAttribute('data-delta-override')
    if (!remote) {
      remote = link.getAttribute('href')
    }

    const local = chrome.runtime.getURL(remote.replace("https://rawgit.com/chenrygit/CACR/master", ""))

    link.setAttribute('data-delta-override', remote);
    link.setAttribute('href', '');
  }

  document.body.classList.add('v2');

  const isAgency = window.location.pathname.startsWith('/agency/') || window.location.pathname.startsWith('/content/agency/')
  const isCorporate = window.location.pathname.startsWith('/corporate/') || window.location.pathname.startsWith('/content/corporate/')

  chrome.runtime.getManifest()["web_accessible_resources"].forEach((file) => {
    if (isAgency) {
      if (file.startsWith('agency')) {
        addStylesheet(file);
      }
    } else if (isCorporate) {
      if (file.startsWith('corporate')) {
        addStylesheet(file);
      }
    }
  })
}

const addStylesheet = (href) => {
  const head = document.querySelector('head');
  const link = document.createElement('link');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.className = "delta-override";

  link.href = chrome.runtime.getURL(`${href}`);
  head.appendChild(link);
}

const unloadLocalCSS = () => {
  const existinglinks = document.querySelectorAll('link[data-delta-override]')
  for (let i = 0; i < existinglinks.length; i++) {
    const existinglink = existinglinks[i];
    let remote = existinglink.getAttribute('data-delta-override')
    existinglink.setAttribute('href', remote);
  }

  document.body.classList.remove('v2');
  const head = document.querySelector('head');
  const links = document.querySelectorAll('link.delta-override')
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    head.removeChild(link);
  }
}

const queryDelta = () => {
  chrome.storage.local.get(['deltaOverwrite'], (values) => {
    if (values.deltaOverwrite == true) {
      loadLocalCSS();
    } else {
      unloadLocalCSS();
    }
  });
}

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace == 'local') {
    queryDelta()
  }
});

queryDelta();
