

import { Component, OnInit} from '@angular/core';
import * as moment from 'moment';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  clockHandle;
  listaDePontos: any;

  constructor(private appComponent: AppComponent) { }

  ngOnInit(): void {
    const dataInicialFiltro = moment().subtract(6, 'days').format();
    this.listaDePontos = this.appComponent.buscarRegistrosPonto(dataInicialFiltro)
  }
}
