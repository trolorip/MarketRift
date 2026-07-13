export interface VentaMensual {
  id: number;
  cartaId?: number;
  mes: string;
  mesNumero: number;
  anio: number;
  producto: string;
  categoria: string;
  unidades: number;
  total: number;
}