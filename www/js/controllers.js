angular.module('handipark.controllers', [])

.controller('MapCtrl', function($scope, $ionicLoading) {
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

      google.maps.event.addListener(marker, 'click', function(event) {
        navigator.geolocation.getCurrentPosition(function (pos) {
          var start = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          var end = marker.position;

          // var request = {
          //   origin:start,
          //   destination:end,
          //   travelMode: google.maps.TravelMode.DRIVING
          // };

          // $scope.directionsService.route(request, function(result, status) {
          //   if (status == google.maps.DirectionsStatus.OK) {
          //     $scope.directionsDisplay.setDirections(result);
          //   }
          // });

          var url = 'http://maps.google.com/maps?saddr=' + start.lat() + ',' + start.lng() + '&daddr=' + end.lat() + ',' + end.lng();
          navigator.app.loadUrl(url, { openExternal:true })

        }, function (error) {
          alert(error);

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
      alert(error);
      console.log('Unable to get location: ' + error.message);
    });
  };

});
