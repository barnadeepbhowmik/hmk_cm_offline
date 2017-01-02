'use strict';

/* Controllers */


hmkApp.controller('homePageController', ['ydbDatabase', '$scope', "constants", '$location', '$timeout','$http', function(ydbDatabase, $scope, constants, $location, $timeout, $http) {	
	
	$scope.displayText = "This is Home Page";
	$scope.qMap = constants.objectMap.questions;
    var url = "/client_modules/dataXml/question.xml";
    var JSONQueData = '';
    
    // Read XML data
    $http({
      method: 'GET',
      url: url
    }).then(function successCallback(response) {
         // this callback will be called asynchronously
         // when the response is available
         
         // Convert Xml to JSON Data
         var quesXml = response.data;
         var x2js = new X2JS();
         JSONQueData = x2js.xml_str2json(quesXml);
         $scope.loadData();
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log("error");
        console.log(response);
      });     
   
    // Load question Data		   
	$scope.loadData = function() {
			ydbDatabase.createIndexDB();
			ydbDatabase.clearObjectStore("questions,answers");
			ydbDatabase.insertBulkData(JSONQueData.questions.question, "questions",$scope.qMap);
			$timeout(function () {
				$location.path('/surveyPart1');			
			}, 1000);
			
	}
	
}]);