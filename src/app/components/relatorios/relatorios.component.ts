import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css']
})
export class RelatoriosComponent implements OnInit {
  clockHandle;
  listaDePontos: any[];
  registroPonto: any;

  /* Variaveis alerta */
  public alerta = new Subject<string>();
  staticAlertClosed = true;
  mensagem = '';
  mensagemErro = '';
  mensagemSucesso = '';


  constructor(private appComponent: AppComponent) { }
  
  ngOnInit() {

  }
  gerarRelatorio() {
    this.registroPonto = {};
    this.clockHandle = setInterval(() => {
      const dataInicialFiltro = moment().subtract(30, 'days').format();
      this.listaDePontos = this.appComponent.buscarRegistrosPonto(dataInicialFiltro);
    }, 200);
  }
}

