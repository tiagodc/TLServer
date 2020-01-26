import { Component /*, Inject*/ } from '@angular/core';
// import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { HttpService } from './http.service';
import { post } from 'selenium-webdriver/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpService/*, public dialog: MatDialog*/){ }
  
  fileName = '';
  fileLink = "";
  counter: any;
  startNow: any;
  space: any;
  saving: boolean = false;
  pcInfo: any;

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

  checkFileExists(){
    
    if(this.fileName == ''){
      this.getChecker.msg = 'Dê um nome para o arquivo.';
      this.getChecker.class = 'failMsg';
      return
    }else{
      this.getChecker.msg = '';
    }

    this.getChecker.loading  = true;

    this.http.post({name: this.fileName}, 'check_file').subscribe(
      x => {
        var answer = true;
        if(x){
          answer = confirm('Já existe um arquivo com esse nome, deseja sobrescrevê-lo?');
        }
        
        if(answer){
          this.captureFile()
        }else{
          this.getChecker.loading  = false;
        }
      },
      err => console.log('erro de arquivo', err)
      );
  }

  getChecker: any = {loading: false, finished: false};
  captureFile(){

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
          this.getChecker.unsaved = false;
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
    // this.testChecker = {loading: false}
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
              // let fSize = parseInt(resp) / 1024 / 1024;
              let passed = (Date.now() - this.startNow) / 1000;
              
              this.getChecker.msg = passed.toFixed(0) + ' s'; //+ fSize.toFixed(0) + ' MB';
              this.getChecker.class = 'workMsg';  
            }/*else{
              this.getChecker.msg = 'Sem fluxo de dados, cheque as conexões.';
              this.getChecker.class = 'failMsg';
              this.getChecker.loading = false;
              this.getChecker.unsaved = false;
            }*/
          },
          err => {
            this.getChecker.msg = 'Erro: cheque o computador.';
            this.getChecker.class = 'failMsg';
            this.getChecker.loading = false;
            this.getChecker.unsaved = false;
          }
      )}, 3000)
  }

  driveChecker: any = {msg: '', class: '', available: false, trf_msg: false}
  checkFlashDrive(){

    this.http.get('check_drive').subscribe(
      (data: any) => {        
        if(data){
          this.driveChecker.msg = data.toFixed(2) + ' GB livres';
          this.driveChecker.class = 'workMsg'
          this.driveChecker.available = true;

          if(this.isFull){
            this.driveChecker.msg = 'Disco cheio!';
            this.driveChecker.class = 'failMsg';
          }

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

  pcChecker: any = {dskMsg: '', batMsg: '', dskClass: '', batClass: '', fileMsg: ''}
  checkPcInfo(){
    this.http.get('check_pc').subscribe(
      (data: any) => {

        this.pcChecker.dskMsg = 'Disco ' + data.storage.used + ' cheio, ' + data.storage.available.toFixed(2) + ' GB disponíneis';
        this.pcChecker.fileMsg = data.files + ' arquivo(s) não transferidos';        

        let dskStr = data.storage.used;
        let dskSpc = parseFloat( dskStr.substring(0, dskStr.length-1) );

        this.pcChecker.dskClass = dskSpc >= 85 ? 'failMsg' : 'workMsg'; 

        // this.pcChecker.batMsg = 'Bateria ' + data.battery.percentage + ' cheia' //+ ' autonomia de ' + data.battery.time;
        
        // let batStr = data.battery.percentage;
        // let batSpc = parseFloat( batStr.substring(0, batStr.length-1) );

        // this.pcChecker.batClass = batSpc <= 15 ? 'failMsg' : 'workMsg'; 

      },
      err => {
        console.log('pc info error')
        this.pcChecker.msg = 'Erro: cheque o computador.';
        this.pcChecker.class = 'failMsg';
      }
    );
  }

  files = [];
  isFull = false;
  stopTransfer = false;
  moveFile(i, dest){
    if(i == this.files.length || this.isFull || this.stopTransfer || !dest){
      this.transferInfo.active = false;
      this.transferInfo.n = 0;
      this.transferInfo.total = 0;
      this.saving = false;
      this.clear();
      
      let j = i;
      if(this.isFull || this.stopTransfer){
        j = i === 0 ? 0 : i-1;
      }
      
      this.driveChecker.trf_msg = j + ' de ' + this.files.length + ' arquivos transferidos.';  

      return;
    }

    this.transferInfo.n = i+1;
    this.transferInfo.msg = 'transferindo arquivo ' + this.transferInfo.n + ' de ' + this.transferInfo.total;

    let temp = this.files[i];
    temp.destination = dest;
    this.http.post(temp, 'transfer_file').subscribe(
      (x: any) => {
        this.isFull = x == 'full';

        return this.moveFile(i+1, dest);
      },
      (error: any) => {
        console.log(error);
        console.log('transfer error');
        this.cancelTransfer();
      })
  }

  cancelTransfer(){
    this.http.get('kill_transfer').subscribe(x => {
      this.stopTransfer = true;
      this.transferInfo.active = false;
      this.transferInfo.n = 0;
      this.transferInfo.total = 0;
      this.saving = false;
    },
    err => {
      console.log(err);
      console.log('not able to stop transfer');
    })
  }

  transferInfo: any = { active : false , n: 0, total: 0, msg: '' };
  transferToFlash(){
    this.http.get('list_files').subscribe( 
      (files: any) => {

        if(files == 'nousb'){
          return false;
        }

        this.transferInfo.active = true;
        this.transferInfo.total = files.files.length;
        this.files = files.files;
        this.stopTransfer = false;
        this.saving = true;

        this.moveFile(0, files.destination);
      })
  }

  shutdown(){
    let sure = confirm('Tem certeza que deseja desligar o computador?')
    if(sure){
      this.http.get('shutdown').subscribe()
      this.saving = false;
    }
  }

  sensors: any = {monitor:{}, msg:{}, class:{}}
  checkSensors(){
    this.http.get('sensor_monitor').subscribe(
      (x: any) => {
        x.lidar = x.laser_pcap && x.laser_bag;
        this.sensors.monitor = x;

        for(let i in x){
          this.sensors.msg[i] = x[i] ? 'OK' : 'N/A';
          this.sensors.class[i] = x[i] ? 'workMsg' : 'failMsg';
        }

        this.checkSensors();
      }
    )
  }

  ngOnInit(){

    var that = this;
    that.checkSensors();

    setInterval(() =>{
      this.checkPcInfo()
      this.checkFlashDrive()
    }, 1000);
    
    // window.onbeforeunload = function(e){
    //   that.stopCapture();
    // }

    // window.addEventListener("beforeunload", function (event) {
    //   that.stopCapture(false);
    //   // event.returnValue = "browsing away...";
    // });

    window.addEventListener('beforeunload', (e) => {            
      this.stopCapture(false);
      this.cancelTransfer(); 
    });

    this.stopCapture(false);
    this.cancelTransfer(); 

    this.http.get('make_dir').subscribe();
  }

}
