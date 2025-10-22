import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-controles',
  templateUrl: './controles.component.html',
  styleUrls: ['./controles.component.css']
})
export class ControlesComponent {

  @Output() cambioPatas = new EventEmitter<string>();

  cambiarPatas(nombreModelo: string){
    this.cambioPatas.emit(nombreModelo)
  }

  @Output() cambioTextura = new EventEmitter<string>();

  cambiarTextura(nombreTextura: string){
    this.cambioTextura.emit(nombreTextura)
  }
}
