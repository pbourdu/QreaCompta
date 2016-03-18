/// <reference path="../QreaCompta.ts" />
/// <reference path="../Models/Models.ts" />

module QreaCompta {

  export module Writers {

    class BaseWriter {

      constructor() { }

      static convertToLength(t: string, l: number) {

        if (t.length > l) {
          // on doit prendre uniquement les l caractères
          return t.substr(0, l);
        } else if (t.length < l) {
          for (var i = t.length; i < l; i++) {
            t += ' ';
          }
          return t;
        } else {
          return t;
        }

      }

      static convertDate(d) {

        d = new Date(d);

        var dd = d.getDate().toString();
        if (dd.length === 1) dd = '0' + dd;
        var mm = d.getMonth().toString();
        if (mm.length === 1) mm = '0' + mm;
        var yyyy = d.getFullYear().toString();
        yyyy = yyyy.substr(2, 2);

        var res = dd + mm + yyyy;
        return res;

      }

      static getSens(l: QreaCompta.Models.Ligne, params: any = {}) {

        if (l.debit > 0) {
          params.sens = 'D';
          params.montant = l.debit;
        } else if (l.credit < 0) {
          params.sens = 'D';
          params.montant = -1 * l.credit;
        } else if (l.debit < 0) {
          params.sens = 'C';
          params.montant = -1 * l.debit;
        } else {
          params.sens = 'C';
          params.montant = l.credit;
        }

        return params;

      }

    }

    export class WriterSage extends BaseWriter {

      constructor() {
        super();
      }

      public toPNM<T>(arg: T): T {

        var type = arg.constructor.name.toString();

        switch (type) {
          case 'Journal':
            return writeJournal(arg);
          default:
            return null;
        }

        function writeJournal(journal: QreaCompta.Models.Journal) {

          var res = '';
          res += writeLigneEnteteSociete();

          journal.ecritures.forEach(function(e) {
            res += writeEcriture(e);
          }, this);

          return res;

          function writeLigneEnteteSociete() {

            var res = 'entreprise ???\r\n';
            return res;

          }

          function writeEcriture(ecriture: QreaCompta.Models.Ecriture) {

            var resEcriture = '';

            // params nécessaire pour l'écriture d'un ligne type M
            var params = {
              numeroCompte: null,
              journalCode: BaseWriter.convertToLength(journal.journalCode, 3) || 'VE ',
              date: BaseWriter.convertDate(ecriture.ecritureDate),
              libelle: ecriture.ecritureLib,
              sens: null,
              montant: null,
              pieceRef: ecriture.pieceRef
            }

            ecriture.lignes.forEach(function(l) {
              resEcriture += writeLigne(l);
            }, this);

            return resEcriture;

            function writeLigne(ligne: QreaCompta.Models.Ligne) {

              function convertToMontantSage(v: number) {

                // mise sur la longeur quadra 12 signes pour le montant
                var resValue = v.toString();

                if (resValue.length > 20) {

                  throw new Error('Valeur trop grande');

                } else if (resValue.length < 20) {

                  for (var i = resValue.length; i < 20; i++) {
                    resValue = ' ' + resValue;

                  }

                }

              }

              var resLigne = '';
              // code jouranl pos 1 long 3
              resLigne += params.journalCode;
              // date pièce pos 4 long 6 JJMMAA
              resLigne += BaseWriter.convertDate(params.date);
              // type de pièce pos 10 long 2
              resLigne += BaseWriter.convertToLength('', 2);
              // compte general pos 12 long 13
              resLigne += BaseWriter.convertToLength(ligne.compteNum, 13);
              // type de compte pos 25 long
              resLigne += BaseWriter.convertToLength('', 1);
              // libelle de l'écriture pos 52 long 25
              resLigne += BaseWriter.convertToLength(params.libelle, 25);
              // mode de paiement pos 77 long 1
              resLigne += ' ';
              // date de l'échéance pos 78 long 6
              resLigne += BaseWriter.convertToLength('', 6);

              var paramsMontant = BaseWriter.getSens(ligne);

              // sens pos 84 long 1
              resLigne += paramsMontant.sens;
              // type écriture pos 105 long 1
              resLigne += convertToMontantSage(paramsMontant.montant);

              // numero de pièce pos 106 long 7
              resLigne += BaseWriter.convertToLength(params.pieceRef, 7);

              resLigne += 'N';

              return resLigne;

            }

          }

        }
      }
    }

    export class WriterCSV extends BaseWriter {

      constructor() {
        super();
      }

      public toCSV<T>(arg: T): T {

        function writeJournal(journal: QreaCompta.Models.Journal) {

          // ON ECRIT LES ENTETES DU CSV DANS LA PREMIERE LIGNE
          var res = 'ecritureDate;compteNum;ecritureLibelle;debit;credit;pieceRef\r\n';

          // pour chaque écriture
          journal.ecritures.forEach(function(e) {
            res += writeEcriture(e);
          }, this);

          return res;

          function writeEcriture(ecriture: QreaCompta.Models.Ecriture) {

            function convertDate(d) {

              d = new Date(d);

              var dd = d.getDate().toString();
              if (dd.length === 1) dd = '0' + dd;
              var mm = d.getMonth().toString();
              if (mm.length === 1) mm = '0' + mm;
              var yyyy = d.getFullYear().toString();

              var res = dd + '/' + mm + '/' + yyyy;
              return res;

            }

            var resEcriture = '';

            var params = {
              numeroCompte: null,
              journalCode: journal.journalCode || 'VE',
              date: convertDate(ecriture.ecritureDate),
              libelle: ecriture.ecritureLib,
              debit: null,
              credit: null,
              pieceRef: ecriture.pieceRef
            }

            ecriture.lignes.forEach(function(l: QreaCompta.Models.Ligne) {
              resEcriture += writeLigne(l);
            }, this);

            return resEcriture;

            function writeLigne(l: QreaCompta.Models.Ligne) {

              function convertMontantToStringCSV(montant) {

                if (montant) {
                  var res = montant.toString();
                  return res.replace(".", ",");
                } else {
                  return '0';
                }

              }

              params.numeroCompte = l.compteNum;
              params.debit = convertMontantToStringCSV(l.debit),
              params.credit = convertMontantToStringCSV(l.credit);

              // ecriture
              // var resLigne = '%s;compteNum;ecritureLibelle;debit;credit;pieceRef\r\n';
              var resLigne = params.date + ';';
              resLigne += params.numeroCompte + ';';
              resLigne += params.libelle + ';';
              resLigne += params.debit + ';';
              resLigne += params.credit + ';';
              resLigne += params.pieceRef + ';';
              resLigne += '\r\n';

              return resLigne;

            }

          }

        }

        var type = arg.constructor.name.toString();

        switch (type) {
          case 'Journal':
            return writeJournal(arg);
          default:
            return null;
        }

      }

    }

    export class WriterQuadra extends BaseWriter {

      constructor() {
        super();
      }

      public toASCII<T>(arg: T): T {

        function writeJournal(journal: QreaCompta.Models.Journal) {

          var file = '';

          journal.ecritures.forEach(function(e: QreaCompta.Models.Ecriture) {
            file += writeEcriture(e);
          }, this);

          return file;

          function writeEcriture(ecriture: QreaCompta.Models.Ecriture) {

            if (!ecriture.equilibre) {
              throw new Error('L\'écriture n\'est pas équilibrée');
            }

            // ini du texte
            var res = '';

            // params nécessaire pour l'écriture d'un ligne type M
            var params = {
              numeroCompte: null,
              journalCode: journal.journalCode || 'VE',
              date: ecriture.ecritureDate,
              libelle: ecriture.ecritureLib,
              sens: null,
              montant: null,
              pieceRef: ecriture.pieceRef
            }

            // on parcours chaque ligne
            ecriture.lignes.forEach(function(l: QreaCompta.Models.Ligne) {

              params.numeroCompte = l.compteNum;

              params = BaseWriter.getSens(l, params);

              res += writeLineM(params);
              res += '\r\n';

            }, this);

            return res;

            function writeLineM(params) {

              /**
               * convertNumeroCompte - Convertir le numéro du compte
               *
               * @param  {string || number} n numero de compte
               * @return {string}   numero de compte sous 8 caractères
               */
              function convertNumeroCompte(n) {

                var res = n.toString();

                if (res.length === 0 || res.length > 8) {
                  throw new Error('Le numero de compte est invalide');
                } else {
                  for (var i = res.length; i < 8; i++) {
                    res += '0';
                  }
                  return res;
                }

              }


              /**
               * convertDate - Convertir la date au format requis par quadra DDMMYY
               *
               * @param  {date} d la date à convertir
               * @return {string}   la date au format DDMMYY
               */
              function convertDate(d) {

                d = new Date(d);

                var dd = d.getDate().toString();
                if (dd.length === 1) dd = '0' + dd;
                var mm = d.getMonth().toString();
                if (mm.length === 1) mm = '0' + mm;
                var yyyy = d.getFullYear().toString();
                yyyy = yyyy.substr(2, 2);

                var res = dd + mm + yyyy;
                return res;

              }

              /**
               * convertToLength - Convertir la chaine de caractère à
               * la longueur désirée
               *
               * @param  {string} t: string texte en entrée
               * @param  {number} l: number longueur désirée
               * @return {string}           texte à la longueur désirée
               */
              function convertToLength(t: string, l: number) {
                if (t.length > l) {
                  // on doit prendre uniquement les l caractères
                  return t.substr(0, l);
                } else if (t.length < l) {
                  for (var i = t.length; i < l; i++) {
                    t += ' ';
                  }
                  return t;
                } else {
                  return t;
                }
              }


              /**
               * convertToCentimesSigne - Convertir un montant en centimes signé
               * sur 13 caractères
               *
               * @param  {nmuber} v: number valeur à convertir
               * @return {string}           valeur sur 13 caractères en centimes signé
               */
              function convertToCentimesSigne(v: number) {

                // par défaut valeur > 0
                var res = '+';
                // sinon on retraite
                if (v < 0) {
                  res = '-';
                  v *= -1;
                }

                // passage en centimes
                v *= 100;
                v = Math.round(v);

                // mise sur la longeur quadra 12 signes pour le montant
                var resValue = v.toString();

                if (resValue.length > 12) {

                  throw new Error('Valeur trop grande');

                } else if (resValue.length < 12) {

                  for (var i = resValue.length; i < 12; i++) {
                    resValue = '0' + resValue;

                  }

                }

                // fin on retourne
                var resultat = res + resValue;

                return resultat;

              }

              // * Type = M 1 1
              var res = 'M';
              // * * Numéro de compte 2 8
              res += convertNumeroCompte(params.numeroCompte);
              //* * Code journal sur 2 caract. (obligatoire même si renseigné en 111 sur 3) 10 2
              res += params.journalCode;
              // * * N° folio (à initialiser à "000" si pas de folio) 12 3
              res += '000';
              // * * Date écriture (JJMMAA) 15 6
              res += convertDate(params.date);
              // *  Code libellé 21 1
              res += ' ';
              // * Libellé libre 22 20
              res += convertToLength(params.libelle, 20);
              // * * Sens Débit/Crédit (D/C) 42 1
              res += params.sens;
              // * * Montant en centimes signé (position 43=signe) 43 13
              res += convertToCentimesSigne(params.montant);
              // * Compte de contrepartie 56 8
              res += convertToLength(' ', 8);
              // *  Date échéance (JJMMAA) 64 6
              res += convertToLength(' ', 6);
              // * Code lettrage 70 2
              res += convertToLength(' ', 2);
              // *  Code statistiques 72 3
              res += convertToLength(' ', 3);
              // *  N° de pièce sur 5 caractères maximum 75 5
              res += convertToLength(params.pieceRef, 5)
              // * Code affaire 80 10
              res += convertToLength(' ', 10);
              // *  Quantité 1 90 10
              res += convertToLength(' ', 10);
              // * Numéro de pièce jusqu'à 8 caractères 100 8
              res += convertToLength(' ', 8);
              // * Code devise (FRF ou EUR, Espace = FRF, ou Devise) 108 3
              res += convertToLength(' ', 3);
              // * QC Windows seulement
              // * * Code journal sur 3 caractères 111 3
              res += convertToLength(' ', 3);
              // * Flag Code TVA géré dans l'écriture = O (oui) 114 1
              res += convertToLength(' ', 1);
              // * Code TVA   = 0 à 9 115 1
              res += convertToLength(' ', 1);
              // * Méthode de calcul TVA  = D (Débits) ou E (Encaissements) 116 1
              res += convertToLength(' ', 1);
              // QC Windows seulement
              // Libellé écriture sur 30 caract. (blanc si renseigné en 22 sur 20 caract.) 117 30
              res += convertToLength(params.libelle, 30);
              // Code TVA sur 2 caractères 147 2
              res += convertToLength(' ', 2);
              // N° de pièce alphanumérique sur 10 caract. 149 10
              res += convertToLength(params.pieceRef, 10);
              // Réservé 159 10
              // QC Windows seulement
              // Montant dans la devise (en centimes signés position 169=signe) 169 13
              // QC Windows Importation seulement
              // Pièce jointe à l'écriture, nom du fichier sur 8 caractères + extension sur 3 caractères – Cf. Remarque 182 12
              // QC Windows seulement
              // Quantité 2 194 10
              // QC Windows Exportation seulement
              // NumUniq 204 10
              // Code opérateur 214 4
              // Date système 218 14

              return res;

            }

          }

        }

        var type = arg.constructor.name.toString();

        switch (type) {
          case 'Journal':
            return writeJournal(arg);
          default:
            return null;
        }

      }

    }

  }
}
