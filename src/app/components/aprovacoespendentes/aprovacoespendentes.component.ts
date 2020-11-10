import { Usuario } from 'src/app/app.model';
import { Component, getDebugNode, OnInit } from '@angular/core';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Subject } from 'rxjs/internal/Subject';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-aprovacoespendentes',
  templateUrl: './aprovacoespendentes.component.html',
  styleUrls: ['./aprovacoespendentes.component.css']
})
export class AprovacoesPendentesComponent implements OnInit {

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

  urlBase = this.appService.buscarUrlBase();


  public paginaAtual = 1;
  constructor(private appService: AppService) { }

  ngOnInit(): void {

    this.listarRegistrosAprovacoesPendentes();

    this.registroPonto = {};

    this.ponto = {
      idRegistroPonto: '',
      idUsuario: this.appService.buscarUsuario(),
      dataRegistro: '',
      horaRegistro: '',
      justificaPonto: '',
      justificativaReprovacao: ''
    };


    this.clockHandle = setInterval(() => {
      /* Remove o alerta após o tempo determinado (milisegundos) */
      this.alerta.pipe(debounceTime(5000)).subscribe(() => {
        this.mensagem = '', this.mensagemErro = '', this.mensagemSucesso = ''
      });
    }, 1000);
  }

  listarRegistrosAprovacoesPendentes() {
    this.appService.buscarRegistrosPontoAprovacoesPendentes().subscribe((registroPonto) => {
      this.registroPonto = registroPonto;

      const grupoData = new Set(this.registroPonto.map(item => item.dataRegistro));
      const grupoUsuario = new Set(this.registroPonto.map(item => item.idUsuario));
      this.listaDePontos = [];
      grupoData.forEach(gd =>  grupoUsuario.forEach (gu =>
        this.listaDePontos.push({
          usuario: gu,
          dataRegistro: gd,
          listaPonto: this.registroPonto.filter(i => i.dataRegistro === gd)
          
        }),
      ));
    //console.log(this.listaDePontos)
    });
  }

  buscarRegistroPontoAprovacao(idUsuario: number) {
    this.appService.buscarRegistrosPontoUsuario(idUsuario).subscribe(
      resposta => this.registroPonto = resposta);
      console.log(this.listaDePontos)
  }

  updateRegistroPonto() {
    this.appService.updateRegistroPonto(this.registroPonto).subscribe(
      success => {
        this.alerta.next(this.mensagemSucesso = (`Alteração Realizada com Sucesso.`));
        this.listarRegistrosAprovacoesPendentes();
        
      },
      error => {
        this.alerta.next(this.mensagemErro = ('Não foi possivel realizar a alteração.'));
      }
    );
  }
}
