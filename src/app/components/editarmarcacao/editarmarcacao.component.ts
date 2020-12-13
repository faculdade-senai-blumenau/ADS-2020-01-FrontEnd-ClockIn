
import { AppService } from 'src/app/app.service';
import { AppComponent } from './../../app.component';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

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
  mensagemSucesso = '';
  mensagemErro = '';
  alertDataRegistro = '';
  alertHoraRegistro = '';
  alertJustificaPonto = '';
  clockHandle;

  listaDePontos: any;
  registroPonto: any;
  ponto: any;
  idUsuario = this.appService.buscarUsuario();

  public paginaAtual = 1;
  statusEdicaoDescricao: any;
  dataColor: number;


  /* Variaveis Fim */

  constructor(
    private appService: AppService,
    private datePipe: DatePipe,
    private router: Router) { }

  ngOnInit(): void {
    if (this.appService.getUsuarioLogado() == null) {
      this.router.navigate(["/login"]);
    }
    this.ponto = {
      idRegistroPonto: '',
      idUsuario: '',
      dataRegistro: '',
      horaRegistro: '',
      justificaPonto: 0,
      justificativaReprovacao: '',
      edicaoAprovada: 0,
      espelhoPonto: ''
    };

    this.listarRegistrosPontoEditarMarcacao(this.idUsuario);

    this.clockHandle = setInterval(() => {
      /* Remove o alerta após o tempo determinado (milisegundos) */
      this.alerta.pipe(debounceTime(5000)).subscribe(() => {
        this.mensagem = '', this.mensagemErro = '', this.mensagemSucesso = ''
      });
    }, 1000);
  }
  sessao() {
    this.appService.controlaSessao()
  }

  listarRegistrosPontoEditarMarcacao(idUsuario: number) {
    this.limparObjetoPonto();
    this.appService.buscarRegistrosPontoEditarMarcacao(idUsuario).subscribe((registroPonto) => {
      this.registroPonto = registroPonto;
      this.listaDePontos = this.registroPonto.reduce((r,{dataRegistro})=>{
        if(!r.some(o=>o.dataRegistro==dataRegistro)){
          r.push({dataRegistro,horaRegistro:this.registroPonto.filter(v=>v.dataRegistro==dataRegistro)});
    }
    return r;
    },[]);
    });
  }

  buscarRegistroPontoID(idRegistroPonto: number) {
    this.limparObjetoPonto();
    this.appService.buscarPorIDGenerico('registroPonto', idRegistroPonto).subscribe(
      resposta => this.ponto = this.alterarStatusEdicao(resposta)

      );
  }

  cadastrarEditarRegistroPonto() {
    this.limparMensagens()
    this.ponto.idUsuario = this.idUsuario
    this.verificaCamposObrigatorios();
    if(this.ponto.dataRegistro && this.ponto.horaRegistro && this.ponto.justificaPonto ){
      this.appService.criarGenerico('registroPonto', this.ponto).subscribe(
        success => {
          this.listarRegistrosPontoEditarMarcacao(this.idUsuario);
          this.alerta.next(this.mensagemSucesso = (`Registro salvo com Sucesso.`));
        },
        error => {
          this.alerta.next(this.mensagemErro = 'Não foi possível salvar o registro.');
        }
      );
    }
    else {
      this.alerta.next(this.mensagemErro = 'Favor informar todos os campos obrigatórios.');
    }
  }

  verificaCamposObrigatorios(){
    this.ponto.idUsuario = this.idUsuario
    if (!this.ponto.dataRegistro){
      this.alerta.next(this.alertDataRegistro = 'Campo Obrigatório');
    }else {
      this.alerta.next(this.alertDataRegistro = '');
    }
    if (!this.ponto.horaRegistro){
      this.alerta.next(this.alertHoraRegistro = 'Campo Obrigatório');
    }else{
      this.alerta.next(this.alertHoraRegistro = '');
    }
    if (!this.ponto.justificaPonto){
      this.alerta.next(this.alertJustificaPonto = 'Campo Obrigatório');
    }else{
      this.alerta.next(this.alertJustificaPonto = '');
    }
  }

  alterarStatusEdicao(ponto) {
    this.statusEdicaoDescricao = "";
    if (ponto.edicaoAprovada === 0 && ponto.justificaPonto === 0){
      this.statusEdicaoDescricao = "Não Editado"
    }
    else if (ponto.edicaoAprovada == 1) {
      this.statusEdicaoDescricao = "Aprovada pelo Gestor"
    }
    else if (ponto.edicaoAprovada == 2 && ponto.justificaPonto == 0) {
      this.statusEdicaoDescricao = "Reprovada pelo Gestor"
    }
    else if ((ponto.edicaoAprovada == 0 && ponto.justificaPonto > 0) || (ponto.edicaoAprovada == 2 && ponto.justificaPonto > 0)) {
      this.statusEdicaoDescricao = "Aguardando Aprovação"
    }
    return ponto
  }

  limparObjetoPonto() {
    this.ponto = {};
    this.registroPonto = {};
  }

  limparMensagens() {
    this.mensagem = '';
    this.mensagemSucesso = '';
    this.mensagemErro = '';
    this.alertDataRegistro = '';
    this.alertHoraRegistro = '';
    this.alertJustificaPonto = '';
  }
}
