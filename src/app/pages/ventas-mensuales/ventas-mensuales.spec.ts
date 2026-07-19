import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { VentasMensuales } from './ventas-mensuales';
import { VentasMensualesService } from '../../services/ventas-mensuales.service';

describe('VentasMensuales', () => {
  let component: VentasMensuales;
  let fixture: ComponentFixture<VentasMensuales>;

  let store: { [key: string]: string } = {};

  const ventasServiceMock = {
    obtenerVentas: () => of([
      {
        id: 1,
        cartaId: 1,
        mes: 'Enero',
        mesNumero: 1,
        anio: 2026,
        producto: 'Ivern',
        categoria: 'Unleashed Showcase',
        unidades: 4,
        total: 1159.88
      }
    ]),
    guardarVentas: () => {},
    limpiarDatosLocales: () => {}
  };

  beforeEach(async () => {
    store = {
      cartas: JSON.stringify([
        {
          id: 1,
          nombre: 'Ivern',
          descripcion: 'Unleashed Showcase',
          precio: 289.97,
          imagen: 'assets/img/ivern.jpg',
          stock: 10
        }
      ])
    };

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
      imports: [VentasMensuales],
      providers: [
        provideRouter([]),
        {
          provide: VentasMensualesService,
          useValue: ventasServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(VentasMensuales);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});