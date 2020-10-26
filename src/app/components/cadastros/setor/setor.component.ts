
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
    editarSetor: any;
    setor: any;
    listarSetor: any;
    /* Variaveis Fim */

    constructor(private appComponent: AppComponent,
        private appService: AppService) { }

    ngOnInit(): void {
        this.editarSetor = {};

        this.setor = {
            id: '',
            descricaoSetor: ''
        };
    }

    buscarSetorID(idSetor: number) {
        this.appService.buscarSetorID(idSetor).subscribe(
            resposta => this.editarSetor = resposta);
    }

    updateSetor() {
        this.appService.updateSetor(this.editarSetor).subscribe(
            success => {
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
                this.alerta.next(this.mensagemSucesso = (`Setor Inserido com Sucesso.`));
            },
            error => {
                this.alerta.next(this.mensagemErro = 'Não foi possível inserir setor.');
            }
        );
        frm.reset();
    }
}
