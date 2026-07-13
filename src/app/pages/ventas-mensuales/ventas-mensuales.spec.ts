import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentasMensuales } from './ventas-mensuales';

describe('VentasMensuales', () => {
  let component: VentasMensuales;
  let fixture: ComponentFixture<VentasMensuales>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentasMensuales],
    }).compileComponents();

    fixture = TestBed.createComponent(VentasMensuales);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
