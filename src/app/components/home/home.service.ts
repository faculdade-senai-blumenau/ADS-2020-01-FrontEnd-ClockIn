
import { Usuario, RegistroPonto } from './home.model';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  usuarioUrl = 'http://localhost:5000/usuario';
  registroPontoUrl = 'http://localhost:5000/registroPonto';

  constructor(private http: HttpClient) {
  }

  buscarUsuarioPeloID(idUsuario: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.usuarioUrl}/${idUsuario}`);
  }

  registrarPonto(registrarPonto: RegistroPonto): Observable<RegistroPonto> {
    return this.http.post<RegistroPonto>(this.registroPontoUrl, registrarPonto);
  }

  buscarRegistrosPonto(){
    return this.http.get<any>(this.registroPontoUrl);
  }
  
}
