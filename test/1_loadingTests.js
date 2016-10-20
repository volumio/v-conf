var expect = require("chai").expect;

describe("Loading", function() {
    it("File to load not found", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile('/tmp/missingFile.json');

        expect(vconf.data).to.deep.equal({});
        expect(vconf.filePath).to.equal('/tmp/missingFile.json');

    });

    it("File successfully read", function(){
        var vconf=new (require(__dirname+'/../index.js'))();

        vconf.loadFile(__dirname+'/files/load.json');

        expect(vconf.data).to.deep.equal({
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
        expect(vconf.filePath).to.equal(__dirname+'/files/load.json');

    });
});