import { Component, OnInit } from '@angular/core';
import { EditarMarcacaoService } from './editarmarcacao.service';
import { RegistroPonto } from '../home/home.model';

@Component({
  selector: 'app-editarmarcacao',
  templateUrl: './editarmarcacao.component.html',
  styleUrls: ['./editarmarcacao.component.css']
})
export class EditarMarcacaoComponent implements OnInit {

  constructor(
    private editarMarcacaoService: EditarMarcacaoService) {

  }
  registroPonto: RegistroPonto;
  ngOnInit(): void {
    /* Retorna lista de registros da tabela de pontos */
    this.editarMarcacaoService.buscarRegistrosPonto().subscribe(
      resposta => this.registroPonto = resposta);
  }

}
