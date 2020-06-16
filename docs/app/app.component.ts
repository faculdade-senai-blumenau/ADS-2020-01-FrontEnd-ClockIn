import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  contatos: Array<any>;
  formulario: FormGroup;

  constructor(private service: AppService,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.configurarFormulario();
    this.service.listar()
      .subscribe(resposta => this.contatos = resposta);
  }

  configurarFormulario() {
    this.formulario = this.formBuilder.group({
      name: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      phone: [null, Validators.required]
    });
  }

  criar() {
    this.service.criar(this.formulario.value).subscribe(resposta => {
      this.contatos.push(resposta);

      this.formulario.reset();
    });
  }
}
