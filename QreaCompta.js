var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
                }
                console.log(arg);
                return arg;
            };
            return WriterQuadra;
        }(BaseWriter));
        Writers.WriterQuadra = WriterQuadra;
    })(Writers = QreaCompta.Writers || (QreaCompta.Writers = {}));
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
                this.journalCode = params.journalCode || null;
                this.journalLibelle = params.journalLibelle || null;
                this.ecritures = params.ecritures || [];
            }
            return Journal;
        }(BaseModel));
        Models.Journal = Journal;
        ;
        var Ecriture = (function (_super) {
            __extends(Ecriture, _super);
            function Ecriture(params) {
                _super.call(this, params);
            }
            return Ecriture;
        }(BaseModel));
        Models.Ecriture = Ecriture;
    })(Models = QreaCompta.Models || (QreaCompta.Models = {}));
})(QreaCompta || (QreaCompta = {}));
