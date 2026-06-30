import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface Usuario {
  nombre: string;
  usuario: string;
  correo: string;
  password: string;
  rol: 'admin' | 'cliente';
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  cuentaAdmin = {
    correo: 'admin@riftboundmarket.cl',
    password: 'Admin123*'
  };

  error: string = '';

  formulario: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formulario = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  login(): void {
    this.error = '';

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const correo = this.formulario.value.correo.trim().toLowerCase();
    const password = this.formulario.value.password;

    if (
      correo === this.cuentaAdmin.correo &&
      password === this.cuentaAdmin.password
    ) {
      localStorage.setItem('sesion', JSON.stringify({
        nombre: 'Administrador',
        usuario: 'admin',
        correo: this.cuentaAdmin.correo,
        rol: 'admin'
      }));

      this.router.navigate(['/admin']);
      return;
    }

    const usuarios: Usuario[] = JSON.parse(
      localStorage.getItem('usuarios') || '[]'
    );

    const usuarioEncontrado = usuarios.find(
      usuario =>
        usuario.correo === correo &&
        usuario.password === password
    );

    if (!usuarioEncontrado) {
      this.error = 'Correo o contraseña incorrectos.';
      return;
    }

    localStorage.setItem('sesion', JSON.stringify(usuarioEncontrado));

    this.router.navigate(['/catalogo']);
  }

  campoInvalido(campo: string): boolean {
    const control = this.formulario.get(campo);

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

}