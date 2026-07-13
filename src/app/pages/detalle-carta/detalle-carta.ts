import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

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
  selector: 'app-detalle-carta',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-carta.html',
  styleUrl: './detalle-carta.css'
})
export class DetalleCarta implements OnInit {

  carta: Carta | undefined;

  mensaje: string = '';

  sesionActual: UsuarioSesion | null = null;

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

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.cargarSesion();
    this.cargarCarta();
  }

  cargarSesion(): void {
    const sesionGuardada = localStorage.getItem('sesion');

    if (sesionGuardada) {
      this.sesionActual = JSON.parse(sesionGuardada);
    }
  }

  esAdmin(): boolean {
    return this.sesionActual?.rol === 'admin';
  }

  cargarCarta(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    let cartas: Carta[] = JSON.parse(localStorage.getItem('cartas') || '[]');

    if (cartas.length === 0) {
      cartas = this.cartasIniciales;
      localStorage.setItem('cartas', JSON.stringify(cartas));
    }

    cartas = cartas.map(carta => ({
      ...carta,
      stock: carta.stock ?? 0
    }));

    this.carta = cartas.find(carta => carta.id === id);
  }

  agregarAlCarrito(): void {
    this.mensaje = '';

    if (!this.carta) {
      return;
    }

    if (this.esAdmin()) {
      this.mensaje = 'El administrador solo puede revisar el detalle, no realizar compras.';
      return;
    }

    if (this.carta.stock <= 0) {
      this.mensaje = this.carta.nombre + ' no tiene stock disponible.';
      return;
    }

    const carrito: ItemCarrito[] = JSON.parse(
      localStorage.getItem('carrito') || '[]'
    );

    const itemExistente = carrito.find(
      item => item.id === this.carta?.id
    );

    if (itemExistente) {
      if (itemExistente.cantidad >= this.carta.stock) {
        this.mensaje = 'No puedes agregar más unidades de ' + this.carta.nombre + '. Stock máximo alcanzado.';
        return;
      }

      itemExistente.cantidad++;
    } else {
      carrito.push({
        ...this.carta,
        cantidad: 1
      });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));

    this.mensaje = this.carta.nombre + ' agregado al carrito.';
  }
}