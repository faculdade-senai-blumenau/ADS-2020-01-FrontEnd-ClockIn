import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppService } from './app.service';
import { HeaderComponent } from './components/template/header/header.component';
import { MainContainerComponent } from './components/template/main-container/main-container.component';
import { NavComponent } from './components/template/nav/nav.component';
import { FooterComponent } from './components/template/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { HomePontoComponent } from './components/home/home-ponto/home-ponto.component';
import { HomeUsuarioComponent } from './components/home/home-usuario/home-usuario.component';
import { HomeRegistrosComponent } from './components/home/home-registros/home-registros.component';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HeaderComponent,
    FooterComponent,
    MainContainerComponent,
    HomeComponent,
    HomePontoComponent,
    HomeUsuarioComponent,
    HomeRegistrosComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [AppService],
  bootstrap: [AppComponent]
})
export class AppModule { }
