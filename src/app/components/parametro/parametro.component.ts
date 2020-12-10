import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { Parametro } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-parametro',
  templateUrl: './parametro.component.html',
  styleUrls: ['./parametro.component.css']
})
export class ParametroComponent implements OnInit {
  public alerta = new Subject<string>();
  mensagemSucesso='';
  mensagemErro='';
  mensagem='';
  clockHandle;
  tempoSessao: any;
  constructor(private appService: AppService, private router: Router) { }
  
  parametro:Parametro;
  ngOnInit(): void {
    if(this.appService.getUsuarioLogado()==null){
      this.router.navigate(["/login"]);
    }
    if(!this.tempoSessao){
      this.getTempSessao();
    }
    this.clockHandle = setInterval(() => {
      /* Remove o alerta após o tempo determinado (milisegundos) */
      this.alerta.pipe(debounceTime(5000)).subscribe(() => {
          this.mensagem = '', this.mensagemErro = '', this.mensagemSucesso = ''
      });
  }, 1000);
    
  }
  getTempSessao(){
    
    this.appService.buscaParametro().subscribe((parametro) => {
      this.parametro = parametro;
      this.tempoSessao=parametro.tempSessao;
      
    });
    
  }
  sessao(){
   
    this.appService.controlaSessao();
  }
  updateParametros(){
    this.parametro.tempSessao=this.tempoSessao;
    this.parametro.tempoSessao=this.tempoSessao;
    
   
    
    this.appService.alterarParametros(this.parametro).subscribe(
      success => {
          
          this.alerta.next(this.mensagemSucesso = (`Registro salvo com sucesso.`));
      },
      error => {
          this.alerta.next(this.mensagemErro = ('Não foi possivel salvar o registro.'));
      }
  );
  }

}
