
import { AppService } from 'src/app/app.service';
import { AppComponent } from './../../app.component';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-espelhoponto',
  templateUrl: './espelhoponto.component.html',
  styleUrls: ['./espelhoponto.component.css']
})
export class EspelhopontoComponent implements OnInit {

  /* Variaveis */
  public alerta = new Subject<string>();
  staticAlertClosed = true;
  /* Mensagens */
  mensagem = '';
  mensagemErro = '';
  mensagemSucesso = '';

  clockHandle;
  listaDePontos: any;
  registroPonto: any;
  ponto: any;

  constructor(private appComponent: AppComponent,
    private appService: AppService) { }

  ngOnInit() {
    this.registroPonto = {};
    this.clockHandle = setInterval(() => {
      /* Remove o alerta após o tempo determinado (milisegundos) */
      this.alerta.pipe(debounceTime(5000)).subscribe(() => {
        this.mensagemErro = '', this.mensagemSucesso = '';
      });
    }, 1000);
  }

  visualizarEspelhoPonto() {
    this.registroPonto = {};
    this.clockHandle = setInterval(() => {
      const dataInicialFiltro = moment().subtract(30, 'days').format();
      this.listaDePontos = this.appComponent.buscarRegistrosPonto(dataInicialFiltro);
    }, 200);
  }
}
