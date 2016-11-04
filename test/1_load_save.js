var expect = require("chai").expect;
var fs=require('fs-extra');
var loadObj={
  load: {
    a: {
      type: "number",
      value: 100
    },
    b: {
      type: "string",
      value: "A String"
    },
    c: {
      type: "boolean",
      value: false
    }
  }
};

describe("#loadFile()", function() {
    beforeEach(function() {
    	fs.writeJsonSync("/tmp/loadFile.json",loadObj);
	    var fileExists=fs.existsSync("/tmp/loadFile.json");
	    expect(fileExists).to.equal( true );
    });


    it("File to load not found", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile('/tmp/missingFile.json');

        expect(vconf.dataStore.data).to.deep.equal({});
        expect(vconf.persistence.filePath).to.equal('/tmp/missingFile.json');

    });

    it("File to load not found (asynchronously)", function(done){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile('/tmp/missingFile.json',function(err,data)
        {
            expect(err).to.not.equal( null );
            expect(err).to.not.equal( undefined );
            expect(data).to.equal( undefined );
            done();
        });

    });

    it("File successfully read", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile('/tmp/loadFile.json');

        expect(vconf.dataStore.data).to.deep.equal({
            load: {
                b: {
                    type: "string",
                    value: "A String"
                },
                a: {
                    type: "number",
                    value: 100
                },
                c: {
                    type: "boolean",
                    value: false
                }
            }
        });
        expect(vconf.persistence.filePath).to.equal('/tmp/loadFile.json');

    });

    it("File successfully read (asynchronously)", function(done){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile('/tmp/loadFile.json',function(err,data)
        {
            expect(err).to.equal( null );
            expect(data).to.deep.equal( loadObj );
            done();
        });

    });


});

describe("#scheduleSave()", function() {
    beforeEach(function() {
    	fs.removeSync("/tmp/scheduleSave.json");
	    var fileExists=fs.existsSync("/tmp/scheduleSave.json");
	    expect(fileExists).to.equal( false );
    });



    it("Successful save", function(done){
        this.timeout(6000);
        var vconf=new (require(__dirname+'/../index.js'))();
        vconf.persistence.autosaveDelay=5000;
        vconf.persistence.filePath="/tmp/scheduleSave.json";

        expect(vconf.persistence.filePath).to.equal( "/tmp/scheduleSave.json" );
        expect(vconf.persistence.autosaveDelay).to.equal( 5000 );

        vconf.persistence.scheduleSave();

        var fileExists=fs.existsSync("/tmp/scheduleSave.json");
        expect(fileExists).to.equal( false );

        setTimeout(function(){
            var fileExists=fs.existsSync("/tmp/scheduleSave.json");
            expect(fileExists).to.equal( true );
            done();
        },5000);
	
    });


    it("Successful save (asynchronous)", function(done){
        this.timeout(7000);
        var vconf=new (require(__dirname+'/../index.js'))();
        vconf.persistence.syncSave=false;
        vconf.persistence.autosaveDelay=5000;
        vconf.persistence.filePath="/tmp/scheduleSave.json";

        expect(vconf.persistence.filePath).to.equal( "/tmp/scheduleSave.json" );
        expect(vconf.persistence.autosaveDelay).to.equal( 5000 );

        vconf.persistence.scheduleSave();

        var fileExists=fs.existsSync("/tmp/scheduleSave.json");
        expect(fileExists).to.equal( false );

        setTimeout(function(){
            var fileExists=fs.existsSync("/tmp/scheduleSave.json");
            expect(fileExists).to.equal( true );
            done();
        },6000);

    });
});

describe("#save()", function() {
    beforeEach(function() {
    	fs.writeJsonSync("/tmp/save.json",{});
	var fileExists=fs.existsSync("/tmp/save.json");
	expect(fileExists).to.equal( true );
    });



    it("Data is saved to disk", function(){
	var vconf=new (require(__dirname+'/../index.js'))();
	vconf.persistence.filePath="/tmp/save.json";
	vconf.persistence.saved=false;

	var obj = fs.readJsonSync("/tmp/save.json");

	expect(vconf.persistence.saved).to.equal( false );
        expect(vconf.persistence.filePath).to.equal( "/tmp/save.json" );
	expect(obj).to.deep.equal( {} );

	vconf.dataStore.data={
		    load: {
			a: {
			    type: "number",
			    value: 100
			}
		    }
	};
	vconf.persistence.save();
	
	obj = fs.readJsonSync("/tmp/save.json");

	expect(obj).to.deep.equal( {
		    load: {
			a: {
			    type: "number",
			    value: 100
			}
		    } });
	
    });

    it("Data is not saved to disk", function(){
	var vconf=new (require(__dirname+'/../index.js'))();
	vconf.persistence.filePath="/tmp/save.json";
	vconf.persistence.saved=true;

	var obj = fs.readJsonSync("/tmp/save.json");

	expect(vconf.persistence.saved).to.equal( true );
        expect(vconf.persistence.filePath).to.equal( "/tmp/save.json" );
	expect(obj).to.deep.equal( {} );

	vconf.dataStore.data={
		    load: {
			a: {
			    type: "number",
			    value: 100
			}
		    }
	};
	vconf.persistence.save();
	
	obj = fs.readJsonSync("/tmp/save.json");

	expect(obj).to.deep.equal( {});
	
    });
});
