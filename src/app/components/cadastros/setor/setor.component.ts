
import { Component, OnInit } from '@angular/core';
import { AppComponent } from './../../../app.component';
import { AppService } from 'src/app/app.service';
import { Subject } from 'rxjs/internal/Subject';
@Component({
    selector: 'app-setor',
    templateUrl: './setor.component.html',
    styleUrls: ['./setor.component.css']
})
export class SetorComponent implements OnInit {
    /* Variaveis */
    public alerta = new Subject<string>();
    staticAlertClosed = true;

    /* Mensagens */
    mensagem = '';
    mensagemSucesso = '';
    mensagemErro = '';
    clockHandle;
    listaDeSetores: any;
    listaDeUsuarios: any;
    usuario: any;
    setor: any;

    /* Variaveis Fim */

    constructor(private appComponent: AppComponent,
        private appService: AppService) { }

    ngOnInit(): void {
        this.listaDeSetores = this.listarSetores();
        this.listaDeUsuarios = this.listarUsuarios();

        this.setor = {
            idSetor: '',
            usuario: '',
            descricaoSetor: ''
        };


    }

    listarSetores() {
        this.appService.listarGenerico('setor').subscribe(setor => {
          this.listaDeSetores = setor;
        });
    }

    listarUsuarios() {
        this.appService.listarGenerico('usuario').subscribe(usuario => {
          this.listaDeUsuarios = usuario;
        });
    }
    
    buscarSetorID(idSetor: number) {
        this.setor = [];
        this.appService.buscarSetorID(idSetor).subscribe(
            resposta => this.setor = resposta);
    }

    updateSetor() {
        this.appService.updateSetor(this.setor).subscribe(
            success => {
                this.listaDeSetores = this.listarSetores();
                this.alerta.next(this.mensagemSucesso = (`Alteração Realizada com Sucesso.`));
            },
            error => {
                this.alerta.next(this.mensagemErro = ('Não foi possivel realizar a alteração.'));
            }
        );
    }

    criarSetor(frm) {
        this.appService.criarGenerico('setor', this.setor).subscribe(
            success => {
                this.listaDeSetores = this.listarSetores();
                this.alerta.next(this.mensagemSucesso = (`Setor Inserido com Sucesso.`));
            },
            error => {
                this.alerta.next(this.mensagemErro = 'Não foi possível inserir setor.');
            }
        );

        frm.reset();
    }
}
