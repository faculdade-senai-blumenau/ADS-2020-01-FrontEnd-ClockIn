import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpClientModule } from '@angular/common/http';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private http: HttpClient) { }

  /* Variáveis Relógio */
  relogio;
  clockHandle;

  ngOnInit() {
    /* Retorna a data e hora atual */
    this.clockHandle = setInterval(() => {
      this.relogio = Date.now();
    }, 1000);
    /* Remova o alerta após o tempo determinado */
    this.alerta.pipe(debounceTime(30000)).subscribe(() => {
      this.mensagemErro = '',this.mensagemSucesso = ''});

    /* Habilita novamente o botão após o tempo determinado */
    this.botaoPonto.pipe(debounceTime(60000)).subscribe(() => {
      this.desabilitar = '1', 
      this. btnPonto = "secondary btn-lg";
      this.btnPontoMensagem = "Registrar Ponto";
      this.disablePonto = "";
      this.disableBtn = false;
      this.desabilitar = '1';});
  }

  /* Variaveis alerta Inicio*/
  public alerta = new Subject<string>();
  staticAlertClosed = true;
  mensagem = '';
  mensagemErro = '';
  mensagemSucesso = '';
  /* Variaveis Alerta Fim */

  /* Variaveis Botão Ponto */
  public botaoPonto = new Subject();
  btnPonto = "secondary btn-lg";
  btnPontoMensagem = "Registrar Ponto";
  disablePonto = "";
  disableBtn = false;
  desabilitar = '1';
  /* Variaveis Botão Ponto Fim*/

  registrarPonto() {
    const route = "registroPonto";
    this.http.post<any>('http://localhost:5000/' + route, {
      idUsuario: 1,
      data_registro: this.relogio,
      justificaPonto: '',
      justificativaReprovacao: '',
    }).subscribe(
      success => {
        this.botaoPonto.next(this.btnPonto = "success btn-lg");
        this.botaoPonto.next(this.disablePonto = "disabled");
        this.botaoPonto.next(this.desabilitar = '2');
        this.botaoPonto.next(this.btnPontoMensagem = "Ponto Registrado");
        this.alerta.next(this.mensagemSucesso = (`Ponto Registrado com Sucesso! ${Date.now()}`));

      },
      error => {
        this.botaoPonto.next(this.btnPonto = "danger btn-lg");
        this.botaoPonto.next(this.btnPontoMensagem = "Erro ao Registrar");
        this.alerta.next(this.mensagemErro = 'Erro ao Registrar Ponto!');
      }

    );
  }

  isDesabilitado(): boolean {
    if (this.disableBtn) {
      return true;
    }
    return false;
  }
}
