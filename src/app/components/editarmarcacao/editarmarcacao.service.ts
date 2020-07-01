
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistroPonto } from '../home/home.model';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class EditarMarcacaoService {

  registroPontoUrl = 'http://localhost:5000/registroPonto';

  constructor(private http: HttpClient) {
  }

  buscarRegistrosPonto(idUsuario: number): Observable<RegistroPonto[]> {
    return this.http.get<RegistroPonto[]>(`${this.registroPontoUrl}/usuario/${idUsuario}`);
  }



}
