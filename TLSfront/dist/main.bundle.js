webpackJsonp(["main"],{

/***/ "../../../../../src/$$_gendir lazy recursive":
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "../../../../../src/$$_gendir lazy recursive";

/***/ }),

/***/ "../../../../../src/app/app.component.css":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("../../../../css-loader/lib/css-base.js")(false);
// imports


// module
exports.push([module.i, ".fileNameBox{\n    height: 100px;\n    width: 60%;\n    text-align: center;\n    margin-bottom: 20px;\n    margin-top: 10px;\n    font-size: 36px;\n    border: 0.5px solid black;\n}\n\n.btnContainer{\n    text-align: center;\n}\n\n.btn{\n    margin: 10px;\n    height: 150px;\n    width:  70%;\n    font-size: 36px;\n}\n\n.testBtn{\n    background-color: rgba(42, 148, 190, 0.808);\n}\n\n.getBtn{\n    background-color: rgba(0, 128, 0, 0.794);\n}\n\n.clearBtn{\n    background-color: rgba(255, 60, 30, 0.705)\n}\n\n.downBtn{\n    background-color: rgba(255, 94, 0, 0.705)\n}\n\n.saveBtn{\n    background-color: rgba(180, 180, 0, 0.705)\n}\n\n.stopBtn{\n    background-color: rgba(212, 32, 32, 0.829);\n}\n\n.workMsg{\n    color: blue;\n}\n\n.failMsg{\n    color: red;\n}\n\n.spacer{\n    width: 60%;\n    margin-left: 20%;\n    height: 2px;\n    border: 1px solid black;\n    background-color: black;\n}\n\n.pcMsgs{\n    margin-bottom: 10px;\n    margin-top: 10px;\n    font-size: 32px;\n    line-height: 50px;\n}\n\n.frontPanel{\n    z-index: 10;\n    opacity: 0.5;\n    position: absolute;\n    width: 100vw;\n    height: 300vh;\n    top: 0;\n    background-color: gray;\n    text-align: center;\n}\n\n.spinner{\n    color: red;\n    font-size: 80px;\n}\n\n.trfCancelBtn{\n    background-color: rgba(212, 32, 32, 1);\n    color: black;\n}\n\n.frontContent{\n    z-index: 15;\n    position: absolute;\n    top: 0;\n    margin-top: 40vh;\n    font-size: 60px;\n    text-align: center;\n    width: 100vw;\n    height: 100vh;\n}\n\n.shutBtn{\n    color: white;\n    background-color: rgba(0, 0, 0, 0.829);\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ "../../../../../src/app/app.component.html":
/***/ (function(module, exports) {

module.exports = "<h2 style=\"text-align:center\">\n  <!-- Data collection from VLP16 -->\n  Coletor de dados <br> <span style=\"font-style:italic\">BackPack Forlidar</span>\n</h2>\n\n<div class=\"btnContainer\">\n\n  <div style=\"text-align:center\">\n    <!-- File name (without extension): -->\n    Nome do arquivo (sem extensão):\n  </div>\n  <input class=\"fileNameBox\" type=\"text\" [(ngModel)]=\"fileName\" [disabled]=\"getChecker.unsaved || saving\" />\n\n  <div class=\"pcMsgs\">\n    Computador de bordo\n    <div class=\"msg {{pcChecker.dskClass}}\">{{pcChecker.dskMsg}}</div>\n    <!-- <div class=\"msg {{pcChecker.batClass}}\">{{pcChecker.batMsg}}</div> -->\n  </div>\n  \n  <div class=\"pcMsgs\">\n    <span [class]=\"sensors.class.lidar\">LiDAR: {{sensors.msg.lidar}}</span>,\n    <span [class]=\"sensors.class.imu\">IMU: {{sensors.msg.imu}}</span>,\n    <span [class]=\"sensors.class.gps\">GPS: {{sensors.msg.gps}}</span>\n  </div>\n\n  <!-- <button class=\"btn testBtn\" (click)=\"testConnection()\" [disabled]=\"testChecker.loading || getChecker.loading || saving\">\n      <i *ngIf=\"testChecker.loading\" class=\"fa fa-cog fa-spin\"></i>\n      <span *ngIf=\"!testChecker.loading\">\n        Testar sistema\n      </span>\n    </button> -->\n  \n  <!-- <div class=\"msg {{testChecker.class}}\">{{testChecker.msg}}</div> -->\n\n  <button class=\"btn getBtn\" (click)=\"checkFileExists()\" [disabled]=\"getChecker.loading || saving\">\n    <i *ngIf=\"getChecker.loading\" class=\"fa fa-sync fa-spin\"></i>\n    <span *ngIf=\"!getChecker.loading\">Capturar dados</span>\n  </button>\n\n  <div class=\"msg {{getChecker.class}}\">{{getChecker.msg}}</div>\n\n  <button class=\"btn stopBtn\" (click)=\"stopCapture()\" [disabled]=\"!getChecker.loading || !getChecker.msg || saving\">\n    <!-- Stop Capture -->\n    Parar captura\n  </button>\n\n\n  <br><br>\n  <div class=\"spacer\"></div>\n  <br>\n\n  \n  <!-- <button class=\"btn saveBtn\" [disabled]=\"!getChecker.finished || !driveChecker.available || saving\" (click)=\"save()\"> -->\n  <button class=\"btn saveBtn\" (click)=\"transferToFlash()\" [disabled]=\"!driveChecker.available || saving || getChecker.loading\">\n    <i *ngIf=\"getChecker.loading || saving\" class=\"fas fa-circle-notch fa-spin\"></i>\n    <span *ngIf=\"!getChecker.loading && !saving\">\n      <!-- Save File -->\n      Transferir arquivos para disco externo\n    </span>\n  </button>\n\n  <div class=\"msg {{driveChecker.class}}\">{{driveChecker.msg}}</div>\n  <div *ngIf=\"driveChecker.trf_msg\" class=\"msg {{driveChecker.class}}\">{{driveChecker.trf_msg}}</div>\n\n  <!-- <button class=\"btn downBtn\" [disabled]=\"!getChecker.finished || saving\" (click)=\"download()\">\n    <i *ngIf=\"getChecker.loading\" class=\"fas fa-circle-notch fa-spin\"></i>\n    <span *ngIf=\"!getChecker.loading\"> -->\n      <!-- Download File -->\n      <!-- Baixar arquivo\n    </span>\n  </button> -->\n\n  <!-- <br>\n  ou\n  <br> -->\n\n  <button class=\"btn clearBtn\" [disabled]=\"!getChecker.finished || saving\" (click)=\"clear(true)\">\n    <i *ngIf=\"getChecker.loading\" class=\"fas fa-circle-notch fa-spin\"></i>\n    <span *ngIf=\"!getChecker.loading\">\n      <!-- Clear Data -->\n      Limpar tela\n    </span>\n  </button>\n\n  <button class=\"btn shutBtn\" [disabled]=\"saving || getChecker.loading\" (click)=\"shutdown()\">\n    <i *ngIf=\"getChecker.loading\" class=\"fas fa-circle-notch fa-spin\"></i>\n    <span *ngIf=\"!getChecker.loading\">\n      Desliga computador\n    </span>\n  </button>\n\n</div>\n\n<div [hidden]=\"!transferInfo.active\">\n  \n  <div class='frontPanel'></div>\n\n  <div class='frontContent' *ngIf='saving'>\n\n    <div style=\"font-size:60px;color:red\">{{transferInfo.msg}}</div>\n\n    <br>\n\n    <div class='spinner'>\n      <i class=\"fas fa-circle-notch fa-spin\"></i>\n    </div>\n\n    <br>\n\n    <button class=\"btn trfCancelBtn\" (click)=\"cancelTransfer()\">\n      <span>\n        Cancela transferência\n      </span>\n    </button>\n  </div>  \n\n</div>"

/***/ }),

/***/ "../../../../../src/app/app.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__http_service__ = __webpack_require__("../../../../../src/app/http.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

var AppComponent = (function () {
    function AppComponent(http /*, public dialog: MatDialog*/) {
        this.http = http; /*, public dialog: MatDialog*/
        this.fileName = '';
        this.fileLink = "";
        this.saving = false;
        this.getChecker = { loading: false, finished: false };
        this.driveChecker = { msg: '', class: '', available: false, trf_msg: false };
        this.pcChecker = { dskMsg: '', batMsg: '', dskClass: '', batClass: '' };
        this.files = [];
        this.isFull = false;
        this.stopTransfer = false;
        this.transferInfo = { active: false, n: 0, total: 0, msg: '' };
        this.sensors = { monitor: {}, msg: {}, class: {} };
    }
    // testChecker: any = {loading: false}
    // testConnection(){
    //   this.testChecker.loading = true;
    //   this.http.get('check').subscribe(
    //     data => {
    //       if(data){
    //         this.testChecker.msg = 'OK!'
    //         this.testChecker.class = 'workMsg'
    //       }else{
    //         this.testChecker.msg = 'Erro: tente reconectar os cabos.'
    //         this.testChecker.class = 'failMsg'
    //       }
    //       this.testChecker.loading = false;
    //     },
    //     err => {
    //       this.testChecker.loading = false;
    //       this.testChecker.msg = 'Erro: cheque o computador.'
    //       this.testChecker.class = 'failMsg'
    //     }
    //   );
    // }
    AppComponent.prototype.checkFileExists = function () {
        var _this = this;
        if (this.fileName == '') {
            this.getChecker.msg = 'Dê um nome para o arquivo.';
            this.getChecker.class = 'failMsg';
            return;
        }
        else {
            this.getChecker.msg = '';
        }
        this.getChecker.loading = true;
        this.http.post({ name: this.fileName }, 'check_file').subscribe(function (x) {
            var answer = true;
            if (x) {
                answer = confirm('Já existe um arquivo com esse nome, deseja sobrescrevê-lo?');
            }
            if (answer) {
                _this.captureFile();
            }
            else {
                _this.getChecker.loading = false;
            }
        }, function (err) { return console.log('erro de arquivo', err); });
    };
    AppComponent.prototype.captureFile = function () {
        var _this = this;
        this.getChecker.finished = false;
        this.getChecker.unsaved = true;
        this.http.post({ name: this.fileName }, 'create').subscribe(function (resp) {
            console.log('flash file: ', typeof resp);
            if (!!resp && typeof resp === 'number') {
                // let fSize = resp / 1024 / 1024;
                _this.getChecker.msg = '0 s';
                _this.getChecker.class = 'workMsg';
                _this.startNow = Date.now();
                _this.setMonitor();
            }
            else if (typeof resp === 'string') {
                _this.getChecker.msg = resp;
                _this.getChecker.class = 'failMsg';
                _this.getChecker.loading = false;
                _this.getChecker.unsaved = false;
            }
            else {
                _this.getChecker.msg = 'Sem fluxo de dados, cheque as conexões.';
                _this.getChecker.class = 'failMsg';
                _this.getChecker.loading = false;
                _this.getChecker.unsaved = false;
            }
        }, function (err) {
            _this.getChecker.msg = 'Erro: cheque o computador.';
            _this.getChecker.class = 'failMsg';
            _this.getChecker.loading = false;
            _this.getChecker.unsaved = false;
        });
    };
    AppComponent.prototype.stopCapture = function (block) {
        var _this = this;
        if (block === void 0) { block = true; }
        clearInterval(this.counter);
        this.http.get('kill').subscribe(function (data) {
            _this.fileLink = _this.http.serverAddress + 'download/' + _this.fileName + '.pcap';
            if (block) {
                _this.getChecker.finished = true;
                _this.getChecker.loading = false;
                _this.getChecker.unsaved = false;
            }
        }, function (err) {
            if (block) {
                _this.getChecker.finished = false;
                _this.getChecker.loading = false;
            }
        });
    };
    AppComponent.prototype.save = function () {
        var _this = this;
        this.saving = true;
        this.http.post({ name: this.fileName }, 'save').subscribe(function (back) {
            _this.driveChecker.msg = (typeof back === 'number') ? back.toFixed(2) + ' GB livres' : '';
            _this.clear();
            _this.saving = false;
        });
    };
    AppComponent.prototype.download = function () {
        // this.fileLink = this.serverAddress + 'download/' + this.fileName + '.pcap';
        window.location.href = this.fileLink;
        if (this.driveChecker.available)
            this.save();
        // this.clear();
    };
    AppComponent.prototype.clear = function (rename) {
        if (rename === void 0) { rename = false; }
        // this.testChecker = {loading: false}
        this.getChecker = { loading: false, finished: false };
        this.startNow = 0;
        if (rename) {
            this.fileName = '';
            this.fileLink = "";
            window.location.reload(true);
        }
    };
    AppComponent.prototype.setMonitor = function () {
        var _this = this;
        this.counter = setInterval(function () {
            if (!_this.startNow)
                return;
            _this.http.post({ name: _this.fileName }, 'monitor').subscribe(function (resp) {
                if (!!resp) {
                    // let fSize = parseInt(resp) / 1024 / 1024;
                    var passed = (Date.now() - _this.startNow) / 1000;
                    _this.getChecker.msg = passed.toFixed(0) + ' s'; //+ fSize.toFixed(0) + ' MB';
                    _this.getChecker.class = 'workMsg';
                } /*else{
                  this.getChecker.msg = 'Sem fluxo de dados, cheque as conexões.';
                  this.getChecker.class = 'failMsg';
                  this.getChecker.loading = false;
                  this.getChecker.unsaved = false;
                }*/
            }, function (err) {
                _this.getChecker.msg = 'Erro: cheque o computador.';
                _this.getChecker.class = 'failMsg';
                _this.getChecker.loading = false;
                _this.getChecker.unsaved = false;
            });
        }, 3000);
    };
    AppComponent.prototype.checkFlashDrive = function () {
        var _this = this;
        this.http.get('check_drive').subscribe(function (data) {
            if (data) {
                _this.driveChecker.msg = data.toFixed(2) + ' GB livres';
                _this.driveChecker.class = 'workMsg';
                _this.driveChecker.available = true;
                if (_this.isFull) {
                    _this.driveChecker.msg = 'Disco cheio!';
                    _this.driveChecker.class = 'failMsg';
                }
            }
            else {
                _this.driveChecker.msg = 'Disco flash não disponível.';
                _this.driveChecker.class = 'failMsg';
                _this.driveChecker.available = false;
            }
        }, function (err) {
            _this.driveChecker.msg = 'Erro: cheque o computador.';
            _this.driveChecker.class = 'failMsg';
            _this.driveChecker.available = false;
        });
    };
    AppComponent.prototype.checkPcInfo = function () {
        var _this = this;
        this.http.get('check_pc').subscribe(function (data) {
            _this.pcChecker.dskMsg = 'Disco ' + data.storage.used + ' cheio, ' + data.storage.available.toFixed(2) + ' GB disponíneis';
            var dskStr = data.storage.used;
            var dskSpc = parseFloat(dskStr.substring(0, dskStr.length - 1));
            _this.pcChecker.dskClass = dskSpc >= 85 ? 'failMsg' : 'workMsg';
            // this.pcChecker.batMsg = 'Bateria ' + data.battery.percentage + ' cheia' //+ ' autonomia de ' + data.battery.time;
            // let batStr = data.battery.percentage;
            // let batSpc = parseFloat( batStr.substring(0, batStr.length-1) );
            // this.pcChecker.batClass = batSpc <= 15 ? 'failMsg' : 'workMsg'; 
        }, function (err) {
            console.log('pc info error');
            _this.pcChecker.msg = 'Erro: cheque o computador.';
            _this.pcChecker.class = 'failMsg';
        });
    };
    AppComponent.prototype.moveFile = function (i, dest) {
        var _this = this;
        if (i == this.files.length || this.isFull || this.stopTransfer || !dest) {
            this.transferInfo.active = false;
            this.transferInfo.n = 0;
            this.transferInfo.total = 0;
            this.saving = false;
            this.clear();
            if (this.isFull || this.stopTransfer) {
                var j = i === 0 ? 0 : i - 1;
                this.driveChecker.trf_msg = j + ' de ' + this.files.length + ' arquivos transferidos.';
            }
            return;
        }
        this.transferInfo.n = i + 1;
        this.transferInfo.msg = 'transferindo arquivo ' + this.transferInfo.n + ' de ' + this.transferInfo.total;
        var temp = this.files[i];
        temp.destination = dest;
        this.http.post(temp, 'transfer_file').subscribe(function (x) {
            _this.isFull = x == 'full';
            return _this.moveFile(i + 1, dest);
        }, function (error) {
            console.log(error);
            console.log('transfer error');
            _this.cancelTransfer();
        });
    };
    AppComponent.prototype.cancelTransfer = function () {
        var _this = this;
        this.http.get('kill_transfer').subscribe(function (x) {
            _this.stopTransfer = true;
            _this.transferInfo.active = false;
            _this.transferInfo.n = 0;
            _this.transferInfo.total = 0;
            _this.saving = false;
        }, function (err) {
            console.log(err);
            console.log('not able to stop transfer');
        });
    };
    AppComponent.prototype.transferToFlash = function () {
        var _this = this;
        this.http.get('list_files').subscribe(function (files) {
            if (files == 'nousb') {
                return false;
            }
            _this.transferInfo.active = true;
            _this.transferInfo.total = files.files.length;
            _this.files = files.files;
            _this.stopTransfer = false;
            _this.saving = true;
            _this.moveFile(0, files.destination);
        });
    };
    AppComponent.prototype.shutdown = function () {
        var sure = confirm('Tem certeza que deseja desligar o computador?');
        if (sure) {
            this.http.get('shutdown').subscribe();
            this.saving = false;
        }
    };
    AppComponent.prototype.checkSensors = function () {
        var _this = this;
        this.http.get('sensor_monitor').subscribe(function (x) {
            x.lidar = x.laser_pcap && x.laser_bag;
            _this.sensors.monitor = x;
            for (var i in x) {
                _this.sensors.msg[i] = x[i] ? 'OK' : 'N/A';
                _this.sensors.class[i] = x[i] ? 'workMsg' : 'failMsg';
            }
            _this.checkSensors();
        });
    };
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        var that = this;
        that.checkSensors();
        setInterval(function () {
            _this.checkPcInfo();
            _this.checkFlashDrive();
        }, 1000);
        // window.onbeforeunload = function(e){
        //   that.stopCapture();
        // }
        // window.addEventListener("beforeunload", function (event) {
        //   that.stopCapture(false);
        //   // event.returnValue = "browsing away...";
        // });
        window.addEventListener('beforeunload', function (e) {
            _this.stopCapture(false);
            _this.cancelTransfer();
        });
        this.stopCapture(false);
        this.cancelTransfer();
        this.http.get('make_dir').subscribe();
    };
    return AppComponent;
}());
AppComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["n" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__("../../../../../src/app/app.component.html"),
        styles: [__webpack_require__("../../../../../src/app/app.component.css")]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__http_service__["a" /* HttpService */] /*, public dialog: MatDialog*/ !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__http_service__["a" /* HttpService */] /*, public dialog: MatDialog*/) === "function" && _a || Object])
], AppComponent);

