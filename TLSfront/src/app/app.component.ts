import { Component } from '@angular/core';
import { HttpService } from './http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpService){ }
  
  fileName = '';
  fileLink = "";
  counter: any;
  startNow: any;
  space: any;
  saving: boolean = false;
  pcInfo: any;

  testChecker: any = {loading: false}
  testConnection(){
   
    this.testChecker.loading = true;
    this.http.get('check').subscribe(
      data => {
        if(data){
          this.testChecker.msg = 'OK!'
          this.testChecker.class = 'workMsg'
        }else{
          this.testChecker.msg = 'Erro: tente reconectar os cabos.'
          this.testChecker.class = 'failMsg'
        }
        this.testChecker.loading = false;
      },
      err => {
        this.testChecker.loading = false;
        this.testChecker.msg = 'Erro: cheque o computador.'
        this.testChecker.class = 'failMsg'
      }
    );
  }

  getChecker: any = {loading: false, finished: false};
  captureFile(){

    if(this.fileName == ''){
      this.getChecker.msg = 'Dê um nome para o arquivo.';
      this.getChecker.class = 'failMsg';
      return
    }else{
      this.getChecker.msg = '';
    }

    this.getChecker.loading  = true;
    this.getChecker.finished = false;
    this.getChecker.unsaved  = true;
    this.http.post({name: this.fileName}, 'create').subscribe(
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
            this.getChecker.msg = 'Sem fluxo de dados, cheque as conexões.';
            this.getChecker.class = 'failMsg';
            this.getChecker.loading = false;
            this.getChecker.unsaved = false;
          }
        },
        err => {
          this.getChecker.msg = 'Erro: cheque o computador.';
          this.getChecker.class = 'failMsg';
          this.getChecker.loading = false;
          this.getChecker.unsaved = false;
        }
      )
  }

  stopCapture(block = true){
    
    clearInterval(this.counter);

    this.http.get('kill').subscribe(
      data => {        
        this.fileLink = this.http.serverAddress + 'download/' + this.fileName + '.pcap';

        if(block){
          this.getChecker.finished = true;
          this.getChecker.loading = false;
        }
      },
      err => {
        if(block){
          this.getChecker.finished = false;
          this.getChecker.loading = false;  
        }
      }
    );
  }

  save(){
    this.saving = true;
    this.http.post({name: this.fileName}, 'save').subscribe( (back: any) => {
        this.driveChecker.msg = (typeof back === 'number') ? back.toFixed(2) + ' GB livres' : '';
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
      window.location.reload(true);
    }
  }

  setMonitor(){
    this.counter = setInterval(() => {
      if(!this.startNow) return;
      
      this.http.post({name: this.fileName}, 'monitor').subscribe(
          (resp: any) => {
            if(!!resp){
              let fSize = parseInt(resp) / 1024 / 1024;
              let passed = (Date.now() - this.startNow) / 1000;
              
              this.getChecker.msg = passed.toFixed(0) + ' s, ' + fSize.toFixed(0) + ' MB';
              this.getChecker.class = 'workMsg';  
            }else{
              this.getChecker.msg = 'Sem fluxo de dados, cheque as conexões.';
              this.getChecker.class = 'failMsg';
              this.getChecker.loading = false;
              this.getChecker.unsaved = false;
            }
          },
          err => {
            this.getChecker.msg = 'Erro: cheque o computador.';
            this.getChecker.class = 'failMsg';
            this.getChecker.loading = false;
            this.getChecker.unsaved = false;
          }
      )}, 3000)
  }

  driveChecker: any = {msg: '', class: '', available: false}
  checkFlashDrive(){
    
    this.http.get('check_drive').subscribe(
      (data: any) => {        
        if(data){
          this.driveChecker.msg = data.toFixed(2) + ' GB livres';
          this.driveChecker.class = 'workMsg'
          this.driveChecker.available = true;
        }else{
          this.driveChecker.msg = 'Disco flash não disponível.';
          this.driveChecker.class = 'failMsg';
          this.driveChecker.available = false;
        }
      },
      err => {
        this.driveChecker.msg = 'Erro: cheque o computador.';
        this.driveChecker.class = 'failMsg';
        this.driveChecker.available = false;
      }
    );
  }

  pcChecker: any = {dskMsg: '', batMsg: '', dskClass: '', batClass: ''}
  checkPcInfo(){
    this.http.get('check_pc').subscribe(
      (data: any) => {
        console.table(data);
        this.pcChecker.dskMsg = 'Disco ' + data.storage.used + ' cheio, ' + data.storage.available.toFixed(2) + ' GB disponíneis';
        
        let dskStr = data.storage.used;
        let dskSpc = parseFloat( dskStr.substring(0, dskStr.length-1) );

        this.pcChecker.dskClass = dskSpc < 15 ? 'failMsg' : 'workMsg'; 

        this.pcChecker.batMsg = 'Bateria ' + data.battery.percentage + ' cheia, autonomia de ' + data.battery.time;
        
        let batStr = data.battery.percentage;
        let batSpc = parseFloat( batStr.substring(0, batStr.length-1) );

        this.pcChecker.batClass = batSpc < 15 ? 'failMsg' : 'workMsg'; 

      },
      err => {
        console.log('pc info error')
        this.pcChecker.msg = 'Erro: cheque o computador.';
        this.pcChecker.class = 'failMsg';
      }
    );
  }

  transferToFlash(){
    this.http.get('list_files').subscribe( 
      (files: any) => {
        console.log(files);
      })
  }

  ngOnInit(){
    // this.http.setLocalhost();
    // console.log(this.http);

    this.checkFlashDrive();
    this.checkPcInfo();
    var that = this;
    // window.onbeforeunload = function(e){
    //   that.stopCapture();
    // }

    window.addEventListener("beforeunload", function (event) {
      that.stopCapture(false);
      // event.returnValue = "browsing away...";
    });

    if(performance.navigation.type == 1){
      console.log('page reloaded...')
      this.stopCapture(false);
    }
  }

}
