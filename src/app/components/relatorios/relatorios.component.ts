import { AppService } from 'src/app/app.service';
import { Subject } from 'rxjs/internal/Subject';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Component, OnInit } from '@angular/core';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css'],
})
export class RelatoriosComponent implements OnInit {
  alertDataInicial: string;
  alertDataFinal: string;

  constructor(private appComponent: AppComponent,
    private appService: AppService, private router: Router) { }

  /* Variaveis */
  public alerta = new Subject<string>();
  staticAlertClosed = true;

  /* Mensagens */
  mensagem = '';
  mensagemSucesso = '';
  mensagemErro = '';
  dataInicial = '';
  dataFinal = '';
  clockHandle;

  listaDePontos: any;
  listaDePontosVazia: any;

  urlBase = this.appService.buscarUrlBase();
  idUsuario = this.appService.buscarUsuario();

  ngOnInit(): void {
    if (this.appService.getUsuarioLogado() == null) {
      this.router.navigate(["/login"]);
    }
  }
  sessao() {
    this.appService.controlaSessao();
  }

  gerarRelatorio() {
    this.verificaCamposObrigatorios();
    if (!this.dataInicial || !this.dataFinal) {
      this.alerta.next(this.mensagemErro = 'Favor informar data inicial e data final');
    }else if (this.dataInicial > this.dataFinal) {
      this.alerta.next(this.mensagemErro = 'Data inicial não pode ser maior que a data final');
    }else {
      this.listaDePontos = this.appComponent.buscarRegistrosPonto(this.idUsuario, this.dataInicial, this.dataFinal);
      const contador = Object.entries(this.listaDePontos).length;
      if (contador === 0) {
        this.alerta.next(this.mensagemErro = 'Nenhum registro encontrado para o período informado');
      }
    }
  }

  limparPesquisa() {
    this.listaDePontos = {};
    this.dataFinal = '00-00-0000';
    this.dataInicial = '00-00-0000';
  }

  imprimirRelatorio() {
    const pdf = new jsPDF()
    autoTable(pdf, { html: '#tabelaRelatorio' })
    pdf.text("Relatório de Ponto por Período", 65, 10);
    pdf.setFontSize(20);
    pdf.save('RelatorioPonto.pdf')
  }

  verificaCamposObrigatorios() {
    if (!this.dataInicial) {
      this.alerta.next(this.alertDataInicial = 'Campo Obrigatório');
    } else {
      this.alerta.next(this.alertDataInicial = '');
    }
    if (!this.dataFinal) {
      this.alerta.next(this.alertDataFinal = 'Campo Obrigatório');
    } else {
      this.alerta.next(this.alertDataFinal = '');
    }

  }
}