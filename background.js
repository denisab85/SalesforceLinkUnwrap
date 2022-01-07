const safelinksRegex =
  /^https:\/\/[^\.]+\.safelinks\.protection\.outlook\.com\/\?/;

const urldefenseRegex = /https:\/\/urldefense.com\/.*?\/__(.*?)__;.*?\$/;

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    var url = details.url;
    if (url.includes("salesforce.com")) {
      if (url.match(safelinksRegex)) {
        url = unSafeLinks(url);
      }
      if (url.match(urldefenseRegex)) {
        url = unUrlDefense(url);
      }
      url = replaceStars(url);
      console.log("Salesforce link unwrapped: " + url);
      displayNotification("Salesforce link unwrapped:", url);
    }
    return { redirectUrl: url };
  },
  { urls: ["https://*.safelinks.protection.outlook.com/*"] },
  ["blocking"]
);

function unSafeLinks(url) {
  url = url.replace(safelinksRegex, "");
  var terms = url.split("&");
  var i;
  for (i = 0; i < terms.length; i++) {
    var s = terms[i].split("=");
    if (s[0] === "url") {
      return decodeURIComponent(s[1]);
    }
  }
}

function unUrlDefense(url) {
  return url.replace(urldefenseRegex, "$1");
}

function replaceStars(url) {
  return url.replaceAll("*", "%");
}

function displayNotification(title, message) {
  var opt = {
    iconUrl: "images/cloud-128.png",
    type: "basic",
    title,
    message,
    priority: 1,
  };
  chrome.notifications.create(opt, function () {});
}
