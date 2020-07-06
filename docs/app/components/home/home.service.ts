
import { Usuario, RegistroPonto, Setor } from './home.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, catchError } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  usuarioUrl = 'http://localhost:5000/usuario';
  registroPontoUrl = 'http://localhost:5000/registroPonto';
  setorUrl = 'http://localhost:5000/setor';

  constructor(private http: HttpClient) {
  }

  buscarUsuarioPeloID(idUsuario: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.usuarioUrl}/${idUsuario}`);
  }

  buscarSetorUsuario(idUsuario: number): Observable<Setor> {
    return this.http.get<Setor>(`${this.setorUrl}/${idUsuario}`);
  }

  buscarRegistrosPonto(idUsuario: number): Observable<RegistroPonto[]> {
    return this.http.get<RegistroPonto[]>(`${this.registroPontoUrl}/usuario/${idUsuario}`);
  }

  registrarPonto(ponto: RegistroPonto): Observable<RegistroPonto> {
    return this.http.post<RegistroPonto>(this.registroPontoUrl, ponto);
  }

}
