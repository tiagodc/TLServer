import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient){
    let localhost = window.location.href.split(':')[1];
    let nchar = localhost.length;
    if(localhost[nchar-1] == '/') localhost = localhost.substring(0, nchar-1);
  
    this.serverAddress = 'http:' + localhost + ':5001/'
    console.log('flask: ', this.serverAddress);
  }
  
  fileName = '';
  fileLink = "";
  serverAddress = '';
  counter: any;
  startNow: any;
  space: any;
  saving: boolean = false;

  ajaxHeader = new HttpHeaders({
    'Content-Type': 'application/json'
  })

  testChecker: any = {loading: false}
  testConnection(){
    let url = this.serverAddress + 'check';
    
    this.testChecker.loading = true;
    this.http.get(url, {headers: this.ajaxHeader, responseType: 'json'}).subscribe(
      data => {
        if(data){
          this.testChecker.msg = 'Working well!'
          this.testChecker.class = 'workMsg'
        }else{
          this.testChecker.msg = 'Not working, try reconnecting the cables.'
          this.testChecker.class = 'failMsg'
        }
        this.testChecker.loading = false;
      },
      err => {
        this.testChecker.loading = false;          this.testChecker.msg = 'Something went wrong, check the pi.'
        this.testChecker.class = 'failMsg'
      }
    );
  }

  getChecker: any = {loading: false, finished: false};
  captureFile(){

    if(this.fileName == ''){
      this.getChecker.msg = 'Provide a file name.';
      this.getChecker.class = 'failMsg';
      return
    }else{
      this.getChecker.msg = '';
    }

    let url = this.serverAddress + 'create'

    this.getChecker.loading  = true;
    this.getChecker.finished = false;
    this.getChecker.unsaved  = true;
    this.http.post(url, 
      {name: this.fileName}, 
      {headers: this.ajaxHeader, responseType: 'json'}).subscribe(
        (resp: any) => {
          console.log('flash file: ', typeof resp);
          if(!!resp && typeof resp === 'number'){
            // let fSize = resp / 1024 / 1024;
            this.getChecker.msg = '0 s';
            this.getChecker.class = 'workMsg';
          
            this.startNow = Date.now();
            this.setMonitor();
          
          }else if(typeof resp === 'string'){
            this.getChecker.msg = resp;
            this.getChecker.class = 'failMsg';
            this.getChecker.loading = false;
            this.getChecker.unsaved = false;
          
          }else{
            this.getChecker.msg = 'No data streaming, check connections.';
            this.getChecker.class = 'failMsg';
            this.getChecker.loading = false;
            this.getChecker.unsaved = false;
          }
        },
        err => {
          this.getChecker.msg = 'Something went wrong, check the pi.';
          this.getChecker.class = 'failMsg';
          this.getChecker.loading = false;
          this.getChecker.unsaved = false;
        }
      )
  }

  stopCapture(){
    let url = this.serverAddress + 'kill'
    
    clearInterval(this.counter);

    this.http.get(url, {headers: this.ajaxHeader, responseType: 'json'}).subscribe(
      data => {        
        this.fileLink = this.serverAddress + 'download/' + this.fileName + '.pcap';

        this.getChecker.finished = true;
        this.getChecker.loading = false;
      },
      err => {
        this.getChecker.finished = false;
        this.getChecker.loading = false;
      }
    );
  }

  save(){
    let url = this.serverAddress + 'save';

    this.saving = true;
    this.http.post(url, 
      {name: this.fileName}, 
      {headers: this.ajaxHeader, responseType: 'json'}).subscribe( (back: any) => {
        this.driveChecker.msg = (typeof back === 'number') ? back.toFixed(2) + ' GB free' : '';
        this.clear();
        this.saving = false;
      })
  }

  download(){
    // this.fileLink = this.serverAddress + 'download/' + this.fileName + '.pcap';
    window.location.href = this.fileLink;
    if(this.driveChecker.available) this.save();
    // this.clear();
  }

  clear(rename = false){
    this.testChecker = {loading: false}
    this.getChecker = {loading: false, finished: false};
    this.startNow = 0;

    if(rename){
      this.fileName = '';
      this.fileLink = "";
    }
  }

  setMonitor(){
    this.counter = setInterval(() => {
      if(!this.startNow) return;
      
      let url = this.serverAddress + 'monitor';

      this.http.post(url, 
        {name: this.fileName}, 
        {headers: this.ajaxHeader, responseType: 'json'}).subscribe(
          (resp: any) => {
            if(!!resp){
              let fSize = parseInt(resp) / 1024 / 1024;
              let passed = (Date.now() - this.startNow) / 1000;
              
              this.getChecker.msg = passed.toFixed(0) + ' s, ' + fSize.toFixed(0) + ' MB';
              this.getChecker.class = 'workMsg';  
            }else{
              this.getChecker.msg = 'No data streaming, check connections.';
              this.getChecker.class = 'failMsg';
              this.getChecker.loading = false;
              this.getChecker.unsaved = false;
            }
          },
          err => {
            this.getChecker.msg = 'Something went wrong, check the pi.';
            this.getChecker.class = 'failMsg';
            this.getChecker.loading = false;
            this.getChecker.unsaved = false;
          }
      )}, 3000)
  }

  driveChecker: any = {msg: '', class: '', available: false}
  checkFlashDrive(){
    let url = this.serverAddress + 'check_drive'
    
    this.http.get(url, {headers: this.ajaxHeader, responseType: 'json'}).subscribe(
      (data: any) => {        
        if(data){
          this.driveChecker.msg = data.toFixed(2) + ' GB free';
          this.driveChecker.class = 'workMsg'
          this.driveChecker.available = true;
        }else{
          this.driveChecker.msg = 'No flash drive available.';
          this.driveChecker.class = 'failMsg';
          this.driveChecker.available = false;
        }
      },
      err => {
        this.driveChecker.msg = 'Something went wrong, check the pi.';
        this.driveChecker.class = 'failMsg';
        this.driveChecker.available = false;
      }
    );
  }

  ngOnInit(){
    this.checkFlashDrive();
  }

}
