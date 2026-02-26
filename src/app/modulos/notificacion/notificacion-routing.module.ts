import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisualizarUsuarioComponent } from './componentes/visualizar-usuario/visualizar-usuario.component';
import { ReporteComponent } from './componentes/reporte/reporte.component';

const routes: Routes = [
    {
        path: '',
        component: VisualizarUsuarioComponent
    },
    {
        path: 'programacion-academica',
        component: ReporteComponent
      },
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full',
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotificacionesRoutingModule { }
