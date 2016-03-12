/// <reference path="../QreaCompta.ts" />
/// <reference path="../Models/Models.ts" />

module QreaCompta {

  export module Writers {

    class BaseWriter {
      constructor() { }
    }

    export class WriterQuadra extends BaseWriter {

      constructor() {
        super();
      }

      public toASCII<T>(arg: T): T {

        function writeEcriture(ecriture: QreaCompta.Models.Ecriture) {

          var res = '';

          // on parcours chaque ligne

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
             * sur 43 caractères
             *
             * @param  {nmuber} v: number valeur à convertir
             * @return {string}           valeur sur 43 caractères en centimes signé
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

              // mise sur la longeur quadra 42 signes pour le montant
              var resValue = v.toString();
              if (resValue.length > 42) {
                throw new Error('Valeur trop grande');
              } else if (resValue.length < 42) {
                for (var i; i < 42; i++) {
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

        function writeJournal(journal) {

          console.log("Journal.toASCII()");
          var file = "ligne1\r\nligne2";
          return file;

        }

        var type = arg.constructor.name.toString();

        switch (type) {
          case 'Journal':
            return writeJournal(arg);
            break;
          default:
            return null;
        }

      }

    }

  }
}
