import { RegistroPonto } from './../../app.model';

import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';
import { DatePipe } from '@angular/common';
declare let $: any;

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css'],
  providers: [DatePipe]
})
export class RelatoriosComponent implements OnInit {
  clockHandle;
  listaDePontos: RegistroPonto[];
  listaDePontosVazia: RegistroPonto[];
  registroPonto: any;

  /* Variaveis alerta */
  public alerta = new Subject<string>();
  staticAlertClosed = true;
  mensagem = '';
  mensagemErro = '';
  mensagemSucesso = '';
  filtro: any;

  /* Data Filtro Relatório */
  dataInicial;
  dataFinal;

  constructor(private appComponent: AppComponent) { }

  ngOnInit() {

  }

  gerarRelatorio() {
    this.listaDePontos = this.appComponent.gerarRelatorio(this.dataInicial, this.dataFinal);
  }

  limparRelatorio(frm) {
    this.listaDePontos = this.listaDePontosVazia;
    frm.reset();
  }
}