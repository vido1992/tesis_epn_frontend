import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notificacion } from '../../../notificacion/modelos/notificacion.interFace';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private numeroNotificacionSource = new BehaviorSubject<number>(0);  // Valor inicial
  currentNumeroNotificacion = this.numeroNotificacionSource.asObservable();

  private notificacionSource = new BehaviorSubject<Notificacion | null>(null); 
  currentNotificacion = this.notificacionSource.asObservable();

  constructor() {}

  // Método para actualizar el número de notificaciones
  updateNumeroNotificacion(value: number) {   
    this.numeroNotificacionSource.next(value);
  }

  // Método para obtener el valor de la notificación usando promesas
  async getNumeroNotificacion(): Promise<number> {
    return new Promise(resolve => {
      this.currentNumeroNotificacion.subscribe(value => {
        resolve(value);
      });
    });
  }

  updateNotificacion(notificacion: Notificacion): void {   
    this.notificacionSource.next(notificacion);
  }
  
  async getNotificacion(): Promise<Notificacion | null> {
    return new Promise((resolve) => {
      this.currentNotificacion.subscribe(notificacion => resolve(notificacion));
    });
  }
}
