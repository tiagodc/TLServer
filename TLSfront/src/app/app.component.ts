import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private http: HttpClient){}
  
  fileName = 'teste';
  serverAddress = 'http://localhost:5000/';

  testConnection(){
    this.http.get('http://localhost:5000/check', {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).subscribe(data => {
      console.log(data);
    },
    err => {
      console.log("Error occured.")
    });
  }

}
