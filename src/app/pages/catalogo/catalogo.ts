import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

interface Carta {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;
}

interface ItemCarrito extends Carta {
  cantidad: number;
}

interface UsuarioSesion {
  nombre: string;
  usuario: string;
  correo: string;
  rol: 'admin' | 'cliente';
}

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css'
})
export class Catalogo implements OnInit {

  nombreTienda: string = 'Riftbound Market';

  mensaje: string = '';

  sesionActual: UsuarioSesion | null = null;

  menu = [
    { texto: 'Catálogo', ruta: '/catalogo' },
    { texto: 'Carrito', ruta: '/carrito' },
    { texto: 'Perfil', ruta: '/perfil' }
  ];

  cartas: Carta[] = [];

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

  ngOnInit(): void {
    this.cargarSesion();
    this.cargarMenu();
    this.cargarCartas();
  }

  cargarSesion(): void {
    const sesionGuardada = localStorage.getItem('sesion');

    if (sesionGuardada) {
      this.sesionActual = JSON.parse(sesionGuardada);
    }
  }

  cargarMenu(): void {
    if (this.esAdmin()) {
      this.menu = [
        { texto: 'Catálogo', ruta: '/catalogo' },
        { texto: 'Perfil', ruta: '/perfil' },
        { texto: 'Admin', ruta: '/admin' },
        { texto: 'Ventas', ruta: '/ventas-mensuales' }
      ];
    } else {
      this.menu = [
        { texto: 'Catálogo', ruta: '/catalogo' },
        { texto: 'Carrito', ruta: '/carrito' },
        { texto: 'Perfil', ruta: '/perfil' }
      ];
    }
  }

  esAdmin(): boolean {
    return this.sesionActual?.rol === 'admin';
  }

  cargarCartas(): void {
    const cartasGuardadas = localStorage.getItem('cartas');

    if (cartasGuardadas) {
      this.cartas = JSON.parse(cartasGuardadas);

      this.cartas = this.cartas.map(carta => ({
        ...carta,
        stock: carta.stock ?? 0
      }));
    } else {
      this.cartas = this.cartasIniciales;
      localStorage.setItem('cartas', JSON.stringify(this.cartas));
    }
  }

  agregarAlCarrito(carta: Carta): void {
    this.mensaje = '';

    if (this.esAdmin()) {
      this.mensaje = 'El administrador solo puede revisar el catálogo, no realizar compras.';
      return;
    }

    if (carta.stock <= 0) {
      this.mensaje = carta.nombre + ' no tiene stock disponible.';
      return;
    }

    const carrito: ItemCarrito[] = JSON.parse(
      localStorage.getItem('carrito') || '[]'
    );

    const itemExistente = carrito.find(
      item => item.id === carta.id
    );

    if (itemExistente) {
      if (itemExistente.cantidad >= carta.stock) {
        this.mensaje = 'No puedes agregar más unidades de ' + carta.nombre + '. Stock máximo alcanzado.';
        return;
      }

      itemExistente.cantidad++;
    } else {
      carrito.push({
        ...carta,
        cantidad: 1
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

    this.mensaje = carta.nombre + ' agregado al carrito.';
  }
}