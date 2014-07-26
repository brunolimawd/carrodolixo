window.addEventListener('DOMContentLoaded', function() {

  'use strict';

  var translate = navigator.mozL10n.get;
  var buttonFindMe = document.getElementById('button-get-time');
  var apiMaps = 'https://maps.googleapis.com/maps/api/geocode/json?';
  var resourceIdCDR = 'f4ca6471-bb7b-4412-b248-d522948aa789'
  var apiCDR = 'http://dados.recife.pe.gov.br/api/action/datastore_search?resource_id=' + resourceIdCDR;
  var errorMsg = document.getElementById('error');
  var timeRemoveError = null;
  var results = document.getElementById('results');
  var home = document.getElementById('home');
  var status = document.getElementById('status');
  var request = null;
  var latitude = null;
  var longitude = null;
  var streetFull = null;
  var streetName = document.getElementById('street-name');
  var schedule = document.getElementById('schedule');
  var turn = document.getElementById('turn');
  var frequency = document.getElementById('frequency');


  // We want to wait until the localisations library has loaded all the strings.
  // So we'll tell it to let us know once it's ready.
  navigator.mozL10n.once(start);


  // Start App
  function start() {
   
    // Display Control msg
    results.className = 'out';
    errorMsg.className = 'out';
  };

  // Show error msg
  function showError(text) {
    errorMsg.textContent = text;
    home.className = '';
    results.className = 'out';
    status.className = 'out';
    errorMsg.className = '';

    if(timeRemoveError){
      clearTimeout(timeRemoveError);
    }

    timeRemoveError = setTimeout(function(){
      errorMsg.className = 'out';
    }, 5000);
  };

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
    home.className = 'out';
    results.className = 'out';
    status.className = '';
    errorMsg.className = 'out';

    navigator.geolocation.getCurrentPosition(success, error);
  };


  // Listening get-time button
  buttonFindMe.addEventListener('click', function(e) {
      geoFindMe();
  }, false);


  // Get street by location on Google Map API
  function searchStreet() {
    // Are we searching already? Then stop that search
    if(request && request.abort) {
      request.abort();
    }

    // Creat url for request
    var term = 'latlng=' + latitude + ',' + longitude;
    var url = apiMaps + term;

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

    var city = response.results[0].address_components[3].long_name;
    var street = response.results[0].address_components[1].long_name;
    streetFull = street;

    if(city == 'Recife') {
      var typeStreet = street.split(' ');
      typeStreet = typeStreet[0];

      switch(typeStreet) {
        case 'Rua':
          street = street.replace('Rua', 'R');
          searchTimeTrash(street);
          break;
        case 'Avenida':
          street = street.replace('Avenida', 'AV');
          searchTimeTrash(street);
          break;
        case 'Travessa':
          street = street.replace('Travessa', 'TV');
          searchTimeTrash(street);
          break;
        default:
          console.log(typeStreet);
          break;
      }
    } else {
      showError(translate('city_error'));
    }

  };

  // Get schedule on CDR
  function searchTimeTrash(street) {
    // Are we searching already? Then stop that search
    if(request && request.abort) {
      request.abort();
    }

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
      showError(translate('search_no_results'));
      return;
    }

    // Show status to user
    status.className = 'out';
    results.className = '';

    streetName.textContent = streetFull;
    schedule.textContent = response.result.records[0].intervalo;
    turn.textContent = response.result.records[0].turno.toLowerCase();
    frequency.textContent = response.result.records[0].frequencia.toLowerCase();    
  };
});
