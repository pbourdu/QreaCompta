var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var QreaCompta;
(function (QreaCompta) {
    var BaseModel = (function () {
        function BaseModel() {
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
            _super.call(this);
            this.journalCode = params.journalCode || null;
            this.journalLibelle = params.journalLibelle || null;
            // this.ecritures = params.ecritures || [];
        }
        return Journal;
    }(BaseModel));
    QreaCompta.Journal = Journal;
    ;
})(QreaCompta || (QreaCompta = {}));
