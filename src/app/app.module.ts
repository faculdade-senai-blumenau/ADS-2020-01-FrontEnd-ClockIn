
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { HeaderComponent } from './components/template/header/header.component';
import { NavComponent } from './components/template/nav/nav.component';
import { FooterComponent } from './components/template/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { HomePontoComponent } from './components/home/home-ponto/home-ponto.component';
import { HomeUsuarioComponent } from './components/home/home-usuario/home-usuario.component';
import { HomeRegistrosComponent } from './components/home/home-registros/home-registros.component';
import { HomeRelatorioComponent } from './components/home/home-relatorio/home-relatorio.component';
import { EspelhoPontoComponent } from './components/espelho-ponto/espelho-ponto.component';
import { RelatoriosComponent } from './components/relatorios/relatorios.component';
import { AprovacoesPendentesComponent } from './components/aprovacoes-pendentes/aprovacoes-pendentes.component';
import { CadastrosComponent } from './components/cadastros/cadastros.component';
import { EditarMarcacaoComponent } from './components/editar-marcacao/editar-marcacao.component';
import { ParametroComponent } from './components/parametro/parametro.component';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    HomePontoComponent,
    HomeUsuarioComponent,
    HomeRegistrosComponent,
    HomeRelatorioComponent,
    EspelhoPontoComponent,
    RelatoriosComponent,
    AprovacoesPendentesComponent,
    CadastrosComponent,
    EditarMarcacaoComponent,
    ParametroComponent
  ],
  imports: [
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  /* providers: [AppService], */
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    { provide: AppService }],
  bootstrap: [AppComponent]
})
export class AppModule { }