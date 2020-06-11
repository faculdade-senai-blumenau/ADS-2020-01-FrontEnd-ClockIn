import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-home-ponto',
  templateUrl: './home-ponto.component.html',
  styleUrls: ['./home-ponto.component.css']
})
export class HomePontoComponent implements OnInit {
  
  constructor(private http: HttpClient) { 
  }
  btnPonto="success";
  btnPontoMensagem="Registrar Ponto";
  disablePonto="";
  disableEventPonto="";
  disableBtn=false;
  desabilitar='1';
  registrarPonto(){
    const route="posts";
    this.http.post<any>('http://localhost:3001/'+route, { idUsuario: 'idDoUsuario' }).subscribe(
    success => {
      this.btnPontoMensagem="Registrado";
      this.disablePonto="disabled";
      this.disableEventPonto="none;";
      this.desabilitar='2';
    },  
    error => {
      this.btnPonto="danger";
      this.btnPontoMensagem="Erro ao Registrar";
      this.disablePonto="disabled";
      this.disableEventPonto="none;";
      this.desabilitar='2';
    }
      
    );
  }
  
  isDesabilitado(): boolean{
    if(this.disableBtn){
      return true;
    }
    return false;
  }
  ngOnInit() {
  }
}




  