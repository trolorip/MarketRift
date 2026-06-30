import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Carrito } from './carrito';

describe('Carrito', () => {
  let component: Carrito;
  let fixture: ComponentFixture<Carrito>;
  let store: { [key: string]: string };

  beforeEach(async () => {
    store = {};

    Object.defineProperty(globalThis, 'localStorage', {
      value: {
        getItem: (key: string) => store[key] || null,
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
      imports: [Carrito],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Carrito);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe calcular correctamente el total del carrito', () => {
    component.carrito = [
      {
        id: 1,
        nombre: 'Ivern',
        precio: 100,
        imagen: 'assets/img/ivern.jpg',
        stock: 10,
        cantidad: 2
      },
      {
        id: 2,
        nombre: 'Baron',
        precio: 50,
        imagen: 'assets/img/baron.jpg',
        stock: 5,
        cantidad: 1
      }
    ];

    expect(component.total).toBe(250);
  });

});