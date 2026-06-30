import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recuperar',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './recuperar.html',
  styleUrl: './recuperar.css'
})
export class Recuperar {

  correo: string = '';

  mostrarMensaje: boolean = false;

  mensajeRecuperacion: string = '';

  recuperar(): void {

    const datosRecuperacion = {
      correo: this.correo
    };

    console.log('Solicitud de recuperación:', datosRecuperacion);

    this.mensajeRecuperacion =
      'Se ha enviado una solicitud de recuperación para el correo: ' + this.correo;

    this.mostrarMensaje = true;

  }

}