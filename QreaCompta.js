var QreaCompta = (function() {

  var self = {};

  /*
  self.init = function(){

  };
  */

  return self;

})();

QreaCompta.models = (function() {

  var self = {};

  var BaseModel = function(params){

    this.prototype.ini = function(){
      console.log('ini du model');
    };

  };

  self.Journal = function(params) {

    this.prototype = new BaseModel();

    this.journalCode = params.journalCode || null;
    this.journalLibelle = params.journalLibelle || null;

    this.ecritures = params.ecritures || [];

    this.ini();

  };

  self.Ecriture = function(params){

    this.dateLet = params.dateLet || null;
    this.ecritureDate = params.ecritureDate || null;
    this.ecritureLet = params.ecritureLet || null;
    this.ecritureLib = params.ecritureLib || null;
    this.pieceDate = params.pieceDate || null;
    this.pieceRef = params.pieceRef || null;
    this.validDate = params.validDate || null;

    this.lignes = params.lignes || [];

  };

  self.Ligne = function(params){

    this.compteLib = params.compteLib || null;
    this.compteNum = params.compteNum || null;
    this.credit = params.credit || null;
    this.debit = params.devit || null;

  };

  return self;

})();
