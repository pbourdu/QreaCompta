var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../QreaCompta.ts" />
var QreaCompta;
(function (QreaCompta) {
    var Models;
    (function (Models) {
        var BaseModel = (function () {
            function BaseModel(params) {
            }
            BaseModel.prototype.ini = function () {
                console.log('ini BaseModel');
            };
            return BaseModel;
        }());
        ;
        var Journal = (function (_super) {
            __extends(Journal, _super);
            function Journal(params) {
                // constructor parent
                _super.call(this, params);
                // ini des property
                this.journalCode = params.journalCode || null;
                this.journalLibelle = params.journalLibelle || null;
                this.ecritures = params.ecritures || [];
            }
            Journal.prototype.addEcriture = function (e) {
                if (!e.equilibre) {
                    throw new Error('L\'écriture n\'est pas équilibrée');
                }
                else {
                    this.ecritures.push(e);
                }
            };
            Journal.prototype.checkEquilibre = function () {
                if (!this.ecritures || this.ecritures.length === 0) {
                    return true;
                }
                else if (this.ecritures.length === 1) {
                    return false;
                }
                else {
                    var test = true;
                    this.ecritures.forEach(function (e) {
                        if (!e.equilibre)
                            test = false;
                    });
                    return test;
                }
            };
            Object.defineProperty(Journal.prototype, "equilibre", {
                get: function () {
                    return this.checkEquilibre();
                },
                enumerable: true,
                configurable: true
            });
            return Journal;
        }(BaseModel));
        Models.Journal = Journal;
        ;
        var Ecriture = (function (_super) {
            __extends(Ecriture, _super);
            function Ecriture(params) {
                // constructeur parent
                _super.call(this, params);
                this.dateLet = params.dateLet || null;
                this.ecritureDate = params.ecritureDate || null;
                this.ecritureLib = params.ecritureLib || null;
                this.ecritureLet = params.ecritureLet || null;
                this.pieceRef = params.pieceRef || null;
                this.pieceDate = params.pieceDate || null;
                this.validDate = params.validDate || null;
                this.lignes = params.lignes || [];
            }
            Ecriture.prototype.addLigne = function (l) {
                this.lignes.push(l);
            };
            Ecriture.prototype.checkEquilibre = function () {
                if (this.lignes.length < 1) {
                    return true;
                }
                else if (this.lignes.length === 1) {
                    return false;
                }
                else {
                    var totalDebit = 0;
                    var totalCredit = 0;
                    this.lignes.forEach(function (l) {
                        totalDebit += l.debit;
                        totalCredit += l.credit;
                    }, this);
                    return totalDebit === totalCredit;
                }
            };
            Object.defineProperty(Ecriture.prototype, "equilibre", {
                // private _equilibre: boolean;
                get: function () {
                    return this.checkEquilibre();
                },
                enumerable: true,
                configurable: true
            });
            return Ecriture;
        }(BaseModel));
        Models.Ecriture = Ecriture;
        ;
        var Ligne = (function (_super) {
            __extends(Ligne, _super);
            function Ligne(params) {
                _super.call(this, params);
                this.compteLib = params.compteLib || null;
                this.compteNum = params.compteNum || null;
                this.credit = params.credit || 0;
                this.debit = params.debit || 0;
            }
            return Ligne;
        }(BaseModel));
        Models.Ligne = Ligne;
    })(Models = QreaCompta.Models || (QreaCompta.Models = {}));
})(QreaCompta || (QreaCompta = {}));
/// <reference path="../QreaCompta.ts" />
/// <reference path="../Models/Models.ts" />
var QreaCompta;
(function (QreaCompta) {
    var Writers;
    (function (Writers) {
        var BaseWriter = (function () {
            function BaseWriter() {
            }
            return BaseWriter;
        }());
        var WriterQuadra = (function (_super) {
            __extends(WriterQuadra, _super);
            function WriterQuadra() {
                _super.call(this);
            }
            WriterQuadra.prototype.toASCII = function (arg) {
                function writeJournal(journal) {
                    var file = '';
                    journal.ecritures.forEach(function (e) {
                        file += writeEcriture(e);
                    }, this);
                    return file;
                    function writeEcriture(ecriture) {
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
                        };
                        // on parcours chaque ligne
                        ecriture.lignes.forEach(function (l) {
                            params.numeroCompte = l.compteNum;
                            if (l.debit > 0) {
                                params.sens = 'D';
                                params.montant = l.debit;
                            }
                            else {
                                params.sens = 'C';
                                params.montant = l.credit;
                            }
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
                                }
                                else {
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
                                if (dd.length === 1)
                                    dd = '0' + dd;
                                var mm = d.getMonth().toString();
                                if (mm.length === 1)
                                    mm = '0' + mm;
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
                            function convertToLength(t, l) {
                                if (t.length > l) {
                                    // on doit prendre uniquement les l caractères
                                    return t.substr(0, l);
                                }
                                else if (t.length < l) {
                                    for (var i = t.length; i < l; i++) {
                                        t += ' ';
                                    }
                                    return t;
                                }
                                else {
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
                            function convertToCentimesSigne(v) {
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
                                // mise sur la longeur quadra 42 signes pour le montant
                                var resValue = v.toString();
                                if (resValue.length > 42) {
                                    throw new Error('Valeur trop grande');
                                }
                                else if (resValue.length < 42) {
                                    for (var i = resValue.length; i < 42; i++) {
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
                            res += convertToLength(params.pieceRef, 5);
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
            };
            return WriterQuadra;
        }(BaseWriter));
        Writers.WriterQuadra = WriterQuadra;
    })(Writers = QreaCompta.Writers || (QreaCompta.Writers = {}));
})(QreaCompta || (QreaCompta = {}));
/// <reference path="Models\Models.ts" />
/// <reference path="Writers\Writers.ts" />
