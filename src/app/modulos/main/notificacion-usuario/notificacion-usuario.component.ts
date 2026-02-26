import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Notificacion } from '../../notificacion/modelos/notificacion.interFace';
import { firstValueFrom } from 'rxjs';
import { NotificacionApiService } from 'src/app/modulos/notificacion/servicios/notificacion_api.service';
import { SharedService } from '../notificacion-usuario/servicios/shared.service';

@Component({
  selector: 'app-notificacion-usuario',
  templateUrl: './notificacion-usuario.component.html',
  styleUrl: './notificacion-usuario.component.scss'
})
export class NotificacionUsuarioComponent implements OnInit {
  notificacion: Notificacion;
  idUsuario: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { notificacion: Notificacion, idUsuario: string },
    private dialogReference: MatDialogRef<NotificacionUsuarioComponent>,
    private readonly notificacionService: NotificacionApiService,
    private sharedService: SharedService
  ) {
    this.notificacion = data.notificacion;
    this.idUsuario = data.idUsuario;

  }

  async notificacionVista(notificacion: Notificacion) {
    const idRol = notificacion.idRolANotificar ?? '';;
    const idUsuario = this.idUsuario
    const idnotificacion = notificacion.idnotificacion ?? '';
    try {
      if (!idnotificacion) {
        console.error('Los valores de idRolANotificar o idUsuario no son válidos.');
        return;
      }
      const data = await firstValueFrom(this.notificacionService.actualizarEstadoNotificacion(idnotificacion, "si"));
      const { status, message } = data;
      if (status) {
        const data = await firstValueFrom(this.notificacionService.obtenerNotificacionPorIdUsuarioEidRol(idRol, idUsuario));
        const { status, message, total, result } = data;

        if (status) {
          this.sharedService.updateNumeroNotificacion(total);
          this.sharedService.updateNotificacion(result);
          this.dialogReference.close();
        } else {
          alert(message)
        }
      }
    } catch (error) {

    }
  }

  async ngOnInit() {


  }

}
