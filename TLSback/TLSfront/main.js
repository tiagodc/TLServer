(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["main"],{

/***/ "./src/$$_lazy_route_resource lazy recursive":
/*!**********************************************************!*\
  !*** ./src/$$_lazy_route_resource lazy namespace object ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncaught exception popping up in devtools
	return Promise.resolve().then(function() {
		var e = new Error('Cannot find module "' + req + '".');
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = "./src/$$_lazy_route_resource lazy recursive";

/***/ }),

/***/ "./src/app/app.component.css":
/*!***********************************!*\
  !*** ./src/app/app.component.css ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = ".fileNameBox{\n    height: 30px;\n    width: 60%;\n    text-align: center;\n    margin-bottom: 20px;\n    margin-top: 10px;\n}\n\n.btnContainer{\n    text-align: center;\n}\n\n.btn{\n    margin: 10px;\n    height: 50px;\n    width:  40%;\n}\n\n.testBtn{\n    background-color: rgba(42, 148, 190, 0.808);\n}\n\n.getBtn{\n    background-color: rgba(0, 128, 0, 0.794);\n}\n\n.clearBtn{\n    background-color: rgba(255, 94, 0, 0.705)\n}\n\n.downBtn{\n    background-color: rgba(255, 94, 0, 0.705)\n}\n\n.stopBtn{\n    background-color: rgba(212, 32, 32, 0.829);\n}\n\n.workMsg{\n    color: blue;\n}\n\n.failMsg{\n    color: red;\n}\n\n.spacer{\n    width: 60%;\n    margin-left: 20%;\n    height: 2px;\n    border: 1px solid black;\n    background-color: black;\n}"

/***/ }),

/***/ "./src/app/app.component.html":
/*!************************************!*\
  !*** ./src/app/app.component.html ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = "<h2 style=\"text-align:center\">\n  Data collection from VLP16\n</h2>\n\n<div class=\"btnContainer\">\n\n  <div style=\"text-align:center\">File name (without extension):</div>\n  <input class=\"fileNameBox\" type=\"text\" [(ngModel)]=\"fileName\" [disabled]=\"getChecker.unsaved\" />\n\n  <button class=\"btn testBtn\" (click)=\"testConnection()\" [disabled]=\"testChecker.loading || getChecker.loading\">\n      <i *ngIf=\"testChecker.loading\" class=\"fa fa-cog fa-spin\"></i>\n      <span *ngIf=\"!testChecker.loading\">Test System</span>\n    </button>\n  \n  <div class=\"msg {{testChecker.class}}\">{{testChecker.msg}}</div>\n\n  <button class=\"btn getBtn\" (click)=\"captureFile()\" [disabled]=\"getChecker.loading || getChecker.finished\">\n    <i *ngIf=\"getChecker.loading\" class=\"fa fa-sync fa-spin\"></i>\n    <span *ngIf=\"!getChecker.loading\">Capture Data</span>\n  </button>\n\n  <div class=\"msg {{getChecker.class}}\">{{getChecker.msg}}</div>\n\n  <button class=\"btn stopBtn\" (click)=\"stopCapture()\" [disabled]=\"!getChecker.loading || !getChecker.msg\">\n    Stop Capture\n  </button>\n\n  <br><br>\n  <div class=\"spacer\"></div>\n  <br>\n\n  \n  <button class=\"btn downBtn\" [disabled]=\"!getChecker.finished\" (click)=\"download()\">\n    <i *ngIf=\"getChecker.loading\" class=\"fas fa-circle-notch fa-spin\"></i>\n    <span *ngIf=\"!getChecker.loading\">Download file</span>\n  </button>\n\n  <br>\n  or\n  <br>\n\n  <button class=\"btn clearBtn\" [disabled]=\"!getChecker.finished\" (click)=\"clear(true)\">\n    <i *ngIf=\"getChecker.loading\" class=\"fas fa-circle-notch fa-spin\"></i>\n    <span *ngIf=\"!getChecker.loading\">Clear data</span>\n  </button>\n</div>"

/***/ }),

