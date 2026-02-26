import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import { NotificacionApiService } from 'src/app/modulos/notificacion/servicios/notificacion_api.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsuarioStorageService } from 'src/app/servicios/auth/usuario-storage.service';
import { Notificacion } from '../../modelos/notificacion.interFace';

@Component({
  selector: 'app-una-notificacion',
  templateUrl: './una-notificacion.component.html',
  styleUrl: './una-notificacion.component.scss'
})
export class UnaNotificacionComponent implements OnInit {
  formularioUnaNotificacion: FormGroup;
  idUsuario: string;
  correoUsuario: string;
  idRolUsuario: string;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly usuarioService: UsuarioStorageService,
    private readonly notificacionService: NotificacionApiService,
    private readonly formBuilder: FormBuilder,
    private dialogReference: MatDialogRef<UnaNotificacionComponent>,

  ) {
    // Inicializamos el formulario en el constructor
    this.formularioUnaNotificacion = this.formBuilder.group({
      mensajeUnaNotificacion: ['', [Validators.required, Validators.minLength(5)]]
    });

    this.idUsuario = data.usuarioid;
    this.correoUsuario = data.usuariocorreo;
    this.idRolUsuario=data.idrol;
  }


  async ngOnInit() {

  }



  async unaNotificar() {
    if (this.formularioUnaNotificacion) {
      const nuevaNotificacion: Notificacion = {
        idUsuario: this.idUsuario,
        mensaje: this.formularioUnaNotificacion.get('mensajeUnaNotificacion')?.value,
        fechaNotificacion: new Date().toISOString(),
        idRolANotificar: this.idRolUsuario
      };
      try {
        const data = await firstValueFrom(this.notificacionService.unaNotificacion(this.idUsuario, nuevaNotificacion));
        const { status, message, result } = data;
        console.log(data);
        
        if (status) { 
          Swal.fire(
            'Notificación',
            `${message}`,
            'success'
          ).then(() => {
            this.dialogReference.close();
          });
        } else { 
          Swal.fire(
            'Error en Notificación',
            `${message}`,
            'error'
          ).then(() => {
            this.dialogReference.close();
          });
        }
      } catch (error) {
        console.error('Error:', error);
        Swal.fire(
          'Upss, Error en Notificación y en servidor',
          `${error}`,
          'error'
        ).then(() => {
          this.dialogReference.close();
        });
      }
    }
  }


  configurarFormulario() {
    this.formularioUnaNotificacion = this.formBuilder.group({

      mensajeUnaNotificacion: new FormControl(
        { value: '', disabled: false },
        [
          Validators.required
        ]
      )
    });

  }


  cancelar(): void {
    this.dialogReference.close();
  }


}
