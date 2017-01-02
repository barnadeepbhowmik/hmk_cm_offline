'use strict';


hmkApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
	  when('/', {
        templateUrl: 'client_modules/home_Page_module/template.html',
        controller: 'homePageController'
      }).
      when('/surveyPart1', {
        templateUrl: 'client_modules/survey_part1_module/template.html',
        controller: 'surveyController1'
      }).
      when('/surveyPart2', {
        templateUrl: 'client_modules/survey_part2_module/template.html',
        controller: 'surveyController2'
      }).
      otherwise({
        redirectTo: '/surveyPart1'
      });
  }
]);