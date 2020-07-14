import { AppComponent } from './../../app.component';
import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Usuario, Setor } from 'src/app/app.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  /* Variáveis do Relógio */
  clockHandle;
  relogio: string;
  dataAtual: string;
  dataHoraBatida: Date;
  usuario: Usuario;
  setor: Setor;

  /* Variaveis alerta */
  public alerta = new Subject<string>();
  staticAlertClosed = true;
  mensagem = '';
  mensagemSucesso = '';
  mensagemErro = '';

  /* Variaveis Botão Ponto */
  public botaoPonto = new Subject();
  btnPonto = 'success btn-lg';
  btnPontoMensagem = 'Registrar Ponto';
  disablePonto = '';
  desabilitar = '1';

  urlBase = this.appService.buscarUrlBase();
  idUsuario = this.appService.buscarUsuario();

  registroPonto: any;
  listaDePontos: any;
  ponto: any;


  constructor(private datePipe: DatePipe,
    private appService: AppService,
    private appComponent: AppComponent) {
  }

  ngOnInit(): void {

    /* Retorna a data e hora atual */
    this.clockHandle = setInterval(() => {
      this.dataAtual = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
      this.relogio = this.datePipe.transform(new Date(), 'HH:mm:ss');
    });

    /* Retorna a lista de Pontos */
    /* Retorna lista de pontos - No Parametro recebe a quantidade de dias que irá retornar*/
    this.clockHandle = setInterval(() => {
      const dataInicial = moment().subtract(7, 'days').format();
      this.listaDePontos = this.appComponent.buscarRegistrosPonto(this.idUsuario, dataInicial, null);
    }, 200);

    /* Retorna Informações do Usuario pelo ID Usuario*/
    this.appService.buscarUsuarioPeloID(this.idUsuario).subscribe((usuario) => {
      this.usuario = usuario;
    });

    /* Retorna Setor do Usuario pelo ID Usuario*/
    this.appService.buscarSetorUsuario(this.idUsuario).subscribe((setor) => {
      this.setor = setor;
    });

    /* Remove o alerta após o tempo determinado (milisegundos) */
    this.alerta.pipe(debounceTime(5000)).subscribe(() => {
      this.mensagem = '', this.mensagemSucesso = '', this.mensagemErro = ''
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
      idUsuario: this.idUsuario,
      dataRegistro: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      horaRegistro: this.relogio,
      justificaPonto: 0,
      JustificaReprocacao: ''
    };
    this.appService.registrarPonto(this.ponto).subscribe(
      success => {
        this.dataHoraBatida = new Date();
        this.botaoPonto.next(this.btnPonto = 'success btn-lg');
        this.botaoPonto.next(this.disablePonto = 'disabled');
        this.botaoPonto.next(this.desabilitar = '2');
        this.botaoPonto.next(this.btnPontoMensagem = 'Ponto Registrado');
        this.alerta.next(this.mensagemSucesso = (`Ponto Registrado com Sucesso em: `));
      },
      error => {
        this.dataHoraBatida = new Date();
        this.botaoPonto.next(this.btnPonto = 'danger btn-lg');
        this.botaoPonto.next(this.btnPontoMensagem = 'Erro ao Registrar');
        this.alerta.next(this.mensagemSucesso = 'Erro ao Registrar Ponto - Tente Novamente mais Tarde');
      }
    );
  }
}
