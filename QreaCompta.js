var QreaCompta = (function(){

    var self = {};

    /*
    self.init = function(){

    };
    */

    return self;

})();

QreaCompta.models = (function(){

    var self = {};

   self.Journal = function(params){


     this.code = params.code || null;
     this.libelle = params.libelle || null;

   };

    return self;

})();
