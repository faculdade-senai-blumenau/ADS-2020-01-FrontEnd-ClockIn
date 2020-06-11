
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { EditarMarcacaoComponent } from './components/editar-marcacao/editar-marcacao.component';
import { EspelhoPontoComponent } from './components/espelho-ponto/espelho-ponto.component';
import { RelatoriosComponent } from './components/relatorios/relatorios.component';
import { AprovacoesPendentesComponent } from './components/aprovacoes-pendentes/aprovacoes-pendentes.component';
import { CadastrosComponent } from './components/cadastros/cadastros.component';
import { ParametroComponent } from './components/parametro/parametro.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'editarmarcacao', component: EditarMarcacaoComponent },
  { path: 'cadastros', component: CadastrosComponent },
  { path: 'espelhoponto', component: EspelhoPontoComponent },
  { path: 'relatorios', component: RelatoriosComponent },
  { path: 'aprovacoespendentes', component: AprovacoesPendentesComponent },
  { path: 'parametros', component: ParametroComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
