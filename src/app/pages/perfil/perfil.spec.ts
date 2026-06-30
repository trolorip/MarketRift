import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Perfil } from './perfil';

describe('Perfil', () => {
  let component: Perfil;
  let fixture: ComponentFixture<Perfil>;
  let store: { [key: string]: string };

  beforeEach(async () => {
    store = {
      sesion: JSON.stringify({
        nombre: 'Cliente Test',
        usuario: 'cliente123',
        correo: 'cliente@test.cl',
        rol: 'cliente'
      })
    };

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
      imports: [Perfil],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(Perfil);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});