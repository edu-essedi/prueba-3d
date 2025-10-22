import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HabitacionComponent } from './components/habitacion/habitacion.component'
import { AppComponent } from './app.component';
import { ControlesComponent } from './controles/controles.component';

@NgModule({
  declarations: [
    AppComponent,
    HabitacionComponent,
    ControlesComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
