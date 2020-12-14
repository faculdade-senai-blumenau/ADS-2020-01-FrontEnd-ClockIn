import { Usuario } from 'src/app/app.model';
import { Component, getDebugNode, OnInit } from '@angular/core';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Subject } from 'rxjs/internal/Subject';
import { AppService } from 'src/app/app.service';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Router } from '@angular/router';

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
  alertJustificativaReprovacao = '';

  dataRegistro: any;
  usuario: any;

  clockHandle;
  listaDePontos: any;
  registroPonto: any;
  registroPontoVisualizar: any;
  listaDePontosAprovacao: any;
  ponto: any;
  desabilitarBotao: any;
  desabilitar = '1';
  justificativaReprovacao: '';
  modalDismiss = '';

  urlBase = this.appService.buscarUrlBase();


  public paginaAtual = 1;

  constructor(private appService: AppService, private router: Router) { }

  ngOnInit(): void {
    if (this.appService.getUsuarioLogado() == null) {
      this.router.navigate(["/login"]);
    }
    this.listarRegistrosAprovacoesPendentes();

    this.registroPonto = {};

    this.ponto = {
      idRegistroPonto: '',
      idUsuario: this.appService.buscarUsuario(),
      dataRegistro: '',
      horaRegistro: '',
      justificaPonto: '',
      justificativaReprovacao: '',
      edicaoAprovada: ''
    };


    this.clockHandle = setInterval(() => {
      /* Remove o alerta após o tempo determinado (milisegundos) */
      this.alerta.pipe(debounceTime(5000)).subscribe(() => {
        this.mensagem = '', this.mensagemErro = '', this.mensagemSucesso = ''
      });
    }, 1000);
  }

  sessao() {
    this.appService.controlaSessao()
  }

  listarRegistrosAprovacoesPendentes() {
    this.appService.buscarRegistrosPontoAprovacoesPendentes().subscribe((registroPonto) => {
      this.registroPonto = registroPonto;
      if (Object.keys(registroPonto).length === 0) {
        this.desabilitarBotao = "disabled"
        this.desabilitar = '2';
      };
      const grupoData = new Set(this.registroPonto.map(item => item.dataRegistro));
      this.listaDePontos = [];
      grupoData.forEach(gd =>
        this.listaDePontos.push({
          dataRegistro: gd,
          listaPonto: this.registroPonto.filter(i => i.dataRegistro === gd)
        }),
      );
    });
  }

  buscarRegistroPontoAprovacao() {

    this.justificativaReprovacao = ''
    this.appService.buscarRegistrosPontoAprovacoesPendentes().subscribe(
      resposta => this.registroPonto = resposta);
  }
  aprovacaoPendenteVisualizar(dataRegistro: any, idUsuario: number) {
  this.limparMensagens();
    this.justificativaReprovacao = ''
    this.appService.aprovacaoPendenteVisualizar(dataRegistro, idUsuario).subscribe((registroPonto) => {
      this.registroPonto = registroPonto;
    })
  }

  reprovarEdicao(statusEdicao: number, color: String, justificativaReprovacao: String) {
    this.limparMensagens()
    this.registroPonto.forEach(element => {
      if (element.justificaPonto != 0) {
        this.ponto = {
          idRegistroPonto: element.idRegistroPonto,
          idUsuario: element.idUsuario,
          dataRegistro: element.dataRegistro,
          horaRegistro: element.horaRegistro,
          justificaPonto: '',
          justificativaReprovacao: justificativaReprovacao,
          edicaoAprovada: statusEdicao,
          color: color
        };
        this.verificaCamposObrigatorios(this.ponto);
        if (this.ponto.justificativaReprovacao) {
          this.appService.updateGenerico('registroPonto', element.idRegistroPonto, this.ponto).subscribe(
            success => {
              this.alerta.next(this.mensagemSucesso = (`Registro salvo com sucesso.`));
              this.listarRegistrosAprovacoesPendentes();
            },
            error => {
              this.alerta.next(this.mensagemErro = ('Não foi possivel salvar o registro.'));
            }
          );
        } else {
          this.alerta.next(this.mensagemErro = 'Favor informar a justificatida de reprovação.');
        }
      }
    });
  }

  aprovarEdicao(statusEdicao: number, color: String, justificativaReprovacao: String) {
    this.limparMensagens()
    this.registroPonto.forEach(element => {
      if (element.justificaPonto != 0) {
        this.ponto = {
          idRegistroPonto: element.idRegistroPonto,
          idUsuario: element.idUsuario,
          dataRegistro: element.dataRegistro,
          horaRegistro: element.horaRegistro,
          justificaPonto: element.justificaPonto,
          justificativaReprovacao: justificativaReprovacao,
          edicaoAprovada: statusEdicao,
          color: color
        };
        this.modalDismiss = 'modal'
        this.appService.updateGenerico('registroPonto', element.idRegistroPonto, this.ponto).subscribe(
          success => {
            this.alerta.next(this.mensagemSucesso = (`Registro salvo com sucesso.`));
            this.listarRegistrosAprovacoesPendentes();
          },
          error => {
            this.alerta.next(this.mensagemErro = ('Não foi possivel salvar o registro.'));
          }
        );
      }
    });
  }

  verificaCamposObrigatorios(ponto) {
    if (!ponto.justificativaReprovacao) {
      this.alerta.next(this.alertJustificativaReprovacao = 'Campo Obrigatório');
    } else {
      this.modalDismiss = 'modal'
    }
  }

  limparMensagens() {
    this.mensagem = '';
    this.mensagemSucesso = '';
    this.mensagemErro = '';
    this.alertJustificativaReprovacao = '';
  }
}
