'use strict';

/* Controllers */


hmkApp.controller('surveyController1', ['indexedDBService', '$scope', function(indexedDBService, $scope) {
	$scope.displayText = indexedDBService.page1Msg;
}]);