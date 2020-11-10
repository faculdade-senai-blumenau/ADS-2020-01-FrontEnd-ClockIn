import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import * as moment from 'moment';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-cadastros',
  templateUrl: './cadastros.component.html',
  styleUrls: ['./cadastros.component.css']
})
export class CadastrosComponent implements OnInit {
  registroPonto: {};
  clockHandle;
  listaDePontos: any;

  constructor(private appService: AppService,
    private appComponent: AppComponent) { }

  ngOnInit(): void {
    $(function () {
      // Datatables basic
      $('#datatables-basic').DataTable({
        responsive: true,
        language: {
          decimal: "",
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
  }

}