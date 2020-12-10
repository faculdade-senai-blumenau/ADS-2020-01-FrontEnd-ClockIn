
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

  clockHandle;
  listaDePontos: any;
  registroPonto: any;
  ponto: any;
  idUsuario = this.appService.buscarUsuario();
  dataAtual = this.datePipe.transform(new Date(), 'yyyy-MM-dd');

  public paginaAtual = 1;
  statusEdicaoDescricao: any;

  /* Variaveis Fim */

  constructor(private appService: AppService, private router: Router,private appComponent: AppComponent, private datePipe: DatePipe) { }
  
  ngOnInit(): void {
    if (this.appService.getUsuarioLogado() == null) {
      this.router.navigate(["/login"]);
    }
    this.ponto = {
      idRegistroPonto: '',
      idUsuario: '',
      dataRegistro: '',
      horaRegistro: '',
      justificaPonto: 0,
      justificativaReprovacao: '',
      edicaoAprovada: 0
    };

    this.listarRegistrosPontoEditarMarcacao();

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

  listarRegistrosPontoEditarMarcacao() {
    this.limparObjetoPonto();
    const dataInicial = moment().subtract(30, 'days').format();
    this.listaDePontos = this.buscarRegistrosPonto(this.idUsuario, dataInicial, null);
  }

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

  buscarRegistroPontoID(idRegistroPonto: number) {
    this.limparObjetoPonto();
    this.appService.buscarRegistroPontoID(idRegistroPonto).subscribe(
      resposta => this.ponto = resposta
      );
  }

  cadastrarEditarRegistroPonto() {
    this.ponto.idUsuario = this.idUsuario
    this.appService.criarGenerico('registroPonto', this.ponto).subscribe(
      success => {
        this.listarRegistrosPontoEditarMarcacao();
        this.statusEdicaoDescricao = ""
        this.alerta.next(this.mensagemSucesso = (`Registro salvo com Sucesso.`));
      },
      error => {
        this.alerta.next(this.mensagemErro = 'Não foi possível salvar o registro.');
      }
    );
  }

  alterarStatusEdicao(ponto) {
    if (ponto.edicaoAprovada == 1) {
      this.statusEdicaoDescricao = "Aprovada pelo Gestor"
    }
    else if (ponto.edicaoAprovada == 2 && ponto.justificaPonto == 0) {
      this.statusEdicaoDescricao = "Reprovada pelo Gestor"
    }
    else if ((ponto.edicaoAprovada == 0 && ponto.justificaPonto > 0) || (ponto.edicaoAprovada == 2 && ponto.justificaPonto > 0)) {
      this.statusEdicaoDescricao = "Aguardando Aprovação"
    }
    else {
      this.statusEdicaoDescricao = "Não Editado"
    }
  }

  limparObjetoPonto() {
    this.ponto = {};
  }
}
