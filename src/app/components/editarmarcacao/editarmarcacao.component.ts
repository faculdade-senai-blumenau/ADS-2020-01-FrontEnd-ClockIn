
import { AppService } from 'src/app/app.service';
import { AppComponent } from './../../app.component';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

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
  mensagemErroModalEditar = '';
  mensagemSucessoModalEditar = '';
  mensagemErroModalCriar = '';
  mensagemSucessoModalCriar = '';
  mensagemErro = '';
  mensagemSucesso = '';

  clockHandle;
  listaDePontos: any;
  registroPonto: any;
  ponto: any;

  
  /* Variaveis */
 
  constructor(private appComponent: AppComponent,
    private appService: AppService
    ) { }

  ngOnInit(): void {
    this.ponto = {
    idRegistroPonto: '',
    idUsuario: this.appService.buscarUsuario(),
    dataRegistro: '',
    horaRegistro: '',
    justificaPonto: '',
    justificativaReprovacao: ''
    };

    this.registroPonto = {};
    this.clockHandle = setInterval(() => {
      const dataInicialFiltro = moment().subtract(30, 'days').format();
      this.listaDePontos = this.appComponent.buscarRegistrosPonto(dataInicialFiltro);
    }, 500);

    this.clockHandle = setInterval(() => {
      /* Remove o alerta após o tempo determinado (milisegundos) */
      this.alerta.pipe(debounceTime(5000)).subscribe(() => {
        this.mensagemErroModalCriar = '', this.mensagemSucessoModalCriar = '';
        this.mensagemErroModalEditar = '', this.mensagemSucessoModalEditar = '';
        this.mensagemErro = '', this.mensagemSucesso = '';
      });
    }, 1000);
  }

  buscarRegistroPontoID(idRegistroPonto: number) {
    this.appService.buscarRegistroPontoID(idRegistroPonto).subscribe(
      resposta => this.registroPonto = resposta);
  }

  updateRegistroPonto() {
    this.appService.updateRegistroPonto(this.registroPonto).subscribe(
      success => {
        this.alerta.next(this.mensagemSucessoModalEditar = (`Alteração Realizada com Sucesso.`));
      },
      error => {
        this.alerta.next(this.mensagemErroModalEditar = ('Não foi possivel realizar a alteração.'));
      }
    );
  }

  criar(frm) {
    this.appService.criar(this.ponto).subscribe(   
      success => {
        this.alerta.next(this.mensagemSucessoModalCriar = (`Registro Inserido com Sucesso.`));
      },
      error => {
        this.alerta.next(this.mensagemErroModalCriar = 'Não foi possível inserir o registro.');
      }
    );
    frm.reset();
  }
}
