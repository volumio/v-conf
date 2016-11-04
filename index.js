/**
 * Created by Massimiliano Fanciulli on 27/07/15.
 * If you need any information write me at fanciulli@gmail.com
 */
var fs=require('fs-extra');
var Multimap = require('multimap');

module.exports=Config;

function Config()
{
    var self=this;
    
    self.persistence=new (require(__dirname+'/file_persistence.js'))();
    self.dataStore=new (require(__dirname+'/data_store.js'))(self.persistence);

    self.callbacks=new Multimap();
}


/**
 * This method loads the configuration from a file. If the file is not found or cannot be opened for some reason,
 * the content is set to empty. The method is synchronous if no callback is provided, asynchronous otherwise
 * @param file The path of the configuration file to load.
 * @param callback Callback method that is invoked when load is completed. Function shall accept (err,data)
 */
Config.prototype.loadFile=function(file,callback)
{
    if(callback === undefined)
	this.persistence.loadFile(file,this.dataStore);
    else
        this.persistence.loadFile(file,this.dataStore,callback);
};

/**
 * This method saves the data to disk.
 */
Config.prototype.save=function()
{
    this.persistence.save();
};


/**
 * This method returns true or false depending on the existence of a key in the configuration file
 * @param key Key to check
 * @returns {boolean} True if key exists, false otherwise
 */
Config.prototype.has=function(key)
{
    return this.dataStore.has(key);
};

/**
 * This method returns the object associated to the key
 * @param key Object to return
 * @param def Default value if key is not found
 * @returns The value associated to key, default if not found and passed to method, undefined otherwise.
 */
Config.prototype.get=function(key,def)
{
    return this.dataStore.get(key);
};


/**
 * This method sets the provided value to the key.
 * @param key Key to update
 * @param value The value to set
 */
Config.prototype.set=function(key,value)
{
    this.dataStore.set(key);
    this.callbacks.forEach(function (callback, ckey) {
        if(key==ckey)
        {
            callback(value);
        }
    });
};


/**
 * This method add a configuration to the internal data.
 * @param key Key to add
 * @param type Type of the parameter to add
 * @param value The value of the parameter to add
 */
Config.prototype.addConfigValue=function(key,type,value)
{
   return this.dataStore.addConfigValue(key,type,value);
};





/**
 * This method prints the internal data to console
 */
Config.prototype.print=function()
{
    console.log(JSON.stringify(this.dataStore.data));
};

/**
 * This method searches for the key and deletes it
 * @param key
 */
Config.prototype.delete=function(key)
{
    this.dataStore.delete(key);
    this.callbacks.delete(key);
};

/**
 * This method returns all the keys children to the one apssed a parameter
 * @param key key to evaluate
 */
Config.prototype.getKeys=function(parentKey)
{
    return this.dataStore.getKeys(parentKey);
};

/**
 * This method registers callbacks for set and delete
 * @param key Key to associate callback to
 * @param value The callback method to run
 */
Config.prototype.registerCallback=function(key,callback)
{
    this.callbacks.set(key,callback);
};
