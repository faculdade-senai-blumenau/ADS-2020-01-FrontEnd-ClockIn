import { Setor } from 'src/app/app.model';

import { Component, OnInit } from '@angular/core';
import { AppComponent } from './../../../app.component';
import { AppService } from 'src/app/app.service';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
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
    setores: any;
    usuarios: any;
    setor: any;

    /* Variaveis Fim */

    constructor(private appComponent: AppComponent,
        private appService: AppService) { }

    ngOnInit(): void {

        this.clockHandle = setInterval(() => {
            /* Remove o alerta após o tempo determinado (milisegundos) */
            this.alerta.pipe(debounceTime(5000)).subscribe(() => {
                this.mensagem = '', this.mensagemErro = '', this.mensagemSucesso = ''
            });
        }, 1000);

        this.listarSetores();
        this.listarUsuarios();

        this.setor = {
            idSetor: '',
            idUsuario: '',
            descricaoSetor: ''
        };
    }

    listarSetores() {
        this.appService.listarGenerico('setor').subscribe((setores) => {
            this.setores = setores;
        });
    }

    listarUsuarios() {
        this.appService.listarGenerico('usuario').subscribe(usuarios => {
            this.usuarios = usuarios;
        });
    }

    buscarSetorPeloID(idSetor: number) {
        this.appService.buscarRegistroIDGenerico('setor', idSetor).subscribe(setor => {
            this.setor = setor;
        });
    }

    updateSetor(idSetor: number) {
        this.appService.updateGenerico('setor', idSetor, this.setor).subscribe(
            success => {
                this.setores = this.listarSetores();
                this.alerta.next(this.mensagemSucesso = (`Alteração Realizada com Sucesso.`));
            },
            error => {
                this.alerta.next(this.mensagemErro = ('Não foi possivel realizar a alteração.'));
            }
        );
    }

    criarSetor() {
        this.appService.criarGenerico('setor', this.setor).subscribe(
            success => {
                this.setores = this.listarSetores();
                this.alerta.next(this.mensagemSucesso = (`Setor Inserido com Sucesso.`));
            },
            error => {
                this.alerta.next(this.mensagemErro = 'Não foi possível inserir setor.');
            }
        );
    }

    excluirSetor(idSetor: number) {
        this.appService.excluirGenerico('setor', idSetor).subscribe(
            success => {
                this.listarSetores();
                this.alerta.next(this.mensagemSucesso = (`Setor excluído com sucesso`));
            },
            error => {
                this.alerta.next(this.mensagemErro = ('Não foi possível excluir o setor selecionado.'));
            }
        );
    }

    limparObjetoSetor() {
        this.setor = {};
    }
}
