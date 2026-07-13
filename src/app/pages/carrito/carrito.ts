import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ItemCarrito {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen: string;
  stock: number;
  cantidad: number;
}

interface Carta {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;
}

interface UsuarioSesion {
  nombre: string;
  usuario: string;
  correo: string;
  rol: 'admin' | 'cliente';
}

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class Carrito implements OnInit {
  sesionActual: UsuarioSesion | null = null;
  nombreTienda: string = 'Riftbound Marketplace';

  carrito: ItemCarrito[] = [];

  mensaje: string = '';

  menu = [
    { texto: 'Catálogo', ruta: '/catalogo' },
    { texto: 'Carrito', ruta: '/carrito' },
    { texto: 'Perfil', ruta: '/perfil' }
  ];

  ngOnInit(): void {
  this.cargarSesion();
  this.cargarMenu();
  this.cargarCarrito();
}

  cargarCarrito(): void {
    this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  }

  
  get total(): number {
    return this.carrito.reduce(
      (acumulado, item) => acumulado + item.precio * item.cantidad,
      0
    );
  }

  eliminarCarta(index: number): void {
    this.carrito.splice(index, 1);
    this.guardarCarrito();

    this.mensaje = 'Carta eliminada del carrito.';
  }

  aumentarCantidad(item: ItemCarrito): void {
    if (item.cantidad >= item.stock) {
      this.mensaje = 'No puedes agregar más unidades. Stock máximo alcanzado.';
      return;
    }

    item.cantidad++;
    this.guardarCarrito();

    this.mensaje = '';
  }

  disminuirCantidad(item: ItemCarrito): void {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.guardarCarrito();
    }
  }

  vaciarCarrito(): void {
    this.carrito = [];
    localStorage.removeItem('carrito');

    this.mensaje = 'El carrito fue vaciado.';
  }

  finalizarCompra(): void {
    if (this.carrito.length === 0) {
      this.mensaje = 'No hay cartas en el carrito.';
      return;
    }

    const sesion = JSON.parse(localStorage.getItem('sesion') || '{}');

    const compra = {
      id: Date.now(),
      usuario: sesion.nombre || 'Cliente Riftbound',
      correo: sesion.correo || 'correo no registrado',
      fecha: new Date().toLocaleString('es-CL'),
      total: this.total,
      cartas: this.carrito
    };

    const compras = JSON.parse(localStorage.getItem('compras') || '[]');

    compras.push(compra);

    localStorage.setItem('compras', JSON.stringify(compras));

    this.descontarStock();

    this.carrito = [];
    localStorage.removeItem('carrito');

    this.mensaje = 'Compra realizada exitosamente. Esta compra es una simulación.';
  }

  descontarStock(): void {
    const cartas: Carta[] = JSON.parse(localStorage.getItem('cartas') || '[]');

    this.carrito.forEach(itemCarrito => {
      const cartaEncontrada = cartas.find(
        carta => carta.id === itemCarrito.id
      );

      if (cartaEncontrada) {
        cartaEncontrada.stock = cartaEncontrada.stock - itemCarrito.cantidad;

        if (cartaEncontrada.stock < 0) {
          cartaEncontrada.stock = 0;
        }
      }
    });

    localStorage.setItem('cartas', JSON.stringify(cartas));
  }

  private guardarCarrito(): void {
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
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

}