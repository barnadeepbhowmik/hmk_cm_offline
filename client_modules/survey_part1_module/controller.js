'use strict';

/* Controllers */


hmkApp.controller('surveyController1', ['ydbDatabase','constants', '$scope','$http', function(ydbDatabase,constants, $scope, $http) {	
    $scope.displayText = "This is Survey 1";    
    $scope.questionsList = new Array(0);
    $scope.answersList = new Array(0);
    var qMap = constants.objectMap.questions;
    var aMap = constants.objectMap.answers;
    
    var allQuestions = new Array(0);
    var statusMatrix = new Array(0);

    var dataTOUpldate = new Array();
    var mainQueID = "";

    var statusMatrixMap = constants.objectMap.statusMatrix;
    var url = "/client_modules/assets/dataXml/StatusMatrix.xml";
    var JSONStatusMtrxData = '';

    // Read XML data
    $http({
      method: 'GET',
      url: url
    }).then(function successCallback(response) {       
         // Convert Xml to JSON Data
         var sxml = response.data;
         var x2js = new X2JS();
         JSONStatusMtrxData = x2js.xml_str2json(sxml);                 
         // insert statux matrix object to Index DB 
        ydbDatabase.insertBulkData(JSONStatusMtrxData.statusMatrix.matrix, "statusMatrix", statusMatrixMap, function (response) { 
                log("insertBulkData success - > statusMatrix")
                ydbDatabase.getAllRecords("statusMatrix",false, function (records) {        
                    statusMatrix = records;
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
      }, function errorCallback(response) {       
            log("error");
            log(response);
      });  
     
   

    // READ OPERATION
    ydbDatabase.getTotalRecordCount("questions",function (records) {        
        log("getTotalRecordCount success - > questions");
        log(records);
    },
    function (error) {
        log("error");
        log(error);
    });

    ydbDatabase.getAllRecords("questions",false, function (records) {        
        log("getAllRecords success - > questions");
        log(records);
        allQuestions = records;
        var mainQues = new Array(0);
        
        angular.forEach(records, function(record, i) {
            if(record.isFollowUpQue == "false"){
                mainQues.push(record);
            }
        });
        
        $scope.questionsList = mainQues;
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
        mainQueID = mainQueId;        
       
        var selectedAnsList = {};
        selectedAnsList.answers = {}
        selectedAnsList.answers.answer = {};
        selectedAnsList.answers.answer.ans_txt = answer;
        selectedAnsList.answers.answer.que_Id = mainQueId;
        selectedAnsList.answers.answer.user_id = "Test User";      
        
        ydbDatabase.insertBulkData(selectedAnsList.answers.answer, "answers", aMap , function (response) { 
                log("insertBulkData - individual answer inserted in Index DB - ANSWER OBJ");
                selectedAnsList = new Array(0);
            },
            function (error) {
                log("error");
                log(error);
            });
       
        removeFollowUpQue();
        
        // check with qid and answer text to find follow up question ID in status Matrix        
        angular.forEach(statusMatrix, function(key,value){
              if(mainQueID === key.que_Id && answer === key.answer_text){
                 var followUpQueId = key.followUp_qid;
                 angular.forEach(allQuestions, function(key,value){
                      if(key.questionId === followUpQueId){
                          // Found the follow up question                         
                          var objectToPush = key;
                          var updateQueArr = new Array(0);
                          updateQueArr = $scope.questionsList;
                          angular.forEach(updateQueArr, function(key, index){
                              if(key.questionId === mainQueID){
                                    updateQueArr.insert(index+1, objectToPush);
                                    log(updateQueArr);
                                    $scope.questionsList = updateQueArr;                                   
                              }
                          });
                      }
                 });
              }
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
     // Handler to Remove follow up question if main question answer changed.
    var removeFollowUpQue = function(){
        // Remove Follow up question if main question answer changed.
        var alteredQuestionList = $scope.questionsList;
        var idToRemove = new Array(0);
        angular.forEach(statusMatrix, function(value, key) {                           
            if(value.que_Id == mainQueID){
                idToRemove.push(value.followUp_qid);
            }
        });
        angular.forEach(idToRemove,function(key,value){
            var qId = key;
            angular.forEach(alteredQuestionList, function(key,index){
                    if(key.questionId == qId){
                        alteredQuestionList.splice(index, 1);
                    }
            });
        });
        $scope.questionsList = alteredQuestionList;       
    }
    var log = function(message){
        console.log(message);
    }
    
    //END:  Non - public Function handlers

    }]);