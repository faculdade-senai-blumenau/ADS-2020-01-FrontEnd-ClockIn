import { Component, OnInit } from '@angular/core';
import { EditarMarcacaoService } from './editarmarcacao.service';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-editarmarcacao',
  templateUrl: './editarmarcacao.component.html',
  styleUrls: ['./editarmarcacao.component.css']
})
export class EditarMarcacaoComponent implements OnInit {
  clockHandle;
  listaDePontos: any[];
  registroPonto: any;

  /* Variaveis alerta */
  public alerta = new Subject<string>();
  staticAlertClosed = true;
  mensagem = '';
  mensagemErro = '';
  mensagemSucesso = '';


  constructor(
    public editarMarcacaoService: EditarMarcacaoService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {

    this.editarMarcacaoService.buscarPontoUsuario(2).subscribe(
      resposta => this.registroPonto = resposta);

    const dataInicialFiltro = moment().subtract(30, 'days').format();
    this.clockHandle = setInterval(() => {

      /* Remove o alerta após o tempo determinado (milisegundos) */
      this.alerta.pipe(debounceTime(5000)).subscribe(() => {
        this.mensagemErro = '', this.mensagemSucesso = '';
      });

      /* Agrupa os horarios de registro por Data  e Filtra a lista de registros */
      const groups = new Set(this.registroPonto.filter(i => i.dataRegistro > dataInicialFiltro)
        .map(item => item.dataRegistro));
      this.listaDePontos = [];
      groups.forEach(g =>
        this.listaDePontos.push({
          dataRegistro: g,
          values: this.registroPonto.filter(i => i.dataRegistro === g)
        },
        ));
    }, 1000);
  }

  buscarRegistroPontoID() {
    this.editarMarcacaoService.buscarRegistroPontoID(0).subscribe(
      resposta => this.registroPonto = resposta);
  }

  updateRegistroPonto(): void {
    this.editarMarcacaoService.updateRegistroPonto(this.registroPonto).subscribe(
      success => {
        this.alerta.next(this.mensagemSucesso = (`Alteração Realizada com Sucesso!`));
      },
      error => {
        this.alerta.next(this.mensagemErro = ('Não foi possivel realizar a alteração'));
      }
    );
    console.log(this.registroPonto);
  }
}
