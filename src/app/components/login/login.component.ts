

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
    
  }
  getUsuarioLogado(){
    return this.usuarioLogado;
  }
  login(email,senha){
    this.loginUsuario={
      usuario: email.value,
      senha: senha.value
    }
    this.appService.logar(this.loginUsuario).subscribe(
     
      resposta => {
        this.usuarioLogado = resposta
        
        if (this.usuarioLogado == null){
          //alert("Usuário ou Senha Inválidos")
          this.alertaLogin.next(this.mensagemErroLogin = (`Usuário ou Senha inválidos!`));
          
          
        } else {
          this.appService.setarUsuario(this.usuarioLogado.idUsuario);
          this.appService.declararUsuario(this.usuarioLogado);
          this.router.navigate(['/home']);
         
        }
      }
      
    );
    
    email.reset();
    senha.reset();

  }
}
