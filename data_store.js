/**
 * Copyright by Massimiliano Fanciulli.
 * If you need any information write me at fanciulli@gmail.com
 */

module.exports=DataStore;

function DataStore(persistence)
{
    var self=this;
	
    self.persistence=persistence;
}

/**
 * This method searches the object associated to the provided key.
 * @param key Key to search. A string object
 * @returns The value associate to the key. If not key is given the whole configuration is
 * returned. If key doesn't exist a null value is returned
 */
DataStore.prototype.findProp=function(key)
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

            var beginArrayIndex=k.indexOf('[');
            var endArrayIndex=k.indexOf(']');

            if(beginArrayIndex>-1 && endArrayIndex>-1)
            {
                // shall get an array item
		var itemStr=k.substring(0,beginArrayIndex);
		var indexStr=parseInt(k.substring(beginArrayIndex+1,endArrayIndex).trim());
		currentProp=currentProp[itemStr];
		currentProp=currentProp.value[indexStr];
            }
            else
            {
                if(currentProp && currentProp[k]!==undefined)
                    currentProp=currentProp[k];
                else
                {
                    currentProp=null;
                    break;
                }
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
DataStore.prototype.has=function(key)
{
    var prop=this.findProp(key);

    return prop!==null && prop!==undefined;
};

/**
 * This method returns the object associated to the key
 * @param key Object to return
 * @param def Default value if key is not found
 * @returns The value associated to key, default if not found and passed to method, undefined otherwise.
 */
DataStore.prototype.get=function(key,def)
{
    var prop=this.findProp(key);

    if(prop!==undefined && prop !== null)
        return this.forceToType(prop.type,prop.value);
    else return def;
};

/**
 * This method sets the provided value to the key.
 * @param key Key to update
 * @param value The value to set
 */
DataStore.prototype.set=function(key,value)
{
    var prop=this.findProp(key);

    if(prop!==undefined && prop !== null)
    {
        prop.value=this.forceToType(prop.type,value);
        this.persistence.scheduleSave();
    }
    else if(value!==undefined && value!==null)
    {
        var type=typeof value;
        this.addConfigValue(key,type,value);
    }

};

/**
 * This method add a configuration to the internal data.
 * @param key Key to add
 * @param type Type of the parameter to add
 * @param value The value of the parameter to add
 */
DataStore.prototype.addConfigValue=function(key,type,value)
{
    var self=this;

    var splitted=key.split('.');
    var currentProp=self.data;

    while (splitted.length > 0) {
        var k = splitted.shift();

	var beginArrayIndex=k.indexOf('[');
        var endArrayIndex=k.indexOf(']');

        if(beginArrayIndex>-1 && endArrayIndex>-1)
        {
		throw new Error('Cannot provide index to array');
	}
	else
	{
		if(currentProp && currentProp[k]!==undefined)
		    currentProp=currentProp[k];
		else
		{
		    if(type==='array')
		    {
			currentProp[k]={type:'array',value:[]};
			currentProp[k].value.push({type:typeof value,value:value});
		    }
		    else
		    {
			currentProp[k]={};
		    	currentProp=currentProp[k];
		    }
		    
		}
	}

    }

    var prop=self.findProp(key);
    self.assertSupportedType(type);
    prop.type=type;

    prop.value=self.forceToType(type,value);

    this.persistence.scheduleSave();
};

/**
 * This method checks if the type passed as parameter is supported by the library
 * @param type type to check
 */
DataStore.prototype.assertSupportedType=function(type)
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
DataStore.prototype.forceToType=function(type,value)
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
    else if(type=='array')
    {
    	return [{type:typeof value,value:value}];
    }
    else return value;

};


/**
 * This method searches for the key and deletes it
 * @param key
 */
DataStore.prototype.delete=function(key)
{
    if(this.has(key))
    {
        var splitted=key.split('.');

        if(splitted.length==1)
            delete this.data[key];
        else
        {
            var parentKey=this.data;
            for(var i=0;i< splitted.length;i++)
            {
                var k = splitted.shift();
                parentKey=parentKey[k];
            }

            var nextKey=splitted.shift();
            delete parentKey[nextKey];
        }

        this.persistence.scheduleSave();
    }
};

/**
 * This method returns all the keys children to the one apssed a parameter
 * @param key key to evaluate
 */
DataStore.prototype.getKeys=function(parentKey)
{
    var parent=this.findProp(parentKey);

    if(parent!==undefined && parent!==null)
        return Object.keys(parent);
    else return Object.keys(this.data);
};
