import { Component, OnInit } from '@angular/core';
import { Usuario } from '../home/home.model';
import { EspelhoPontoService } from './espelhoponto.service';
import * as moment from 'moment';

@Component({
  selector: 'app-espelhoponto',
  templateUrl: './espelhoponto.component.html',
  styleUrls: ['./espelhoponto.component.css']
})
export class EspelhopontoComponent implements OnInit {
  /* Usuario Logado Fixo até a implementação do Login */
  idUsuarioLogado = 2;
  /* Objeto Usuario - Armazena o usuario retornado do banco*/
  usuario: Usuario;

  /* Objeto RegistroPonto - Armazena a lista de pontos retornada do banco*/
  registroPonto: any[];
  ponto: any;

  /* Lista de Pontos agrupados por data */
  listaDePontos: any[];
  constructor(private espelhoPontoService: EspelhoPontoService ) {}

  ngOnInit(){
    setInterval(() => {
      
      /* Retorna lista de registros da tabela de pontos */
      this.espelhoPontoService.buscarRegistrosPonto(this.idUsuarioLogado).subscribe(
        resposta => this.registroPonto = resposta);

      /* Filtra a lista de registros */
      const dataInicialFiltro = moment().subtract(6, 'days').format();

      /* Agrupa os horarios de registro por Data */
      const groups = new Set(this.registroPonto.filter(i => i.dataRegistro > dataInicialFiltro)
        .map(item => item.dataRegistro));
      this.listaDePontos = [];
      groups.forEach(g =>
        this.listaDePontos.push({
          dataRegistro: g,
          values: this.registroPonto.filter(i => i.dataRegistro === g)
        },
        ));
    }, 150);
  }
  

}
