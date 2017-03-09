angular.module('MainCtrl', []).controller('MainController', ['$scope', '$rootScope', '$http', function($scope, $rootScope, $http) {
	//$scope.user = 'Welcome!';
	$scope.radius = 1000;
	$scope.markers =[];
	$scope.playgrounds =[];
	var map;
	var markers = [];
	var service;

	function initMap() {
		var galway = new google.maps.LatLng(53.272931, -9.0631102);
		map = new google.maps.Map(document.getElementById('map'), {
			center: galway,
			zoom: 15
		});

		infowindow = new google.maps.InfoWindow();
		service = new google.maps.places.PlacesService(map);
		map.addListener("bounds_changed",$scope.search,false);

		service.nearbySearch({
			location: galway,
			radius: $scope.radius,
			type: ['movie_theater']
		}, callback);
	}

	$scope.search = function(){
		service.nearbySearch({
			location: map.getCenter(),
			radius: $scope.radius,
			type: ['cafe']
		}, callback);
	};

	function removeMarkers(){
		for(var i=0; i<markers.length; i++){
			markers[i].setMap(null);
		}
	}

	var clearMarker = document.getElementById("clearMarkers");
	clearMarker.addEventListener("click", removeMarkers, false);

	function callback(results, status, pagination) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				createMarker(results[i]);
				// console.log(results[i]);
			}
		}
		if (pagination.hasNextPage) {
			console.log('loading next page of results for radius' + $scope.radius);
			pagination.nextPage();
		}
	}

	function createMarker(place) {
		var marker = new google.maps.Marker({
			map: map,
			position: place.geometry.location
		});

		markers.push(marker);
		if(place.rating == undefined){
			place.rating = "No Rating Available"
		}
		if(place.price_level == undefined){
			place.rating = "No Rating Available"
		}
		google.maps.event.addListener(marker, 'click', function() {
			infowindow.setContent('<h3>' + place.name + '</h3>'+ '<p>'+ 'Address: ' +  place.vicinity + '</p>' +' Rating:' +place.rating + '<p>'+ 'Price Level' + place.price_level + '</p>');
			infowindow.open(map, this);
		});
	}


	$http.get('http://192.168.0.39:8080/me')
		.then(function (success){
			console.log("success getting user from /me endpoint", success);
            if(success.data.name!==""){
                $rootScope.user = success.data.name;
            }
			console.log($rootScope.user);
			console.log("Success: "+success);
		},function (error){
			console.log("error: " + error);
		});

	//Fetch playgrounds -- galway
	$scope.content = null;
	//$http.get('http://192.168.0.39:8080/data/galway_playgrounds.json').then(yay, nay);

	function yay(response) {
		$scope.contents = response;
		console.log('galway playgrounds loaded!');
		for (var i =0;i<response.data.data.length;i++){
			$scope.playgrounds.push(response.data.data[i].Playground + ', ' + response.data.data[i].Location_o);
			//console.log(i);
			console.log(response.data.data[i].Playground + ', ' + response.data.data[i].Location_o);

		}
	}
	function nay(response) {
		console.log('error loading playgrounds');
		console.log(response);
	}

	function loadGoogleMapsApi(){
		$scope.mapsApiRequested = true;
		console.log('fetching google script');
		$.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyAPPzjXf9bFp5KrONcTaFq0SMBAu884lCo&libraries=places',initMap)
	}

	function initMapOnceLoaded(){
		console.log("checking if google is loaded")
		if(typeof google != 'undefined'){
			console.log("google is loaded!")
			initMap();
		} else {
			setTimeout(initMapOnceLoaded, 1000)
		}
	}

	// if we have already requested the maps api, initialize the map once google is defined
	if ($scope.mapsApiRequested)
		initMapOnceLoaded()
	// otherwise request the api
	else
		loadGoogleMapsApi();
}]);