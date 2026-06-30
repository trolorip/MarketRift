import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Catalogo } from './catalogo';

describe('Catalogo', () => {
  let component: Catalogo;
  let fixture: ComponentFixture<Catalogo>;

  let store: { [key: string]: string } = {};

  beforeEach(async () => {
    store = {};

    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: (key: string) => {
          return store[key] || null;
        },
        setItem: (key: string, value: string) => {
          store[key] = value;
        },
        removeItem: (key: string) => {
          delete store[key];
        },
        clear: () => {
          store = {};
        }
      },
      writable: true,
      configurable: true
    });

    await TestBed.configureTestingModule({
      imports: [Catalogo],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Catalogo);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe agregar una carta al carrito', () => {
    const carta = {
      id: 1,
      nombre: 'Ivern',
      descripcion: 'Unleashed Showcase',
      precio: 289.97,
      imagen: 'assets/img/ivern.jpg',
      stock: 10
    };

    component.agregarAlCarrito(carta);

    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    expect(carrito.length).toBe(1);
    expect(carrito[0].nombre).toBe('Ivern');
    expect(carrito[0].cantidad).toBe(1);
  });

});