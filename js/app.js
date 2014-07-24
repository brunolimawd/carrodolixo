window.addEventListener('DOMContentLoaded', function() {

  'use strict';

  var translate = navigator.mozL10n.get;
  var buttonFindMe = document.getElementById('button-reload');
  var apiMaps = 'https://maps.googleapis.com/maps/api/geocode/json?';
  var errorMsg = document.getElementById('error');
  var results = document.getElementById('results');
  var request = null;
  var latitude = null;
  var longitude = null;
  var distance = '5000';


  // We want to wait until the localisations library has loaded all the strings.
  // So we'll tell it to let us know once it's ready.
  navigator.mozL10n.once(start);


  // Start App
  function start() {
    geoFindMe();
    
    // Display Control msg
    results.className = 'hidden';
    errorMsg.className = 'hidden';
  };

  // Show error msg
  function showError(text) {
    errorMsg.textContent = text;
    results.className = 'hidden';
    errorMsg.className = '';
  }

  // Get geolocation
  function geoFindMe() {
    function success(position) {
      latitude  = position.coords.latitude;
      longitude = position.coords.longitude;

      // Init search
      search();
    };

    function error() {
      showError(translate('unable_location'));
    };

    // Show status to user
    results.textContent = translate('locating');
    results.className = 'searching';
    errorMsg.className = 'hidden';

    navigator.geolocation.getCurrentPosition(success, error);
  };


  // Listening reload button
  buttonFindMe.addEventListener('click', function(e) {
      geoFindMe();
  }, false);


  // Get photos by location on Instagram
  function search() {
    // Are we searching already? Then stop that search
    if(request && request.abort) {
      request.abort();
    }

    // Show status to user
    results.textContent = translate('searching');
    results.className = 'searching';
    errorMsg.className = 'hidden';

    // Creat url for request
    //var term = 'latlng=' + latitude + ',' + longitude;
    var term = 'latlng=-8.069443,-34.899722';
    var url = apiMaps + term;
    console.log(url);

    request = new XMLHttpRequest({ mozSystem: true });
    request.open('get', url, true);
    request.responseType = 'json';

    // Return for request
    request.addEventListener('error', onRequestError);
    request.addEventListener('load', onRequestLoad);

    request.send();
  };


  // Request error msg
  function onRequestError() {
    console.log(request.error);    
    showError(translate('searching_error'));
  };

  // Request and load complete
  function onRequestLoad() {
    var response = request.response;

    // Check response
    if(response === null) {
      showError(translate('searching_error'));
      return;
    }

    // Clear results content
    results.textContent = '';
    results.className = '';

    var city = response.results[0].address_components[3].long_name;
    var street = response.results[0].address_components[1].long_name;

    console.log(street + ', ' + city);

    if(city == 'Recife') {

    } else {
      showError(translate('city_error'));
    }
    
    // if(photos.length === 0) {
    //   results.textContent = translate('search_no_results');
    //   results.className = 'searching';
    //   errorMsg.className = 'hidden';
    // } else {
    //   var listPhotos = document.createElement('ul');
    //   results.appendChild(listPhotos);

    //   photos.forEach(function(item) {
    //     // We're using textContent because inserting content from external sources into your page using innerHTML can be dangerous.
    //     // https://developer.mozilla.org/Web/API/Element.innerHTML#Security_considerations
    //     var liPhoto = document.createElement('li');
    //     var header = document.createElement('header');
    //     var profileAvatar = document.createElement('img');
    //     var profileName = document.createElement('h2');
    //     var timeAgo = document.createElement('span');
    //     var wrapPhoto = document.createElement('figure');
    //     var photo = document.createElement('img');
    //     var photoCaption = document.createElement('figcaption');
    //     var photoMenu = document.createElement('menu');
    //     var liShare = document.createElement('li');
    //     var buttonSahre = document.createElement('button');

    //     // Set values
    //     liPhoto.className = 'photo';
    //     profileAvatar.src = item.user.profile_picture;
    //     profileAvatar.alt = item.user.username;
    //     profileName.textContent = item.user.full_name;
    //     timeAgo.className = 'time-ago';
    //     photo.src = item.images.low_resolution.url;
    //     if ( item.caption ) {
    //       photoCaption.textContent = item.caption.text;  
    //     }
    //     photo.alt = 'Photo by ' + item.user.username;        
    //     photoMenu.type = 'toolbar';
    //     buttonSahre.className = 'button-share';
    //     buttonSahre.value = item.link;
    //     buttonSahre.textContent = 'Share';

    //     // Creat photo template 
    //     header.appendChild(profileAvatar);
    //     header.appendChild(profileName);
    //     header.appendChild(timeAgo);
        
    //     wrapPhoto.appendChild(photo);
    //     wrapPhoto.appendChild(photoCaption);

    //     liShare.appendChild(buttonSahre);
    //     photoMenu.appendChild(liShare);
        
    //     liPhoto.appendChild(header);
    //     liPhoto.appendChild(wrapPhoto);
    //     liPhoto.appendChild(photoMenu);

    //     listPhotos.appendChild(liPhoto);

    //   });
    // }

    results.className = '';
  };
});
