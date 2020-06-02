import { Component, OnInit } from '@angular/core';
import { PessoaService } from '../services/pessoa.service';
import { Pessoa } from "../models/Pessoa";
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-teste-componente',
  templateUrl: './teste-componente.component.html',
  styleUrls: ['./teste-componente.component.css']
})
export class TesteComponenteComponent implements OnInit {

  pessoa = {} as Pessoa;
  pessoas: Pessoa[];

  constructor(private pessoaServer: PessoaService) { }

  ngOnInit(): void {
    this.getPessoa();
    console.log("11aaaaa");
  }

  savePessoa(form: NgForm) {
    if (this.pessoa.Id !== undefined) {
      this.pessoaServer.updateCar(this.pessoa).subscribe(() => {
        this.cleanForm(form);
      });
    } else {
      this.pessoaServer.savePessoa(this.pessoa).subscribe(() => {
        this.cleanForm(form);
      });
    }
  }

  getPessoa() {
    console.log("21aaaaa");
    this.pessoaServer.getPessoas().subscribe((pessoas: Pessoa[]) => {
      this.pessoas = pessoas;
    });
    console.log("31aaaaa");
  }

  cleanForm(form: NgForm) {
    this.getPessoa();
    form.resetForm();
    this.pessoa = {} as Pessoa;
  }
}
