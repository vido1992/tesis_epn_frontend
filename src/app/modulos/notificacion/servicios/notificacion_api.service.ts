import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from 'src/environments/environment';
import { Notificacion } from '../modelos/notificacion.interFace';
import { ApiResponse } from '../modelos/apiResponse.interFace';
import { Rol } from '../modelos/rol.interFace';
import { Observable } from "rxjs";
import { Actividad } from '../../actividades/modelos/actividad.interface';

@Injectable({
    providedIn: 'root'
})

export class NotificacionApiService {
    constructor(
        private readonly httpCliente: HttpClient,
    ) { }

    ruta = '/usuarios';
       
    visualizarUsuarios() {
        const url = apiUrl + `${this.ruta}/usuariosConRoles`;
        return this.httpCliente.get(url);
    }

    visualizarRoles(): Observable<Rol[]> {
        return this.httpCliente.get<Rol[]>(apiUrl+'/rol/obtenerRoles');
    }

    crearNotifficacionMasiva(notificacion: Notificacion):Observable<ApiResponse<Notificacion>>{
        const url = apiUrl + '/notificacion/crearNotificacion';
        return this.httpCliente.post<ApiResponse<Notificacion>>(url, notificacion);
    }

    unaNotificacion(id:string,notificacion: Notificacion):Observable<ApiResponse<Notificacion>>{
        const url = apiUrl + `/notificacion/unaNotificacion/${id}`
        return this.httpCliente.post<ApiResponse<Notificacion>>(url, notificacion);
    }

    obtenerNotificaciones():Observable<ApiResponse<Notificacion>>{
        const url = apiUrl + `/notificacion/obtenerNotificaciones`
        return this.httpCliente.get<ApiResponse<Notificacion>>(url);
    }

    obtenerNotificacionPorIdUsuarioEidRol(idrol:string,idusuario:string):Observable<ApiResponse<Notificacion>>{
        const url = apiUrl + `/notificacion/obtenerNotificacionesPorUsuarioyRol/${idrol}/${idusuario}`        
        return this.httpCliente.get<ApiResponse<Notificacion>>(url);
    }

    actualizarEstadoNotificacion(idnotificacion: string, visto:string) {
        const url = `${apiUrl}/notificacion/actualizarEstadoNotificacion/${idnotificacion}`;
        const body = { visto };
        return this.httpCliente.put<ApiResponse<{ status: boolean; message: string }>>(url,body);
    }

    actividadesNotificacion(idactividad: string) {
        const url = `${apiUrl}/notificacion/notificarPorActividad/${idactividad}`;
        return this.httpCliente.post<ApiResponse<{ status: boolean; message: string }>>(url, {});
    }
    reporte() {
        const url = `${apiUrl}/notificacion/programacion-academica`;
        return this.httpCliente.get<ApiResponse<Actividad[]>>(url, {});
    }
}