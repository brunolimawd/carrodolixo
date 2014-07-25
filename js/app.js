window.addEventListener('DOMContentLoaded', function() {

  'use strict';

  var translate = navigator.mozL10n.get;
  var buttonFindMe = document.getElementById('button-reload');
  var apiMaps = 'https://maps.googleapis.com/maps/api/geocode/json?';
  var resourceIdCDR = 'f4ca6471-bb7b-4412-b248-d522948aa789'
  var apiCDR = 'http://dados.recife.pe.gov.br/api/action/datastore_search?resource_id=' + resourceIdCDR;
  var errorMsg = document.getElementById('error');
  var results = document.getElementById('results');
  var request = null;
  var latitude = null;
  var longitude = null;


  // We want to wait until the localisations library has loaded all the strings.
  // So we'll tell it to let us know once it's ready.
  navigator.mozL10n.once(start);


  // Start App
  function start() {
   
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
      searchStreet();
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
  function searchStreet() {
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
    request.addEventListener('error', onRequestStreetError);
    request.addEventListener('load', onRequestStreetLoad);

    request.send();
  };


  // Request error msg
  function onRequestStreetError() {
    console.log(request.error);    
    showError(translate('searching_error'));
  };

  // Request and load complete
  function onRequestStreetLoad() {
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

    if(city == 'Recife') {
      var typeStreet = street.split(' ');
      typeStreet = typeStreet[0];

      switch(typeStreet) {
        case 'Rua':
          street = street.replace('Rua', 'R');
          searchTimeTrash(street);
          break;
        default:
          console.log(typeStreet);
          break;
      }
    } else {
      showError(translate('city_error'));
    }

    results.className = '';
  };

  // Get photos by location on Instagram
  function searchTimeTrash(street) {
    // Are we searching already? Then stop that search
    if(request && request.abort) {
      request.abort();
    }

    // Show status to user
    results.textContent = translate('searching');
    results.className = 'searching';
    errorMsg.className = 'hidden';

    // Creat url for request
    var term = '&limit=10&q=' + street;
    var url = apiCDR + term;

    request = new XMLHttpRequest({ mozSystem: true });
    request.open('get', url, true);
    request.responseType = 'json';

    // Return for request
    request.addEventListener('error', onRequestCDRError);
    request.addEventListener('load', onRequestCDRLoad);

    request.send();
  };

  // Request error msg
  function onRequestCDRError() {
    console.log(request.error);    
    showError(translate('searching_error'));
  };

  // Request and load complete
  function onRequestCDRLoad() {
    var response = request.response;

    // Check response
    if(response === null) {
      showError(translate('searching_error'));
      return;
    }

    // Clear results content
    results.textContent = '';
    results.className = '';

    var time = response.result.records[0].intervalo;
    console.log(time);
    
    results.className = '';
  };
});
