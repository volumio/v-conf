/**
 * Created by massi on 27/07/15.
 */
var config=new (require(__dirname+'/index.js'))();

config.loadFile(__dirname+'/testConfig.json');

console.log("KEYS: "+config.getKeys());
console.log("KEYS: "+config.getKeys('keys'));

var keys=config.getKeys('keys.fifth');
console.log("KEYS: "+keys);

for( var i in keys)
    console.log(keys[i]);

console.log("VALUE "+config.get('debug'));
console.log("VALUE "+config.get('env'));
console.log("VALUE "+config.get('structured.a'));
console.log("VALUE "+config.get('structured.b'));

config.set('debug',true);
config.set('env',"PRODUCTION");
config.set('structured.a',500);
config.set('structured.b',1000);

console.log("VALUE "+config.get('debug'));
console.log("VALUE "+config.get('env'));
console.log("VALUE "+config.get('structured.a'));
console.log("VALUE "+config.get('structured.b'));



console.log("VALUE "+config.get('music_services.dirble.enabled'));
config.addConfigValue('music_services.dirble.enabled','boolean',false);
console.log("VALUE "+config.get('music_services.dirble.enabled'));


console.log("THIS VALUE SHALL BE FALSE: "+config.has('not.existing.key'));

