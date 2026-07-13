import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { RouterLink } from '@angular/router';

import { VentaMensual } from '../../models/venta-mensual.model';
import { VentasMensualesService } from '../../services/ventas-mensuales.service';

interface Carta {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  stock: number;
}

interface Mes {
  numero: number;
  nombre: string;
}

@Component({
  selector: 'app-ventas-mensuales',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './ventas-mensuales.html',
  styleUrl: './ventas-mensuales.css'
})
export class VentasMensuales implements OnInit {

  nombreTienda: string = 'Riftbound Market';

  ventas: VentaMensual[] = [];

  cartas: Carta[] = [];

  mensaje: string = '';

  ventaEditandoId: number | null = null;

  formularioVenta: FormGroup;

  meses: Mes[] = [
    { numero: 1, nombre: 'Enero' },
    { numero: 2, nombre: 'Febrero' },
    { numero: 3, nombre: 'Marzo' },
    { numero: 4, nombre: 'Abril' },
    { numero: 5, nombre: 'Mayo' },
    { numero: 6, nombre: 'Junio' },
    { numero: 7, nombre: 'Julio' },
    { numero: 8, nombre: 'Agosto' },
    { numero: 9, nombre: 'Septiembre' },
    { numero: 10, nombre: 'Octubre' },
    { numero: 11, nombre: 'Noviembre' },
    { numero: 12, nombre: 'Diciembre' }
  ];

  menu = [
    { texto: 'Catálogo', ruta: '/catalogo' },
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

  constructor(
    private fb: FormBuilder,
    private ventasService: VentasMensualesService
  ) {
    this.formularioVenta = this.fb.group({
      mesNumero: ['', [Validators.required]],
      anio: [2026, [Validators.required, Validators.min(2020)]],
      cartaId: ['', [Validators.required]],
      unidades: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.cargarCartas();
    this.cargarVentas();
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

  cargarVentas(): void {
    this.ventasService.obtenerVentas().subscribe({
      next: ventas => {
        this.ventas = ventas.map(venta => ({
          ...venta,
          mesNumero: venta.mesNumero ?? this.obtenerNumeroMes(venta.mes)
        }));

        this.ordenarVentas();
      },
      error: error => {
        console.error('Error al leer el archivo JSON:', error);
        this.mensaje = 'No se pudieron cargar las ventas mensuales.';
      }
    });
  }

  obtenerCartaSeleccionada(): Carta | undefined {
    const cartaId = Number(this.formularioVenta.value.cartaId);

    return this.cartas.find(carta => carta.id === cartaId);
  }

  calcularTotalFormulario(): number {
    const carta = this.obtenerCartaSeleccionada();
    const unidades = Number(this.formularioVenta.value.unidades) || 0;

    if (!carta) {
      return 0;
    }

    return carta.precio * unidades;
  }

  obtenerNombreMes(numero: number): string {
    const mesEncontrado = this.meses.find(
      mes => mes.numero === Number(numero)
    );

    return mesEncontrado ? mesEncontrado.nombre : '';
  }

  obtenerNumeroMes(nombre: string): number {
    const mesEncontrado = this.meses.find(
      mes => mes.nombre.toLowerCase() === nombre.toLowerCase()
    );

    return mesEncontrado ? mesEncontrado.numero : 0;
  }

  ordenarVentas(): void {
    this.ventas.sort((a, b) => {
      if (a.anio !== b.anio) {
        return a.anio - b.anio;
      }

      return a.mesNumero - b.mesNumero;
    });
  }

  guardarVenta(): void {
    if (this.formularioVenta.invalid) {
      this.formularioVenta.markAllAsTouched();
      return;
    }

    const cartaSeleccionada = this.obtenerCartaSeleccionada();

    if (!cartaSeleccionada) {
      this.mensaje = 'Debes seleccionar una carta válida.';
      return;
    }

    const datos = this.formularioVenta.value;

    const mesNumero = Number(datos.mesNumero);

    const venta: VentaMensual = {
      id: this.ventaEditandoId === null ? Date.now() : this.ventaEditandoId,
      cartaId: cartaSeleccionada.id,
      mes: this.obtenerNombreMes(mesNumero),
      mesNumero: mesNumero,
      anio: Number(datos.anio),
      producto: cartaSeleccionada.nombre,
      categoria: cartaSeleccionada.descripcion,
      unidades: Number(datos.unidades),
      total: cartaSeleccionada.precio * Number(datos.unidades)
    };

    if (this.ventaEditandoId === null) {
      this.ventas.push(venta);
      this.mensaje = 'Venta mensual agregada correctamente.';
    } else {
      const indice = this.ventas.findIndex(
        ventaActual => ventaActual.id === this.ventaEditandoId
      );

      if (indice !== -1) {
        this.ventas[indice] = venta;
        this.mensaje = 'Venta mensual actualizada correctamente.';
      }
    }

    this.ordenarVentas();
    this.ventasService.guardarVentas(this.ventas);
    this.limpiarFormulario();
  }

  editarVenta(venta: VentaMensual): void {
    this.ventaEditandoId = venta.id;

    let cartaId = venta.cartaId;

    if (!cartaId) {
      const cartaEncontrada = this.cartas.find(
        carta => carta.nombre === venta.producto
      );

      cartaId = cartaEncontrada?.id;
    }

    this.formularioVenta.patchValue({
      mesNumero: venta.mesNumero ?? this.obtenerNumeroMes(venta.mes),
      anio: venta.anio,
      cartaId: cartaId || '',
      unidades: venta.unidades
    });

    this.mensaje = 'Editando venta mensual de ' + venta.mes + '.';
  }

  eliminarVenta(id: number): void {
    this.ventas = this.ventas.filter(
      venta => venta.id !== id
    );

    this.ordenarVentas();
    this.ventasService.guardarVentas(this.ventas);

    this.mensaje = 'Venta mensual eliminada correctamente.';

    if (this.ventaEditandoId === id) {
      this.limpiarFormulario();
    }
  }

  limpiarFormulario(): void {
    this.ventaEditandoId = null;

    this.formularioVenta.reset({
      mesNumero: '',
      anio: 2026,
      cartaId: '',
      unidades: 1
    });
  }

  recargarDesdeJson(): void {
    this.ventasService.limpiarDatosLocales();

    this.ventasService.obtenerVentas().subscribe({
      next: ventas => {
        this.ventas = ventas.map(venta => ({
          ...venta,
          mesNumero: venta.mesNumero ?? this.obtenerNumeroMes(venta.mes)
        }));

        this.ordenarVentas();

        this.mensaje = 'Datos recargados desde el archivo JSON.';
      },
      error: error => {
        console.error('Error al recargar JSON:', error);
        this.mensaje = 'No se pudieron recargar los datos desde el JSON.';
      }
    });
  }

  get totalGeneral(): number {
    return this.ventas.reduce(
      (acumulado, venta) => acumulado + Number(venta.total),
      0
    );
  }

  get unidadesTotales(): number {
    return this.ventas.reduce(
      (acumulado, venta) => acumulado + Number(venta.unidades),
      0
    );
  }

  campoInvalido(campo: string): boolean {
    const control = this.formularioVenta.get(campo);

    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched)
    );
  }
}