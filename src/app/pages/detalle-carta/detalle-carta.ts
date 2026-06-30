import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

interface Carta {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

interface ItemCarrito extends Carta {
  cantidad: number;
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

  cartasIniciales: Carta[] = [
    {
      id: 1,
      nombre: 'Ivern',
      descripcion: 'Unleashed Showcase',
      precio: 289.97,
      imagen: 'assets/img/ivern.jpg'
    },
    {
      id: 2,
      nombre: 'Baron',
      descripcion: 'Ultimate',
      precio: 1255.99,
      imagen: 'assets/img/baron.jpg'
    },
    {
      id: 3,
      nombre: 'Lee Sin',
      descripcion: 'Origins Showcase',
      precio: 2.09,
      imagen: 'assets/img/leesin.jpg'
    }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    let cartas: Carta[] = JSON.parse(localStorage.getItem('cartas') || '[]');

    if (cartas.length === 0) {
      cartas = this.cartasIniciales;
      localStorage.setItem('cartas', JSON.stringify(cartas));
    }

    this.carta = cartas.find(carta => carta.id === id);
  }

  agregarAlCarrito(): void {
    if (!this.carta) {
      return;
    }

    const carrito: ItemCarrito[] = JSON.parse(
      localStorage.getItem('carrito') || '[]'
    );

    const itemExistente = carrito.find(
      item => item.id === this.carta?.id
    );

    if (itemExistente) {
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