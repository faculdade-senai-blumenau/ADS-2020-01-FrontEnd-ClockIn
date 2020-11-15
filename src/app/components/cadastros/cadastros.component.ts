import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cadastros',
  templateUrl: './cadastros.component.html',
  styleUrls: ['./cadastros.component.css']
})
export class CadastrosComponent implements OnInit {
  registroPonto: {};
  clockHandle;
  listaDePontos: any;

  constructor() { }

  ngOnInit(): void {

  }
}