import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacionesRoutingModule } from './notificacion-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { ActividadesModule } from '../actividades/actividades.module';
import { VisualizarUsuarioComponent } from './componentes/visualizar-usuario/visualizar-usuario.component';
import { CrearNotificacionComponent } from './componentes/crear-notificacion/crear-notificacion.component';
import { UnaNotificacionComponent } from './componentes/una-notificacion/una-notificacion.component';
import { ReporteComponent } from './componentes/reporte/reporte.component';

@NgModule({
    declarations: [
        VisualizarUsuarioComponent,
        CrearNotificacionComponent,
        UnaNotificacionComponent,
        ReporteComponent
      ],
    imports: [
        CommonModule,
        NotificacionesRoutingModule,
        MatGridListModule,
        MatSelectModule,
        MatDialogModule,
        FormsModule,
        ReactiveFormsModule,
        MatTableModule,
        MatButtonModule,
        MatInputModule,
        MatCheckboxModule,
        MatCardModule,
        MatPaginatorModule,
        MatIconModule,
        MatSortModule,
        MatTooltipModule,
        ActividadesModule
    ]
})
export class NotificacionModule { }