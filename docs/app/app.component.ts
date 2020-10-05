import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { AppService } from './app.service';
import { DatePipe } from '@angular/common';
import { RegistroPonto } from './app.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  listaDePontos: any;
  registroPonto: any;

  urlBase = this.appService.buscarUrlBase();
  idUsuario = this.appService.buscarUsuario();
  dataInicialFiltro: DatePipe;

  constructor(private appService: AppService) {
  }

  ngOnInit() {
    this.buscarRegistrosPonto(this.idUsuario, null, null);
  }

  /* Retorna lista de registros da tabela de pontos */
  buscarRegistrosPonto(idUsuario: number, dataInicial: string, dataFinal: string) {
    this.appService.buscarRegistrosPontoUsuario(idUsuario).subscribe(
      resposta => this.registroPonto = resposta);
    const groups = new Set(this.registroPonto
      .filter(i => i.dataRegistro >= dataInicial && (i.dataRegistro <= dataFinal || dataFinal == null))
      .map(item => item.dataRegistro));
    this.listaDePontos = [];

    groups.forEach(g =>
      this.listaDePontos.push({
        dataRegistro: g,
        values: this.registroPonto.filter(i => i.dataRegistro === g)
      }),
    );
    return (this.listaDePontos);
  }
}

