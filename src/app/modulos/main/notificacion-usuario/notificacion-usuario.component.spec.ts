import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificacionUsuarioComponent } from './notificacion-usuario.component';

describe('NotificacionUsuarioComponent', () => {
  let component: NotificacionUsuarioComponent;
  let fixture: ComponentFixture<NotificacionUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificacionUsuarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NotificacionUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
