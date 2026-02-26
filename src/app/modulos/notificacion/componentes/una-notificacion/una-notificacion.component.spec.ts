import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnaNotificacionComponent } from './una-notificacion.component';

describe('UnaNotificacionComponent', () => {
  let component: UnaNotificacionComponent;
  let fixture: ComponentFixture<UnaNotificacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnaNotificacionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnaNotificacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
