import { Usuario } from 'src/app/app.model';
import { Component, getDebugNode, OnInit } from '@angular/core';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Subject } from 'rxjs/internal/Subject';
import { AppService } from 'src/app/app.service';
import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { Router } from '@angular/router';

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

  dataRegistro: any;
  usuario: any;

  clockHandle;
  listaDePontos: any;
  registroPonto: any;
  registroPontoVisualizar: any;
  listaDePontosAprovacao: any;
  ponto: any;

  urlBase = this.appService.buscarUrlBase();


  public paginaAtual = 1;
  constructor(private appService: AppService, private router: Router) { }

  ngOnInit(): void {
    if(this.appService.getUsuarioLogado()==null){
      this.router.navigate(["/login"]);
    }
    this.listarRegistrosAprovacoesPendentes();

    this.registroPonto = {};

    this.ponto = {
      idRegistroPonto: '',
      idUsuario: this.appService.buscarUsuario(),
      dataRegistro: '',
      horaRegistro: '',
      justificaPonto: '',
      justificativaReprovacao: '',
      edicaoAprovada: ''
    };


    this.clockHandle = setInterval(() => {
      /* Remove o alerta após o tempo determinado (milisegundos) */
      this.alerta.pipe(debounceTime(5000)).subscribe(() => {
        this.mensagem = '', this.mensagemErro = '', this.mensagemSucesso = ''
      });
    }, 1000);
  }

  sessao(){
    this.appService.controlaSessao()
  }

  listarRegistrosAprovacoesPendentes() {
    this.appService.buscarRegistrosPontoAprovacoesPendentes().subscribe((registroPonto) => {
      this.registroPonto = registroPonto;
      const grupoData = new Set(this.registroPonto.map(item => item.dataRegistro));
      const grupoUsuario = new Set(this.registroPonto.map(item => item.idUsuario));
      this.listaDePontos = [];
      grupoData.forEach(gd => grupoUsuario.forEach(gu =>
        this.listaDePontos.push({
          usuario: gu,
          dataRegistro: gd,
          listaPonto: this.registroPonto.filter(i => i.dataRegistro === gd)
        }),
      ));
    });
  }

  buscarRegistroPontoAprovacao() {
    this.appService.buscarRegistrosPontoAprovacoesPendentes().subscribe(
      resposta => this.listaDePontos = resposta);
  }


  aprovacaoPendenteVisualizar(dataRegistro: any, idUsuario: number) {
    this.appService.aprovacaoPendenteVisualizar(dataRegistro, idUsuario).subscribe((registroPonto) => {
      this.registroPonto = registroPonto;
    })
  }

  aprovarEdicao() {
    this.registroPonto.forEach(element => {
      this.ponto = {
        idRegistroPonto: element.idRegistroPonto,
        idUsuario: element.idUsuario,
        dataRegistro: element.dataRegistro,
        horaRegistro: element.horaRegistro,
        justificaPonto: element.justificaPonto,
        justificativaReprovacao: element.justificativaReprovacao,
        edicaoAprovada: 1
      };
      console.log(this.ponto)
      this.appService.updateRegistroPonto(this.ponto).subscribe(
        success => {
          this.alerta.next(this.mensagemSucesso = (`Alteração Realizada com Sucesso.`));
          this.listarRegistrosAprovacoesPendentes();
        },
        error => {
          this.alerta.next(this.mensagemErro = ('Não foi possivel realizar a alteração.'));
        }
      );
    });
  }

  reprovarEdicao() {
    this.registroPonto.forEach(element => {
      this.ponto = {
        idRegistroPonto: element.idRegistroPonto,
        idUsuario: element.idUsuario,
        dataRegistro: element.dataRegistro,
        horaRegistro: element.horaRegistro,
        justificaPonto: '',
        justificativaReprovacao: element.justificativaReprovacao,
        edicaoAprovada: 0
      };
      console.log(this.ponto)
      this.appService.updateRegistroPonto(this.ponto).subscribe(
        success => {
          this.alerta.next(this.mensagemSucesso = (`Alteração Realizada com Sucesso.`));
          this.listarRegistrosAprovacoesPendentes();
        },
        error => {
          this.alerta.next(this.mensagemErro = ('Não foi possivel realizar a alteração.'));
        }
      );
    });
  }
}
