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
import 'jspdf-autotable' ;
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-relatorios',
  templateUrl: './relatorios.component.html',
  styleUrls: ['./relatorios.component.css'],
})
export class RelatoriosComponent implements OnInit {

  constructor(private appComponent: AppComponent,
    private appService: AppService) { }

  listaDePontos: any;
  dataInicial: any;
  dataFinal: any;
  listaDePontosVazia: any;

  urlBase = this.appService.buscarUrlBase();
  idUsuario = this.appService.buscarUsuario();

  ngOnInit(): void {

  }

  gerarRelatorio() {
    this.listaDePontos = this.appComponent.buscarRegistrosPonto(this.idUsuario,this.dataInicial, this.dataFinal);
  }

  limparRelatorio() {
    this.listaDePontos = this.listaDePontosVazia;
    this.dataFinal = '';
    this.dataInicial = '';
  }

  imprimirRelatorio(idTabela) {
    const html_source = document.getElementById(idTabela); 
    const filename = 'RelatorioPonto.pdf';
    html2canvas(html_source).then(function (canvas) {
      let imgData = canvas.toDataURL('image/png');
      let imgWidth = 208;
      let pageHeight = 280; 
      let imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;
      let pdf = new jsPDF('p', 'mm');
      let fix_imgWidth = 15; 
      let fix_imgHeight = 15;
      pdf.text("Relatório de Ponto por Período", 65, 15);
      pdf.setFontSize(20);
      pdf.addImage(imgData, 'PNG', 0, 30, imgWidth, imgHeight)
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth + fix_imgWidth, imgHeight + fix_imgHeight);
        heightLeft -= pageHeight;
      }
      pdf.save(filename);
    })
  }
}