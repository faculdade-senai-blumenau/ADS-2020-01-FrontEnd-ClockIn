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
    usuario: any;

    /* Variaveis Fim */

    constructor(private appService: AppService) { }

    ngOnInit(): void {
        $(function () {
            // Datatables basic
            $('#datatables-setor').DataTable({
                destroy: true,
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

        this.listarSetores();

        this.setor = {
            idSetor: '', idUsuario: '', descricaoSetor: '', nomeResponsavel: ''
        };
    }

    listarSetores() {
        this.appService.listarGenerico('setor').subscribe((setores) => {
            this.setores = setores;
        });
        this.appService.listarGenerico('usuario').subscribe(usuarios => {
            this.usuarios = usuarios;
        });
    }

    buscarSetorPeloID(idSetor: number) {
        this.appService.buscarPorIDGenerico('setor', idSetor).subscribe(setor => {
            this.setor = setor;
        });
    }

    buscarUsuarioPeloID(idUsuario: number) {
        this.appService.buscarPorIDGenerico('usuario', idUsuario).subscribe(
            resposta => this.usuario = resposta);
    }

    updateSetor(idSetor: number, setor) {

        this.buscarUsuarioPeloID(this.setor.idUsuario)
        this.setor.nomeResponsavel = this.usuario.nomeUsuario
        this.appService.updateGenerico('setor', idSetor, setor).subscribe(
            success => {
                this.listarSetores();
                this.alerta.next(this.mensagemSucesso = (`Registro salvo com sucesso.`));
            },
            error => {
                this.alerta.next(this.mensagemErro = ('Não foi possivel salvar o registro.'));
            }
        );
    }

    inserirSetor() {
        this.limparMemsagens()
        this.buscarUsuarioPeloID(this.setor.idUsuario)
        this.setor.nomeResponsavel = this.usuario.nomeUsuario
        this.appService.criarGenerico('setor', this.setor).subscribe(
            success => {
                this.listarSetores();
                this.alerta.next(this.mensagemSucesso = (`Setor Inserido com Sucesso.`));
            },
            error => {
                this.alerta.next(this.mensagemErro = 'Não foi possível inserir setor.');
            }
        );
    }

    excluirSetor(idSetor: number) {
        this.limparMemsagens()
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

    limparMemsagens() {
        this.mensagem = '', this.mensagemErro = '', this.mensagemSucesso = ''
    }
}
