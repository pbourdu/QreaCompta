var assert = require('chai').assert;

describe("QreaCompta", function() {

    var QreaCompta = require('../QreaCompta');
    
    describe("Models", function() {

        it("Entreprise", function() {
            console.log(QreaCompta);
            var e = new QreaCompta.Models.Entreprise();
            assert.equal(e.denomination, 'Mon entreprise');

        });

    });
    
});