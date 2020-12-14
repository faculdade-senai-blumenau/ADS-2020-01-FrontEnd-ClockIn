
import { AppService } from 'src/app/app.service';
import { AppComponent } from './../../app.component';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-editarmarcacao',
  templateUrl: './editarmarcacao.component.html',
  styleUrls: ['./editarmarcacao.component.css']
})
export class EditarMarcacaoComponent implements OnInit {

  /* Variaveis */
  public alerta = new Subject<string>();
  staticAlertClosed = true;

  /* Mensagens */
  mensagem = '';
  mensagemSucesso = '';
  mensagemErro = '';
  alertDataRegistro = '';
  alertHoraRegistro = '';
  alertJustificaPonto = '';
  clockHandle;

  listaDePontos: any;
  registroPonto: any;
  ponto: any;
  idUsuario = this.appService.buscarUsuario();

  public paginaAtual = 1;
  statusEdicaoDescricao: any;
  dataColor: number;
  loadingvar = 0;
  color = '';
  modalDismiss = '';
  /* Variaveis Fim */

  constructor(private appService: AppService, private router: Router, private appComponent: AppComponent, private datePipe: DatePipe) {

  }

  ngOnInit(): void {
    if (this.appService.getUsuarioLogado() == null) {
      this.router.navigate(["/login"]);
    }

    this.listarRegistrosPontoEditarMarcacao(this.idUsuario);
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

  listarRegistrosPontoEditarMarcacao(idUsuario: number) {
    this.limparObjetoPonto();
    this.appService.buscarRegistrosPontoEditarMarcacao(idUsuario).subscribe((registroPonto) => {
      this.registroPonto = registroPonto;
      this.listaDePontos = this.registroPonto.reduce((r, { dataRegistro }) => {
        if (!r.some(o => o.dataRegistro == dataRegistro)) {
          r.push({ dataRegistro, horaRegistro: this.registroPonto.filter(v => v.dataRegistro == dataRegistro) });
        }
        return r;
      }, []);
    });
    this.alterarStatusEdicao(this.listaDePontos)
  }

  buscarRegistroPontoID(idRegistroPonto: number) {
    this.modalDismiss = '';
    this.limparObjetoPonto();
    this.appService.buscarPorIDGenerico('registroPonto', idRegistroPonto).subscribe(
      resposta => this.registroPonto = this.alterarStatusEdicao(resposta));
  }

  editarRegistroPonto(ponto) {
    this.ponto = {
      idRegistroPonto: '',
      idUsuario: '',
      dataRegistro: '',
      horaRegistro: '',
      justificaPonto: 0,
      justificativaReprovacao: '',
      edicaoAprovada: 0,
      espelhoPonto: 0,
      color: 'blue'
    };

    this.limparMensagens();
    this.ponto = this.alterarStatusEdicao(ponto);
    this.verificaCamposObrigatorios(ponto);
    if (ponto.dataRegistro && ponto.horaRegistro && ponto.justificaPonto) {
      this.appService.criarGenerico('registroPonto', ponto).subscribe(
        success => {
          this.listarRegistrosPontoEditarMarcacao(this.idUsuario);
          this.alerta.next(this.mensagemSucesso = (`Registro salvo com Sucesso.`));
        },
        error => {
          this.alerta.next(this.mensagemErro = 'Não foi possível salvar o registro.');
        }
      );
    }
    else {
      this.alerta.next(this.mensagemErro = 'Favor informar todos os campos obrigatórios.');
    }
  }

  cadastrarRegistroPonto(ponto) {
    this.limparMensagens()
    this.verificaCamposObrigatorios(ponto);
    ponto.color = 'blue';
    if (ponto.dataRegistro && ponto.horaRegistro && ponto.justificaPonto) {
      this.appService.criarGenerico('registroPonto', ponto).subscribe(
        success => {
          this.listarRegistrosPontoEditarMarcacao(this.idUsuario);
          this.alerta.next(this.mensagemSucesso = (`Registro salvo com Sucesso.`));
        },
        error => {
          this.alerta.next(this.mensagemErro = 'Não foi possível salvar o registro.');
        }
      );
    }
    else {
      this.alerta.next(this.mensagemErro = 'Favor informar todos os campos obrigatórios.');
    }
  }

  verificaCamposObrigatorios(ponto) {
    ponto.idUsuario = this.idUsuario
    if (!ponto.dataRegistro) {
      this.alerta.next(this.alertDataRegistro = 'Campo Obrigatório');
    } else {
      this.alerta.next(this.alertDataRegistro = '');
    }
    if (!ponto.horaRegistro) {
      this.alerta.next(this.alertHoraRegistro = 'Campo Obrigatório');
    } else {
      this.alerta.next(this.alertHoraRegistro = '');
    }
    if (!ponto.justificaPonto) {
      this.alerta.next(this.alertJustificaPonto = 'Campo Obrigatório');
    } else {
      this.alerta.next(this.alertJustificaPonto = '');
    }
    if (ponto.justificaPonto && ponto.horaRegistro && ponto.dataRegistro) {
      this.modalDismiss = 'modal'
    }
  }

  alterarStatusEdicao(ponto) {
    if (ponto.edicaoAprovada == 0 && ponto.justificaPonto === 0) {
      this.statusEdicaoDescricao = "Não Editado"
    }
    else if (ponto.edicaoAprovada == 1) {
      this.statusEdicaoDescricao = "Aprovada pelo Gestor"
      ponto.color = 'green'
    }
    else if (ponto.edicaoAprovada == 2 && ponto.justificaPonto == 0) {
      this.statusEdicaoDescricao = "Reprovada pelo Gestor"
      ponto.color = 'red'
    }
    else if ((ponto.edicaoAprovada == 0 && ponto.justificaPonto > 0) || (ponto.edicaoAprovada == 2 && ponto.justificaPonto > 0)) {
      this.statusEdicaoDescricao = "Aguardando Aprovação"
      ponto.color = 'blue'
    }
    return (this.statusEdicaoDescricao, ponto)
  }

  limparObjetoPonto() {
    this.ponto = {};
    this.registroPonto = {};
  }

  limparMensagens() {
    this.mensagem = '';
    this.mensagemSucesso = '';
    this.mensagemErro = '';
    this.alertDataRegistro = '';
    this.alertHoraRegistro = '';
    this.alertJustificaPonto = '';
  }
}
