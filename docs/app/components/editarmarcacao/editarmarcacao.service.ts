
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistroPonto } from '../home/home.model';
import { Observable } from 'rxjs/internal/Observable';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EditarMarcacaoService {

  registroPontoUrl = 'http://localhost:5000/registroPonto';

  constructor(private http: HttpClient) {
  }

  buscarPontoUsuario(idUsuario: number): Observable<RegistroPonto[]> {
    return this.http.get<RegistroPonto[]>(`${this.registroPontoUrl}/usuario/${idUsuario}`);
  }

  buscarRegistroPontoID(idRegistroPonto: number): Observable<RegistroPonto[]> {
    return this.http.get<RegistroPonto[]>(`${this.registroPontoUrl}/${idRegistroPonto}`);
  }

  updateRegistroPonto(registroPonto: RegistroPonto): Observable<RegistroPonto> {
    const url = `${this.registroPontoUrl}/${registroPonto.idRegistroPonto}`;
    return this.http.put<RegistroPonto>(url, registroPonto);
  }
}
