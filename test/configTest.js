/**
 * Created by massi on 27/07/15.
 */
var config=new (require(__dirname+'/../index.js'))();
var configB=new (require(__dirname+'/../index.js'))();



config.set("callback.keynotset",true);
console.log("VALUE "+config.get("callback.keynotset"));
console.log("VALUE "+config.get("callback.keynotset","PLUTO"));
console.log("VALUE "+config.get("callback.keynotset1","PLUTO"));


config.print();