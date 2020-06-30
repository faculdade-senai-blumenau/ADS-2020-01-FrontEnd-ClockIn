import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from './home.service';
import { Usuario, RegistroPonto, Setor } from './home.model';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  /* Usuario Logado Fixo até a implementação do Login */
  idUsuarioLogado = 2;

  /* Variáveis do Relógio */
  clockHandle;
  relogio: string;
  dataAtual: string;
  dataHoraBatida: Date;

  /* Objeto Usuario - Armazena o usuario retornado do banco*/
  usuario: Usuario;

  /* Objeto RegistroPonto - Armazena a lista de pontos retornada do banco*/
  registroPonto: any[];
  ponto: any;

  /* Objeto Setor - Armazena o setor do Usuario retornado do banco*/
  setor: Setor;

  /* Variaveis alerta */
  public alerta = new Subject<string>();
  staticAlertClosed = true;
  mensagem = '';
  mensagemErro = '';
  mensagemSucesso = '';

  /* Variaveis Botão Ponto */
  public botaoPonto = new Subject();
  btnPonto = 'success btn-lg';
  btnPontoMensagem = 'Registrar Ponto';
  disablePonto = '';
  desabilitar = '1';

  /* Lista de Pontos agrupados por data */
  listaDePontos: any[];

  constructor(private homeService: HomeService,
              private datePipe: DatePipe) {
  }

  ngOnInit() {
    /* Retorna a data e hora atual */
    this.clockHandle = setInterval(() => {
      this.relogio = this.datePipe.transform(new Date(), 'HH:mm:ss');
      this.dataAtual = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
    }, 100);

    this.clockHandle = setInterval(() => {
      /* Retorna lista de registros da tabela de pontos */
      this.homeService.buscarRegistrosPonto(this.idUsuarioLogado).subscribe(
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

    }, 200);

    /* Retorna Usuario pelo ID Usuario*/
    this.homeService.buscarUsuarioPeloID(this.idUsuarioLogado).subscribe((usuario) => {
      this.usuario = usuario;
    });

    /* Retorna Setor Usuario pelo ID Usuario*/
    this.homeService.buscarSetorUsuario(this.idUsuarioLogado).subscribe((setor) => {
      this.setor = setor;
    });



    /* Remove o alerta após o tempo determinado (milisegundos) */
    this.alerta.pipe(debounceTime(5000)).subscribe(() => {
      this.mensagemErro = '', this.mensagemSucesso = '';
    });

    /* Habilita novamente o botão após o tempo determinado (60000 = 1 minuto) */
    this.botaoPonto.pipe(debounceTime(60000)).subscribe(() => {
      this.botaoPonto.next(this.btnPonto = 'success btn-lg');
      this.botaoPonto.next(this.disablePonto = '');
      this.botaoPonto.next(this.desabilitar = '1');
      this.botaoPonto.next(this.btnPontoMensagem = 'Registrar Ponto');
    });
  }

  registrarPonto(): void {
    this.ponto = {
      idUsuario: this.idUsuarioLogado,
      dataRegistro: new Date(),
      horaRegistro: this.relogio
    };
    this.homeService.registrarPonto(this.ponto).subscribe(
      success => {
        this.dataHoraBatida = new Date();
        this.botaoPonto.next(this.btnPonto = 'success btn-lg');
        this.botaoPonto.next(this.disablePonto = 'disabled');
        this.botaoPonto.next(this.desabilitar = '2');
        this.botaoPonto.next(this.btnPontoMensagem = 'Ponto Registrado');
        this.alerta.next(this.mensagemSucesso = (`Ponto Registrado com Sucesso em: `));
      },
      error => {
        this.botaoPonto.next(this.btnPonto = 'danger btn-lg');
        this.botaoPonto.next(this.btnPontoMensagem = 'Erro ao Registrar');
        this.alerta.next(this.mensagemErro = 'Erro ao Registrar Ponto');
      }
    );
  }
}
