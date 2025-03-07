import { AppService } from 'src/app/app.service';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';


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
  usuario = this.appService.getUsuarioLogado()

  /* Variaveis alerta */
  public alerta = new Subject<string>();
  staticAlertClosed = true;
  mensagem = '';
  mensagemSucesso = '';
  mensagemErro = '';
  mensagemUsuarioSucesso = '';
  mensagemUsuarioErro = '';

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
  tempoDeSessao: any;
  setoresCombo: any[];
  cargosCombo: any[];
  jornadasCombo: any[];
  dataLimite = moment().subtract(7, 'days').format('yyyy-MM-DD');

  constructor(private datePipe: DatePipe,
    private appService: AppService, private router: Router, private appComponent: AppComponent) {
  }

  ngOnInit(): void {
    if (this.appService.getUsuarioLogado() == null) {
      this.router.navigate(["/login"]);
    }

    this.listarRegistroPontoSemanal(this.dataLimite, this.idUsuario);

    /* Retorna a data e hora atual */
    this.clockHandle = setInterval(() => {
      this.dataAtual = this.datePipe.transform(new Date(), 'dd/MM/yyyy');
      this.relogio = this.datePipe.transform(new Date(), 'HH:mm');
    });

    /* Retorna Informações do Usuario pelo ID Usuario*/
    this.appService.buscarPorIDGenerico('usuario', this.idUsuario).subscribe((usuario) => {
      this.usuario = usuario;
    });

    /* Remove o alerta após o tempo determinado (milisegundos) */
    this.alerta.pipe(debounceTime(5000)).subscribe(() => {
      this.mensagem = '', this.mensagemSucesso = '', this.mensagemErro = '',
        this.mensagemUsuarioSucesso = '', this.mensagemUsuarioErro = ''
    });

    /* Habilita novamente o botão após o tempo determinado (60000 = 1 minuto) */
    this.botaoPonto.pipe(debounceTime(60000)).subscribe(() => {
      this.botaoPonto.next(this.btnPonto = 'success btn-lg');
      this.botaoPonto.next(this.disablePonto = '');
      this.botaoPonto.next(this.desabilitar = '1');
      this.botaoPonto.next(this.btnPontoMensagem = 'Registrar Ponto');
    });

  }
  sessao() {
    this.appService.controlaSessao();

  }
  usuarioComum() {
    if (this.appService.getUsuarioLogado().cargoConfianca == 1) {
      return false;
    } else {
      return true;
    }

  }


  listarRegistroPontoSemanal(dataLimite: any, idUsuario: number) {
    this.appService.buscarRegistroPontoSemanal(dataLimite, idUsuario).subscribe((registroPonto) => {
      this.registroPonto = registroPonto;
      this.listaDePontos = this.registroPonto.reduce((r, { dataRegistro }) => {
        if (!r.some(o => o.dataRegistro == dataRegistro)) {
          r.push({ dataRegistro, horaRegistro: this.registroPonto.filter(v => v.dataRegistro == dataRegistro) });
        }
        return r;
      }, []);
    })
  }

  registrarPonto(): void {

    this.limparMemsagens();
    this.ponto = {
      idUsuario: this.idUsuario,
      dataRegistro: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
      horaRegistro: this.relogio,
      justificaPonto: 0,
      JustificaReprocacao: '',
      edicaoAprovada: 0,
      espelhoPonto: 0,
      color: ''
    };

    this.appService.criarGenerico('registroPonto', this.ponto).subscribe(
      success => {
        this.dataHoraBatida = new Date();
        this.botaoPonto.next(this.btnPonto = 'success btn-lg');
        this.botaoPonto.next(this.disablePonto = 'disabled');
        this.botaoPonto.next(this.desabilitar = '2');
        this.botaoPonto.next(this.btnPontoMensagem = 'Ponto Registrado');
        this.alerta.next(this.mensagemSucesso = (`Ponto Registrado com Sucesso em:  `));
        this.listarRegistroPontoSemanal(this.dataLimite, this.idUsuario);
      },
      error => {
        this.dataHoraBatida = null;
        this.botaoPonto.next(this.btnPonto = 'danger btn-lg');
        this.botaoPonto.next(this.btnPontoMensagem = 'Erro ao Registrar');
        this.alerta.next(this.mensagemErro = 'Erro ao Registrar Ponto - Tente Novamente mais Tarde');
      }
    );

  }

  limparMemsagens() {
    this.mensagem = '', this.mensagemErro = '', this.mensagemSucesso = ''
    this.mensagemUsuarioErro = '', this.mensagemUsuarioSucesso = ''
  }
}
