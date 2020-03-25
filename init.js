
use testbulk;
db.runCommand({customAction: "CreateDatabase"});


use testbulk ;
db.runCommand({customAction: "CreateCollection", collection: "col", offerThroughput: 5000});

db.col1.createIndex({"x":1}, {background : true}); 

var bulk = db.col.initializeUnorderedBulkOp();
for (var i = 1; i <= 10; i++){for (var j = 1; j <= 10; j++){bulk.insert( { x : i , y : j } )}};
bulk.execute();


db.runCommand({customAction: "UpdateCollection", collection: "col", offerThroughput: 1000});

