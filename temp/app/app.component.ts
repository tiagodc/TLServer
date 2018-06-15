import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient){}
  
  fileName = '';
  fileLink = "";
  serverAddress = 'http://localhost:5000/';
  counter: any;
  startNow: any;

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
      }/*,
      err => {
        this.testChecker.loading = false;          this.testChecker.msg = 'Something went wrong, check the pi.'
        this.testChecker.class = 'failMsg'
      }*/
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
          if(!!resp){
            let fSize = parseInt(resp) / 1024 / 1024;
            this.getChecker.msg = '0 s';
            this.getChecker.class = 'workMsg';
          
            this.startNow = Date.now();
            this.setMonitor();

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

  download(){
    // this.fileLink = this.serverAddress + 'download/' + this.fileName + '.pcap';
    window.location.href = this.fileLink;
    this.clear();
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

}
