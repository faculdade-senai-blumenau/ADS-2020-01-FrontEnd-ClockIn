import { Component, OnInit } from '@angular/core';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Subject } from 'rxjs/internal/Subject';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.css']
})
export class CargosComponent implements OnInit {
/* Variaveis */
public alerta = new Subject<string>();
staticAlertClosed = true;

/* Mensagens */
mensagem = '';
mensagemSucesso = '';
mensagemErro = '';
clockHandle;
cargos: any;
cargo: any;

/* Variaveis Fim */

constructor(private appService: AppService) { }

ngOnInit(): void {

    this.clockHandle = setInterval(() => {
        /* Remove o alerta após o tempo determinado (milisegundos) */
        this.alerta.pipe(debounceTime(5000)).subscribe(() => {
            this.mensagem = '', this.mensagemErro = '', this.mensagemSucesso = ''
        });
    }, 1000);

    this.listarCargos();

    this.cargo = {
      idCargo: '',
      nomeCargo: '',
    };
}

listarCargos() {
    this.appService.listarGenerico('cargo').subscribe((cargos) => {
        this.cargos = cargos;
    });
}


buscarCargoPeloID(idCargo: number) {
    this.appService.buscarRegistroIDGenerico('cargo', idCargo).subscribe(cargo => {
        this.cargo = cargo;
    });
}

updateCargo(idCargo: number) {
    this.appService.updateGenerico('cargo', idCargo, this.cargo).subscribe(
        success => {
            this.listarCargos();
            this.alerta.next(this.mensagemSucesso = (`Alteração Realizada com Sucesso.`));
        },
        error => {
            this.alerta.next(this.mensagemErro = ('Não foi possivel realizar a alteração.'));
        }
    );
}

criarCargo() {
    this.appService.criarGenerico('cargo', this.cargo).subscribe(
        success => {
            this.listarCargos();
            this.alerta.next(this.mensagemSucesso = (`Cargo Inserido com Sucesso.`));
        },
        error => {
            this.alerta.next(this.mensagemErro = 'Não foi possível inserir cargo.');
        }
    );
}

excluirCargo(idCargo: number) {
    this.appService.excluirGenerico('cargo', idCargo).subscribe(
        success => {
            this.listarCargos();
            this.alerta.next(this.mensagemSucesso = (`Cargo excluído com sucesso`));
        },
        error => {
            this.alerta.next(this.mensagemErro = ('Não foi possível excluir o cargo selecionado.'));
        }
    );
}

limparObjetoCargo() {
    this.cargo = {};
}
}