var _a;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ "../../../../../src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__("../../../platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_component__ = __webpack_require__("../../../../../src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_forms__ = __webpack_require__("../../../forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__http_service__ = __webpack_require__("../../../../../src/app/http.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["L" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_4__angular_common_http__["b" /* HttpClientModule */]
        ],
        providers: [__WEBPACK_IMPORTED_MODULE_5__http_service__["a" /* HttpService */]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_2__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "../../../../../src/app/http.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HttpService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common_http__ = __webpack_require__("../../../common/@angular/common/http.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var HttpService = (function () {
    function HttpService(http) {
        this.http = http;
        this.serverAddress = '';
        this.serverPort = 5001;
        this.ajaxHeader = new __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["c" /* HttpHeaders */]({
            'Content-Type': 'application/json'
        });
        var localhost = window.location.href.split(':')[1];
        var nchar = localhost.length;
        if (localhost[nchar - 1] == '/')
            localhost = localhost.substring(0, nchar - 1);
        this.serverAddress = 'http:' + localhost + ':' + this.serverPort + '/';
    }
    HttpService.prototype.get = function (page) {
        var url = this.serverAddress + page;
        return this.http.get(url, { headers: this.ajaxHeader, responseType: 'json' });
    };
    HttpService.prototype.post = function (sendInfo, page) {
        var url = this.serverAddress + page;
        return this.http.post(url, sendInfo, { headers: this.ajaxHeader, responseType: 'json' });
    };
    return HttpService;
}());
HttpService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_common_http__["a" /* HttpClient */]) === "function" && _a || Object])
], HttpService);

var _a;
//# sourceMappingURL=http.service.js.map

/***/ }),

/***/ "../../../../../src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.
// The file contents for the current environment will overwrite these during build.
var environment = {
    production: false
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "../../../../../src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("../../../core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("../../../platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("../../../../../src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("../../../../../src/environments/environment.ts");




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_20" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */])
    .catch(function (err) { return console.log(err); });
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__("../../../../../src/main.ts");


/***/ })

},[0]);
//# sourceMappingURL=main.bundle.js.map