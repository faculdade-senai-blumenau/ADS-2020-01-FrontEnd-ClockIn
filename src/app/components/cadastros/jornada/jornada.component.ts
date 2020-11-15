
import { Component, OnInit } from '@angular/core';
import { AppComponent } from './../../../app.component';
import { AppService } from 'src/app/app.service';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
@Component({
  selector: 'app-jornada',
  templateUrl: './jornada.component.html',
  styleUrls: ['./jornada.component.css']
})
export class JornadaComponent implements OnInit {

  /* Variaveis */
  public alerta = new Subject<string>();
  staticAlertClosed = true;

  /* Mensagens */
  mensagem = '';
  mensagemSucesso = '';
  mensagemErro = '';

  clockHandle;
  jornada: any;
  jornadas: any;
  /* Variaveis Fim */

  constructor(private appComponent: AppComponent,
    private appService: AppService) { }

  ngOnInit(): void {

    $(function () {
      // Datatables basic
      $('#datatables-jornada').DataTable({
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

    this.listarJornada();

    this.jornada = {
      idJornada: '',
      inicioManha: '',
      finalManha: '',
      inicioTarde: '',
      finalTarde: ''
    };
  }

  listarJornada() {
    this.appService.listarGenerico('jornada').subscribe(jornadas => {
      this.jornadas = jornadas;
    });
  }

  buscarJornadaPeloID(idJornada: number) {
    this.appService.buscarRegistroIDGenerico('jornada', idJornada).subscribe(
      resposta => this.jornada = resposta);
  }

  updateJornada() {
    this.appService.updateJornada(this.jornada).subscribe(
      success => {
        this.alerta.next(this.mensagemSucesso = (`Alteração Realizada com Sucesso.`));
        this.listarJornada();
      },
      error => {
        this.alerta.next(this.mensagemErro = ('Não foi possivel realizar a alteração.'));
      }
    );
  }

  criarJornada(frm) {
    this.appService.criarGenerico('jornada', this.jornada).subscribe(
      success => {
        this.alerta.next(this.mensagemSucesso = (`Jornada Inserida com Sucesso.`));
        this.listarJornada();
      },
      error => {
        this.alerta.next(this.mensagemErro = 'Não foi possível inserir a jornada.');
      }
    );
    frm.reset();
  }

  excluirJornada(idJornada: number) {
    this.appService.excluirGenerico('jornada', idJornada).subscribe(
      success => {
        this.listarJornada();
        this.alerta.next(this.mensagemSucesso = (`Jornada excluída com sucesso`));
      },
      error => {
        this.alerta.next(this.mensagemErro = ('Não foi possível excluir a jornada selecionada.'));
      }
    );
  }

  limparObjetoJornada() {
    this.jornada = {};
}

}
