import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Router, ActivatedRoute } from '@angular/router';
import { HomeService } from './home.service';
import { Usuario, RegistroPonto } from './home.model';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private homeService: HomeService) {

  }

  /* Usuario Logado Fixo até a implementação do Login */
  idUsuarioLogado = 3;

  /* Variáveis do Relógio */
  relogio;
  clockHandle;

  /* Objeto Usuario - Armazena o usuario retornado do banco*/
  usuario: Usuario;

  /* Objeto RegistroPonto - Armazena a lista de pontos retornada do banco*/
  registroPonto: RegistroPonto;

  /* Variaveis alerta */
  public alerta = new Subject<string>();
  staticAlertClosed = true;
  mensagem = '';
  mensagemErro = '';
  mensagemSucesso = '';

  /* Variaveis Botão Ponto */
  public botaoPonto = new Subject();
  btnPonto = 'secondary btn-lg';
  btnPontoMensagem = 'Registrar Ponto';
  disablePonto = '';
  disableBtn = false;
  desabilitar = '1';
  dataHoraBatida;

  /* Objeto Registro Ponto */
  pontoRegistrado: RegistroPonto = {
    idRegistroPonto: null,
    idUsuario: this.idUsuarioLogado,
    dataRegistro: new Date(),
    horaRegistro: '08:00',
    justificaPonto: 0,
    justificativaReprovacao: 'null'
  };

  ngOnInit() {

    /* Retorna a data e hora atual */
    this.clockHandle = setInterval(() => {
      this.relogio = new Date();
    });

    /* Retorna lista de registros da tabela de pontos */
    this.homeService.buscarRegistrosPonto().subscribe(
      resposta => this.registroPonto = resposta);

    /* Retorna Usuario pelo ID*/
    this.homeService.buscarUsuarioPeloID(this.idUsuarioLogado).subscribe((usuario) => {
      this.usuario = usuario;
    });

    /* Remove o alerta após o tempo determinado (milisegundos) */
    this.alerta.pipe(debounceTime(5000)).subscribe(() => {
      this.mensagemErro = '', this.mensagemSucesso = '';
    });

    /* Habilita novamente o botão após o tempo determinado (60000 = 1 minuto) */
    this.botaoPonto.pipe(debounceTime(60000)).subscribe(() => {
      this.desabilitar = '1',
        this.btnPonto = 'secondary btn-lg';
      this.btnPontoMensagem = 'Registrar Ponto';
      this.disablePonto = '';
      this.disableBtn = false;
      this.desabilitar = '1';
    });
  }

  registrarPonto(): void {
    this.homeService.registrarPonto(this.pontoRegistrado).subscribe(
      success => {
        this.botaoPonto.next(this.btnPonto = 'success btn-lg');
        this.botaoPonto.next(this.disablePonto = 'disabled');
        this.botaoPonto.next(this.desabilitar = '2');
        this.botaoPonto.next(this.btnPontoMensagem = 'Ponto Registrado');
        this.alerta.next(this.mensagemSucesso = (`Ponto Registrado com Sucesso em: `));
      },
      error => {
        this.botaoPonto.next(this.btnPonto = 'danger btn-lg');
        this.botaoPonto.next(this.btnPontoMensagem = 'Erro ao Registrar');
        this.alerta.next(this.mensagemErro = 'Erro ao Registrar Ponto!');
      }
    );
  }
}
