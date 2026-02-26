import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { UsuarioStorageService } from 'src/app/servicios/auth/usuario-storage.service';
import { NotificacionApiService } from 'src/app/modulos/notificacion/servicios/notificacion_api.service';
import { Usuario } from 'src/app/modulos/notificacion/modelos/usuario.interFace'
import { RolesEnum } from 'src/app/servicios/auth/enum/roles.enum';
import { CrearNotificacionComponent } from '../crear-notificacion/crear-notificacion.component';
import { UnaNotificacionComponent } from '../una-notificacion/una-notificacion.component';
import { Notificacion } from '../../modelos/notificacion.interFace';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-visualizar-usuario',
  templateUrl: './visualizar-usuario.component.html',
  styleUrl: './visualizar-usuario.component.scss'
})
export class VisualizarUsuarioComponent implements OnInit {


  constructor(
    private readonly usuarioService: UsuarioStorageService,
    private readonly notificacionService: NotificacionApiService,
    private readonly router: Router,
    private readonly dialog: MatDialog,

  ) { }

  usuariosExistentes: Usuario[] = [];
  filtro?: FormControl;

  datosFilaUsuario = new MatTableDataSource<Usuario>([]);

  displayedColumns: string[] = ['usuariocorreo', 'rolusuario', 'acciones'];
  @ViewChild('tablaSort') tablaSort = new MatSort();
  @ViewChild(MatPaginator) paginador?: MatPaginator;
  rutaActual = this.router.url;

  ngOnInit(): void {
    this.cargarRegistros();
  }

  filtrarTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosFilaUsuario.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit(): void {
    this.datosFilaUsuario.sort = this.tablaSort;
    this.datosFilaUsuario.paginator = this.paginador!;
  }

  abrirCreacionNotificacion() {
    const dialogRef = this.dialog.open(CrearNotificacionComponent, {
      width: 'auto',
      height: 'auto',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.cargarRegistros();
    });
  }

  cargarRegistros() {
    Swal.showLoading();
    this.notificacionService.visualizarUsuarios()
      .subscribe({
        next: (data) => {
          const usuario = data as Usuario[];
          this.usuariosExistentes = usuario;
        },
        error: () => {
          Swal.fire({
            title: 'Error',
            text: 'No se pudieron obtener los registros.',
            showCancelButton: true,
            confirmButtonText: 'Reiniciar página',
            cancelButtonText: 'Cerrar',
            icon: 'error',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.reload();
            }
          });
        },
        complete: () => {
          this.datosFilaUsuario.data = this.usuariosExistentes;
          Swal.close();
        }
      });
  }

  abrirUnaNotificacion(usuario: Usuario) {
    const dialogRef = this.dialog.open(UnaNotificacionComponent, {
      width: '30%',
      height: 'auto',
      data: usuario,
    });
    dialogRef.afterClosed().subscribe(() => {
      this.cargarRegistros();
    });
  }

  //Verificaciòn de rol
  esCoordinador() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.COORDINADOR);
  }

  esAsistenteAcademico() {
    return this.usuarioService.obtenerRoles().includes(RolesEnum.ASISTENTE_ACADEMICO);
  }
  async resumenProgramacionNotificacion() {
    const resultados: { status: boolean, message: string }[] = [];
    const dominio = window.location.hostname;
    const rolesIds = [
      '6cfe01b8-2cb4-403a-8741-fcd6862f0e67',
      '5ae36e86-c817-4f56-a999-81c9a9959f0b',
      'bef4529f-d39c-447a-ad2a-ded632d3dc5a',
      '49fdcccd-3ff4-4c95-add2-541e909c2b00'
    ]

    let mensaje = `Su programa academico lo puede visualizar en el siguiente enlace:<br>
    <a href="/#/spa/notificaciones/programacion-academica">LINK</a>`;

    for (const element of rolesIds) {
      const nuevaNotificacion: Notificacion = {
        mensaje: mensaje,
        fechaNotificacion: new Date().toISOString(),
        idRolANotificar: element
      };
      try {
        const data = await firstValueFrom(this.notificacionService.crearNotifficacionMasiva(nuevaNotificacion));
        const { status, message, result } = data;
        resultados.push({
          status,
          message,
        });
      } catch (error) {
        resultados.push({
          status: false,
          message: `Error al crear la notificación: ${error}`,
        });
      }
    }
    let estado='', msj='';
    resultados.forEach((resultado) => {
      estado+=' '+resultado.status 
      msj+='<br>'+resultado.message
    });
    Swal.fire(
      'Notificación',
      `${msj}`,
      'success'
    ).then(() => {});
  }


}
