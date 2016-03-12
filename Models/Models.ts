/// <reference path="../QreaCompta.ts" />

module QreaCompta {

  export module Models {

    class BaseModel {
      constructor(params: any) {

      }
      ini() {
        console.log('ini BaseModel');
      }
    };

    export class Journal extends BaseModel {

      constructor(params: any) {

        // constructor parent
        super(params);

        this.journalCode = params.journalCode || null;
        this.journalLibelle = params.journalLibelle || null;
        this.ecritures = params.ecritures || [];

      }

      journalCode: string;
      journalLibelle: string;
      ecritures: Ecriture[];

    };

    export class Ecriture extends BaseModel {
      constructor(params: any) {
        super(params);

      }
    }

  }
  
}
