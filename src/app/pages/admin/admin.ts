import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface Usuario {
  nombre: string;
  correo: string;
  rol: 'admin' | 'cliente';
}

interface Carta {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;
  cantidad?: number;
}

interface Compra {
  id: number;
  usuario?: string;
  correo?: string;
  fecha: string;
  total: number;
  cartas: Carta[];
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class Admin implements OnInit {

  nombreTienda: string = 'Riftbound Admin';

  mensajeAdmin: string = 'Hola, Administrador. Estás revisando información como administrador.';

  mensaje: string = '';

  formularioCarta: FormGroup;

  cartaEditandoId: number | null = null;

  usuarios: Usuario[] = [];

  compras: Compra[] = [];

  cartas: Carta[] = [];

  menu = [
    { texto: 'Catálogo', ruta: '/catalogo' },
    { texto: 'Carrito', ruta: '/carrito' },
    { texto: 'Perfil', ruta: '/perfil' },
    { texto: 'Admin', ruta: '/admin' },
    { texto: 'Ventas', ruta: '/ventas-mensuales' }
  ];

  cartasIniciales: Carta[] = [
    {
      id: 1,
      nombre: 'Ivern',
      descripcion: 'Unleashed Showcase',
      precio: 289.97,
      imagen: 'assets/img/ivern.jpg',
      stock: 10
    },
    {
      id: 2,
      nombre: 'Baron',
      descripcion: 'Ultimate',
      precio: 1255.99,
      imagen: 'assets/img/baron.jpg',
      stock: 5
    },
    {
      id: 3,
      nombre: 'Lee Sin',
      descripcion: 'Origins Showcase',
      precio: 2.09,
      imagen: 'assets/img/leesin.jpg',
      stock: 20
    }
  ];

  constructor(private fb: FormBuilder) {
    this.formularioCarta = this.fb.group({
      nombre: ['', [Validators.required]],
      precio: [0, [Validators.required, Validators.min(1)]],
      descripcion: ['', [Validators.required]],
      imagen: ['', [Validators.required]],
      stock: [1, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarCompras();
    this.cargarCartas();
  }

  cargarUsuarios(): void {
    const usuariosGuardados = localStorage.getItem('usuarios');

    if (usuariosGuardados) {
      this.usuarios = JSON.parse(usuariosGuardados);
    } else {
      this.usuarios = [
        {
          nombre: 'Administrador',
          correo: 'admin@riftboundmarket.cl',
          rol: 'admin'
        },
        {
          nombre: 'Cliente Demo',
          correo: 'cliente@riftboundmarket.cl',
          rol: 'cliente'
        }
      ];

      localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
    }
  }

  cargarCompras(): void {
    this.compras = JSON.parse(localStorage.getItem('compras') || '[]');
  }

  cargarCartas(): void {
    const cartasGuardadas = localStorage.getItem('cartas');

    if (cartasGuardadas) {
      this.cartas = JSON.parse(cartasGuardadas);
    } else {
      this.cartas = this.cartasIniciales;
      this.guardarCartas();
    }
  }

  guardarCartas(): void {
    localStorage.setItem('cartas', JSON.stringify(this.cartas));
  }

  guardarCarta(): void {
    if (this.formularioCarta.invalid) {
      this.formularioCarta.markAllAsTouched();
      return;
    }

    const datos = this.formularioCarta.value;

    if (this.cartaEditandoId === null) {
      const nuevaCarta: Carta = {
        id: Date.now(),
        nombre: datos.nombre,
        precio: Number(datos.precio),
        descripcion: datos.descripcion,
        imagen: datos.imagen,
        stock: Number(datos.stock)
      };

      this.cartas.push(nuevaCarta);
      this.mensaje = 'Carta agregada correctamente.';
    } else {
      const indice = this.cartas.findIndex(
        carta => carta.id === this.cartaEditandoId
      );

      if (indice !== -1) {
        this.cartas[indice] = {
          id: this.cartaEditandoId,
          nombre: datos.nombre,
          precio: Number(datos.precio),
          descripcion: datos.descripcion,
          imagen: datos.imagen,
          stock: Number(datos.stock)
        };

        this.mensaje = 'Carta actualizada correctamente.';
      }
    }

    this.guardarCartas();
    this.limpiarFormulario();
  }

  editarCarta(carta: Carta): void {
    this.cartaEditandoId = carta.id;

    this.formularioCarta.patchValue({
      nombre: carta.nombre,
      precio: carta.precio,
      descripcion: carta.descripcion,
      imagen: carta.imagen,
      stock: carta.stock
    });

    this.mensaje = 'Editando carta: ' + carta.nombre;
  }

  eliminarCarta(id: number): void {
    this.cartas = this.cartas.filter(
      carta => carta.id !== id
    );

    this.guardarCartas();

    this.mensaje = 'Carta eliminada correctamente.';

    if (this.cartaEditandoId === id) {
      this.limpiarFormulario();
    }
  }

  limpiarFormulario(): void {
    this.cartaEditandoId = null;

    this.formularioCarta.reset({
      nombre: '',
      precio: 0,
      descripcion: '',
      imagen: '',
      stock: 1
    });
  }

  eliminarUsuario(correo: string): void {
    this.usuarios = this.usuarios.filter(
      usuario => usuario.correo !== correo
    );

    localStorage.setItem('usuarios', JSON.stringify(this.usuarios));

    this.mensaje = 'Usuario eliminado correctamente.';
  }

  campoInvalido(campo: string): boolean {
    const control = this.formularioCarta.get(campo);

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }

}