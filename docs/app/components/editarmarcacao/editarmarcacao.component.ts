import { HomeComponent } from './../home/home.component';
import { Component, OnInit } from '@angular/core';
import { EditarMarcacaoService } from './editarmarcacao.service';
import * as moment from 'moment'

@Component({
  selector: 'app-editarmarcacao',
  templateUrl: './editarmarcacao.component.html',
  styleUrls: ['./editarmarcacao.component.css']
})
export class EditarMarcacaoComponent implements OnInit {
  clockHandle;
  homeService: any;
  listaDePontos: any[];
  registroPonto: any;

  constructor(
    private editarMarcacaoService: EditarMarcacaoService) {
  }

  ngOnInit() {

    this.clockHandle = setInterval(() => {
      /* Retorna lista de registros da tabela de pontos */
      this.editarMarcacaoService.buscarRegistrosPonto(2).subscribe(
        resposta => this.registroPonto = resposta);

      /* Filtra a lista de registros */
      const dataInicialFiltro = moment().subtract(10, 'days').format();

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

    }, 300);

  }
}