/***/ "./src/app/app.component.ts":
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/*! exports provided: AppComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppComponent", function() { return AppComponent; });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (undefined && undefined.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AppComponent = /** @class */ (function () {
    function AppComponent(http) {
        this.http = http;
        this.fileName = '';
        this.fileLink = "";
        this.serverAddress = 'http://localhost:5000/';
        this.ajaxHeader = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpHeaders"]({
            'Content-Type': 'application/json'
        });
        this.testChecker = { loading: false };
        this.getChecker = { loading: false, finished: false };
    }
    AppComponent.prototype.testConnection = function () {
        var _this = this;
        var url = this.serverAddress + 'check';
        this.testChecker.loading = true;
        this.http.get(url, { headers: this.ajaxHeader, responseType: 'json' }).subscribe(function (data) {
            if (data) {
                _this.testChecker.msg = 'Working well!';
                _this.testChecker.class = 'workMsg';
            }
            else {
                _this.testChecker.msg = 'Not working, try reconnecting the cables.';
                _this.testChecker.class = 'failMsg';
            }
            _this.testChecker.loading = false;
        }, function (err) {
            _this.testChecker.loading = false;
            _this.testChecker.msg = 'Something went wrong, check the pi.';
            _this.testChecker.class = 'failMsg';
        });
    };
    AppComponent.prototype.captureFile = function () {
        var _this = this;
        if (this.fileName == '') {
            this.getChecker.msg = 'Provide a file name.';
            this.getChecker.class = 'failMsg';
            return;
        }
        else {
            this.getChecker.msg = '';
        }
        var url = this.serverAddress + 'create';
        this.getChecker.loading = true;
        this.getChecker.finished = false;
        this.getChecker.unsaved = true;
        this.http.post(url, { name: this.fileName }, { headers: this.ajaxHeader, responseType: 'json' }).subscribe(function (resp) {
            if (!!resp) {
                var fSize = parseInt(resp) / 1024 / 1024;
                _this.getChecker.msg = '0 s';
                _this.getChecker.class = 'workMsg';
                _this.startNow = Date.now();
                _this.setMonitor();
            }
            else {
                _this.getChecker.msg = 'No data streaming, check connections.';
                _this.getChecker.class = 'failMsg';
                _this.getChecker.loading = false;
                _this.getChecker.unsaved = false;
            }
        }, function (err) {
            _this.getChecker.msg = 'Something went wrong, check the pi.';
            _this.getChecker.class = 'failMsg';
            _this.getChecker.loading = false;
            _this.getChecker.unsaved = false;
        });
    };
    AppComponent.prototype.stopCapture = function () {
        var _this = this;
        var url = this.serverAddress + 'kill';
        clearInterval(this.counter);
        this.http.get(url, { headers: this.ajaxHeader, responseType: 'json' }).subscribe(function (data) {
            _this.fileLink = _this.serverAddress + 'download/' + _this.fileName + '.pcap';
            _this.getChecker.finished = true;
            _this.getChecker.loading = false;
        }, function (err) {
            _this.getChecker.finished = false;
            _this.getChecker.loading = false;
        });
    };
    AppComponent.prototype.download = function () {
        // this.fileLink = this.serverAddress + 'download/' + this.fileName + '.pcap';
        window.location.href = this.fileLink;
        this.clear();
    };
    AppComponent.prototype.clear = function (rename) {
        if (rename === void 0) { rename = false; }
        this.testChecker = { loading: false };
        this.getChecker = { loading: false, finished: false };
        this.startNow = 0;
        if (rename) {
            this.fileName = '';
            this.fileLink = "";
        }
    };
    AppComponent.prototype.setMonitor = function () {
        var _this = this;
        this.counter = setInterval(function () {
            if (!_this.startNow)
                return;
            var url = _this.serverAddress + 'monitor';
            _this.http.post(url, { name: _this.fileName }, { headers: _this.ajaxHeader, responseType: 'json' }).subscribe(function (resp) {
                if (!!resp) {
                    var fSize = parseInt(resp) / 1024 / 1024;
                    var passed = (Date.now() - _this.startNow) / 1000;
                    _this.getChecker.msg = passed.toFixed(0) + ' s, ' + fSize.toFixed(0) + ' MB';
                    _this.getChecker.class = 'workMsg';
                }
                else {
                    _this.getChecker.msg = 'No data streaming, check connections.';
                    _this.getChecker.class = 'failMsg';
                    _this.getChecker.loading = false;
                    _this.getChecker.unsaved = false;
                }
            }, function (err) {
                _this.getChecker.msg = 'Something went wrong, check the pi.';
                _this.getChecker.class = 'failMsg';
                _this.getChecker.loading = false;
                _this.getChecker.unsaved = false;
            });
        }, 3000);
    };
    AppComponent = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"])({
            selector: 'app-root',
            template: __webpack_require__(/*! ./app.component.html */ "./src/app/app.component.html"),
            styles: [__webpack_require__(/*! ./app.component.css */ "./src/app/app.component.css")]
        }),
        __metadata("design:paramtypes", [_angular_common_http__WEBPACK_IMPORTED_MODULE_1__["HttpClient"]])
    ], AppComponent);
    return AppComponent;
}());



/***/ }),

/***/ "./src/app/app.module.ts":
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/*! exports provided: AppModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AppModule", function() { return AppModule; });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/platform-browser */ "./node_modules/@angular/platform-browser/fesm5/platform-browser.js");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app.component */ "./src/app/app.component.ts");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "./node_modules/@angular/forms/fesm5/forms.js");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "./node_modules/@angular/common/fesm5/http.js");
var __decorate = (undefined && undefined.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
            declarations: [
                _app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]
            ],
            imports: [
                _angular_platform_browser__WEBPACK_IMPORTED_MODULE_0__["BrowserModule"],
                _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
                _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClientModule"]
            ],
            providers: [],
            bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_2__["AppComponent"]]
        })
    ], AppModule);
    return AppModule;
}());



/***/ }),

/***/ "./src/environments/environment.ts":
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/*! exports provided: environment */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "environment", function() { return environment; });
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.
var environment = {
    production: false
};
/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.


/***/ }),

/***/ "./src/main.ts":
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ "./node_modules/@angular/core/fesm5/core.js");
/* harmony import */ var _angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser-dynamic */ "./node_modules/@angular/platform-browser-dynamic/fesm5/platform-browser-dynamic.js");
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/app.module */ "./src/app/app.module.ts");
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./environments/environment */ "./src/environments/environment.ts");




if (_environments_environment__WEBPACK_IMPORTED_MODULE_3__["environment"].production) {
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_0__["enableProdMode"])();
}
Object(_angular_platform_browser_dynamic__WEBPACK_IMPORTED_MODULE_1__["platformBrowserDynamic"])().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_2__["AppModule"])
    .catch(function (err) { return console.log(err); });


/***/ }),

/***/ 0:
/*!***************************!*\
  !*** multi ./src/main.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /home/tiago/Desktop/TLServer/TLSfront/src/main.ts */"./src/main.ts");


/***/ })

},[[0,"runtime","vendor"]]]);
//# sourceMappingURL=main.js.map