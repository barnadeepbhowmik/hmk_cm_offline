'use strict';

/* Controllers */


hmkApp.controller('surveyController1', ['ydbDatabase','constants', '$scope','$http', function(ydbDatabase,constants, $scope, $http) {	
    $scope.displayText = "This is Survey 1";    
    $scope.questionsList = new Array(0);
    $scope.answersList = new Array(0);
    $scope.qMap = constants.objectMap.questions;	

    var dataTOUpldate = new Array();
    var mainQueID = "";

    $scope.aMap = constants.objectMap.answers;
    var url = "/client_modules/dataXml/answers.xml";
    var JSONAnsData = '';

    // Read XML data
    $http({
      method: 'GET',
      url: url
    }).then(function successCallback(response) {
         // this callback will be called asynchronously
         // when the response is available
         // log("response:" + JSON.stringify(response.data));
         
         // Convert Xml to JSON Data
         var ansXml = response.data;
         var x2js = new X2JS();
         JSONAnsData = x2js.xml_str2json(ansXml);        
         log("JSONANSDATA:::" + JSON.stringify(JSONAnsData));        
      }, function errorCallback(response) {
        // called asynchronously if an error occurs
        // or server returns response with an error status.
        console.log("error");
        console.log(response);
      });  
    

    // READ OPERATION
    ydbDatabase.getTotalRecordCount("questions",function (records) {        
        log("getTotalRecordCount callback...");
        log(records);
    },
    function (error) {
        log("error");
        log(error);
    });

    ydbDatabase.getAllRecords("questions",false, function (records) {        
        log("getAllRecords callback...question object");
        log(records);
        $scope.questionsList = records;
        $scope.$apply();         
    },
    function (error) {
        log("error");
        log(error);
    });
    
    
    // SET answered text to index DB and Render follow up question if any 
    $scope.setAnswerToIDB = function(index, answer, givenAnswerObject){  

        // Read question id from the curently answer question to search for child question. 
        var mainQueId = givenAnswerObject.questionId;
        log("MainQueID::"+mainQueId);        
        log("INDEX:"+index)
        mainQueID = mainQueId

        // insert answer object to Index DB - for testing purpose now ** Need to change as sync later.
        ydbDatabase.insertBulkData(JSONAnsData.answers.answer, "answers",$scope.aMap);

        // save the currently answered question answer in question object store
        ydbDatabase.saveObjectToDBStore("questions", answer, givenAnswerObject, index, function (records) {        
            log("saveObjectToDBStore callback...");                       
            $scope.$apply(); 

            // check for follow up question if yes render follow up question.
            // get the answer object

            ydbDatabase.getAllRecords("answers",false, function (records) {        
                log("getAllRecords callback: answer object");
                log(records);
                $scope.answersList = records;
                $scope.$apply();                

                dataTOUpldate = $scope.questionsList;

                // Remove follow up queston if any for current questionID                
                removeFollowUpQuestion();

                // Find follow up question       
                var occuranceFlag = true;
                angular.forEach($scope.answersList, function(value, key) {                 
                    var parentId = value.questionId;
                    var parentAns = value.parentAns;

                    var obj = {};

                    // if follow up question found : create the question object from the answer object
                    if(parentId === mainQueId && parentAns === answer){                       
                        occuranceFlag = false;
                        angular.forEach(dataTOUpldate, function(value1, key) {                                
                            angular.forEach($scope.qMap, function(mapObj, attr) {		                                
                                switch(attr){
                                    case "questionId":
                                        obj.questionId = value.answerId;
                                        break;
                                    case "question":  
                                        obj.question = value.answerText;
                                        break;
                                    case "answerType":  
                                        obj.answerType = value.answer_Type;
                                        break;
                                    case "answerOption":  
                                        obj.answerOption = value.answerOptions;
                                        break;
                                    case "parentQId":  
                                        obj.parentQId = value.questionId;
                                        break;
                                    case "givenAnswer":  
                                        obj.givenAnswer = ""
                                        break;

                                }
                            });                        
                        });                             
                    }
                    // insert newly created follow up question after it's parent index in our temp array and bind to scope var
                    dataTOUpldate.insert(index+1, obj);
                    log(dataTOUpldate);
                    $scope.questionsList = dataTOUpldate;
                    $scope.$apply(); 
                });
                /*if(occuranceFlag){
                    removeFollowUpQuestion();
                }*/

            },
            function (error) {
                log("error");
                log(error);
            });
        },
        function (error) {
            log("error");
            log(error);
        });        
    }

    //START:  Non - public Function handlers
    
    // Handler method used to insert data at particular index of an array without deleting existing data
    Array.prototype.insert = function (index, item) {
        this.splice(index, 0, item);
    };
    
    // Handler to Remove follow up question if main question answer changed.
    var removeFollowUpQuestion = function(){
        // Remove Follow up question if main question answer changed.
        angular.forEach(dataTOUpldate, function(value, key) {                           
            if(value.parentQId == mainQueID){
                dataTOUpldate.splice(key, 1);
                $scope.questionsList = dataTOUpldate;
                $scope.$apply();
            }
        });
    }
    var log = function(message){
        console.log(message);
    }
    
    //END:  Non - public Function handlers

    }]);