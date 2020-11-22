import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

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

  usuario: any;
  endereco: any;
  usuarios: any;
  enderecos: any;

  /* Variaveis Fim */

  constructor(private appService: AppService) { }

  ngOnInit(): void {

    $(function () {
      // Datatables basic
      $('#datatables-usuario').DataTable({
        responsive: true,
        language: {
          emptyTable: "Nenhum registro encontrado",
          info: "Exibindo _START_ a _END_ de _TOTAL_ registros",
          infoEmpty: "Exibindo 0 a 0 de 0 registros",
          infoFiltered: "(Filtrado do total de _MAX_ registros)",
          lengthMenu: "Listar _MENU_ Registros",
          loadingRecords: "Carregando...",
          processing: "Processando...",
          search: "Procurar:",
          zeroRecords: "Nenhum registro encontrado",
          paginate: {
            first: "Primeira",
            last: "Última",
            next: "Próxima",
            previous: "Anterior"
          }
        }
      });
    });



    this.clockHandle = setInterval(() => {
      /* Remove o alerta após o tempo determinado (milisegundos) */
      this.alerta.pipe(debounceTime(5000)).subscribe(() => {
        this.mensagem = '', this.mensagemErro = '', this.mensagemSucesso = ''
      });
    }, 1000);

    this.listarUsuarios();

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

  listarUsuarios() {
    this.appService.listarGenerico('usuario').subscribe((usuarios) => {
      this.usuarios = usuarios;
    })
    this.appService.listarGenerico('endereco').subscribe((endereco) => {
      this.endereco = endereco;
    })
  }

  buscarUsuarioPeloID(idUsuario: number) {
    this.appService.buscarUsuarioPeloID(idUsuario).subscribe(
      resposta => this.usuario = resposta);
    this.appService.buscarEnderecoUsuario(idUsuario).subscribe(
      resposta => this.endereco = resposta);
  }

  updateUsuario(idUsuario: number) {
    this.appService.updateGenerico('usuario', idUsuario, this.usuario).subscribe(
      success => {
        this.listarUsuarios();
        this.alerta.next(this.mensagemSucesso = (`Alteração Realizada com Sucesso.`));
      },
      error => {
        this.alerta.next(this.mensagemErro = ('Não foi possivel realizar a alteração.'));
      }
    );
  }

  criarUsuario() {
    this.appService.criarGenerico('usuario', this.usuario).subscribe(
      success => {
        this.listarUsuarios();
        this.alerta.next(this.mensagemSucesso = (`Usuario Inserido com Sucesso.`));
      },
      error => {
        this.alerta.next(this.mensagemErro = 'Não foi possível inserir usuario.');
      }
    );
  }

  excluirUsuario(idUsuario: number) {
    this.appService.excluirGenerico('usuario', idUsuario).subscribe(
      success => {
        this.listarUsuarios();
        this.alerta.next(this.mensagemSucesso = (`Usuario excluído com sucesso`));
      },
      error => {
        this.alerta.next(this.mensagemErro = ('Não foi possível excluir o usuario selecionado.'));
      }
    );
  }

  limparObjetoUsuario() {
    this.usuario = {};
  }
}
