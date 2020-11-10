import { CadastrosComponent } from './../cadastros.component';

import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Subject } from 'rxjs/internal/Subject';
import { DataTableDirective } from 'angular-datatables/src/angular-datatables.directive';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {

  /* Variaveis */
  public alerta = new Subject<string>();
  staticAlertClosed = true;

  /* Mensagens */
  mensagem = '';
  mensagemSucesso = '';
  mensagemErro = '';
  clockHandle;


  @ViewChild(DataTableDirective)
  datatableElement: DataTableDirective;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject();

  listaDeUsuarios: any = [];
  usuario: any = [];
  endereco: any = [];

  /* Variaveis Fim */

  constructor(private appService: AppService) { }

  ngOnInit(): void {


    this.listaDeUsuarios = this.listarUuarios();

    this.usuario = {
      idUsuario: '',
      cargo: '',
      jornada: '',
      setor: '',
      nomeUsuario: '',
      cpf: '',
      rg: '',
      dataNascimento: '',
      telefone: '',
      ativo: '',
      gestor: '',
      login: '',
      senha: '',
      foto: '',
      cargoConfianca: ''
    };
  }

  buscarUsuarioPeloID(idUsuario: number) {
    this.usuario = [];
    this.appService.buscarUsuarioPeloID(idUsuario).subscribe(
      resposta => this.usuario = resposta);
    this.endereco = [];
    this.appService.buscarEnderecoUsuario(idUsuario).subscribe(
      resposta => this.endereco = resposta);

  }
  listarUuarios() {
    this.appService.buscarUsuarios().subscribe(usuario => {
      this.listaDeUsuarios = usuario;
      
    });
  }
}
