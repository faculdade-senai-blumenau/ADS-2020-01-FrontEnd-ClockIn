import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RegistroPonto, Usuario, Setor, EspelhoPonto, Jornada, Endereco } from './app.model';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';

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
  urlBaseCep = "https://viacep.com.br/ws";
  
  idUsuario: any;
  usuario: any;


  /* Retorna a url padrão */
  buscarUrlBase() {
    return this.urlBase;
  }

  buscarUsuario() {
    return this.idUsuario;
  }
  declararUsuario(usuario){
    this.usuario=usuario
  }
  getUsuarioLogado(){
    return this.usuario;
  }

  setarUsuario(idUsuario){
    this.idUsuario=idUsuario;
  }

  consultaCepCorreios(cep: string) {
    return this.http.get<any>(`${this.urlBaseCep}/${cep}/json`);
  }

  buscarUsuarios() {
    return this.http.get<Usuario>(`${this.urlBase}/usuario`);
  }

  buscarRegistrosPontoUsuario(idUsuario: number) {
    return this.http.get<RegistroPonto>(`${this.urlBase}/registroPonto/usuario/${idUsuario}`);
  }

  buscarRegistrosPontoAprovacoesPendentes() {
    return this.http.get<RegistroPonto>(`${this.urlBase}/registroPonto/aprovacaoPendente`);
  }

  aprovacaoPendenteVisualizar(dataRegistro: any, idUsuario: number) {
    return this.http.get<RegistroPonto>(`${this.urlBase}/registroPonto/visualizarAprovacaoPendente?dataRegistro=${dataRegistro}&idUsuario=${idUsuario}`);
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

  logar(loginUsuario: any){
    return this.http.post(`${this.urlBase}/login/`, loginUsuario);
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

  updateJornada(jornada: Jornada): Observable<Jornada> {
    return this.http.put<Jornada>(`${this.urlBase}/jornada/${jornada.idJornada}`, jornada);
  }


  buscarJornadaID(idJornada: number): Observable<Jornada[]> {
    return this.http.get<Jornada[]>(`${this.urlBase}/jornada/${idJornada}`);
  }

  buscarEnderecoUsuario(idUsuario: number): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(`${this.urlBase}/endereco/${idUsuario}`);
  }

  listarEnderecos() {
    return this.http.get<Array<any>>(`${this.urlBase}/endereco/`);
  }


  listarGenerico(table: any) {
    return this.http.get<Array<any>>(`${this.urlBase}/${table}`);
  }

  buscarRegistroIDGenerico(table: any, idRegistro: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.urlBase}/${table}/${idRegistro}`);
  }
  
  criarGenerico(table: any, objeto: any) {
    return this.http.post(`${this.urlBase}/${table}/`, objeto);
  }

  updateGenerico(table: any, idRegistro: any, objeto: any): Observable<any> {
    return this.http.put<Jornada>(`${this.urlBase}/${table}/${idRegistro}`, objeto);
  }

  excluirGenerico(table: any, idRegistro: any) {
    return this.http.delete(`${this.urlBase}/${table}/${idRegistro}`);
  }

}
