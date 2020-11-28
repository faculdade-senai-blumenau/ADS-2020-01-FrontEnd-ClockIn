import { AppService } from 'src/app/app.service';

import { Subject } from 'rxjs/internal/Subject';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { DataTableDirective } from 'angular-datatables';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css'],
})
export class RelatoriosComponent implements OnInit {

  constructor(private appComponent: AppComponent,
    private appService: AppService, private router: Router) { }


  listaDePontos: any;
  dataInicial: any;
  dataFinal: any;
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
    this.listaDePontos = this.appComponent.buscarRegistrosPonto(this.idUsuario, this.dataInicial, this.dataFinal);
  }

  limparPesquisa() {
    this.listaDePontos = this.listaDePontosVazia;
    this.dataFinal = '';
    this.dataInicial = '';
  }

  imprimirRelatorio() {
    const pdf = new jsPDF()
    autoTable(pdf, { html: '#tabelaRelatorio' })
    pdf.text("Relatório de Ponto por Período", 65, 10);
    pdf.setFontSize(20);
    pdf.save('RelatorioPonto.pdf')

  }
}