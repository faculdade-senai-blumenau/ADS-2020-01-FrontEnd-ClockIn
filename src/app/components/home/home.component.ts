import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Router, ActivatedRoute } from "@angular/router";
import { HomeService } from "./home.service";
import { Usuario, RegistroPonto } from "./home.model";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private homeService: HomeService,
    private route: ActivatedRoute) { }

  /* Variáveis Relógio */
  relogio;
  clockHandle;

  /* Variáveis Usuario */
  usuario: Usuario;

  /* Variaveis alerta Inicio*/
  public alerta = new Subject<string>();
  staticAlertClosed = true;
  mensagem = '';
  mensagemErro = '';
  mensagemSucesso = '';

  /* Variaveis Botão Ponto */
  public botaoPonto = new Subject();
  btnPonto = "secondary btn-lg";
  btnPontoMensagem = "Registrar Ponto";
  disablePonto = "";
  disableBtn = false;
  desabilitar = '1';
  dataHoraBatida;

  ngOnInit() {
    /* Chama o método buscarUsuarioPeloID() do serviço*/
    const idUsuario = +this.route.snapshot.paramMap.get('idUsuario');
    this.homeService.buscarUsuarioPeloID(2).subscribe((usuario) => {
      this.usuario = usuario;
    });

    /* Retorna a data e hora atual */
    this.clockHandle = setInterval(() => {
      this.relogio = Date.now();
    }, 1000);
    /* Remova o alerta após o tempo determinado */
    this.alerta.pipe(debounceTime(30000)).subscribe(() => {
      this.mensagemErro = '', this.mensagemSucesso = ''
    });

    /* Habilita novamente o botão após o tempo determinado (60000 = 1 minuto) */
    this.botaoPonto.pipe(debounceTime(60000)).subscribe(() => {
      this.desabilitar = '1',
      this.btnPonto = "secondary btn-lg";
      this.btnPontoMensagem = "Registrar Ponto";
      this.disablePonto = "";
      this.disableBtn = false;
      this.desabilitar = '1';
    });
  }

  registroPonto: RegistroPonto = {
    idUsuario: 2,
    dataRegistro: null ,
    justificaPonto: 2,
    justificativaReprovacao: 'Teste'
}


  registrarPonto(): void {
    this.homeService.registrarPonto(this.registroPonto).subscribe(
      success => {
        this.botaoPonto.next(this.btnPonto = "success btn-lg");
        this.botaoPonto.next(this.disablePonto = "disabled");
        this.botaoPonto.next(this.desabilitar = '2');
        this.botaoPonto.next(this.btnPontoMensagem = "Ponto Registrado");
        this.dataHoraBatida = Date.now();
        this.alerta.next(this.mensagemSucesso = (`Ponto Registrado com Sucesso em: `));
      },
      error => {
        this.botaoPonto.next(this.btnPonto = "danger btn-lg");
        this.botaoPonto.next(this.btnPontoMensagem = "Erro ao Registrar");
        this.alerta.next(this.mensagemErro = 'Erro ao Registrar Ponto!');
      }
    );
  }
}
