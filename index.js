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

    self.autosave=true;
    self.autosaveDelay=1000;
    self.saved=true;
    self.data={};

    self.callbacks=new Multimap();
}


/**
 * This method loads the configuration from a file. If the file is not found or cannot be opened for some reason,
 * the content is set to empty
 * @param file The path of the configuration file to load.
 */
Config.prototype.loadFile=function(file)
{
    var self=this;

    self.filePath=file;

    try
    {
        self.data=fs.readJsonSync(file);
    }
    catch(ex)
    {
        self.data={};
    }

};

/**
 * This method searches the object associated to the provided key.
 * @param key Key to search. A string object
 * @returns The value associate to the key. If not key is given the whole configuration is
 * returned. If key doesn't exist a null value is returned
 */
Config.prototype.findProp=function(key)
{
    var self=this;

    if(key===undefined)
        return self.data;
    else
    {
        var splitItems=key.split('.');
        var currentProp=self.data;

        while (splitItems.length > 0) {
            var k = splitItems.shift();

            if(currentProp && currentProp[k]!==undefined)
                currentProp=currentProp[k];
            else
            {
                currentProp=null;
                break;
            }
        }

        return currentProp;
    }
};

/**
 * This method returns true or false depending on the existence of a key in the configuration file
 * @param key Key to check
 * @returns {boolean} True if key exists, false otherwise
 */
Config.prototype.has=function(key)
{
    var self=this;

    return self.findProp(key)!==null;
};


/**
 * This method returns the object associated to the key
 * @param key Object to return
 * @param def Default value if key is not found
 * @returns The value associated to key, default if not found and passed to method, undefined otherwise.
 */
Config.prototype.get=function(key,def)
{
    var self=this;
    var prop=self.findProp(key);

    if(prop!==undefined && prop
        !== null)
        return self.forceToType(prop.type,prop.value);
    else return def;
};

/**
 * This method sets the provided value to the key.
 * @param key Key to update
 * @param value The value to set
 */
Config.prototype.set=function(key,value)
{
    var self=this;
    var prop=self.findProp(key);

    if(prop!==undefined && prop !== null)
    {
        prop.value=self.forceToType(prop.type,value);
        self.scheduleSave();
    }
    else if(value!==undefined && value!==null)
    {
        var type=typeof value;
        self.addConfigValue(key,type,value);
    }

    self.callbacks.forEach(function (callback, ckey) {
        if(key==ckey)
        {
            callback(value);
        }
    });

};

/**
 * This method schedules saving the internal data to disk. Dump to disk is done if a file path is set.
 */
Config.prototype.scheduleSave=function()
{
    var self=this;

    if(self.filePath!==undefined)
    {
        self.saved=false;

        setTimeout(function()
        {
            self.save();
        },self.autosaveDelay);
    }

};

/**
 * This method saves the data to disk.
 */
Config.prototype.save=function()
{
    var self=this;

    if(self.saved===false)
    {
        self.saved=true;
        fs.writeJsonSync(self.filePath,self.data);
    }
};

/**
 * This method add a configuration to the internal data.
 * @param key Key to add
 * @param type Type of the parameter to add
 * @param value The value of the parameter to add
 */
Config.prototype.addConfigValue=function(key,type,value)
{
    var self=this;

    var splitted=key.split('.');
    var currentProp=self.data;

    while (splitted.length > 0) {
        var k = splitted.shift();

        if(currentProp && currentProp[k]!==undefined)
            currentProp=currentProp[k];
        else
        {
            currentProp[k]={};
            currentProp=currentProp[k];
        }
    }

    var prop=self.findProp(key);
    self.assertSupportedType(type);
    prop.type=type;


    prop.value=self.forceToType(type,value);

    self.scheduleSave();
};

/**
 * This method checks if the type passed as parameter is supported by the library
 * @param type type to check
 */
Config.prototype.assertSupportedType=function(type)
{
    if(type != 'string' && type!='boolean' && type!='number' && type!='array')
    {
        throw Error('Type '+type+' is not supported');
    }
};

/**
 * This method forces the value passed
 * @param key type to force value to
 * @param value The value to be forced
 */
Config.prototype.forceToType=function(type,value)
{
    if(type=='string')
    {
        return ''+value;
    }
    else if(type=='boolean')
    {
        return Boolean(value);
    }
    else if(type=='number')
    {
        var i = Number(value);
        if(Number.isNaN(i))
            throw  Error('The value '+value+' is not a number');
        else return i;
    }
    else return value;

};

/**
 * This method prints the internal data to console
 */
Config.prototype.print=function()
{
    var self=this;

    console.log(JSON.stringify(self.data));
};

/**
 * This method searches for the key and deletes it
 * @param key
 */
Config.prototype.delete=function(key)
{
    var self=this;

    if(self.has(key))
    {
        var splitted=key.split('.');

        if(splitted.length==1)
            delete self.data[key];
        else
        {
            var parentKey=self.data;
            for(var i=0;i< splitted.length;i++)
            {
                var k = splitted.shift();
                parentKey=parentKey[k];
            }

            var nextKey=splitted.shift();
            delete parentKey[nextKey];
        }

        self.scheduleSave();
    }

    self.callbacks.delete(key);
};

/**
 * This method returns all the keys children to the one apssed a parameter
 * @param key key to evaluate
 */
Config.prototype.getKeys=function(parentKey)
{
    var self=this;

    var parent=self.findProp(parentKey);

    if(parent!==undefined && parent!==null)
        return Object.keys(parent);
    else return Object.keys(self.data);
};

/**
 * This method registers callbacks for set and delete
 * @param key Key to associate callback to
 * @param value The callback method to run
 */
Config.prototype.registerCallback=function(key,callback)
{
    var self=this;

    self.callbacks.set(key,callback);
};
