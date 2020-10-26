import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Subject } from 'rxjs/internal/Subject';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-aprovacoespendentes',
  templateUrl: './aprovacoespendentes.component.html',
  styleUrls: ['./aprovacoespendentes.component.css']
})
export class AprovacoesPendentesComponent implements OnInit {

  /* Variaveis */
  public alerta = new Subject<string>();
  staticAlertClosed = true;

  /* Mensagens */
  mensagem = '';
  mensagemSucesso = '';
  mensagemErro = '';

  clockHandle;
  listaDePontos: any;
  registroPonto: any;
  ponto: any;

  urlBase = this.appService.buscarUrlBase();
  idUsuario = this.appService.buscarUsuario();
  public paginaAtual = 1;

  constructor(private appService: AppService) { }

  ngOnInit(): void {


    this.registroPonto = {};

    this.ponto = {
      idRegistroPonto: '',
      idUsuario: this.appService.buscarUsuario(),
      dataRegistro: '',
      horaRegistro: '',
      justificaPonto: '',
      justificativaReprovacao: ''
    };

    this.listarRegistrosPontoEditarMarcacao();

    this.clockHandle = setInterval(() => {
      /* Remove o alerta após o tempo determinado (milisegundos) */
      this.alerta.pipe(debounceTime(5000)).subscribe(() => {
        this.mensagem = '', this.mensagemErro = '', this.mensagemSucesso = ''
      });
    }, 1000);
  }

  listarRegistrosPontoEditarMarcacao() {
    const dataInicial = moment().subtract(30, 'days').format();
    this.listaDePontos = this.buscarRegistrosPonto();
  }

  buscarRegistrosPonto() {
    this.appService.buscarRegistrosPontoAprovacoesPendentes().subscribe((registroPonto) => {
      this.registroPonto = registroPonto;
      const grupoData = new Set(this.registroPonto
        .map(item => item.dataRegistro));
      const grupoUsuario = new Set(this.registroPonto
        .map(item => item.idUsuario));
      this.listaDePontos = [];
      grupoUsuario.forEach(gu => grupoData.forEach(gd =>
            this.listaDePontos.push({
              idUsuario: gu,
              dataRegistro: gd,
              pontos: this.registroPonto.filter(i => i.idUsuario === gu)
            }),
          ));

      console.log(this.listaDePontos)
    });
  }

  buscarRegistroPontoID(idRegistroPonto: number) {
    this.appService.buscarRegistroPontoID(idRegistroPonto).subscribe(
      resposta => this.registroPonto = resposta);
  }

  updateRegistroPonto() {
    this.appService.updateRegistroPonto(this.registroPonto).subscribe(
      success => {
        this.alerta.next(this.mensagemSucesso = (`Alteração Realizada com Sucesso.`));
        this.listarRegistrosPontoEditarMarcacao();
      },
      error => {
        this.alerta.next(this.mensagemErro = ('Não foi possivel realizar a alteração.'));
      }
    );
  }
}

