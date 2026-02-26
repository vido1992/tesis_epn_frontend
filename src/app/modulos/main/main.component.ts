import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RolesEnum } from 'src/app/servicios/auth/enum/roles.enum';
import { Usuario } from 'src/app/servicios/auth/models/usuario.model';
import { TokenStorageService } from 'src/app/servicios/auth/token-storage.service';
import { UsuarioStorageService } from 'src/app/servicios/auth/usuario-storage.service';
import Swal from 'sweetalert2';
import { NotificacionApiService } from 'src/app/modulos/notificacion/servicios/notificacion_api.service';
import { MatTableDataSource } from '@angular/material/table';
import { firstValueFrom } from 'rxjs';
import { Notificacion } from '../notificacion/modelos/notificacion.interFace';
import { NotificacionUsuarioComponent } from '../main/notificacion-usuario/notificacion-usuario.component';
import { MatDialog } from '@angular/material/dialog';
import { SharedService } from './notificacion-usuario/servicios/shared.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  usuario?: Usuario;
  mostrarMenuAcciones: boolean = true;
  cantidadNotificaciones: number = 0;
  datosFilaNotificacion = new MatTableDataSource<Notificacion>([]);

  constructor(
    private readonly notificacionService: NotificacionApiService,
    private readonly dialog: MatDialog,
    private sharedService: SharedService,
    private readonly tokenService: TokenStorageService,
    private readonly usuarioService: UsuarioStorageService,
    private readonly router: Router,
  ) { }


   ngOnInit(){
    this.usuario = this.usuarioService.obtenerUsuario();
    this.obtenerCantidadNotificaciones();

    this.sharedService.currentNumeroNotificacion.subscribe((value) => {
      this.cantidadNotificaciones = value;
    });
    
    this.sharedService.currentNotificacion.subscribe((notificacion) => {   
      if (notificacion) {
        const datosConvertidos: Notificacion[] = Object.values(notificacion);
        this.datosFilaNotificacion.data = datosConvertidos;
      } else {
        this.datosFilaNotificacion.data = [];
      }
    });
    
  }

  async obtenerCantidadNotificaciones() {
    try {
      const idrol = sessionStorage.getItem('idRol') ?? 'defaultIdRol'; 
      const idUsuario = sessionStorage.getItem('idUsuario') ?? 'defaultIdUsuario'; 

      const data = await firstValueFrom(this.notificacionService.obtenerNotificacionPorIdUsuarioEidRol(idrol, idUsuario));
      const { status, message, total, result } = data;

      if (status) {
        this.cantidadNotificaciones = total
        const datosConvertidos: Notificacion[] = Object.values(result);
        this.datosFilaNotificacion.data = datosConvertidos;
      } else {
        alert(message)
      }
    } catch (error) {
      alert(error)
    }
  }

  abrirnotificacion(notificacion:Notificacion){
    const idUsuario = sessionStorage.getItem('idUsuario') ?? 'defaultIdUsuario';
    const dialogRef = this.dialog.open(NotificacionUsuarioComponent, {
      width: '30%',
      height: 'auto',
      disableClose: true,
      data: {
        notificacion: notificacion,
        idUsuario: idUsuario
      },
    });    
  }

  cerrarSesion() {
    this.tokenService.cerrarSesion();

    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: false,
    })

    this.router.navigate(['/login']);

    toast.fire({
      icon: 'info',
      title: 'Hasta luego'
    });
  }

  toogleMenuAcciones() {
    this.mostrarMenuAcciones = !this.mostrarMenuAcciones;
  }

  mostrarRutaActiva(ruta: string) {
    const rutaActual = this.router.url;
    return (rutaActual.includes(ruta)) ? 'active' : '';
  }

  esCoordinador() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.COORDINADOR);
  }

  esAsistenteAcademico() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.ASISTENTE_ACADEMICO);
  }

  esDocente() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.DOCENTE);
  }

  esSubdecano() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.SUBDECANO);
  }

  esGestorEspaciosFisicos() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.GESTOR_ESPACIOS_FISICOS);
  }

  esJefeDeDepartamento() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.JEFE_DE_DEPARTAMENTO);
  }

  visto() {
    console.log('vista notificacion');

  }
}
