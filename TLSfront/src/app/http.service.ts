import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class HttpService {

  constructor(private http: HttpClient) {
    
    let localhost = window.location.href.split(':')[1];
    let nchar = localhost.length;

    if(localhost[nchar-1] == '/') localhost = localhost.substring(0, nchar-1);
  
    this.serverAddress = 'http:' + localhost + ':' + this.serverPort + '/';
  }

  serverAddress : string = '';
  serverPort = 5001;

  ajaxHeader = new HttpHeaders({
    'Content-Type': 'application/json'
  })

  get(page){

    let url = this.serverAddress + page;

    return this.http.get(url, {headers: this.ajaxHeader, responseType: 'json'});
  }

  post(sendInfo, page){

    let url = this.serverAddress + page;

    return this.http.post(url, sendInfo, {headers: this.ajaxHeader, responseType: 'json'})
  }

}
