'use strict';

/* Controllers */


hmkApp.controller('surveyController2', ['indexedDBService', '$scope', function(indexedDBService, $scope) {
	$scope.displayText = indexedDBService.page2Msg;
}]);