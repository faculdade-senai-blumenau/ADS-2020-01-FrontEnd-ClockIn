

import { Component, OnInit} from '@angular/core';
import { NgForm } from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { AppService } from 'src/app/app.service';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  clockHandle;
  listaDePontos: any;
  loginUsuario: any;
  resposta: any;
  usuarioLogado: any;
  mensagemErroLogin='';
  public alertaLogin = new Subject<string>();
  constructor(private appService: AppService,  private router: Router) { }
  

  ngOnInit(): void {
    this.loginUsuario={
      usuario: '',
      senha: ''
    }
    this.usuarioLogado={
      idUsuario: ''
    }
    this.alertaLogin.pipe(debounceTime(5000)).subscribe(() => {
      this.mensagemErroLogin = ''
    });
    if (this.appService.getDeslogado()){
      this.erroLogin("Sessão Expirada");
    }
  }
  
  getUsuarioLogado(){
    return this.usuarioLogado;
  }
  erroLogin(mensagem){
    this.alertaLogin.next(this.mensagemErroLogin = (mensagem));
  }
  login(email,senha){
    this.loginUsuario={
      usuario: email.value,
      senha: senha.value
    }
    this.appService.logar(this.loginUsuario).subscribe(
     
      resposta => {
        this.usuarioLogado = resposta
        console.log(this.loginUsuario)
        if (this.loginUsuario.email != "" && this.loginUsuario.senha != "") {
          if (this.usuarioLogado == null){
            this.erroLogin('Usuário ou Senha inválidos!');
          } else {
            this.appService.setarUsuario(this.usuarioLogado.idUsuario);
            this.appService.declararUsuario(this.usuarioLogado);
            this.router.navigate(['/home']);
            email.reset();
            senha.reset();
          }
        }
      }
    );
  }
}
