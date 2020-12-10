
import { AppService } from 'src/app/app.service';
import { AppComponent } from './../../app.component';
import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';

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

  clockHandle;
  listaDePontos: any;
  registroPonto: any;
  ponto: any;

  urlBase = this.appService.buscarUrlBase();
  idUsuario = this.appService.buscarUsuario();

  public paginaAtual = 1;

  /* Variaveis Fim */

  constructor(private appService: AppService, private router: Router,private appComponent: AppComponent) { }

  ngOnInit(): void {
    if(this.appService.getUsuarioLogado()==null){
      this.router.navigate(["/login"]);
    }
    this.ponto = {
      idRegistroPonto: '',
      idUsuario: this.appService.buscarUsuario(),
      dataRegistro: '',
      horaRegistro: '',
      justificaPonto: '',
      justificativaReprovacao: ''
    };

    this.listarRegistrosPontoEditarMarcacao();

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

  listarRegistrosPontoEditarMarcacao() {
    const dataInicial = moment().subtract(30, 'days').format();
    this.listaDePontos = this.buscarRegistrosPonto(this.idUsuario, dataInicial, null);
  }

  buscarRegistrosPonto(idUsuario: number, dataInicial: string, dataFinal: string) {
    this.appService.buscarRegistrosPontoUsuario(idUsuario).subscribe((registroPonto) => {
      this.registroPonto = registroPonto;
      const groups = new Set(this.registroPonto
        .filter(i => i.dataRegistro >= dataInicial && (i.dataRegistro <= dataFinal || dataFinal == null))
        .map(item => item.dataRegistro));
      this.listaDePontos = [];
      groups.forEach(g =>
        this.listaDePontos.push({
          dataRegistro: g,
          values: this.registroPonto.filter(i => i.dataRegistro === g)
        }),
      );
    });
  }

  buscarRegistroPontoID(idRegistroPonto: number) {
    this.appService.buscarRegistroPontoID(idRegistroPonto).subscribe(
      resposta => this.registroPonto = resposta);
  }

  updateRegistroPonto(idRegistroPonto: number) {
    this.registroPonto.edicaoAprovada = 0;
    this.appService.updateGenerico('registroPonto', idRegistroPonto, this.registroPonto).subscribe(
      success => {
        this.alerta.next(this.mensagemSucesso = (`Alteração Realizada com Sucesso.`));
        this.listarRegistrosPontoEditarMarcacao();
      },
      error => {
        this.alerta.next(this.mensagemErro = ('Não foi possivel realizar a alteração.'));
      }
    );
  };


  inserirRegistroPonto() {
    this.appService.criarGenerico('registroPonto', this.ponto).subscribe(
      success => {
        this.limparObjetoPonto();
        this.listarRegistrosPontoEditarMarcacao();
        this.alerta.next(this.mensagemSucesso = (`Setor Inserido com Sucesso.`));
      },
      error => {
        this.alerta.next(this.mensagemErro = 'Não foi possível inserir setor.');
      }
    );
  }

  limparObjetoPonto() {
    this.ponto = {
      idRegistroPonto: '',
      idUsuario: this.appService.buscarUsuario(),
      dataRegistro: '',
      horaRegistro: '',
      justificaPonto: '',
      justificativaReprovacao: ''
    };
  }
}
