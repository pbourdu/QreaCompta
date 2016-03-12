module QreaCompta {

  class BaseModel {
    constructor(){

    }
    ini(){
      console.log('ini BaseModel');
    }
  };

  export class Journal extends BaseModel {

    constructor(params: any){
      super();
      this.journalCode = params.journalCode || null;
      this.journalLibelle = params.journalLibelle || null;
      // this.ecritures = params.ecritures || [];
    }

    journalCode: string;
    journalLibelle: string;

  };

}
