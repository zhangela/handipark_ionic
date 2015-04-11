angular.module('handipark.controllers', ['firebase'])

.controller('MapCtrl', function($scope, $firebaseObject, $firebaseArray, $ionicLoading) {

  var ref = new Firebase("https://sizzling-heat-4912.firebaseio.com");
  var data = $firebaseObject(ref);
  $scope.parkingSpots = $firebaseArray(ref.child('parkingSpots'))
  data.$bindTo($scope, "data");

  // this waits for the data to load and then logs the output. Therefore,
  // data from the server will now appear in the logged output. Use this with care!
  data.$loaded()
    .then(function() {
      _.each($scope.data.parkingSpots, function(parkingSpot, index, list) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(parkingSpot.lat, parkingSpot.lng),
            map: $scope.map
        });
      });
    })
    .catch(function(err) {
      console.error(err);
    });


  $scope.mapCreated = function(map) {
    $scope.map = map;
    $scope.directionsDisplay = new google.maps.DirectionsRenderer();
    $scope.directionsService = new google.maps.DirectionsService();
    $scope.directionsDisplay.setMap($scope.map);

    $scope.centerOnMe();

    google.maps.event.addListener($scope.map, 'click', function(event) {

      var marker = new google.maps.Marker({
          position: event.latLng,
          map: $scope.map
      });

      var addParkingSpot = function(lat, lng) {
        console.log('$scope.data.parkingSpots', $scope.data.parkingSpots);
        $scope.parkingSpots.$add({
          lat: lat,
          lng: lng
        });
      };

      addParkingSpot(event.latLng.lat(), event.latLng.lng());

      google.maps.event.addListener(marker, 'click', function(event) {
        navigator.geolocation.getCurrentPosition(function (pos) {
          var start = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          var end = marker.position;

          var url = 'http://maps.google.com/maps?saddr=' + start.lat() + ',' + start.lng() + '&daddr=' + end.lat() + ',' + end.lng();
          navigator.app.loadUrl(url, { openExternal:true })

        }, function (error) {
          console.log('Unable to get location: ' + error.message);
        });

      });
    });

  };

  $scope.centerOnMe = function () {
    if (!$scope.map) {
      return;
    }

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    navigator.geolocation.getCurrentPosition(function (pos) {
      $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
      $scope.loading.hide();
    }, function (error) {
      console.log('Unable to get location: ' + error.message);
    });
  };

});
