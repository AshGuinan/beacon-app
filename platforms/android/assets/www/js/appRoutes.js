angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider
		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/user', {
			templateUrl: '192.168.0.39:8080/user',
			controller: 'UserController'
		})

		.when('/fail', {
			templateUrl: 'views/fail.html',
			controller: 'UserController'
		})

		.when('/places', {
			templateUrl: '192.168.0.39:8080/places',
			controller: 'PlaceController'
		})
		.when('/logout', {
			templateUrl: '192.168.0.39:8080/logout',
			controller: 'MainController'
		});

	$locationProvider.html5Mode(false);

}]);