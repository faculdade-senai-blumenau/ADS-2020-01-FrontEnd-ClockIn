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

  dataInicialFiltro: DatePipe
  
  constructor(private datePipe: DatePipe,
    private appService: AppService) {
}

  ngOnInit() {

  }

  /* Retorna lista de registros da tabela de pontos */
  buscarRegistrosPonto(dataInicialFiltro: string)  {
    this.appService.buscarRegistrosPontoUsuario(this.idUsuario).subscribe(
      resposta => this.registroPonto = resposta);
    const groups = new Set(this.registroPonto.filter(i => i.dataRegistro > dataInicialFiltro)
      .map(item => item.dataRegistro));
    this.listaDePontos = [];
    groups.forEach(g =>
      this.listaDePontos.push({
        dataRegistro: g,
        values: this.registroPonto.filter(i => i.dataRegistro === g)
      },
      ));
      return(this.listaDePontos)
  };
  buscarRegistrosPontoRange(idUsuario: number,dataInicialFiltro: any,dataFinal:any)  {
    this.appService.buscarRegistrosPontoUsuarioRange(idUsuario,dataInicialFiltro,dataFinal).subscribe(
      resposta => this.registroPonto = resposta);
    const groups = new Set(this.registroPonto.filter(i => i.dataRegistro > dataInicialFiltro)
      .map(item => item.dataRegistro));
    this.listaDePontos = [];
    groups.forEach(g =>
      this.listaDePontos.push({
        dataRegistro: g,
        values: this.registroPonto.filter(i => i.dataRegistro === g)
      },
      ));
      return(this.listaDePontos)
  };
}
