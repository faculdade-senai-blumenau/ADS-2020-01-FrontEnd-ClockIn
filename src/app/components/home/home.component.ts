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
    private appService: AppService) {
  }

  ngOnInit(): void {

    this.listarRegistrosPontoSemanal();

    /* Retorna a data e hora atual */
    this.clockHandle = setInterval(() => {
      this.dataAtual = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
      this.relogio = this.datePipe.transform(new Date(), 'HH:mm:ss');
    });
      /* Retorna Informações do Usuario pelo ID Usuario*/
      this.appService.buscarUsuarioPeloID(this.idUsuario).subscribe((usuario) => {
        this.usuario = usuario;
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

  listarRegistrosPontoSemanal() {
    const dataInicial = moment().subtract(7, 'days').format();
    this.listaDePontos = this.buscarRegistrosPonto(this.idUsuario, dataInicial, null);
  };

  buscarRegistrosPonto(idUsuario: number, dataInicial: string, dataFinal: string) {
    this.appService.buscarRegistrosPontoUsuario(idUsuario).subscribe((registroPonto) => {
      this.registroPonto = registroPonto;
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
    });
  }

  registrarPonto(): void {
    this.ponto = {
      idUsuario: this.idUsuario,
      dataRegistro: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      horaRegistro: this.relogio,
      justificaPonto: 0,
      JustificaReprocacao: '',
      edicaoAprovada: 0
    };

    this.appService.registrarPonto(this.ponto).subscribe(
      success => {
        this.dataHoraBatida = new Date();
        this.botaoPonto.next(this.btnPonto = 'success btn-lg');
        this.botaoPonto.next(this.disablePonto = 'disabled');
        this.botaoPonto.next(this.desabilitar = '2');
        this.botaoPonto.next(this.btnPontoMensagem = 'Ponto Registrado');
        this.alerta.next(this.mensagemSucesso = (`Ponto Registrado com Sucesso em: `));
        this.listarRegistrosPontoSemanal();
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
