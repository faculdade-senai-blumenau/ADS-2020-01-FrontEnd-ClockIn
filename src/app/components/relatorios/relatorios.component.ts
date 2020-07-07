import { Component, Input, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { debounceTime } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';
import { BaseFilterCellComponent, FilterService } from "@progress/kendo-angular-grid";
import { FilterDescriptor, CompositeFilterDescriptor } from "@progress/kendo-data-query/dist/es/main";

@Component({
  selector: 'app-relatorios',
  template: `
  <kendo-grid
      [kendoGridBinding]="listaDePontos"
      filterable="row"
      [height]="400"
  >
  <kendo-grid-column field="ProductName" title="Product Name">
  </kendo-grid-column>
  <kendo-grid-column field="FirstOrderedOn" format="{0:d}">
      <ng-template kendoGridFilterCellTemplate let-filter>
          <date-range-filter-cell
              class="date-range-filter"
              [filter]="filter"
              field="FirstOrderedOn">
          </date-range-filter-cell>
      </ng-template>
  </kendo-grid-column>
</kendo-grid>
`,
  styleUrls: ['./relatorios.component.css'],
  styles: [`kendo-daterange > kendo-dateinput.range-filter {
            display: inline-block;
        }
        .k-button {
            margin-left: 5px;
        }` ]
})

export class RelatoriosComponent extends BaseFilterCellComponent implements OnInit {
  clockHandle;
  listaDePontos: any[];
  registroPonto: any;

  /* Variaveis alerta */
  public alerta = new Subject<string>();
  staticAlertClosed = true;
  mensagem = '';
  mensagemErro = '';
  mensagemSucesso = '';

  @Input()
  public filter: CompositeFilterDescriptor;

  @Input()
  public field: string;

  constructor(private appComponent: AppComponent, 
     filterService: FilterService
    ) { super(filterService) }

  ngOnInit() {
    this.registroPonto = {};
    this.clockHandle = setInterval(() => {
      const dataInicialFiltro = moment().subtract(30, 'days').format();
      this.listaDePontos = this.appComponent.buscarRegistrosPonto(dataInicialFiltro);
      console.log(this.listaDePontos)
    }, 200);

  }
  gerarRelatorio() {
    this.registroPonto = {};
    this.clockHandle = setInterval(() => {
      const dataInicialFiltro = moment().subtract(30, 'days').format();
      this.listaDePontos = this.appComponent.buscarRegistrosPonto(dataInicialFiltro);
      console.log(this.listaDePontos)
    }, 200);
  }
  public get start(): Date {
    const first = this.findByOperator("gte");

    return (first || <FilterDescriptor>{}).value;
}

public get end(): Date {
    const end = this.findByOperator("lte");
    return (end || <FilterDescriptor>{}).value;
}

public get hasFilter(): boolean {
    return this.filtersByField(this.field).length > 0;
}

public clearFilter(): void {
    this.filterService.filter(
        this.removeFilter(this.field)
    );
}

public filterRange(start: Date, end: Date): void {
    this.filter = this.removeFilter(this.field);

    const filters = [];

    if (start) {
        filters.push({
            field: this.field,
            operator: "gte",
            value: start
        });
    }

    if (end) {
        filters.push({
            field: this.field,
            operator: "lte",
            value: end
        });
    }

    const root = this.filter || {
        logic: "and",
        filters: []
    };

    if (filters.length) {
        root.filters.push(...filters);
    }

    this.filterService.filter(root);
}

private findByOperator(op: string): FilterDescriptor {
    return this.filtersByField(this.field)
        .filter(({ operator }) => operator === op)[0];
}
}