'use strict';

/* Controllers */


hmkApp.controller('homePageController', ['ydbDatabase', '$scope', "constants", '$location', '$timeout','$http', function(ydbDatabase, $scope, constants, $location, $timeout, $http) {	
    
	$scope.displayText = "This is Home Page";
	var qMap = constants.objectMap.questions;
    var url = "/client_modules/assets/dataXml/Question.xml";
    var JSONQueData = '';
    
    // Read XML data
    $http({
      method: 'GET',
      url: url
    }).then(function successCallback(response) {        
        // Convert Xml to JSON Data
             var quesXml = response.data;
             var x2js = new X2JS();
             JSONQueData = x2js.xml_str2json(quesXml);
             loadData();        
      }, function errorCallback(response) {       
            log("error");
            log(response);
      });     
   
    // Load question Data		   
	var loadData = function() {
			ydbDatabase.createIndexDB();
			ydbDatabase.clearObjectStore("questions,answers");
			ydbDatabase.insertBulkData(JSONQueData.questions.question, "questions", qMap, function (records) {        
                ydbDatabase.dataToBeInserted = new Array(0);
                $location.path('/surveyPart1');
                $scope.$apply();
                log("loadData -> insertBulkData - > success -> questions store")
            },
            function (error) {
                log("error");
                log(error);
            });
	}
    var log = function(message){
        console.log(message);
    }
}]);