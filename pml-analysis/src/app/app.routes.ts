import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DownloadDataComponent } from './pages/download-data/download-data.component';
import { ErrorLogsComponent } from './pages/error-logs/error-logs.component';
import { ExportDataComponent } from './pages/export-data/export-data.component';
import { NodesComponent } from './pages/nodes/nodes.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';


/**
 * Rutas de la aplicación (Login - Panel)
 */
const APP_ROUTES: Routes = [
  { path: '',  component: NotFoundComponent},
  { path: '**',  component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(APP_ROUTES, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
