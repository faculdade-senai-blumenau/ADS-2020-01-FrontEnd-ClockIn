import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, from } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Pessoa } from '../models/pessoa';
@Injectable({
  providedIn: 'root'
})
export class PessoaService {

 

  // injetando o HttpClient
  constructor(private httpClient: HttpClient) {console.log("das456d54asd456as546das"); }
  
  // Headers
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  }
  url:"http://localhost:3000/pessoa"; // api rest fake
   // Obtem todos os carros
   getPessoas(): Observable<Pessoa[]> {
    console.log("11aaaassdsdasdasdasa");
    return this.httpClient.get<Pessoa[]>("http://localhost:3000/pessoa")
      .pipe(
        retry(2),
        catchError(this.handleError))
  }

  savePessoa(pessoa: Pessoa): Observable<Pessoa> {
    return this.httpClient.post<Pessoa>("http://localhost:3000/pessoa", JSON.stringify(pessoa), this.httpOptions)
      .pipe(
        retry(2),
        catchError(this.handleError)
      )
  }

  updateCar(pessoa: Pessoa): Observable<Pessoa> {
    return this.httpClient.put<Pessoa>(this.url + '/' + pessoa.Id, JSON.stringify(pessoa), this.httpOptions)
      .pipe(
        retry(1),
        catchError(this.handleError)
      )
  }

  
  handleError(error: HttpErrorResponse) {
    console.log(this.url);
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Erro ocorreu no lado 0 client
      errorMessage = error.error.message;
    } else {
      // Erro ocorreu no lado do servidor
      //errorMessage = `Código do erro: ${error.status}, ` + `menssagem: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  };
}
