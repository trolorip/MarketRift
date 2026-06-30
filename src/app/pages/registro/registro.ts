import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

interface Usuario {
  nombre: string;
  usuario: string;
  correo: string;
  password: string;
  rol: 'cliente';
}

function passwordSegura(control: AbstractControl): ValidationErrors | null {
  const password = control.value || '';

  const tieneMayuscula = /[A-Z]/.test(password);
  const tieneMinuscula = /[a-z]/.test(password);
  const tieneNumero = /\d/.test(password);
  const tieneEspecial = /[\W_]/.test(password);

  if (
    tieneMayuscula &&
    tieneMinuscula &&
    tieneNumero &&
    tieneEspecial
  ) {
    return null;
  }

  return { passwordSegura: true };
}

function passwordsCoinciden(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmarPassword = control.get('confirmarPassword')?.value;

  if (password === confirmarPassword) {
    return null;
  }

  return { passwordsNoCoinciden: true };
}

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class Registro {

  formulario: FormGroup;

  rolNuevoUsuario: string = 'cliente';

  mostrarMensaje: boolean = false;

  requisitosPassword: string[] = [
    'Entre 8 y 16 caracteres.',
    'Al menos una mayúscula.',
    'Al menos una minúscula.',
    'Al menos un número.',
    'Al menos un carácter especial.'
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formulario = this.fb.group(
      {
        nombre: ['', [Validators.required]],
        usuario: ['', [Validators.required]],
        correo: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16),
            passwordSegura
          ]
        ],
        confirmarPassword: ['', [Validators.required]]
      },
      {
        validators: passwordsCoinciden
      }
    );
  }

  registrar(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const usuarios: Usuario[] = JSON.parse(
      localStorage.getItem('usuarios') || '[]'
    );

    const nuevoUsuario: Usuario = {
      nombre: this.formulario.value.nombre || '',
      usuario: this.formulario.value.usuario || '',
      correo: this.formulario.value.correo?.trim().toLowerCase() || '',
      password: this.formulario.value.password || '',
      rol: 'cliente'
    };

    const correoExiste = usuarios.some(
      usuario => usuario.correo === nuevoUsuario.correo
    );

    if (correoExiste) {
      this.formulario.get('correo')?.setErrors({ duplicado: true });
      return;
    }

    const usuarioExiste = usuarios.some(
      usuario =>
        usuario.usuario.toLowerCase() === nuevoUsuario.usuario.toLowerCase()
    );

    if (usuarioExiste) {
      this.formulario.get('usuario')?.setErrors({ duplicado: true });
      return;
    }

    usuarios.push(nuevoUsuario);

    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    this.mostrarMensaje = true;

    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 1000);
  }

  campoInvalido(campo: string): boolean {
    const control = this.formulario.get(campo);

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

  passwordsNoCoinciden(): boolean {
    return !!(
      this.formulario.errors?.['passwordsNoCoinciden'] &&
      this.formulario.get('confirmarPassword')?.touched
    );
  }

}