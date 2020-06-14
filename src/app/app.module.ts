
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';


import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { NavComponent } from './components/template/nav/nav.component';
import { FooterComponent } from './components/template/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { RelatoriosComponent } from './components/relatorios/relatorios.component';
import { AprovacoesPendentesComponent } from './components/aprovacoes-pendentes/aprovacoes-pendentes.component';
import { CadastrosComponent } from './components/cadastros/cadastros.component';
import { EditarMarcacaoComponent } from './components/editar-marcacao/editar-marcacao.component';
import { ParametroComponent } from './components/parametro/parametro.component';
import { LoaderComponent } from './components/template/img/loader/loader.component';
import { PagenotfoundComponent } from './components/pagenotfound/pagenotfound.component';
import { EspelhoPontoComponent } from './components/espelho-ponto/espelho-ponto.component';


@NgModule({
  declarations: [AppComponent, NavComponent, FooterComponent, HomeComponent, RelatoriosComponent,
    AprovacoesPendentesComponent, CadastrosComponent, EspelhoPontoComponent, EditarMarcacaoComponent,
    ParametroComponent, LoaderComponent, PagenotfoundComponent],

  imports: [ RouterModule, BrowserModule, AppRoutingModule, HttpClientModule, ReactiveFormsModule ],
  
  providers: [
             { provide: APP_BASE_HREF, useValue: '/' },
             { provide: AppService }],
    schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
    
  bootstrap: [AppComponent]
})
export class AppModule { }