/*
    author:a.suresh.nandankar
    date: 12/16/16
*/

angular.module('hmk-schema',["hmk-constants"]).service('hmkschema', function (constants) {

    var dbObj = constants.database;
    var dbName = dbObj.name;// 'HMK';
    var schema = {
        stores: [{
                name: dbObj.questions.name,
                keyPath: dbObj.questions.keyPath,
                indexes: [
                    {
                        keyPath: dbObj.questions.indexes.parentQId,
                        unique: false
                    }
                ],
                dispatchEvents: true
            },
			{
                name: dbObj.answers.name,
                keyPath: dbObj.answers.keyPath,
                indexes: [
                    {
                        keyPath: dbObj.answers.indexes.questionId,
                        unique: false
                    },
					{
                        keyPath: dbObj.answers.indexes.answerText,
                        unique: false
                    },
					{
                        keyPath: dbObj.answers.indexes.userId,
                        unique: false
                    }
                ],
                dispatchEvents: true
            }
		]
	};
    return {
        dbName : dbName,
        schema : schema
    };

});
