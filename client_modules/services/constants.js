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
                question: 'question',           
                answerType: 'answerType',
                answerOptions: 'answerOption',
				isFollowUpQue: 'isFollowUpQue'
			}
        },
		answers :{
			name: 'answers',
            keyPath: 'user_id',
            indexes: { 					
                que_Id : 'que_Id',
                user_id: 'user_id',           
                ans_txt: 'ans_txt'               
			}
		},
		statusMatrix:{
			name: 'statusMatrix',
            keyPath: 'followUp_qid',
            indexes: { 					
                que_Id : 'que_Id',
                answer_text: 'answer_text',           
                followUp_qid: 'followUp_qid'               
			}
		}
    },
    objectMap:{     
        questions: {          
            "questionId": 'questionId_c',
            "question": 'question_c',
            "answerType": 'answerType_c',        
            "answerOption": 'answerOptions_c',
			"isFollowUpQue" : 'isFollowUpQue_c'
        },
		answers: {          
            "que_Id": 'que_Id',
            "user_id":'user_id',
            "ans_txt": 'ans_txt'
        },
      	statusMatrix:{
			 "que_Id" : 'que_Id',
             "answer_text": 'answer_text',       
             "followUp_qid": 'followUp_qid'
		}
    }
});


