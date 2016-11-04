/**
 * Copyright by Massimiliano Fanciulli.
 * If you need any information write me at fanciulli@gmail.com
 */
var fs=require('fs-extra');

module.exports=FilePersistence;

function FilePersistence(synchronous=false,autosave=true,autosaveDelay=1000)
{
    var self=this;

    self.filePath='';
    self.syncSave=synchronous;
    self.autosave=autosave;
    self.autosaveDelay=autosaveDelay;
    self.saved=true;
}

/**
 * This method loads the configuration from a file. If the file is not found or cannot be opened for some reason,
 * the content is set to empty. The method is synchronous if no callback is provided, asynchronous otherwise
 * @param file The path of the configuration file to load.
 * @param callback Callback method that is invoked when load is completed. Function shall accept (err,data)
 */
FilePersistence.prototype.loadFile=function(file,dataStore,callback)
{
    var self=this;

    self.filePath=file;

    try
    {
        if(callback === undefined)
            dataStore.data=fs.readJsonSync(file);
        else
        {
            fs.readJson(file,function(err,data){
                if(err)
                    callback(err);
                else
                {
                    dataStore.data=data;
                    callback(err,data);
                }
            });
        }
    }
    catch(ex)
    {
        dataStore.data={};
    }

};

/**
 * This method saves the data to disk.
 */
FilePersistence.prototype.save=function()
{
    if(this.syncSave)
         fs.writeJsonSync(this.filePath,this.data);
    else fs.writeJson(this.filePath,this.data);
};

/**
 * This method schedules saving the internal data to disk. Dump to disk is done if a file path is set.
 */
FilePersistence.prototype.scheduleSave=function()
{
    var self=this;

    if(self.filePath!==undefined)
    {
        self.saved=false;

        setTimeout(function()
        {
	    self.saved=false;
            self.save();
        },self.autosaveDelay);
    }

};
