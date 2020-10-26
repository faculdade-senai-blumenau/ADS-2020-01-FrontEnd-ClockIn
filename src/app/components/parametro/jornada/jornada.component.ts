
import { Component, OnInit } from '@angular/core';
import { AppComponent } from './../../../app.component';
import { AppService } from 'src/app/app.service';
import { Subject } from 'rxjs/internal/Subject';
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
  editarJornada: any;
  jornada: any;
  listarJornada: any;
  /* Variaveis Fim */

  constructor(private appComponent: AppComponent,
    private appService: AppService) { }

  ngOnInit(): void {
    this.editarJornada = {};
    this.listarJornada = this.listar();

    this.jornada = {
      id: '',
      inicioManha: '',
      finalManha: '',
      inicioTarde: '',
      finalTarde: ''
    };
  }

  buscarJornadaID(idJornada: number) {
    this.appService.buscarJornadaID(idJornada).subscribe(
      resposta => this.editarJornada = resposta);
  }

  updateJornada() {
    this.appService.updateJornada(this.editarJornada).subscribe(
      success => {
        this.alerta.next(this.mensagemSucesso = (`Alteração Realizada com Sucesso.`));
        this.listarJornada = this.listar();
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
        this.listarJornada = this.listar();
      },
      error => {
        this.alerta.next(this.mensagemErro = 'Não foi possível inserir a jornada.');
      }
    );
    frm.reset();
  }

  listar() {
    this.appService.listarGenerico('jornada').subscribe(jornada => {
      this.listarJornada = jornada;
    });
  }
}
