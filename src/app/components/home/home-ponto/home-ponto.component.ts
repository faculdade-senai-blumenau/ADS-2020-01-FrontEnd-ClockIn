import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-home-ponto',
  templateUrl: './home-ponto.component.html',
  styleUrls: ['./home-ponto.component.css']
})
export class HomePontoComponent implements OnInit {
  postId;
  constructor(private http: HttpClient) { }

  async registrarPonto(){
    const route="posts";
    var loader=document.getElementById("loaderBtn");
    var btn=document.getElementById("registrarBtn");
    btn.style=loader.style='display:none';
    loader.style='display:inline';
    await this.delay(500);
    this.http.post<any>('http://localhost:3001/'+route, { idUsuario: 'idDoUsuario' }).subscribe(data => {
          this.postId = data.id;
      })
    btn.style=loader.style='display:inline';
    loader.style='display:none';
  }
   delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  } 
  ngOnInit() {
  }

}




  