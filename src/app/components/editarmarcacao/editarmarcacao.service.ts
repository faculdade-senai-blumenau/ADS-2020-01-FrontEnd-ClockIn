
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditarMarcacaoService {

  registroPontoUrl = 'http://localhost:5000/registroPonto';

  constructor(private http: HttpClient) {
  }

  buscarRegistrosPonto(){
    return this.http.get<any>(this.registroPontoUrl);
  }
}
