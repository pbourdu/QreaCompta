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

        // ini des property
        this.journalCode = params.journalCode || null;
        this.journalLibelle = params.journalLibelle || null;
        this.ecritures = params.ecritures || [];

      }

      addEcriture(e: Ecriture){
        if(!e.equilibre){
          throw new Error('L\'écriture n\'est pas équilibrée');
        } else {
          this.ecritures.push(e);          
        }
      }

      private checkEquilibre(){

        if(!this.ecritures || this.ecritures.length === 0){
          return true;
        } else if(this.ecritures.length === 1) {
          return false;
        } else {

          var test = true;
          this.ecritures.forEach(function(e: Ecriture){
            if(!e.equilibre) test = false;
          });

          return test;

        }

      }

      get equilibre(): boolean{
        return this.checkEquilibre();
      }

      journalCode: string;
      journalLibelle: string;
      ecritures: Ecriture[];

    };

    export class Ecriture extends BaseModel {

      constructor(params: any) {

        // constructeur parent
        super(params);

        this.dateLet = params.dateLet || null;
        this.ecritureDate = params.ecritureDate || null;
        this.ecritureLib = params.ecritureLib || null;
        this.ecritureLet = params.ecritureLet || null;
        this.pieceRef = params.pieceRef || null;
        this.pieceDate = params.pieceDate || null;
        this.validDate = params.validDate || null;
        this.lignes = params.lignes || [];

      }

      addLigne(l: Ligne){
        this.lignes.push(l);
      }

      private checkEquilibre(){

        if(this.lignes.length < 1){
          return true;
        } else if(this.lignes.length === 1){
          return false;
        } else {
          var totalDebit = 0;
          var totalCredit = 0;
          this.lignes.forEach(function(l: Ligne){
            totalDebit += l.debit;
            totalCredit += l.credit;
          }, this);
          return totalDebit === totalCredit;
        }

      }

      // private _equilibre: boolean;
      get equilibre(): boolean {
        return this.checkEquilibre();
      }

      dateLet: any;
      ecritureDate: any;
      ecritureLet: string;
      ecritureLib: string;
      pieceDate: any;
      pieceRef: string;
      validDate: any;
      lignes: Ligne[];

    };

    export class Ligne extends BaseModel{

      constructor(params: any){

        super(params);
        this.compteLib = params.compteLib || null;
        this.compteNum = params.compteNum || null;
        this.credit = params.credit || 0;
        this.debit = params.debit || 0;

      }

      compteLib: string;
      compteNum: any;
      credit: number;
      debit: number;

    }

  }

}
