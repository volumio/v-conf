var expect = require("chai").expect;
var loadObj={
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
};

/**
 * FIND PROP
 */
describe("FindProp method", function() {

    it("FindProp returns the correct object", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile(__dirname+'/files/load.json');
        var b=vconf.findProp('load.b');

        expect(b).to.deep.equal({
            type: "string",
            value: "A String"
        });
    });

    it("FindProp returns the whole dataset", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile(__dirname+'/files/load.json');
        var b=vconf.findProp();

        expect(b).to.deep.equal(loadObj);
    });

    it("FindProp returns null if key is not in configuration", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile(__dirname+'/files/load.json');
        var b=vconf.findProp('load.d');

        expect(b).to.equal(null);
    });

});


/**
 * HAS
 */
describe("Has method", function() {

    it("Method correctly returns if key is present", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile(__dirname+'/files/load.json');
        var a=vconf.has('load.a');
        var d=vconf.has('load.d');

        expect(a).to.equal(true);
        expect(d).to.equal(false);
    });


});

/**
 * GET
 */
describe("Get method", function() {

    it("Key found", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile(__dirname+'/files/load.json');
        var a=vconf.get('load.a');

        expect(a).to.equal( 100 );
    });

    it("Key found (default provided)", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile(__dirname+'/files/load.json');
        var a=vconf.get('load.a',0);

        expect(a).to.deep.equal( 100 );
    });

    it("Key not found", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile(__dirname+'/files/load.json');
        var a=vconf.get('load.d');

        expect(a).to.deep.equal( undefined );
    });

    it("Key not found (default provided)", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile(__dirname+'/files/load.json');
        var a=vconf.get('load.d',100);

        expect(a).to.deep.equal( 100 );
    });

});

/**
 * GET
 */
describe("Set method", function() {

    it("Adding keys", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.set('load.a',100);
        vconf.set('load.b',"A value");
        vconf.set('load.c',true);

        expect(vconf.data.load.a).to.deep.equal( {
            type: "number",
            value: 100
        } );

        expect(vconf.data.load.b).to.deep.equal( {
            type: "string",
            value: "A value"
        } );

        expect(vconf.data.load.c).to.deep.equal( {
            type: "boolean",
            value: true
        } );
    });
    

});