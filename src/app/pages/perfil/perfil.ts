import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface Usuario {
  nombre: string;
  usuario: string;
  correo: string;
  password?: string;
  rol: 'admin' | 'cliente';
}

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class Perfil implements OnInit {

  nombreTienda: string = 'Riftbound Marketplace';

  formularioPerfil: FormGroup;

  mensaje: string = '';

  sesionActual: Usuario | null = null;

  menu = [
    { texto: 'Catálogo', ruta: '/catalogo' },
    { texto: 'Carrito', ruta: '/carrito' },
    { texto: 'Perfil', ruta: '/perfil' }
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formularioPerfil = this.fb.group({
      nombre: ['', [Validators.required]],
      usuario: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    const sesionGuardada = localStorage.getItem('sesion');

    if (!sesionGuardada) {
      this.router.navigate(['/login']);
      return;
    }

    this.sesionActual = JSON.parse(sesionGuardada);

    this.formularioPerfil.patchValue({
      nombre: this.sesionActual?.nombre,
      usuario: this.sesionActual?.usuario,
      correo: this.sesionActual?.correo
    });
  }

  guardarPerfil(): void {
    if (this.formularioPerfil.invalid) {
      this.formularioPerfil.markAllAsTouched();
      return;
    }

    if (!this.sesionActual) {
      return;
    }

    const usuarios: Usuario[] = JSON.parse(localStorage.getItem('usuarios') || '[]');

    const indice = usuarios.findIndex(
      usuario => usuario.correo === this.sesionActual?.correo
    );

    const perfilActualizado: Usuario = {
      ...this.sesionActual,
      nombre: this.formularioPerfil.value.nombre,
      usuario: this.formularioPerfil.value.usuario,
      correo: this.formularioPerfil.value.correo
    };

    if (indice !== -1) {
      usuarios[indice] = perfilActualizado;
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }

    localStorage.setItem('sesion', JSON.stringify(perfilActualizado));

    this.sesionActual = perfilActualizado;

    this.mensaje = 'Perfil actualizado correctamente.';
  }

  campoInvalido(campo: string): boolean {
    const control = this.formularioPerfil.get(campo);

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

}