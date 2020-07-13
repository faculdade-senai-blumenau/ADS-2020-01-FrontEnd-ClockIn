
import { AppService } from 'src/app/app.service';
import { AppComponent } from './../../app.component';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { EspelhoPonto } from 'src/app/app.model';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable' ;

@Component({
  selector: 'app-espelhoponto',
  templateUrl: './espelhoponto.component.html',
  styleUrls: ['./espelhoponto.component.css']
})
export class EspelhopontoComponent implements OnInit {

  /* Variaveis */
  public alerta = new Subject<string>();
  staticAlertClosed = true;
  /* Mensagens */
  mensagem = '';
  mensagemErro = '';
  mensagemSucesso = '';
  mensagemEspelhoOk = "";
  mensagemEspelhoErro = "";
  clockHandle;
  listaDePontos: any;
  registroPonto: any;
  ponto: any;
  espelhoPonto: any;
  idUsuario = this.appService.buscarUsuario();
  constructor(private appComponent: AppComponent,
    private appService: AppService) { }

  ngOnInit() {

    this.clockHandle = setInterval(() => {
      /* Remove o alerta após o tempo determinado (milisegundos) */
      this.alerta.pipe(debounceTime(5000)).subscribe(() => {
        this.mensagemEspelhoErro = '', this.mensagemEspelhoOk = '';
      });
    }, 1000);
    this.getEspelhoPonto();

  }
  getEspelhoPonto() {
    this.appService.buscarEspelhoPonto(this.idUsuario).subscribe(
      resposta => this.espelhoPonto = resposta
    );
  }

  reprovarEspelhoPonto(espelhoPonto) {
    espelhoPonto.status = 2;
    this.appService.alterarStatusEspelho(espelhoPonto).subscribe(
      success => {
        this.alerta.next(this.mensagemEspelhoOk = (`Alteração Realizada com Sucesso.`));
      },
      error => {
        this.alerta.next(this.mensagemEspelhoErro = ('Não foi possivel realizar a alteração.'));
      }
    )
  }


  aprovarEspelhoPonto(espelhoPonto) {
    espelhoPonto.status = 1;
    this.appService.alterarStatusEspelho(espelhoPonto).subscribe(
      success => {
        this.alerta.next(this.mensagemEspelhoOk = (`Alteração Realizada com Sucesso.`));
      },
      error => {
        this.alerta.next(this.mensagemEspelhoErro = ('Não foi possivel realizar a alteração.'));
      }
    )
  }

  visualizarEspelhoPonto(espelhoPonto) {
      this.listaDePontos = this.appComponent.buscarRegistrosPonto(espelhoPonto.idUsuario, espelhoPonto.dataInicial, espelhoPonto.dataFinal);
  }

  imprimirEspelho(idTabela) {
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
      pdf.text("Espelho do Ponto", 75, 15);

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
