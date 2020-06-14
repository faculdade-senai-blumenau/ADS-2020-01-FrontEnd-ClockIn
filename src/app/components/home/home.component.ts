import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Observable, EMPTY } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { Injectable } from "@angular/core";



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient) {
  }  
  
  /* Variáveis Relógio */
  relogio;
  clockHandle;

  ngOnInit(){
    /* Retorna a data e hora atual */
    this.clockHandle = setInterval(()=>{
      this.relogio = Date.now();
    },1000);
  }

  btnPonto = "success";
  btnPontoMensagem = "Registrar Ponto";
  disablePonto = "";
  disableEventPonto = "";
  disableBtn = false;
  desabilitar = '1';

  registrarPonto() {
    const route = "posts";
    this.http.post<any>('http://localhost:3001/' + route, { idUsuario: 'idDoUsuario' }).subscribe(
      success => {
        this.btnPontoMensagem = "Registrado";
        this.disablePonto = "disabled";
        this.disableEventPonto = "none;";
        this.desabilitar = '2';
      },
      error => {
        this.btnPonto = "danger";
        this.btnPontoMensagem = "Erro ao Registrar";
        this.disablePonto = "disabled";
        this.disableEventPonto = "none;";
        this.desabilitar = '2';
      }

    );
  }

  isDesabilitado(): boolean {
    if (this.disableBtn) {
      return true;
    }
    return false;
  }
}
