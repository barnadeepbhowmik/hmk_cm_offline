
/*
    author:a.suresh.nandankar
    date: 12/16/16
*/

angular.module('hmk-database',['hmk-constants', 'hmk-schema']).service('ydbDatabase', function (constants, hmkschema) {
	
	var dbName = hmkschema.dbName;
    var schema = hmkschema.schema;
	
	var ydbStorage = "";
	var dataToBeInserted = new Array(0);
	var numberOfRecordsFromIndexedDB = 101;
	
	
	var createIndexDB = function(){		
		ydbStorage = new ydn.db.Storage(dbName, hmkschema.schema);
	};
	
	var clearObjectStore = function (object_store){
		var obj = object_store.split(",");
		angular.forEach(obj, function(objectStore, key) {
		   log(key + ': ' + objectStore);
		   ydbStorage.clear(objectStore).then(function(){
				log("Cleaned object store...."+objectStore);
			});
		});
		
	}
	
	var insertBulkData = function(JSONdata,object_store,map, success_callback, failure_callback){		
	    saveJSONToDB(JSONdata, map, object_store);
		ydbStorage.put(object_store, dataToBeInserted).then(function(response){
			log("New data inserted....");	
            success_callback(response);
            dataToBeInserted = new Array(0);
		});		
	}
	
	
	var getTotalRecordCount = function(store_name,success_callback, failure_callback){
        if(!store_name){
            failure_callback(false);
        }else{
            ydbStorage.count(store_name).done(function(response){
                try {
                    if(!response){
                        failure_callback(0);
                    }else{
                        success_callback(response);						
                    }
                } catch (e) { log(e); }
            });
        }
    };
	
	var getAllRecords = function(store_name,callGetAllRecordsWithOutLimit,success_callback, failure_callback){
        if(callGetAllRecordsWithOutLimit){
            getAllRecordsWithOutLimit(store_name);
        }else{
            if(!store_name){
                failure_callback(false);
            }else{
                ydbStorage.values(store_name,null,numberOfRecordsFromIndexedDB,0,false).always(function(response){
                    try {
                        if(!response){
                            failure_callback(false);
                        }else{
                            success_callback(response);
                        }
                    } catch (e) { log(e); }
                });    
            }  
        }              
    };
    
    var getRecordOnId = function(store_name, key_path, success_callback, failure_callback){
        if(!store_name || ! key_path){
            failure_callback(false);
        }else{
            try{
                ydbStorage.get(store_name,key_path).always(function(response){
                    try {
                        if(!response){
                            success_callback(null);
                        }else{
                            success_callback(response);
                        }
                    } catch (e) { log(e); }
                });    
            }catch(error){
                store_name; key_path;
            }
                
        }
        
    };

    var saveObjectToDBStore= function(store_name, dataToUpdate, givenAnswerObject, index, success_callback, failure_callback){      
        givenAnswerObject.givenAnswer = dataToUpdate;
        
            try{                
                ydbStorage.put(store_name, givenAnswerObject).then(function(recordId){
                    success_callback(recordId);
                });  
            }catch(e){
               failure_callback(e);
            }    
       
    };

   
	//START:  Non - public Function handlers
	
	var saveJSONToDB = function (data, map, object_store){
		log("insertBulkData - > saveJSONToDB handler");       
        if(data.length != undefined){
            angular.forEach(data, function(dataObj, i) {
                  var temp_data = {};			 
                  angular.forEach(map, function(mapObj, attr) {	
                       Object.keys(dataObj).forEach(function(key){
                            var value = dataObj[key];
                            if(key === mapObj){
                                 temp_data[attr] = value;
                            }	

                       });
                 });
                 dataToBeInserted.push(temp_data);                 
            });
        }
        else{
             var temp_data = {};			 
                  angular.forEach(map, function(mapObj, attr) {	
                       Object.keys(data).forEach(function(key){
                            var value = data[key];
                            if(key === mapObj){
                                 temp_data[attr] = value;
                            }	

                       });
                 });
                 dataToBeInserted.push(temp_data);               
        }
	}	
    
    var log = function(message){
        console.log(message);
    }
	
	//END:  Non - public Function handlers
	
	return{ 
		createIndexDB : createIndexDB,
		clearObjectStore : clearObjectStore,
		insertBulkData : insertBulkData,
		getTotalRecordCount: getTotalRecordCount,		
		getAllRecords: getAllRecords,
        getRecordOnId: getRecordOnId,
        saveObjectToDBStore : saveObjectToDBStore
	}
	
});
