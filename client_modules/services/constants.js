
/*
    author:a.suresh.nandankar
    date: 12/16/16
*/

angular.module('hmk-constants',[]).constant('constants', {
    data : 'data/v1.0/',
    database : {
        name: 'HMK',
        questions: {
            name: 'questions',
            keyPath: 'questionId',
            indexes: { 
				//questionId: "questionId",		
                question: 'question',           
                answerType: 'answerType',
                answerOptions: 'answerOption',
				parentQId : "parentqId",
                givenAnswer: ""
			}
        },
		answers :{
			name: 'answers',
            keyPath: 'answerId',
            indexes: { 					
                parentAns :"parentAns",
                questionId: 'questionId',           
                userId: 'userId',
                answerText: 'answerText',  
                answerOptions : 'answerOptions',
                answer_Type : 'answer_Type'
			}
		}
    },
    objectMap:{     
        questions: {          
            "questionId": "questionId_c",
            "question": "question_c",
            "answerType": "answerType_c",        
            "answerOption": "answerOptions_c",
			"parentQId" : "parentqId_c",
            "givenAnswer": "givenAnswer_c"
        },
		answers: {          
            "answerId": "answerId_c",
            "parentAns":"parentAns_c",
            "questionId": "questionId_c",
            "userId": "userId_c",        
            "answerText": "answerText_c",
            "answerOptions" : "answerOptions_c",
            "answer_Type" : "answer_Type_c"
        }      		
    }
});
