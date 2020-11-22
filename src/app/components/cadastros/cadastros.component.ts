import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-cadastros',
  templateUrl: './cadastros.component.html',
  styleUrls: ['./cadastros.component.css']
})
export class CadastrosComponent implements OnInit {
  registroPonto: {};
  clockHandle;
  listaDePontos: any;

  constructor(private appService: AppService, private router: Router) { }

  ngOnInit(): void {
    if(this.appService.getUsuarioLogado()==null){
      this.router.navigate(["/login"]);
    }

  }
  sessao(){
    this.appService.controlaSessao()
  }
}