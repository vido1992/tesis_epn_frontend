import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificacionApiService } from 'src/app/modulos/notificacion/servicios/notificacion_api.service';
import { firstValueFrom } from 'rxjs';
import { Actividad } from '../../../actividades/modelos/actividad.interface';

import Swal from "sweetalert2";
@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrl: './reporte.component.scss'
})
export class ReporteComponent implements OnInit {
  idDocente: string = '';
  actividades: Actividad[] = [];
  constructor(
    private route: ActivatedRoute,
    private readonly notificacionService: NotificacionApiService,
  ) { }

  ngOnInit(): void {
    this.idDocente = this.route.snapshot.paramMap.get('id') || '';
    console.log("ID del docente:", this.idDocente);
    this.reportes()
  }

  async reportes() {
    const data = await firstValueFrom(this.notificacionService.reporte());
    const { status, message  } = data;
    if(status){
      console.log(data.result);
      
      const actividadRes: Actividad[] = data.result;
      this.actividades = actividadRes;
      console.log(this.actividades);
      
      Swal.fire({
        title: 'Se ha consultado reporte. ' +message,
        icon: 'success'
      }) 
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Error  ',
        text: 'Error'
      })
    }
    console.log(data);
    
  }

}
