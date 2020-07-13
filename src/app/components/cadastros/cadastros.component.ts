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
  }
}
