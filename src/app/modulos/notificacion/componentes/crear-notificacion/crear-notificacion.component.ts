import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { NotificacionApiService } from 'src/app/modulos/notificacion/servicios/notificacion_api.service';
import Swal from 'sweetalert2';
import { UsuarioStorageService } from 'src/app/servicios/auth/usuario-storage.service';
import { Rol } from '../../modelos/rol.interFace';
import { Notificacion } from '../../modelos/notificacion.interFace';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-crear-notificacion',
  templateUrl: './crear-notificacion.component.html',
  styleUrl: './crear-notificacion.component.scss'
})


export class CrearNotificacionComponent implements OnInit {
  roles: Rol[] = []
  rolSeleccionado?: string | Rol 
  formularioNotificacion: FormGroup = new FormGroup({});

  constructor(
    private readonly usuarioService: UsuarioStorageService,
    private readonly notificacionService: NotificacionApiService,
    private readonly formBuilder: FormBuilder,
    private dialogReference: MatDialogRef<CrearNotificacionComponent>
  ) { 

  }

  async ngOnInit() {
    this.configurarFormulario();
    this.notificacionService.visualizarRoles().subscribe(
      data => {
        this.roles = data;
      },
      error => {
        console.error('Error al obtener los roles:', error);
      }
    )
    
  }
 
  configurarFormulario() {
    this.formularioNotificacion = this.formBuilder.group({
     
      rol: new FormControl(
        { value: '', disabled: false },
        [
          Validators.required
        ]
      ),
      mensajeNotificacion: new FormControl(
        { value: '', disabled: false },
        [
          Validators.required
        ]
      )
    });

  }


  async enviarNotificacion() {   
   
    if (this.formularioNotificacion) { 
      const nuevaNotificacion: Notificacion = {
        mensaje: this.formularioNotificacion.get('mensajeNotificacion')?.value,
        fechaNotificacion: new Date().toISOString(),
        idRolANotificar: this.formularioNotificacion.get('rol')?.value
      };
          
      try {
        const data = await firstValueFrom(this.notificacionService.crearNotifficacionMasiva(nuevaNotificacion));
        
        const { status, message, result } = data;
        
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

  async seleccionarRol() {
    if (this.rolSeleccionado === 'TODOS') {
      console.log('Rol seleccionado T: TODOS');
    } else {
      console.log('Rol seleccionado:', this.rolSeleccionado);
    }

  }

  cancelar(): void {
    this.dialogReference.close();
  }
}
