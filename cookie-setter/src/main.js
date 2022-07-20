'use strict';

var cookieName = 'counter';

function getCookie(name) {
  var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value) {
  var updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  document.cookie = updatedCookie;
}

function renderCookie(value) {
  console.log('Current cookie ---> ' + value);
  var div = document.getElementById('cookie');
  div.innerHTML = "Current &#127850; value ".concat(value);
}

var btn = document.getElementById("btn");
btn.addEventListener('click', function (event) {
  document.cookie.split(";").forEach(function (c) {
    document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
  });
  location.reload();
});

window.onload = function () {
  var currentCookie = getCookie(cookieName);

  if (isNaN(currentCookie)) {
    currentCookie = 0;
  } else {
    currentCookie++;
  }

  setCookie(cookieName, currentCookie);
  renderCookie(getCookie(cookieName));
}