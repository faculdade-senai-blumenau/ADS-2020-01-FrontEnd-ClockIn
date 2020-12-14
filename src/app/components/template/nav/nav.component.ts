import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppComponent } from 'src/app/app.component';
import { Usuario } from 'src/app/app.model';
import { AppService } from 'src/app/app.service';
import { UsuarioComponent } from '../../cadastros/usuario/usuario.component';
import { HomeComponent } from '../../home/home.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {
  usuario: Usuario;
  isGestor='';
  constructor(private appService: AppService, private router: Router, public appComponent: AppComponent) { }
  
  ngOnInit() {
  }
  loading(){
    
  }
   usuarioGestor() {
    if (this.appService.getUsuarioLogado().gestor == 0){
      return false;
    } else {
      return true;
    }
  }

   logout(){
    this.appService.declararUsuario(null);
    window.location.reload();
    this.router.navigate(["/login"]);
  }
}
