/**
 * Created by Massimiliano Fanciulli on 27/07/15.
 * If you need any information write me at fanciulli@gmail.com
 */
var assert = require('assert');

describe('Disk Storage', function() {
    describe('#loadFile()', function () {
        it('Load should succedd and data loaded inside the instance', function () {
            var vconf=require(__dirname+'/../index.js');
            vconf.loadFile(__dirname+'/files/load.json');

            console.log(vconf.data.callback);
            console.log(vconf.data.callback===undefined);
            console.log(vconf.data.pippo);

            //assert.notEqual(vconf.data,)
        });
    });
});