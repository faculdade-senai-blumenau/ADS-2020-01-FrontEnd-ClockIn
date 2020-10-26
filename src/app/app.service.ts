import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistroPonto, Usuario, Setor, EspelhoPonto, Jornada } from './app.model';
import { Observable } from 'rxjs';
import { EspelhopontoComponent } from './components/espelhoponto/espelhoponto.component';
import { stringify } from 'querystring';
import { formatDate, Location } from '@angular/common';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})

/* Esta classe possui os métodos globais que retornam dados para os outros componentes*/
/* Dessa forma evita a replicação do mesmo código em varios componentes*/

export class AppService {

  constructor(private http: HttpClient, public location: Location) {
  }

  /* Variáveis */
  urlBase = 'http://localhost:5000'; 
  /* urlBase = 'https://cors-anywhere.herokuapp.com/http://Clockin-env.eba-tuvab2zq.sa-east-1.elasticbeanstalk.com'; */
  idUsuario = 2;


  /* Retorna a url padrão */
  buscarUrlBase() {
    return this.urlBase;
  }

  buscarUsuario() {
    return this.idUsuario;
  }

  buscarRegistrosPontoUsuario(idUsuario: number) {
    return this.http.get<RegistroPonto>(`${this.urlBase}/registroPonto/usuario/${idUsuario}`);
  }

  buscarRegistrosPontoAprovacoesPendentes() {
    return this.http.get<RegistroPonto>(`${this.urlBase}/registroPonto/`);
  }

  buscarRegistrosPontoUsuarioRange(idUsuario: number, dataInicial: any, dataFinal: any) {
    return this.http.get<RegistroPonto>(`${this.urlBase}/espelhoPonto/periodoPonto?dataInicial=${dataInicial}&dataFinal=${dataFinal}&idUsuario=${idUsuario}`);
  }

  buscarUsuarioPeloID(idUsuario: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.urlBase}/usuario/${idUsuario}`);
  }

  buscarSetorUsuario(idUsuario: number): Observable<Setor> {
    return this.http.get<Setor>(`${this.urlBase}/setor/${idUsuario}`);
  }

  registrarPonto(ponto: RegistroPonto): Observable<RegistroPonto> {
    return this.http.post<RegistroPonto>(`${this.urlBase}/registroPonto/`, ponto);
  }

  buscarPontoUsuario(idUsuario: number): Observable<RegistroPonto[]> {
    return this.http.get<RegistroPonto[]>(`${this.urlBase}/registroPonto/usuario/${idUsuario}`);
  }

  buscarRegistroPontoID(idRegistroPonto: number): Observable<RegistroPonto[]> {
    return this.http.get<RegistroPonto[]>(`${this.urlBase}/registroPonto/${idRegistroPonto}`);
  }

  updateRegistroPonto(registroPonto: RegistroPonto): Observable<RegistroPonto> {
    const url = `${this.urlBase}/registroPonto/${registroPonto.idRegistroPonto}`;
    return this.http.put<RegistroPonto>(url, registroPonto);
  }

  listar() {
    return this.http.get<Array<any>>(`${this.urlBase}/registroPonto/`);
  }
  criar(ponto: any) {
    return this.http.post(`${this.urlBase}/registroPonto/`, ponto);
  }

  buscarEspelhoPonto(idUsuario: number) {
    return this.http.get<EspelhoPonto[]>(`${this.urlBase}/espelhoPonto/periodoEspelho?idUsuario=${idUsuario}&status=0`);
  }

  buscarEspelhoPontoAprovado(idUsuario: number) {
    return this.http.get<EspelhoPonto[]>(`${this.urlBase}/espelhoPonto/periodoEspelho?idUsuario=${idUsuario}&status=1`);
  }

  alterarStatusEspelho(espelhoPonto: EspelhoPonto): Observable<EspelhoPonto> {
    const url = `${this.urlBase}/espelhoPonto/${espelhoPonto.idEspelhoPonto}`;
    return this.http.put<EspelhoPonto>(url, espelhoPonto);
  }


  criarGenerico(table: any, jornada: any) {
    return this.http.post(`${this.urlBase}/${table}/`, jornada);
  }

  listarGenerico(table: any) {
    return this.http.get<Array<any>>(`${this.urlBase}/${table}/`);
  }

  updateJornada(jornada: Jornada): Observable<Jornada> {
    //modificado o idJornada por conta do MOK. ao apontar a API, utilizar o idJornada
    const url = `${this.urlBase}/jornada/${jornada.idJornada}`;
    return this.http.put<Jornada>(url, jornada);
  }

  updateSetor(setor: Setor): Observable<Setor> {
    //modificado o idSetor por conta do MOK. ao apontar a API, utilizar o idSetor
    const url = `${this.urlBase}/setor/${setor.idSetor}`;
    return this.http.put<Setor>(url, setor);
  }

  buscarJornadaID(idJornada: number): Observable<Jornada[]> {
    return this.http.get<Jornada[]>(`${this.urlBase}/jornada/${idJornada}`);
  }

  buscarSetorID(idSetor: number): Observable<Setor[]> {
    return this.http.get<Setor[]>(`${this.urlBase}/setor/${idSetor}`);
  }
}
