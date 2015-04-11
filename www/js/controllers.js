angular.module('handipark.controllers', ['firebase'])

.controller('MapCtrl', function($scope, $firebaseObject, $firebaseArray, $ionicLoading) {

  var ref = new Firebase("https://sizzling-heat-4912.firebaseio.com");
  var data = $firebaseObject(ref);

  $scope.parkingSpots = $firebaseArray(ref.child('parkingSpots'))
  data.$bindTo($scope, "data");

  $scope.mapCreated = function(map) {
    $scope.map = map;
    $scope.directionsDisplay = new google.maps.DirectionsRenderer();
    $scope.directionsService = new google.maps.DirectionsService();
    $scope.directionsDisplay.setMap($scope.map);
    $scope.centerOnMe();
    var markers = [];

    // Add a marker to the map and push to the array.
    function addMarker(location) {
      var marker = new google.maps.Marker({
        position: location,
        map: map
      });
      markers.push(marker);
      return marker;
    }

    // Sets the map on all markers in the array.
    function setAllMap(map) {
      for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
      }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
      setAllMap(null);
    }

    // Shows any markers currently in the array.
    function showMarkers() {
      setAllMap(map);
    }

    // Deletes all markers in the array by removing references to them.
    function deleteMarkers() {
      clearMarkers();
      markers = [];
    }

    var addParkingSpot = function(lat, lng) {
      console.log('$scope.data.parkingSpots', $scope.data.parkingSpots);
      $scope.parkingSpots.$add({
        lat: lat,
        lng: lng
      });
    };


    $scope.$watchCollection('parkingSpots', function(newParkingSpots, oldParkingSpots) {
      clearMarkers();
      deleteMarkers();

      _.each($scope.parkingSpots, function(parkingSpot, index, list) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(parkingSpot.lat, parkingSpot.lng),
            map: $scope.map
        });
      });
    });


    google.maps.event.addListener($scope.map, 'click', function(event) {

      var marker = addMarker(event.latLng);
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
