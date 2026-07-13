import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

import { VentaMensual } from '../models/venta-mensual.model';

@Injectable({
  providedIn: 'root'
})
export class VentasMensualesService {

  private jsonUrl = 'assets/data/ventas-mensuales.json';
  private storageKey = 'ventasMensuales';

  constructor(private http: HttpClient) {}

  obtenerVentas(): Observable<VentaMensual[]> {
    const ventasGuardadas = localStorage.getItem(this.storageKey);

    if (ventasGuardadas) {
      return of(JSON.parse(ventasGuardadas));
    }

    return this.http.get<VentaMensual[]>(this.jsonUrl).pipe(
      tap(ventas => {
        localStorage.setItem(this.storageKey, JSON.stringify(ventas));
      })
    );
  }

  guardarVentas(ventas: VentaMensual[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(ventas));
  }

  limpiarDatosLocales(): void {
    localStorage.removeItem(this.storageKey);
  }
}