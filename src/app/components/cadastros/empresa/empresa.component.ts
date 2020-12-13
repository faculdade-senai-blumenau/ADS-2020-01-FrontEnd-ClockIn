import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';

@Component({
  selector: 'app-empresa',
  templateUrl: './empresa.component.html',
  styleUrls: ['./empresa.component.css']
})
export class EmpresaComponent implements OnInit {

  /* Variaveis */
  public alerta = new Subject<string>();
  staticAlertClosed = true;

  /* Mensagens */
  mensagem = '';
  mensagemSucesso = '';
  mensagemErro = '';
  clockHandle;
  empresa: any;
  empresas: any;
  setoresCombo: any[];
  cargosCombo: any[];
  jornadasCombo: any[];
  enderecoCorreio: any;

  /* Variaveis Fim */

  constructor(private appService: AppService) { }

  ngOnInit(): void {

    $(function () {
      // Datatables basic
      $('#datatables-empresa').DataTable({
        responsive: true,
        language: {
          emptyTable: "Nenhum registro encontrado",
          info: "Exibindo _START_ a _END_ de _TOTAL_ registros",
          infoEmpty: "Exibindo 0 a 0 de 0 registros",
          infoFiltered: "(Filtrado do total de _MAX_ registros)",
          lengthMenu: "Listar _MENU_ Registros",
          loadingRecords: "Carregando...",
          processing: "Processando...",
          search: "Procurar:",
          zeroRecords: "Nenhum registro encontrado",
          paginate: {
            first: "Primeira",
            last: "Última",
            next: "Próxima",
            previous: "Anterior"
          }
        }
      });
    });

    this.clockHandle = setInterval(() => {
      /* Remove o alerta após o tempo determinado (milisegundos) */
      this.alerta.pipe(debounceTime(5000)).subscribe(() => {
        this.mensagem = '', this.mensagemErro = '', this.mensagemSucesso = ''
      });
    }, 1000);

    this.listarEmpresas();

    this.empresa = {
      idEmpresa: '',
      nomeEmpresa: '',
      cnpj: '',
      logo: '',
      cep: '',
      rua: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: ''
    };
  }

  listarEmpresas() {
    this.appService.listarGenerico('empresa').subscribe((empresas) => {
      this.empresas = empresas;
    })
  }

  buscarEnderecoPeloCep(cep: string) {
    this.appService.consultaCepCorreios(cep).subscribe((enderecoCorreio) => {
      this.empresa.rua = enderecoCorreio.logradouro;
      this.empresa.bairro = enderecoCorreio.bairro;
      this.empresa.cidade = enderecoCorreio.localidade;
      this.empresa.estado = enderecoCorreio.uf;
      $("#numero").focus();
    })
  }

  buscarEmpresaPeloID(idEmpresa: number) {
    this.appService.buscarPorIDGenerico('empresa', idEmpresa).subscribe(
      resposta => this.empresa = resposta);
  }


  cadastrarEditarEmpresa() {
    this.appService.criarGenerico('empresa', this.empresa).subscribe(
      success => {
        this.listarEmpresas();
        this.alerta.next(this.mensagemSucesso = (`Registro salvo com Sucesso.`));
      },
      error => {
        this.alerta.next(this.mensagemErro = 'Não foi possível salvar o registro.');
      }
    );
  }


  excluirEmpresa(idEmpresa: number) {
    this.appService.excluirGenerico('empresa', idEmpresa).subscribe(
      success => {
        this.listarEmpresas();
        this.alerta.next(this.mensagemSucesso = (`Empresa excluída com sucesso`));
      },
      error => {
        this.alerta.next(this.mensagemErro = ('Não foi possível excluir a empresa selecionada.'));
      }
    );
  }
  
  alterarImagem(imagem:any){
    let reader=new FileReader();
    reader.readAsDataURL(imagem[0]);
    
    reader.onload =  (e) => {
     this.empresa.logo=reader.result;
      
      
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  limparObjetoEmpresa() {
    this.empresa = {};
  }
}
