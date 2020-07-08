
import { AppService } from 'src/app/app.service';
import { AppComponent } from './../../app.component';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { EspelhoPonto } from 'src/app/app.model';

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
  mensagemEspelhoOk="";
  mensagemEspelhoErro="";
  clockHandle;
  listaDePontos: any;
  registroPonto: any;
  ponto: any;
  espelhoPonto: any;
  idUsuario = this.appService.buscarUsuario();
  constructor(private appComponent: AppComponent,
    private appService: AppService
    )
     { }

  ngOnInit() {
    
    this.clockHandle = setInterval(() => {
      /* Remove o alerta após o tempo determinado (milisegundos) */
      this.alerta.pipe(debounceTime(5000)).subscribe(() => {
        this.mensagemEspelhoErro = '', this.mensagemEspelhoOk = '';
      });
    }, 1000);
    this.getEspelhoPonto();

    
  }
  getEspelhoPonto(){
    this.appService.buscarEspelhoPonto(this.idUsuario).subscribe (
      resposta => this.espelhoPonto = resposta
    );
    
    
  }
  
  reprovarEspelhoPonto(espelhoPonto) {
    
    espelhoPonto.status=2;
    this.appService.alterarStatusEspelho(espelhoPonto).subscribe (
      success => {
        this.alerta.next(this.mensagemEspelhoOk = (`Alteração Realizada com Sucesso.`));
      },
      error => {
        
        this.alerta.next(this.mensagemEspelhoErro = ('Não foi possivel realizar a alteração.'));
      }
    )
  }
  aprovarEspelhoPonto(espelhoPonto) {
    
    espelhoPonto.status=1;
    this.appService.alterarStatusEspelho(espelhoPonto).subscribe (
      success => {
        this.alerta.next(this.mensagemEspelhoOk = (`Alteração Realizada com Sucesso.`));
      },
      error => {
        
        this.alerta.next(this.mensagemEspelhoErro = ('Não foi possivel realizar a alteração.'));
      }
    )
  }
  

  visualizarEspelhoPonto(espelhoPonto) {
    
    this.clockHandle = setInterval(() => {
      
      this.listaDePontos = this.appComponent.buscarRegistrosPontoRange(espelhoPonto.idUsuario, espelhoPonto.dataInicial, espelhoPonto.dataFinal);
    }, 200);
  }
}
