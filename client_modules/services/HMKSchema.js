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
                        keyPath: dbObj.questions.indexes.isFollowUpQue,
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
                        keyPath: dbObj.answers.indexes.que_Id,
                        unique: false
                    }
                ],
                dispatchEvents: true
            },
            {
                name: dbObj.statusMatrix.name,
                keyPath: dbObj.statusMatrix.keyPath,
                indexes: [
                    {
                        keyPath: dbObj.statusMatrix.indexes.followUp_qid,
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
