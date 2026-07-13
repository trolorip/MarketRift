import { Routes } from '@angular/router';
import { Recuperar } from './pages/recuperar/recuperar';
import { Login } from './pages/login/login';
import { Registro } from './pages/registro/registro';
import { Catalogo } from './pages/catalogo/catalogo';
import { Carrito } from './pages/carrito/carrito';
import { Perfil } from './pages/perfil/perfil';
import { Admin } from './pages/admin/admin';
import { DetalleCarta } from './pages/detalle-carta/detalle-carta';
import { VentasMensuales } from './pages/ventas-mensuales/ventas-mensuales';

export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'recuperar', component: Recuperar },
  { path: 'login', component: Login },
  { path: 'registro', component: Registro },
  { path: 'catalogo', component: Catalogo },
  { path: 'carrito', component: Carrito },
  { path: 'perfil', component: Perfil },
  { path: 'admin', component: Admin },
  { path: 'detalle/:id', component: DetalleCarta },
  { path: 'ventas-mensuales', component: VentasMensuales },

  { path: '**', redirectTo: 'login' }

];