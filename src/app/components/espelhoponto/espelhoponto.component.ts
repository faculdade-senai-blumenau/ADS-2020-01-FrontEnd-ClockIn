
import { AppService } from 'src/app/app.service';
import { AppComponent } from './../../app.component';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { EspelhoPonto } from 'src/app/app.model';
import html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';
import { Router } from '@angular/router';

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
  espelhoPontoAprovado: any;

  constructor(private appComponent: AppComponent,
    private appService: AppService, private router: Router) { }
    

  ngOnInit() {
    if(this.appService.getUsuarioLogado()==null){
      this.router.navigate(["/login"]);
    }
    this.clockHandle = setInterval(() => {
      /* Remove o alerta após o tempo determinado (milisegundos) */
      this.alerta.pipe(debounceTime(5000)).subscribe(() => {
        this.mensagemEspelhoErro = '', this.mensagemEspelhoOk = '';
      });
    }, 1000);
    this.getEspelhoPonto();
    this.getEspelhoPontoAprovado();
    this.visualizarEspelhoPonto(1,'01-01-2020','01-01-2020')

  }
  sessao(){
    this.appService.controlaSessao()
  }
  getEspelhoPonto() {
    
    this.appService.buscarEspelhoPonto(this.idUsuario).subscribe(
      resposta => this.espelhoPonto = resposta
    );
    
  }

  getEspelhoPontoAprovado() {
    
    this.appService.buscarEspelhoPontoAprovado(this.idUsuario).subscribe(
      resposta => this.espelhoPontoAprovado = resposta
    );
    
  }

  reprovarEspelhoPonto(espelhoPonto) {
    espelhoPonto.status = 2;
    this.appService.alterarStatusEspelho(espelhoPonto).subscribe(
      success => {
        this.getEspelhoPonto();
        this.alerta.next(this.mensagemEspelhoOk = (`Registro salvo com sucesso.`));
  
      },
      error => {
        this.alerta.next(this.mensagemEspelhoErro = ('Não foi possivel salvar o registro.'));
      }
    )
  }
  
  aprovarEspelhoPonto(espelhoPonto) {
    espelhoPonto.status = 1;
    this.appService.alterarStatusEspelho(espelhoPonto).subscribe(
      success => {
        this.getEspelhoPontoAprovado();
        this.alerta.next(this.mensagemEspelhoOk = (`Registro salvo com sucesso.`));

      },
      error => {
        this.alerta.next(this.mensagemEspelhoErro = ('Não foi possivel salvar o registro.'));
      }
    )
    
  }

  visualizarEspelhoPonto(idUsuario: number, dataInicial: string, dataFinal:string) {
    this.listaDePontos = this.appComponent.buscarRegistrosPonto(idUsuario, dataInicial, dataFinal);
  }

  imprimirEspelho() {
    const pdf = new jsPDF()
    autoTable(pdf, { html: '#imprimirEspelho' })
    pdf.text("Espelho do Ponto", 80, 10);
    pdf.setFontSize(20);
    pdf.save('EspelhoPonto.pdf')

  }
}
