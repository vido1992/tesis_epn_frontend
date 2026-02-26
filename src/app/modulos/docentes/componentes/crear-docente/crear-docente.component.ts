import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

import Swal from 'sweetalert2';
import { Docente } from '../../modelos/docente.interface';
import { DocenteApiService } from '../../servicios/docentes_api.service';
import { NotificacionApiService } from 'src/app/modulos/notificacion/servicios/notificacion_api.service';
import { Notificacion } from '../../../notificacion/modelos/notificacion.interFace';
@Component({
  selector: 'app-crear-docente',
  templateUrl: './crear-docente.component.html',
  styleUrls: ['./crear-docente.component.scss']
})
export class CrearDocenteComponent implements OnInit {

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly docenteService: DocenteApiService,
    private dialogReference: MatDialogRef<CrearDocenteComponent>,
    private readonly notificacionService: NotificacionApiService,
  ) { }

  formGroup?: FormGroup;
  cargando: boolean = false;
  formateoNombre?: string;

  ngOnInit(): void {
    this.configurarFormulario();
  }

  // Colocar el nombre con mayúsculas
  formatearTexto(event: Event) {
    const lectura = (event.target as HTMLInputElement).value;
    if (this.formateoNombre != lectura) {
      this.formateoNombre = lectura.toUpperCase();
      this.formGroup?.get('nombreCompleto')?.setValue(this.formateoNombre);
    }
  }


  crearUnDocente() {
    if (this.formGroup) {
      if (this.formGroup.valid && !this.cargando) {
        Swal.showLoading();
        this.cargando = true;
        // Obtener valores
        const nuevoDocente: Docente = {
          nombreCompleto: this.formGroup.get('nombreCompleto')?.value,
          correoElectronico: this.formGroup.get('correoElectronico')?.value + "@epn.edu.ec"
        };
        this.docenteService.crearUnDocente(nuevoDocente)
          .subscribe({
            next: (result: any) => {
              const substring = String(result.mensaje);
              if (substring.substr(0, 1) == "S") {
                
                const nuevaNotificacion: Notificacion = {
                  mensaje: "Se ha creado un nuevo docente",
                  fechaNotificacion: new Date().toISOString(),
                  idRolANotificar: "todos"
                };
                this.notificacionService.crearNotifficacionMasiva(nuevaNotificacion).subscribe({
                  next: (result: any) => {
                    console.log("Notificación masiva enviada con éxito:", result);
                  },
                  error: (err: any) => {
                    console.error("Error al enviar la notificación masiva:", err);
                  },
                  complete: () => {
                    console.log("El envío de la notificación masiva ha finalizado.");
                  }
                });

                Swal.fire(
                  'Registro creado',
                  `${result.mensaje}`,
                  'success'
                ).then(() => {
                  this.dialogReference.close();
                });
              } else {
                Swal.fire(
                  'Registro duplicado',
                  `${result.mensaje}`,
                  'info'
                )
              }
            },
            error: (result: any) => {
              Swal.fire(
                'Error',
                `${result.error.message}`,
                'error'
              );
              this.cargando = false;
            }
          });
      }
    }
  }

  configurarFormulario() {
    this.formGroup = this.formBuilder.group({
      nombreCompleto: new FormControl(
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(70),
          Validators.pattern('^[A-ZÁÉÍÓÚÜÑ ]*$'),
        ]
      ),
      correoElectronico: new FormControl(
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.pattern('^[a-z]+[.][a-z]+[0-9]*$'),
        ]
      )
    });
  }

  cancelar(): void {
    this.dialogReference.close();
  }

}
