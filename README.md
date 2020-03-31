# sample-cosmosdb-script for building a purge system 



sample code to explian how to build a purge with cosmosdb Mongo API 3.6 



this sample show you different technique to build a purge with cosmosdb mongo API 3.6 


## Setup instructions


1  create a new Azure Cosmos DB account for mongo API : .



    - Do not enable multi-region writes or geo-redundancy. 



    - install mongo shell 3.6 in your laptop ( not less than 3.6 shell) , or use the shell inside the portal 



2 Init  the environement  
With mongo command run the init.js file https://github.com/emdeletaede/build-a-purge-script-with-cosmosdb-mongo-API/blob/master/init.js

we will create a new DB testbulk with a collection inside and insert in bulk sample document .  this will create one DB test and one collection col1 with information multiple line with a json document format {x:;y:} , and one index


3 begin some test of delete 
    to delete you have 3 options : 
       - Deletemany command 
       - use bulkremove command
       - use bulkremoveOne command
. 


lets try a deletemany with the command db.col.deleteMany({"y":2}) the result is delete 100 lines and when i made a db.runCommand({ getLastRequestStatistics: 1 } ) to have the last information i have the following statistics 
{
        "CommandName" : "delete",
        "RequestCharge" : 1110.669999999998,
        "RequestDurationInMilliSeconds" : NumberLong(713),
        "ActivityId" : "44d4febb-f72d-4c43-bf98-d733747d22e7",
        "ok" : 1
}

the cost in RU is high , the command is very quick 

lest s try another method with a bulk remove command 

var bulk = db.col.initializeUnorderedBulkOp();bulk.find( { "y" : 3 } ).remove();bulk.execute()
BulkWriteResult({
        "writeErrors" : [ ],
        "writeConcernErrors" : [ ],
        "nInserted" : 0,
        "nUpserted" : 0,
        "nMatched" : 0,
        "nModified" : 0,
        "nRemoved" : 100,
        "upserted" : [ ]
})
globaldb:PRIMARY> db.runCommand({ getLastRequestStatistics: 1 } )
{
        "CommandName" : "delete",
        "RequestCharge" : 1106.269999999998,
        "RequestDurationInMilliSeconds" : NumberLong(701),
        "ActivityId" : "bea6ba12-c222-4579-a9a8-25b0203f12f5",
        "ok" : 1
}

same the bulk command delete all the field ask in one shot and the cost is a little less expensive than before and time a little quicker . 

let s try the last method with a removeOne method . you just need to be sure an index is build on the field you want to delete 

1 we will count the number of field to delete 
 var max = db.col.find({y:7}).count();

2 we will delete all the field in a loop with removeOne 
while (max > 0) { var bulk = db.col.initializeUnorderedBulkOp();bulk.find( {y:7} ).removeOne();bulk.execute();max --;}
1
the operation will take more time , but when we look in the statistics , every delete take a charge of 10 RU 
db.runCommand({ getLastRequestStatistics: 1 } )
{
        "CommandName" : "delete",
        "RequestCharge" : 10.69,
        "RequestDurationInMilliSeconds" : NumberLong(12),
        "ActivityId" : "dc82dca6-8c76-444f-b802-5c157f9b2cfa",
        "ok" : 1
}

so the total time is longueur but you will need less RU/ secondes 



to be continue 
