
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

  clockHandle;
  listaDePontos: any;
  registroPonto: any;
  ponto: any;
  espelhoPonto: any;
  espelhoPontoObjeto: any;
  idUsuario = this.appService.buscarUsuario();
  constructor(private appComponent: AppComponent,
    private appService: AppService
    )
     { }

  ngOnInit() {
    this.registroPonto = {};
    this.clockHandle = setInterval(() => {
      /* Remove o alerta após o tempo determinado (milisegundos) */
      this.alerta.pipe(debounceTime(5000)).subscribe(() => {
        this.mensagemErro = '', this.mensagemSucesso = '';
      });
    }, 1000);
    this.getEspelhoPonto();

    
  }
  getEspelhoPonto(){
    this.appService.buscarEspelhoPonto().subscribe (
      resposta => this.espelhoPonto = resposta
    );
    
    
  }
  reprovarEspelhoPonto(idEspelho: number, idUsuario: number, dataInicial: any, dataFinal: any) {
    
    this.espelhoPontoObjeto.idEspelhoPonto=idEspelho;
    this.espelhoPontoObjeto.idUsuario=idUsuario;
    this.espelhoPontoObjeto.dataInicial=dataFinal;
    this.espelhoPontoObjeto.dataFinal=dataFinal;
    this.espelhoPontoObjeto.status=2;
    
    this.appService.alterarStatusEspelho(this.espelhoPontoObjeto).subscribe(
      
    );
  }
  visualizarEspelhoPonto() {
    this.registroPonto = {};
    this.clockHandle = setInterval(() => {
      const dataInicialFiltro = moment().subtract(30, 'days').format();
      this.listaDePontos = this.appComponent.buscarRegistrosPonto(dataInicialFiltro);
    }, 200);
  }
}
